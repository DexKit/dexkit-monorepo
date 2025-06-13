/*import { ComponentMeta, ComponentStory } from "@storybook/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { TokenWhitelabelApp } from "@dexkit/core/types";
import { DexkitProvider } from "@dexkit/ui/components";
import { AppNotification } from "@dexkit/ui/types";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { atom } from "jotai";
import { useEffect } from "react";
import { RenderDexAppBuilder } from "..";
import theme from "../theme";

function AppBuilder() {
  return RenderDexAppBuilder({ slug: "home" });
}

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Widget/RenderDexAppBuilder",
  component: AppBuilder,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof AppBuilder>;

const InitConnector = () => {
  const { connector } = useWeb3React();

  useEffect(() => {
    if (connector?.connectEagerly) {
      connector.connectEagerly();
    }
  }, [connector]);

  return null;
};

const queryClient = new QueryClient();

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AppBuilder> = (args) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <DexkitProvider
          theme={theme}
          locale="en-US"
          assetsAtom={atom({})}
          currencyUserAtom={atom("")}
          tokensAtom={atom<TokenWhitelabelApp[]>([])}
          notificationTypes={{}}
          notificationsAtom={atom<AppNotification[]>([])}
          onChangeLocale={() => {}}
          transactionsAtom={atom<{}>({})}
          selectedWalletAtom={atom<string>("")}
        >
          <AppBuilder />
          <InitConnector />
        </DexkitProvider>
      </QueryClientProvider>
    </>
  );
};

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {};*/
