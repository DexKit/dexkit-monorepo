import { useWalletActivate } from "@dexkit/core/hooks";
import { TokenWhitelabelApp, WalletActivateParams } from "@dexkit/core/types";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { atom } from "jotai";
import ConnectWalletDialog from "../components/ConnectWallet/ConnectWalletDialog";
import { ThemeMode } from "../constants/enum";
import { DexkitProvider } from "../providers/DexkitProvider";
import theme from "../theme";
import { AppNotification } from "../types";

const meta: Meta<typeof ConnectWalletDialog> = {
  title: "Components/ConnectWalletDialog",
  component: ConnectWalletDialog,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
};

export default meta;

const selectedWalletAtom = atom("storybook-selected-wallet");
const queryClient = new QueryClient();

const WrappedComponent = () => {
  const walletActivate = useWalletActivate({
    selectedWalletAtom,
    magicRedirectUrl: "localhost:3000",
  });
  const { isActive } = useWeb3React();

  return (
    <ConnectWalletDialog
      DialogProps={{ open: true, maxWidth: "sm", fullWidth: true }}
      activate={async (params: WalletActivateParams) => {
        walletActivate.mutation.mutateAsync(params);
      }}
      activeConnectorName={walletActivate.connectorName}
      isActivating={walletActivate.mutation.isLoading}
      isActive={isActive}
    />
  );
};

const Template = () => {
  return (
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
        <WrappedComponent />
      </DexkitProvider>
    </QueryClientProvider>
  );
};
type Story = StoryObj<typeof Template>;

export const Default: Story = {
  render: () => <Template></Template>,
};
