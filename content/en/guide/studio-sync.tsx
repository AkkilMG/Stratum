import { definePage } from "@/lib/content/types";
import { Screenshot } from "@/components/ui/Screenshot";
import { H2, Lead } from "@/components/ui/Heading";
import { Admonition } from "@/components/ui/Admonition";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Table } from "@/components/ui/Table";

export default definePage(
  {
    title: "Studio / NAS hub",
    description: "Share a space across a team using a bare Git repo on a NAS or Git server.",
    slug: "guide/studio-sync",
    sectionId: "guide",
    toc: [
      { id: "what", label: "What a studio hub is" },
      { id: "create", label: "Create a hub" },
      { id: "join", label: "Join a hub" },
      { id: "nas", label: "NAS specifics" },
      { id: "lfs", label: "Large files & LFS" },
      { id: "team", label: "Team workflow" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>
          A studio hub lets several people share one space through a bare Git repository — on your
          NAS, a local server, or any Git host. Stratum handles the plumbing so the team doesn't have
          to.
        </Lead>

        <Screenshot name="hub" caption="Publishing a space to a shared location." />

        <H2 id="what">What a studio hub is</H2>
        <p>
          A hub is just a <strong>bare Git repository</strong> — no working copy, only history. Each
          person keeps their own local space and points it at the hub. Stratum pulls other people's
          versions and pushes yours automatically.
        </p>
        <CodeBlock
          lang="shell"
          code={`# A hub is created like any bare repo:
git init --bare //NAS/studio/stratum/art.git`}
        />

        <H2 id="create">Create a hub</H2>
        <ol>
          <li>Open the space you want to share.</li>
          <li>Choose <strong>Share this space</strong> (or Settings → This space → Change remote).</li>
          <li>Select <strong>Create shared space</strong> and enter the remote location.</li>
          <li>Optionally enable Git LFS for large files, then confirm.</li>
        </ol>

        <H2 id="join">Join a hub</H2>
        <ol>
          <li>From the home screen choose <strong>Join a studio space</strong>.</li>
          <li>Enter the same remote location a teammate used.</li>
          <li>Pick a local folder and let Stratum clone it.</li>
        </ol>
        <Admonition type="tip">
          Everyone should point at the <em>same</em> bare repo URL. Pasting the exact path your
          teammate used is the surest way to avoid a mismatch.
        </Admonition>

        <H2 id="nas">NAS specifics</H2>
        <p>
          Network shares can be slow or briefly unmapped. Stratum accounts for this:
        </p>
        <Table
          head={["Concern", "How Stratum handles it"]}
          rows={[
            ["Unreachable shares", "Sync reports Waiting and retries; local work continues."],
            ["Slow metadata access", "Uses polling-friendly strategies instead of relying on native file events."],
            ["Index location", "The SQLite index and thumbnails live locally, never on the share."],
            ["Paths", "Works with both mapped drives and UNC paths."],
          ]}
        />

        <H2 id="lfs">Large files &amp; LFS</H2>
        <p>
          Textures, PSDs and videos can be large. Enable <strong>Git LFS</strong> when creating the
          hub so big binaries are stored efficiently and clones stay fast. If LFS isn't available,
          Stratum still versions the files normally — commits are simply heavier.
        </p>
        <Admonition type="note">
          LFS needs to be enabled in the client where the hub was created. Joiners inherit the
          setting through the repository's <code>.gitattributes</code>.
        </Admonition>

        <H2 id="team">Team workflow</H2>
        <ul>
          <li>Sync happens automatically every couple of minutes — no manual ritual required.</li>
          <li>Use <strong>Sync now</strong> before closing for the day to be sure everything is pushed.</li>
          <li>Tags and version history are shared, so everyone sees the same labels and timeline.</li>
          <li>Conflicts are preserved side-by-side rather than dropped.</li>
        </ul>
      </>
    );
  }
);
