import { definePage } from "@/lib/content/types";
import { Screenshot } from "@/components/ui/Screenshot";
import { H2, H3, Lead } from "@/components/ui/Heading";

export default definePage(
  {
    title: "Activity & Sync",
    description: "History timeline, remote, and manual sync.",
    slug: "guide/activity-sync",
    sectionId: "guide",
    toc: [
      { id: "activity", label: "Activity view" },
      { id: "remote", label: "Remote" },
      { id: "sync", label: "Sync now" },
      { id: "conflicts", label: "Conflicts" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>Track changes and sync with teammates.</Lead>
        <Screenshot name="activity" caption="Activity & sync" />
        <H2 id="activity">Activity view</H2>
        <p>See last 60 commits across the vault in a timeline.</p>

        <H2 id="remote">Remote</H2>
        <p>View or set the <code>origin</code> remote URL for your space.</p>

        <H2 id="sync">Sync now</H2>
        <p>Fetch, merge, and push. Background sync runs every 120 seconds.</p>

        <H2 id="conflicts">Conflicts</H2>
        <p>On two-sided edits, Stratum saves a teammate copy (e.g. <code>&ldquo;Name (conflict from teammate).ext&rdquo;</code>) and merges with <code>-X ours</code> to keep safety.</p>
      </>
    );
  }
);

