import ContractFormView from "../components/ContractFormView";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ChainId } from "@dexkit/core/constants";
import { TokenWhitelabelApp } from "@dexkit/core/types";
import { DexkitProvider } from "@dexkit/ui/components";
import { AppNotification } from "@dexkit/ui/types";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { atom } from "jotai";
import { useEffect } from "react";
import theme from "../theme";
import { AbiFragment } from "../types";

const ABI: AbiFragment[] = [
  {
    inputs: [
      {
        name: "visible",
        type: "bool",
      },
    ],
    name: "retrieve",
    outputs: [
      {
        name: "visible",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/ContractFormInputTypes",
  component: ContractFormView,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof ContractFormView>;

const InitConnector = () => {
  const { connector } = useWeb3React();

  useEffect(() => {
    if (connector && (connector as any).connectEagerly) {
      (connector as any).connectEagerly();
    }
  }, [connector]);

  return null;
};

const queryClient = new QueryClient();

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ContractFormView> = (args) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <DexkitProvider
          theme={theme}
          locale="en-US"
          notificationTypes={{}}
          assetsAtom={atom({})}
          hiddenAssetsAtom={atom<{ [key: string]: boolean }>({})}
          currencyUserAtom={atom("")}
          tokensAtom={atom<TokenWhitelabelApp[]>([])}
          notificationsAtom={atom<AppNotification[]>([])}
          onChangeLocale={() => { }}
          transactionsAtom={atom<{}>({})}
          selectedWalletAtom={atom<string>("")}
        >
          <InitConnector />
          <ContractFormView
            params={{
              abi: ABI,
              contractAddress: "0xf68018ce37827a097df2d8ce8e20faf6ccf7dfae",
              chainId: ChainId.Ethereum,
              fields: {
                retrieve: {
                  name: "retrieve",
                  visible: true,
                  lockInputs: false,
                  hideInputs: false,
                  callOnMount: false,
                  collapse: false,
                  hideLabel: false,
                  callToAction: "",
                  input: {},
                },
              },
            }}
          />
        </DexkitProvider>
      </QueryClientProvider>
    </>
  );
};

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {};
