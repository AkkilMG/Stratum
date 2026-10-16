export const nav = [
  {
    id: "introduction",
    label: "Introduction",
    items: [
      { slug: "introduction/what-is-stratum", title: "What is Stratum" },
      { slug: "introduction/concepts", title: "Core concepts" },
    ],
  },
  {
    id: "getting-started",
    label: "Getting Started",
    items: [
      { slug: "getting-started/installation", title: "Installation" },
      { slug: "getting-started/first-launch", title: "First launch" },
    ],
  },
  {
    id: "guide",
    label: "User Guide",
    items: [
      { slug: "guide/spaces", title: "Spaces" },
      { slug: "guide/importing", title: "Importing assets" },
      { slug: "guide/library", title: "Browsing the library" },
      { slug: "guide/asset-details", title: "Asset details & versions" },
      { slug: "guide/tags", title: "Tags" },
      { slug: "guide/search", title: "Search" },
      { slug: "guide/activity-sync", title: "Activity & Sync" },
      { slug: "guide/studio-sync", title: "Studio / NAS hub" },
      { slug: "guide/local-ai", title: "Local AI" },
      { slug: "guide/settings", title: "Settings" },
      { slug: "guide/shortcuts", title: "Shortcuts & Command palette" },
      { slug: "guide/tour", title: "Guided tour" },
    ],
  },
  {
    id: "reference",
    label: "Reference",
    items: [
      { slug: "reference/asset-kinds", title: "Asset kinds & extensions" },
      { slug: "reference/shortcuts-table", title: "Keyboard shortcuts" },
      { slug: "reference/error-codes", title: "Error codes (E:...)" },
      { slug: "reference/data-location", title: "Data & index location" },
    ],
  },
  {
    id: "troubleshooting",
    label: "Troubleshooting",
    items: [{ slug: "troubleshooting/faq", title: "FAQ" }],
  },
  {
    id: "building",
    label: "For Developers",
    items: [{ slug: "building/overview", title: "Build & contribute" }],
  },
  {
    id: "changelog",
    label: "Changelog",
    items: [{ slug: "changelog/overview", title: "Changelog" }],
  },
];

export interface NavItem {
  slug: string;
  title: string;
}

export function flattenNav(): NavItem[] {
  const out: NavItem[] = [];
  for (const s of nav) {
    for (const i of s.items) out.push(i);
  }
  return out;
}

export function getPrevNext(slug?: string | null): { prev: NavItem | null; next: NavItem | null } {
  const flat = flattenNav();
  const idx = flat.findIndex((f) => f.slug === (slug ?? ""));
  return {
    prev: idx > 0 ? flat[idx - 1] : null,
    next: idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null,
  };
}

export function sectionLabel(sectionId: string): string {
  return nav.find((s) => s.id === sectionId)?.label ?? sectionId;
}
