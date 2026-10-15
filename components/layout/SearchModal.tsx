"use client";

import { Search, Command, X, ArrowRight } from "@/components/ui/icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useI18n } from "@/lib/i18n/context";
import { buildSearchIndex, type SearchDoc } from "@/lib/search/index";
import Fuse from "fuse.js";
import Link from "next/link";
import { withBasePath } from "@/lib/util";

export function SearchModal() {
  const { locale, messages } = useI18n();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [all, setAll] = useState<SearchDoc[]>([]);
  const [fuse, setFuse] = useState<Fuse<SearchDoc> | null>(null);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let mounted = true;
    buildSearchIndex(locale).then((docs) => {
      if (!mounted) return;
      setFuse(new Fuse(docs, {
        keys: [
          { name: "title", weight: 0.6 },
          { name: "description", weight: 0.35 },
          { name: "slug", weight: 0.05 },
        ],
        includeScore: true,
        threshold: 0.38,
      }));
      setAll(docs);
    });
    return () => {
      mounted = false;
    };
  }, [locale]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 80);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const q = query.trim();
    if (!q || !fuse) return all.slice(0, 6);
    return fuse.search(q, { limit: 12 }).map((r) => r.item);
  }, [query, all, fuse]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      window.location.href = withBasePath(`/${locale}/${results[active].slug}`);
    }
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-1/2 top-[15vh] z-50 w-[min(680px,92vw)] -translate-x-1/2"
            >
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-[0_30px_90px_-40px_rgba(0,0,0,0.8)]">
                <div className="flex items-center gap-2 border-b border-border px-3 py-2">
                  <Search size={16} className="text-muted-foreground" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setActive(0);
                    }}
                    onKeyDown={onKeyDown}
                    placeholder={messages.search.placeholder}
                    className="h-9 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                  <button
                    onClick={() => setOpen(false)}
                    aria-label={messages.search.close}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <X size={15} />
                  </button>
                </div>
                <div className="max-h-[420px] overflow-y-auto py-2">
                  {results.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <p className="text-sm text-foreground">{messages.search.empty}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{messages.search.emptyHint}</p>
                    </div>
                  ) : (
                    results.map((doc, i) => (
                      <Link
                        key={doc.slug}
                        href={withBasePath(`/${locale}/${doc.slug}`)}
                        onClick={() => setOpen(false)}
                        onMouseEnter={() => setActive(i)}
                        className={`flex items-start gap-3 px-4 py-2.5 transition-colors ${
                          i === active ? "bg-muted" : "hover:bg-[color-mix(in_srgb,var(--muted)_70%,transparent)]"
                        }`}
                      >
                        <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">{doc.title}</p>
                          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{doc.description}</p>
                          <p className="mt-1 font-mono text-[0.7rem] text-muted-foreground">
                            {messages.sidebar.sections[doc.section] ?? doc.section} / {doc.slug}
                          </p>
                        </div>
                        <ArrowRight size={14} className="ml-auto mt-1 text-muted-foreground" />
                      </Link>
                    ))
                  )}
                </div>
                <div className="flex items-center justify-between border-t border-border px-4 py-2 text-[0.7rem] text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <kbd className="rounded bg-muted px-1">↑</kbd>
                      <kbd className="rounded bg-muted px-1">↓</kbd> {messages.search.navigate}
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="rounded bg-muted px-1">↵</kbd> {messages.search.open}
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="rounded bg-muted px-1">Esc</kbd> {messages.search.close}
                    </span>
                  </span>
                  <span>
                    {results.length} {messages.search.results}
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
