import { definePage } from "@/lib/content/types";
import { H2, H3, Lead } from "@/components/ui/Heading";

export default definePage(
  {
    title: "Error codes (E:...)",
    description: "Backend error codes and meanings.",
    slug: "reference/error-codes",
    sectionId: "reference",
    toc: [{ id: "codes", label: "Common codes" }],
  },
  function Body() {
    return (
      <>
        <Lead>Errors are sanitized to stable codes. See app translations for user-facing text.</Lead>
        <H2 id="codes">Common codes</H2>
        <p>Examples from the app include <code>E:git:notfound</code>, <code>E:io:write</code>, <code>E:net:timeout</code>, and <code>E:ollama:down</code>. Full set is translated under <code>e.*</code> in the app i18n.</p>
      </>
    );
  }
);

