import { definePage } from "@/lib/content/types";
import { Screenshot } from "@/components/ui/Screenshot";
import { H2, H3, Lead } from "@/components/ui/Heading";

export default definePage(
  {
    title: "Guided tour",
    description: "60-second interactive tour and replay.",
    slug: "guide/tour",
    sectionId: "guide",
    toc: [
      { id: "overview", label: "Overview" },
      { id: "replay", label: "Replay" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>The built-in tour walks you through key features safely in a demo space.</Lead>
        <Screenshot name="tour" caption="Guided tour" />
        <H2 id="overview">Overview</H2>
        <p>The tour runs against a safe demo space with 13 steps covering library, detail, search, activity, and more.</p>

        <H2 id="replay">Replay</H2>
        <p>Replay anytime from the command palette or help entry.</p>
      </>
    );
  }
);

