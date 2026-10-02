import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { getCurrentWebview } from "@tauri-apps/api/webview";
import { open } from "@tauri-apps/plugin-dialog";
import { call, setDemo } from "./api";
import { Tour, Step } from "./Tour";
import Wizard from "./Wizard";
import type { Asset, Cfg, Commit, Stats } from "./types";
import "./styles.css";

type View = "overview" | "library" | "activity";
type Sync = { ok: boolean; msg: string; at: number };
const fmt = (b: number) => (b >= 1e9 ? (b / 1e9).toFixed(2) + " GB" : b >= 1e6 ? (b / 1e6).toFixed(1) + " MB" : Math.max(0, Math.round(b / 1e3)) + " KB");
const ago = (t: number) => { const s = Date.now() / 1000 - t; return s < 60 ? "just now" : s < 3600 ? `${Math.floor(s / 60)} min ago` : s < 86400 ? `${Math.floor(s / 3600)} h ago` : `${Math.floor(s / 86400)} d ago`; };
const KC: Record<string, string> = { Image: "#2b50ff", Vector: "#00a389", Source: "#e69a1a", Model: "#b4439a", Audio: "#6b7a90", Other: "#98a3b3" };
const tagList = (t: string) => t.split(",").map((x) => x.trim()).filter(Boolean);
const cache = new Map<string, string | null>();

function Thumb({ a }: { a: Asset }) {
  const key = a.path + a.mtime;
  const [src, setSrc] = useState<string | null | undefined>(cache.get(key));
  useEffect(() => {
    if (cache.has(key)) return setSrc(cache.get(key));
    call<string | null>("thumb", { path: a.path }).then((s) => { cache.set(key, s); setSrc(s); });
  }, [key]);
  return src ? <img src={src} alt={a.name} loading="lazy" /> : <span className="glyph" style={{ color: KC[a.kind] }}>{a.kind}</span>;
}

function Detail({ a, onClose, onChanged, note, onPick }: { a: Asset; onClose: () => void; onChanged: () => void; note: (m: string) => void; onPick: () => void }) {
  const [log, setLog] = useState<Commit[]>([]);
  const [pick, setPick] = useState<Commit | null>(null);
  const [old, setOld] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  useEffect(() => { setPick(null); setOld(null); call<Commit[]>("history", { path: a.path }).then(setLog); }, [a.path, a.mtime]);
  useEffect(() => { setOld(null); if (pick) { onPick(); call<string | null>("version_preview", { path: a.path, hash: pick.hash }).then(setOld); } }, [pick]);
  const tags = tagList(a.tags);
  const save = async (t: string[]) => { await call("set_tags", { path: a.path, tags: t.join(", ") }); onChanged(); };
  const restore = async () => { if (!pick) return; await call("restore", { path: a.path, hash: pick.hash }); note(`Restored ${a.name} to ${pick.hash}. Saved as a new version.`); onChanged(); };
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
  const [wizard, setWizard] = useState<{ start: number } | null>(null);
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
  const [sort, setSort] = useState("recent");
  const [dense, setDense] = useState(false);
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
  const real = useRef<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const note = (m: string) => { setToast(m); setTimeout(() => setToast(""), 4500); };

  const load = useCallback(async () => {
    try {
      const [s, a] = await Promise.all([call<Stats>("stats"), call<Asset[]>("list_assets")]);
      setStats(s); setAssets(a); setSel((c) => (c ? a.find((x) => x.path === c.path) ?? null : null));
    } catch (e) { setErr(String(e)); }
  }, []);

  const openVault = useCallback(async (cfg: Cfg, remote: string | null) => {
    setBusy(true); setErr("");
    try {
      await call("set_author", { name: cfg.name || "Me" });
      await call("open_vault", { path: cfg.local, lfs: cfg.lfs, remote });
      localStorage.setItem("cfg", JSON.stringify(cfg)); setVault(cfg.local); setWizard(null); setRecover(false); await load();
    } catch (e) { setBusy(false); throw e; }
  }, [load]);

  const startDemo = () => {
    real.current = vault; setDemo(true); setDemoState(true); setWizard(null); setVault("Demo vault"); setView("overview"); setSel(null); setQ(""); setPicked(false); load(); setTour(0);
  };
  const exitDemo = () => {
    setDemo(false); setDemoState(false); setTour(null); setSel(null); setQ(""); setView("overview");
    if (real.current) { setVault(real.current); load(); } else { setVault(null); setAssets([]); setStats(null); setWizard({ start: 1 }); }
  };
  const boot = useCallback(() => {
    const raw = localStorage.getItem("cfg");
    if (!raw) return setWizard({ start: 0 });
    const cfg = JSON.parse(raw) as Cfg;
    openVault(cfg, null).catch((e) => { setErr(String(e)); setRecover(true); });
  }, [openVault]);
  useEffect(boot, [boot]);

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
      else if (e.key === "Escape") { setSel(null); setPal(null); }
    };
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, []);

  const sync = async () => {
    setSyncing(true);
    try { if (remote) await call("set_remote", { url: remote }); note(await call<string>("sync")); await load(); } catch (e) { setErr(String(e)); } finally { setSyncing(false); }
  };
  const addFiles = async () => { const p = await open({ multiple: true }); if (p) { const n = await call<number>("import_files", { paths: Array.isArray(p) ? p : [p] }); note(`Added ${n} file${n === 1 ? "" : "s"}.`); } };
  const switchVault = () => { localStorage.removeItem("cfg"); setVault(null); setStats(null); setAssets([]); setWizard({ start: 2 }); };

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
    { title: "You’re ready", body: "Press Ctrl+K at any time for quick actions. Now let’s set up your own vault." },
  ];

  if (wizard) return <Wizard start={wizard.start} onTour={startDemo} onDone={async (cfg, rem, t) => { await openVault(cfg, rem); if (t) startDemo(); }} />;
  if (recover) return (
    <div className="wiz"><div className="contours" aria-hidden /><section className="wmain"><h2>Can’t open your vault</h2><p className="lead sm">{err}</p>
      <p className="hint">If your vault is on a NAS or external drive, reconnect it first. Your work and version history are untouched.</p>
      <div className="row"><button className="primary" onClick={() => { setErr(""); setRecover(false); boot(); }}>Try again</button><button className="ghostb" onClick={() => { setRecover(false); setWizard({ start: 2 }); }}>Choose a different vault</button></div></section></div>
  );
  if (!vault) return <div className="wiz"><div className="contours" aria-hidden /><section className="wmain"><h2>Opening your vault…</h2></section></div>;

  const cmds: [string, () => void][] = [["Go to Overview", () => setView("overview")], ["Go to Library", () => setView("library")], ["Go to History & sync", () => setView("activity")], ["Sync with NAS now", sync], ["Add files…", addFiles], ["Replay the tour", startDemo], ["Switch vault or run setup", switchVault]];

  return (
    <div className="app">
      <nav>
        <div className="brand"><i />Stratum</div>
        {(["overview", "library", "activity"] as View[]).map((v) => (
          <button key={v} data-t={v} className={view === v ? "on" : ""} onClick={() => setView(v)}>
            {{ overview: "Overview", library: "Library", activity: "History & sync" }[v]}{v === "library" && stats ? <em>{stats.assets}</em> : null}
          </button>
        ))}
        <button onClick={addFiles}>Add files…</button>
        <div className="spacer" />
        <button className={"syncchip " + syncCls} onClick={() => setView("activity")}><i />{syncText}</button>
        <div className={"ai " + (stats?.ollama ? "up" : "down")}>{stats?.ollama ? "Local AI connected" : "Local AI offline"}</div>
        <div className="vault" title={vault}><b>{demo ? "Demo vault" : vault.split(/[\\/]/).pop()}</b><span>{vault}</span><span><button className="link" onClick={switchVault}>Switch vault</button> · <button className="link" onClick={startDemo}>Tour</button></span></div>
      </nav>
      <main>
        <div className="top">
          <input ref={searchRef} data-t="search" className="search" value={q} onChange={(e) => { setQ(e.target.value); if (!q) setView("library"); }} placeholder="Search by meaning: “red desert sector map”   ( / )" />
          {busy && <span className="pill"><i className="spin" />Working…</span>}
          <button className="ghostb" onClick={() => setPal("")}>Ctrl K</button>
        </div>
        {err && <p className="err" onClick={() => setErr("")}>{err}</p>}

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
            {shown.length === 0 ? (
              <div className="empty big"><div className="dropart"><i /><b /><span>drop</span></div><p>{results ? "No matches. Try describing it differently." : "Drag files or folders anywhere in this window to add them."}</p></div>
            ) : dense ? (
              <table className="list"><tbody>{shown.map((a) => (
                <tr key={a.path} onClick={() => setSel(a)} tabIndex={0} className={sel?.path === a.path ? "on" : ""}><td><div className="mini"><Thumb a={a} /></div></td><td><b>{a.name}</b><small>{a.path}</small></td><td>{a.kind}</td><td>{fmt(a.size)}</td><td className="r">{ago(a.mtime)}</td></tr>))}</tbody></table>
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
      </main>
      {sel && <Detail a={sel} onClose={() => setSel(null)} onChanged={load} note={note} onPick={() => setPicked(true)} />}
      {drag && <div className="drop"><div>Drop to add to the vault</div></div>}
      {toast && <div className="toast" role="status">{toast}</div>}
      {pal !== null && (
        <div className="cmdbg" onClick={() => setPal(null)}><div className="cmd" onClick={(e) => e.stopPropagation()}>
          <input autoFocus value={pal} onChange={(e) => setPal(e.target.value)} placeholder="Type a command…"
            onKeyDown={(e) => { if (e.key === "Enter") { const m = cmds.find(([n]) => n.toLowerCase().includes(pal.toLowerCase())); if (m) { m[1](); setPal(null); } } }} />
          {cmds.filter(([n]) => n.toLowerCase().includes(pal.toLowerCase())).map(([n, f]) => <button key={n} onClick={() => { f(); setPal(null); }}>{n}</button>)}
        </div></div>
      )}
      {demo && tour !== null && <Tour steps={steps} i={tour} onNext={() => (tour >= steps.length - 1 ? exitDemo() : setTour(tour + 1))} onBack={() => setTour(Math.max(0, tour - 1))} onExit={exitDemo} />}
    </div>
  );
}
