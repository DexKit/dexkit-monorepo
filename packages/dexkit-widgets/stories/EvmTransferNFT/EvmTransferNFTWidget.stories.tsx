import { ChainId } from "@dexkit/core/constants";
import { NETWORK_PROVIDER } from "@dexkit/core/constants/networkProvider";
import { Box, Card, Grid } from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { WidgetContext } from "../../src/components/WidgetContext";
import EvmTransferNftWidget, {
  EvmTransferNftWidgetProps,
} from "../../src/widgets/evm-transfer-nft";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/EvmTransferNftWidget",
  component: EvmTransferNftWidget,
} as ComponentMeta<typeof EvmTransferNftWidget>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof EvmTransferNftWidget> = (
  args: EvmTransferNftWidgetProps
) => {
  return (
    <WidgetContext>
      <Box p={5}>
        <Grid container spacing={2} justifyContent="center">
          <Grid size={{ xs: 12, sm: 3 }}>
            <Card>
              <EvmTransferNftWidget {...args} />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </WidgetContext>
  );
};

// More on args: https://storybook.js.org/docs/react/writing-stories/args

export const Default = Template.bind({});

Default.args = {
  chainId: ChainId.Polygon,
  provider: NETWORK_PROVIDER(ChainId.Polygon),
  tokenId: "50",
  contractAddress: "0xEA88540adb1664999524d1a698cb84F6C922D2A1",
} as EvmTransferNftWidgetProps;
