"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { withBasePath } from "@/lib/util";
import { Menu, X, Search, ChevronRight } from "@/components/ui/icons";
import { AnimatePresence, motion } from "motion/react";
import { GithubIcon } from "@/components/ui/GithubIcon";
import { LocaleMenu } from "./LocaleMenu";
import { ThemeToggle } from "./ThemeToggle";
import { nav } from "@/lib/nav";
import { siteConfig } from "@/lib/config";
import Image from "next/image";

export function Header({ locale, messages }: { locale: string; messages: any }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const clean = pathname.startsWith(base) ? pathname.slice(base.length) || "/" : pathname;
  const current = clean.startsWith(`/${locale}/`)
    ? clean.slice(`/${locale}`.length) || "/"
    : clean === `/${locale}`
      ? "/"
      : clean;

  function openSearch() {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 lg:px-8">
          <Link href={withBasePath(`/${locale}`)} className="flex items-center gap-2">
            <Image
              src={withBasePath("/brand/stratum-icon.png")}
              alt="Stratum"
              width={26}
              height={26}
              className="rounded-md shadow-sm"
            />
            <span className="text-sm font-semibold tracking-tight">
              {messages.brand.name}
              <span className="ml-1.5 hidden rounded-full border border-border bg-muted px-1.5 py-0.5 text-[0.7rem] font-medium text-muted-foreground sm:inline-block">
                {messages.brand.tagline}
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-1.5 md:flex">
            <button
              onClick={openSearch}
              className="flex items-center gap-2 rounded-md border border-border bg-muted px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
            >
              <Search size={15} />
              <span>{messages.header.searchShort}</span>
              <span className="ml-auto flex items-center gap-0.5 pl-3 text-[0.7rem]">
                <kbd className="rounded bg-card px-1 py-0.5">⌘</kbd>
                <kbd className="rounded bg-card px-1 py-0.5">K</kbd>
              </span>
            </button>
            <button
              onClick={openSearch}
              aria-label={messages.header.search}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-muted-foreground transition-colors hover:border-border hover:bg-muted hover:text-foreground"
            >
              <Search size={16} />
            </button>
            <a
              href={siteConfig.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-md border border-transparent px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-border hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
            >
              <GithubIcon size={16} />
              <span>{messages.header.github}</span>
            </a>
            <ThemeToggle />
            <LocaleMenu />
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <LocaleMenu />
            <button
              onClick={() => setOpen(true)}
              aria-label={messages.header.menu}
              className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Menu size={16} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 40 }}
              className="fixed right-0 top-0 z-50 h-full w-[82%] max-w-sm overflow-y-auto border-l border-border bg-card p-5 md:hidden"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-semibold">{messages.header.menu}</span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label={messages.header.close}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X size={18} />
                </button>
              </div>

              <button
                onClick={() => {
                  setOpen(false);
                  setTimeout(openSearch, 120);
                }}
                className="mb-4 flex w-full items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2 text-sm text-muted-foreground"
              >
                <Search size={15} />
                {messages.header.searchShort}
              </button>

              <nav className="space-y-4">
                {nav.map((section) => (
                  <div key={section.id}>
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {messages.sidebar.sections[section.id] ?? section.label}
                    </p>
                    <div className="space-y-0.5">
                      {section.items.map((item) => {
                        const active = current === `/${item.slug}`;
                        return (
                          <Link
                            key={item.slug}
                            href={withBasePath(`/${locale}/${item.slug}`)}
                            onClick={() => setOpen(false)}
                            className={`flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors ${
                              active
                                ? "bg-primary-muted text-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                          >
                            {item.title}
                            <ChevronRight size={14} />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>

              <a
                href={siteConfig.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center gap-2 rounded-md border border-border px-2.5 py-2 text-sm text-muted-foreground"
              >
                <GithubIcon size={16} />
                {messages.header.github}
              </a>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
