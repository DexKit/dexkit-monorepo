import { ComponentMeta, ComponentStory } from "@storybook/react";
import { WidgetContext } from "../../src/components/WidgetContext";

import { Token } from "@dexkit/core/types";
import SwapSelectCoinDialog, {
  SwapSelectCoinDialogProps,
} from "../../src/widgets/swap/SwapSelectCoinDialog";
import { TEST_TOKENS } from "../SelectCoinList/constants";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/SwapSelectCoinDialog",
  component: SwapSelectCoinDialog,
} as ComponentMeta<typeof SwapSelectCoinDialog>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SwapSelectCoinDialog> = (
  args: SwapSelectCoinDialogProps
) => {
  const handleChange = (value: string) => {};

  const handleSelect = (token: Token) => {};

  return (
    <WidgetContext>
      <SwapSelectCoinDialog
        {...args}
        onQueryChange={handleChange}
        onSelect={handleSelect}
      />
    </WidgetContext>
  );
};

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Default.args = {
  DialogProps: { open: true, maxWidth: "sm", fullWidth: true },
  tokens: TEST_TOKENS,
};

export const FeaturedTokens = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

FeaturedTokens.args = {
  DialogProps: { open: true, maxWidth: "sm", fullWidth: true },
  tokens: TEST_TOKENS,
  featuredTokens: TEST_TOKENS,
};

// export const Secondary = Template.bind({});
// Secondary.args = {
//   label: 'Button',
// };
