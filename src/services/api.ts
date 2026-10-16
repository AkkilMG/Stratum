import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { demoCall } from "./demo";

let demo = false;
export const setDemo = (v: boolean) => { demo = v; };
export function call<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
  return demo ? (demoCall(cmd, args) as Promise<T>) : invoke<T>(cmd, args);
}

export type Dep = "git" | "lfs" | "ollama";
export type DepProgress = { dep: string; phase: string; pct: number };

/** Install a system dependency, forwarding backend progress events. Demo mode is a no-op. */
export async function installDep(dep: Dep, onProgress?: (p: DepProgress) => void): Promise<void> {
  if (demo) return;
  const un = await listen<DepProgress>("dep-progress", (e) => { if (e.payload.dep === dep) onProgress?.(e.payload); });
  try { await call("install_dep", { dep }); } finally { un(); }
}
