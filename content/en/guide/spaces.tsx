import { definePage } from "@/lib/content/types";
import { H2, H3, Lead } from "@/components/ui/Heading";

export default definePage(
  {
    title: "Spaces",
    description: "Create, open, join, and switch between spaces.",
    slug: "guide/spaces",
    sectionId: "guide",
    toc: [
      { id: "create", label: "Create new space" },
      { id: "open", label: "Open a folder" },
      { id: "join", label: "Join a studio space" },
      { id: "recent", label: "Recent spaces" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>Spaces are the folders you work in.</Lead>
        <H2 id="create">Create new space</H2>
        <p>Choose an empty folder to initialize a new vault.</p>

        <H2 id="open">Open a folder</H2>
        <p>Open any existing folder to start tracking it.</p>

        <H2 id="join">Join a studio space</H2>
        <p>Clone a shared hub repo into an empty local folder. The hub can live on a NAS.</p>

        <H2 id="recent">Recent spaces</H2>
        <p>Switch quickly from the home screen; spaces are remembered for convenience.</p>
      </>
    );
  }
);

