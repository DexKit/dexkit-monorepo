import type { CellPlugin } from "@react-page/editor";

import { TokenTradePageSection } from "@dexkit/ui/modules/wizard/types/section";
import TokenTradeSection from "../../sections/TokenTradeSection";

// you can pass the shape of the data as the generic type argument
const TokenTradePlugin: CellPlugin<{
  section?: TokenTradePageSection;
}> = {
  Renderer: ({ data, isEditMode }) => {
    return data.section ? <TokenTradeSection section={data.section} /> : null;
  },
  id: "token-trade-section",
  title: "Token Trade",
  description: "DexContracts form",
  version: 1,
};

export default TokenTradePlugin;
