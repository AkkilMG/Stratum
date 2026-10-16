import { definePage } from "@/lib/content/types";
import { H2, H3, Lead } from "@/components/ui/Heading";
import { Admonition } from "@/components/ui/Admonition";
import { Table } from "@/components/ui/Table";

export default definePage(
  {
    title: "Changelog",
    description: "Release notes for Stratum, starting with the first public release.",
    slug: "changelog/overview",
    sectionId: "changelog",
    toc: [
      { id: "v010", label: "0.1.0" },
      { id: "roadmap", label: "Roadmap" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>
          Stratum follows semantic versioning. This page records what changed in each release, newest
          first.
        </Lead>

        <H2 id="v010">0.1.0 — first public release</H2>
        <p>
          The initial release introduces the local-first asset vault with automatic versioning,
          searchable libraries and optional local AI.
        </p>
        <H3 id="highlights">Highlights</H3>
        <ul>
          <li>
            <strong>Spaces.</strong> Create, open and join folders as versioned Stratum spaces.
          </li>
          <li>
            <strong>Automatic versioning.</strong> A background watcher records a version on every
            change; preview and restore any past version.
          </li>
          <li>
            <strong>Library.</strong> Grid and list views with kind, tag and date filters plus
            sorting.
          </li>
          <li>
            <strong>Tags.</strong> Manual tags and AI-suggested tags, stored in a versioned{" "}
            <code>.stratum-tags.json</code>.
          </li>
          <li>
            <strong>Search.</strong> Semantic search via <code>nomic-embed-text</code> with a
            keyword fallback.
          </li>
          <li>
            <strong>Local AI tagging.</strong> Optional <code>llava:7b</code> vision tagging, fully
            offline.
          </li>
          <li>
            <strong>Studio hub.</strong> Share a space across a team over a NAS or Git server, with
            background sync and side-by-side conflict handling.
          </li>
          <li>
            <strong>Guided tour.</strong> A 13-step, 60-second interactive tour on a read-only demo
            space.
          </li>
          <li>
            <strong>Six languages.</strong> English, Español, Русский, हिन्दी, Français and Deutsch.
          </li>
        </ul>

        <Table
          head={["Item", "Value"]}
          rows={[
            ["Version", "0.1.0"],
            ["Platforms", "Windows, macOS, Linux"],
            ["Frontend", "Next.js / React"],
            ["Shell", "Tauri 2"],
            ["License", "See repository"],
          ]}
        />

        <H2 id="roadmap">Roadmap</H2>
        <p>Planned directions, subject to change:</p>
        <ul>
          <li>Richer previews for more source and model formats.</li>
          <li>Saved searches and smart collections.</li>
          <li>Deeper sync controls and conflict-resolution UI.</li>
          <li>More languages and translations.</li>
        </ul>
        <Admonition type="note">
          Have a request? Open an issue on the{" "}
          <a href="https://github.com/AkkilMG/Stratum" target="_blank" rel="noopener noreferrer">
            Stratum repository
          </a>
          .
        </Admonition>
      </>
    );
  }
);
