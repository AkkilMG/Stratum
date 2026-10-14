# Translating Stratum

Thank you for helping translate Stratum. Translations are a first-class contribution — a good translation makes Stratum usable for a whole new group of people.

Stratum currently ships with six languages: English (`en`), Spanish (`es`), Russian (`ru`), Hindi (`hi`), French (`fr`) and German (`de`).

## How it works

- Translations live in [`src/i18n/locales/`](../src/i18n/locales/).
- [`en.ts`](../src/i18n/locales/en.ts) is the **source of truth**. It is a plain object of `"key": "text"` pairs and it defines the `Dict` type that every other language must satisfy.
- The other files start with `import type { Dict } from "./en"; const es: Dict = { ... }`. **Every key that exists in `en.ts` must exist in every language**, or the TypeScript build fails. This is intentional: it is impossible to ship a half-translated screen.
- Languages are registered in [`src/i18n/index.tsx`](../src/i18n/index.tsx) in `LANGS` (code plus native name) and `D` (the locale imports).

## Editing an existing language

1. Open the locale file, for example `src/i18n/locales/de.ts`.
2. Change the **values** only. Never change the keys — they are used by the code.
3. Run the checks and make sure they pass:

   ```bash
   npm run typecheck
   npm run lint
   npm run build
   ```

If you removed or renamed a key by mistake, `npm run typecheck` will tell you exactly which key is missing.

## Rules

- **Keep placeholders identical.** Placeholders look like `{name}`, `{n}`, `{v}`, `{y}`, `{d}`, `{q}`, `{a}`, `{b}`, `{h}`, `{m}`, `{t}`. Translate the sentence around them, but leave the `{...}` tokens exactly as they are, including their names. `typecheck` cannot catch a changed placeholder, so double-check these by hand.
- **Do not translate product names.** Leave `Stratum` and `Arkynox` as they are.
- **Match the tone.** Stratum speaks plainly and calmly to non-technical artists and designers. Keep it short and friendly, not formal or marketing-flavoured.
- **Keep punctuation and special characters.** Do not convert the typographic apostrophe (`’`) to a straight quote, and keep intentional capitalisation.
- **Some keys are technical.** Keys beginning with `e.` are backend error messages, `m.` are sync messages, `s.` are the legal summary, `w.` are the setup wizard, `tour.` are the guided tour, and `c.`, `k.`, `d.`, `lib.`, `nav.`, `sync.`, `ai.`, `top.`, `card.`, `p.`, `t.`, `a.`, `pal.`, `sc.`, `th.`, `ab.`, `sp.`, `lang.`, `cr.`, `ui.`, `lg.`, `lic.`, `lv.`, `st.`, `sel.`, `n.`, `r.`, `h.` group related UI. Translating them in context (run the app and look at the screen) gives the best results.

## Adding a new language

1. Copy `src/i18n/locales/en.ts` to a new file named after the [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) code, for example `it.ts`.
2. At the top of the new file, change the first line to import the type and annotate the object:

   ```ts
   import type { Dict } from "./en";
   const it: Dict = {
     // ...
   };
   export default it;
   ```

   (Follow the exact shape of an existing non-English file such as `fr.ts`.)

3. Translate every value.
4. Register the language in `src/i18n/index.tsx`:

   ```ts
   import it from "./locales/it";
   export const LANGS = [
     // ...
     { c: "it", n: "Italiano" },
   ] as const;
   const D: Record<Lang, Record<Key, string>> = { en, es, ru, hi, fr, de, it };
   ```

5. Run `npm run typecheck`, `npm run lint` and `npm run build`.

Because the locale files use CRLF line endings, please keep them that way (your editor should detect this from `.gitattributes` / `.editorconfig`) to keep the diff small.

## A note on parity

New strings are added to `en.ts` first. Because the `Dict` type requires every key, a language that has not caught up will fail `npm run typecheck`. To keep the build green while you translate, add the new keys with the English text as a placeholder and replace them later; the app keeps English as a runtime fallback (`D[cur][k] ?? en[k]`), so an untranslated string is never shown as a blank or a raw key.

If you are not comfortable editing TypeScript, you can still help: open an issue titled `Translation: <language>` and attach a list of `key → translation` pairs, and a maintainer will wire it up.

## Questions

Open an issue or write to contact@arkynox.com. Thank you!
