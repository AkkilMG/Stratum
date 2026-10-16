import { definePage } from "@/lib/content/types";
import { Screenshot } from "@/components/ui/Screenshot";
import { H2, Lead } from "@/components/ui/Heading";
import { Admonition } from "@/components/ui/Admonition";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default definePage(
  {
    title: "Tags",
    description: "Add manual tags, accept AI-suggested tags, and understand the shared tags file.",
    slug: "guide/tags",
    sectionId: "guide",
    toc: [
      { id: "manual", label: "Adding tags" },
      { id: "ai", label: "AI-suggested tags" },
      { id: "manage", label: "Managing tags" },
      { id: "file", label: "The tags file" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>
          Tags make assets findable. Add them yourself, accept suggestions from local AI, or both —
          and they travel with your space.
        </Lead>

        <Screenshot name="tags" caption="Editing tags on an asset in the detail drawer." />

        <H2 id="manual">Adding tags</H2>
        <p>
          Open an asset's detail drawer and type in the tag field. Press <kbd>Enter</kbd> to add the
          tag, or <kbd>Enter</kbd> on an existing tag to reuse it. Tags are normalised to lowercase
          and trimmed, so <code>Hero</code> and <code>hero</code> don't become two tags.
        </p>
        <p>
          You can also tag a whole selection at once from the library: select assets, then{" "}
          <strong>Add tags</strong>.
        </p>

        <H2 id="ai">AI-suggested tags</H2>
        <p>
          When local AI is enabled, Stratum asks the <code>llava:7b</code> model to look at image
          assets and propose descriptive tags. Suggestions appear in the drawer for you to accept or
          dismiss — Stratum never applies AI tags silently.
        </p>
        <Admonition type="note">
          AI tagging only runs on images. It is entirely local: the image is handed to your own
          Ollama instance and never uploaded.
        </Admonition>

        <H2 id="manage">Managing tags</H2>
        <ul>
          <li>Remove a tag by clicking the × on its chip.</li>
          <li>Rename a tag app-wide from the tag it produces in the library filter panel.</li>
          <li>Deleted tags are removed from every asset that carried them.</li>
        </ul>

        <H2 id="file">The tags file</H2>
        <p>
          All tags for a space live in one human-readable file at the space root:
          <code>.stratum-tags.json</code>. Because it's a normal file, tags are versioned by Git and
          sync to teammates automatically.
        </p>
        <CodeBlock
          filename=".stratum-tags.json"
          lang="json"
          code={`{
  "version": 1,
  "tags": {
    "Imported/2026-01-01/hero_armor.psd": ["character", "armor", "hero"],
    "Imported/2026-01-01/sector_map.png": ["level-03", "desert", "map"]
  }
}`}
        />
        <Admonition type="tip">
          You can edit this file with any text editor if you prefer. Stratum reloads it on change.
        </Admonition>
      </>
    );
  }
);
