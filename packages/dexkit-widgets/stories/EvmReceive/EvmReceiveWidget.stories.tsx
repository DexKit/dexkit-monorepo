import { Box, Card, Grid } from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { WidgetContext } from "../../src/components/WidgetContext";
import EvmReceiveWidget, {
  EvmReceiveWidgetProps,
} from "../../src/widgets/evm-receive-coin";
import { POLYGON_COIN, POLYGON_USDT_TOKEN } from "../Mocks/constants";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/EvmReceiveWidget",
  component: EvmReceiveWidget,
} as ComponentMeta<typeof EvmReceiveWidget>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof EvmReceiveWidget> = (
  args: EvmReceiveWidgetProps
) => {
  return (
    <WidgetContext>
      <Box pt={5}>
        <Grid container spacing={2} justifyContent="center">
          <Grid size={{ xs: 12, sm: 3 }}>
            <Card>
              <EvmReceiveWidget {...args} />
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
  coins: [POLYGON_USDT_TOKEN, POLYGON_COIN],
  amount: 1,
  defaultCoin: POLYGON_USDT_TOKEN,
  onSubmit: () => { },
} as EvmReceiveWidgetProps;

export const Empty = Template.bind({});

Empty.args = {
  coins: [],
} as EvmReceiveWidgetProps;
