




import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { showTxDialogAtom, txDialogLoading, txDialogOptions, txDialogTransactionsAtom } from "../atoms";
import type { TxDialogOptions, TxDialogTransaction } from "../types";

const showSelectLocaleAtom = atom(false);

export function useShowSelectLocale() {
  const [isOpen, setIsOpen] = useAtom(showSelectLocaleAtom);

  return { isOpen, setIsOpen };
}


export const holdsKitDialogoAtom = atom(false);

export function useHoldsKitDialog() {
  const [isOpen, setIsOpen] = useAtom(holdsKitDialogoAtom);

  return { isOpen, setIsOpen };
}


const isConnectWalletOpenAtom = atom(false);

export function useConnectWalletDialog() {
  const [isOpen, setOpen] = useAtom(isConnectWalletOpenAtom);

  const handleConnectWallet = useCallback(() => {
    setOpen(true);
  }, []);

  return {
    isOpen,
    setOpen,
    handleConnectWallet,
  };
}

const showSelectCurrency = atom(false);

export function useShowSelectCurrency() {
  const [isOpen, setIsOpen] = useAtom(showSelectCurrency);

  return { isOpen, setIsOpen };
}

export const switchNetworkOpenAtom = atom(false);
export const switchNetworkChainIdAtom = atom<number | undefined>(undefined);

export function useSwitchNetwork() {
  const [isOpenSwitchNetwork, setOpenSwitchNetwork] = useAtom(
    switchNetworkOpenAtom
  );
  const [networkChainId, setNetworkChainId] = useAtom(switchNetworkChainIdAtom);

  const openDialog = function (chainId: number | undefined) {
    setOpenSwitchNetwork(true);
    (setNetworkChainId as any)(chainId);
  };

  return {
    isOpenSwitchNetwork,
    setOpenSwitchNetwork,
    networkChainId,
    setNetworkChainId,
    openDialog,
  };
}

const signMessageDialogOpenAtom = atom(false);
const signMessageDialogErrorAtom = atom<Error | undefined>(undefined);
const signMessageDialogSuccessAtom = atom<boolean>(false);
const signMessageDialogMessage = atom<string | undefined>(undefined);

export function useSignMessageDialog() {
  const [open, setOpen] = useAtom(signMessageDialogOpenAtom);
  const [error, setError] = useAtom(signMessageDialogErrorAtom);
  const [isSuccess, setIsSuccess] = useAtom(signMessageDialogSuccessAtom);
  const [message, setMessage] = useAtom(signMessageDialogMessage);

  return {
    isSuccess,
    setIsSuccess,
    error,
    setError,
    open,
    setOpen,
    message,
    setMessage,
  };
}


export function useExecuteTransactionsDialog() {
  const [show, setShow] = useAtom(showTxDialogAtom);
  const [transactions, setTransactions] = useAtom(txDialogTransactionsAtom);
  const [isLoading, setIsLoading] = useAtom(txDialogLoading);
  const [options, setOptions] = useAtom(txDialogOptions);

  const handleClose = useCallback(() => {
    setShow(false);
    setTransactions([]);
    (setOptions as any)(undefined);
  }, []);

  const execute = useCallback(
    (transactions: TxDialogTransaction[], opts?: TxDialogOptions) => {
      setShow(true);
      setTransactions(transactions);
      (setOptions as any)(opts);
    },
    []
  );

  return {
    options,
    isLoading,
    setIsLoading,
    show,
    setShow,
    transactions,
    setTransactions,
    handleClose,
    execute,
  };
}