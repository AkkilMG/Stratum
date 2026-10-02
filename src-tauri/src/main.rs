#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use base64::{engine::general_purpose::STANDARD as B64, Engine};
use notify::{RecommendedWatcher, RecursiveMode, Watcher};
use rusqlite::{params, Connection};
use serde::Serialize;
use serde_json::{json, Value};
use std::{collections::HashSet, fs, io::Cursor, path::{Path, PathBuf}, process::Command, sync::{mpsc, Mutex}, thread, time::{Duration, UNIX_EPOCH}};
use tauri::{AppHandle, Emitter, State};
use walkdir::WalkDir;
#[cfg(windows)]
use std::os::windows::process::CommandExt;

type R<T> = Result<T, String>;
fn e<E: ToString>(x: E) -> String { x.to_string() }
const OLLAMA: &str = "http://localhost:11434";

#[derive(Default)]
struct Vault { root: Mutex<Option<PathBuf>>, watcher: Mutex<Option<RecommendedWatcher>> }
fn root(s: &State<'_, Vault>) -> R<PathBuf> { s.root.lock().unwrap().clone().ok_or_else(|| "No vault open".to_string()) }

#[derive(Serialize)]
struct Asset { path: String, name: String, kind: String, size: i64, mtime: i64, tags: String, tagged: bool }
#[derive(Serialize)]
struct Stats { assets: i64, bytes: i64, tagged: i64, commits: i64, by_kind: Vec<(String, i64)>, ollama: bool, lfs: bool }
#[derive(Serialize)]
struct Commit { hash: String, author: String, when: String, msg: String }

// ---------- helpers ----------
fn git(root: &Path, args: &[&str]) -> Vec<u8> {
    let mut c = Command::new("git");
    c.current_dir(root).args(args);
    #[cfg(windows)]
    c.creation_flags(0x08000000);
    c.output().map(|o| o.stdout).unwrap_or_default()
}
fn db(root: &Path) -> R<Connection> {
    fs::create_dir_all(root.join(".stratum/thumbs")).map_err(e)?;
    let c = Connection::open(root.join(".stratum/index.db")).map_err(e)?;
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
fn tpath(root: &Path, rel: &str) -> PathBuf { root.join(".stratum/thumbs").join(rel.replace('/', "__") + ".jpg") }
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
fn init_git(root: &Path) {
    if !root.join(".git").exists() { git(root, &["init"]); }
    if !root.join(".gitignore").exists() { let _ = fs::write(root.join(".gitignore"), ".stratum/\n*~\n*.tmp\n*.swp\nThumbs.db\n.DS_Store\n"); }
    if !git(root, &["lfs", "version"]).is_empty() && !root.join(".gitattributes").exists() {
        let mut s = String::new();
        for x in ["psd", "ai", "fig", "png", "jpg", "jpeg", "tga", "fbx", "blend", "glb", "wav"] {
            s += &format!("*.{x} filter=lfs diff=lfs merge=lfs -text\n");
        }
        let _ = fs::write(root.join(".gitattributes"), s);
        git(root, &["lfs", "install", "--local"]);
    }
}
fn commit(root: &Path, msg: &str) {
    git(root, &["add", "-A"]);
    git(root, &["-c", "user.name=Stratum", "-c", "user.email=stratum@local", "commit", "-m", msg]);
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
    let walker = WalkDir::new(root).into_iter().filter_entry(|d| {
        let n = d.file_name().to_string_lossy();
        n != ".git" && n != ".stratum" && !ignored(&n)
    });
    for ent in walker.flatten().filter(|d| d.file_type().is_file()) {
        let rel = ent.path().strip_prefix(root).map_err(e)?.to_string_lossy().replace('\\', "/");
        if rel == ".gitignore" || rel == ".gitattributes" { continue; }
        let md = ent.metadata().map_err(e)?;
        let mt = md.modified().ok().and_then(|t| t.duration_since(UNIX_EPOCH).ok()).map(|d| d.as_secs() as i64).unwrap_or(0);
        let old: Option<i64> = c.query_row("SELECT mtime FROM assets WHERE path=?1", [&rel], |r| r.get(0)).ok();
        seen.insert(rel.clone());
        if old == Some(mt) { continue; }
        let k = kind(ent.path());
        c.execute(
            "INSERT INTO assets(path,name,kind,size,mtime) VALUES(?1,?2,?3,?4,?5) ON CONFLICT(path) DO UPDATE SET size=?4,mtime=?5,tagged=0",
            params![rel, ent.file_name().to_string_lossy().to_string(), k, md.len() as i64, mt],
        ).map_err(e)?;
        if matches!(k, "Image" | "Vector") || rel.to_lowercase().ends_with(".psd") { thumb_make(root, &rel); }
    }
    let all: Vec<String> = c.prepare("SELECT path FROM assets").map_err(e)?.query_map([], |r| r.get(0)).map_err(e)?.flatten().collect();
    for p in all { if !seen.contains(&p) { c.execute("DELETE FROM assets WHERE path=?1", [&p]).map_err(e)?; } }
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
    let rows: Vec<(String, String, String)> = match c.prepare("SELECT path,name,kind FROM assets WHERE tagged=0") {
        Ok(mut s) => s.query_map([], |r| Ok((r.get(0)?, r.get(1)?, r.get(2)?))).map(|m| m.flatten().collect()).unwrap_or_default(),
        Err(_) => return,
    };
    for (p, n, _k) in rows {
        let tags = if tpath(root, &p).exists() {
            match vision_tags(&tpath(root, &p)) { Some(t) => t, None => return } // Ollama offline: retry on next change
        } else {
            Path::new(&n).file_stem().map(|s| s.to_string_lossy().replace(['_', '-'], ", ")).unwrap_or_default()
        };
        let Some(v) = embed(&format!("{n} {tags}")) else { return };
        let _ = c.execute("UPDATE assets SET tags=?1,embedding=?2,tagged=1 WHERE path=?3", params![tags, serde_json::to_string(&v).unwrap(), p]);
        let _ = app.emit("vault-changed", ());
    }
}

// ---------- commands ----------
#[tauri::command]
async fn open_vault(path: String, app: AppHandle, st: State<'_, Vault>) -> R<()> {
    let r = PathBuf::from(&path);
    if !r.is_dir() { return Err("Folder not found".into()); }
    db(&r)?;
    *st.root.lock().unwrap() = Some(r.clone());
    let (tx, rx) = mpsc::channel::<()>();
    let mut w = notify::recommended_watcher(move |ev: notify::Result<notify::Event>| {
        if let Ok(ev) = ev {
            if ev.paths.iter().any(|p| !p.components().any(|c| c.as_os_str() == ".git" || c.as_os_str() == ".stratum") && !ignored(&p.file_name().map(|n| n.to_string_lossy().to_string()).unwrap_or_default())) { let _ = tx.send(()); }
        }
    }).map_err(e)?;
    w.watch(&r, RecursiveMode::Recursive).map_err(e)?;
    *st.watcher.lock().unwrap() = Some(w); // replaces (and stops) any previous watcher
    thread::spawn(move || {
        let _ = app.emit("busy", true);
        init_git(&r);
        let _ = scan(&r);
        commit(&r, "Index vault");
        let _ = app.emit("vault-changed", ());
        let _ = app.emit("busy", false);
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
    Ok(Stats { assets, bytes, tagged, commits, by_kind, ollama, lfs })
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
    n.ends_with('~') || n.ends_with(".tmp") || n.ends_with(".swp") || n.ends_with(".lock") || n.starts_with("~$") || n.starts_with(".~") || n == "Thumbs.db" || n == ".DS_Store"
}
fn git_out(root: &Path, args: &[&str]) -> (bool, String) {
    let mut c = Command::new("git");
    c.current_dir(root).args(args);
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
    let c = db(&root(&st)?)?;
    let name: String = c.query_row("SELECT name FROM assets WHERE path=?1", [&path], |r| r.get(0)).map_err(e)?;
    let emb = embed(&format!("{name} {tags}")).map(|v| serde_json::to_string(&v).unwrap());
    c.execute("UPDATE assets SET tags=?1,embedding=COALESCE(?2,embedding),tagged=1 WHERE path=?3", params![tags, emb, path]).map_err(e)?;
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
#[tauri::command]
async fn sync(app: AppHandle, st: State<'_, Vault>) -> R<String> {
    let r = root(&st)?;
    let b = String::from_utf8_lossy(&git(&r, &["rev-parse", "--abbrev-ref", "HEAD"])).trim().to_string();
    let (ok, m) = git_out(&r, &["fetch", "origin"]);
    if !ok { return Err(format!("Can't reach the remote: {m}")); }
    if git_out(&r, &["rev-parse", "--verify", &format!("origin/{b}")]).0 {
        let (ok, m) = git_out(&r, &["merge", "--no-edit", "-X", "ours", &format!("origin/{b}")]);
        if !ok { git(&r, &["merge", "--abort"]); return Err(format!("Merge failed, your local files were kept: {m}")); }
    }
    let (ok, m) = git_out(&r, &["push", "-u", "origin", &b]);
    if !ok { return Err(m); }
    let _ = scan(&r);
    let _ = app.emit("vault-changed", ());
    Ok("Synced with remote".into())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .manage(Vault::default())
        .invoke_handler(tauri::generate_handler![open_vault, stats, list_assets, search, thumb, history, version_preview, restore, set_tags, import_files, activity, get_remote, set_remote, sync])
        .run(tauri::generate_context!())
        .expect("failed to run Stratum");
}
