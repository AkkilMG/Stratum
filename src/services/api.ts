import { invoke } from "@tauri-apps/api/core";
import { demoCall } from "./demo";
let demo = false;
export const setDemo = (v: boolean) => { demo = v; };
export function call<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
  return demo ? (demoCall(cmd, args) as Promise<T>) : invoke<T>(cmd, args);
}
