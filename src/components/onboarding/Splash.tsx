import { useEffect, useRef, useState } from "react";
import { getVersion } from "@tauri-apps/api/app";
import wordLight from "../../assets/stratum-wordmark-light.png";
import wordDark from "../../assets/stratum-wordmark-dark.png";
import arkLight from "../../assets/arkynox-studio-light.png";
import arkDark from "../../assets/arkynox-studio-dark.png";
import { useI18n } from "../../i18n";

const MIN_MS = 1800;   // shortest the splash stays, so the brand registers instead of flashing
const MAX_MS = 9000;   // hard cap, never block the app longer than this

/**
 * Brand splash. Stratum wordmark centred, Arkynox mark bottom-right.
 * Logos follow the active theme (system by default). Leaves as soon as the space is ready
 * (after MIN_MS), never later than MAX_MS. Click, Enter, Space or Esc skips the wait.
 */
export function Splash({ ready, onDone }: { ready: boolean; onDone: () => void }) {
  const { t } = useI18n();
  const reduce = useRef(window.matchMedia("(prefers-reduced-motion: reduce)").matches).current;
  const [shown, setShown] = useState(false);   // triggers the entrance animation
  const [minDone, setMinDone] = useState(false);
  const [leave, setLeave] = useState(false);
  const [ver, setVer] = useState("");

  useEffect(() => {
    getVersion().then(setVer).catch(() => {});
    const raf = requestAnimationFrame(() => setShown(true));
    const a = setTimeout(() => setMinDone(true), reduce ? 600 : MIN_MS);
    const b = setTimeout(() => setLeave(true), MAX_MS);
    const k = (e: KeyboardEvent) => { if (["Enter", " ", "Escape"].includes(e.key)) setMinDone(true); };
    window.addEventListener("keydown", k);
    return () => { cancelAnimationFrame(raf); clearTimeout(a); clearTimeout(b); window.removeEventListener("keydown", k); };
  }, []);
  useEffect(() => { if (minDone && ready) setLeave(true); }, [minDone, ready]);
  useEffect(() => { if (leave) { const x = setTimeout(onDone, reduce ? 100 : 350); return () => clearTimeout(x); } }, [leave]);

  const waiting = minDone && !ready;
  return (
    <div className={"splash" + (shown ? " in" : "") + (leave ? " leave" : "")} role="status" aria-live="polite" aria-label="Stratum by Arkynox" onClick={() => setMinDone(true)}>
      <div className="contours" aria-hidden />
      <div className="sp-glow" aria-hidden />

      <main className="sp-center">
        <span className="sp-word">
          <img className="sp-wm sp-l" src={wordLight} alt="Stratum" draggable={false} />
          <img className="sp-wm sp-d" src={wordDark} alt="" aria-hidden draggable={false} />
        </span>
        <p className="sp-tag">{t("app.tagline")}</p>
        <div className={"sp-bar" + (waiting ? " wait" : "")} aria-hidden><i /></div>
        <small className="sp-status">{waiting ? t("sp.opening") : t("sp.starting")}</small>
      </main>

      <footer className="sp-corner">
        <span className="sp-ark">
          <img className="sp-al" src={arkLight} alt="Arkynox" draggable={false} />
          <img className="sp-ad" src={arkDark} alt="" aria-hidden draggable={false} />
        </span>
        <small>{ver ? `v${ver} · ` : ""}© 2026 Arkynox</small>
      </footer>
    </div>
  );
}
