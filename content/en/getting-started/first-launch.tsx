import { definePage } from "@/lib/content/types";
import { Screenshot } from "@/components/ui/Screenshot";
import { H2, H3, Lead } from "@/components/ui/Heading";

export default definePage(
  {
    title: "First launch",
    description: "Splash, language, legal gate, wizard, and reaching the home screen.",
    slug: "getting-started/first-launch",
    sectionId: "getting-started",
    toc: [
      { id: "flow", label: "Launch flow" },
      { id: "wizard", label: "Setup wizard" },
      { id: "tour", label: "Guided tour" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>On first launch, Stratum walks you through a short setup.</Lead>
        <H2 id="flow">Launch flow</H2>
        <ol>
          <li>Splash screen</li>
          <li>Language selection</li>
          <li>Legal gate (EULA/Privacy summary)</li>
          <li>Setup wizard</li>
          <li>Home screen</li>
        </ol>
        <Screenshot name="wizard" caption="First launch wizard" />

        <H2 id="wizard">Setup wizard</H2>
        <p>The wizard helps you create a new space, open an existing folder, or join a studio hub.</p>

        <H2 id="tour">Guided tour</H2>
        <p>After setup, you can take a 60-second tour or replay it later from the command palette/help.</p>
      </>
    );
  }
);

