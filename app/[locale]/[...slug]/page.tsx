import { notFound, redirect } from "next/navigation";
import { type Locale, defaultLocale, isLocale, locales } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { I18nProvider } from "@/lib/i18n/context";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Toc, MobileToc } from "@/components/layout/Toc";
import { Footer } from "@/components/layout/Footer";
import { ProgressBar } from "@/components/layout/ProgressBar";
import { SearchModal } from "@/components/layout/SearchModal";
import { BackToTop } from "@/components/layout/BackToTop";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { NotTranslated } from "@/components/layout/NotTranslated";
import { getDocPage, getAllSlugs } from "@/lib/content/registry";
import { isContentTranslated } from "@/lib/content/translated";
import { getPrevNext } from "@/lib/nav";

export function generateStaticParams() {
  const all: { locale: string; slug: string[] }[] = [];
  for (const locale of locales) {
    for (const s of getAllSlugs(locale)) {
      all.push({ locale, slug: s.split("/").filter(Boolean) });
    }
  }
  return all;
}

export const dynamicParams = false;

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}) {
  const { locale: loc, slug } = await params;
  if (!isLocale(loc)) redirect(`/${defaultLocale}`);
  const locale = loc as Locale;
  const path = (slug ?? []).join("/");
  const page = getDocPage(locale, path);
  if (!page) notFound();

  const meta = page.meta;
  const Body = page.Body;
  const messages = getMessages(locale);
  const translated = isContentTranslated(locale, path);
  const sectionLabel = messages.sidebar.sections[meta.sectionId] ?? messages.brand.name;
  const { prev } = getPrevNext(meta.slug);

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
            {locale !== defaultLocale && !translated && (
              <NotTranslated locale={locale} path={path} messages={messages} />
            )}
            <MobileToc meta={meta} />
            <article className="mx-auto max-w-3xl">
              <Breadcrumbs
                locale={locale}
                home={messages.common.home}
                section={sectionLabel}
                sectionHref={prev ? `/${locale}/${prev.slug}` : undefined}
                title={meta.title}
              />
              <header className="mb-8 border-b border-border pb-6">
                <p className="section-label">{sectionLabel}</p>
                <h1 className="mt-2 text-[2rem] font-semibold tracking-tight sm:text-[2.4rem]">
                  {meta.title}
                </h1>
                {meta.description && (
                  <p className="mt-2 text-base text-muted-foreground">{meta.description}</p>
                )}
              </header>
              <div className="doc-content">
                <Body />
              </div>
            </article>
          </main>
          <Toc meta={meta} />
        </div>
        <Footer locale={locale} messages={messages} meta={meta} />
      </div>
    </I18nProvider>
  );
}
