import { useEffect, useRef, useState } from "react";
import { APP, DOCS, POLICY_VERSION, getAcceptance } from "../../config/legal";
import { ArkLogo, Credits, Doc, ExtLink, LangPicker } from "../common";
import { dateOf, useI18n, type Key } from "../../i18n";
import mark from "../../assets/stratum-mark.png";

type Lic = { generated: string; packages: { n: string; v: string; l: string; r: string; e: string; f: string[] }[]; texts: Record<string, string> };
type Tab = "sum" | "eula" | "privacy" | "community" | "oss" | "external";
const SUM: Key[] = ["s.1", "s.2", "s.3", "s.4", "s.5", "s.6", "s.7", "s.8"];

export function Licenses() {
  const { t } = useI18n();
  const [d, setD] = useState<Lic | null>(null);
  const [q, setQ] = useState("");
  const [more, setMore] = useState(80);
  useEffect(() => { import("../../licenses.json").then((m) => setD(m.default as unknown as Lic)); }, []);
  if (!d) return <p className="hint">{t("lic.loading")}</p>;
  const f = d.packages.filter((p) => (p.n + " " + p.l).toLowerCase().includes(q.toLowerCase()));
  const kinds = new Map<string, number>(); d.packages.forEach((p) => kinds.set(p.l, (kinds.get(p.l) ?? 0) + 1));
  const top = [...kinds.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  return (
    <>
      <p>{t("lic.intro", { n: d.packages.length, d: dateOf(d.generated) })}</p>
      <p className="chips small">{top.map(([l, n]) => <span className="badge" key={l}>{l} · {n}</span>)}</p>
      <input className="field" type="search" placeholder={t("lic.search")} value={q} onChange={(e) => { setQ(e.target.value); setMore(80); }} aria-label={t("lic.search")} />
      <div className="lics">{f.slice(0, more).map((p) => (
        <details key={p.e + p.n + p.v}>
          <summary><b>{p.n}</b> <span>{p.v}</span><em className="badge">{p.l}</em></summary>
          {/^https?:\/\//.test(p.r) && <p><ExtLink href={p.r}>{p.r}</ExtLink></p>}
          <pre>{p.f.length ? p.f.map((h) => d.texts[h]).join("\n\n---\n\n") : t("lic.nofile")}</pre>
        </details>))}
      </div>
      {f.length > more && <button className="ghostb" onClick={() => setMore(more + 200)}>{t("lic.more", { n: f.length - more })}</button>}
      {f.length === 0 && <p className="hint">{t("lic.none")}</p>}
    </>
  );
}

function Summary() {
  const { t } = useI18n();
  return (
    <div className="doc">
      <ol className="sumlist">{SUM.map((k) => <li key={k}>{t(k)}</li>)}</ol>
      <p>{t("s.contact")} <ExtLink href={`mailto:${APP.support}`}>{APP.support}</ExtLink> · <ExtLink href={`mailto:${APP.hello}`}>{APP.hello}</ExtLink></p>
      <p className="binding">{t("s.binding")}</p>
    </div>
  );
}
function Community() {
  const { t } = useI18n();
  const links: [string, string][] = [
    [APP.repo, t("os.repo")],
    [APP.contributing, t("os.contribute")],
    [`${APP.issuesNew}/choose`, t("os.issues")],
    [`${APP.issuesNew}/choose`, t("os.features")],
    [APP.security, t("os.security")],
    [APP.issues, t("os.discuss")],
  ];
  return (
    <div className="doc community">
      <p className="lead sm"><b>{t("os.free")}</b></p>
      <p>{t("os.intro")}</p>
      <h3>{t("os.license_h")}</h3>
      <p>{t("os.license_d")}</p>
      <p><ExtLink href={APP.repo}>{APP.repo}</ExtLink></p>
      <h3>{t("os.welcome_h")}</h3>
      <p>{t("os.welcome_d")}</p>
      <ul className="communitylinks">{links.map(([href, label]) => (
        <li key={label}><ExtLink href={href}>{label}</ExtLink></li>))}</ul>
    </div>
  );
}
function Panel({ tab }: { tab: Tab }) {
  return tab === "sum" ? <Summary /> : tab === "eula" ? <Doc text={DOCS.eula} /> : tab === "privacy" ? <Doc text={DOCS.privacy} /> : tab === "community" ? <Community /> : tab === "external" ? <Doc text={DOCS.external} /> : <Licenses />;
}
const TABS: [Tab, Key][] = [["sum", "lg.sum"], ["eula", "lg.eula"], ["privacy", "lg.privacy"], ["community", "lg.community"], ["oss", "lg.oss"], ["external", "lg.external"]];

/** Shown before first use, and again whenever the policy version changes. */
export function Gate({ onAccept, onDecline }: { onAccept: () => void; onDecline: () => void }) {
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>("sum");
  const [agree, setAgree] = useState(false);
  const [read, setRead] = useState<Record<string, boolean>>({});
  const ref = useRef<HTMLDivElement>(null);
  const check = () => { const el = ref.current; if (el && (tab === "eula" || tab === "privacy") && el.scrollTop + el.clientHeight >= el.scrollHeight - 24) setRead((r) => ({ ...r, [tab]: true })); };
  useEffect(() => { ref.current?.scrollTo(0, 0); const x = setTimeout(check, 60); return () => clearTimeout(x); }, [tab]);
  const prior = getAcceptance();
  return (
    <div className="gate">
      <div className="contours" aria-hidden />
      <header className="wtop"><div className="brand"><img className="mark" src={mark} alt="" /><span>Stratum</span></div>
        <div className="gtitle"><h2>{prior ? t("g.title_upd") : t("g.title")}</h2><p>{t("g.sub", { v: POLICY_VERSION })}</p></div><LangPicker /></header>
      <div className="gtabs" role="tablist">{TABS.filter(([k]) => k !== "external").map(([k, l]) => (
        <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{t(l)}{read[k] ? " ✓" : ""}</button>))}</div>
      <div className="gdoc" ref={ref} onScroll={check} tabIndex={0} role="tabpanel"><div className="gdoc-in"><Panel tab={tab} /></div></div>
      <footer className="gfoot">
        <label className="chk"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} /> {t("g.agree")}</label>
        <div className="row end"><button className="ghostb" onClick={onDecline}>{t("g.decline")}</button><button className="primary" disabled={!agree} onClick={onAccept}>{t("g.accept")}</button></div>
        <Credits logo />
      </footer>
    </div>
  );
}

export function LegalView({ onBack }: { onBack: () => void }) {
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>("sum");
  const a = getAcceptance();
  return (
    <div className="legalview">
      <div className="row"><button className="ghostb" onClick={onBack}>{t("lv.back")}</button><h2>{t("lv.title")}</h2></div>
      <p className="hint">{a ? t("lv.accepted", { v: a.v, d: dateOf(a.at, true) }) : t("lv.not")} Stratum © {APP.year} <ExtLink href={APP.site}>{APP.owner}</ExtLink>. <ExtLink href={`mailto:${APP.support}`}>{APP.support}</ExtLink></p>
      <div className="gtabs" role="tablist">{TABS.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{t(l)}</button>)}</div>
      <section className="panel"><Panel tab={tab} /></section>
      <div className="row"><ArkLogo height={30} /></div>
    </div>
  );
}
