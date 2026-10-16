import Link from "next/link";
import { withBasePath } from "@/lib/util";
import { ChevronLeft, ChevronRight } from "@/components/ui/icons";
import { GithubIcon } from "@/components/ui/GithubIcon";
import { getPrevNext } from "@/lib/nav";
import { siteConfig } from "@/lib/config";

export function Footer({ locale, messages, meta }: { locale: string; messages: any; meta: any }) {
  const { prev, next } = getPrevNext(meta?.slug);

  return (
    <footer className="border-t border-border bg-[color-mix(in_srgb,var(--sidebar)_60%,var(--background))]">
      <div className="mx-auto max-w-[90rem] px-4 py-10 sm:px-6 lg:px-8">
        {(prev || next) && (
          <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {prev ? (
              <Link
                href={withBasePath(`/${locale}/${prev.slug}`)}
                className="group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
              >
                <ChevronLeft size={18} className="text-primary transition-transform group-hover:-translate-x-0.5" />
                <span className="min-w-0">
                  <span className="block text-xs uppercase tracking-wider text-muted-foreground">
                    {messages.footer.prev}
                  </span>
                  <span className="block truncate text-sm font-medium text-foreground">{prev.title}</span>
                </span>
              </Link>
            ) : (
              <span className="hidden sm:block" />
            )}
            {next && (
              <Link
                href={withBasePath(`/${locale}/${next.slug}`)}
                className="group flex items-center justify-end gap-3 rounded-xl border border-border bg-card px-4 py-3 text-right transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
              >
                <span className="min-w-0">
                  <span className="block text-xs uppercase tracking-wider text-muted-foreground">
                    {messages.footer.next}
                  </span>
                  <span className="block truncate text-sm font-medium text-foreground">{next.title}</span>
                </span>
                <ChevronRight size={18} className="text-primary transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>
        )}

        <div className="flex flex-col gap-6 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              {messages.brand.name} {messages.footer.product}
            </p>
            <p className="text-sm text-muted-foreground">
              {messages.footer.madeBy} · {messages.footer.rights}
            </p>
            <p className="text-xs text-muted-foreground/80">{siteConfig.license}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <Link href={withBasePath(`/${locale}`)} className="hover:text-foreground">
              {messages.footer.docsHome}
            </Link>
            <a
              href={siteConfig.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-foreground"
            >
              <GithubIcon size={14} />
              GitHub
            </a>
            <a
              href={`${siteConfig.repo}/releases`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
            >
              Releases
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
