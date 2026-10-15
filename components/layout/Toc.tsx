"use client";

import { List } from "@/components/ui/icons";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export function Toc({ locale, messages, meta }: { locale: string; messages: any; meta: any }) {
  const items = useMemo<Array<{ id: string; label: string }>>(() => meta?.toc ?? [], [meta]);
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

  if (items.length === 0) return null;

  return (
    <aside className="sticky top-[4rem] hidden h-[calc(100dvh-4rem)] w-64 shrink-0 pb-10 pt-6 lg:block">
      <div className="space-y-2 pr-2">
        <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <List size={12} />
          {messages.toc.title}
        </div>
        {items.map((item: any) => (
          <Link
            key={item.id}
            href={`#${item.id}`}
            className={`block rounded-md px-2 py-1 text-sm transition-colors ${
              active === item.id
                ? "bg-primary-muted text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
