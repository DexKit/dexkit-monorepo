import { Box } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { useAtom } from "jotai";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";

const SwitchNetworkDialog = dynamic(
  () => import("@dexkit/ui/components/dialogs/SwitchNetworkDialog"),
);

const ConnectWalletDialog = dynamic(
  () => import("@dexkit/ui/components/ConnectWalletDialog"),
);

const WatchTransactionDialog = dynamic(
  () => import("@dexkit/ui/components/dialogs/WatchTransactionDialog"),
);

import { useWalletActivate } from "@dexkit/core/hooks";
import { WalletActivateParams } from "@dexkit/core/types";

import { useConnectWalletDialog, useTransactionDialog } from "../hooks";
import {
  selectedWalletAtom,
  switchNetworkChainIdAtom,
  switchNetworkOpenAtom,
} from "../state/atoms";

interface Props {
  children?: React.ReactNode | React.ReactNode[];
}

const WidgetLayout = ({ children }: Props) => {
  const { connector, isActive } = useWeb3React();

  const transactions = useTransactionDialog();

  const [switchOpen, setSwitchOpen] = useAtom(switchNetworkOpenAtom);
  const [switchChainId, setSwitchChainId] = useAtom(switchNetworkChainIdAtom);

  const connectWalletDialog = useConnectWalletDialog();

  const handleCloseConnectWalletDialog = () => {
    connectWalletDialog.setOpen(false);
  };

  const handleCloseTransactionDialog = () => {
    transactions.setRedirectUrl(undefined);
    transactions.setDialogIsOpen(false);
    transactions.setHash(undefined);
    transactions.setType(undefined);
    transactions.setMetadata(undefined);
    transactions.setError(undefined);
  };

  const handleCloseSwitchNetworkDialog = () => {
    setSwitchChainId(undefined);
    setSwitchOpen(false);
  };

  const walletActivate = useWalletActivate({
    magicRedirectUrl: process.env.NEXT_PUBLIC_MAGIC_REDIRECT_URL || "",
    selectedWalletAtom,
  });

  const handleActivateWallet = async (params: WalletActivateParams) => {
    await walletActivate.mutation.mutateAsync(params);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      // connector.activate();
      const handleNetworkChange = (newNetwork: any, oldNetwork: any) => {
        if (connector && connector.connectEagerly) {
          connector.connectEagerly();
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
            handleNetworkChange,
          );
        }
      };
    }
  }, [connector, connector?.provider]);

  useEffect(() => {
    if (typeof window !== "undefined" && connector) {
      if (connector.connectEagerly) {
        connector.connectEagerly();
      }
    }
  }, [connector]);

  return (
    <>
      {transactions.isOpen && (
        <WatchTransactionDialog
          DialogProps={{
            open: transactions.isOpen,
            onClose: handleCloseTransactionDialog,
            fullWidth: true,
            maxWidth: "xs",
          }}
          hash={transactions.hash}
          type={transactions.type}
          values={transactions.values}
        />
      )}

      {switchOpen && (
        <SwitchNetworkDialog
          dialogProps={{
            open: switchOpen,
            onClose: handleCloseSwitchNetworkDialog,
            fullWidth: true,
            maxWidth: "xs",
          }}
          chainId={switchChainId}
        />
      )}
      <ConnectWalletDialog
        DialogProps={{
          open: connectWalletDialog.isOpen,
          onClose: handleCloseConnectWalletDialog,
          fullWidth: true,
          maxWidth: "sm",
        }}
        isActive={isActive}
        isActivating={walletActivate.mutation.isLoading}
        activeConnectorName={walletActivate.connectorName}
        activate={handleActivateWallet}
      />

      <Box>{children}</Box>
    </>
  );
};

export default WidgetLayout;
