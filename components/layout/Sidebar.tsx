"use client";

import { nav } from "@/lib/nav";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { withBasePath } from "@/lib/util";
import { useI18n } from "@/lib/i18n/context";
import { ChevronRight, BookOpen } from "@/components/ui/icons";
import { motion } from "motion/react";
import { useState } from "react";
import { SlideIndicator } from "@/components/motion/Motion";

export function Sidebar({ locale, messages }: { locale: string; messages: any }) {
  const pathname = usePathname();
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const clean = pathname.startsWith(base) ? pathname.slice(base.length) || "/" : pathname;
  const current = clean.startsWith(`/${locale}/`) ? clean.slice(`/${locale}`.length) || "/" : clean;

  return (
    <aside className="sticky top-[4rem] hidden h-[calc(100dvh-4rem)] w-72 shrink-0 overflow-y-auto pb-10 pt-6 md:block">
      <div className="space-y-6 pr-2">
        <div>
          <Link
            href={withBasePath(`/${locale}`)}
            className="group inline-flex items-center gap-2 rounded-md border border-transparent px-1.5 py-1 text-sm text-muted-foreground transition-colors hover:border-border hover:bg-muted hover:text-foreground"
          >
            <BookOpen size={14} />
            {messages.sidebar.label}
            <ChevronRight size={13} className="ml-auto transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        {nav.map((section) => {
          const sectionHref = section.items[0]
            ? withBasePath(`/${locale}/${section.items[0].slug}`.replace(/\/+/g, "/"))
            : withBasePath(`/${locale}`);
          const isActiveSection = current.startsWith(`/${section.id}`) || (section.id === "introduction" && current === "/");

          return (
            <div key={section.id}>
              <Link
                href={sectionHref}
                className={`mb-2 inline-flex items-center text-xs font-semibold uppercase tracking-wider transition-colors ${
                  isActiveSection ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {messages.sidebar.sections[section.id] ?? section.label}
              </Link>
              <nav className="space-y-0.5">
                {section.items.map((item) => {
                  const href = withBasePath(`/${locale}/${item.slug}`.replace(/\/+/g, "/"));
                  const active = current === `/${item.slug}` || current === `${item.slug}`;
                  return (
                    <div key={item.slug} className="relative">
                      <Link
                        href={href}
                        className={`relative inline-flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-ring ${
                          active
                            ? "bg-primary-muted text-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        {active && <SlideIndicator />}
                        <span className="truncate">{item.title}</span>
                      </Link>
                    </div>
                  );
                })}
              </nav>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
