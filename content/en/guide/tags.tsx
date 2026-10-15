import { definePage } from "@/lib/content/types";
import { Screenshot } from "@/components/ui/Screenshot";
import { H2, H3, Lead } from "@/components/ui/Heading";

export default definePage(
  {
    title: "Tags",
    description: "Manual and AI tagging, shared tags, and searchability.",
    slug: "guide/tags",
    sectionId: "guide",
    toc: [
      { id: "manual", label: "Manual tags" },
      { id: "ai", label: "AI tagging" },
      { id: "shared", label: "Shared tags file" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>Tags make assets discoverable.</Lead>
        <Screenshot name="tags" caption="Tag editor" />
        <H2 id="manual">Manual tags</H2>
        <p>Add or remove tags from the detail drawer.</p>

        <H2 id="ai">AI tagging</H2>
        <p>When Ollama is running with <code>llava:7b</code>, Stratum can generate descriptive tags for images.</p>

        <H2 id="shared">Shared tags file</H2>
        <p>Stratum writes <code>.stratum-tags.json</code> in the vault to share tag state with teammates.</p>
      </>
    );
  }
);

