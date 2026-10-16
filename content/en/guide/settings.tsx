import { definePage } from "@/lib/content/types";
import { Screenshot } from "@/components/ui/Screenshot";
import { H2, Lead } from "@/components/ui/Heading";
import { Admonition } from "@/components/ui/Admonition";
import { Table } from "@/components/ui/Table";
import { DocLink } from "@/components/ui/DocLink";

export default definePage(
  {
    title: "Settings",
    description: "Every band in Settings: You, This space, Local AI, Help & about, Updates and Community.",
    slug: "guide/settings",
    sectionId: "guide",
    toc: [
      { id: "you", label: "You" },
      { id: "space", label: "This space" },
      { id: "ai", label: "Local AI" },
      { id: "help", label: "Help & about" },
      { id: "updates", label: "Updates" },
      { id: "community", label: "Community" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>
          Settings is organised into clear bands so everything has an obvious home. Open it from the
          sidebar.
        </Lead>

        <Screenshot name="settings" caption="Settings, grouped by what each option affects." />

        <H2 id="you">You</H2>
        <p>
          Personal, per-machine preferences. These don't affect teammates.
        </p>
        <Table
          head={["Option", "What it does"]}
          rows={[
            ["Display name", "Shown as the author on versions and in activity."],
            ["Language", "Interface language (6 available)."],
            ["Theme", "System, light or dark."],
            ["Reduce motion", "Disables non-essential animation."],
          ]}
        />

        <H2 id="space">This space</H2>
        <p>Options that apply to the currently open space:</p>
        <Table
          head={["Option", "What it does"]}
          rows={[
            ["Space name", "A friendly label for the folder."],
            ["Remote", "Connect, change or disconnect the studio hub."],
            ["Sync interval", "How often background sync runs (default 120s)."],
            ["Rebuild index", "Re-scan the folder and regenerate the index and thumbnails."],
          ]}
        />
        <Admonition type="warning">
          <strong>Rebuild index</strong> is safe — it only rebuilds disposable caches. It never
          touches your files or version history.
        </Admonition>

        <H2 id="ai">Local AI</H2>
        <p>
          Install and manage the optional Ollama models, and run the system check. See{" "}
          <DocLink href="/guide/local-ai">Local AI</DocLink> for the full walkthrough.
        </p>

        <H2 id="help">Help &amp; about</H2>
        <Table
          head={["Item", "What it does"]}
          rows={[
            ["Replay the tour", "Runs the 60-second guided tour again."],
            ["Keyboard shortcuts", "Opens the shortcut reference."],
            ["Version", "Shows the current app version."],
            ["Licences", "Open-source attributions."],
          ]}
        />

        <H2 id="updates">Updates</H2>
        <p>
          Stratum checks for new releases and lets you know when one is available. Updates are
          opt-in — nothing installs without your say-so. You'll also see release notes here.
        </p>

        <H2 id="community">Community</H2>
        <p>
          Links to the project on GitHub for issues, discussions and contributing. Reporting a bug
          here opens the right page with your version pre-filled.
        </p>
        <Admonition type="note">
          Settings are stored locally. Only the space-specific options that must travel (like the
          remote) affect teammates.
        </Admonition>
      </>
    );
  }
);
