import { useEffect, useRef, useState } from "react";
import { getVersion } from "@tauri-apps/api/app";
import tile from "./assets/stratum-tile.png";
import ark from "./assets/arkynox-studio-dark.svg";
import { useI18n } from "./i18n";

/** Brand splash: company first, then product. Waits for the space to open, never longer than 9 s. Click or any key skips. */
export function Splash({ ready, onDone }: { ready: boolean; onDone: () => void }) {
  const { t } = useI18n();
  const reduce = useRef(window.matchMedia("(prefers-reduced-motion: reduce)").matches).current;
  const [p, setP] = useState(0), [leave, setLeave] = useState(false), [ver, setVer] = useState("");
  useEffect(() => {
    getVersion().then(setVer).catch(() => {});
    const a = setTimeout(() => setP(1), reduce ? 0 : 1500), b = setTimeout(() => setP(2), reduce ? 1200 : 3000), c = setTimeout(() => setLeave(true), 9000);
    const k = () => setP(2); window.addEventListener("keydown", k);
    return () => { clearTimeout(a); clearTimeout(b); clearTimeout(c); window.removeEventListener("keydown", k); };
  }, []);
  useEffect(() => { if (p === 2 && ready) setLeave(true); }, [p, ready]);
  useEffect(() => { if (leave) { const x = setTimeout(onDone, 300); return () => clearTimeout(x); } }, [leave]);
  return (
    <div className={"splash" + (leave ? " leave" : "")} role="status" aria-label="Stratum by Arkynox" onClick={() => setP(2)}>
      <div className="contours" aria-hidden />
      <div className={"sp-layer sp-ark" + (p === 0 ? " on" : "")}><img className="sp-ark-img" src={ark} alt="Arkynox" /><span>{t("sp.presents")}</span></div>
      <div className={"sp-layer sp-app" + (p >= 1 ? " on" : "")}><img className="sp-mark" src={tile} alt="" /><h1>Stratum</h1><p>{t("app.tagline")}</p></div>
      <div className="sp-foot"><div className="sp-bar"><i /></div><small>{p >= 2 && !ready ? t("sp.opening") : t("sp.starting")}{ver ? ` · v${ver}` : ""} · © 2026 Arkynox</small></div>
    </div>
  );
}
