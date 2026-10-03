import { useEffect, useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { call } from "./api";
import { Credits } from "./ui";
import type { Cfg } from "./types";

type Check = { git: boolean; lfs: boolean; ollama: boolean; vision: boolean; embed: boolean };
const STEPS = ["Welcome", "You", "Storage", "Folders", "Check", "Create"];
const isUrl = (s: string) => /:\/\/|@/.test(s);
const pick = async () => { const p = await open({ directory: true }); return typeof p === "string" ? p : ""; };
const I = {
  pc: <svg viewBox="0 0 48 48"><rect x="6" y="8" width="36" height="24" rx="3" /><path d="M18 40h12M24 32v8" /></svg>,
  nas: <svg viewBox="0 0 48 48"><rect x="3" y="10" width="24" height="17" rx="3" /><path d="M10 34h10M15 27v7" /><rect x="30" y="16" width="15" height="24" rx="3" /><path d="M34 22h7M34 28h7M34 34h3" /></svg>,
  team: <svg viewBox="0 0 48 48"><circle cx="18" cy="17" r="6" /><circle cx="33" cy="19" r="5" /><path d="M6 40c0-8 6-12 12-12s12 4 12 12M31 29c6 0 11 4 11 11" /></svg>,
};

export default function Wizard({ start = 0, mode, onTour, onSkip, onDone }: { start?: number; mode?: Cfg["mode"]; onTour: () => void; onSkip: () => void; onDone: (c: Cfg, remote: string | null, tour: boolean) => Promise<void> }) {
  const [i, setI] = useState(start);
  const [c, setC] = useState<Cfg>({ name: localStorage.getItem("author") ?? "", mode: mode ?? "hub", local: "", nas: "", lfs: false });
  const [chk, setChk] = useState<Check | null>(null);
  const [pull, setPull] = useState("");
  const [log, setLog] = useState<string[]>([]);
  const [err, setErr] = useState("");
  const [working, setWorking] = useState(false);
  const set = (p: Partial<Cfg>) => setC((o) => ({ ...o, ...p }));
  const recheck = () => call<Check>("system_check").then(setChk).catch(() => setChk(null));
  useEffect(() => { if (i === 4) recheck(); }, [i]);

  const needNas = c.mode !== "local";
  const foldersOk = !!c.local && (!needNas || !!c.nas);
  const can = [true, c.name.trim().length > 0, true, foldersOk, !!chk?.git, true][i];

  async function finish(tour: boolean) {
    setErr(""); setLog([]); setWorking(true);
    const add = (s: string) => setLog((l) => [...l, s]);
    try {
      localStorage.setItem("author", c.name || "Me");
      await call("set_author", { name: c.name || "Me" });
      let remote: string | null = null;
      if (c.mode === "hub" && c.nas) {
        if (isUrl(c.nas)) { remote = c.nas; add("Using your server address"); }
        else { add("Creating the shared repository on your NAS…"); remote = await call<string>("create_hub", { path: c.nas }); add("Shared repository ready"); }
      }
      if (c.mode === "join") { add("Downloading your local copy (large vaults take a while)…"); await call("join_hub", { remote: c.nas, dest: c.local }); add("Local copy ready"); }
      add("Indexing your folder…");
      await onDone(c, remote, tour);
    } catch (e) { setErr(String(e)); setWorking(false); }
  }
  const dl = async (m: string) => { setPull(m); try { await call("pull_model", { name: m }); } catch (e) { setErr(String(e)); } setPull(""); recheck(); };

  const row = (label: string, ok: boolean | undefined, req: string, help: string, act?: JSX.Element) => (
    <div className="crow" key={label}><i className={"dot " + (ok ? "ok" : req === "Required" ? "bad" : "warn")} /><div><b>{label}</b> <em>{req}</em><small>{ok ? "Ready" : help}</small></div>{!ok && act}</div>
  );

  return (
    <div className="wiz">
      <div className="contours" aria-hidden />
      <header className="wtop"><div className="brand"><i /><span>Stratum</span></div><Trail i={i} /><button className="link" onClick={onSkip}>Skip setup</button></header>
      <div className="wscroll"><section className="wmain">
        {i === 0 && <>
          <h1>Your studio’s assets, safe on your own machines.</h1>
          <p className="lead">Stratum keeps every version of every texture, map and model, finds files by what they look like, and works fully offline. Nothing is uploaded to anyone’s cloud.</p>
          <div className="row"><button className="primary big" onClick={() => setI(1)}>Set up my vault</button><button className="ghostb big" onClick={onTour}>Take the 60-second tour first</button><button className="link" onClick={onSkip}>Skip, I’ll explore on my own</button></div>
          <p className="hint">New here? The tour uses sample files, so you can’t break anything.</p><Credits />
        </>}
        {i === 1 && <>
          <h2>What should we call you?</h2>
          <p className="lead sm">Your name appears next to every change you save, so teammates can see who did what.</p>
          <input className="field big" autoFocus value={c.name} onChange={(e) => set({ name: e.target.value })} placeholder="e.g. Maya Chen" onKeyDown={(e) => e.key === "Enter" && can && setI(2)} />
        </>}
        {i === 2 && <>
          <h2>Where will your assets live?</h2>
          <p className="lead sm">Pick the setup that matches how your studio works. You can connect a NAS later.</p>
          <div className="modes">
            {([["local", I.pc, "Just this PC", "Files stay on this computer. Fastest option for solo work.", ""], ["hub", I.nas, "This PC + studio NAS", "Work on a fast local copy. A shared repository on your NAS keeps everyone in sync, and nothing stops if the NAS goes offline.", "Recommended for teams"], ["join", I.team, "Join my studio’s vault", "A teammate already set one up. Download a local copy and start.", ""]] as const).map(([m, ic, t, d, tag]) => (
              <button key={m} className={"mode" + (c.mode === m ? " on" : "")} onClick={() => set({ mode: m })}>{ic}<b>{t}</b><span>{d}</span>{tag && <em>{tag}</em>}</button>
            ))}
          </div>
          <details className="why"><summary>Why not edit directly on the NAS?</summary>
            Network drives are slow for thumbnails and databases, and several people writing the same version history at once can corrupt it. Stratum keeps your working copy local for speed and syncs with the NAS in the background, over LAN or VPN. If the NAS is unreachable, work continues and syncs when it’s back.</details>
        </>}
        {i === 3 && <>
          <h2>{c.mode === "join" ? "Connect to the studio vault" : c.mode === "hub" ? "Choose your folders" : "Choose your asset folder"}</h2>
          {c.mode === "join" && <Field label="Studio vault on the NAS" help="Pick the shared repository folder (ends in .git), or paste a server address like ssh://git@nas/assets.git." v={c.nas} set={(v) => set({ nas: v })} />}
          <Field label={c.mode === "join" ? "Empty folder for your local copy" : "Your working folder on this PC"} help={c.mode === "join" ? "Choose a new, empty folder on a fast local drive." : "Existing files are indexed in place. Nothing is moved or changed."} v={c.local} set={(v) => set({ local: v })} />
          {c.mode === "hub" && <Field label="Studio NAS location" help="Pick a folder on your mounted NAS (like Z:\ or \\nas\studio), or paste a server address for a remote Git server over WAN or VPN." v={c.nas} set={(v) => set({ nas: v })} />}
          <details className="why"><summary>Advanced</summary>
            <label className="chk"><input type="checkbox" checked={c.lfs} onChange={(e) => set({ lfs: e.target.checked })} /> My server supports Git LFS (Gitea, GitLab, GitHub). Leave off for a NAS folder.</label></details>
          {c.mode === "hub" && <button className="link" onClick={() => set({ mode: "local", nas: "" })}>Skip the NAS for now</button>}
        </>}
        {i === 4 && <>
          <h2>System check</h2>
          <p className="lead sm">Only Git is required. The local AI is optional and powers automatic tags and search by meaning.</p>
          <div className="checks">
            {!chk ? <p className="hint">Checking…</p> : <>
              {row("Git", chk.git, "Required", "Install Git from git-scm.com, then press Re-check.")}
              {row("Ollama (local AI)", chk.ollama, "Optional", "Install from ollama.com and keep it running.")}
              {row("Vision model (llava:7b)", chk.vision, "Optional", "Reads your images to suggest tags.", <button className="ghostb" disabled={!chk.ollama || !!pull} onClick={() => dl("llava:7b")}>{pull === "llava:7b" ? "Downloading…" : "Download"}</button>)}
              {row("Search model (nomic-embed-text)", chk.embed, "Optional", "Lets you search by meaning.", <button className="ghostb" disabled={!chk.ollama || !!pull} onClick={() => dl("nomic-embed-text")}>{pull === "nomic-embed-text" ? "Downloading…" : "Download"}</button>)}
              {row("Git LFS", chk.lfs, "Optional", "Only used if your server supports it.")}
            </>}
          </div>
          <button className="link" onClick={recheck}>Re-check</button>
        </>}
        {i === 5 && <>
          <h2>Ready to create your vault</h2>
          <dl className="sum"><dt>Name</dt><dd>{c.name}</dd><dt>Setup</dt><dd>{{ local: "This PC only", hub: c.nas ? "This PC + studio NAS" : "This PC only", join: "Joining a studio vault" }[c.mode]}</dd><dt>Local folder</dt><dd>{c.local}</dd>{c.nas && <><dt>NAS</dt><dd>{c.nas}</dd></>}</dl>
          {log.map((l) => <p className="step ok" key={l}>✓ {l}</p>)}
          {working && !err && <p className="step"><i className="spin" /> Working…</p>}
          <div className="row"><button className="primary big" disabled={working} onClick={() => finish(true)}>Create vault and show me around</button><button className="ghostb big" disabled={working} onClick={() => finish(false)}>Create vault</button></div>
        </>}
        {err && <p className="err">{err}</p>}
      </section></div>
      {i > 0 && <footer className="wfoot"><button className="ghostb" disabled={working} onClick={() => setI(i - 1)}>Back</button>{i < 5 && <button className="primary" disabled={!can} onClick={() => setI(i + 1)}>Continue</button>}</footer>}
    </div>
  );
}

function Field({ label, help, v, set }: { label: string; help: string; v: string; set: (v: string) => void }) {
  return (
    <div className="fld"><b>{label}</b><small>{help}</small>
      <div className="row"><input className="field" value={v} onChange={(e) => set(e.target.value)} placeholder="Choose a folder or paste an address" /><button className="ghostb" onClick={async () => { const p = await pick(); if (p) set(p); }}>Browse</button></div></div>
  );
}

function Trail({ i }: { i: number }) {
  return (
    <ol className="trail" aria-label="Setup progress">
      {STEPS.map((s, k) => <li key={s} className={k === i ? "on" : k < i ? "past" : ""} aria-current={k === i ? "step" : undefined}><i>{k < i ? "✓" : k + 1}</i><span>{s}</span></li>)}
    </ol>
  );
}
