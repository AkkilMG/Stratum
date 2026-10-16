"use client";

import { ReactNode } from "react";
import { ArrowRight, ExternalLink } from "@/components/ui/icons";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
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
  const { locale, messages } = useI18n();
  const isExternal = Boolean(href?.startsWith("http"));

  const inner = (
    <>
      {icon && (
        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary-muted text-primary">
          {icon}
        </div>
      )}
      <p className="mb-1 text-base font-semibold tracking-tight text-foreground">{title}</p>
      {body && <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>}
      {href && (
        <span className="mt-auto flex items-center gap-1.5 pt-3 text-sm font-medium text-primary">
          {messages.common.learnMore}
          {isExternal ? (
            <ExternalLink size={14} />
          ) : (
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          )}
        </span>
      )}
    </>
  );

  const base = `group relative flex h-full w-full flex-col rounded-xl border border-border bg-card p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-[0_10px_40px_-28px_rgba(0,0,0,0.8)] ${className}`;

  if (href) {
    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={base}>
          {inner}
        </a>
      );
    }
    return (
      <Link href={withBasePath(`/${locale}${href}`.replace(/\/+/g, "/"))} className={base}>
        {inner}
      </Link>
    );
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={base}>
        {inner}
      </button>
    );
  }
  return <div className={base}>{inner}</div>;
}

export function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-5 rounded-xl border border-border bg-[color-mix(in_srgb,var(--primary)_8%,var(--muted))] px-4 py-3 text-sm leading-relaxed text-foreground">
      {children}
    </div>
  );
}
