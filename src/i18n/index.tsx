import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import en from "./locales/en";
import es from "./locales/es";
import ru from "./locales/ru";
import hi from "./locales/hi";
import fr from "./locales/fr";
import de from "./locales/de";

export type Key = keyof typeof en;
export const LANGS = [{ c: "en", n: "English" }, { c: "es", n: "Español" }, { c: "ru", n: "Русский" }, { c: "hi", n: "हिन्दी" }, { c: "fr", n: "Français" }, { c: "de", n: "Deutsch" }] as const;
export type Lang = (typeof LANGS)[number]["c"];
const D: Record<Lang, Record<Key, string>> = { en, es, ru, hi, fr, de };
const saved = localStorage.getItem("lang") as Lang | null;
let cur: Lang = saved && D[saved] ? saved : "en";

/** Translate outside React components (errors, class components). Falls back to English. */
export const tr = (k: Key, v?: Record<string, string | number>) => {
  let s = D[cur][k] ?? en[k];
  if (v) for (const x in v) s = s.split(`{${x}}`).join(String(v[x]));
  return s;
};
export const num = (n: number, d = 0) => n.toLocaleString(cur, { minimumFractionDigits: d, maximumFractionDigits: d });
const UNITS: Partial<Record<Lang, string[]>> = { fr: ["Ko", "Mo", "Go"], ru: ["КБ", "МБ", "ГБ"] };
export const fmtBytes = (b: number) => {
  const u = UNITS[cur] ?? ["KB", "MB", "GB"];
  return b >= 1e9 ? `${num(b / 1e9, 2)} ${u[2]}` : b >= 1e6 ? `${num(b / 1e6, 1)} ${u[1]}` : `${num(Math.max(0, Math.round(b / 1e3)))} ${u[0]}`;
};
export const ago = (t: number) => {
  const s = t - Date.now() / 1000, a = Math.abs(s), r = new Intl.RelativeTimeFormat(cur, { numeric: "auto" });
  return a < 60 ? r.format(0, "second") : a < 3600 ? r.format(Math.round(s / 60), "minute") : a < 86400 ? r.format(Math.round(s / 3600), "hour") : r.format(Math.round(s / 86400), "day");
};
export const dateOf = (d: string | number | Date, time = false) => (time ? new Date(d).toLocaleString(cur) : new Date(d).toLocaleDateString(cur));
/** Backend errors arrive as "E:code[:detail]"; unknown text is shown as is. */
export const errText = (e: unknown) => {
  const s = String((e as { message?: string })?.message ?? e), m = s.match(/^(?:Error:\s*)?E:([a-z_]+)(?::([\s\S]*))?$/);
  if (!m) return s;
  const k = `e.${m[1]}` as Key;
  return en[k] ? tr(k, { d: m[2] ?? "" }) : s;
};
export const msgText = (s: string) => {
  const m = s.match(/^M:([a-z_]+)(?::(\d+))?$/);
  return m && en[`m.${m[1]}` as Key] ? tr(`m.${m[1]}` as Key, { n: m[2] ?? "" }) : s;
};

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: cur, setLang: () => {} });
export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, set] = useState<Lang>(cur);
  const setLang = (l: Lang) => { cur = l; localStorage.setItem("lang", l); set(l); };
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>;
}
export const useI18n = () => { const { lang, setLang } = useContext(Ctx); return { lang, setLang, t: tr }; };
