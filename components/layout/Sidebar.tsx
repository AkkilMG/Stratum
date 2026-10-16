"use client";

import { nav } from "@/lib/nav";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { withBasePath } from "@/lib/util";
import { useI18n } from "@/lib/i18n/context";
import { ChevronDown, BookOpen, Star } from "@/components/ui/icons";
import { GithubIcon } from "@/components/ui/GithubIcon";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export function Sidebar() {
  const { locale, messages } = useI18n();
  const pathname = usePathname();
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const clean = pathname.startsWith(base) ? pathname.slice(base.length) || "/" : pathname;
  const current = clean.startsWith(`/${locale}/`) ? clean.slice(`/${locale}`.length) || "/" : clean;

  const activeSection = nav.find(
    (s) => current.startsWith(`/${s.id}`) || (s.id === "introduction" && current === "/")
  )?.id;

  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(nav.map((s) => [s.id, s.id === activeSection]))
  );

  function toggle(id: string) {
    setOpen((o) => ({ ...o, [id]: !o[id] }));
  }

  return (
    <aside className="sticky top-[3.75rem] hidden h-[calc(100dvh-3.75rem)] w-72 shrink-0 flex-col overflow-hidden pb-10 pt-6 md:flex">
      <div className="scroll-fade min-h-0 flex-1 overflow-y-auto pr-2">
        <Link
          href={withBasePath(`/${locale}`)}
          className={`group mb-4 inline-flex w-full items-center gap-2 rounded-md border px-2.5 py-2 text-sm font-medium transition-colors ${
            current === "/"
              ? "border-border bg-primary-muted text-foreground"
              : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <BookOpen size={15} className="text-primary" />
          {messages.sidebar.label}
        </Link>

        <nav className="space-y-1.5 pb-6">
          {nav.map((section) => {
            const isOpen = open[section.id];
            const isActiveSection = activeSection === section.id;
            return (
              <div key={section.id}>
                <button
                  onClick={() => toggle(section.id)}
                  aria-expanded={isOpen}
                  className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                    isActiveSection ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {messages.sidebar.sections[section.id] ?? section.label}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-0.5 pb-1 pt-0.5">
                        {section.items.map((item) => {
                          const href = withBasePath(`/${locale}/${item.slug}`.replace(/\/+/g, "/"));
                          const active = current === `/${item.slug}` || current === `${item.slug}`;
                          return (
                            <Link
                              key={item.slug}
                              href={href}
                              className={`relative flex items-center rounded-md py-1.5 pl-4 pr-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-ring ${
                                active
                                  ? "bg-primary-muted font-medium text-foreground"
                                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                              }`}
                            >
                              {active && (
                                <motion.span
                                  layoutId="sidebar-active"
                                  className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-primary"
                                  transition={{ type: "spring", stiffness: 500, damping: 36 }}
                                />
                              )}
                              <span className="truncate">{item.title}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>
      </div>

      <a
        href="https://github.com/AkkilMG/Stratum"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex shrink-0 items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-2.5 text-sm transition-colors hover:bg-muted"
      >
        <GithubIcon size={18} className="text-muted-foreground" />
        <span className="flex-1">
          <span className="block font-medium text-foreground">Star on GitHub</span>
          <span className="block text-xs text-muted-foreground">Support Stratum</span>
        </span>
        <Star size={15} className="text-warning" />
      </a>
    </aside>
  );
}
