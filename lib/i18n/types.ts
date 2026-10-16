export interface FeatureItem {
  title: string;
  body: string;
}

export interface ExploreItem {
  title: string;
  body: string;
  href: string;
}

export interface Messages {
  brand: {
    name: string;
    tagline: string;
  };
  header: {
    search: string;
    searchShort: string;
    language: string;
    theme: string;
    light: string;
    dark: string;
    system: string;
    github: string;
    menu: string;
    close: string;
  };
  sidebar: {
    label: string;
    sections: Record<string, string>;
    backHome: string;
  };
  search: {
    title: string;
    placeholder: string;
    empty: string;
    emptyHint: string;
    navigate: string;
    open: string;
    close: string;
    results: string;
  };
  toc: {
    title: string;
  };
  footer: {
    prev: string;
    next: string;
    rights: string;
    madeBy: string;
    docsHome: string;
    product: string;
  };
  common: {
    notTranslated: string;
    notTranslatedBody: string;
    capture: string;
    captureHint: string;
    copy: string;
    copied: string;
    learnMore: string;
    version: string;
    basedOn: string;
    home: string;
    backToTop: string;
    contents: string;
  };
  home: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    subtitle: string;
    getStarted: string;
    viewGuide: string;
    featuresTitle: string;
    featuresSubtitle: string;
    exploreTitle: string;
    exploreSubtitle: string;
    stats: { local: string; versioned: string; instant: string; searchable: string };
    ctaTitle: string;
    ctaSubtitle: string;
    ctaButton: string;
    features: FeatureItem[];
    explore: ExploreItem[];
  };
}
