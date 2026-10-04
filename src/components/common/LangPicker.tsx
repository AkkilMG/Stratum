import { Combobox } from "./Combobox";
import { LANGS, useI18n, type Lang } from "../../i18n";

/** App language. Each option shows its native name plus the ISO code, so either can be searched. */
export function LangPicker({ className = "cbsz" }: { className?: string }) {
  const { lang, setLang, t } = useI18n();
  return <Combobox value={lang} onChange={(v) => setLang(v as Lang)} label={t("lang.pick")} className={className} align="end"
    options={LANGS.map((l) => ({ v: l.c, label: l.n, hint: l.c.toUpperCase() }))} />;
}