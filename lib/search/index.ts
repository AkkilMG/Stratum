export interface SearchDoc {
  slug: string;
  title: string;
  description: string;
  section: string;
}

export const searchDocs: SearchDoc[] = [
  { slug: "introduction/what-is-stratum", title: "What is Stratum", description: "Local-first versioned searchable asset vault for game studios. Overview, how it works, use cases.", section: "introduction" },
  { slug: "introduction/concepts", title: "Core concepts", description: "Space, asset, versions, tags, index and thumbnails, sync and studio hub, local AI.", section: "introduction" },
  { slug: "getting-started/installation", title: "Installation", description: "Requirements, download, Windows, Linux, macOS, build from source, Ollama models.", section: "getting-started" },
  { slug: "getting-started/first-launch", title: "First launch", description: "Splash, language, legal gate, setup wizard, home screen, guided tour.", section: "getting-started" },
  { slug: "guide/spaces", title: "Spaces", description: "Create new space, open a folder, join a studio space, recent spaces.", section: "guide" },
  { slug: "guide/importing", title: "Importing assets", description: "Drag and drop, add files, where imported files go.", section: "guide" },
  { slug: "guide/library", title: "Browsing the library", description: "Grid and list layout, filters, tags, sort order, search results, thumbnails.", section: "guide" },
  { slug: "guide/asset-details", title: "Asset details & versions", description: "Detail drawer, compare versions, restore a version, edit tags.", section: "guide" },
  { slug: "guide/tags", title: "Tags", description: "Manual tags, AI tagging with LLaVA, shared tags file .stratum-tags.json.", section: "guide" },
  { slug: "guide/search", title: "Search", description: "Semantic search with nomic-embed-text, keyword fallback, search tips.", section: "guide" },
  { slug: "guide/activity-sync", title: "Activity & Sync", description: "Activity timeline, remote URL, sync now, conflict handling.", section: "guide" },
  { slug: "guide/studio-sync", title: "Studio / NAS hub", description: "Create hub, join hub, network notes, NAS behavior.", section: "guide" },
  { slug: "guide/local-ai", title: "Local AI", description: "Ollama, system check, download models, tagging, semantic search.", section: "guide" },
  { slug: "guide/settings", title: "Settings", description: "Profile, language, appearance, space info, local AI, updates, support.", section: "guide" },
  { slug: "guide/shortcuts", title: "Shortcuts & Command palette", description: "Ctrl/Cmd+K command palette, focus search, shortcuts modal.", section: "guide" },
  { slug: "guide/tour", title: "Guided tour", description: "60-second interactive tour, replay.", section: "guide" },
  { slug: "reference/asset-kinds", title: "Asset kinds & extensions", description: "Image, vector, source, model, audio, other file types.", section: "reference" },
  { slug: "reference/shortcuts-table", title: "Keyboard shortcuts", description: "Full shortcut reference table.", section: "reference" },
  { slug: "reference/error-codes", title: "Error codes", description: "Backend error codes E:git, E:io, E:net, E:ollama.", section: "reference" },
  { slug: "reference/data-location", title: "Data & index location", description: "Index and thumbnails stored in local app-data keyed by vault path hash.", section: "reference" },
  { slug: "troubleshooting/faq", title: "FAQ", description: "Offline, vendor lock-in, AI required, why Git, network shares.", section: "troubleshooting" },
  { slug: "building/overview", title: "Building from source", description: "Prerequisites, steps, Docker for Linux, contributing.", section: "building" },
  { slug: "changelog/overview", title: "Changelog", description: "v0.1.0 release notes and roadmap.", section: "changelog" },
];

export async function buildSearchIndex(locale: string): Promise<SearchDoc[]> {
  void locale;
  return searchDocs;
}
