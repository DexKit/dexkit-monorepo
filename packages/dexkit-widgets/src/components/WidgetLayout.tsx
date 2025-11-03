import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { Box } from "@mui/material";
import { useAtom } from "jotai";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";

// @ts-ignore - TypeScript cannot resolve dynamic imports from next/dynamic during compilation
const SwitchNetworkDialog = dynamic(
  // @ts-ignore
  () => import("@dexkit/ui/components/dialogs/SwitchNetworkDialog")
) as any;

// @ts-ignore - TypeScript cannot resolve dynamic imports from next/dynamic during compilation
const ConnectWalletDialog = dynamic(
  // @ts-ignore
  () => import("@dexkit/ui/components/ConnectWalletDialog")
) as any;

// @ts-ignore - TypeScript cannot resolve dynamic imports from next/dynamic during compilation
const WatchTransactionDialog = dynamic(
  // @ts-ignore
  () => import("@dexkit/ui/components/dialogs/WatchTransactionDialog")
) as any;

import { useWalletActivate } from "@dexkit/wallet-connectors/hooks";

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
  const { isActive } = useWeb3React();

  const transactions = useTransactionDialog();

  const [switchOpen, setSwitchOpen] = useAtom(switchNetworkOpenAtom);
  const [switchChainId, setSwitchChainId] = useAtom(switchNetworkChainIdAtom);

  const connectWalletDialog = useConnectWalletDialog();

  const handleCloseConnectWalletDialog = () => {
    connectWalletDialog.setOpen(false);
  };

  const handleCloseTransactionDialog = () => {
    (transactions.setRedirectUrl as (value: string | undefined) => void)(undefined);
    (transactions.setDialogIsOpen as (value: boolean) => void)(false);
    (transactions.setHash as (value: string | undefined) => void)(undefined);
    (transactions.setType as (value: string | undefined) => void)(undefined);
    (transactions.setMetadata as (value: any) => void)(undefined);
    (transactions.setError as (value: Error | undefined) => void)(undefined);
  };

  const handleCloseSwitchNetworkDialog = () => {
    (setSwitchChainId as (value: number | undefined) => void)(undefined);
    (setSwitchOpen as (value: boolean) => void)(false);
  };

  const walletActivate = useWalletActivate({
    magicRedirectUrl: process.env.NEXT_PUBLIC_MAGIC_REDIRECT_URL || "",
    selectedWalletAtom,
  });

  const handleActivateWallet = async (params: {
    connectorName?: string;
    loginType?: string;
    email?: string;
    icon?: string;
    rdns?: string;
    name?: string;
    connectionType?: string;
  }) => {
    await walletActivate.mutation.mutateAsync(params);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Note: connector is undefined in the new useWeb3React hook
      // Provider events are handled by thirdweb/react hooks
    }
  }, []);

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
