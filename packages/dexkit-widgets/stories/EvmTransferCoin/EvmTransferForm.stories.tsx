import { Box, Card, Grid } from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { WidgetContext } from "../../src/components/WidgetContext";
import {
  EvmSendForm,
  EvmSendFormProps,
} from "../../src/widgets/evm-transfer-coin/components/forms/EvmSendForm";
import { Account, ENSAccount, POLYGON_USDT_TOKEN } from "../Mocks/constants";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/EvmSendForm",
  component: EvmSendForm,
} as ComponentMeta<typeof EvmSendForm>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof EvmSendForm> = (
  args: EvmSendFormProps
) => {
  return (
    <WidgetContext>
      <Grid container spacing={2} justifyContent="center">
        <Grid size={{ xs: 12, sm: 3 }}>
          <Card>
            <Box pt={2}>
              <EvmSendForm {...args} />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </WidgetContext>
  );
};

// More on args: https://storybook.js.org/docs/react/writing-stories/args

export const Default = Template.bind({});

Default.args = {
  accounts: [Account],
  coins: [POLYGON_USDT_TOKEN],
  onChange: ({ coin: POLYGON_USDT_TOKEN }) => { },
  values: { address: Account.address, amount: 5, coin: POLYGON_USDT_TOKEN },
  onSubmit: () => { },
  balance: "6",
} as EvmSendFormProps;

export const NotEnoughBalance = Template.bind({});

NotEnoughBalance.args = {
  accounts: [Account],
  coins: [POLYGON_USDT_TOKEN],
  onChange: ({ coin: POLYGON_USDT_TOKEN }) => { },
  values: { address: Account.address, amount: 5, coin: POLYGON_USDT_TOKEN },
  onSubmit: () => { },
  balance: "4",
} as EvmSendFormProps;

export const Empty = Template.bind({});

Empty.args = {
  accounts: [],
  coins: [],
  onChange: ({ }) => { },
  values: {},
  onSubmit: () => { },
  balance: "4",
} as EvmSendFormProps;

export const DefaultWithENS = Template.bind({});

DefaultWithENS.args = {
  accounts: [Account],
  coins: [POLYGON_USDT_TOKEN],
  onChange: ({ coin: POLYGON_USDT_TOKEN }) => { },
  values: { address: ENSAccount.address, amount: 5, coin: POLYGON_USDT_TOKEN },
  onSubmit: () => { },
  balance: "6",
} as EvmSendFormProps;
