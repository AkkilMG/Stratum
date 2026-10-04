import { useEffect, useState, type ReactNode } from "react";
import { getVersion } from "@tauri-apps/api/app";
import { call } from "../../services/api";
import { APP, getAcceptance } from "../../config/legal";
import { ArkLogo, Copy, Cpu, Drive, ExtLink, Globe, Info, LangPicker, LifeBuoy, Mail, Modal, Palette, Refresh, User } from "../common";
import { dateOf, errText, fmtBytes, num, useI18n, type Key } from "../../i18n";
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

/** Top-level group on the settings page. The heading bar sticks to the top while its panels scroll by. */
function Band({ title, icon, action, children }: { title: string; icon: ReactNode; action?: ReactNode; children: ReactNode }) {
  return <section className="sband"><div className="sbar"><h3 className="sbandh"><i className="pico">{icon}</i>{title}</h3>{action}</div>{children}</section>;
}

/** Card inside a band: an optional title, an optional hint, then the controls. */
function Panel({ title, hint, children }: { title?: string; hint?: string; children: ReactNode }) {
  return <section className="panel">{(title || hint) && <div className="phead">{title && <h4>{title}</h4>}{hint && <p className="hint">{hint}</p>}</div>}{children}</section>;
}

/** Label on the left, value or control on the right; stacks on narrow windows. */
function Row({ icon, label, hint, children }: { icon?: ReactNode; label: string; hint?: string; children: ReactNode }) {
  return <div className="prow">{icon && <i className="pico">{icon}</i>}<b>{label}</b>{hint && <small>{hint}</small>}<div className="pctl">{children}</div></div>;
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
  useEffect(() => { setName(p.name); }, [p.name]);
  const dl = async (m: string) => { setPull(m); try { await call("pull_model", { name: m }); p.note(t("s.model_ready", { m })); } catch (e) { p.note(errText(e)); } setPull(""); recheck(); };
  const row = (label: Key, ok: boolean | undefined, req: boolean, help: Key, act?: ReactNode) => (
    <div className="crow" key={label}><i className={"dot " + (ok ? "ok" : req ? "bad" : "warn")} /><div><b>{t(label)}</b> <em>{req ? t("c.required") : t("c.optional")}</em><small>{ok ? t("c.ready") : t(help)}</small></div>{!ok && act}</div>
  );
  const dlBtn = (m: string) => <button className="ghostb" disabled={!chk?.ollama || !!pull} onClick={() => dl(m)}>{pull === m ? t("c.downloading") : t("c.download")}</button>;
  const THEMES: [string, Key][] = [["system", "th.system"], ["light", "th.light"], ["dark", "th.dark"]];
  const s = p.stats;
  const trimmed = name.trim();

  return (
    <div className="settings">
      <h2>{t("s.title")}</h2>

      <Band title={t("s.sec_you")} icon={<User />}>
        <div className="scols">
          <Panel title={t("s.profile")} hint={t("s.profile_d")}>
            <div className="idrow">
              <i className="pav" aria-hidden>{(trimmed || "?").slice(0, 1).toUpperCase()}</i>
              <input className="field" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && trimmed && trimmed !== p.name && p.onName(trimmed)} placeholder={t("s.name_ph")} aria-label={t("s.name_ph")} />
              <button className="primary" disabled={!trimmed || trimmed === p.name} onClick={() => p.onName(trimmed)}>{t("c.save")}</button>
            </div>
          </Panel>
          <Panel title={t("s.prefs")}>
            <Row icon={<Globe />} label={t("s.language")} hint={t("s.language_d")}><LangPicker /></Row>
            <Row icon={<Palette />} label={t("s.appearance")} hint={t("s.appearance_d")}>
              <div className="seg" role="radiogroup" aria-label={t("s.appearance")}>{THEMES.map(([k, l]) => (
                <button key={k} role="radio" aria-checked={p.theme === k} className={p.theme === k ? "on" : ""} onClick={() => p.onTheme(k)}>{t(l)}</button>))}</div>
            </Row>
          </Panel>
        </div>
      </Band>

      <Band title={t("s.space")} icon={<Drive />}>
        <Panel>
          <div className="tiles">
            <div className="tile"><small>{t("s.assets")}</small><b>{s ? num(s.assets) : "–"}</b></div>
            <div className="tile"><small>{t("s.size")}</small><b>{s ? fmtBytes(s.bytes) : "–"}</b></div>
            <div className="tile"><small>{t("s.versions")}</small><b>{s ? num(s.commits) : "–"}</b></div>
          </div>
          <Row label={t("s.storage")}><i className={"dot " + (!s ? "" : s.network ? "warn" : "ok")} />{s ? (s.network ? t("s.storage_net") : t("s.storage_local")) : "–"}</Row>
          <Row label={t("s.location")}>
            <span className="path" title={p.vault}>{p.vault}</span>
            <button className="ghostb tiny" onClick={async () => p.note((await copy(p.vault)) ? t("c.copied") : t("c.copy_fail"))}><Copy s={13} />{t("s.copy_path")}</button>
          </Row>
          <Row label={t("s.nas")}><i className={"dot " + (s?.remote ? "ok" : "")} />{s?.remote || t("s.nas_none")}</Row>
          <div className="btnrow end"><button className="ghostb" onClick={p.onSwitch}>{t("nav.switch")}</button></div>
        </Panel>
      </Band>

      <Band title={t("s.ai")} icon={<Cpu />} action={<button className="ghostb" onClick={recheck}><Refresh s={13} />{t("c.recheck")}</button>}>
        <Panel hint={t("s.ai_d")}>
          {!chk ? <p className="hint">{t("c.checking")}</p> : <div className="checks">
            {row("w.chk_git", chk.git, true, "w.chk_git_h")}
            {row("w.chk_ollama", chk.ollama, false, "w.chk_ollama_h")}
            {row("w.chk_vision", chk.vision, false, "w.chk_vision_h", dlBtn("llava:7b"))}
            {row("w.chk_embed", chk.embed, false, "w.chk_embed_h", dlBtn("nomic-embed-text"))}
            {row("w.chk_lfs", chk.lfs, false, "w.chk_lfs_h")}
          </div>}
        </Panel>
      </Band>

      <Band title={t("s.sec_help")} icon={<LifeBuoy />}>
        <div className="scols">
          <Panel title={t("s.support")} hint={t("s.support_d")}>
            <div className="checks">
              <div className="crow"><i className="pico"><Mail /></i><div><b><ExtLink href={`mailto:${APP.support}`}>{APP.support}</ExtLink></b><small>{t("ab.support")}</small></div></div>
              <div className="crow"><i className="pico"><Mail /></i><div><b><ExtLink href={`mailto:${APP.hello}`}>{APP.hello}</ExtLink></b><small>{t("s.hello")}</small></div></div>
            </div>
            <div className="btnrow">
              <button className="ghostb" onClick={p.onTour}>{t("s.tour_again")}</button>
              <button className="ghostb" onClick={p.onHelp}>{t("sc.title")}</button>
              <button className="ghostb" onClick={async () => p.note((await copy(await p.diag())) ? t("s.diag_ok") : t("c.copy_fail"))}>{t("s.diag")}</button>
            </div>
          </Panel>
          <Panel title={t("s.about_legal")}>
            <div className="attr"><ArkLogo height={26} /><span>{t("s.about_by", { dev: APP.developer })} <ExtLink href={APP.site}>arkynox.com</ExtLink> · <ExtLink href={APP.github}>@AkkilMG</ExtLink></span></div>
            {acc ? <p className="hint acc"><Info s={13} />{t("s.policies_acc", { v: acc.v, d: dateOf(acc.at) })}</p> : <p className="hint acc"><Info s={13} />{t("s.policies_not")}</p>}
            <div className="btnrow">
              <button className="ghostb" onClick={p.onAbout}>{t("ab.title")}</button>
              <button className="ghostb" onClick={p.onLegal}>{t("s.legal_btn")}</button>
            </div>
          </Panel>
        </div>
      </Band>
    </div>
  );
}