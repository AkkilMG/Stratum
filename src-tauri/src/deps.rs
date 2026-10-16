use serde::Serialize;
use serde_json::Value;
use std::{
    ffi::OsString,
    fs::{self, File},
    io::{Read, Write},
    path::{Path, PathBuf},
    process::Command,
    sync::Mutex,
    time::Duration,
};
use tauri::{AppHandle, Emitter};
#[cfg(windows)]
use std::os::windows::process::CommandExt;

type R<T> = Result<T, String>;

const GITHUB_API: &str = "https://api.github.com/repos";
const GIT_FOR_WINDOWS_REPO: &str = "git-for-windows/git";
const GIT_LFS_REPO: &str = "git-lfs/git-lfs";
const OLLAMA_WINDOWS_URL: &str = "https://ollama.com/download/OllamaSetup.exe";
const OLLAMA_INSTALL_SH: &str = "https://ollama.com/install.sh";
const OLLAMA_MAC_URL: &str = "https://ollama.com/download/mac";


static GIT_BIN: Mutex<Option<OsString>> = Mutex::new(None);

#[derive(Serialize)]
pub struct DepsStatus {
    pub os: String,
    pub git: bool,
    pub lfs: bool,
    pub ollama: bool,
    pub vision: bool,
    pub embed: bool,
}

fn http_agent() -> ureq::Agent {
    ureq::Agent::config_builder()
        .timeout_global(Some(Duration::from_secs(1800)))
        .build()
        .into()
}

fn emit_progress(app: &AppHandle, dep: &str, phase: &str, pct: u32) {
    let _ = app.emit(
        "dep-progress",
        serde_json::json!({
            "dep": dep,
            "phase": phase,
            "pct": pct
        }),
    );
}

#[allow(dead_code)]
fn which(exe: &str) -> bool {
    let mut c = Command::new(if cfg!(windows) { "where.exe" } else { "which" });
    c.arg(exe);
    #[cfg(windows)]
    c.creation_flags(0x08000000);
    c.output().map(|o| o.status.success()).unwrap_or(false)
}

fn probe_git(exe: &str) -> bool {
    let mut c = Command::new(exe);
    c.arg("--version");
    #[cfg(windows)]
    c.creation_flags(0x08000000);
    c.output().map(|o| o.status.success()).unwrap_or(false)
}

fn git_candidates() -> Vec<PathBuf> {
    let mut v = Vec::new();
    #[cfg(windows)]
    {
        if let Ok(pf) = std::env::var("ProgramFiles") {
            v.push(PathBuf::from(pf).join("Git\\cmd\\git.exe"));
        }
        if let Ok(pf) = std::env::var("ProgramFiles(x86)") {
            v.push(PathBuf::from(pf).join("Git\\cmd\\git.exe"));
        }
        if let Ok(la) = std::env::var("LOCALAPPDATA") {
            v.push(PathBuf::from(la).join("Programs\\Git\\cmd\\git.exe"));
        }
    }
    #[cfg(not(windows))]
    {
        for d in [
            "/usr/bin/git",
            "/usr/local/bin/git",
            "/snap/bin/git",
            "/opt/homebrew/bin/git",
        ] {
            v.push(PathBuf::from(d));
        }
    }
    v
}

pub fn git_bin() -> OsString {
    if let Some(p) = GIT_BIN.lock().unwrap().clone() {
        return p;
    }
    if probe_git("git") {
        let p = OsString::from("git");
        *GIT_BIN.lock().unwrap() = Some(p.clone());
        return p;
    }
    for p in git_candidates() {
        let as_str = p.to_string_lossy();
        if probe_git(&as_str) {
            let o = p.into_os_string();
            *GIT_BIN.lock().unwrap() = Some(o.clone());
            return o;
        }
    }
    OsString::from("git")
}

/// Clear cached git binary (call after installing git)
fn clear_git_cache() {
    *GIT_BIN.lock().unwrap() = None;
}

pub fn git_ok(args: &[&str]) -> bool {
    let mut c = Command::new(git_bin());
    c.args(args);
    #[cfg(windows)]
    c.creation_flags(0x08000000);
    c.output().map(|o| o.status.success()).unwrap_or(false)
}

fn github_asset(repo: &str, want: impl Fn(&str) -> bool) -> R<String> {
    let url = format!("{GITHUB_API}/{repo}/releases/latest");
    let agent = http_agent();
    let mut resp = agent
        .get(&url)
        .header("User-Agent", "Stratum")
        .call()
        .map_err(|_| "E:network_conn")?;
    let v: Value = resp
        .body_mut()
        .read_json()
        .map_err(|_| "E:op_failed")?;
    v["assets"]
        .as_array()
        .and_then(|a| {
            a.iter().find_map(|x| {
                let n = x["name"].as_str()?;
                if want(n) {
                    x["browser_download_url"].as_str().map(|s| s.to_string())
                } else {
                    None
                }
            })
        })
        .ok_or_else(|| "E:op_failed".into())
}

fn temp_file(name: &str) -> PathBuf {
    let d = std::env::temp_dir().join("stratum-setup");
    let _ = fs::create_dir_all(&d);
    d.join(name)
}

fn download(app: &AppHandle, dep: &str, url: &str, dest: &Path) -> R<()> {
    emit_progress(app, dep, "download", 0);
    let agent = http_agent();
    let mut resp = agent
        .get(url)
        .header("User-Agent", "Stratum")
        .call()
        .map_err(|_| "E:network_conn")?;
    let total: u64 = resp
        .headers()
        .get("content-length")
        .and_then(|v| v.to_str().ok())
        .and_then(|s| s.parse().ok())
        .unwrap_or(0);
    let mut reader = resp.body_mut().as_reader();
    let mut f = File::create(dest).map_err(|_| "E:op_failed")?;
    let mut buf = [0u8; 65536];
    let mut got: u64 = 0;
    let mut last: u32 = 0;
    loop {
        let n = reader.read(&mut buf).map_err(|_| "E:network_conn")?;
        if n == 0 {
            break;
        }
        f.write_all(&buf[..n]).map_err(|_| "E:op_failed")?;
        got += n as u64;
        if total > 0 {
            let pct_f = (got as f64 / total as f64) * 100.0;
            let pct = pct_f as u32;
            if pct >= last + 2 {
                last = pct;
                emit_progress(app, dep, "download", pct.min(100));
            }
        }
    }
    emit_progress(app, dep, "download", 100);
    Ok(())
}

#[cfg(windows)]
fn verify_signature(path: &Path) -> bool {
    let script = format!(
        "$s = Get-AuthenticodeSignature -LiteralPath '{}'; if ($s.Status -ne 'Valid') {{ exit 1 }}; exit 0",
        path.display()
    );
    let mut c = Command::new("powershell");
    c.args(["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-Command", &script]);
    c.creation_flags(0x08000000);
    c.status().map(|s| s.success()).unwrap_or(false)
}

#[cfg(windows)]
fn run_installer_as_admin(exe: &Path, args: &[&str]) -> R<()> {
    let args_str = args
        .iter()
        .map(|a| format!("'{}'", a.replace('\'', "''")))
        .collect::<Vec<_>>()
        .join(",");
    let script = format!(
        "$p = Start-Process -FilePath '{}' -ArgumentList {} -Verb RunAs -Wait -PassThru; if ($p.ExitCode -ne 0) {{ exit $p.ExitCode }}; exit 0",
        exe.display(),
        args_str
    );
    let mut c = Command::new("powershell");
    c.args(["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-Command", &script]);
    c.creation_flags(0x08000000);
    let st = c.status().map_err(|_| "E:op_failed")?;
    if st.success() {
        Ok(())
    } else {
        Err("E:install_failed".into())
    }
}

#[allow(dead_code)]
fn run_cmd(cmd: &mut Command) -> R<()> {
    let st = cmd.status().map_err(|_| "E:op_failed")?;
    if st.success() { Ok(()) } else { Err("E:install_failed".into()) }
}

fn install_git(app: &AppHandle) -> R<()> {
    emit_progress(app, "git", "prepare", 0);
    #[cfg(windows)]
    {
        let url = github_asset(GIT_FOR_WINDOWS_REPO, |n| {
            n.ends_with("64-bit.exe") && !n.contains("Portable")
        })?;
        let exe = temp_file("git-setup.exe");
        download(app, "git", &url, &exe)?;
        emit_progress(app, "git", "verify", 95);
        if !verify_signature(&exe) {
            return Err("E:install_failed".into());
        }
        emit_progress(app, "git", "install", 100);
        run_installer_as_admin(
            &exe,
            &[
                "/VERYSILENT",
                "/NORESTART",
                "/SUPPRESSMSGBOXES",
                "/NOCANCEL",
                "/SP-",
            ],
        )?;
        clear_git_cache();
        Ok(())
    }
    #[cfg(target_os = "macos")]
    {
        // xcode-select --install
        let mut c = Command::new("xcode-select");
        c.arg("--install");
        let _ = c.status();
        emit_progress(app, "git", "install", 50);
        let start = std::time::Instant::now();
        while start.elapsed().as_secs() < 600 {
            if probe_git("git") {
                clear_git_cache();
                emit_progress(app, "git", "install", 100);
        Ok(())
            }
            std::thread::sleep(Duration::from_secs(2));
        }
        return Ok(());
    }
    #[cfg(target_os = "linux")]
    {
        let managers: &[(&str, &[&str])] = &[
            ("apt-get", &["install", "-y", "git"]),
            ("dnf", &["install", "-y", "git"]),
            ("yum", &["install", "-y", "git"]),
            ("pacman", &["-S", "--noconfirm", "git"]),
            ("zypper", &["--non-interactive", "install", "git"]),
            ("apk", &["add", "--no-cache", "git"]),
        ];
        for (pm, args) in managers {
            if which(pm) {
                let mut c = if which("pkexec") {
                    let mut cc = Command::new("pkexec");
                    cc.arg(pm);
                    for a in *args {
                        cc.arg(a);
                    }
                    cc
                } else {
                    let mut cc = Command::new(pm);
                    for a in *args {
                        cc.arg(a);
                    }
                    cc
                };
                emit_progress(app, "git", "install", 100);
                let _ = run_cmd(&mut c);
        clear_git_cache();
            }
        }
        Err("E:install_failed".into())
    }
    #[cfg(not(any(windows, target_os = "macos", target_os = "linux")))]
    {
        Err("E:op_failed".into())
    }
}

fn install_lfs(app: &AppHandle) -> R<()> {
    emit_progress(app, "lfs", "prepare", 0);
    #[cfg(windows)]
    {
        let url = github_asset(GIT_LFS_REPO, |n| {
            n.starts_with("git-lfs-windows-v") && n.ends_with(".exe")
        })?;
        let exe = temp_file("git-lfs-setup.exe");
        download(app, "lfs", &url, &exe)?;
        emit_progress(app, "lfs", "verify", 95);
        if !verify_signature(&exe) {
            return Err("E:install_failed".into());
        }
        emit_progress(app, "lfs", "install", 100);
        run_installer_as_admin(&exe, &["/VERYSILENT", "/NORESTART", "/SUPPRESSMSGBOXES"])?;
        Ok(())
    }
    #[cfg(target_os = "macos")]
    {
        if which("brew") {
            let mut c = Command::new("brew");
            c.args(["install", "git-lfs"]);
            let r = run_cmd(&mut c);
            let _ = {
                let mut c2 = Command::new(git_bin());
                c2.args(["lfs", "install"]);
                let _ = run_cmd(&mut c2);
            };
        r
        }
        return Err("E:install_failed".into());
    }
    #[cfg(target_os = "linux")]
    {
        let managers: &[(&str, &[&str])] = &[
            ("apt-get", &["install", "-y", "git-lfs"]),
            ("dnf", &["install", "-y", "git-lfs"]),
            ("yum", &["install", "-y", "git-lfs"]),
            ("pacman", &["-S", "--noconfirm", "git-lfs"]),
            ("zypper", &["--non-interactive", "install", "git-lfs"]),
            ("apk", &["add", "--no-cache", "git-lfs"]),
        ];
        for (pm, args) in managers {
            if which(pm) {
                let mut c = if which("pkexec") {
                    let mut cc = Command::new("pkexec");
                    cc.arg(pm);
                    for a in *args {
                        cc.arg(a);
                    }
                    cc
                } else {
                    let mut cc = Command::new(pm);
                    for a in *args {
                        cc.arg(a);
                    }
                    cc
                };
                emit_progress(app, "lfs", "install", 100);
        let _ = run_cmd(&mut c);
            }
        }
        Err("E:install_failed".into())
    }
    #[cfg(not(any(windows, target_os = "macos", target_os = "linux")))]
    {
        Err("E:op_failed".into())
    }
}

fn install_ollama(app: &AppHandle) -> R<()> {
    emit_progress(app, "ollama", "prepare", 0);
    #[cfg(windows)]
    {
        let exe = temp_file("OllamaSetup.exe");
        download(app, "ollama", OLLAMA_WINDOWS_URL, &exe)?;
        emit_progress(app, "ollama", "verify", 95);
        if !verify_signature(&exe) {
            return Err("E:install_failed".into());
        }
        emit_progress(app, "ollama", "install", 100);
        // Try silent; fallback to normal
        run_installer_as_admin(&exe, &["/VERYSILENT", "/NORESTART", "/SUPPRESSMSGBOXES"])
    }
    #[cfg(target_os = "macos")]
    {
        if which("brew") {
            let mut c = Command::new("brew");
            c.args(["install", "ollama"]);
            emit_progress(app, "ollama", "install", 100);
        run_cmd(&mut c)
        }
        let mut c = Command::new("open");
        c.arg(OLLAMA_MAC_URL);
        let _ = c.status();
        Ok(())
    }
    #[cfg(target_os = "linux")]
    {
        let script = temp_file("ollama-install.sh");
        let agent = http_agent();
        let mut resp = agent
            .get(OLLAMA_INSTALL_SH)
            .header("User-Agent", "Stratum")
            .call()
            .map_err(|_| "E:network_conn")?;
        let mut data = Vec::new();
        resp.body_mut()
            .as_reader()
            .read_to_end(&mut data)
            .map_err(|_| "E:op_failed")?;
        fs::write(&script, &data).map_err(|_| "E:op_failed")?;
        let mut c = if which("pkexec") {
            let mut cc = Command::new("pkexec");
            cc.arg("sh");
            cc.arg("-c");
            cc.arg(format!("sh '{}'", script.display()));
            cc
        } else {
            let mut cc = Command::new("sh");
            cc.arg("-c");
            cc.arg(format!("sh '{}'", script.display()));
            cc
        };
        emit_progress(app, "ollama", "install", 100);
        run_cmd(&mut c)
    }
    #[cfg(not(any(windows, target_os = "macos", target_os = "linux")))]
    {
        Err("E:op_failed".into())
    }
}

#[tauri::command]
pub async fn install_dep(dep: String, app: AppHandle) -> R<()> {
    let d = dep.as_str();
    match d {
        "git" => install_git(&app),
        "lfs" => install_lfs(&app),
        "ollama" => install_ollama(&app),
        _ => Err("E:op_failed".into()),
    }
}

#[tauri::command]
pub async fn deps_status() -> R<DepsStatus> {
    let os = std::env::consts::OS.to_string();
    let agent1 = http_agent();
    let ollama_ok = agent1
        .get("http://localhost:11434/api/tags")
        .call()
        .ok()
        .and_then(|mut r| r.body_mut().read_json::<Value>().ok())
        .is_some();
    let v: Option<Value> = if ollama_ok {
        let agent2 = http_agent();
        agent2
            .get("http://localhost:11434/api/tags")
            .call()
            .ok()
            .and_then(|mut r| r.body_mut().read_json::<Value>().ok())
    } else {
        None
    };
    let names: String = v
        .as_ref()
        .and_then(|vv| vv["models"].as_array())
        .map(|a| {
            a.iter()
                .filter_map(|m| m["name"].as_str())
                .collect::<Vec<_>>()
                .join(" ")
        })
        .unwrap_or_default();
    Ok(DepsStatus {
        os,
        git: git_ok(&["--version"]),
        lfs: git_ok(&["lfs", "version"]),
        ollama: v.is_some(),
        vision: names.contains("llava"),
        embed: names.contains("nomic-embed-text"),
    })
}