import { definePage } from "@/lib/content/types";
import { H2, Lead } from "@/components/ui/Heading";
import { Keys } from "@/components/ui/Keycap";

export default definePage(
  {
    title: "Keyboard shortcuts",
    description: "Full shortcut reference.",
    slug: "reference/shortcuts-table",
    sectionId: "reference",
    toc: [{ id: "table", label: "Table" }],
  },
  function Body() {
    return (
      <>
        <Lead>Common shortcuts in Stratum.</Lead>
        <H2 id="table">Shortcuts</H2>
        <div className="overflow-x-auto">
          <table className="min-w-[460px] w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 text-left font-medium">Action</th>
                <th className="py-2 text-left font-medium">Shortcut</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="py-2">Command palette</td>
                <td className="py-2"><Keys keys={["Ctrl", "K"]} /> / <Keys keys={["Cmd", "K"]} /></td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2">Focus search</td>
                <td className="py-2"><Keys keys={["/"]} /></td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2">Shortcuts modal</td>
                <td className="py-2"><Keys keys={["?"]} /></td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2">Close</td>
                <td className="py-2"><Keys keys={["Esc"]} /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    );
  }
);
