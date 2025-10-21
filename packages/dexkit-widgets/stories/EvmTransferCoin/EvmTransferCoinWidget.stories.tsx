import { Box, Card, Grid } from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { WidgetContext } from "../../src/components/WidgetContext";
import EvmTransferCoinWidget from "../../src/widgets/evm-transfer-coin";
import { EvmTransferCoinProps } from "../../src/widgets/evm-transfer-coin/components/EvmTransferCoin";
import { Account, POLYGON_USDT_TOKEN } from "../Mocks/constants";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/EvmTransferCoinWidget",
  component: EvmTransferCoinWidget,
} as ComponentMeta<typeof EvmTransferCoinWidget>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof EvmTransferCoinWidget> = (
  args: EvmTransferCoinProps
) => {
  return (
    <WidgetContext>
      <Box pt={5}>
        <Grid container spacing={2} justifyContent="center">
          <Grid size={{ xs: 12, sm: 3 }}>
            <Card>
              <EvmTransferCoinWidget {...args} />
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
  evmAccounts: [Account],
  coins: [POLYGON_USDT_TOKEN],
  amount: 1,
  defaultCoin: POLYGON_USDT_TOKEN,
  onSubmit: () => { },
} as EvmTransferCoinProps;

export const Empty = Template.bind({});

Empty.args = {
  evmAccounts: [],
  coins: [],
  onSubmit: () => { },
} as EvmTransferCoinProps;
