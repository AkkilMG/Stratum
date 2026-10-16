import { definePage } from "@/lib/content/types";
import { Screenshot } from "@/components/ui/Screenshot";
import { H2, Lead } from "@/components/ui/Heading";
import { Admonition } from "@/components/ui/Admonition";
import { Card } from "@/components/ui/Card";

export default definePage(
  {
    title: "What is Stratum",
    description: "Stratum is a local-first, versioned, searchable asset vault for game studios.",
    slug: "introduction/what-is-stratum",
    sectionId: "introduction",
    toc: [
      { id: "why", label: "Why Stratum" },
      { id: "how", label: "How it works" },
      { id: "who", label: "Who it is for" },
      { id: "not", label: "What it is not" },
      { id: "next", label: "Next steps" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>
          Stratum is a desktop app that keeps every asset a game studio produces — textures,
          source files, maps, 3D models and audio — versioned, searchable and safe, even when
          fully offline. Your assets never leave your own machines.
        </Lead>

        <Screenshot name="home" caption="Stratum keeps your spaces front and centre." />

        <H2 id="why">Why Stratum</H2>
        <p>
          Game projects generate thousands of files. They get renamed, overwritten, duplicated
          across drives, and the one person who knew where the hero texture lived leaves the
          studio. Stratum gives a team one calm place to keep everything with a memory:
        </p>
        <ul>
          <li>
            <strong>Automatic versioning.</strong> Every save becomes a restorable version — no
            commits, branches or commands for the artist to learn.
          </li>
          <li>
            <strong>Search by meaning.</strong> Ask for <em>"red desert sector map"</em> and find
            it, even if nothing is named that way.
          </li>
          <li>
            <strong>Offline-first.</strong> It is just a folder on disk. No account, no upload, no
            telemetry, no lock-in.
          </li>
          <li>
            <strong>Built for teams.</strong> Share a space over your own LAN, NAS or any Git
            server. Conflicts are kept, never silently lost.
          </li>
        </ul>

        <H2 id="how">How it works</H2>
        <p>Stratum is deliberately boring under the hood, which is what makes it trustworthy:</p>
        <ul>
          <li>
            <strong>A space is a folder.</strong> Stratum adds a hidden Git repository to the
            folder you pick. The files themselves are ordinary files you can open in any tool.
          </li>
          <li>
            <strong>Versions are Git commits.</strong> A file watcher notices changes and records a
            version automatically. You can preview any past version and restore it.
          </li>
          <li>
            <strong>Search is local AI plus a keyword fallback.</strong> Optional Ollama models
            describe images and build embeddings; without them, keyword search still works.
          </li>
          <li>
            <strong>Team sync is a shared Git remote.</strong> Point two or more machines at the same
            bare repository on a NAS or Git server and they stay in step.
          </li>
        </ul>

        <Admonition type="note">
          Stratum shells out to the standard <code>git</code> command-line tool. You can always open
          the folder with your own Git tools, so there is no proprietary format to escape from.
        </Admonition>

        <H2 id="who">Who it is for</H2>
        <ul>
          <li>Solo developers who want version history without becoming Git experts.</li>
          <li>Small studios sharing a NAS who need everyone to see the same art.</li>
          <li>Technical artists and pipeline engineers who want a local, scriptable vault.</li>
        </ul>

        <H2 id="not">What it is not</H2>
        <ul>
          <li>It is not a cloud drive. There is no Stratum account or hosted service.</li>
          <li>It is not a DCC replacement — Stratum organises assets, it does not edit them.</li>
          <li>It is not a build pipeline or task tracker.</li>
        </ul>

        <H2 id="next">Next steps</H2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Card
            href="/getting-started/installation"
            title="Install Stratum"
            body="Get the app running on Windows, macOS or Linux in a few minutes."
          />
          <Card
            href="/introduction/concepts"
            title="Learn core concepts"
            body="Spaces, assets, versions, tags and how sync really works."
          />
        </div>
      </>
    );
  }
);
