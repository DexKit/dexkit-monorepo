import type { CellPlugin } from "@react-page/editor";

import { DexGeneratorPageSection } from "@dexkit/ui/modules/wizard/types/section";
import DexGeneratorSection from "../../sections/DexGeneratorSection";

// you can pass the shape of the data as the generic type argument
const DexGeneratorFormPlugin: CellPlugin<{
  section?: DexGeneratorPageSection;
}> = {
  Renderer: ({ data, isEditMode }) => {
    return data.section ? (
      <DexGeneratorSection section={data.section} hideGrid={true} />
    ) : null;
  },
  id: "dex-generator-section",
  title: "DexContracts",
  description: "DexContracts form",
  version: 1,
};

export default DexGeneratorFormPlugin;
