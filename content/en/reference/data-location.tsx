import { definePage } from "@/lib/content/types";
import { H2, Lead } from "@/components/ui/Heading";
import { Admonition } from "@/components/ui/Admonition";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Table } from "@/components/ui/Table";

export default definePage(
  {
    title: "Data & index location",
    description: "Where Stratum keeps the index, thumbnails, tags and settings on each platform.",
    slug: "reference/data-location",
    sectionId: "reference",
    toc: [
      { id: "split", label: "What lives where" },
      { id: "index", label: "Index & thumbnails" },
      { id: "space", label: "Inside the space" },
      { id: "settings", label: "Settings" },
      { id: "safe", label: "Safe to delete?" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>
          Stratum deliberately splits your data in two: your space (portable, versioned) and its
          local index (disposable, per-machine). Knowing which is which makes backups simple.
        </Lead>

        <H2 id="split">What lives where</H2>
        <Table
          head={["Data", "Location", "Portable?"]}
          rows={[
            ["Your assets", "Inside the space folder", "Yes"],
            ["Tags", "Space root (.stratum-tags.json)", "Yes"],
            ["Version history", "Space/.git", "Yes"],
            ["Index database", "OS app-data folder", "No — rebuilt"],
            ["Thumbnails", "OS app-data folder", "No — rebuilt"],
            ["App settings", "OS app-data folder", "No"],
          ]}
        />

        <H2 id="index">Index &amp; thumbnails</H2>
        <p>
          The SQLite index and thumbnail cache live in your operating system's app-data directory,
          keyed per space. Typical locations:
        </p>
        <Table
          head={["Platform", "Folder"]}
          rows={[
            ["Windows", "%APPDATA%\\com.arkynox.stratum"],
            ["macOS", "~/Library/Application Support/com.arkynox.stratum"],
            ["Linux", "~/.local/share/com.arkynox.stratum"],
          ]}
        />
        <CodeBlock
          filename="typical index layout"
          code={`com.arkynox.stratum/
├─ index.db            # SQLite: assets, versions, embeddings
└─ thumbs/             # cached thumbnails, keyed by asset hash`}
        />
        <Admonition type="note">
          Keeping the index outside the space is deliberate: databases on network shares are
          unreliable, and this keeps the space itself clean and portable.
        </Admonition>

        <H2 id="space">Inside the space</H2>
        <CodeBlock
          filename="a Stratum space"
          code={`MySpace/
├─ Imported/              # assets added through Stratum
├─ (your own folders)
├─ .stratum-tags.json     # all tags for the space (versioned)
└─ .git/                  # version history (hidden)`}
        />
        <p>
          That's it. There is no hidden proprietary database in the space — only your files, the tags
          file, and a standard Git repository.
        </p>

        <H2 id="settings">Settings</H2>
        <p>
          App settings (display name, language, theme, sync interval) are stored alongside the index
          in the app-data folder. Space-specific settings that must travel, like the remote URL, are
          stored in the space's Git config so they sync with it.
        </p>

        <H2 id="safe">Safe to delete?</H2>
        <Table
          head={["Item", "Deleting it…"]}
          rows={[
            ["index.db", "Safe. Stratum rebuilds it on next launch."],
            ["thumbs/", "Safe. Regenerated as you browse."],
            [".stratum-tags.json", "You lose tags (but not files or versions)."],
            [".git/", "You lose version history. Do not delete unless sure."],
            ["The whole app-data folder", "Safe. Resets settings, index and thumbnails."],
          ]}
        />
        <Admonition type="warning">
          Deleting <code>.git</code> destroys your version history. Deleting the app-data folder only
          costs you a re-index and a quick settings reset.
        </Admonition>
      </>
    );
  }
);
