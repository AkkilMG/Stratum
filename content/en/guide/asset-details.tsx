import { definePage } from "@/lib/content/types";
import { Screenshot } from "@/components/ui/Screenshot";
import { H2, H3, Lead } from "@/components/ui/Heading";
import { Admonition } from "@/components/ui/Admonition";
import { Table } from "@/components/ui/Table";

export default definePage(
  {
    title: "Asset details & versions",
    description: "Open an asset, preview its current and past versions, read metadata, and restore.",
    slug: "guide/asset-details",
    sectionId: "guide",
    toc: [
      { id: "drawer", label: "The detail drawer" },
      { id: "compare", label: "Current vs. past" },
      { id: "metadata", label: "Metadata" },
      { id: "history", label: "Version history" },
      { id: "restore", label: "Restoring a version" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>
          Click any asset to open a detail drawer showing its preview, metadata, tags and full
          version history — with the ability to restore any past version.
        </Lead>

        <Screenshot name="detail" caption="The detail drawer with preview, tags and history." />

        <H2 id="drawer">The detail drawer</H2>
        <p>
          The drawer slides in from the right and keeps the library visible behind it, so you can
          move between assets without losing your place. It shows:
        </p>
        <ul>
          <li>A large preview (thumbnail or representative icon).</li>
          <li>The file name, kind, size and last modified time.</li>
          <li>Tags (editable in place).</li>
          <li>The version list, newest first.</li>
        </ul>

        <H2 id="compare">Current vs. past</H2>
        <p>
          For assets with more than one version, Stratum shows <strong>Current</strong> alongside the
          version you select. This side-by-side view makes it easy to see what changed before you
          decide to restore.
        </p>
        <Admonition type="tip">
          Select a version on the left of the history rail and the preview switches to it
          immediately — no extra clicks.
        </Admonition>

        <H2 id="metadata">Metadata</H2>
        <Table
          head={["Field", "Meaning"]}
          rows={[
            ["Name", "File name inside the space."],
            ["Kind", "Classified asset type (image, model, audio…)."],
            ["Size", "Size of the current version on disk."],
            ["Modified", "When the latest version was recorded."],
            ["Path", "Location relative to the space root."],
            ["Hash", "Content hash used to detect changes."],
          ]}
        />

        <H2 id="history">Version history</H2>
        <p>
          Every version is a point in time, with a timestamp and the author (your display name, or a
          teammate's after sync). Stratum never deletes versions when you edit a file; it adds a new
          one.
        </p>

        <H2 id="restore">Restoring a version</H2>
        <ol>
          <li>Open the asset and select the version you want in the history list.</li>
          <li>Choose <strong>Restore this version</strong>.</li>
          <li>
            Stratum writes the old contents back as a <em>new</em> version on top of history.
          </li>
        </ol>
        <Admonition type="warning">
          Restoring does not erase anything. The version you restored from — and everything after
          it — remains in the history, so a restore is always reversible.
        </Admonition>
      </>
    );
  }
);
