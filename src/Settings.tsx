import { useEffect, useState } from "react";
import { getVersion } from "@tauri-apps/api/app";
import { call } from "./api";
import { APP, getAcceptance } from "./legal";
import { ExtLink, Modal } from "./ui";
import type { Check, Stats } from "./types";

export const copy = async (t: string) => { try { await navigator.clipboard.writeText(t); return true; } catch { return false; } };

export function About({ onClose, onLegal, diag, note }: { onClose: () => void; onLegal: () => void; diag: () => Promise<string>; note: (m: string) => void }) {
  const [ver, setVer] = useState("");
  useEffect(() => { getVersion().then(setVer).catch(() => setVer("0.1.0")); }, []);
  return (
    <Modal title="About Stratum" onClose={onClose}>
      <div className="about">
        <div className="logo" aria-hidden />
        <h2>Stratum</h2><p className="hint">Version {ver}</p>
        <p className="lead sm">Local-first, versioned, searchable asset management for game studios.</p>
        <dl>
          <dt>A product of</dt><dd><ExtLink href={APP.site}>Arkynox</ExtLink></dd>
          <dt>Developed by</dt><dd>{APP.developer} · <ExtLink href={APP.github}>@AkkilMG</ExtLink> on GitHub</dd>
          <dt>Website</dt><dd><ExtLink href={APP.site}>arkynox.com</ExtLink></dd>
        </dl>
        <p className="hint">© {APP.year} Arkynox. All rights reserved. Used under the Stratum End User License Agreement. Includes open-source software, listed under Licenses.</p>
        <div className="row"><button className="primary" onClick={() => { onClose(); onLegal(); }}>Licenses &amp; policies</button>
          <button className="ghostb" onClick={async () => note((await copy(await diag())) ? "Diagnostics copied. Paste them into your support request." : "Couldn’t copy to the clipboard.")}>Copy diagnostics</button></div>
      </div>
    </Modal>
  );
}

type P = { name: string; onName: (n: string) => void; theme: string; onTheme: (t: string) => void; vault: string; stats: Stats | null; demo: boolean;
  onSwitch: () => void; onTour: () => void; onHelp: () => void; onAbout: () => void; onLegal: () => void; diag: () => Promise<string>; note: (m: string) => void };

export function Settings(p: P) {
  const [name, setName] = useState(p.name);
  const [chk, setChk] = useState<Check | null>(null);
  const [pull, setPull] = useState("");
  const acc = getAcceptance();
  const recheck = () => call<Check>("system_check").then(setChk).catch(() => {});
  useEffect(() => { recheck(); }, []);
  const dl = async (m: string) => { setPull(m); try { await call("pull_model", { name: m }); p.note(`${m} is ready.`); } catch (e) { p.note(String(e)); } setPull(""); recheck(); };
  const row = (label: string, ok: boolean | undefined, btn?: string) => (
    <div className="srow" key={label}><i className={"dot " + (ok ? "ok" : "warn")} /><span>{label}</span>
      {!ok && btn && <button className="ghostb" disabled={!chk?.ollama || !!pull} onClick={() => dl(btn)}>{pull === btn ? "Downloading…" : "Download"}</button>}</div>
  );
  const s = p.stats;
  return (
    <div className="settings">
      <h2>Settings</h2>
      <div className="sgrid">
        <section className="panel"><h3>Profile</h3><p className="hint">Shown next to your changes in the version history.</p>
          <div className="row"><input className="field" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && name.trim() && p.onName(name.trim())} placeholder="Your name" aria-label="Your name" />
            <button className="primary" disabled={!name.trim() || name.trim() === p.name} onClick={() => p.onName(name.trim())}>Save</button></div></section>
        <section className="panel"><h3>Appearance</h3><p className="hint">Match your system, or choose a theme.</p>
          <div className="seg" role="radiogroup" aria-label="Theme">{[["system", "System"], ["light", "Light"], ["dark", "Dark"]].map(([t, l]) => (
            <button key={t} role="radio" aria-checked={p.theme === t} className={p.theme === t ? "on" : ""} onClick={() => p.onTheme(t)}>{l}</button>))}</div></section>
        <section className="panel"><h3>This space</h3>
          <dl className="kv"><dt>Location</dt><dd>{p.vault}</dd><dt>Storage</dt><dd>{s?.network ? "Network drive (safe mode)" : "This computer"}</dd><dt>Studio NAS</dt><dd>{s?.remote || "Not connected"}</dd>
            <dt>Assets</dt><dd>{s?.assets ?? "–"}</dd><dt>Versions</dt><dd>{s?.commits ?? "–"}</dd></dl>
          <div className="row"><button className="ghostb" onClick={p.onSwitch}>Switch space</button></div></section>
        <section className="panel"><h3>Local AI</h3><p className="hint">Tagging and search by meaning run on this computer.</p>
          {!chk ? <p className="hint">Checking…</p> : <>{row("Ollama running", chk.ollama)}{row("Vision model (llava:7b)", chk.vision, "llava:7b")}{row("Search model (nomic-embed-text)", chk.embed, "nomic-embed-text")}{row("Git", chk.git)}</>}
          <button className="link" onClick={recheck}>Re-check</button></section>
        <section className="panel"><h3>Help</h3>
          <div className="stack"><button className="ghostb" onClick={p.onTour}>Take the tour again</button><button className="ghostb" onClick={p.onHelp}>Keyboard shortcuts</button>
            <button className="ghostb" onClick={async () => p.note((await copy(await p.diag())) ? "Diagnostics copied." : "Couldn’t copy to the clipboard.")}>Copy diagnostics for support</button></div></section>
        <section className="panel"><h3>About &amp; legal</h3>
          <p className="hint">Stratum is a product of <ExtLink href={APP.site}>Arkynox</ExtLink>, developed by {APP.developer} (<ExtLink href={APP.github}>@AkkilMG</ExtLink>).{acc ? ` Policies v${acc.v} accepted ${new Date(acc.at).toLocaleDateString()}.` : ""}</p>
          <div className="stack"><button className="ghostb" onClick={p.onAbout}>About Stratum</button><button className="ghostb" onClick={p.onLegal}>License, privacy &amp; open-source notices</button></div></section>
      </div>
    </div>
  );
}
