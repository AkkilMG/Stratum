"use client";

import { useState } from "react";
import { Check, Link2 } from "@/components/ui/icons";
import { useI18n } from "@/lib/i18n/context";

function Anchor({ id, children, level }: { id: string; children: React.ReactNode; level: 2 | 3 }) {
  const { messages } = useI18n();
  const [copied, setCopied] = useState(false);
  const Tag = level === 2 ? "h2" : "h3";

  function copyLink(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard?.writeText(url).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      },
      () => {}
    );
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  }

  return (
    <Tag
      id={id}
      className={`group relative scroll-mt-24 ${
        level === 2
          ? "mt-11 mb-4 text-[1.5rem] font-semibold tracking-tight first:mt-0"
          : "mt-8 mb-3 text-[1.15rem] font-semibold tracking-tight"
      }`}
    >
      <a
        href={`#${id}`}
        onClick={copyLink}
        title={messages.common.copy}
        className="absolute -left-7 top-0 flex h-full items-center text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-visible:opacity-100"
        aria-label="Link to this section"
      >
        {copied ? <Check size={level === 2 ? 18 : 15} className="text-tip" /> : <Link2 size={level === 2 ? 18 : 15} />}
      </a>
      <span className="text-foreground">{children}</span>
    </Tag>
  );
}

export function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <Anchor id={id} level={2}>
      {children}
    </Anchor>
  );
}

export function H3({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <Anchor id={id} level={3}>
      {children}
    </Anchor>
  );
}

export function Lead({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{children}</p>;
}
