import { ChainId } from "@dexkit/core/constants";
import { Grid } from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { WidgetContext } from "../../src/components/WidgetContext";
import { OPTIMISM_TOKEN } from "../../src/constants";
import { SwapWidget, SwapWidgetProps } from "../../src/widgets/swap";
import { TEST_TOKENS } from "../SelectCoinList/constants";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/Swap",
  component: SwapWidget,
} as ComponentMeta<typeof SwapWidget>;

const zeroExApiKey = process.env.ZRX_RFQ_API_KEY;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SwapWidget> = (args: SwapWidgetProps) => {
  return (
    <WidgetContext>
      <Grid container justifyContent="center" spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <SwapWidget
            {...args}
          /*  onNotification={handleNotification}
            onConnectWallet={handleConnectWallet}
            onShowTransactions={handleShowTransactions}
            isAutoSlippage={isAutoSlippage}
            maxSlippage={maxSlippage}
            onChangeSlippage={handleChangeSlippage}
            onAutoSlippage={handleAutoSlippage}*/
          />
        </Grid>
      </Grid>
    </WidgetContext>
  );
};

export const Default = Template.bind({});

Default.args = {
  renderOptions: {
    currency: "usd",
    configsByChain: {},
    zeroExApiKey,
    defaultChainId: 137,
  },
};

export const TokensSelected = Template.bind({});

TokensSelected.args = {
  renderOptions: {
    currency: "usd",
    configsByChain: {
      [ChainId.Optimism]: {
        slippage: 0,
        sellToken: OPTIMISM_TOKEN,
      },
    },
    defaultChainId: ChainId.Optimism,
  },
};

export const NoNotifications = Template.bind({});

NoNotifications.args = {
  renderOptions: {
    currency: "usd",
    configsByChain: {},
    disableNotificationsButton: true,
    zeroExApiKey,
  },
};

export const WithTransak = Template.bind({});

WithTransak.args = {
  renderOptions: {
    currency: "usd",
    configsByChain: {},
    transakApiKey: "4cf44cc4-69d7-4f4d-8237-05cc9076aa41",
    zeroExApiKey,
  },
};

export const WithTransakButton = Template.bind({});

WithTransakButton.args = {
  renderOptions: {
    currency: "usd",
    configsByChain: {},
    transakApiKey: "4cf44cc4-69d7-4f4d-8237-05cc9076aa41",
    enableBuyCryptoButton: true,
    zeroExApiKey,
  },
};

export const DisableFooter = Template.bind({});

DisableFooter.args = {
  renderOptions: {
    currency: "usd",
    configsByChain: {},
    disableFooter: true,
    zeroExApiKey,
  },
};

export const FeaturedTokens = Template.bind({});

FeaturedTokens.args = {
  renderOptions: {
    currency: "usd",
    configsByChain: {
      [ChainId.Polygon]: {
        slippage: 0,
      },
    },
    featuredTokens: TEST_TOKENS.filter((c) => c.chainId === ChainId.Polygon),
    defaultChainId: ChainId.Polygon,
    zeroExApiKey,
  },
};
