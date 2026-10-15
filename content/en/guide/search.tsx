import { definePage } from "@/lib/content/types";
import { Screenshot } from "@/components/ui/Screenshot";
import { H2, H3, Lead } from "@/components/ui/Heading";

export default definePage(
  {
    title: "Search",
    description: "Semantic search with AI and keyword fallback.",
    slug: "guide/search",
    sectionId: "guide",
    toc: [
      { id: "semantic", label: "Semantic search" },
      { id: "keyword", label: "Keyword fallback" },
      { id: "tips", label: "Search tips" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>Find assets by meaning, not just filenames.</Lead>
        <Screenshot name="search" caption="Search results" />
        <H2 id="semantic">Semantic search</H2>
        <p>With Ollama and <code>nomic-embed-text</code>, Stratum embeds assets and returns meaning-based matches.</p>

        <H2 id="keyword">Keyword fallback</H2>
        <p>If AI is offline or unavailable, search falls back to filename/metadata keywords.</p>

        <H2 id="tips">Search tips</H2>
        <ul>
          <li>Describe what you want: &ldquo;rusty metal crate&rdquo;</li>
          <li>Combine with filters in the Library</li>
          <li>Use tags to improve recall</li>
        </ul>
      </>
    );
  }
);

