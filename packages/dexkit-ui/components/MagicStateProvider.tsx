import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import dynamic from "next/dynamic";
import { ReactNode, useCallback, useEffect, useState } from "react";

const MagicSignDataDialog = dynamic(
  () => import("../components/dialogs/MagicSignDataDialog"),
);

const MagicTxConfirmDialog = dynamic(
  () => import("./dialogs/MagicTxConfirmDialog"),
);

import { ProviderWrapper } from "@dexkit/wallet-connectors/connectors/magic";
import { useAsyncMemo } from "@dexkit/widgets/src/hooks";
import { MagicStateContext } from "../context/MagicStateContext";

interface Props {
  children: ReactNode;
  currency: string;
}

export function MagicStateProvider(props: Props) {
  const { connector, chainId } = useWeb3React();

  const providerWrapper: ProviderWrapper | undefined = useAsyncMemo(
    async () => {
      if (connector && connector.id === "magic" && connector?.getProvider) {
        return (await connector?.getProvider()) as any;
      }
    },
    undefined,
    [connector],
  );

  const { children, currency } = props;
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  // data for transactions
  const [data, setData] = useState<any>();

  const [showSignDataDialog, setShowSignDataDialog] = useState(false);
  // data for sign data RPC
  const [signData, setSignData] = useState<any>();
  // prefer "Dialog" instead of "Modal"
  const handleShowTransactionModal = useCallback(() => {
    setShowTransactionModal(true);
  }, []);

  const handleShowSignDataDialog = useCallback(() => {
    setShowSignDataDialog(true);
  }, []);

  const resetEvents = useCallback(() => {
    providerWrapper?.eventEmitter.removeAllListeners();

    providerWrapper?.eventEmitter.on("request", (args: any) => {
      setData(args);
      handleShowTransactionModal();
    });

    providerWrapper?.eventEmitter.on("sign", (args: any) => {
      setSignData(args);
      handleShowSignDataDialog();
    });
  }, [handleShowTransactionModal, handleShowSignDataDialog, providerWrapper]);

  const handleCloseTransactionModal = useCallback(() => {
    setShowTransactionModal(false);
    setData(undefined);
    resetEvents();
  }, [resetEvents]);

  const handleTransactionConfirm = useCallback(
    (data: any) => {
      if (providerWrapper?.eventEmitter) {
        providerWrapper?.eventEmitter.emit("execute", data);
      }
      setShowTransactionModal(false);
    },
    [providerWrapper],
  );

  const handleTransactionCancel = useCallback(() => {
    providerWrapper?.eventEmitter.emit("cancel");
    setShowTransactionModal(false);
  }, [providerWrapper]);

  const handleSignConfirm = useCallback(() => {
    providerWrapper?.eventEmitter.emit("sign.confirm");
    setShowSignDataDialog(false);
  }, [providerWrapper]);

  const handleSignCancel = useCallback(() => {
    providerWrapper?.eventEmitter.emit("sign.cancel");
    setShowSignDataDialog(false);
  }, [providerWrapper]);

  useEffect(() => {
    if (chainId && connector && connector.id === "magic" && providerWrapper) {
      resetEvents();
      return () => {
        providerWrapper?.eventEmitter.removeAllListeners();
      };
    }
  }, [chainId, providerWrapper]);

  return (
    <MagicStateContext.Provider
      value={{
        handleSignCancel,
        handleSignConfirm,
        handleTransactionCancel,
        handleShowTransactionModal,
        handleTransactionConfirm,
        handleCloseTransactionModal,
        showSignDataDialog,
        showTransactionModal,
        signData,
        data,
      }}
    >
      {showTransactionModal && (
        <MagicTxConfirmDialog
          dialogProps={{
            open: showTransactionModal,
            fullWidth: true,
            maxWidth: "xs",
          }}
          onCancel={handleTransactionCancel}
          data={data}
          onConfirm={handleTransactionConfirm}
          currency={currency}
        />
      )}
      {showSignDataDialog && (
        <MagicSignDataDialog
          dialogProps={{
            open: showSignDataDialog,
            maxWidth: "xs",
            fullWidth: true,
          }}
          signData={signData}
          onConfirm={handleSignConfirm}
          onCancel={handleSignCancel}
        />
      )}

      {children}
    </MagicStateContext.Provider>
  );
}
