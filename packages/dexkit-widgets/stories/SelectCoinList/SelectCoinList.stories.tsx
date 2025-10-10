import { Card, Grid } from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useCallback } from "react";
import SelectCoinsList, {
  SelectCoinListProps,
} from "../../src/components/SelectCoinList";
import { WidgetContext } from "../../src/components/WidgetContext";
import { Token } from "../../src/types";
import { TEST_TOKENS } from "./constants";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/SelectCoinList",
  component: SelectCoinsList,
} as ComponentMeta<typeof SelectCoinsList>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SelectCoinsList> = (
  args: SelectCoinListProps
) => {
  const handleSelect = useCallback((token: Token) => { }, []);

  return (
    <WidgetContext>
      <Grid container spacing={2} justifyContent="center">
        <Grid size={{ xs: 12, sm: 3 }}>
          <Card>
            <SelectCoinsList {...args} onSelect={handleSelect} />
          </Card>
        </Grid>
      </Grid>
    </WidgetContext>
  );
};

// More on args: https://storybook.js.org/docs/react/writing-stories/args

export const Default = Template.bind({});

Default.args = { tokens: TEST_TOKENS };

export const EmptyList = Template.bind({});

EmptyList.args = {
  tokens: [],
};
