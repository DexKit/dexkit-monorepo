/*import { ComponentStory } from "@storybook/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { TokenWhitelabelApp } from "@dexkit/core/types";
import { DexkitProvider } from "@dexkit/ui/components";
import { ThemeMode } from "@dexkit/ui/constants/enum";
import { AppNotification } from "@dexkit/ui/types";

import { AppConfig } from "@dexkit/ui/modules/wizard/types/config";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { atom } from "jotai";
import { useEffect } from "react";
import { renderDexAppBuilderFromConfig } from "..";
import config from "../config/app.json";
import theme from "../theme";

function AppBuilder() {
  return renderDexAppBuilderFromConfig({ config: config as AppConfig });
}

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Widget/RenderDexAppBuilderFromConfig",
  component: AppBuilder,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
};

const InitConnector = () => {
  const { connector } = useWeb3React();

  useEffect(() => {
    if (connector.connectEagerly) {
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
          themeMode={ThemeMode.light}
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
Default.args = {};
*/
