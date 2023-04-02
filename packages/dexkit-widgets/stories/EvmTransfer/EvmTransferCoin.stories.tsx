import { Box, Card, Grid } from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import DexkitContextProvider from "../../src/components/DexkitContextProvider";
import EvmTransferCoin, {
  EvmTransferCoinProps,
} from "../../src/widgets/evm-transfer/components/EvmTransferCoin";
import { Account, POLYGON_USDT_TOKEN } from "./constants";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/EvmTransferCoin",
  component: EvmTransferCoin,
} as ComponentMeta<typeof EvmTransferCoin>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof EvmTransferCoin> = (
  args: EvmTransferCoinProps
) => {
  return (
    <DexkitContextProvider>
      {({}) => (
        <Box pt={5}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={3}>
              <Card>
                <EvmTransferCoin {...args} />
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </DexkitContextProvider>
  );
};

// More on args: https://storybook.js.org/docs/react/writing-stories/args

export const Default = Template.bind({});

Default.args = {
  account: Account.address,
  evmAccounts: [Account],
  coins: [POLYGON_USDT_TOKEN],
  to: Account.address,
  amount: 1,
  defaultCoin: POLYGON_USDT_TOKEN,
  onSubmit: () => {},
} as EvmTransferCoinProps;

export const Empty = Template.bind({});

Empty.args = {
  evmAccounts: [],
  coins: [],
  onSubmit: () => {},
} as EvmTransferCoinProps;
