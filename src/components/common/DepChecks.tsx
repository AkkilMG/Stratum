import { useState } from "react";
import type * as React from "react";
import { call, installDep, type Dep, type DepProgress } from "../../services/api";
import { errText, tr, useI18n, type Key } from "../../i18n";
import type { Check } from "../../types";

const phaseKey = (phase: string): Key => {
  if (phase === "download") return "dep.download";
  if (phase === "verify") return "dep.verify";
  if (phase === "install") return "dep.install";
  return "dep.prepare";
};

export function DepChecks({ chk, recheck, onNote }: { chk: Check | null; recheck: () => void; onNote?: (m: string) => void }) {
  const { t } = useI18n();
  const [busy, setBusy] = useState<Dep | "">("");
  const [prog, setProg] = useState<DepProgress | null>(null);
  const [pull, setPull] = useState("");

  const install = async (dep: Dep) => {
    setBusy(dep); setProg({ dep, phase: "prepare", pct: 0 });
    try { await installDep(dep, setProg); onNote?.(tr("dep.done")); }
    catch (e) { onNote?.(errText(e)); }
    finally { setBusy(""); setProg(null); recheck(); }
  };
  const dl = async (m: string) => {
    setPull(m);
    try { await call("pull_model", { name: m }); onNote?.(tr("s.model_ready", { m })); }
    catch (e) { onNote?.(errText(e)); }
    finally { setPull(""); recheck(); }
  };

  const installBtn = (dep: Dep) => (
    <button className="ghostb" disabled={!!busy || !!pull} onClick={() => install(dep)}>
      {busy === dep ? `${t(phaseKey(prog?.phase ?? "prepare"))}${prog?.pct ? ` ${prog.pct}%` : ""}` : t("c.install")}
    </button>
  );
  const dlBtn = (m: string) => <button className="ghostb" disabled={!chk?.ollama || !!pull || !!busy} onClick={() => dl(m)}>{pull === m ? t("c.downloading") : t("c.download")}</button>;

  const row = (label: Key, ok: boolean | undefined, req: boolean, help: Key, act?: React.JSX.Element) => (
    <div className="crow" key={label}><i className={"dot " + (ok ? "ok" : req ? "bad" : "warn")} /><div><b>{t(label)}</b> <em>{req ? t("c.required") : t("c.optional")}</em><small>{ok ? t("c.ready") : t(help)}</small></div>{!ok && act}</div>
  );

  if (!chk) return <p className="hint">{t("c.checking")}</p>;
  return (
    <div className="checks">
      {row("w.chk_git", chk.git, true, "w.chk_git_h", installBtn("git"))}
      {row("w.chk_ollama", chk.ollama, false, "w.chk_ollama_h", installBtn("ollama"))}
      {row("w.chk_vision", chk.vision, false, "w.chk_vision_h", dlBtn("llava:7b"))}
      {row("w.chk_embed", chk.embed, false, "w.chk_embed_h", dlBtn("nomic-embed-text"))}
      {row("w.chk_lfs", chk.lfs, false, "w.chk_lfs_h", installBtn("lfs"))}
    </div>
  );
}
