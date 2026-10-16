import { definePage } from "@/lib/content/types";
import { Screenshot } from "@/components/ui/Screenshot";
import { H2, Lead } from "@/components/ui/Heading";
import { Admonition } from "@/components/ui/Admonition";
import { Table } from "@/components/ui/Table";

export default definePage(
  {
    title: "Browsing the library",
    description: "Grid and list views, filters, tags, sorting and thumbnails in the Stratum library.",
    slug: "guide/library",
    sectionId: "guide",
    toc: [
      { id: "views", label: "Grid & list views" },
      { id: "filters", label: "Filtering" },
      { id: "sort", label: "Sorting" },
      { id: "thumbs", label: "Thumbnails & previews" },
      { id: "selection", label: "Selecting & bulk actions" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>
          The library is the heart of Stratum — a fast, visual view of every asset in your space with
          the tools to narrow it down.
        </Lead>

        <Screenshot name="library" caption="The library grid, with filters and sort controls." />

        <H2 id="views">Grid &amp; list views</H2>
        <p>
          Toggle between a <strong>grid</strong> (large thumbnails, good for art) and a{" "}
          <strong>list</strong> (compact rows with name, kind, size and date) using the view switch
          in the toolbar.
        </p>
        <Table
          head={["View", "Shows", "Best for"]}
          rows={[
            ["Grid", "Thumbnails + name, adjustable density", "Browsing images and models"],
            ["List", "Name, kind, size, modified, tags", "Finding a specific file or auditing"],
          ]}
        />

        <H2 id="filters">Filtering</H2>
        <p>Filters stack, so you can combine them to zero in on exactly what you want:</p>
        <ul>
          <li>
            <strong>Kind</strong> — Image, Vector, Source, 3D, Audio, Other.
          </li>
          <li>
            <strong>Tags</strong> — one or more tags; matches assets carrying all selected tags.
          </li>
          <li>
            <strong>Modified</strong> — Today, Last 7 days, Last 30 days, or a custom range.
          </li>
        </ul>
        <Admonition type="tip">
          Active filters appear as removable chips above the grid. The count updates live so you can
          see how much each filter is narrowing.
        </Admonition>

        <H2 id="sort">Sorting</H2>
        <Table
          head={["Sort", "Direction"]}
          rows={[
            ["Name", "A→Z / Z→A"],
            ["Modified", "Newest / Oldest"],
            ["Size", "Largest / Smallest"],
            ["Kind", "Grouped by type"],
          ]}
        />

        <H2 id="thumbs">Thumbnails &amp; previews</H2>
        <p>
          Stratum caches thumbnails for images and vectors, and shows representative icons for
          models, source files and audio. Thumbnails load instantly because they are stored outside
          the space in your app-data folder, not regenerated each time.
        </p>
        <Admonition type="note">
          If a thumbnail looks stale after an edit, opening the asset regenerates it. A full rebuild
          is available from Settings if needed.
        </Admonition>

        <H2 id="selection">Selecting &amp; bulk actions</H2>
        <p>
          Click to select, <kbd>Ctrl</kbd>/<kbd>Cmd</kbd>-click to add to the selection, and{" "}
          <kbd>Shift</kbd>-click to select a range. With a selection active you can add tags, reveal
          in the file manager, or open assets in your default application.
        </p>
      </>
    );
  }
);
