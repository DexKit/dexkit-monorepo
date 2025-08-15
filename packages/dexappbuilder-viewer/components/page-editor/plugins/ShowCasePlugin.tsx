import { ShowCaseParams } from "@dexkit/ui/modules/wizard/types/section";
import type { CellPlugin } from "@react-page/editor";
import ShowCaseSection from "../../sections/ShowCaseSection";

const ShowCasePlugin: CellPlugin<ShowCaseParams> = {
  Renderer: ({ data, ...props }) => (
    <ShowCaseSection
      section={{
        type: "showcase",
        settings: data,
      }}
      {...props}
    />
  ),
  id: "showcase-plugin",
  title: "Showcase",
  description: "Enhanced showcase gallery with multiple layouts, hover effects, and responsive design",
  version: 2,
  isInlineable: false,
};

export default ShowCasePlugin;
