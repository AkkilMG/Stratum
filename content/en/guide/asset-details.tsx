import { definePage } from "@/lib/content/types";
import { Screenshot } from "@/components/ui/Screenshot";
import { Admonition } from "@/components/ui/Admonition";
import { H2, H3, Lead } from "@/components/ui/Heading";

export default definePage(
  {
    title: "Asset details & versions",
    description: "Preview, compare versions, restore, and manage tags.",
    slug: "guide/asset-details",
    sectionId: "guide",
    toc: [
      { id: "drawer", label: "Detail drawer" },
      { id: "compare", label: "Compare versions" },
      { id: "restore", label: "Restore a version" },
      { id: "tags", label: "Edit tags" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>Inspect and manage a single asset.</Lead>
        <Screenshot name="detail" caption="Asset detail drawer" />
        <H2 id="drawer">Detail drawer</H2>
        <p>Open any asset to see preview, metadata, tags, and version history.</p>

        <H2 id="compare">Compare versions</H2>
        <p>Compare current vs. a selected older version side-by-side.</p>

        <H2 id="restore">Restore a version</H2>
        <p>Restoring creates a new version (it doesn&rsquo;t rewrite history).</p>
        <Admonition type="note">Restoring checks out the selected hash and commits as a new version.</Admonition>

        <H2 id="tags">Edit tags</H2>
        <p>Add/remove tags; shared tags can be exported via <code>.stratum-tags.json</code>.</p>
      </>
    );
  }
);

