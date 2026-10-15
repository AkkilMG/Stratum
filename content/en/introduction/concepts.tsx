import { definePage } from "@/lib/content/types";
import { H2, H3, Lead } from "@/components/ui/Heading";

export default definePage(
  {
    title: "Core concepts",
    description: "Spaces, assets, versions, tags, index, sync, and local AI.",
    slug: "introduction/concepts",
    sectionId: "introduction",
    toc: [
      { id: "space", label: "Space / Vault" },
      { id: "asset", label: "Asset" },
      { id: "versions", label: "Versions" },
      { id: "tags", label: "Tags" },
      { id: "index", label: "Index & thumbnails" },
      { id: "sync", label: "Sync & studio hub" },
      { id: "ai", label: "Local AI" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>Understand the building blocks.</Lead>
        <H2 id="space">Space / Vault</H2>
        <p>A space is any folder on disk you open with Stratum. It remains a normal folder you can still browse with your OS.</p>

        <H2 id="asset">Asset</H2>
        <p>An asset is a file tracked by Stratum (images, vectors, PSD/AI, models, audio, and more).</p>

        <H2 id="versions">Versions</H2>
        <p>Every change becomes a version. You can preview and restore any version from the detail drawer.</p>

        <H2 id="tags">Tags</H2>
        <p>Tags are searchable labels. You can add them manually, or have AI generate them locally.</p>

        <H2 id="index">Index & thumbnails</H2>
        <p>Stratum builds an index in the local app-data directory, keyed by a hash of the vault path. Thumbnails are cached there to avoid polluting the vault.</p>

        <H2 id="sync">Sync & studio hub</H2>
        <p>Share a vault over your LAN/NAS. Stratum keeps conflicts by saving a teammate copy rather than losing work.</p>

        <H2 id="ai">Local AI</H2>
        <p>With Ollama installed and models downloaded, Stratum can tag images and power semantic search.</p>
      </>
    );
  }
);

