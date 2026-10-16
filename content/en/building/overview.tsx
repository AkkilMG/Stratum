import { definePage } from "@/lib/content/types";
import { H2, H3, Lead } from "@/components/ui/Heading";
import { Admonition } from "@/components/ui/Admonition";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Table } from "@/components/ui/Table";
import { DocLink } from "@/components/ui/DocLink";

export default definePage(
  {
    title: "Build & contribute",
    description: "Developer guide: prerequisites, local setup, project layout, builds, tests and contributing.",
    slug: "building/overview",
    sectionId: "building",
    toc: [
      { id: "prereqs", label: "Prerequisites" },
      { id: "clone", label: "Clone & install" },
      { id: "dev", label: "Development" },
      { id: "layout", label: "Project layout" },
      { id: "build", label: "Production build" },
      { id: "platforms", label: "Per-platform notes" },
      { id: "testing", label: "Testing & checks" },
      { id: "contributing", label: "Contributing" },
      { id: "releases", label: "Releases" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>
          Stratum is a Tauri 2 desktop app: a Rust backend with a web frontend. This guide covers
          everything you need to build, run, test and contribute to it from source.
        </Lead>

        <Admonition type="note">
          Just want to install and use the app? See <DocLink href="/getting-started/installation">Installation</DocLink>{" "}
          instead.
        </Admonition>

        <H2 id="prereqs">Prerequisites</H2>
        <Table
          head={["Tool", "Version", "Notes"]}
          rows={[
            ["Node.js", "20.19+", "Frontend build and dev server."],
            ["Rust", "stable", "Tauri backend; install via rustup."],
            ["Git", "recent", "Required for the build and at runtime."],
            ["Tauri prerequisites", "per OS", "System libraries (WebView, build tools)."],
          ]}
        />
        <p>
          Install the{" "}
          <a href="https://v2.tauri.app/start/prerequisites/" target="_blank" rel="noopener noreferrer">
            Tauri system prerequisites
          </a>{" "}
          for your platform before building. The per-platform section below lists the exact packages.
        </p>

        <H2 id="clone">Clone &amp; install</H2>
        <CodeBlock
          lang="shell"
          code={`git clone https://github.com/AkkilMG/Stratum.git
cd Stratum
npm install`}
        />
        <p>
          <code>npm install</code> installs the frontend dependencies. The first Rust build also
          compiles the Tauri backend, which takes a few minutes.
        </p>

        <H2 id="dev">Development</H2>
        <p>Run the app with hot reload for the frontend and the Rust backend:</p>
        <CodeBlock lang="shell" code={`npm run tauri dev`} />
        <Admonition type="tip">
          The web frontend can also run alone with <code>npm run dev</code> for UI work, but Tauri
          APIs (files, Git, Ollama) are only available in the desktop shell.
        </Admonition>

        <H2 id="layout">Project layout</H2>
        <Table
          head={["Path", "Contents"]}
          rows={[
            ["src/", "React/Next.js frontend: screens, components and state."],
            ["src-tauri/", "Rust backend: commands, Git, indexing, AI and sync."],
            ["src-tauri/src/commands", "Tauri command handlers exposed to the frontend."],
            ["public/", "Static assets and the demo space used by the guided tour."],
          ]}
        />
        <Admonition type="note">
          Frontend code calls the Rust side through Tauri commands. Keep the command surface typed
          and documented; the two halves are versioned together.
        </Admonition>

        <H2 id="build">Production build</H2>
        <CodeBlock lang="shell" code={`npm run tauri build`} />
        <p>
          Installers are written to <code>src-tauri/target/release/bundle/</code>. The exact formats
          depend on your platform (see below).
        </p>

        <H2 id="platforms">Per-platform notes</H2>
        <Table
          head={["Platform", "Needs", "Output"]}
          rows={[
            ["Windows", "WebView2 (bundled on modern Windows), NSIS/WiX", ".exe / .msi"],
            ["macOS", "Xcode command-line tools", ".dmg / .app"],
            ["Linux", "webkit2gtk, libssl, build-essential", ".AppImage / .deb / .rpm"],
          ]}
        />
        <H3 id="linux-deb">Linux (Debian / Ubuntu)</H3>
        <CodeBlock
          lang="shell"
          code={`sudo apt update
sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file \\
  libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev`}
        />

        <H2 id="testing">Testing &amp; checks</H2>
        <p>Run the same checks CI uses before opening a pull request:</p>
        <CodeBlock
          lang="shell"
          code={`npm run lint        # ESLint
cargo test          # Rust unit and integration tests (run in src-tauri)
cargo clippy        # Rust lints
cargo fmt --check   # Rust formatting`}
        />
        <Admonition type="tip">
          Add or update tests alongside your change. For UI work, describe the manual steps you used
          to verify behaviour in the pull request.
        </Admonition>

        <H2 id="contributing">Contributing</H2>
        <ul>
          <li>Fork the repository and create a topic branch.</li>
          <li>Match the existing code style; keep changes focused and reviewable.</li>
          <li>Run the lint, format and test checks above.</li>
          <li>Test on your platform and describe how you verified the change.</li>
          <li>Open a pull request against the main branch with a clear description.</li>
        </ul>
        <Admonition type="note">
          Bugs and feature ideas are welcome as GitHub issues. Include your OS and Stratum version
          so the report can be reproduced.
        </Admonition>

        <H2 id="releases">Releases</H2>
        <p>
          Releases are cut from the main branch and follow semantic versioning. Each release
          publishes signed installers for all three platforms along with checksums and a software
          bill of materials. See the <DocLink href="/changelog/overview">Changelog</DocLink> for what
          shipped in each version.
        </p>
      </>
    );
  }
);
