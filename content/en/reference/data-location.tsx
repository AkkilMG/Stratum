import { definePage } from "@/lib/content/types";
import { Admonition } from "@/components/ui/Admonition";
import { H2, H3, Lead } from "@/components/ui/Heading";

export default definePage(
  {
    title: "Data & index location",
    description: "Where index and thumbnails are stored (important for network drives).",
    slug: "reference/data-location",
    sectionId: "reference",
    toc: [
      { id: "location", label: "Location" },
      { id: "note", label: "Note" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>The index and thumbnails live in your local app-data directory, not in the vault.</Lead>
        <H2 id="location">Location</H2>
        <p>Stratum stores the SQLite index and thumbnail cache in the local app-data dir, keyed by a hash of the vault path. This keeps network shares performant and avoids polluting the vault.</p>
        <Admonition type="tip">Do not expect <code>&lt;vault&gt;/.stratum</code> to contain the index — it&rsquo;s deliberately in app data.</Admonition>
      </>
    );
  }
);

