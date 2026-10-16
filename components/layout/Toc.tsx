"use client";

import { List, ChevronDown, ChevronLeft, ChevronRight } from "@/components/ui/icons";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useI18n } from "@/lib/i18n/context";
import { withBasePath } from "@/lib/util";
import { getPrevNext } from "@/lib/nav";

interface TocItem {
  id: string;
  label: string;
}

function useActiveHeading(items: TocItem[]) {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);
  useEffect(() => {
    if (items.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 1] }
    );
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);
  return active;
}

function PrevNextRail({ slug }: { slug?: string }) {
  const { locale, messages } = useI18n();
  const { prev, next } = useMemo(() => getPrevNext(slug), [slug]);
  if (!prev && !next) return null;
  return (
    <div className="mt-6 space-y-1 border-t border-border pt-4">
      {prev && (
        <Link
          href={withBasePath(`/${locale}/${prev.slug}`)}
          className="group flex items-start gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ChevronLeft size={14} className="mt-0.5 shrink-0" />
          <span className="min-w-0">
            <span className="block text-[0.68rem] uppercase tracking-wider text-muted-foreground/70">
              {messages.footer.prev}
            </span>
            <span className="block truncate">{prev.title}</span>
          </span>
        </Link>
      )}
      {next && (
        <Link
          href={withBasePath(`/${locale}/${next.slug}`)}
          className="group flex items-start justify-end gap-2 rounded-md px-2 py-1.5 text-right text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <span className="min-w-0">
            <span className="block text-[0.68rem] uppercase tracking-wider text-muted-foreground/70">
              {messages.footer.next}
            </span>
            <span className="block truncate">{next.title}</span>
          </span>
          <ChevronRight size={14} className="mt-0.5 shrink-0" />
        </Link>
      )}
    </div>
  );
}

export function Toc({ meta }: { meta: any }) {
  const { messages } = useI18n();
  const items = useMemo<TocItem[]>(() => meta?.toc ?? [], [meta]);
  const active = useActiveHeading(items);

  if (items.length === 0) return null;

  return (
    <aside className="sticky top-[3.75rem] hidden h-[calc(100dvh-3.75rem)] w-60 shrink-0 flex-col overflow-hidden pb-10 pt-6 lg:flex">
      <div className="scroll-fade min-h-0 flex-1 overflow-y-auto pr-2">
        <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <List size={12} />
          {messages.common.contents}
        </div>
        <nav className="relative space-y-0.5 border-l border-border">
          {items.map((item) => {
            const isActive = active === item.id;
            return (
              <Link
                key={item.id}
                href={`#${item.id}`}
                className={`relative block py-1.5 pl-3 pr-2 text-sm transition-colors ${
                  isActive ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="toc-active"
                    className="absolute -left-px top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 36 }}
                  />
                )}
                {item.label}
              </Link>
            );
          })}
        </nav>
        <PrevNextRail slug={meta?.slug} />
      </div>
    </aside>
  );
}

export function MobileToc({ meta }: { meta: any }) {
  const { messages } = useI18n();
  const items = useMemo<TocItem[]>(() => meta?.toc ?? [], [meta]);
  const [open, setOpen] = useState(false);
  const active = useActiveHeading(items);

  if (items.length === 0) return null;

  return (
    <div className="mb-6 lg:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground"
      >
        <span className="flex items-center gap-2">
          <List size={15} className="text-primary" />
          {messages.common.contents}
        </span>
        <ChevronDown
          size={16}
          className={`text-muted-foreground transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <nav className="mt-1 space-y-0.5 rounded-xl border border-border bg-card p-2">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  className={`block rounded-md px-2.5 py-1.5 text-sm transition-colors ${
                    active === item.id
                      ? "bg-primary-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
