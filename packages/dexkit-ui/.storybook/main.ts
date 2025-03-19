import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";
const config: StorybookConfig = {
  async viteFinal(config, { configType }) {
    return mergeConfig(config, {
      define: { "process.env": {} },
    });
  },
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    // name: '@storybook/nextjs',
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
};
export default config;
