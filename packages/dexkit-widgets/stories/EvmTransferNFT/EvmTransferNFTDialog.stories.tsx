import { ChainId } from "@dexkit/core/constants";
import { NETWORK_PROVIDER } from "@dexkit/core/constants/networkProvider";
import { Box, Card, Grid } from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { WidgetContext } from "../../src/components/WidgetContext";

import EvmTransferNftDialog, {
  EvmTransferNftDialogProps,
} from "../../src/widgets/evm-transfer-nft/components/dialogs/EvmTransferNftDialog";
import { Account, NFT, NFTMetadata } from "../Mocks/constants";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/EvmTransferNftDialog",
  component: EvmTransferNftDialog,
} as ComponentMeta<typeof EvmTransferNftDialog>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof EvmTransferNftDialog> = (
  args: EvmTransferNftDialogProps
) => {
  return (
    <WidgetContext>
      <Box p={5}>
        <Grid container spacing={2} justifyContent="center">
          <Grid size={{ xs: 12, sm: 3 }}>
            <Card>
              <EvmTransferNftDialog {...args} />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </WidgetContext>
  );
};

// More on args: https://storybook.js.org/docs/react/writing-stories/args

export const Empty = Template.bind({});

Empty.args = {
  DialogProps: {
    open: true,
  },
} as EvmTransferNftDialogProps;

export const Default = Template.bind({});

Default.args = {
  DialogProps: {
    open: true,
  },
  params: {
    chainId: ChainId.Polygon,
    provider: NETWORK_PROVIDER(ChainId.Polygon),
    tokenId: "1",
    contractAddress: "0xEA88540adb1664999524d1a698cb84F6C922D2A1",
    account: Account.address,
    isLoadingNft: false,
    isLoadingNftMetadata: false,
    nft: NFT,
    nftMetadata: NFTMetadata,
  },
} as EvmTransferNftDialogProps;

export const Loading = Template.bind({});

Loading.args = {
  DialogProps: {
    open: true,
  },
  params: {
    chainId: ChainId.Polygon,
    provider: NETWORK_PROVIDER(ChainId.Polygon),
    tokenId: "1",
    contractAddress: "0xEA88540adb1664999524d1a698cb84F6C922D2A1",
    account: Account.address,
    isLoadingNft: true,
    isLoadingNftMetadata: true,
    nft: NFT,
    nftMetadata: NFTMetadata,
  },
} as EvmTransferNftDialogProps;
