import { definePage } from "@/lib/content/types";
import { H2, H3, Lead } from "@/components/ui/Heading";

export default definePage(
  {
    title: "Studio / NAS hub",
    description: "Create a hub and join from another machine.",
    slug: "guide/studio-sync",
    sectionId: "guide",
    toc: [
      { id: "create", label: "Create hub" },
      { id: "join", label: "Join hub" },
      { id: "notes", label: "Network notes" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>Share a single source of truth over your LAN or NAS.</Lead>
        <H2 id="create">Create hub</H2>
        <p>Create a bare <code>stratum-vault.git</code> on your NAS/share to act as the hub.</p>

        <H2 id="join">Join hub</H2>
        <p>Clone that remote into an empty local folder on another machine and start working.</p>

        <H2 id="notes">Network notes</H2>
        <ul>
          <li>Index/thumbnails are stored in local app-data (never on the share) to avoid network I/O overhead and locking.</li>
          <li>Dead NAS handling is guarded (timeouts, SSH BatchMode) to prevent hanging.</li>
        </ul>
      </>
    );
  }
);

