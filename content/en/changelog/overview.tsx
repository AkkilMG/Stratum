import { definePage } from "@/lib/content/types";
import { H2, H3, Lead } from "@/components/ui/Heading";

export default definePage(
  {
    title: "Changelog",
    description: "Release notes and roadmap highlights.",
    slug: "changelog/overview",
    sectionId: "changelog",
    toc: [
      { id: "latest", label: "v0.1.0" },
      { id: "roadmap", label: "Roadmap" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>Stratum v0.1.0 — first public release.</Lead>
        <H2 id="latest">v0.1.0 highlights</H2>
        <ul>
          <li>Local-first vault with Git versioning</li>
          <li>Semantic search + keyword fallback</li>
          <li>AI tagging (LLaVA) + embeddings</li>
          <li>Studio sync over NAS/LAN</li>
          <li>Thumbnails for images, vectors, PSD</li>
          <li>Hardened desktop UI + signed updates</li>
          <li>Multi-language support (6 languages)</li>
        </ul>

        <H2 id="roadmap">Roadmap</H2>
        <p>See <code>ROADMAP.md</code> in the repo for upcoming features (screenshots/demo video, polish, etc.).</p>
      </>
    );
  }
);

