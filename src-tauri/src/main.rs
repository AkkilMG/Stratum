#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use base64::{engine::general_purpose::STANDARD as B64, Engine};
use notify::{RecursiveMode, Watcher};
use rusqlite::{params, Connection};
use serde::Serialize;
use serde_json::{json, Value};
use std::{collections::{BTreeMap, HashSet}, fs, io::Cursor, path::{Path, PathBuf}, process::{Command, Stdio}, sync::{atomic::{AtomicU64, Ordering}, mpsc, Mutex, OnceLock}, thread, time::{Duration, Instant, UNIX_EPOCH}};
use tauri::{AppHandle, Emitter, Manager, State};
use walkdir::WalkDir;
#[cfg(windows)]
use std::os::windows::process::CommandExt;

type R<T> = Result<T, String>;
fn e<E: ToString>(x: E) -> String { x.to_string() }
const OLLAMA: &str = "http://localhost:11434";
static CACHE: OnceLock<PathBuf> = OnceLock::new();
static AUTHOR: Mutex<String> = Mutex::new(String::new());
static GEN: AtomicU64 = AtomicU64::new(0);
static GIT_LOCK: Mutex<()> = Mutex::new(());

/// Index + thumbnails live on THIS machine (never on a NAS: SQLite over SMB/NFS can corrupt).
fn cache(root: &Path) -> PathBuf {
    let mut h: u64 = 0xcbf29ce484222325;
    for b in root.to_string_lossy().bytes() { h ^= b as u64; h = h.wrapping_mul(0x100000001b3); }
    CACHE.get().cloned().unwrap_or_else(|| std::env::temp_dir().join("stratum")).join(format!("{h:016x}"))
}
fn author() -> String {
    let a = AUTHOR.lock().map(|g| (*g).clone()).unwrap_or_default();
    if a.is_empty() { "Stratum".into() } else { a }
}
#[cfg(windows)]
fn is_network(p: &Path) -> bool {
    use std::os::windows::ffi::OsStrExt;
    let s = p.to_string_lossy().to_string();
    if s.starts_with("\\\\?\\UNC") || (s.starts_with("\\\\") && !s.starts_with("\\\\?\\")) { return true; }
    let t = s.trim_start_matches("\\\\?\\");
    if t.len() < 2 || t.as_bytes()[1] != b':' { return false; }
    let root = format!("{}\\", &t[..2]);
    let w: Vec<u16> = std::ffi::OsStr::new(&root).encode_wide().chain(Some(0)).collect();
    unsafe { windows_sys::Win32::Storage::FileSystem::GetDriveTypeW(w.as_ptr()) == 4 }
}
#[cfg(not(windows))]
fn is_network(p: &Path) -> bool {
    let m = fs::read_to_string("/proc/mounts").unwrap_or_default();
    let p = p.to_string_lossy().to_string();
    let mut best = (String::new(), false);
    for l in m.lines() {
        let f: Vec<&str> = l.split_whitespace().collect();
        if f.len() > 2 && p.starts_with(f[1]) && f[1].len() >= best.0.len() {
            best = (f[1].to_string(), ["nfs", "nfs4", "cifs", "smb3", "smbfs", "fuse.sshfs", "9p"].contains(&f[2]));
        }
    }
    best.1
}
/// Tags are shared with teammates through a small file that travels with the repository.
fn read_tags(root: &Path) -> BTreeMap<String, String> {
    fs::read_to_string(root.join(".stratum-tags.json")).ok().and_then(|s| serde_json::from_str(&s).ok()).unwrap_or_default()
}
fn export_tags(root: &Path) {
    if let Ok(c) = db(root) {
        if let Ok(mut s) = c.prepare("SELECT path,tags FROM assets WHERE tags!=''") {
            let m: BTreeMap<String, String> = s.query_map([], |r| Ok((r.get(0)?, r.get(1)?))).map(|x| x.flatten().collect()).unwrap_or_default();
            let _ = fs::write(root.join(".stratum-tags.json"), serde_json::to_string_pretty(&m).unwrap_or_default());
        }
    }
}
/// git with a hard timeout, no credential prompts: a dead NAS or VPN can never hang the app.
fn git_t(root: &Path, args: &[&str], secs: u64) -> (bool, String) {
    let mut c = Command::new("git");
    c.current_dir(root).args(["-c", "safe.directory=*"]).args(args)
        .env("GIT_TERMINAL_PROMPT", "0").env("GIT_SSH_COMMAND", "ssh -o BatchMode=yes -o ConnectTimeout=10")
        .stdout(Stdio::piped()).stderr(Stdio::piped());
    #[cfg(windows)]
    c.creation_flags(0x08000000);
    let mut ch = match c.spawn() { Ok(x) => x, Err(x) => return (false, x.to_string()) };
    let start = Instant::now();
    loop {
        match ch.try_wait() {
            Ok(Some(_)) => break,
            Ok(None) => {
                if start.elapsed().as_secs() > secs { let _ = ch.kill(); return (false, "E:timeout".into()); }
                thread::sleep(Duration::from_millis(100));
            }
            Err(x) => return (false, x.to_string()),
        }
    }
    match ch.wait_with_output() {
        Ok(o) => (o.status.success(), format!("{}{}", String::from_utf8_lossy(&o.stdout), String::from_utf8_lossy(&o.stderr)).trim().to_string()),
        Err(x) => (false, x.to_string()),
    }
}
fn emit_sync(app: &AppHandle, res: &R<String>) {
    let at = std::time::SystemTime::now().duration_since(UNIX_EPOCH).map(|d| d.as_secs()).unwrap_or(0);
    let msg = match res { Ok(m) => m.clone(), Err(m) => m.clone() };
    let _ = app.emit("sync-state", json!({"ok": res.is_ok(), "msg": msg, "at": at}));
}


#[derive(Default)]
struct Vault { root: Mutex<Option<PathBuf>>, watcher: Mutex<Option<Box<dyn Watcher + Send>>> }
fn root(s: &State<'_, Vault>) -> R<PathBuf> { s.root.lock().unwrap().clone().ok_or_else(|| "E:no_space".to_string()) }

#[derive(Serialize)]
struct Asset { path: String, name: String, kind: String, size: i64, mtime: i64, tags: String, tagged: bool }
#[derive(Serialize)]
struct Stats { assets: i64, bytes: i64, tagged: i64, commits: i64, by_kind: Vec<(String, i64)>, ollama: bool, lfs: bool, remote: String, ahead: i64, network: bool }
#[derive(Serialize)]
struct Commit { hash: String, author: String, when: String, msg: String }

// ---------- helpers ----------
fn git(root: &Path, args: &[&str]) -> Vec<u8> {
    let mut c = Command::new("git");
    c.current_dir(root).args(["-c", "safe.directory=*"]).args(args).env("GIT_TERMINAL_PROMPT", "0");
    #[cfg(windows)]
    c.creation_flags(0x08000000);
    c.output().map(|o| o.stdout).unwrap_or_default()
}
fn db(root: &Path) -> R<Connection> {
    fs::create_dir_all(cache(root).join("thumbs")).map_err(e)?;
    let c = Connection::open(cache(root).join("index.db")).map_err(e)?;
    c.busy_timeout(Duration::from_secs(10)).map_err(e)?;
    c.execute_batch("PRAGMA journal_mode=WAL;PRAGMA synchronous=NORMAL;").map_err(e)?;
    c.execute_batch("CREATE TABLE IF NOT EXISTS assets(path TEXT PRIMARY KEY,name TEXT,kind TEXT,size INTEGER,mtime INTEGER,tags TEXT DEFAULT '',embedding TEXT,tagged INTEGER DEFAULT 0);").map_err(e)?;
    Ok(c)
}
fn kind(p: &Path) -> &'static str {
    match p.extension().map(|x| x.to_string_lossy().to_lowercase()).as_deref() {
        Some("png" | "jpg" | "jpeg" | "webp" | "gif" | "bmp" | "tga") => "Image",
        Some("svg") => "Vector",
        Some("psd" | "ai" | "fig" | "xcf" | "kra") => "Source",
        Some("fbx" | "obj" | "glb" | "gltf" | "blend") => "Model",
        Some("wav" | "mp3" | "ogg" | "flac") => "Audio",
        _ => "Other",
    }
}
fn tpath(root: &Path, rel: &str) -> PathBuf { cache(root).join("thumbs").join(rel.replace('/', "__") + ".jpg") }
fn data_uri(b: &[u8]) -> String { format!("data:image/jpeg;base64,{}", B64.encode(b)) }
fn cosine(a: &[f32], b: &[f32]) -> f32 {
    if a.len() != b.len() || a.is_empty() { return 0.0; }
    let (mut d, mut x, mut y) = (0.0f32, 0.0f32, 0.0f32);
    for i in 0..a.len() { d += a[i] * b[i]; x += a[i] * a[i]; y += b[i] * b[i]; }
    d / (x.sqrt() * y.sqrt()).max(1e-9)
}
fn row_asset(x: &rusqlite::Row) -> rusqlite::Result<Asset> {
    Ok(Asset { path: x.get(0)?, name: x.get(1)?, kind: x.get(2)?, size: x.get(3)?, mtime: x.get(4)?, tags: x.get(5)?, tagged: x.get::<_, i64>(6)? == 1 })
}
const COLS: &str = "path,name,kind,size,mtime,COALESCE(tags,''),tagged";

// ---------- git / index ----------
fn init_git(root: &Path, lfs: bool) {
    if !root.join(".git").exists() {
        if is_network(root) {
            // History stays on this PC; only the files live on the share.
            let g = cache(root).join("gitdir");
            let _ = fs::create_dir_all(&g);
            git(root, &["init", "-b", "main", &format!("--separate-git-dir={}", g.display())]);
        } else {
            git(root, &["init", "-b", "main"]);
        }
    }
    for (k, v) in [("core.autocrlf", "false"), ("core.longpaths", "true"), ("core.bigFileThreshold", "20m"), ("core.compression", "0")] {
        git(root, &["config", k, v]);
    }
    if !root.join(".gitignore").exists() { let _ = fs::write(root.join(".gitignore"), "*~\n*.tmp\n*.swp\nThumbs.db\n.DS_Store\n"); }
    if lfs && !git(root, &["lfs", "version"]).is_empty() && !root.join(".gitattributes").exists() {
        let mut s = String::new();
        for x in ["psd", "ai", "fig", "png", "jpg", "jpeg", "tga", "fbx", "blend", "glb", "wav"] {
            s += &format!("*.{x} filter=lfs diff=lfs merge=lfs -text\n");
        }
        let _ = fs::write(root.join(".gitattributes"), s);
        git(root, &["lfs", "install", "--local"]);
    }
}
fn commit_raw(root: &Path, msg: &str) {
    git(root, &["add", "-A"]);
    git(root, &["-c", &format!("user.name={}", author()), "-c", "user.email=stratum@local", "commit", "-m", msg]);
}
fn commit(root: &Path, msg: &str) {
    let _g = GIT_LOCK.lock().unwrap_or_else(|p| p.into_inner());
    commit_raw(root, msg);
}
fn thumb_make(root: &Path, rel: &str) {
    let l = rel.to_lowercase();
    if l.ends_with(".svg") { svg_thumb(root, rel); }
    else if l.ends_with(".psd") { psd_thumb(root, rel); }
    else if let Ok(i) = image::open(root.join(rel)) {
        let _ = image::DynamicImage::ImageRgb8(i.thumbnail(360, 360).to_rgb8()).save(tpath(root, rel));
    }
}
fn scan(root: &Path) -> R<()> {
    let c = db(root)?;
    let mut seen = HashSet::new();
    let meta = read_tags(root);
    let walker = WalkDir::new(root).into_iter().filter_entry(|d| {
        let n = d.file_name().to_string_lossy();
        n != ".git" && n != ".stratum" && !ignored(&n)
    });
    for ent in walker.flatten().filter(|d| d.file_type().is_file()) {
        let rel = ent.path().strip_prefix(root).map_err(e)?.to_string_lossy().replace('\\', "/");
        if rel == ".gitignore" || rel == ".gitattributes" || rel == ".stratum-tags.json" { continue; }
        let md = ent.metadata().map_err(e)?;
        let mt = md.modified().ok().and_then(|t| t.duration_since(UNIX_EPOCH).ok()).map(|d| d.as_secs() as i64).unwrap_or(0);
        let old: Option<i64> = c.query_row("SELECT mtime FROM assets WHERE path=?1", [&rel], |r| r.get(0)).ok();
        seen.insert(rel.clone());
        if old == Some(mt) { continue; }
        let k = kind(ent.path());
        c.execute(
            "INSERT INTO assets(path,name,kind,size,mtime,tags) VALUES(?1,?2,?3,?4,?5,?6) ON CONFLICT(path) DO UPDATE SET size=?4,mtime=?5,tagged=0,tags=CASE WHEN COALESCE(tags,'')='' THEN ?6 ELSE tags END",
            params![rel, ent.file_name().to_string_lossy().to_string(), k, md.len() as i64, mt, meta.get(&rel).cloned().unwrap_or_default()],
        ).map_err(e)?;
        if matches!(k, "Image" | "Vector") || rel.to_lowercase().ends_with(".psd") { thumb_make(root, &rel); }
    }
    let all: Vec<String> = c.prepare("SELECT path FROM assets").map_err(e)?.query_map([], |r| r.get(0)).map_err(e)?.flatten().collect();
    for p in all { if !seen.contains(&p) { c.execute("DELETE FROM assets WHERE path=?1", [&p]).map_err(e)?; } }
    for (p, t) in &meta { let _ = c.execute("UPDATE assets SET tags=?1,tagged=0 WHERE path=?2 AND COALESCE(tags,'')!=?1", params![t, p]); }
    Ok(())
}

// ---------- local AI (Ollama) ----------
fn embed(text: &str) -> Option<Vec<f32>> {
    let v: Value = ureq::post(&format!("{OLLAMA}/api/embed")).timeout(Duration::from_secs(30))
        .send_json(json!({"model": "nomic-embed-text", "input": text})).ok()?.into_json().ok()?;
    serde_json::from_value(v["embeddings"][0].clone()).ok()
}
fn vision_tags(abs: &Path) -> Option<String> {
    let b = B64.encode(fs::read(abs).ok()?);
    let v: Value = ureq::post(&format!("{OLLAMA}/api/generate")).timeout(Duration::from_secs(180)).send_json(json!({
        "model": "llava:7b", "stream": false, "images": [b],
        "prompt": "Return a comma-separated list of 5 descriptive tags for this game asset. No conversational text."
    })).ok()?.into_json().ok()?;
    Some(v["response"].as_str()?.trim().to_lowercase())
}
fn tag_pending(app: &AppHandle, root: &Path) {
    let Ok(c) = db(root) else { return };
    let rows: Vec<(String, String, String)> = match c.prepare("SELECT path,name,COALESCE(tags,'') FROM assets WHERE tagged=0") {
        Ok(mut s) => s.query_map([], |r| Ok((r.get(0)?, r.get(1)?, r.get(2)?))).map(|m| m.flatten().collect()).unwrap_or_default(),
        Err(_) => return,
    };
    for (p, n, k) in rows {
        let tags = if !k.is_empty() { k.clone() } else if tpath(root, &p).exists() {
            match vision_tags(&tpath(root, &p)) { Some(t) => t, None => return } // Ollama offline: retry on next change
        } else {
            Path::new(&n).file_stem().map(|s| s.to_string_lossy().replace(['_', '-'], ", ")).unwrap_or_default()
        };
        let Some(v) = embed(&format!("{n} {tags}")) else { return };
        let _ = c.execute("UPDATE assets SET tags=?1,embedding=?2,tagged=1 WHERE path=?3", params![tags, serde_json::to_string(&v).unwrap(), p]);
        let _ = app.emit("vault-changed", ());
    }
    export_tags(root);
}

// ---------- commands ----------
#[tauri::command]
async fn open_vault(path: String, lfs: bool, remote: Option<String>, app: AppHandle, st: State<'_, Vault>) -> R<()> {
    let r = PathBuf::from(&path);
    if !r.is_dir() { return Err("E:folder_missing".into()); }
    let probe = r.join(".stratum-write-test");
    fs::write(&probe, b"ok").map_err(|_| "E:not_writable".to_string())?;
    let _ = fs::remove_file(&probe);
    db(&r)?;
    init_git(&r, lfs);
    if let Some(u) = remote.filter(|u| !u.trim().is_empty()) {
        let has = git_out(&r, &["remote", "get-url", "origin"]).0;
        let _ = git_out(&r, &["remote", if has { "set-url" } else { "add" }, "origin", u.trim()]);
    }
    let generation = GEN.fetch_add(1, Ordering::SeqCst) + 1;
    *st.root.lock().unwrap() = Some(r.clone());
    let (tx, rx) = mpsc::channel::<()>();
    let handler = move |ev: notify::Result<notify::Event>| {
        if let Ok(ev) = ev {
            if ev.paths.iter().any(|p| !p.components().any(|c| c.as_os_str() == ".git") && !ignored(&p.file_name().map(|n| n.to_string_lossy().to_string()).unwrap_or_default())) {
                let _ = tx.send(());
            }
        }
    };
    // Network shares don't deliver change events reliably, so poll them.
    let mut w: Box<dyn Watcher + Send> = if is_network(&r) {
        Box::new(notify::PollWatcher::new(handler, notify::Config::default().with_poll_interval(Duration::from_secs(10))).map_err(e)?)
    } else {
        Box::new(notify::recommended_watcher(handler).map_err(e)?)
    };
    w.watch(&r, RecursiveMode::Recursive).map_err(e)?;
    *st.watcher.lock().unwrap() = Some(w);
    let (a, r1) = (app.clone(), r.clone());
    thread::spawn(move || loop {
        thread::sleep(Duration::from_secs(120));
        if GEN.load(Ordering::SeqCst) != generation { break; }
        if git_out(&r1, &["remote"]).1.is_empty() { continue; }
        let res = sync_inner(&r1);
        if res.is_ok() { let _ = scan(&r1); let _ = a.emit("vault-changed", ()); }
        emit_sync(&a, &res);
    });
    thread::spawn(move || {
        let _ = app.emit("busy", true);
        let _ = scan(&r);
        commit(&r, "Index vault");
        let _ = app.emit("vault-changed", ());
        let _ = app.emit("busy", false);
        if !git_out(&r, &["remote"]).1.is_empty() { let res = sync_inner(&r); emit_sync(&app, &res); }
        tag_pending(&app, &r);
        while rx.recv().is_ok() {
            thread::sleep(Duration::from_millis(1500));
            while rx.try_recv().is_ok() {}
            let _ = app.emit("busy", true);
            let _ = scan(&r);
            commit_auto(&r);
            let _ = app.emit("vault-changed", ());
            let _ = app.emit("busy", false);
            tag_pending(&app, &r);
        }
    });
    Ok(())
}
#[tauri::command]
async fn stats(st: State<'_, Vault>) -> R<Stats> {
    let r = root(&st)?;
    let c = db(&r)?;
    let (assets, bytes, tagged): (i64, i64, i64) = c.query_row(
        "SELECT COUNT(*),COALESCE(SUM(size),0),COALESCE(SUM(tagged),0) FROM assets", [], |x| Ok((x.get(0)?, x.get(1)?, x.get(2)?))).map_err(e)?;
    let by_kind: Vec<(String, i64)> = c.prepare("SELECT kind,SUM(size) FROM assets GROUP BY kind ORDER BY 2 DESC").map_err(e)?
        .query_map([], |x| Ok((x.get(0)?, x.get(1)?))).map_err(e)?.flatten().collect();
    let commits = String::from_utf8_lossy(&git(&r, &["rev-list", "--count", "HEAD"])).trim().parse().unwrap_or(0);
    let ollama = ureq::get(&format!("{OLLAMA}/api/tags")).timeout(Duration::from_millis(800)).call().is_ok();
    let lfs = !git(&r, &["lfs", "version"]).is_empty();
    let remote = String::from_utf8_lossy(&git(&r, &["remote", "get-url", "origin"])).trim().to_string();
    let br = String::from_utf8_lossy(&git(&r, &["rev-parse", "--abbrev-ref", "HEAD"])).trim().to_string();
    let ahead = if remote.is_empty() { 0 } else { String::from_utf8_lossy(&git(&r, &["rev-list", "--count", &format!("origin/{br}..HEAD")])).trim().parse().unwrap_or(commits) };
    Ok(Stats { assets, bytes, tagged, commits, by_kind, ollama, lfs, remote, ahead, network: is_network(&r) })
}
#[tauri::command]
async fn list_assets(st: State<'_, Vault>) -> R<Vec<Asset>> {
    let c = db(&root(&st)?)?;
    let v = c.prepare(&format!("SELECT {COLS} FROM assets ORDER BY mtime DESC")).map_err(e)?.query_map([], row_asset).map_err(e)?.flatten().collect();
    Ok(v)
}
#[tauri::command]
async fn search(query: String, st: State<'_, Vault>) -> R<Vec<Asset>> {
    let c = db(&root(&st)?)?;
    if let Some(q) = embed(&query) {
        let mut s = c.prepare(&format!("SELECT {COLS},embedding FROM assets WHERE embedding IS NOT NULL")).map_err(e)?;
        let mut v: Vec<(f32, Asset)> = s.query_map([], |x| {
            let a = row_asset(x)?;
            let emb: String = x.get(7)?;
            let hay = format!("{} {}", a.name, a.tags).to_lowercase();
            let boost = if query.to_lowercase().split_whitespace().any(|w| hay.contains(w)) { 0.15 } else { 0.0 };
            Ok((cosine(&q, &serde_json::from_str::<Vec<f32>>(&emb).unwrap_or_default()) + boost, a))
        }).map_err(e)?.flatten().collect();
        v.sort_by(|a, b| b.0.partial_cmp(&a.0).unwrap_or(std::cmp::Ordering::Equal));
        return Ok(v.into_iter().filter(|x| x.0 > 0.4).take(40).map(|x| x.1).collect());
    }
    // Ollama offline: plain keyword fallback
    let like = format!("%{query}%");
    let v = c.prepare(&format!("SELECT {COLS} FROM assets WHERE name LIKE ?1 OR tags LIKE ?1 LIMIT 60")).map_err(e)?
        .query_map([like], row_asset).map_err(e)?.flatten().collect();
    Ok(v)
}
#[tauri::command]
async fn thumb(path: String, st: State<'_, Vault>) -> R<Option<String>> {
    Ok(fs::read(tpath(&root(&st)?, &path)).ok().map(|b| data_uri(&b)))
}
#[tauri::command]
async fn history(path: String, st: State<'_, Vault>) -> R<Vec<Commit>> {
    let out = git(&root(&st)?, &["log", "--format=%h%x1f%an%x1f%ar%x1f%s", "--", &path]);
    Ok(String::from_utf8_lossy(&out).lines().filter_map(|l| {
        let p: Vec<&str> = l.split('\u{1f}').collect();
        (p.len() == 4).then(|| Commit { hash: p[0].into(), author: p[1].into(), when: p[2].into(), msg: p[3].into() })
    }).collect())
}
#[tauri::command]
async fn version_preview(path: String, hash: String, st: State<'_, Vault>) -> R<Option<String>> {
    let bytes = git(&root(&st)?, &["cat-file", "--filters", &format!("{hash}:{path}")]);
    let Ok(img) = image::load_from_memory(&bytes) else { return Ok(None) };
    let mut buf = Vec::new();
    image::DynamicImage::ImageRgb8(img.thumbnail(520, 520).to_rgb8()).write_to(&mut Cursor::new(&mut buf), image::ImageFormat::Jpeg).map_err(e)?;
    Ok(Some(data_uri(&buf)))
}
#[tauri::command]
async fn restore(path: String, hash: String, st: State<'_, Vault>) -> R<()> {
    let r = root(&st)?;
    git(&r, &["checkout", &hash, "--", &path]);
    scan(&r)?;
    commit(&r, &format!("Restore {path} to {hash}"));
    Ok(())
}

fn ignored(n: &str) -> bool {
    // .stratum-tags.json is written by export_tags() into the watched root: reacting to it would rescan, recommit and re-tag forever.
    n.ends_with('~') || n.ends_with(".tmp") || n.ends_with(".swp") || n.ends_with(".lock") || n.starts_with("~$") || n.starts_with(".~") || n == "Thumbs.db" || n == ".DS_Store" || n == ".stratum-tags.json"
}
fn git_out(root: &Path, args: &[&str]) -> (bool, String) {
    let mut c = Command::new("git");
    c.current_dir(root).args(["-c", "safe.directory=*"]).args(args).env("GIT_TERMINAL_PROMPT", "0");
    #[cfg(windows)]
    c.creation_flags(0x08000000);
    match c.output() {
        Ok(o) => (o.status.success(), format!("{}{}", String::from_utf8_lossy(&o.stdout), String::from_utf8_lossy(&o.stderr)).trim().to_string()),
        Err(x) => (false, x.to_string()),
    }
}
fn commit_auto(root: &Path) {
    let out = String::from_utf8_lossy(&git(root, &["status", "--porcelain"])).to_string();
    let lines: Vec<&str> = out.lines().collect();
    if lines.is_empty() { return; }
    let first = lines[0];
    let name = first.get(3..).unwrap_or("").trim_matches('"');
    let code = first.get(..2).unwrap_or("");
    let verb = if code.contains('?') || code.contains('A') { "Add" } else if code.contains('D') { "Remove" } else { "Update" };
    let msg = if lines.len() == 1 { format!("{verb} {name}") } else { format!("{verb} {name} and {} more", lines.len() - 1) };
    commit(root, &msg);
}
fn svg_thumb(root: &Path, rel: &str) -> Option<()> {
    let data = fs::read(root.join(rel)).ok()?;
    if data.len() > 30_000_000 { return None; }
    let tree = resvg::usvg::Tree::from_data(&data, &resvg::usvg::Options::default()).ok()?;
    let s = tree.size();
    let k = (360.0 / s.width().max(s.height())).min(4.0);
    let (w, h) = (((s.width() * k) as u32).max(1), ((s.height() * k) as u32).max(1));
    let mut pm = resvg::tiny_skia::Pixmap::new(w, h)?;
    pm.fill(resvg::tiny_skia::Color::WHITE);
    resvg::render(&tree, resvg::tiny_skia::Transform::from_scale(k, k), &mut pm.as_mut());
    let img = image::RgbaImage::from_raw(w, h, pm.take())?;
    image::DynamicImage::ImageRgba8(img).to_rgb8().save(tpath(root, rel)).ok()
}
fn psd_thumb(root: &Path, rel: &str) -> Option<()> {
    let b = fs::read(root.join(rel)).ok()?;
    if b.len() > 300_000_000 { return None; }
    std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| {
        let p = psd::Psd::from_bytes(&b).ok()?;
        let img = image::RgbaImage::from_raw(p.width(), p.height(), p.rgba())?;
        image::DynamicImage::ImageRgba8(img).thumbnail(360, 360).to_rgb8().save(tpath(root, rel)).ok()
    })).unwrap_or(None)
}
fn parse_commits(out: &[u8]) -> Vec<Commit> {
    String::from_utf8_lossy(out).lines().filter_map(|l| {
        let p: Vec<&str> = l.split('\u{1f}').collect();
        (p.len() == 4).then(|| Commit { hash: p[0].into(), author: p[1].into(), when: p[2].into(), msg: p[3].into() })
    }).collect()
}

#[tauri::command]
async fn set_tags(path: String, tags: String, st: State<'_, Vault>) -> R<()> {
    let r = root(&st)?;
    let c = db(&r)?;
    let name: String = c.query_row("SELECT name FROM assets WHERE path=?1", [&path], |r| r.get(0)).map_err(e)?;
    let emb = embed(&format!("{name} {tags}")).map(|v| serde_json::to_string(&v).unwrap());
    c.execute("UPDATE assets SET tags=?1,embedding=COALESCE(?2,embedding),tagged=1 WHERE path=?3", params![tags, emb, path]).map_err(e)?;
    export_tags(&r);
    Ok(())
}
#[tauri::command]
async fn import_files(paths: Vec<String>, st: State<'_, Vault>) -> R<usize> {
    let dest = root(&st)?.join("Imported");
    fs::create_dir_all(&dest).map_err(e)?;
    let mut n = 0;
    for p in paths {
        let src = PathBuf::from(&p);
        let base = src.parent().map(|x| x.to_path_buf()).unwrap_or_default();
        for ent in WalkDir::new(&src).into_iter().flatten().filter(|d| d.file_type().is_file()) {
            let rel = ent.path().strip_prefix(&base).unwrap_or(ent.path());
            let mut to = dest.join(rel);
            let mut i = 1;
            while to.exists() {
                let stem = to.file_stem().map(|s| s.to_string_lossy().to_string()).unwrap_or_default();
                let ext = to.extension().map(|s| format!(".{}", s.to_string_lossy())).unwrap_or_default();
                to = to.with_file_name(format!("{stem}-{i}{ext}"));
                i += 1;
            }
            if let Some(d) = to.parent() { fs::create_dir_all(d).map_err(e)?; }
            fs::copy(ent.path(), &to).map_err(e)?;
            n += 1;
        }
    }
    Ok(n) // the file watcher indexes and commits the new files
}
#[tauri::command]
async fn activity(st: State<'_, Vault>) -> R<Vec<Commit>> {
    Ok(parse_commits(&git(&root(&st)?, &["log", "-60", "--format=%h%x1f%an%x1f%ar%x1f%s"])))
}
#[tauri::command]
async fn get_remote(st: State<'_, Vault>) -> R<String> {
    Ok(String::from_utf8_lossy(&git(&root(&st)?, &["remote", "get-url", "origin"])).trim().to_string())
}
#[tauri::command]
async fn set_remote(url: String, st: State<'_, Vault>) -> R<()> {
    let r = root(&st)?;
    let has = git_out(&r, &["remote", "get-url", "origin"]).0;
    let (ok, m) = git_out(&r, &["remote", if has { "set-url" } else { "add" }, "origin", &url]);
    if ok { Ok(()) } else { Err(m) }
}
fn sync_inner(r: &Path) -> R<String> {
    let _g = GIT_LOCK.lock().unwrap_or_else(|p| p.into_inner());
    let (has, u) = git_out(r, &["remote", "get-url", "origin"]);
    if !has { return Err("E:no_remote".into()); }
    if !u.contains("://") && !u.contains('@') && !Path::new(&u).exists() {
        return Err("E:nas_down".into());
    }
    if !git_out(r, &["rev-parse", "HEAD"]).0 { return Err("E:nothing".into()); }
    commit_raw(r, "Save before sync");
    let b = git_out(r, &["rev-parse", "--abbrev-ref", "HEAD"]).1;
    let (ok, m) = git_t(r, &["fetch", "origin"], 90);
    if !ok { return Err(format!("E:remote_down:{m}")); }
    let rb = format!("origin/{b}");
    let mut saved = 0;
    if git_out(r, &["rev-parse", "--verify", &rb]).0 {
        let base = git_out(r, &["merge-base", "HEAD", &rb]).1;
        if !base.is_empty() {
            let names = |x: &str, y: &str| -> HashSet<String> { git_out(r, &["diff", "--name-only", x, y]).1.lines().map(|s| s.to_string()).collect() };
            let both: Vec<String> = names(&base, "HEAD").intersection(&names(&base, &rb)).cloned().collect();
            for p in both.iter().filter(|p| *p != ".stratum-tags.json") {
                // Edited on both sides: keep yours, and save the teammate's version next to it. Nothing is lost.
                let bytes = git(r, &["cat-file", "--filters", &format!("{rb}:{p}")]);
                if bytes.is_empty() { continue; }
                let pp = Path::new(p);
                let stem = pp.file_stem().map(|s| s.to_string_lossy().to_string()).unwrap_or_default();
                let ext = pp.extension().map(|s| format!(".{}", s.to_string_lossy())).unwrap_or_default();
                if fs::write(r.join(pp.with_file_name(format!("{stem} (conflict from teammate){ext}"))), bytes).is_ok() { saved += 1; }
            }
        }
        let id = format!("user.name={}", author());
        let (ok, m) = git_out(r, &["-c", &id, "-c", "user.email=stratum@local", "merge", "--no-edit", "--allow-unrelated-histories", "-X", "ours", &rb]);
        if !ok { git(r, &["merge", "--abort"]); return Err(format!("E:merge:{m}")); }
    }
    let (ok, m) = git_t(r, &["push", "-u", "origin", &b], 3600);
    if !ok { return Err(m); }
    Ok(if saved > 0 { format!("M:conflicts:{saved}") } else { "M:synced".into() })
}
#[tauri::command]
async fn sync(app: AppHandle, st: State<'_, Vault>) -> R<String> {
    let r = root(&st)?;
    let res = sync_inner(&r);
    if res.is_ok() { let _ = scan(&r); let _ = app.emit("vault-changed", ()); }
    emit_sync(&app, &res);
    res
}
#[derive(Serialize)]
struct Check { git: bool, lfs: bool, ollama: bool, vision: bool, embed: bool }
#[tauri::command]
async fn system_check() -> R<Check> {
    let t = |a: &[&str]| { let mut c = Command::new("git"); c.args(a); #[cfg(windows)] c.creation_flags(0x08000000); c.output().map(|o| o.status.success()).unwrap_or(false) };
    let v: Option<Value> = ureq::get(&format!("{OLLAMA}/api/tags")).timeout(Duration::from_millis(1500)).call().ok().and_then(|r| r.into_json().ok());
    let names: String = v.as_ref().and_then(|v| v["models"].as_array()).map(|a| a.iter().filter_map(|m| m["name"].as_str()).collect::<Vec<_>>().join(" ")).unwrap_or_default();
    Ok(Check { git: t(&["--version"]), lfs: t(&["lfs", "version"]), ollama: v.is_some(), vision: names.contains("llava"), embed: names.contains("nomic-embed-text") })
}
#[tauri::command]
async fn pull_model(name: String) -> R<()> {
    ureq::post(&format!("{OLLAMA}/api/pull")).timeout(Duration::from_secs(7200)).send_json(json!({"model": name, "stream": false})).map_err(e)?;
    Ok(())
}
#[tauri::command]
async fn set_author(name: String) -> R<()> { *AUTHOR.lock().unwrap() = name; Ok(()) }
#[tauri::command]
async fn create_hub(path: String) -> R<String> {
    let p = PathBuf::from(&path);
    if !p.is_dir() { return Err("E:hub_down".into()); }
    let hub = if p.join("HEAD").exists() { p.clone() } else { p.join("stratum-vault.git") };
    fs::create_dir_all(&hub).map_err(e)?;
    if !hub.join("HEAD").exists() {
        let (ok, m) = git_t(&hub, &["init", "--bare", "-b", "main"], 60);
        if !ok { return Err(m); }
    }
    Ok(hub.to_string_lossy().to_string())
}
#[tauri::command]
async fn join_hub(remote: String, dest: String) -> R<()> {
    let d = PathBuf::from(&dest);
    fs::create_dir_all(&d).map_err(e)?;
    if fs::read_dir(&d).map_err(e)?.next().is_some() { return Err("E:not_empty".into()); }
    let (ok, m) = git_t(&d, &["clone", &remote, "."], 7200);
    if ok { Ok(()) } else { Err(m) }
}


#[tauri::command]
async fn record_acceptance(version: String, user: String, app: AppHandle) -> R<()> {
    let dir = app.path().app_local_data_dir().map_err(e)?;
    fs::create_dir_all(&dir).map_err(e)?;
    let at = std::time::SystemTime::now().duration_since(UNIX_EPOCH).map(|d| d.as_secs()).unwrap_or(0);
    let p = dir.join("acceptance.json");
    let mut v: Vec<Value> = fs::read_to_string(&p).ok().and_then(|s| serde_json::from_str(&s).ok()).unwrap_or_default();
    v.push(json!({"version": version, "user": user, "accepted_at_unix": at, "os": std::env::consts::OS}));
    fs::write(&p, serde_json::to_string_pretty(&v).unwrap_or_default()).map_err(e)
}
#[tauri::command]
fn quit(app: AppHandle) { app.exit(0); }

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let _ = CACHE.set(app.path().app_local_data_dir().unwrap_or_else(|_| std::env::temp_dir()).join("vaults"));
            Ok(())
        })
        .manage(Vault::default())
        .invoke_handler(tauri::generate_handler![open_vault, stats, list_assets, search, thumb, history, version_preview, restore, set_tags, import_files, activity, get_remote, set_remote, sync, system_check, pull_model, set_author, create_hub, join_hub, record_acceptance, quit])
        .run(tauri::generate_context!())
        .expect("failed to run Stratum");
}
