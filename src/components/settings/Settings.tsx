import { useEffect, useState } from "react";
import { getVersion } from "@tauri-apps/api/app";
import { call } from "../../services/api";
import { APP, getAcceptance } from "../../config/legal";
import { ArkLogo, ExtLink, Modal } from "../common";
import { LangPicker, dateOf, errText, useI18n, type Key } from "../../i18n";
import mark from "../../assets/stratum-tile.png";
import type { Check, Stats } from "../../types";

export const copy = async (t: string) => { try { await navigator.clipboard.writeText(t); return true; } catch { return false; } };

export function About({ onClose, onLegal, diag, note }: { onClose: () => void; onLegal: () => void; diag: () => Promise<string>; note: (m: string) => void }) {
  const { t } = useI18n();
  const [ver, setVer] = useState("");
  useEffect(() => { getVersion().then(setVer).catch(() => setVer("0.1.0")); }, []);
  return (
    <Modal title={t("ab.title")} onClose={onClose}
      footer={<>
        <button className="primary" onClick={() => { onClose(); onLegal(); }}>{t("ab.legal")}</button>
        <button className="ghostb" onClick={async () => note((await copy(await diag())) ? t("s.diag_ok") : t("c.copy_fail"))}>{t("ab.diag")}</button>
      </>}>
      <div className="about">
        <div className="abouthero">
          <img className="aboutlogo" src={mark} alt="" />
          <div>
            <h2>Stratum</h2>
            <p className="hint">{t("ab.version", { v: ver })}</p>
          </div>
        </div>
        <p className="lead sm">{t("ab.tag")}</p>
        <dl className="aboutfacts">
          <dt>{t("ab.product_of")}</dt><dd><ExtLink href={APP.site}>Arkynox</ExtLink></dd>
          <dt>{t("ab.dev_by")}</dt><dd>{APP.developer} · <ExtLink href={APP.github}>@AkkilMG</ExtLink></dd>
          <dt>{t("ab.website")}</dt><dd><ExtLink href={APP.site}>arkynox.com</ExtLink></dd>
          <dt>{t("ab.support")}</dt><dd><ExtLink href={`mailto:${APP.support}`}>{APP.support}</ExtLink></dd>
        </dl>
        <p className="hint aboutcopy"><ArkLogo height={18} />{t("ab.copy", { y: APP.year })}</p>
      </div>
    </Modal>
  );
}

type P = { name: string; onName: (n: string) => void; theme: string; onTheme: (t: string) => void; vault: string; stats: Stats | null; demo: boolean;
  onSwitch: () => void; onTour: () => void; onHelp: () => void; onAbout: () => void; onLegal: () => void; diag: () => Promise<string>; note: (m: string) => void };

export function Settings(p: P) {
  const { t } = useI18n();
  const [name, setName] = useState(p.name);
  const [chk, setChk] = useState<Check | null>(null);
  const [pull, setPull] = useState("");
  const acc = getAcceptance();
  const recheck = () => call<Check>("system_check").then(setChk).catch(() => {});
  useEffect(() => { recheck(); }, []);
  const dl = async (m: string) => { setPull(m); try { await call("pull_model", { name: m }); p.note(t("s.model_ready", { m })); } catch (e) { p.note(errText(e)); } setPull(""); recheck(); };
  const row = (label: Key, ok: boolean | undefined, btn?: string) => (
    <div className="srow" key={label}><i className={"dot " + (ok ? "ok" : "warn")} /><span>{t(label)}</span>
      {!ok && btn && <button className="ghostb" disabled={!chk?.ollama || !!pull} onClick={() => dl(btn)}>{pull === btn ? t("c.downloading") : t("c.download")}</button>}</div>
  );
  const s = p.stats;
  return (
    <div className="settings">
      <h2>{t("s.title")}</h2>
      <div className="sgrid">
        <section className="panel"><h3>{t("s.profile")}</h3><p className="hint">{t("s.profile_d")}</p>
          <div className="row"><input className="field" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && name.trim() && p.onName(name.trim())} placeholder={t("s.name_ph")} aria-label={t("s.name_ph")} />
            <button className="primary" disabled={!name.trim() || name.trim() === p.name} onClick={() => p.onName(name.trim())}>{t("c.save")}</button></div></section>
        <section className="panel"><h3>{t("s.language")}</h3><p className="hint">{t("s.language_d")}</p><LangPicker className="field" /></section>
        <section className="panel"><h3>{t("s.appearance")}</h3><p className="hint">{t("s.appearance_d")}</p>
          <div className="seg" role="radiogroup" aria-label={t("s.appearance")}>{([["system", "th.system"], ["light", "th.light"], ["dark", "th.dark"]] as [string, Key][]).map(([k, l]) => (
            <button key={k} role="radio" aria-checked={p.theme === k} className={p.theme === k ? "on" : ""} onClick={() => p.onTheme(k)}>{t(l)}</button>))}</div></section>
        <section className="panel"><h3>{t("s.space")}</h3>
          <dl className="kv"><dt>{t("s.location")}</dt><dd>{p.vault}</dd><dt>{t("s.storage")}</dt><dd>{s?.network ? t("s.storage_net") : t("s.storage_local")}</dd><dt>{t("s.nas")}</dt><dd>{s?.remote || t("s.nas_none")}</dd>
            <dt>{t("s.assets")}</dt><dd>{s?.assets ?? "–"}</dd><dt>{t("s.versions")}</dt><dd>{s?.commits ?? "–"}</dd></dl>
          <div className="row"><button className="ghostb" onClick={p.onSwitch}>{t("nav.switch")}</button></div></section>
        <section className="panel"><h3>{t("s.ai")}</h3><p className="hint">{t("s.ai_d")}</p>
          {!chk ? <p className="hint">{t("c.checking")}</p> : <>{row("s.ai_ollama", chk.ollama)}{row("w.chk_vision", chk.vision, "llava:7b")}{row("w.chk_embed", chk.embed, "nomic-embed-text")}{row("w.chk_git", chk.git)}</>}
          <button className="link" onClick={recheck}>{t("c.recheck")}</button></section>
        <section className="panel"><h3>{t("s.support")}</h3><p className="hint">{t("s.support_d")}</p>
          <div className="stack"><ExtLink href={`mailto:${APP.support}`}>{APP.support}</ExtLink><span className="hint">{t("s.hello")} <ExtLink href={`mailto:${APP.hello}`}>{APP.hello}</ExtLink></span>
            <button className="ghostb" onClick={p.onTour}>{t("s.tour_again")}</button><button className="ghostb" onClick={p.onHelp}>{t("sc.title")}</button>
            <button className="ghostb" onClick={async () => p.note((await copy(await p.diag())) ? t("s.diag_ok") : t("c.copy_fail"))}>{t("s.diag")}</button></div></section>
        <section className="panel"><h3>{t("s.about_legal")}</h3>
          <p className="hint">{t("s.about_by", { dev: APP.developer })} <ExtLink href={APP.site}>arkynox.com</ExtLink> · <ExtLink href={APP.github}>@AkkilMG</ExtLink>{acc ? ` ${t("s.policies_acc", { v: acc.v, d: dateOf(acc.at) })}` : ""}</p>
          <div className="row"><ArkLogo height={32} /></div>
          <div className="stack"><button className="ghostb" onClick={p.onAbout}>{t("ab.title")}</button><button className="ghostb" onClick={p.onLegal}>{t("s.legal_btn")}</button></div></section>
      </div>
    </div>
  );
}
