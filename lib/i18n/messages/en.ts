import type { Messages } from "../types";

export const en: Messages = {
  brand: {
    name: "Stratum",
    tagline: "Documentation",
  },
  header: {
    search: "Search",
    searchShort: "Search docs…",
    language: "Language",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    system: "System",
    github: "GitHub",
    menu: "Menu",
    close: "Close",
  },
  sidebar: {
    label: "Documentation",
    sections: {
      introduction: "Introduction",
      "getting-started": "Getting Started",
      guide: "User Guide",
      reference: "Reference",
      troubleshooting: "Troubleshooting",
      building: "For Developers",
      changelog: "Changelog",
    },
    backHome: "Back to overview",
  },
  search: {
    title: "Search the documentation",
    placeholder: "Search guides, features, shortcuts…",
    empty: "No results found",
    emptyHint: "Try a different keyword, or browse the sidebar.",
    navigate: "to navigate",
    open: "to open",
    close: "to close",
    results: "results",
  },
  toc: {
    title: "On this page",
  },
  footer: {
    prev: "Previous",
    next: "Next",
    rights: "All rights reserved.",
    madeBy: "Built by Arkynox",
    docsHome: "Documentation home",
    product: "Product",
  },
  common: {
    notTranslated: "This page is not translated yet",
    notTranslatedBody:
      "You are viewing the English source. Switch to English for the full experience, or help translate this page.",
    capture: "Screenshot coming soon",
    captureHint: "Place “{name}.png” in /public/screenshots to replace this frame.",
    copy: "Copy",
    copied: "Copied!",
    learnMore: "Learn more",
    version: "Version",
    basedOn: "Based on",
    home: "Home",
    backToTop: "Back to top",
    contents: "Contents",
  },
  home: {
    eyebrow: "Stratum · Documentation",
    title: "Your studio's assets,",
    titleAccent: "versioned and searchable.",
    subtitle:
      "Stratum is a local-first asset vault for game studios. Every file is versioned, instantly searchable, and safe offline — with optional AI tagging and teammate sync over your own network.",
    getStarted: "Get started",
    viewGuide: "Open the user guide",
    featuresTitle: "Everything your art pipeline needs",
    featuresSubtitle:
      "No cloud account. No lock-in. Just a folder on disk that grows a memory.",
    exploreTitle: "Start exploring",
    exploreSubtitle: "Jump straight into the part of Stratum you need.",
    stats: {
      local: "Local-first",
      versioned: "Versioned",
      instant: "Instant search",
      searchable: "AI-assisted",
    },
    ctaTitle: "Ready to bring order to your assets?",
    ctaSubtitle: "Install Stratum, point it at a folder, and let it remember everything.",
    ctaButton: "Install Stratum",
    features: [
      {
        title: "Local-first & offline",
        body: "Everything lives in a plain folder on your disk. No account, no upload, no lock-in.",
      },
      {
        title: "Automatic versioning",
        body: "Every change becomes a restorable version, powered by Git under the hood.",
      },
      {
        title: "Find anything instantly",
        body: "Semantic search with AI plus a keyword fallback, even across huge libraries.",
      },
      {
        title: "Built for teams",
        body: "Sync a shared vault over your LAN or NAS. Conflicts are kept, never lost.",
      },
      {
        title: "AI that tags for you",
        body: "Optional local models describe image assets and add searchable tags.",
      },
      {
        title: "Safe by default",
        body: "A hardened desktop shell, signed updates, and no telemetry at all.",
      },
    ],
    explore: [
      {
        title: "Quick start",
        body: "Install Stratum on Windows, macOS, or Linux in a few minutes.",
        href: "/getting-started/installation",
      },
      {
        title: "User guide",
        body: "Learn every screen and workflow, from importing to restoring versions.",
        href: "/guide/library",
      },
      {
        title: "Core concepts",
        body: "Understand spaces, assets, versions, tags, and how sync really works.",
        href: "/introduction/concepts",
      },
      {
        title: "Reference",
        body: "Supported file types, keyboard shortcuts, and backend error codes.",
        href: "/reference/asset-kinds",
      },
      {
        title: "For developers",
        body: "Build Stratum from source, run the tests, and contribute to the project.",
        href: "/building/overview",
      },
    ],
  },
};
