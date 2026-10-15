import { definePage } from "@/lib/content/types";
import { H2, H3, Lead } from "@/components/ui/Heading";

export default definePage(
  {
    title: "Importing assets",
    description: "Drag-and-drop or import files and folders.",
    slug: "guide/importing",
    sectionId: "guide",
    toc: [
      { id: "drop", label: "Drag & drop" },
      { id: "add", label: "Add files" },
      { id: "structure", label: "Where files go" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>Bring assets into your space quickly.</Lead>
        <H2 id="drop">Drag & drop</H2>
        <p>Drop files or folders anywhere in the app. Stratum copies them into the Imported/ folder with collision handling.</p>

        <H2 id="add">Add files</H2>
        <p>Use &ldquo;Add files&hellip;&rdquo; from the command palette or UI to select items.</p>

        <H2 id="structure">Where files go</H2>
        <p>Imported files are placed under <code>Imported/</code> and the watcher indexes them automatically.</p>
      </>
    );
  }
);

