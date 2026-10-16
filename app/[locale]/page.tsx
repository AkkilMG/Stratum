import { redirect } from "next/navigation";
import { type Locale, defaultLocale, isLocale, locales } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { I18nProvider } from "@/lib/i18n/context";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { ProgressBar } from "@/components/layout/ProgressBar";
import { SearchModal } from "@/components/layout/SearchModal";
import { BackToTop } from "@/components/layout/BackToTop";
import { Aurora, Reveal } from "@/components/motion/Motion";
import Link from "next/link";
import { withBasePath } from "@/lib/util";
import { ArrowRight, BookOpen, GitBranch, Layers, List, Rocket, Sparkles } from "@/components/ui/icons";
import { Card } from "@/components/ui/Card";
import { Screenshot } from "@/components/ui/Screenshot";
import type { ReactNode } from "react";

const exploreIcons: Record<string, ReactNode> = {
  "/getting-started/installation": <Rocket size={18} />,
  "/guide/library": <BookOpen size={18} />,
  "/introduction/concepts": <Layers size={18} />,
  "/reference/asset-kinds": <List size={18} />,
  "/building/overview": <GitBranch size={18} />,
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: loc } = await params;
  if (!isLocale(loc)) redirect(`/${defaultLocale}`);
  const locale = loc as Locale;
  const messages = getMessages(locale);

  return (
    <I18nProvider locale={locale}>
      <div className="relative min-h-screen bg-background text-foreground">
        <ProgressBar />
        <SearchModal />
        <BackToTop />
        <Header />
        <div className="mx-auto flex max-w-[90rem] gap-8 px-4 sm:px-6 lg:px-8">
          <Sidebar />
          <main className="min-w-0 flex-1 pb-20 pt-6 md:pt-10">
            <Aurora className="mx-auto max-w-5xl rounded-2xl border border-border bg-card/80 p-8 shadow-lg shadow-[0_40px_120px_-60px_rgba(0,0,0,0.8)] sm:p-10">
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  <Sparkles size={14} className="text-primary" />
                  {messages.home.eyebrow}
                </span>
                <h1 className="mt-5 text-balance text-[2.4rem] font-semibold tracking-tight sm:text-[3.2rem]">
                  {messages.home.title}{" "}
                  <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                    {messages.home.titleAccent}
                  </span>
                </h1>
                <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{messages.home.subtitle}</p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    href={withBasePath(`/${locale}/getting-started/installation`)}
                    className="group inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-[0_20px_60px_-30px_rgba(139,125,255,0.9)] focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    {messages.home.getStarted}
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    href={withBasePath(`/${locale}/guide/library`)}
                    className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    {messages.home.viewGuide}
                  </Link>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                  {[
                    { k: messages.home.stats.local, v: "Offline-first" },
                    { k: messages.home.stats.versioned, v: "Git-powered" },
                    { k: messages.home.stats.instant, v: "Semantics + keywords" },
                    { k: messages.home.stats.searchable, v: "Local AI" },
                  ].map((s, i) => (
                    <Reveal
                      key={s.k}
                      delay={0.08 + i * 0.04}
                      className="rounded-xl border border-border bg-[color-mix(in_srgb,var(--background)_70%,transparent)] px-4 py-3"
                    >
                      <p className="font-semibold text-foreground">{s.k}</p>
                      <p className="text-xs text-muted-foreground">{s.v}</p>
                    </Reveal>
                  ))}
                </div>
              </Reveal>
            </Aurora>

            <Reveal className="mx-auto mt-10 max-w-5xl">
              <Screenshot name="home" caption="Stratum in dark mode" />
            </Reveal>

            <Reveal className="mx-auto mt-12 max-w-5xl">
              <h2 className="text-[1.7rem] font-semibold tracking-tight">{messages.home.featuresTitle}</h2>
              <p className="mt-1.5 text-muted-foreground">{messages.home.featuresSubtitle}</p>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {messages.home.features.map((f, i) => (
                  <Reveal key={f.title} delay={0.04 * i}>
                    <Card title={f.title} body={f.body} />
                  </Reveal>
                ))}
              </div>
            </Reveal>

            <Reveal className="mx-auto mt-12 max-w-5xl">
              <h2 className="text-[1.7rem] font-semibold tracking-tight">{messages.home.exploreTitle}</h2>
              <p className="mt-1.5 text-muted-foreground">{messages.home.exploreSubtitle}</p>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {messages.home.explore.map((e, i) => {
                  const isLast = i === messages.home.explore.length - 1;
                  return (
                    <Reveal
                      key={e.title}
                      delay={0.05 * i}
                      className={isLast ? "h-full sm:col-span-2 lg:col-span-2" : "h-full"}
                    >
                      <Card href={e.href} title={e.title} body={e.body} icon={exploreIcons[e.href]} />
                    </Reveal>
                  );
                })}
              </div>
            </Reveal>

            <Reveal className="mx-auto mt-12 max-w-5xl">
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card px-6 py-8 text-center shadow-sm sm:px-10 sm:py-10">
                <div className="grid-fade absolute inset-0 opacity-30" />
                <div className="relative">
                  <h3 className="text-[1.8rem] font-semibold tracking-tight sm:text-[2.1rem]">
                    {messages.home.ctaTitle}
                  </h3>
                  <p className="mt-2 text-muted-foreground">{messages.home.ctaSubtitle}</p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Link
                      href={withBasePath(`/${locale}/getting-started/installation`)}
                      className="group inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 hover:shadow-md hover:shadow-[0_20px_60px_-30px_rgba(139,125,255,0.9)]"
                    >
                      {messages.home.ctaButton}
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </main>
        </div>
        <Footer locale={locale} messages={messages} meta={undefined} />
      </div>
    </I18nProvider>
  );
}
