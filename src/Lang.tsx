import mark from "./assets/stratum-mark.png";
import { LANGS, useI18n } from "./i18n";
import { Credits } from "./ui";

/** First screen after the splash: the user picks a language before seeing any policy. */
export function LanguageScreen({ onDone }: { onDone: () => void }) {
  const { t, lang, setLang } = useI18n();
  return (
    <div className="wiz"><div className="contours" aria-hidden />
      <header className="wtop"><div className="brand"><img className="mark" src={mark} alt="" /><span>Stratum</span></div></header>
      <div className="wscroll"><section className="wmain wide">
        <h2>{t("lang.title")}</h2>
        <p className="lead sm">{t("lang.sub")}</p>
        <p className="hint multi">Choose your language · Elige tu idioma · Выберите язык · अपनी भाषा चुनें · Choisissez votre langue · Sprache wählen</p>
        <div className="langs" role="radiogroup" aria-label={t("lang.pick")}>
          {LANGS.map((l) => (
            <button key={l.c} role="radio" aria-checked={lang === l.c} lang={l.c} className={"lang" + (lang === l.c ? " on" : "")} onClick={() => setLang(l.c)}><b>{l.n}</b><span>{l.c.toUpperCase()}</span></button>
          ))}
        </div>
        <div className="row end"><button className="primary big" onClick={onDone}>{t("c.continue")}</button></div>
        <Credits />
      </section></div>
    </div>
  );
}
