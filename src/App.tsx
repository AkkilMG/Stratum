import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { getCurrentWebview } from "@tauri-apps/api/webview";
import { open } from "@tauri-apps/plugin-dialog";
import "./styles.css";

type Asset = { path: string; name: string; kind: string; size: number; mtime: number; tags: string; tagged: boolean };
type Stats = { assets: number; bytes: number; tagged: number; commits: number; by_kind: [string, number][]; ollama: boolean; lfs: boolean };
type Commit = { hash: string; author: string; when: string; msg: string };
type View = "overview" | "library" | "activity";

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
    invoke<string | null>("thumb", { path: a.path }).then((s) => { cache.set(key, s); setSrc(s); });
  }, [key]);
  return src ? <img src={src} alt={a.name} loading="lazy" /> : <span className="glyph" style={{ color: KC[a.kind] }}>{a.kind}</span>;
}

function Detail({ a, onClose, onChanged, note }: { a: Asset; onClose: () => void; onChanged: () => void; note: (m: string) => void }) {
  const [log, setLog] = useState<Commit[]>([]);
  const [pick, setPick] = useState<Commit | null>(null);
  const [old, setOld] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  useEffect(() => { setPick(null); setOld(null); invoke<Commit[]>("history", { path: a.path }).then(setLog); }, [a.path, a.mtime]);
  useEffect(() => { setOld(null); if (pick) invoke<string | null>("version_preview", { path: a.path, hash: pick.hash }).then(setOld); }, [pick]);
  const tags = tagList(a.tags);
  const save = async (t: string[]) => { await invoke("set_tags", { path: a.path, tags: t.join(", ") }); onChanged(); };
  const restore = async () => { if (!pick) return; await invoke("restore", { path: a.path, hash: pick.hash }); note(`Restored ${a.name} to ${pick.hash}`); onChanged(); };
  return (
    <aside className="drawer">
      <header><div><h3>{a.name}</h3><p>{a.path}</p></div><button className="icon" onClick={onClose} aria-label="Close">✕</button></header>
      <div className="compare">
        <figure><div className="frame"><Thumb a={a} /></div><figcaption>Current</figcaption></figure>
        {pick && <figure><div className="frame">{old ? <img src={old} /> : <span className="glyph">No preview</span>}</div><figcaption>{pick.hash} · {pick.when}</figcaption></figure>}
      </div>
      <dl><dt>Type</dt><dd>{a.kind}</dd><dt>Size</dt><dd>{fmt(a.size)}</dd><dt>Modified</dt><dd>{ago(a.mtime)}</dd></dl>
      <h4>Tags</h4>
      <div className="tags">
        {tags.map((t) => <span key={t}>{t}<button aria-label={`Remove ${t}`} onClick={() => save(tags.filter((x) => x !== t))}>×</button></span>)}
        <input value={draft} placeholder={a.tagged ? "Add tag" : "AI tagging pending…"} onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && draft.trim()) { save([...tags, draft.trim().toLowerCase()]); setDraft(""); } }} />
      </div>
      <h4>Versions <small>{log.length}</small></h4>
      <ul className="log">
        {log.map((c) => (
          <li key={c.hash} className={pick?.hash === c.hash ? "on" : ""} onClick={() => setPick(c)}>
            <b>{c.msg}</b><span>{c.hash} · {c.when}</span>
          </li>
        ))}
      </ul>
      <button className="primary" disabled={!pick} onClick={restore}>{pick ? `Restore ${pick.hash}` : "Pick a version to restore"}</button>
    </aside>
  );
}

export default function App() {
  const [vault, setVault] = useState<string | null>(null);
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
  const searchRef = useRef<HTMLInputElement>(null);

  const note = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3500); };
  const load = useCallback(async () => {
    try {
      const [s, a] = await Promise.all([invoke<Stats>("stats"), invoke<Asset[]>("list_assets")]);
      setStats(s); setAssets(a); setSel((c) => (c ? a.find((x) => x.path === c.path) ?? null : null));
    } catch (e) { setErr(String(e)); }
  }, []);

  const openVault = useCallback(async (path: string) => {
    setBusy(true); setErr("");
    try { await invoke("open_vault", { path }); localStorage.setItem("vault", path); setVault(path); await load(); }
    catch (e) { setErr(String(e)); setBusy(false); }
  }, [load]);
  const choose = async () => { const p = await open({ directory: true }); if (typeof p === "string") openVault(p); };

  useEffect(() => { const v = localStorage.getItem("vault"); if (v) openVault(v); }, [openVault]);
  useEffect(() => {
    const subs = [listen("vault-changed", load), listen<boolean>("busy", (e) => setBusy(e.payload)),
      getCurrentWebview().onDragDropEvent((ev) => {
        const p = ev.payload;
        if (p.type === "enter" || p.type === "over") setDrag(true);
        else if (p.type === "drop") { setDrag(false); invoke<number>("import_files", { paths: p.paths }).then((n) => note(`Imported ${n} file${n === 1 ? "" : "s"}. Versioning in the background.`)).catch((e) => setErr(String(e))); }
        else setDrag(false);
      })];
    return () => { subs.forEach((s) => s.then((f) => f())); };
  }, [load]);
  useEffect(() => {
    if (!q.trim()) return setResults(null);
    const t = setTimeout(() => invoke<Asset[]>("search", { query: q }).then(setResults).catch((e) => setErr(String(e))), 300);
    return () => clearTimeout(t);
  }, [q]);
  useEffect(() => {
    if (view !== "activity" || !vault) return;
    invoke<Commit[]>("activity").then(setLog); invoke<string>("get_remote").then(setRemote);
  }, [view, vault, stats?.commits]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") { e.preventDefault(); searchRef.current?.focus(); }
      if (e.key === "Escape") setSel(null);
    };
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, []);

  const sync = async () => {
    setSyncing(true);
    try { if (remote) await invoke("set_remote", { url: remote }); note(await invoke<string>("sync")); } catch (e) { setErr(String(e)); } finally { setSyncing(false); }
  };

  const topTags = useMemo(() => {
    const m = new Map<string, number>();
    assets.forEach((a) => tagList(a.tags).forEach((t) => m.set(t, (m.get(t) ?? 0) + 1)));
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 14);
  }, [assets]);
  const kinds = ["All", ...Array.from(new Set(assets.map((a) => a.kind)))];
  const shown = useMemo(() => {
    const l = (results ?? assets).filter((a) => (kind === "All" || a.kind === kind) && (!tag || tagList(a.tags).includes(tag)));
    if (!results) l.sort((a, b) => (sort === "name" ? a.name.localeCompare(b.name) : sort === "size" ? b.size - a.size : b.mtime - a.mtime));
    return l;
  }, [results, assets, kind, tag, sort]);
  const maxKind = Math.max(1, ...(stats?.by_kind.map((k) => k[1]) ?? [1]));
  const pending = stats ? stats.assets - stats.tagged : 0;

  if (!vault) return (
    <div className="welcome">
      <div className="contours" aria-hidden />
      <div className="wbody">
        <h1>Stratum</h1>
        <p className="lead">Every texture, map and model in one local vault. Versioned automatically, searchable by what it looks like, and never uploaded anywhere.</p>
        <button className="primary big" onClick={choose}>Open asset folder</button>
        <p className="hint">Works offline. Optional: install Ollama for AI tagging and semantic search.</p>
        {err && <p className="err">{err}</p>}
      </div>
    </div>
  );

  return (
    <div className="app">
      <nav>
        <div className="brand"><i />Stratum</div>
        {(["overview", "library", "activity"] as View[]).map((v) => (
          <button key={v} className={view === v ? "on" : ""} onClick={() => setView(v)}>
            {{ overview: "Overview", library: "Library", activity: "History & sync" }[v]}
            {v === "library" && stats ? <em>{stats.assets}</em> : null}
          </button>
        ))}
        <div className="spacer" />
        <div className={"ai " + (stats?.ollama ? "up" : "down")}>{stats?.ollama ? "Local AI connected" : "Local AI offline"}</div>
        <div className="vault" title={vault}><b>{vault.split(/[\\/]/).pop()}</b><span>{vault}</span><button className="link" onClick={choose}>Switch vault</button></div>
      </nav>
      <main>
        <div className="top">
          <input ref={searchRef} className="search" value={q} onChange={(e) => { setQ(e.target.value); if (!q) setView("library"); }} placeholder="Search by meaning: “red desert sector map”   ( / )" />
          {busy && <span className="pill"><i className="spin" />Working…</span>}
        </div>
        {err && <p className="err" onClick={() => setErr("")}>{err}</p>}

        {view === "overview" && stats && (
          <>
            {(!stats.lfs || !stats.ollama || pending > 0) && (
              <section className="notes">
                {!stats.lfs && <p><b>Git LFS not found.</b> Large binaries will bloat the repository. Install git-lfs, then reopen the vault.</p>}
                {!stats.ollama && <p><b>Ollama isn’t running.</b> Tagging and semantic search are paused; keyword search still works.</p>}
                {stats.ollama && pending > 0 && <p><b>Tagging {pending} asset{pending === 1 ? "" : "s"}…</b> <span className="meter"><i style={{ width: `${((stats.assets - pending) / stats.assets) * 100}%` }} /></span></p>}
              </section>
            )}
            <section className="cards">
              {[["Assets", stats.assets.toLocaleString(), "in this vault", "#2b50ff"], ["Storage used", fmt(stats.bytes), `${stats.by_kind.length} file types`, "#e69a1a"],
                ["Tagged", stats.assets ? Math.round((stats.tagged / stats.assets) * 100) + "%" : "–", `${stats.tagged} of ${stats.assets}`, "#00a389"], ["Versions saved", stats.commits.toLocaleString(), "automatic, no commands", "#b4439a"]].map(([l, v, s, c]) => (
                <div className="card" key={l}><span className="lbl"><i style={{ background: c }} />{l}</span><strong>{v}</strong><small>{s}</small></div>
              ))}
            </section>
            <div className="two">
              <section className="panel topo">
                <h2>Storage by type</h2>
                <div className="bars">
                  {stats.by_kind.map(([k, b]) => (
                    <div className="bar" key={k}><b>{fmt(b)}</b><div className="track"><div className="fill" style={{ height: `${(b / maxKind) * 100}%`, background: KC[k] }} /></div><span>{k}</span></div>
                  ))}
                </div>
              </section>
              <section className="panel">
                <h2>Recently changed</h2>
                <table><tbody>{assets.slice(0, 7).map((a) => (
                  <tr key={a.path} onClick={() => setSel(a)} tabIndex={0}>
                    <td><div className="mini"><Thumb a={a} /></div></td><td><b>{a.name}</b><small>{fmt(a.size)}</small></td>
                    <td><span className={"st " + (a.tagged ? "ok" : "wait")}>{a.tagged ? "Tagged" : "Pending"}</span></td><td className="r">{ago(a.mtime)}</td>
                  </tr>))}</tbody></table>
              </section>
            </div>
          </>
        )}

        {view === "library" && (
          <>
            <div className="bar2">
              <div className="chips">{kinds.map((k) => <button key={k} className={k === kind ? "on" : ""} onClick={() => setKind(k)}>{k}</button>)}</div>
              <div className="tools">
                <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort"><option value="recent">Recent</option><option value="name">Name</option><option value="size">Largest</option></select>
                <button className="icon" onClick={() => setDense(!dense)} aria-label="Toggle layout">{dense ? "▦" : "☰"}</button>
              </div>
            </div>
            {topTags.length > 0 && <div className="chips small">{tag && <button className="on" onClick={() => setTag("")}>{tag} ×</button>}
              {topTags.filter(([t]) => t !== tag).map(([t, n]) => <button key={t} onClick={() => setTag(t)}>{t} <em>{n}</em></button>)}</div>}
            <span className="count">{shown.length} {results ? "matches, best first" : "assets"}</span>
            {shown.length === 0 ? <p className="empty">{results ? "No matches. Try describing it differently." : "Drag files or folders anywhere in this window to add them."}</p> : dense ? (
              <table className="list"><tbody>{shown.map((a) => (
                <tr key={a.path} onClick={() => setSel(a)} tabIndex={0} className={sel?.path === a.path ? "on" : ""}>
                  <td><div className="mini"><Thumb a={a} /></div></td><td><b>{a.name}</b><small>{a.path}</small></td><td>{a.kind}</td><td>{fmt(a.size)}</td><td className="r">{ago(a.mtime)}</td></tr>))}</tbody></table>
            ) : (
              <div className="grid">{shown.map((a) => (
                <button key={a.path} className={"tile" + (sel?.path === a.path ? " on" : "")} onClick={() => setSel(a)}>
                  <div className="frame"><Thumb a={a} /></div><b>{a.name}</b><span>{fmt(a.size)} · {a.kind}</span>
                </button>))}</div>
            )}
          </>
        )}

        {view === "activity" && (
          <div className="two">
            <section className="panel">
              <h2>Version history</h2>
              <ul className="timeline">{log.map((c) => <li key={c.hash}><b>{c.msg}</b><span>{c.hash} · {c.when}</span></li>)}</ul>
            </section>
            <section className="panel">
              <h2>Studio sync</h2>
              <p className="lead sm">Push this vault to a Git remote on your LAN, a NAS or a self-hosted server. Work continues offline and syncs when you reconnect.</p>
              <input className="field" value={remote} onChange={(e) => setRemote(e.target.value)} placeholder="ssh://git@nas.local/studio/assets.git" />
              <button className="primary" onClick={sync} disabled={syncing || !remote}>{syncing ? "Syncing…" : "Sync now"}</button>
              <p className="hint">If both sides changed the same binary, your local copy wins and the other version stays in history.</p>
            </section>
          </div>
        )}
      </main>
      {sel && <Detail a={sel} onClose={() => setSel(null)} onChanged={load} note={note} />}
      {drag && <div className="drop"><div>Drop to add to the vault</div></div>}
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}
