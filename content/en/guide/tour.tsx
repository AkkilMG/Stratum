import { definePage } from "@/lib/content/types";
import { Screenshot } from "@/components/ui/Screenshot";
import { H2, Lead } from "@/components/ui/Heading";
import { Admonition } from "@/components/ui/Admonition";
import { Table } from "@/components/ui/Table";
import { DocLink } from "@/components/ui/DocLink";

export default definePage(
  {
    title: "Guided tour",
    description: "The built-in 60-second interactive tour: what it covers and how to replay it.",
    slug: "guide/tour",
    sectionId: "guide",
    toc: [
      { id: "what", label: "What the tour is" },
      { id: "demo", label: "The demo space" },
      { id: "steps", label: "What it covers" },
      { id: "replay", label: "Replaying it" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>
          Stratum ships with a short interactive tour that teaches the basics by having you actually
          do them — safely.
        </Lead>

        <Screenshot name="tour" caption="The tour highlights exactly what to try next." />

        <H2 id="what">What the tour is</H2>
        <p>
          The tour is 13 steps and takes about a minute. Instead of just pointing at things, it asks
          you to perform simple actions — open the library, run a search, open an asset, look at a
          version. Each step highlights the relevant part of the interface and explains why it
          matters.
        </p>
        <Admonition type="tip">
          You can skip at any time with <strong>Skip tour</strong>. Skipping is free — you can restart
          it whenever you like.
        </Admonition>

        <H2 id="demo">The demo space</H2>
        <p>
          The tour runs inside a <strong>read-only demo space</strong> that ships with the app. You
          can click, search and explore without risk: nothing you do in the demo touches real files
          or your own spaces.
        </p>

        <H2 id="steps">What it covers</H2>
        <Table
          head={["Area", "You'll learn"]}
          rows={[
            ["Home", "Where spaces live and how to open one."],
            ["Library", "Grid vs. list, filters and thumbnails."],
            ["Search", "Finding assets by meaning."],
            ["Asset details", "Preview, tags and version history."],
            ["Version history", "How past versions are kept and restored."],
            ["Activity & sync", "How team sync keeps everyone in step."],
            ["Settings", "Where to configure everything."],
          ]}
        />

        <H2 id="replay">Replaying it</H2>
        <p>
          Replay the tour any time from{" "}
          <DocLink href="/guide/settings">Settings → Help &amp; about → Replay the tour</DocLink>, or from the
          command palette (<kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>K</kbd> → <em>Replay the tour</em>).
        </p>
      </>
    );
  }
);
