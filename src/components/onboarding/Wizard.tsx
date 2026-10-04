import { useEffect, useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { call } from "../../services/api";
import { Credits, LangPicker } from "../common";
import { errText, useI18n, type Key } from "../../i18n";
import mark from "../../assets/stratum-mark.png";
import type { Cfg, Check } from "../../types";

const STEPS: Key[] = ["w.t.welcome", "w.t.you", "w.t.storage", "w.t.folders", "w.t.check", "w.t.create"];
const isUrl = (s: string) => /:\/\/|@/.test(s);
const pick = async () => { const p = await open({ directory: true }); return typeof p === "string" ? p : ""; };
const I = {
  pc: <svg viewBox="0 0 48 48"><rect x="6" y="8" width="36" height="24" rx="3" /><path d="M18 40h12M24 32v8" /></svg>,
  nas: <svg viewBox="0 0 48 48"><rect x="3" y="10" width="24" height="17" rx="3" /><path d="M10 34h10M15 27v7" /><rect x="30" y="16" width="15" height="24" rx="3" /><path d="M34 22h7M34 28h7M34 34h3" /></svg>,
  team: <svg viewBox="0 0 48 48"><circle cx="18" cy="17" r="6" /><circle cx="33" cy="19" r="5" /><path d="M6 40c0-8 6-12 12-12s12 4 12 12M31 29c6 0 11 4 11 11" /></svg>,
};

export default function Wizard({ start = 0, mode, onTour, onSkip, onDone }: { start?: number; mode?: Cfg["mode"]; onTour: () => void; onSkip: () => void; onDone: (c: Cfg, remote: string | null, tour: boolean) => Promise<void> }) {
  const { t } = useI18n();
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
    const add = (s: Key) => setLog((l) => [...l, t(s)]);
    try {
      localStorage.setItem("author", c.name || "Me");
      await call("set_author", { name: c.name || "Me" });
      let remote: string | null = null;
      if (c.mode === "hub" && c.nas) {
        if (isUrl(c.nas)) { remote = c.nas; add("w.log_url"); }
        else { add("w.log_hub"); remote = await call<string>("create_hub", { path: c.nas }); add("w.log_hub_ok"); }
      }
      if (c.mode === "join") { add("w.log_join"); await call("join_hub", { remote: c.nas, dest: c.local }); add("w.log_join_ok"); }
      add("w.log_index");
      await onDone(c, remote, tour);
    } catch (e) { setErr(errText(e)); setWorking(false); }
  }
  const dl = async (m: string) => { setPull(m); try { await call("pull_model", { name: m }); } catch (e) { setErr(errText(e)); } setPull(""); recheck(); };

  const row = (label: Key, ok: boolean | undefined, req: boolean, help: Key, act?: JSX.Element) => (
    <div className="crow" key={label}><i className={"dot " + (ok ? "ok" : req ? "bad" : "warn")} /><div><b>{t(label)}</b> <em>{req ? t("c.required") : t("c.optional")}</em><small>{ok ? t("c.ready") : t(help)}</small></div>{!ok && act}</div>
  );
  const dlBtn = (m: string) => <button className="ghostb" disabled={!chk?.ollama || !!pull} onClick={() => dl(m)}>{pull === m ? t("c.downloading") : t("c.download")}</button>;
  const modes: [Cfg["mode"], JSX.Element, Key, Key, Key | ""][] = [["local", I.pc, "w.m_local", "w.m_local_d", ""], ["hub", I.nas, "w.m_hub", "w.m_hub_d", "w.m_hub_tag"], ["join", I.team, "w.m_join", "w.m_join_d", ""]];

  return (
    <div className="wiz">
      <div className="contours" aria-hidden />
      <header className="wtop"><div className="brand"><img className="mark" src={mark} alt="" /><span>Stratum</span></div><Trail i={i} /><LangPicker /><button className="link" onClick={onSkip}>{t("w.skip_setup")}</button></header>
      <div className="wscroll"><section className="wmain">
        {i === 0 && <>
          <h1>{t("w.h1")}</h1>
          <p className="lead">{t("w.lead")}</p>
          <div className="row"><button className="primary big" onClick={() => setI(1)}>{t("w.setup")}</button><button className="ghostb big" onClick={onTour}>{t("w.tour_first")}</button><button className="link" onClick={onSkip}>{t("w.explore")}</button></div>
          <p className="hint">{t("w.tour_hint")}</p><Credits logo />
        </>}
        {i === 1 && <>
          <h2>{t("w.name_h")}</h2><p className="lead sm">{t("w.name_lead")}</p>
          <input className="field big" autoFocus value={c.name} onChange={(e) => set({ name: e.target.value })} placeholder={t("w.name_ph")} onKeyDown={(e) => e.key === "Enter" && can && setI(2)} />
        </>}
        {i === 2 && <>
          <h2>{t("w.where_h")}</h2><p className="lead sm">{t("w.where_lead")}</p>
          <div className="modes">{modes.map(([m, ic, tt, d, tag]) => (
            <button key={m} className={"mode" + (c.mode === m ? " on" : "")} onClick={() => set({ mode: m })}>{ic}<b>{t(tt)}</b><span>{t(d)}</span>{tag && <em>{t(tag)}</em>}</button>))}</div>
          <details className="why"><summary>{t("w.why_sum")}</summary>{t("w.why")}</details>
        </>}
        {i === 3 && <>
          <h2>{c.mode === "join" ? t("w.f_join_h") : c.mode === "hub" ? t("w.f_hub_h") : t("w.f_local_h")}</h2>
          {c.mode === "join" && <Field label={t("w.fld_join_nas")} help={t("w.fld_join_nas_d")} v={c.nas} set={(v) => set({ nas: v })} />}
          <Field label={c.mode === "join" ? t("w.fld_join_local") : t("w.fld_local")} help={c.mode === "join" ? t("w.fld_join_local_d") : t("w.fld_local_d")} v={c.local} set={(v) => set({ local: v })} />
          {c.mode === "hub" && <Field label={t("w.fld_nas")} help={t("w.fld_nas_d")} v={c.nas} set={(v) => set({ nas: v })} />}
          <details className="why"><summary>{t("w.adv")}</summary><label className="chk"><input type="checkbox" checked={c.lfs} onChange={(e) => set({ lfs: e.target.checked })} /> {t("w.lfs")}</label></details>
          {c.mode === "hub" && <button className="link" onClick={() => set({ mode: "local", nas: "" })}>{t("w.skip_nas")}</button>}
        </>}
        {i === 4 && <>
          <h2>{t("w.chk_h")}</h2><p className="lead sm">{t("w.chk_lead")}</p>
          <div className="checks">{!chk ? <p className="hint">{t("c.checking")}</p> : <>
            {row("w.chk_git", chk.git, true, "w.chk_git_h")}
            {row("w.chk_ollama", chk.ollama, false, "w.chk_ollama_h")}
            {row("w.chk_vision", chk.vision, false, "w.chk_vision_h", dlBtn("llava:7b"))}
            {row("w.chk_embed", chk.embed, false, "w.chk_embed_h", dlBtn("nomic-embed-text"))}
            {row("w.chk_lfs", chk.lfs, false, "w.chk_lfs_h")}</>}</div>
          <button className="link" onClick={recheck}>{t("c.recheck")}</button>
        </>}
        {i === 5 && <>
          <h2>{t("w.create_h")}</h2>
          <dl className="sum"><dt>{t("w.sum_name")}</dt><dd>{c.name}</dd><dt>{t("w.sum_setup")}</dt><dd>{{ local: t("w.s_local"), hub: c.nas ? t("w.s_hub") : t("w.s_local"), join: t("w.s_join") }[c.mode]}</dd><dt>{t("w.sum_local")}</dt><dd>{c.local}</dd>{c.nas && <><dt>{t("w.sum_nas")}</dt><dd>{c.nas}</dd></>}</dl>
          {log.map((l) => <p className="step ok" key={l}>✓ {l}</p>)}
          {working && !err && <p className="step"><i className="spin" /> {t("c.working")}</p>}
          <div className="row"><button className="primary big" disabled={working} onClick={() => finish(true)}>{t("w.create_tour")}</button><button className="ghostb big" disabled={working} onClick={() => finish(false)}>{t("w.create")}</button></div>
        </>}
        {err && <p className="err">{err}</p>}
      </section></div>
      {i > 0 && <footer className="wfoot"><button className="ghostb" disabled={working} onClick={() => setI(i - 1)}>{t("c.back")}</button>{i < 5 && <button className="primary" disabled={!can} onClick={() => setI(i + 1)}>{t("c.continue")}</button>}</footer>}
    </div>
  );
}

function Field({ label, help, v, set }: { label: string; help: string; v: string; set: (v: string) => void }) {
  const { t } = useI18n();
  return (
    <div className="fld"><b>{label}</b><small>{help}</small>
      <div className="row"><input className="field" value={v} onChange={(e) => set(e.target.value)} placeholder={t("w.fld_ph")} /><button className="ghostb" onClick={async () => { const p = await pick(); if (p) set(p); }}>{t("c.browse")}</button></div></div>
  );
}

function Trail({ i }: { i: number }) {
  const { t } = useI18n();
  return (
    <ol className="trail" aria-label="Setup progress">
      {STEPS.map((s, k) => <li key={s} className={k === i ? "on" : k < i ? "past" : ""} aria-current={k === i ? "step" : undefined}><i>{k < i ? "✓" : k + 1}</i><span>{t(s)}</span></li>)}
    </ol>
  );
}
