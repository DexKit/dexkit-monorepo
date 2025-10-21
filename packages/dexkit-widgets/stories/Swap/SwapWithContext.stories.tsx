import { useWalletActivate } from "@dexkit/core/hooks";
import { WalletActivateParams } from "@dexkit/core/types";
import { DexkitProvider } from "@dexkit/ui/components";
import ConnectWalletDialog from "@dexkit/ui/components/ConnectWalletDialog";
import { AppNotification } from "@dexkit/ui/types";
import { createTheme, Grid } from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useWeb3React } from "@web3-react/core";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useState } from "react";
import { SwapWidget, SwapWidgetProps } from "../../src/widgets/swap";

const transactionsAtom = atom<{}>({});
const notificationsAtom = atom<AppNotification[]>([]);
const selectedWalletAtom = atomWithStorage<string>("connector", "");

function Component(props: SwapWidgetProps) {
  const { isActive } = useWeb3React();
  const walletActivate = useWalletActivate({
    magicRedirectUrl: "",
    selectedWalletAtom: selectedWalletAtom,
  });
  const [showConnectWallet, setShowConnectWallet] = useState(false);

  const handleClose = () => { };

  return (
    <>
      <ConnectWalletDialog
        DialogProps={{
          open: showConnectWallet,
          maxWidth: "sm",
          fullWidth: true,
          onClose: handleClose,
        }}
        activate={async (params: WalletActivateParams) => {
          walletActivate.mutation.mutateAsync(params);
        }}
        activeConnectorName={walletActivate.connectorName}
        isActivating={walletActivate.mutation.isLoading}
        isActive={isActive}
      />

      <SwapWidget
        {...props}
        onConnectWallet={() => {
          setShowConnectWallet(true);
        }}
      />
    </>
  );
}

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/Swap With Context",
  component: SwapWidget,
} as ComponentMeta<typeof SwapWidget>;

const zeroExApiKey = process.env.ZRX_RFQ_API_KEY;

const queryClient = new QueryClient();

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SwapWidget> = (args: SwapWidgetProps) => {
  const [locale, setLocale] = useState("en-US");
  return (
    <QueryClientProvider client={queryClient}>
      <DexkitProvider
        locale={locale}
        defaultLocale={locale}
        selectedWalletAtom={selectedWalletAtom}
        transactionsAtom={transactionsAtom}
        notificationTypes={{}}
        notificationsAtom={notificationsAtom}
        theme={createTheme()}
        onChangeLocale={(loc) => setLocale(loc)}
      >
        <Grid container justifyContent="center" spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Component
              {...args}
              onNotification={() => { }}
              onShowTransactions={() => { }}
              isAutoSlippage={true}
              maxSlippage={0}
              onChangeSlippage={() => { }}
              onAutoSlippage={() => { }}
            />
          </Grid>
        </Grid>
      </DexkitProvider>
    </QueryClientProvider>
  );
};

export const Default = Template.bind({});

Default.args = {
  renderOptions: {
    currency: "usd",
    configsByChain: {},
    zeroExApiKey,
    defaultChainId: 137,
  },
};
