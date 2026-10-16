import { definePage } from "@/lib/content/types";
import { Screenshot } from "@/components/ui/Screenshot";
import { H2, Lead } from "@/components/ui/Heading";
import { Admonition } from "@/components/ui/Admonition";
import { Table } from "@/components/ui/Table";
import { DocLink } from "@/components/ui/DocLink";

export default definePage(
  {
    title: "First launch",
    description: "The splash, language picker, legal gate, setup wizard, home screen and tour.",
    slug: "getting-started/first-launch",
    sectionId: "getting-started",
    toc: [
      { id: "splash", label: "Splash" },
      { id: "language", label: "Language" },
      { id: "legal", label: "License & privacy" },
      { id: "wizard", label: "Setup wizard" },
      { id: "home", label: "Home screen" },
      { id: "tour", label: "The guided tour" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>
          The first time you open Stratum you move through a short, friendly setup flow, ending on
          your home screen with an optional 60-second tour.
        </Lead>

        <Screenshot name="wizard" caption="The setup wizard asks only what it needs." />

        <H2 id="splash">1. Splash</H2>
        <p>
          A brief branded splash appears while the app starts. You can skip it by clicking anywhere
          or pressing <kbd>Enter</kbd>, <kbd>Space</kbd> or <kbd>Esc</kbd>. If your system is set to
          reduce motion, the animation is skipped automatically.
        </p>

        <H2 id="language">2. Language</H2>
        <p>
          Choose your interface language. Stratum ships with{" "}
          <strong>English, Español, Русский, हिन्दी, Français and Deutsch</strong>. You can change
          this later in Settings at any time.
        </p>

        <H2 id="legal">3. License &amp; privacy</H2>
        <p>
          Before anything else, Stratum asks you to read and accept the License Agreement and the
          Privacy Policy. The tabbed reader covers a plain-language summary, the EULA, the privacy
          policy, community guidelines and open-source licences.
        </p>
        <Admonition type="note">
          The short version: Stratum collects no telemetry and sends nothing to Arkynox. The privacy
          policy explains exactly what stays on your machine. You must scroll each document before
          you can accept it.
        </Admonition>

        <H2 id="wizard">4. Setup wizard</H2>
        <p>The wizard walks through six quick steps:</p>
        <Table
          head={["Step", "What it asks"]}
          rows={[
            ["Welcome", "A one-sentence hello and what to expect."],
            ["You", "Your display name, shown in version history."],
            ["Storage", "Where your assets should live — this PC, this PC + NAS, or join a studio space."],
            ["Folders", "Pick the folder (and optional shared location) Stratum should manage."],
            ["Check", "A system check for Git (required) and Ollama / models / Git LFS (optional)."],
            ["Create", "A progress log while your space is created and indexed."],
          ]}
        />

        <h3 className="mt-8 mb-3 text-[1.15rem] font-semibold tracking-tight">Choosing a storage mode</h3>
        <Table
          head={["Mode", "Best for", "Result"]}
          rows={[
            ["Just this PC", "Solo work", "A fully offline, local vault."],
            ["This PC + studio NAS", "Small teams", "A local vault paired with a shared hub."],
            ["Join studio space", "New team members", "Clones a space a teammate already shares."],
          ]}
        />
        <Admonition type="tip">
          Not sure? Pick <strong>Just this PC</strong>. You can connect a studio hub later from
          Settings without re-importing anything.
        </Admonition>

        <H2 id="home">5. Home screen</H2>
        <p>
          With setup done, Stratum opens on your home screen. From here you can create a new space,
          open an existing folder, join a studio space, or start the tour. Your recent spaces are
          listed so you can jump back in.
        </p>

        <H2 id="tour">6. The guided tour</H2>
        <p>
          Stratum offers a 13-step, 60-second interactive tour that runs on a safe, read-only{" "}
          <strong>demo space</strong> — nothing you do in it touches real files. The tour asks you to
          actually try things: open the library, run a search, open an asset and inspect a version.
        </p>
        <p>
          You can skip it, and replay it any time from{" "}
          <DocLink href="/guide/tour">Settings → Help &amp; about → Replay tour</DocLink>.
        </p>
      </>
    );
  }
);
