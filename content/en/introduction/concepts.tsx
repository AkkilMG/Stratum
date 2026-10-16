import { definePage } from "@/lib/content/types";
import { H2, H3, Lead } from "@/components/ui/Heading";
import { Admonition } from "@/components/ui/Admonition";
import { Table } from "@/components/ui/Table";

export default definePage(
  {
    title: "Core concepts",
    description: "Spaces, assets, versions, tags, the index, sync and local AI.",
    slug: "introduction/concepts",
    sectionId: "introduction",
    toc: [
      { id: "space", label: "Space" },
      { id: "asset", label: "Asset" },
      { id: "version", label: "Version" },
      { id: "tag", label: "Tag" },
      { id: "index", label: "Index & thumbnails" },
      { id: "sync", label: "Sync & studio hub" },
      { id: "ai", label: "Local AI" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>
          A handful of ideas explain everything in Stratum. Once these click, the rest of the app
          is obvious.
        </Lead>

        <H2 id="space">Space</H2>
        <p>
          A <strong>space</strong> is a folder on your disk that Stratum manages. Everything else —
          assets, versions, tags — lives inside a space. Stratum adds a hidden <code>.git</code>{" "}
          folder to the space so it can version files, but the folder stays a normal folder.
        </p>
        <p>
          A space can be <strong>local only</strong>, or paired with a shared remote (a
          <strong> studio hub</strong>) on a NAS or Git server so a team can sync it.
        </p>

        <H2 id="asset">Asset</H2>
        <p>
          An <strong>asset</strong> is one file inside a space. Stratum classifies every asset into
          a <em>kind</em> so the library can filter and preview it:
        </p>
        <Table
          head={["Kind", "Examples", "Preview"]}
          rows={[
            ["Image", "png, jpg, tif, exr, psd", "Thumbnail"],
            ["Vector", "svg", "Rendered thumbnail"],
            ["Source file", "psd, ai, blend, ma, mb, c4d", "Extracted preview where possible"],
            ["3D model", "fbx, obj, glb, gltf, usd", "Icon + metadata"],
            ["Audio", "wav, mp3, ogg, flac", "Waveform icon"],
            ["Other", "anything else", "Generic icon"],
          ]}
        />

        <H2 id="version">Version</H2>
        <p>
          Every time an asset changes, Stratum records a new <strong>version</strong> — backed by a
          Git commit. Versions are never overwritten. You can open any asset, compare the current
          file against an older version side by side, and restore an older version.
        </p>
        <Admonition type="tip">
          Restoring never deletes history. It creates a <em>new</em> version whose contents match
          the one you restored, so you can always change your mind again.
        </Admonition>

        <H2 id="tag">Tag</H2>
        <p>
          A <strong>tag</strong> is a label you attach to an asset to make it easier to find —{" "}
          <code>character</code>, <code>armor</code>, <code>level-03</code>. Tags can be added by
          hand or suggested by local AI. Tags are stored in a single{" "}
          <code>.stratum-tags.json</code> file at the root of the space, so they travel with the
          space and reach teammates when it syncs.
        </p>

        <H2 id="index">Index &amp; thumbnails</H2>
        <p>
          To make the library fast, Stratum keeps a private index and thumbnail cache <strong>outside</strong>{" "}
          your space, in your operating system's app-data folder. The index is a small SQLite
          database; thumbnails are cached image files. They are disposable — Stratum rebuilds them
          from your assets if they are ever missing.
        </p>
        <Admonition type="note">
          Keeping the index out of the space avoids the classic "database on a network share"
          problem and keeps the space clean and portable.
        </Admonition>

        <H2 id="sync">Sync &amp; studio hub</H2>
        <p>
          A <strong>studio hub</strong> is a bare Git repository on a NAS or Git server that several
          spaces point at. When connected, Stratum syncs in the background: it pulls teammates'
          changes and pushes yours. If two people changed the same file, Stratum keeps{" "}
          <em>both</em> — your version stays and the teammate's is saved next to it — so nothing is
          ever lost to a merge.
        </p>

        <H2 id="ai">Local AI</H2>
        <p>
          If <a href="https://ollama.com" target="_blank" rel="noopener noreferrer">Ollama</a> is
          installed, Stratum can use two models entirely on your machine:
        </p>
        <Table
          head={["Model", "Purpose"]}
          rows={[
            ["llava:7b", "Looks at image assets and suggests descriptive tags"],
            ["nomic-embed-text", "Turns assets into embeddings so search can work by meaning"],
          ]}
        />
        <p>
          The AI is <strong>optional and offline</strong>. Without it, Stratum still versions,
          browses and searches (by file name and tags).
        </p>
      </>
    );
  }
);
