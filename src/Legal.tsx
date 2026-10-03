import { useEffect, useRef, useState } from "react";
import { APP, DOCS, POLICY_VERSION, getAcceptance } from "./legal";
import { Credits, Doc, ExtLink } from "./ui";

type Lic = { generated: string; packages: { n: string; v: string; l: string; r: string; e: string; f: string[] }[]; texts: Record<string, string> };
type Tab = "eula" | "privacy" | "oss" | "external";

export function Licenses() {
  const [d, setD] = useState<Lic | null>(null);
  const [q, setQ] = useState("");
  const [more, setMore] = useState(80);
  useEffect(() => { import("./licenses.json").then((m) => setD(m.default as unknown as Lic)); }, []);
  if (!d) return <p className="hint">Loading license list…</p>;
  const f = d.packages.filter((p) => (p.n + " " + p.l).toLowerCase().includes(q.toLowerCase()));
  const kinds = new Map<string, number>(); d.packages.forEach((p) => kinds.set(p.l, (kinds.get(p.l) ?? 0) + 1));
  const top = [...kinds.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  return (
    <>
      <p>Stratum is built on {d.packages.length} open-source components. Each is used under its own license, shown in full below and in THIRD_PARTY_NOTICES.txt, which is installed with the app. Generated {new Date(d.generated).toLocaleDateString()}.</p>
      <p className="chips small">{top.map(([l, n]) => <span className="badge" key={l}>{l} · {n}</span>)}</p>
      <input className="field" type="search" placeholder="Search components or licenses" value={q} onChange={(e) => { setQ(e.target.value); setMore(80); }} aria-label="Search components" />
      <div className="lics">{f.slice(0, more).map((p) => (
        <details key={p.e + p.n + p.v}>
          <summary><b>{p.n}</b> <span>{p.v}</span><em className="badge">{p.l}</em></summary>
          {/^https?:\/\//.test(p.r) && <p><ExtLink href={p.r}>{p.r}</ExtLink></p>}
          <pre>{p.f.length ? p.f.map((h) => d.texts[h]).join("\n\n---\n\n") : "License text is not bundled with this package. See the source link."}</pre>
        </details>))}
      </div>
      {f.length > more && <button className="ghostb" onClick={() => setMore(more + 200)}>Show more ({f.length - more} left)</button>}
      {f.length === 0 && <p className="hint">No components match.</p>}
    </>
  );
}

const TABS: [Tab, string][] = [["eula", "License Agreement"], ["privacy", "Privacy Policy"], ["oss", "Open-source licenses"], ["external", "Other software"]];
function Panel({ tab }: { tab: Tab }) {
  return tab === "eula" ? <Doc text={DOCS.eula} /> : tab === "privacy" ? <Doc text={DOCS.privacy} /> : tab === "external" ? <Doc text={DOCS.external} /> : <Licenses />;
}

/** Shown before first use, and again whenever the policy version changes. */
export function Gate({ onAccept, onDecline }: { onAccept: () => void; onDecline: () => void }) {
  const [tab, setTab] = useState<Tab>("eula");
  const [agree, setAgree] = useState(false);
  const [read, setRead] = useState<Record<string, boolean>>({});
  const ref = useRef<HTMLDivElement>(null);
  const check = () => { const el = ref.current; if (el && (tab === "eula" || tab === "privacy") && el.scrollTop + el.clientHeight >= el.scrollHeight - 24) setRead((r) => ({ ...r, [tab]: true })); };
  useEffect(() => { ref.current?.scrollTo(0, 0); const t = setTimeout(check, 60); return () => clearTimeout(t); }, [tab]);
  const prior = getAcceptance();
  return (
    <div className="gate">
      <div className="contours" aria-hidden />
      <header className="wtop"><div className="brand"><i /><span>Stratum</span></div>
        <div className="gtitle"><h2>{prior ? "Our policies have been updated" : "Before you begin"}</h2><p>Please review and accept these to use Stratum. Version {POLICY_VERSION}.</p></div></header>
      <div className="gtabs" role="tablist">{TABS.slice(0, 3).map(([k, l]) => (
        <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{l}{read[k] ? " ✓" : ""}</button>))}</div>
      <div className="gdoc" ref={ref} onScroll={check} tabIndex={0} role="tabpanel"><div className="gdoc-in"><Panel tab={tab} /></div></div>
      <footer className="gfoot">
        <label className="chk"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} /> I have read and agree to the License Agreement and Privacy Policy, and I acknowledge the open-source notices.</label>
        <div className="row end"><button className="ghostb" onClick={onDecline}>Decline and quit</button><button className="primary" disabled={!agree} onClick={onAccept}>Accept and continue</button></div>
        <Credits />
      </footer>
    </div>
  );
}

export function LegalView({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<Tab>("eula");
  const a = getAcceptance();
  return (
    <div className="legalview">
      <div className="row"><button className="ghostb" onClick={onBack}>← Settings</button><h2>Legal &amp; licenses</h2></div>
      <p className="hint">{a ? `You accepted policy version ${a.v} on ${new Date(a.at).toLocaleString()}.` : "Policies not yet accepted."} Stratum © {APP.year} <ExtLink href={APP.site}>{APP.owner}</ExtLink>.</p>
      <div className="gtabs" role="tablist">{TABS.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{l}</button>)}</div>
      <section className="panel"><Panel tab={tab} /></section>
    </div>
  );
}
