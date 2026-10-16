"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { withBasePath } from "@/lib/util";
import { Menu, X, Search, ChevronRight, ChevronDown, Star, GitBranch } from "@/components/ui/icons";
import { AnimatePresence, motion } from "motion/react";
import { GithubIcon } from "@/components/ui/GithubIcon";
import { LocaleMenu } from "./LocaleMenu";
import { ThemeToggle } from "./ThemeToggle";
import { nav } from "@/lib/nav";
import { siteConfig } from "@/lib/config";
import { useI18n } from "@/lib/i18n/context";
import Image from "next/image";

export function Header() {
  const { locale, messages } = useI18n();
  const [open, setOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const pathname = usePathname();
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const clean = pathname.startsWith(base) ? pathname.slice(base.length) || "/" : pathname;
  const current = clean.startsWith(`/${locale}/`)
    ? clean.slice(`/${locale}`.length) || "/"
    : clean === `/${locale}`
      ? "/"
      : clean;

  const activeSection = nav.find(
    (s) => current.startsWith(`/${s.id}`) || (s.id === "introduction" && current === "/")
  )?.id;

  useEffect(() => {
    if (open) {
      setOpenSection(activeSection ?? nav[0]?.id ?? null);
    }
  }, [open, activeSection]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function openSearch() {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[90rem] items-center gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
          <button
            onClick={() => setOpen(true)}
            aria-label={messages.header.menu}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-muted-foreground transition-colors hover:border-border hover:bg-muted hover:text-foreground md:hidden"
          >
            <Menu size={17} />
          </button>

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

          <div className="ml-auto hidden items-center gap-1.5 md:flex">
            <Link
              href={withBasePath(`/${locale}/changelog/overview`)}
              className="hidden items-center gap-1.5 rounded-md border border-border bg-muted px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground lg:inline-flex"
            >
              <GitBranch size={13} className="text-primary" />v{siteConfig.version}
            </Link>
            <button
              onClick={openSearch}
              className="flex w-56 items-center gap-2 rounded-md border border-border bg-muted px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring xl:w-64"
            >
              <Search size={15} />
              <span className="flex-1 text-left">{messages.header.searchShort}</span>
              <span className="flex items-center gap-0.5 text-[0.7rem]">
                <kbd className="rounded bg-card px-1 py-0.5">⌘</kbd>
                <kbd className="rounded bg-card px-1 py-0.5">K</kbd>
              </span>
            </button>
            <a
              href={siteConfig.repo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={messages.header.github}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-muted-foreground transition-colors hover:border-border hover:bg-muted hover:text-foreground"
            >
              <GithubIcon size={16} />
            </a>
            <ThemeToggle />
            <LocaleMenu />
          </div>

          <div className="ml-auto flex items-center gap-0.5 md:hidden">
            <button
              onClick={openSearch}
              aria-label={messages.header.search}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Search size={17} />
            </button>
            <ThemeToggle />
            <LocaleMenu />
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
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 40 }}
              className="fixed left-0 top-0 z-50 h-full w-[86%] max-w-sm overflow-y-auto border-r border-border bg-card p-5 md:hidden"
            >
              <div className="mb-4 flex items-center justify-between">
                <Link
                  href={withBasePath(`/${locale}`)}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2"
                >
                  <Image
                    src={withBasePath("/brand/stratum-icon.png")}
                    alt="Stratum"
                    width={22}
                    height={22}
                    className="rounded-md"
                  />
                  <span className="text-sm font-semibold">{messages.brand.name}</span>
                </Link>
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

              <nav className="space-y-1">
                {nav.map((section) => {
                  const isOpen = openSection === section.id;
                  const isActiveSection = activeSection === section.id;
                  return (
                    <div key={section.id} className="overflow-hidden rounded-lg">
                      <button
                        onClick={() => setOpenSection(isOpen ? null : section.id)}
                        aria-expanded={isOpen}
                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                          isActiveSection
                            ? "text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        {messages.sidebar.sections[section.id] ?? section.label}
                        <ChevronDown
                          size={15}
                          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                          >
                            <div className="ml-2 space-y-0.5 border-l border-border pl-2">
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
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </nav>

              <div className="mt-6 grid grid-cols-2 gap-2">
                <a
                  href={siteConfig.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-md border border-border px-2.5 py-2 text-sm text-muted-foreground"
                >
                  <GithubIcon size={16} />
                  {messages.header.github}
                </a>
                <a
                  href={siteConfig.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-md border border-border bg-muted px-2.5 py-2 text-sm text-muted-foreground"
                >
                  <Star size={15} className="text-warning" />
                  Star
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
