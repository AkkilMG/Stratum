import { Component, useEffect, useRef, type ReactNode } from "react";
import { openUrl } from "@tauri-apps/plugin-opener";
import { APP } from "./legal";

export function ExtLink({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} className="ext" onClick={(e) => { e.preventDefault(); openUrl(href).catch(() => window.open(href, "_blank")); }}>{children}</a>;
}
export function Credits() {
  return <p className="credits">Stratum is a product of <ExtLink href={APP.site}>Arkynox</ExtLink> · Developed by {APP.developer} (<ExtLink href={APP.github}>@AkkilMG</ExtLink>)</p>;
}
export function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.stopPropagation(); onClose(); }
      if (e.key === "Tab" && ref.current) {
        const f = [...ref.current.querySelectorAll<HTMLElement>('button,[href],input,select,textarea,summary,[tabindex]:not([tabindex="-1"])')].filter((x) => !x.hasAttribute("disabled"));
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    };
    window.addEventListener("keydown", k, true);
    return () => { window.removeEventListener("keydown", k, true); prev?.focus(); };
  }, []);
  return (
    <div className="cmdbg" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={"modal" + (wide ? " wide" : "")} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={ref}>
        <header><h3>{title}</h3><button className="icon" onClick={onClose} aria-label="Close">✕</button></header>
        <div className="mbody">{children}</div>
      </div>
    </div>
  );
}
/** Renders the small markdown subset used by the legal documents. */
export function Doc({ text }: { text: string }) {
  return (
    <div className="doc">{text.trim().split(/\n\s*\n/).map((b, i) => {
      if (b.startsWith("## ")) return <h3 key={i}>{b.slice(3)}</h3>;
      const l = b.split("\n");
      if (l.every((x) => x.startsWith("- "))) return <ul key={i}>{l.map((x, k) => <li key={k}>{x.slice(2)}</li>)}</ul>;
      return <p key={i}>{b}</p>;
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
        <h2>Something went wrong</h2>
        <p className="lead sm">Stratum hit an unexpected problem. Your files and version history are not affected.</p>
        <div className="row"><button className="primary" onClick={() => location.reload()}>Reload Stratum</button><button className="ghostb" onClick={() => navigator.clipboard?.writeText(d)}>Copy details</button></div>
        <Credits />
      </section></div></div>
    );
  }
}
