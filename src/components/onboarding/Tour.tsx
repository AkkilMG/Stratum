import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useI18n } from "../../i18n";
export type Step = { target?: string; title: string; body: string; needs?: string; ok?: boolean; art?: "drop" };
type Btn = { label: string; onClick: () => void };
const W = 340;
export function Tour({ steps, i, onNext, onBack, onExit, finish, alt }: { steps: Step[]; i: number; onNext: () => void; onBack: () => void; onExit: () => void; finish: Btn; alt?: Btn }) {
  const { t } = useI18n();
  const s = steps[i];
  const [r, setR] = useState<DOMRect | null>(null);
  const [h, setH] = useState(260);
  const [vp, setVp] = useState({ w: window.innerWidth, h: window.innerHeight });
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { const el = s.target ? (document.querySelector(s.target) as HTMLElement | null) : null; el?.scrollIntoView?.({ block: "nearest", behavior: "smooth" }); }, [i]);
  useEffect(() => {
    const f = () => { const el = s.target ? document.querySelector(s.target) : null; setR(el ? el.getBoundingClientRect() : null); setVp({ w: window.innerWidth, h: window.innerHeight }); };
    f(); const x = setInterval(f, 150); window.addEventListener("resize", f);
    return () => { clearInterval(x); window.removeEventListener("resize", f); };
  }, [i, s.target]);
  useLayoutEffect(() => { if (ref.current) setH(ref.current.offsetHeight); });
  const { w: vw, h: vh } = vp;
  const narrow = vw < 720 || vh < 520;
  let style: React.CSSProperties;
  if (narrow) style = { left: 12, right: 12, ...(r && r.top + r.height / 2 > vh / 2 ? { top: 12 } : { bottom: 12 }) };
  else {
    let left = vw / 2 - W / 2, top = (vh - h) / 2;
    if (r) {
      if (r.right + 18 + W < vw) { left = r.right + 18; top = r.top; }
      else { left = Math.max(12, Math.min(r.left, vw - W - 12)); top = r.bottom + 16 + h <= vh - 12 ? r.bottom + 16 : r.top - h - 16 >= 12 ? r.top - h - 16 : 12; }
    }
    style = { left, top: Math.max(12, Math.min(top, vh - h - 12)), width: W };
  }
  const ready = s.ok ?? true, last = i === steps.length - 1;
  return (
    <div className="tour">
      {r ? <div className="spot" style={{ left: r.left - 6, top: r.top - 6, width: r.width + 12, height: r.height + 12 }} /> : <div className="dim" />}
      <div className="tip" ref={ref} style={style} role="dialog" aria-live="polite">
        <div className="dots">{steps.map((_, k) => <i key={k} className={k === i ? "on" : k < i ? "past" : ""} />)}</div>
        <h3>{s.title}</h3><p>{s.body}</p>
        {s.art === "drop" && <div className="dropart"><i /><b /><span>{t("tour.drop")}</span></div>}
        {s.needs && !ready && <p className="try">{t("tour.try")} {s.needs}</p>}
        {s.needs && ready && <p className="try done">{t("tour.nice")}</p>}
        <div className="trow">
          <button className="link" onClick={onExit}>{t("tour.skip")}</button>
          <span>
            {i > 0 && <button className="ghostb" onClick={onBack}>{t("c.back")}</button>}
            {last && alt && <button className="ghostb" onClick={alt.onClick}>{alt.label}</button>}
            <button className="primary" disabled={!ready} onClick={last ? finish.onClick : onNext}>{last ? finish.label : t("c.next")}</button>
          </span>
        </div>
      </div>
    </div>
  );
}
