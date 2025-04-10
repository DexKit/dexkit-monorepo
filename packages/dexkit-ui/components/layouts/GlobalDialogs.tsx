import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { useRouter } from "next/router";

import {
  useConnectWalletDialog,
  useExecuteTransactionsDialog,
  useHoldsKitDialog,
  useShowSelectCurrency,
  useShowSelectLocale,
  useSignMessageDialog,
  useSwitchNetwork,
} from "@dexkit/ui/hooks/ui";

import { useDexKitContext } from "@dexkit/ui/hooks/useDexKitContext";

import dynamic from "next/dynamic";

import { selectedWalletAtom } from "@dexkit/ui/state";
const SignMessageDialog = dynamic(
  () => import("@dexkit/ui/components/dialogs/SignMessageDialog")
);
const SwitchNetworkDialog = dynamic(
  () => import("@dexkit/ui/components/dialogs/SwitchNetworkDialog")
);

import { useWalletActivate } from "@dexkit/wallet-connectors/hooks/wallet";

const WatchTransactionDialog = dynamic(
  () => import("@dexkit/ui/components/dialogs/WatchTransactionDialog")
);
const AppTransactionWatchDialog = dynamic(
  () => import("@dexkit/ui/components/AppTransactionWatchDialog")
);

const HoldingKitDialog = dynamic(
  () => import("@dexkit/ui/components/dialogs/HoldingKitDialog")
);

const SelectCurrencyDialog = dynamic(
  () => import("@dexkit/ui/components/dialogs/SelectCurrencyDialog")
);
const SelectLanguageDialog = dynamic(
  () => import("@dexkit/ui/components/dialogs/SelectLanguageDialog")
);

let runnedEagerly = false;

export function GlobalDialogs() {
  const { connector, isActive, isActivating } = useWeb3React();
  const router = useRouter();

  /* useEffect(() => {
    if (typeof window !== "undefined") {
      // connector.activate();
      const handleNetworkChange = (newNetwork: any, oldNetwork: any) => {
        if (connector && connector?.connectEagerly) {
          if (
            walletConnectorMetadata &&
            walletConnectorMetadata?.type ===
              ConnectionType.EIP_6963_INJECTED &&
            walletConnectorMetadata?.rdns
          ) {
            if ((connector as EIP6963)?.selectProvider) {
              (connector as EIP6963)?.selectProvider(
                walletConnectorMetadata.rdns
              );
            }
          }
          connector.connectEagerly();
          runnedEagerly = true;
        }

        // When a Provider makes its initial connection, it emits a "network"
        // event with a null oldNetwork along with the newNetwork. So, if the
        // oldNetwork exists, it represents a changing network
        //window.location.reload();
      };

      if (connector?.provider?.on) {
        connector?.provider?.on("chainChanged", handleNetworkChange);
      }

      return () => {
        if (connector?.provider?.removeListener) {
          connector?.provider?.removeListener(
            "chainChanged",
            handleNetworkChange
          );
        }
      };
    }
  }, [connector, connector?.provider, walletConnectorMetadata]);

  useEffect(() => {
    if (typeof window !== "undefined" && connector && !runnedEagerly) {
      if (connector.connectEagerly) {
        if (
          walletConnectorMetadata &&
          walletConnectorMetadata?.type === ConnectionType.EIP_6963_INJECTED &&
          walletConnectorMetadata?.rdns
        ) {
          if ((connector as EIP6963)?.selectProvider) {
            (connector as EIP6963)?.selectProvider(
              walletConnectorMetadata.rdns
            );
          }
        }
        connector.connectEagerly();
        runnedEagerly = true;
      }
    }
  }, [connector, walletConnectorMetadata]);*/

  const { watchTransactionDialog } = useDexKitContext();

  const holdsKitDialog = useHoldsKitDialog();

  const switchNetwork = useSwitchNetwork();

  const showSelectCurrency = useShowSelectCurrency();

  const showSelectLocale = useShowSelectLocale();

  const connectWalletDialog = useConnectWalletDialog();

  const handleCloseConnectWalletDialog = () => {
    connectWalletDialog.setOpen(false);
  };

  const handleCloseTransactionDialog = () => {
    if (watchTransactionDialog.redirectUrl) {
      router.replace(watchTransactionDialog.redirectUrl);
    }
    watchTransactionDialog.setRedirectUrl(undefined);
    watchTransactionDialog.setDialogIsOpen(false);
    watchTransactionDialog.setHash(undefined);
    watchTransactionDialog.setType(undefined);
    watchTransactionDialog.setMetadata(undefined);
    watchTransactionDialog.setError(undefined);
  };

  const handleCloseSwitchNetworkDialog = () => {
    switchNetwork.setNetworkChainId(undefined);
    switchNetwork.setOpenSwitchNetwork(false);
  };

  const signMessageDialog = useSignMessageDialog();

  const handleCloseSignMessageDialog = () => {
    signMessageDialog.setOpen(false);
    signMessageDialog.setError(undefined);
    signMessageDialog.setIsSuccess(false);
    signMessageDialog.setMessage(undefined);
  };

  const handleCloseCurrencySelect = () => {
    showSelectCurrency.setIsOpen(false);
  };

  const handleCloseLocaleSelect = () => {
    showSelectLocale.setIsOpen(false);
  };

  const txDialog = useExecuteTransactionsDialog();
  const walletActivate = useWalletActivate({
    magicRedirectUrl:
      typeof window !== "undefined"
        ? window.location.href
        : process.env.NEXT_PUBLIC_MAGIC_REDIRECT_URL || "",
    selectedWalletAtom,
  });

  return (
    <>
      {showSelectCurrency && (
        <SelectCurrencyDialog
          dialogProps={{
            open: showSelectCurrency.isOpen,
            onClose: handleCloseCurrencySelect,
            fullWidth: true,
            maxWidth: "xs",
          }}
        />
      )}
      {holdsKitDialog && (
        <HoldingKitDialog
          dialogProps={{
            open: holdsKitDialog.isOpen,
            onClose: () => holdsKitDialog.setIsOpen(false),
            fullWidth: true,
            maxWidth: "xs",
          }}
        />
      )}

      {showSelectLocale && (
        <SelectLanguageDialog
          dialogProps={{
            open: showSelectLocale.isOpen,
            onClose: handleCloseLocaleSelect,
            fullWidth: true,
            maxWidth: "xs",
          }}
        />
      )}
      {watchTransactionDialog.isOpen && (
        <WatchTransactionDialog
          DialogProps={{
            open: watchTransactionDialog.isOpen,
            onClose: handleCloseTransactionDialog,
            fullWidth: true,
            maxWidth: "xs",
          }}
          error={watchTransactionDialog.error}
          hash={watchTransactionDialog.hash}
          type={watchTransactionDialog.type}
          values={watchTransactionDialog.values}
        />
      )}
      {signMessageDialog.open && (
        <SignMessageDialog
          dialogProps={{
            open: signMessageDialog.open,
            onClose: handleCloseSignMessageDialog,
            fullWidth: true,
            maxWidth: "xs",
          }}
          error={signMessageDialog.error}
          success={signMessageDialog.isSuccess}
          message={signMessageDialog.message}
        />
      )}
      {switchNetwork.isOpenSwitchNetwork && (
        <SwitchNetworkDialog
          dialogProps={{
            open: switchNetwork.isOpenSwitchNetwork,
            onClose: handleCloseSwitchNetworkDialog,
            fullWidth: true,
            maxWidth: "xs",
          }}
          chainId={switchNetwork.networkChainId}
        />
      )}

      {txDialog.show && (
        <AppTransactionWatchDialog
          DialogProps={{
            open: true,
            maxWidth: "sm",
            fullWidth: true,
            onClose: txDialog.handleClose,
          }}
          transactions={txDialog.transactions}
        />
      )}
    </>
  );
}
