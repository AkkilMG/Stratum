import { definePage } from "@/lib/content/types";
import { Screenshot } from "@/components/ui/Screenshot";
import { H2, Lead } from "@/components/ui/Heading";
import { Admonition } from "@/components/ui/Admonition";
import { Table } from "@/components/ui/Table";

export default definePage(
  {
    title: "Search",
    description: "Semantic search, keyword fallback, and tips for finding assets fast.",
    slug: "guide/search",
    sectionId: "guide",
    toc: [
      { id: "opening", label: "Opening search" },
      { id: "semantic", label: "Semantic search" },
      { id: "keyword", label: "Keyword fallback" },
      { id: "tips", label: "Search tips" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>
          Search understands meaning. Describe what you're after in plain words and Stratum finds
          it — even when the file name says nothing useful.
        </Lead>

        <Screenshot name="search" caption="Semantic results, ranked by how well they match." />

        <H2 id="opening">Opening search</H2>
        <p>You can start a search from anywhere:</p>
        <Table
          head={["Shortcut", "Action"]}
          rows={[
            ["Ctrl / ⌘ + K", "Open search (also the command palette)"],
            ["/", "Focus search from the library"],
            ["Click the search box", "Top bar search field"],
          ]}
        />

        <H2 id="semantic">Semantic search</H2>
        <p>
          With local AI enabled, Stratum embeds assets using <code>nomic-embed-text</code> and
          compares the meaning of your query to the meaning of each asset's description and name.
          This is why <em>"red desert map"</em> can surface <code>sector_03.png</code> even though
          none of those words appear in its name.
        </p>
        <Admonition type="note">
          Semantic search needs the embeddings model. If it isn't installed, Stratum automatically
          falls back to keyword search — it never just fails.
        </Admonition>

        <H2 id="keyword">Keyword fallback</H2>
        <p>
          Keyword search matches your terms against file names, paths and tags, using sensible
          ranking (name matches score highest). It works with no AI installed at all, and it's still
          the fastest way to find something you know the name of.
        </p>

        <H2 id="tips">Search tips</H2>
        <ul>
          <li>
            <strong>Describe, don't name.</strong> "weathered stone wall texture" beats guessing the
            filename.
          </li>
          <li>
            <strong>Mix in tags.</strong> Terms matching a tag are boosted, so <em>"armor hero"</em>{" "}
            finds your tagged hero pieces.
          </li>
          <li>
            <strong>Combine filters.</strong> Run a search, then narrow by kind or modified date in
            the library.
          </li>
          <li>
            <strong>Re-run after edits.</strong> Newly imported assets become searchable once
            indexing (and embedding) finishes.
          </li>
        </ul>
      </>
    );
  }
);
