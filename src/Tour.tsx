import { useEffect, useState } from "react";
export type Step = { target?: string; title: string; body: string; needs?: string; ok?: boolean; art?: "drop" };
const W = 340;
export function Tour({ steps, i, onNext, onBack, onExit }: { steps: Step[]; i: number; onNext: () => void; onBack: () => void; onExit: () => void }) {
  const s = steps[i];
  const [r, setR] = useState<DOMRect | null>(null);
  useEffect(() => {
    const f = () => { const el = s.target ? document.querySelector(s.target) : null; setR(el ? el.getBoundingClientRect() : null); };
    f(); const t = setInterval(f, 150); return () => clearInterval(t);
  }, [i, s.target]);
  const vw = window.innerWidth, vh = window.innerHeight;
  let left = vw / 2 - W / 2, top = vh / 2 - 130;
  if (r) {
    const right = r.right + 18 + W < vw;
    left = right ? r.right + 18 : Math.max(12, Math.min(r.left, vw - W - 12));
    top = right ? Math.max(12, r.top) : Math.min(r.bottom + 16, vh - 260);
    top = Math.min(top, vh - 260);
  }
  const ready = s.ok ?? true, last = i === steps.length - 1;
  return (
    <div className="tour">
      {r ? <div className="spot" style={{ left: r.left - 6, top: r.top - 6, width: r.width + 12, height: r.height + 12 }} /> : <div className="dim" />}
      <div className="tip" style={{ left, top, width: W }} role="dialog" aria-live="polite">
        <div className="dots">{steps.map((_, k) => <i key={k} className={k === i ? "on" : k < i ? "past" : ""} />)}</div>
        <h3>{s.title}</h3><p>{s.body}</p>
        {s.art === "drop" && <div className="dropart"><i /><b /><span>drop</span></div>}
        {s.needs && !ready && <p className="try">Try it: {s.needs}</p>}
        {s.needs && ready && <p className="try done">Nice.</p>}
        <div className="trow">
          <button className="link" onClick={onExit}>Skip tour</button>
          <span>{i > 0 && <button className="ghostb" onClick={onBack}>Back</button>}<button className="primary" disabled={!ready} onClick={onNext}>{last ? "Set up my vault" : "Next"}</button></span>
        </div>
      </div>
    </div>
  );
}
