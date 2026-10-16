"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { withBasePath } from "@/lib/util";

export function DocLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { locale } = useI18n();

  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={withBasePath(`/${locale}${href}`.replace(/\/+/g, "/"))} className={className}>
      {children}
    </Link>
  );
}
