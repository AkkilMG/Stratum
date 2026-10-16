import { definePage } from "@/lib/content/types";
import { Screenshot } from "@/components/ui/Screenshot";
import { H2, Lead } from "@/components/ui/Heading";
import { Admonition } from "@/components/ui/Admonition";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Table } from "@/components/ui/Table";

export default definePage(
  {
    title: "Importing assets",
    description: "Drag and drop files, add files from the app, and understand where assets land.",
    slug: "guide/importing",
    sectionId: "guide",
    toc: [
      { id: "drag", label: "Drag & drop" },
      { id: "add", label: "Add files…" },
      { id: "where", label: "Where files go" },
      { id: "collisions", label: "Name collisions" },
      { id: "indexing", label: "Indexing & thumbnails" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>
          Getting assets into a space is deliberately friction-free: drop them on the window, or let
          Stratum watch the folder for you.
        </Lead>

        <Screenshot name="library" caption="Imported assets appear in the library immediately." />

        <H2 id="drag">Drag &amp; drop</H2>
        <p>
          Drag files or folders from Explorer, Finder or your file manager straight onto the Stratum
          window. A drop overlay confirms the destination, and the files are copied in and versioned
          automatically.
        </p>
        <Admonition type="tip">
          Because Stratum already watches the space folder, you can also just copy files into it with
          your own tools — Stratum notices and adds versions within seconds.
        </Admonition>

        <H2 id="add">Add files…</H2>
        <p>
          Prefer the menu? Use <strong>Add files…</strong> (sidebar or the command palette) to pick
          files with a system dialog. This is handy when you want to import from a location you can't
          easily drag from.
        </p>

        <H2 id="where">Where files go</H2>
        <p>
          When you add files intentionally (drag &amp; drop or <strong>Add files…</strong>), Stratum
          places them in an <code>Imported/</code> folder inside the space and records a version. If
          you drop a folder, its structure is preserved under <code>Imported/</code>.
        </p>
        <CodeBlock
          filename="space layout"
          code={`MySpace/
├─ Imported/
│  └─ 2026-01-01/            # grouped by import date
│     ├─ hero_armor.psd
│     └─ sector_map.png
├─ .stratum-tags.json        # tags for the whole space
└─ .git/                     # version history (hidden)`}
        />

        <H2 id="collisions">Name collisions</H2>
        <p>
          If a file with the same name already exists, Stratum never overwrites it. Instead it
          renames the incoming file with a numeric suffix, so both are kept:
        </p>
        <Table
          head={["Existing", "Incoming", "Result"]}
          rows={[
            ["logo.png", "logo.png", "logo.png + logo (1).png"],
            ["hero.psd", "hero.psd", "hero.psd + hero (1).psd"],
          ]}
        />

        <H2 id="indexing">Indexing &amp; thumbnails</H2>
        <p>
          After import, Stratum indexes each asset (size, type, hash) so search and version history
          work. It also generates thumbnails for images and vectors, and previews for some source
          files. Large imports show progress and finish in the background — you can keep working.
        </p>
        <Admonition type="note">
          If local AI is enabled, image assets are also described and embedded after indexing, which
          slightly extends the time before they appear in semantic search.
        </Admonition>
      </>
    );
  }
);
