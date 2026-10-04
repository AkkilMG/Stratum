import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useI18n } from "../../i18n";
import { Check, Chev, Search, X } from "./icons";

export type Opt = { v: string; label: string; hint?: string; right?: ReactNode };

/** Lowercase, strip diacritics, so "Srč" finds "Src" and "resume" finds "résumé". */
const norm = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

/** 0 exact · 1 prefix · 2 word start · 3 substring · 4 subsequence · null no match. */
const rank = (needle: string, hay: string) => {
  if (!needle) return 5;
  const i = hay.indexOf(needle);
  if (i === 0) return hay === needle ? 0 : 1;
  if (i > 0) return /[\s\-_/]/.test(hay[i - 1]) ? 2 : 3;
  let k = 0;
  for (const c of hay) if (c === needle[k]) k++;
  return k === needle.length ? 4 : null;
};

/** Wraps every occurrence of `q` in <mark>. Skipped when folding would shift indices. */
const Mark = ({ text, q }: { text: string; q: string }) => {
  const n = norm(text), i = n.length === text.length ? n.indexOf(q) : -1;
  if (!q || i < 0) return <>{text}</>;
  return <>{text.slice(0, i)}<mark>{text.slice(i, i + q.length)}</mark>{text.slice(i + q.length)}</>;
};

/**
 * Searchable select. A custom trigger keeps the control identical on every platform (native
 * <select> popups render outside the Tauri window) and allows a search field plus richer rows.
 *
 * The popup is portalled to <body> so it is never clipped by `overflow` on an ancestor, and it is
 * positioned from the trigger's rect, flipping above when there is no room below.
 */
export function Combobox({ value, options, onChange, label, className = "", align = "start", autoSearchAt = 5, minWidth = 240, icon }: {
  value: string; options: Opt[]; onChange: (v: string) => void; label: string;
  className?: string; align?: "start" | "end"; autoSearchAt?: number; minWidth?: number; icon?: ReactNode;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const btn = useRef<HTMLButtonElement>(null);
  const pop = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const id = useId();
  const listId = `${id}-list`;
  const optId = (i: number) => `${id}-o${i}`;
  const withSearch = options.length >= autoSearchAt;
  const sel = options.find((o) => o.v === value);

  const shown = useMemo(() => {
    const n = norm(q.trim());
    if (!n) return options;
    return options
      .map((o, i) => ({ o, i, k: [norm(o.label), norm(o.hint ?? ""), norm(o.v)].reduce((m, h) => Math.min(m, rank(n, h) ?? 99), 99) }))
      .filter((x) => x.k < 99)
      .sort((a, b) => a.k - b.k || a.i - b.i)
      .map((x) => x.o);
  }, [options, q]);
  const capped = shown.slice(0, 200);

  const place = useCallback(() => {
    const b = btn.current, p = pop.current;
    if (!b || !p) return;
    const r = b.getBoundingClientRect();
    const w = Math.max(r.width, minWidth), h = p.offsetHeight, gap = 6, pad = 8;
    const left = align === "end" ? Math.max(pad, r.right - w) : Math.min(Math.max(pad, r.left), window.innerWidth - w - pad);
    const below = r.bottom + gap + h;
    p.style.left = `${left}px`;
    p.style.top = `${below + pad <= window.innerHeight ? r.bottom + gap : Math.max(pad, r.top - gap - h)}px`;
    p.style.width = `${Math.min(w, window.innerWidth - pad * 2)}px`;
  }, [align, minWidth]);

  useLayoutEffect(() => { if (open) place(); }, [open, shown.length, place]);
  useEffect(() => {
    if (!open) return;
    const move = () => place();
    window.addEventListener("scroll", move, true);
    window.addEventListener("resize", move);
    return () => { window.removeEventListener("scroll", move, true); window.removeEventListener("resize", move); };
  }, [open, place]);
  /** Close on any pointer press outside the trigger or the popup. */
  useEffect(() => {
    if (!open) return;
    const hit = (e: PointerEvent) => { const n = e.target as Node; if (!btn.current?.contains(n) && !pop.current?.contains(n)) setOpen(false); };
    document.addEventListener("pointerdown", hit, true);
    return () => document.removeEventListener("pointerdown", hit, true);
  }, [open]);
  useEffect(() => { if (open) setActive(Math.max(0, capped.findIndex((o) => o.v === value))); }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>(`#${CSS.escape(optId(active))}`)?.scrollIntoView({ block: "nearest" });
  }, [active, open]); // eslint-disable-line react-hooks/exhaustive-deps

  const close = (focus = true) => { setOpen(false); setQ(""); if (focus) btn.current?.focus(); };
  const choose = (v: string) => { onChange(v); close(); };
  const move = (d: number) => setActive((a) => capped.length ? (a + d + capped.length) % capped.length : 0);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); return; }
    if (e.key === "Tab") { close(false); return; }
    if (!capped.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
    else if (e.key === "Home") { e.preventDefault(); setActive(0); }
    else if (e.key === "End") { e.preventDefault(); setActive(capped.length - 1); }
    else if (e.key === "Enter") { e.preventDefault(); choose(capped[active].v); }
    /** No search box: letters jump to the first option starting with them, cycling like a native select. */
    else if (!withSearch && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const c = norm(e.key), from = capped.slice(active + 1).concat(capped.slice(0, active + 1));
      const hit = from.findIndex((o) => norm(o.label).startsWith(c));
      if (hit >= 0) { e.preventDefault(); setActive((active + 1 + hit) % capped.length); }
    }
  };

  return (
    <>
      <button ref={btn} type="button" className={"cbx " + className} role="combobox" aria-expanded={open} aria-haspopup="listbox"
        aria-controls={listId} aria-label={label} title={sel?.label}
        onClick={() => (open ? close(false) : setOpen(true))}
        onKeyDown={(e) => {
          /** Without a search field focus stays here, so the open popup must handle keys from the trigger too. */
          if (open) return onKey(e);
          if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(true); }
        }}>
        {icon && <i className="cbxicon">{icon}</i>}
        {sel ? <span className="cbxval">{sel.label}{sel.hint && <em>{sel.hint}</em>}</span> : <span className="cbxempty">{label}</span>}
        <Chev s={14} />
      </button>

      {open && createPortal(
        <div ref={pop} className="cbxp" onKeyDown={onKey}>
          {withSearch && (
            <div className="cbxhead">
              <Search s={14} />
              <input autoFocus value={q} onChange={(e) => { setQ(e.target.value); setActive(0); }}
                placeholder={t("sel.search")} aria-label={t("sel.search")} aria-autocomplete="list"
                aria-controls={listId} aria-activedescendant={capped.length ? optId(active) : undefined} />
              {q && <button className="cbxclear" onClick={() => { setQ(""); setActive(0); }} aria-label={t("c.dismiss")} title={t("c.dismiss")}><X s={13} /></button>}
            </div>
          )}
          {capped.length ? (
            <ul ref={listRef} className="cbxlist" role="listbox" id={listId} aria-label={label}>
              {capped.map((o, i) => (
                <li key={o.v} id={optId(i)} role="option" aria-selected={o.v === value}
                  className={i === active ? "on" : ""} onPointerEnter={() => setActive(i)}
                  onClick={() => choose(o.v)}>
                  <span className="cbxmark">{o.v === value && <Check s={13} />}</span>
                  <span className="cbxlabel"><Mark text={o.label} q={q.trim()} />{o.hint && <em><Mark text={o.hint} q={q.trim()} /></em>}</span>
                  {o.right && <span className="cbxright">{o.right}</span>}
                </li>
              ))}
            </ul>
          ) : <p className="cbxnone">{t("sel.none")}</p>}
          {(q.trim() !== "" || shown.length > capped.length) && (
            <div className="cbxfoot">{shown.length > capped.length ? `${capped.length} / ${shown.length}` : `${shown.length} / ${options.length}`}</div>
          )}
        </div>, document.body)}
    </>
  );
}