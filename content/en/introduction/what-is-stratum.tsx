import { definePage } from "@/lib/content/types";
import { Screenshot } from "@/components/ui/Screenshot";
import { H2, H3, Lead } from "@/components/ui/Heading";

export default definePage(
  {
    title: "What is Stratum",
    description: "A local-first versioned searchable asset vault for game studios.",
    slug: "introduction/what-is-stratum",
    sectionId: "introduction",
    toc: [
      { id: "overview", label: "Overview" },
      { id: "how", label: "How it works" },
      { id: "usecases", label: "Use cases" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>Stratum is a local-first asset vault for game studios. Every file is versioned, instantly searchable, and safe to work with offline.</Lead>
        <H2 id="overview">Overview</H2>
        <p>Features include versioning, semantic + keyword search, tags (manual and AI), studio sync over NAS/LAN, thumbnails, and a hardened desktop UI.</p>
        <Screenshot name="home" caption="Overview dashboard" />

        <H2 id="how">How it works</H2>
        <p>Stratum keeps your folder plain (no vendor lock-in). It uses Git for history and versions. The index and thumbnails live in your local app data directory keyed by the vault path hash, not inside the vault.</p>

        <H2 id="usecases">Use cases</H2>
        <ul>
          <li>Solo artists keeping a safe history of WIPs</li>
          <li>Small teams sharing a master asset library over a local network</li>
          <li>Organizing reference packs with fast semantic search</li>
        </ul>
      </>
    );
  }
);

