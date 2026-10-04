import { Component, Fragment, type ReactNode } from "react";
import { openUrl } from "@tauri-apps/plugin-opener";
import { APP } from "../../config/legal";
import { tr, useI18n } from "../../i18n";
import arkLight from "../../assets/arkynox-light.png";
import arkDark from "../../assets/arkynox-studio-dark.svg";

export function ExtLink({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} className="ext" onClick={(e) => { e.preventDefault(); openUrl(href).catch(() => window.open(href, "_blank")); }}>{children}</a>;
}
/** Arkynox company logo, light or dark version depending on the active theme. */
export function ArkLogo({ height = 36 }: { height?: number }) {
  return <span className="arklogo"><img className="ark ark-l" style={{ height }} src={arkLight} alt="Arkynox" /><img className="ark ark-d" style={{ height }} src={arkDark} alt="Arkynox" /></span>;
}
export function Credits({ logo }: { logo?: boolean }) {
  const { t } = useI18n();
  return (
    <p className="credits">{logo && <ArkLogo height={28} />}
      <span>{t("cr.product")} <ExtLink href={APP.site}>Arkynox</ExtLink> · {t("cr.dev")} {APP.developer} (<ExtLink href={APP.github}>@AkkilMG</ExtLink>)</span></p>
  );
}
const LINK = /(https?:\/\/[^\s,)]+|[\w.+-]+@[\w-]+\.[\w.-]+)/g;
const linkify = (s: string) => s.split(LINK).map((p, i) => (i % 2 ? <ExtLink key={i} href={p.includes("@") && !p.startsWith("http") ? `mailto:${p}` : p}>{p}</ExtLink> : <Fragment key={i}>{p}</Fragment>));
/** Renders the small markdown subset used by the legal documents, with clickable links and emails. */
export function Doc({ text }: { text: string }) {
  return (
    <div className="doc">{text.trim().split(/\n\s*\n/).map((b, i) => {
      if (b.startsWith("## ")) return <h3 key={i}>{b.slice(3)}</h3>;
      const l = b.split("\n");
      if (l.every((x) => x.startsWith("- "))) return <ul key={i}>{l.map((x, k) => <li key={k}>{linkify(x.slice(2))}</li>)}</ul>;
      return <p key={i}>{linkify(b)}</p>;
    })}</div>
  );
}
export class ErrorBoundary extends Component<{ children: ReactNode }, { err: Error | null }> {
  state = { err: null as Error | null };
  static getDerivedStateFromError(err: Error) { return { err }; }
  render() {
    if (!this.state.err) return this.props.children;
    const d = `${this.state.err.message}\n${this.state.err.stack ?? ""}`;
    return (
      <div className="wiz"><div className="wscroll"><section className="wmain">
        <h2>{tr("ui.err_title")}</h2>
        <p className="lead sm">{tr("ui.err_body")}</p>
        <div className="row"><button className="primary" onClick={() => location.reload()}>{tr("ui.reload")}</button><button className="ghostb" onClick={() => navigator.clipboard?.writeText(d)}>{tr("c.copy_details")}</button></div>
        <Credits />
      </section></div></div>
    );
  }
}
