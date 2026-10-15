"use client";

import { ReactNode } from "react";
import { ExternalLink } from "@/components/ui/icons";
import Link from "next/link";
import { withBasePath } from "@/lib/util";

interface CardProps {
  href?: string;
  title: string;
  body?: string;
  icon?: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ href, title, body, icon, className = "", onClick }: CardProps) {
  const inner = (
    <>
      {icon && <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-primary-muted text-primary">{icon}</div>}
      <p className="mb-1 text-base font-semibold tracking-tight text-foreground">{title}</p>
      {body && <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>}
      {href && (
        <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary">
          Learn more
          <ExternalLink size={14} />
        </span>
      )}
    </>
  );

  const base = `group relative rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-[0_10px_40px_-28px_rgba(0,0,0,0.8)] ${className}`;
  if (href) {
    const isExternal = href.startsWith("http");
    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={base}>
          {inner}
        </a>
      );
    }
    return (
      <Link href={withBasePath(href)} className={base}>
        {inner}
      </Link>
    );
  }
  return (
    <button onClick={onClick} className={`${base} text-left`}>
      {inner}
    </button>
  );
}

export function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-5 rounded-xl border border-border bg-[color-mix(in_srgb,var(--primary)_8%,var(--muted))] px-4 py-3 text-sm leading-relaxed text-foreground">
      {children}
    </div>
  );
}
