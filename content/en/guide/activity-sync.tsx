import { definePage } from "@/lib/content/types";
import { Screenshot } from "@/components/ui/Screenshot";
import { H2, Lead } from "@/components/ui/Heading";
import { Admonition } from "@/components/ui/Admonition";
import { Table } from "@/components/ui/Table";

export default definePage(
  {
    title: "Activity & sync",
    description: "The activity timeline, remote URL, manual sync, background sync and conflicts.",
    slug: "guide/activity-sync",
    sectionId: "guide",
    toc: [
      { id: "timeline", label: "Activity timeline" },
      { id: "remote", label: "Remote & status" },
      { id: "manual", label: "Syncing now" },
      { id: "background", label: "Background sync" },
      { id: "conflicts", label: "Conflicts" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>
          The Activity view is where you see what changed, who synced, and whether your space is
          currently connected to its remote.
        </Lead>

        <Screenshot name="activity" caption="The activity timeline with sync status." />

        <H2 id="timeline">Activity timeline</H2>
        <p>
          Newest events appear first: imports, edits, restores, tag changes and syncs. Each entry
          shows the asset affected, the author and the time. This is your answer to "what happened
          while I was away?".
        </p>

        <H2 id="remote">Remote &amp; status</H2>
        <p>
          If the space is connected to a studio hub, this view shows the remote URL and the current
          sync state:
        </p>
        <Table
          head={["Status", "Meaning"]}
          rows={[
            ["Local only", "No remote connected; everything stays on this machine."],
            ["Connected", "Remote reachable; changes will sync."],
            ["Syncing", "Push/pull in progress."],
            ["Waiting", "Remote unreachable right now (offline, drive unmapped). It will retry."],
            ["Up to date", "Local and remote match."],
          ]}
        />

        <H2 id="manual">Syncing now</H2>
        <p>
          Press <strong>Sync now</strong> (also in the command palette) to push your changes and pull
          teammates' immediately, instead of waiting for the next background cycle.
        </p>

        <H2 id="background">Background sync</H2>
        <p>
          When a remote is connected, Stratum syncs automatically on a timer. By default it checks
          every <strong>120&nbsp;seconds</strong>. Sync also runs after significant changes so fresh
          work gets pushed promptly. You can start, stop or re-time this from Settings.
        </p>
        <Admonition type="note">
          If the machine is offline, sync simply reschedules. Stratum never blocks on the network,
          and your local versions are always recorded regardless of connectivity.
        </Admonition>

        <H2 id="conflicts">Conflicts</H2>
        <p>
          If you and a teammate edit the same file before syncing, Stratum keeps both: your version
          stays in place and the incoming one is preserved alongside it, with a marker in the file
          name. Nothing is silently overwritten, and you can compare and keep whichever you want.
        </p>
        <Admonition type="tip">
          Conflicts are rare in practice — the more often you sync, the less likely two people are
          editing the same file at the same time.
        </Admonition>
      </>
    );
  }
);
