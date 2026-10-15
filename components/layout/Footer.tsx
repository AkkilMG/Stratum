import { useI18n } from "@/lib/i18n/context";
import Link from "next/link";
import { withBasePath } from "@/lib/util";
import { ChevronLeft, ChevronRight } from "@/components/ui/icons";
import { nav } from "@/lib/nav";

function flattenNav() {
  const out: Array<{ slug: string; title: string }> = [];
  for (const s of nav) {
    for (const i of s.items) out.push(i);
  }
  return out;
}

export function Footer({ locale, messages, meta }: { locale: string; messages: any; meta: any }) {
  const flat = flattenNav();
  const currentIdx = flat.findIndex((f) => f.slug === (meta?.slug ?? ""));
  const prev = currentIdx > 0 ? flat[currentIdx - 1] : null;
  const next = currentIdx >= 0 && currentIdx < flat.length - 1 ? flat[currentIdx + 1] : null;

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              {messages.brand.name} {messages.footer.product}
            </p>
            <p className="text-sm text-muted-foreground">
              {messages.footer.madeBy} · {messages.footer.rights}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <Link href={withBasePath(`/${locale}`)} className="hover:text-foreground">
              {messages.footer.docsHome}
            </Link>
            <a href="https://github.com/AkkilMG/Stratum" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
              GitHub
            </a>
          </div>
        </div>
        {(prev || next) && (
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {prev && (
              <Link
                href={withBasePath(`/${locale}/${prev.slug}`)}
                className="group flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 transition-all hover:-translate-y-0.5 hover:shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <ChevronLeft size={16} className="text-muted-foreground" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">{messages.footer.prev}</p>
                    <p className="text-sm font-medium text-foreground">{prev.title}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
            {next && (
              <Link
                href={withBasePath(`/${locale}/${next.slug}`)}
                className="group flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 transition-all hover:-translate-y-0.5 hover:shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">{messages.footer.next}</p>
                    <p className="text-sm font-medium text-foreground">{next.title}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>
        )}
      </div>
    </footer>
  );
}
