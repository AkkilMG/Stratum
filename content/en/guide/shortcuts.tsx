import { definePage } from "@/lib/content/types";
import { Keys } from "@/components/ui/Keycap";
import { H2, Lead } from "@/components/ui/Heading";

export default definePage(
  {
    title: "Shortcuts & Command palette",
    description: "Keyboard shortcuts and Ctrl/Cmd+K palette.",
    slug: "guide/shortcuts",
    sectionId: "guide",
    toc: [
      { id: "palette", label: "Command palette" },
      { id: "shortcuts", label: "Global shortcuts" },
    ],
  },
  function Body() {
    return (
      <>
        <Lead>Move faster with the command palette and shortcuts.</Lead>
        <H2 id="palette">Command palette</H2>
        <p>Press <Keys keys={["Ctrl", "K"]} /> (Windows/Linux) or <Keys keys={["Cmd", "K"]} /> (macOS) to open commands.</p>

        <H2 id="shortcuts">Global shortcuts</H2>
        <ul>
          <li><Keys keys={["/"]} /> — focus search</li>
          <li><Keys keys={["?"]} /> — shortcuts modal</li>
          <li><Keys keys={["Esc"]} /> — close dialogs</li>
        </ul>
        <p>See the full <a href="../reference/shortcuts-table/">keyboard shortcuts table</a>.</p>
      </>
    );
  }
);

