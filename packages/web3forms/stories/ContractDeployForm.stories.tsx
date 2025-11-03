import { ComponentMeta, ComponentStory } from "@storybook/react";

import ContractDeployForm from "../components/ContractDeployForm";

const ABI: AbiFragment[] = [
  {
    inputs: [],
    outputs: [],
    name: "",
    stateMutability: "nonpayable",
    type: "constructor",
  },
];

const BYTECODE =
  "608060405234801561001057600080fd5b50610150806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80632e64cec11461003b5780636057361d14610059575b600080fd5b610043610075565b60405161005091906100a1565b60405180910390f35b610073600480360381019061006e91906100ed565b61007e565b005b60008054905090565b8060008190555050565b6000819050919050565b61009b81610088565b82525050565b60006020820190506100b66000830184610092565b92915050565b600080fd5b6100ca81610088565b81146100d557600080fd5b50565b6000813590506100e7816100c1565b92915050565b600060208284031215610103576101026100bc565b5b6000610111848285016100d8565b9150509291505056fea2646970667358221220aa1920a6b5a5aafd58b893f268df436f513d63357ecfdf0a894f99089b74ae9764736f6c63430008120033";

import { TokenWhitelabelApp } from "@dexkit/core/types";
import { DexkitProvider } from "@dexkit/ui/components";
import { AppNotification } from "@dexkit/ui/types";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { atom } from "jotai";
import { useEffect } from "react";
import theme from "../theme";
import { AbiFragment } from "../types";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/ContractDeploy",
  component: ContractDeployForm,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof ContractDeployForm>;

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
const Template: ComponentStory<typeof ContractDeployForm> = (args) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <DexkitProvider
          theme={theme}
          locale="en-US"
          assetsAtom={atom({})}
          hiddenAssetsAtom={atom<{ [key: string]: boolean }>({})}
          currencyUserAtom={atom("")}
          tokensAtom={atom<TokenWhitelabelApp[]>([])}
          notificationTypes={{}}
          notificationsAtom={atom<AppNotification[]>([])}
          onChangeLocale={() => { }}
          transactionsAtom={atom<{}>({})}
          selectedWalletAtom={atom<string>("")}
        >
          <InitConnector />
          <ContractDeployForm {...args} />
        </DexkitProvider>
      </QueryClientProvider>
    </>
  );
};

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  abi: ABI,
  contractBytecode: BYTECODE,
  contractType: "TEST",
};

export const WithoutContructor = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
WithoutContructor.args = {
  abi: [],
  contractBytecode: BYTECODE,
  contractType: "TEST",
};
