import { definePage } from "@/lib/content/types";
import { Screenshot } from "@/components/ui/Screenshot";
import { H2, H3, Lead } from "@/components/ui/Heading";

export default definePage(
  {
    title: "Browsing the library",
    description: "Grid/list, filters, sort, search, and thumbnails.",
    slug: "guide/library",
    sectionId: "guide",
    toc: [
      { id: "layout", label: "Layout" },
      { id: "filters", label: "Filters & tags" },
      { id: "sort", label: "Sort order" },
      { id: "results", label: "Search results" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>Find and browse assets in the Library view.</Lead>
        <Screenshot name="library" caption="Library grid view" />
        <H2 id="layout">Layout</H2>
        <p>Switch between grid and list layouts.</p>

        <H2 id="filters">Filters & tags</H2>
        <p>Filter by kind (image/vector/model/audio/etc) and by tag.</p>

        <H2 id="sort">Sort order</H2>
        <p>Sort by recent, name, or largest.</p>

        <H2 id="results">Search results</H2>
        <p>Search narrows the library; results respect active filters.</p>
      </>
    );
  }
);

