import { definePage } from "@/lib/content/types";
import { Screenshot } from "@/components/ui/Screenshot";
import { H2, H3, Lead } from "@/components/ui/Heading";

export default definePage(
  {
    title: "Settings",
    description: "Profile, language, appearance, space, updates, and AI.",
    slug: "guide/settings",
    sectionId: "guide",
    toc: [
      { id: "profile", label: "Profile" },
      { id: "language", label: "Language" },
      { id: "appearance", label: "Appearance" },
      { id: "space", label: "Space info" },
      { id: "ai", label: "Local AI" },
      { id: "updates", label: "Updates" },
      { id: "support", label: "Support" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>Configure Stratum to fit your workflow.</Lead>
        <Screenshot name="settings" caption="Settings panel" />
        <H2 id="profile">Profile</H2>
        <p>Set your author name used in commit messages.</p>

        <H2 id="language">Language</H2>
        <p>Change UI language (this wiki mirrors the app&rsquo;s 6 languages).</p>

        <H2 id="appearance">Appearance</H2>
        <p>System, light, or dark themes.</p>

        <H2 id="space">Space info</H2>
        <p>Location, storage, NAS/network drive flags, counts.</p>

        <H2 id="ai">Local AI</H2>
        <p>Check Ollama status and download models.</p>

        <H2 id="updates">Updates</H2>
        <p>Check for and apply signed in-app updates.</p>

        <H2 id="support">Support</H2>
        <p>Feedback links and community resources.</p>
      </>
    );
  }
);

