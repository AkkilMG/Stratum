import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { listen } from "@tauri-apps/api/event";
import { getCurrentWebview } from "@tauri-apps/api/webview";
import { open } from "@tauri-apps/plugin-dialog";
import { call, setDemo } from "./api";
import { Tour, Step } from "./Tour";
import Wizard from "./Wizard";
import type { Asset, Ask, Cfg, Check, Commit, Stats } from "./types";
import { Gate, LegalView } from "./Legal";
import { About, Settings, copy } from "./Settings";
import { Modal, Credits } from "./ui";
import { POLICY_VERSION, getAcceptance } from "./legal";
import "./styles.css";

type View = "overview" | "library" | "activity" | "settings" | "legal";
type Sync = { ok: boolean; msg: string; at: number };
const fmt = (b: number) => (b >= 1e9 ? (b / 1e9).toFixed(2) + " GB" : b >= 1e6 ? (b / 1e6).toFixed(1) + " MB" : Math.max(0, Math.round(b / 1e3)) + " KB");
const ago = (t: number) => { const s = Date.now() / 1000 - t; return s < 60 ? "just now" : s < 3600 ? `${Math.floor(s / 60)} min ago` : s < 86400 ? `${Math.floor(s / 3600)} h ago` : `${Math.floor(s / 86400)} d ago`; };
const KC: Record<string, string> = { Image: "#2b50ff", Vector: "#00a389", Source: "#e69a1a", Model: "#b4439a", Audio: "#6b7a90", Other: "#98a3b3" };
const tagList = (t: string) => t.split(",").map((x) => x.trim()).filter(Boolean);
const cache = new Map<string, string | null>();

const getSpaces = (): Cfg[] => { try { return JSON.parse(localStorage.getItem("spaces") || "[]"); } catch { return []; } };
const saveSpace = (c: Cfg) => localStorage.setItem("spaces", JSON.stringify([c, ...getSpaces().filter((x) => x.local !== c.local)].slice(0, 6)));
const base = (p: string) => p.split(/[\\/]/).filter(Boolean).pop() || p;
const Ic = {
  overview: <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></svg>,
  library: <svg viewBox="0 0 24 24"><rect x="3" y="3" width="8" height="8" rx="1.5" /><rect x="13" y="3" width="8" height="8" rx="1.5" /><rect x="3" y="13" width="8" height="8" rx="1.5" /><rect x="13" y="13" width="8" height="8" rx="1.5" /></svg>,
  activity: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>,
  settings: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9L7 7M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" /></svg>,
  add: <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>,
};
const HI = {
  plus: <svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="16" /><path d="M24 16v16M16 24h16" /></svg>,
  folder: <svg viewBox="0 0 48 48"><path d="M6 14a3 3 0 0 1 3-3h10l4 5h16a3 3 0 0 1 3 3v17a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z" /></svg>,
  team: <svg viewBox="0 0 48 48"><circle cx="18" cy="17" r="6" /><circle cx="33" cy="19" r="5" /><path d="M6 40c0-8 6-12 12-12s12 4 12 12M31 29c6 0 11 4 11 11" /></svg>,
  tour: <svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="17" /><path d="M20 16l13 8-13 8z" /></svg>,
};

function Page({ children }: { children: ReactNode }) {
  return (
    <div className="wiz"><div className="contours" aria-hidden />
      <header className="wtop"><div className="brand"><i /><span>Stratum</span></div></header>
      <div className="wscroll"><section className="wmain wide">{children}<Credits /></section></div></div>
  );
}

function Home({ spaces, busy, err, onOpen, onForget, onNew, onFolder, onJoin, onTour }: {
  spaces: Cfg[]; busy: boolean; err: string; onOpen: (c: Cfg) => void; onForget: (c: Cfg) => void; onNew: () => void; onFolder: () => void; onJoin: () => void; onTour: () => void;
}) {
  return (
    <Page>
      <h1>Welcome to Stratum</h1>
      <p className="lead sm">Start however you like. Nothing is created until you choose.</p>
      <div className="modes">
        <button className="mode" onClick={onNew}>{HI.plus}<b>Create a new space</b><span>Guided setup for this PC, with an optional studio NAS.</span></button>
        <button className="mode" onClick={onFolder}>{HI.folder}<b>Open a folder</b><span>Use any folder. An empty one starts fresh; existing files are indexed in place.</span></button>
        <button className="mode" onClick={onJoin}>{HI.team}<b>Join a studio space</b><span>Download a teammate’s shared space from the NAS.</span></button>
        <button className="mode" onClick={onTour}>{HI.tour}<b>Take the tour</b><span>60 seconds with sample files. Nothing real is touched.</span></button>
      </div>
      {spaces.length > 0 && <><h3 className="sub">Your spaces</h3>
        <ul className="spaces">{spaces.map((s) => (
          <li key={s.local}><button onClick={() => onOpen(s)}><b>{base(s.local)}</b><span>{s.local}</span></button><button className="icon" aria-label={`Forget ${base(s.local)}`} title="Remove from list" onClick={() => onForget(s)}>✕</button></li>))}</ul></>}
      {busy && <p className="hint">Opening…</p>}
      {err && <p className="err">{err}</p>}
    </Page>
  );
}

function Thumb({ a }: { a: Asset }) {
  const key = a.path + a.mtime;
  const [src, setSrc] = useState<string | null | undefined>(cache.get(key));
  useEffect(() => {
    if (cache.has(key)) return setSrc(cache.get(key));
    call<string | null>("thumb", { path: a.path }).then((s) => { cache.set(key, s); setSrc(s); });
  }, [key]);
  return src ? <img src={src} alt={a.name} loading="lazy" /> : <span className="glyph" style={{ color: KC[a.kind] }}>{a.kind}</span>;
}

function Detail({ a, onClose, onChanged, note, onPick, ask }: { a: Asset; onClose: () => void; onChanged: () => void; note: (m: string) => void; onPick: () => void; ask: (o: Ask) => void }) {
  const [log, setLog] = useState<Commit[]>([]);
  const [pick, setPick] = useState<Commit | null>(null);
  const [old, setOld] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  useEffect(() => { setPick(null); setOld(null); call<Commit[]>("history", { path: a.path }).then(setLog); }, [a.path, a.mtime]);
  useEffect(() => { setOld(null); if (pick) { onPick(); call<string | null>("version_preview", { path: a.path, hash: pick.hash }).then(setOld); } }, [pick]);
  const tags = tagList(a.tags);
  const save = async (t: string[]) => { await call("set_tags", { path: a.path, tags: t.join(", ") }); onChanged(); };
  const restore = () => {
    if (!pick) return;
    ask({ title: `Restore ${a.name}?`, body: `Version ${pick.hash} (${pick.when}) will be brought back as a new version. The current file stays in the history, so nothing is lost.`, label: "Restore",
      run: async () => { await call("restore", { path: a.path, hash: pick.hash }); note(`Restored ${a.name} to ${pick.hash}. Saved as a new version.`); onChanged(); } });
  };
  return (
    <aside className="drawer">
      <header><div><h3>{a.name}</h3><p>{a.path}</p></div><button className="icon" onClick={onClose} aria-label="Close">✕</button></header>
      <div className="compare">
        <figure><div className="frame"><Thumb a={a} /></div><figcaption>Current</figcaption></figure>
        {pick && <figure><div className="frame">{old ? <img src={old} /> : <span className="glyph">No preview</span>}</div><figcaption>{pick.hash} · {pick.when}</figcaption></figure>}
      </div>
      <dl><dt>Type</dt><dd>{a.kind}</dd><dt>Size</dt><dd>{fmt(a.size)}</dd><dt>Modified</dt><dd>{ago(a.mtime)}</dd></dl>
      <h4>Tags</h4>
      <div className="tags" data-t="tags">
        {tags.map((t) => <span key={t}>{t}<button aria-label={`Remove ${t}`} onClick={() => save(tags.filter((x) => x !== t))}>×</button></span>)}
        <input value={draft} placeholder={a.tagged ? "Add tag" : "AI tagging pending…"} onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && draft.trim()) { save([...tags, draft.trim().toLowerCase()]); setDraft(""); } }} />
      </div>
      <h4>Versions <small>{log.length}</small></h4>
      <ul className="log" data-t="versions">
        {log.map((c) => (
          <li key={c.hash} className={pick?.hash === c.hash ? "on" : ""} onClick={() => setPick(c)}><b>{c.msg}</b><span>{c.hash} · {c.when} · {c.author}</span></li>
        ))}
      </ul>
      <button className="primary" data-t="restore" disabled={!pick} onClick={restore}>{pick ? `Restore ${pick.hash}` : "Pick a version to restore"}</button>
    </aside>
  );
}

export default function App() {
  const [vault, setVault] = useState<string | null>(null);
  const [wizard, setWizard] = useState<{ start: number; mode?: Cfg["mode"] } | null>(null);
  const [booting, setBooting] = useState(!!localStorage.getItem("cfg"));
  const [spaces, setSpaces] = useState<Cfg[]>(getSpaces);
  const [recover, setRecover] = useState(false);
  const [demo, setDemoState] = useState(false);
  const [tour, setTour] = useState<number | null>(null);
  const [picked, setPicked] = useState(false);
  const [view, setView] = useState<View>("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Asset[] | null>(null);
  const [kind, setKind] = useState("All");
  const [tag, setTag] = useState("");
  const [sort, setSort] = useState(localStorage.getItem("sort") || "recent");
  const [dense, setDense] = useState(localStorage.getItem("dense") === "1");
  const [legalOk, setLegalOk] = useState(() => getAcceptance()?.v === POLICY_VERSION);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "system");
  const [author, setAuthor] = useState(localStorage.getItem("author") || "");
  const [loading, setLoading] = useState(true);
  const [about, setAbout] = useState(false);
  const [help, setHelp] = useState(false);
  const [ask, setAsk] = useState<Ask | null>(null);
  const [sel, setSel] = useState<Asset | null>(null);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const [err, setErr] = useState("");
  const [toast, setToast] = useState("");
  const [log, setLog] = useState<Commit[]>([]);
  const [remote, setRemote] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [syncSt, setSyncSt] = useState<Sync | null>(null);
  const [pal, setPal] = useState<string | null>(null);
  const vaultRef = useRef<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const note = (m: string) => { setToast(m); setTimeout(() => setToast(""), 4500); };

  const load = useCallback(async () => {
    try {
      const [s, a] = await Promise.all([call<Stats>("stats"), call<Asset[]>("list_assets")]);
      setStats(s); setAssets(a); setSel((c) => (c ? a.find((x) => x.path === c.path) ?? null : null));
    } catch (e) { setErr(String(e)); } finally { setLoading(false); }
  }, []);

  const openVault = useCallback(async (cfg: Cfg, remote: string | null) => {
    setBusy(true); setErr("");
    try {
      await call("set_author", { name: cfg.name || "Me" });
      await call("open_vault", { path: cfg.local, lfs: cfg.lfs, remote });
      localStorage.setItem("cfg", JSON.stringify(cfg)); setVault(cfg.local); vaultRef.current = cfg.local; saveSpace(cfg); setSpaces(getSpaces()); localStorage.setItem("seen", "1"); setWizard(null); setRecover(false); await load();
    } catch (e) { setBusy(false); throw e; }
  }, [load]);

  const startDemo = () => {
    setDemo(true); setDemoState(true); setWizard(null); setVault("Demo space"); setView("overview"); setSel(null); setQ(""); setPicked(false); load(); setTour(0);
  };
  // After the tour (finished or skipped) the user is never forced anywhere: back to their space if they have one, otherwise a blank start screen.
  const exitDemo = (to: "setup" | "home") => {
    setDemo(false); setDemoState(false); setTour(null); setSel(null); setQ(""); setView("overview");
    const rv = vaultRef.current;
    if (rv) { setVault(rv); load(); }
    else { setVault(null); setAssets([]); setStats(null); localStorage.setItem("seen", "1"); if (to === "setup") setWizard({ start: 1, mode: "hub" }); }
  };
  const boot = useCallback(() => {
    const raw = localStorage.getItem("cfg");
    if (!raw) { setBooting(false); if (!localStorage.getItem("seen")) setWizard({ start: 0 }); return; }
    setBooting(true); setErr("");
    openVault(JSON.parse(raw) as Cfg, null).catch((e) => { setErr(String(e)); setRecover(true); }).finally(() => setBooting(false));
  }, [openVault]);
  const quickOpen = async () => {
    const p = await open({ directory: true });
    if (typeof p !== "string") return;
    try { await openVault({ name: localStorage.getItem("author") || "Me", mode: "local", local: p, nas: "", lfs: false }, null); } catch (e) { setErr(String(e)); }
  };
  useEffect(() => { if (legalOk) boot(); }, [boot, legalOk]);
  useEffect(() => { localStorage.setItem("sort", sort); localStorage.setItem("dense", dense ? "1" : "0"); }, [sort, dense]);
  useEffect(() => {
    if (theme === "system") delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const subs = [listen("vault-changed", load), listen<boolean>("busy", (e) => setBusy(e.payload)), listen<Sync>("sync-state", (e) => { setSyncSt(e.payload); load(); }),
      getCurrentWebview().onDragDropEvent((ev) => {
        const p = ev.payload;
        if (p.type === "enter" || p.type === "over") setDrag(true);
        else if (p.type === "drop") { setDrag(false); call<number>("import_files", { paths: p.paths }).then((n) => note(`Added ${n} file${n === 1 ? "" : "s"}. Previews, tags and versions are being made.`)).catch((e) => setErr(String(e))); }
        else setDrag(false);
      })];
    return () => { subs.forEach((s) => s.then((f) => f()).catch(() => {})); };
  }, [load]);
  useEffect(() => {
    if (!q.trim()) return setResults(null);
    const t = setTimeout(() => call<Asset[]>("search", { query: q }).then(setResults).catch((e) => setErr(String(e))), 300);
    return () => clearTimeout(t);
  }, [q]);
  useEffect(() => {
    if (view !== "activity" || !vault) return;
    call<Commit[]>("activity").then(setLog); call<string>("get_remote").then(setRemote);
  }, [view, vault, stats?.commits]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPal(""); }
      else if (e.key === "/" && document.activeElement?.tagName !== "INPUT") { e.preventDefault(); searchRef.current?.focus(); }
      else if (e.key === "?" && document.activeElement?.tagName !== "INPUT") setHelp(true);
      else if (e.key === "Escape") { setSel(null); setPal(null); }
    };
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, []);

  const sync = async () => {
    setSyncing(true);
    try { if (remote) await call("set_remote", { url: remote }); note(await call<string>("sync")); await load(); } catch (e) { setErr(String(e)); } finally { setSyncing(false); }
  };
  const addFiles = async () => { const p = await open({ multiple: true }); if (p) { const n = await call<number>("import_files", { paths: Array.isArray(p) ? p : [p] }); note(`Added ${n} file${n === 1 ? "" : "s"}.`); } };
  const switchVault = () => { vaultRef.current = null; setVault(null); setStats(null); setAssets([]); setSel(null); setErr(""); };

  const saveName = async (n: string) => {
    setAuthor(n); localStorage.setItem("author", n); await call("set_author", { name: n });
    try { const c = JSON.parse(localStorage.getItem("cfg") || "null"); if (c) localStorage.setItem("cfg", JSON.stringify({ ...c, name: n })); } catch {}
    note("Name saved. New changes will carry it.");
  };
  const diag = async () => {
    const c = await call<Check>("system_check").catch(() => null);
    return ["Stratum diagnostics", `Policy version: ${getAcceptance()?.v ?? "not accepted"}`, `Platform: ${navigator.userAgent}`,
      `Assets: ${stats?.assets ?? "?"}, versions: ${stats?.commits ?? "?"}, tagged: ${stats?.tagged ?? "?"}`, `Network drive: ${stats?.network ?? "?"}, NAS connected: ${stats ? !!stats.remote : "?"}, waiting to sync: ${stats?.ahead ?? "?"}`,
      `Git: ${c?.git}, Git LFS: ${c?.lfs}, Ollama: ${c?.ollama}, vision model: ${c?.vision}, search model: ${c?.embed}`].join("\n");
  };
  const accept = async () => {
    localStorage.setItem("legal", JSON.stringify({ v: POLICY_VERSION, at: new Date().toISOString() }));
    try { await call("record_acceptance", { version: POLICY_VERSION, user: localStorage.getItem("author") || "" }); } catch {}
    setLegalOk(true);
  };
  const topTags = useMemo(() => {
    const m = new Map<string, number>();
    assets.forEach((a) => tagList(a.tags).forEach((t) => m.set(t, (m.get(t) ?? 0) + 1)));
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 14);
  }, [assets]);
  const kinds = ["All", ...Array.from(new Set(assets.map((a) => a.kind)))];
  const shown = useMemo(() => {
    const l = [...(results ?? assets)].filter((a) => (kind === "All" || a.kind === kind) && (!tag || tagList(a.tags).includes(tag)));
    if (!results) l.sort((a, b) => (sort === "name" ? a.name.localeCompare(b.name) : sort === "size" ? b.size - a.size : b.mtime - a.mtime));
    return l;
  }, [results, assets, kind, tag, sort]);
  const maxKind = Math.max(1, ...(stats?.by_kind.map((k) => k[1]) ?? [1]));
  const pending = stats ? stats.assets - stats.tagged : 0;
  const syncText = !stats?.remote ? "Local only" : syncSt && !syncSt.ok ? `Offline · ${stats.ahead} waiting` : stats.ahead > 0 ? `${stats.ahead} waiting to sync` : syncSt ? `Synced ${ago(syncSt.at)}` : "Connected to NAS";
  const syncCls = !stats?.remote ? "" : syncSt && !syncSt.ok ? "bad" : stats.ahead > 0 ? "warn" : "ok";

  const steps: Step[] = [
    { title: "Welcome to Stratum", body: "This is a practice vault with sample game assets. Nothing here is real, so click freely. The tour takes about a minute." },
    { target: "[data-t=overview]", title: "Overview", body: "Your vault at a glance: how much is stored, how many files are tagged, and a heads-up if anything needs attention." },
    { target: "[data-t=cards]", title: "Saved automatically", body: "Every change to a file is saved as a version in the background. There are no commits and no commands to learn." },
    { target: "[data-t=library]", title: "Open the Library", body: "Every asset appears as a visual grid, with previews for images, vector maps and PSDs.", needs: "click Library", ok: view === "library" },
    { target: "[data-t=search]", title: "Search by meaning", body: "Describe what you want, not the filename. Water finds the ocean and river maps even though neither is named that.", needs: "type “water” in the search box", ok: q.trim().length > 2 && !!results },
    { target: "[data-t=grid]", title: "Open an asset", body: "Hover a tile to see its tags. Click one to see details.", needs: "click any asset", ok: !!sel },
    { target: "[data-t=tags]", title: "Tags you control", body: "A local AI suggested these when the file was added. Add or remove tags and search follows. Tags are shared with teammates too." },
    { target: "[data-t=versions]", title: "Every save is a version", body: "Pick an older version to compare it side by side with the current file.", needs: "click a version", ok: picked },
    { target: "[data-t=restore]", title: "Go back safely", body: "Restoring creates a new version, so going back never destroys anything." },
    { target: "[data-t=activity]", title: "History & sync", body: "The studio timeline and your NAS connection live here.", needs: "click History & sync", ok: view === "activity" },
    { target: "[data-t=syncpanel]", title: "Your NAS, without the wait", body: "Files live on your PC, so work never waits on the network. When the NAS is reachable Stratum syncs in the background; when it isn’t, changes queue up. If two people edit the same file, both versions are kept." },
    { title: "Add files by dropping them", body: "Drag files or folders anywhere into the window. Stratum copies them in, makes previews, tags them and saves the first version.", art: "drop" },
    { title: "You’re ready", body: "Press Ctrl+K any time for quick actions. Set up your own space now, or explore on your own. Your choice, and you can replay this tour from the sidebar." },
  ];

  if (!legalOk) return <Gate onAccept={accept} onDecline={() => { call("quit").catch(() => window.close()); }} />;
  if (wizard) return <Wizard start={wizard.start} mode={wizard.mode} onTour={startDemo} onSkip={() => { localStorage.setItem("seen", "1"); setWizard(null); }} onDone={async (cfg, rem, t) => { await openVault(cfg, rem); if (t) startDemo(); }} />;
  if (recover) return (
    <Page><h2>Can’t open your space</h2><p className="lead sm">{err}</p>
      <p className="hint">If it’s on a NAS or external drive, reconnect it first. Your files and version history are untouched.</p>
      <div className="row"><button className="primary" onClick={boot}>Try again</button><button className="ghostb" onClick={() => { setRecover(false); setErr(""); }}>Start from the home screen</button></div></Page>
  );
  if (booting) return <Page><h2>Opening your space…</h2></Page>;
  if (!vault) return (
    <Home spaces={spaces} busy={busy} err={err} onTour={startDemo} onFolder={quickOpen}
      onNew={() => setWizard({ start: 1, mode: "hub" })} onJoin={() => setWizard({ start: 3, mode: "join" })}
      onOpen={(c) => { setErr(""); openVault(c, null).catch((e) => setErr(String(e))); }}
      onForget={(c) => { localStorage.setItem("spaces", JSON.stringify(getSpaces().filter((x) => x.local !== c.local))); setSpaces(getSpaces()); }} />
  );

  const cmds: [string, () => void][] = [["Open Settings", () => setView("settings")], ["About Stratum", () => setAbout(true)], ["Keyboard shortcuts", () => setHelp(true)], ["Licenses & policies", () => setView("legal")], ["Go to Overview", () => setView("overview")], ["Go to Library", () => setView("library")], ["Go to History & sync", () => setView("activity")], ["Sync with NAS now", sync], ["Add files…", addFiles], ["Replay the tour", startDemo], ["Create a new space…", () => setWizard({ start: 1, mode: "hub" })], ["Switch space", switchVault]];

  return (
    <div className="app">
      <nav>
        <div className="brand"><i /><span className="t">Stratum<small>by Arkynox</small></span></div>
        {(["overview", "library", "activity"] as ("overview" | "library" | "activity")[]).map((v) => (
          <button key={v} data-t={v} title={{ overview: "Overview", library: "Library", activity: "History & sync" }[v]} className={view === v ? "on" : ""} onClick={() => setView(v)}>
            {Ic[v]}<span className="t">{{ overview: "Overview", library: "Library", activity: "History & sync" }[v]}</span>{v === "library" && stats ? <em>{stats.assets}</em> : null}
          </button>
        ))}
        <button title="Add files" onClick={addFiles}>{Ic.add}<span className="t">Add files…</span></button>
        <div className="spacer" />
        <button data-t="settings" title="Settings" className={view === "settings" || view === "legal" ? "on" : ""} onClick={() => setView("settings")}>{Ic.settings}<span className="t">Settings</span></button>
        <button className={"syncchip " + syncCls} title={syncText} onClick={() => setView("activity")}><i /><span className="t">{syncText}</span></button>
        <div className={"ai " + (stats?.ollama ? "up" : "down")} title="Local AI"><span className="t">{stats?.ollama ? "Local AI connected" : "Local AI offline"}</span></div>
        <div className="vault" title={vault}><button className="av" onClick={() => setPal("")} aria-label="Actions">{(demo ? "D" : base(vault)).slice(0, 1).toUpperCase()}</button><b>{demo ? "Demo space" : base(vault)}</b><span>{vault}</span><span><button className="link" onClick={switchVault}>Switch space</button> · <button className="link" onClick={startDemo}>Tour</button></span></div>
        <button className="aboutlink" onClick={() => setAbout(true)}>About · Arkynox</button>
      </nav>

      <main>
        <div className="top">
          <input ref={searchRef} data-t="search" className="search" value={q} onChange={(e) => { setQ(e.target.value); if (!q) setView("library"); }} placeholder="Search by meaning: “red desert sector map”   ( / )" />
          {busy && <span className="pill"><i className="spin" />Working…</span>}
          <button className="ghostb" onClick={() => setPal("")} title="Quick actions (Ctrl+K)">Actions</button>
        </div>
        {err && <div className="banner" role="alert"><div><b>Something needs your attention</b><span>{err}</span></div><button className="link" onClick={async () => note((await copy(err)) ? "Details copied." : "Couldn’t copy.")}>Copy details</button><button className="icon" onClick={() => setErr("")} aria-label="Dismiss">✕</button></div>}

        {view === "overview" && !stats && <div className="cards" aria-busy="true">{[0, 1, 2, 3].map((k) => <div className="card" key={k}><span className="skel line" /><span className="skel big" /></div>)}</div>}
        {view === "overview" && stats && (
          <>
            <section className="notes">
              {stats.network && <p><b>Network folder detected.</b> Stratum keeps its index on this PC and checks for changes every 10 seconds. For best speed, use a local working copy with the NAS as the shared hub.</p>}
              {!stats.remote && !demo && <p><b>No NAS connected.</b> Your work is safe on this PC. Connect a studio NAS for team sync and backup. <button className="link" onClick={() => setView("activity")}>Connect</button></p>}
              {!stats.ollama && <p><b>Local AI isn’t running.</b> Automatic tags and search by meaning are paused; keyword search still works.</p>}
              {stats.ollama && pending > 0 && <p><b>Tagging {pending} asset{pending === 1 ? "" : "s"}…</b><span className="meter"><i style={{ width: `${((stats.assets - pending) / stats.assets) * 100}%` }} /></span></p>}
            </section>
            <section className="cards" data-t="cards">
              {[["Assets", stats.assets.toLocaleString(), "in this vault", "#2b50ff"], ["Storage used", fmt(stats.bytes), `${stats.by_kind.length} file types`, "#e69a1a"],
                ["Tagged", stats.assets ? Math.round((stats.tagged / stats.assets) * 100) + "%" : "–", `${stats.tagged} of ${stats.assets}`, "#00a389"], ["Versions saved", stats.commits.toLocaleString(), "automatic, no commands", "#b4439a"]].map(([l, v, s, c]) => (
                <div className="card" key={l}><span className="lbl"><i style={{ background: c }} />{l}</span><strong>{v}</strong><small>{s}</small></div>
              ))}
            </section>
            <div className="two">
              <section className="panel topo"><h2>Storage by type</h2>
                <div className="bars">{stats.by_kind.map(([k, b]) => (
                  <div className="bar" key={k}><b>{fmt(b)}</b><div className="track"><div className="fill" style={{ height: `${(b / maxKind) * 100}%`, background: KC[k] }} /></div><span>{k}</span></div>))}</div>
              </section>
              <section className="panel"><h2>Recently changed</h2>
                {assets.length === 0 ? <p className="empty">Nothing here yet. Drag files into this window.</p> :
                  <table><tbody>{assets.slice(0, 7).map((a) => (
                    <tr key={a.path} onClick={() => setSel(a)} tabIndex={0}><td><div className="mini"><Thumb a={a} /></div></td><td><b>{a.name}</b><small>{fmt(a.size)}</small></td>
                      <td><span className={"st " + (a.tagged ? "ok" : "wait")}>{a.tagged ? "Tagged" : "Pending"}</span></td><td className="r">{ago(a.mtime)}</td></tr>))}</tbody></table>}
              </section>
            </div>
          </>
        )}

        {view === "library" && (
          <>
            <div className="bar2">
              <div className="chips">{kinds.map((k) => <button key={k} className={k === kind ? "on" : ""} onClick={() => setKind(k)}>{k}</button>)}</div>
              <div className="tools"><select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort"><option value="recent">Recent</option><option value="name">Name</option><option value="size">Largest</option></select>
                <button className="icon" onClick={() => setDense(!dense)} aria-label="Toggle layout">{dense ? "▦" : "☰"}</button></div>
            </div>
            {topTags.length > 0 && <div className="chips small">{tag && <button className="on" onClick={() => setTag("")}>{tag} ×</button>}
              {topTags.filter(([t]) => t !== tag).map(([t, n]) => <button key={t} onClick={() => setTag(t)}>{t} <em>{n}</em></button>)}</div>}
            <span className="count">{shown.length} {results ? "matches, best first" : "assets"}</span>
            {loading ? <div className="grid">{Array.from({ length: 12 }, (_, k) => <div className="skel tile-skel" key={k} />)}</div> : shown.length === 0 ? (
              <div className="empty big"><div className="dropart"><i /><b /><span>drop</span></div><p>{results ? "No matches. Try describing it differently." : "Drag files or folders anywhere in this window to add them."}</p></div>
            ) : dense ? (
              <table className="list"><tbody>{shown.map((a) => (
                <tr key={a.path} onClick={() => setSel(a)} tabIndex={0} className={sel?.path === a.path ? "on" : ""}><td><div className="mini"><Thumb a={a} /></div></td><td><b>{a.name}</b><small>{a.path}</small></td><td className="hide-sm">{a.kind}</td><td className="hide-sm">{fmt(a.size)}</td><td className="r">{ago(a.mtime)}</td></tr>))}</tbody></table>
            ) : (
              <div className="grid" data-t="grid">{shown.map((a) => (
                <button key={a.path} className={"tile" + (sel?.path === a.path ? " on" : "")} onClick={() => setSel(a)}>
                  <div className="frame"><Thumb a={a} />{a.tags && <div className="ov">{tagList(a.tags).slice(0, 5).map((t) => <span key={t}>{t}</span>)}</div>}</div><b>{a.name}</b><span>{fmt(a.size)} · {a.kind}</span>
                </button>))}</div>
            )}
          </>
        )}

        {view === "activity" && (
          <div className="two">
            <section className="panel"><h2>Version history</h2>
              <ul className="timeline">{log.map((c) => <li key={c.hash + c.when}><b>{c.msg}</b><span>{c.hash} · {c.when} · {c.author}</span></li>)}</ul></section>
            <section className="panel" data-t="syncpanel"><h2>Studio sync</h2>
              <p className="lead sm">Connect a shared repository on your NAS (a folder path) or a Git server on your LAN, VPN or WAN (an ssh:// or https:// address). Work continues offline and syncs automatically when the connection returns.</p>
              <input className="field" value={remote} onChange={(e) => setRemote(e.target.value)} placeholder="\\nas\studio\stratum-vault.git  or  ssh://git@server/assets.git" />
              <button className="primary" onClick={sync} disabled={syncing || !remote}>{syncing ? "Syncing…" : "Sync now"}</button>
              <p className="hint">If you and a teammate edit the same file, your version stays in place and theirs is saved next to it as “(conflict from teammate)”. Nothing is overwritten.</p>
            </section>
          </div>
        )}
        {view === "settings" && <Settings name={author} onName={saveName} theme={theme} onTheme={setTheme} vault={demo ? "Demo space" : vault} stats={stats} demo={demo} onSwitch={switchVault} onTour={startDemo} onHelp={() => setHelp(true)} onAbout={() => setAbout(true)} onLegal={() => setView("legal")} diag={diag} note={note} />}
        {view === "legal" && <LegalView onBack={() => setView("settings")} />}
      </main>
      {sel && <Detail a={sel} onClose={() => setSel(null)} onChanged={load} note={note} onPick={() => setPicked(true)} ask={setAsk} />}
      {drag && <div className="drop"><div>Drop to add to the vault</div></div>}
      {toast && <div className="toast" role="status">{toast}</div>}
      {ask && <Modal title={ask.title} onClose={() => setAsk(null)}><p>{ask.body}</p><div className="row end"><button className="ghostb" onClick={() => setAsk(null)}>Cancel</button><button className="primary" onClick={async () => { const a = ask; setAsk(null); try { await a.run(); } catch (e) { setErr(String(e)); } }}>{ask.label}</button></div></Modal>}
      {about && <About onClose={() => setAbout(false)} onLegal={() => setView("legal")} diag={diag} note={note} />}
      {help && <Modal title="Keyboard shortcuts" onClose={() => setHelp(false)}><dl className="kv keys"><dt><kbd>/</kbd></dt><dd>Search your assets</dd><dt><kbd>Ctrl</kbd> + <kbd>K</kbd></dt><dd>Quick actions</dd><dt><kbd>?</kbd></dt><dd>Show this list</dd><dt><kbd>Esc</kbd></dt><dd>Close the open panel</dd><dt>Drag and drop</dt><dd>Drop files or folders anywhere to add them</dd></dl></Modal>}
      {pal !== null && (
        <div className="cmdbg" onClick={() => setPal(null)}><div className="cmd" onClick={(e) => e.stopPropagation()}>
          <input autoFocus value={pal} onChange={(e) => setPal(e.target.value)} placeholder="Type a command…"
            onKeyDown={(e) => { if (e.key === "Enter") { const m = cmds.find(([n]) => n.toLowerCase().includes(pal.toLowerCase())); if (m) { m[1](); setPal(null); } } }} />
          {cmds.filter(([n]) => n.toLowerCase().includes(pal.toLowerCase())).map(([n, f]) => <button key={n} onClick={() => { f(); setPal(null); }}>{n}</button>)}
        </div></div>
      )}
      {demo && tour !== null && <Tour steps={steps} i={tour} onNext={() => setTour(tour + 1)} onBack={() => setTour(Math.max(0, tour - 1))} onExit={() => exitDemo("home")}
        finish={vaultRef.current ? { label: "Back to my space", onClick: () => exitDemo("home") } : { label: "Set up my space", onClick: () => exitDemo("setup") }}
        alt={vaultRef.current ? undefined : { label: "Explore on my own", onClick: () => exitDemo("home") }} />}
    </div>
  );
}
