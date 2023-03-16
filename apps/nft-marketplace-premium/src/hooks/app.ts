import { useWeb3React } from '@web3-react/core';
import { atom, useAtom } from 'jotai';

import { useUpdateAtom } from 'jotai/utils';
import { useCallback, useContext } from 'react';
import { AppConfigContext } from '../contexts';
import {
  transactionDialogErrorAtom,
  transactionDialogHashAtom,
  transactionDialogMetadataAtom,
  transactionDialogOpenAtom,
  transactionDialogRedirectUrlAtom,
  transactionDialogTypeAtom,
  transactionsAtom,
} from '../state/atoms';
import {
  TransactionMetadata,
  TransactionStatus,
  TransactionType,
} from '../types/blockchain';

export function useTransactions() {
  const updateTransactions = useUpdateAtom(transactionsAtom);

  const [isOpen, setDialogIsOpen] = useAtom(transactionDialogOpenAtom);
  const [hash, setHash] = useAtom(transactionDialogHashAtom);
  const [error, setError] = useAtom(transactionDialogErrorAtom);
  const [metadata, setMetadata] = useAtom(transactionDialogMetadataAtom);
  const [type, setType] = useAtom(transactionDialogTypeAtom);
  const [redirectUrl, setRedirectUrl] = useAtom(
    transactionDialogRedirectUrlAtom
  );

  const { chainId } = useWeb3React();

  const showDialog = useCallback(
    (open: boolean, metadata?: TransactionMetadata, type?: TransactionType) => {
      setDialogIsOpen(open);
      setType(type);
      setMetadata(metadata);

      if (!open) {
        setHash(undefined);
        setMetadata(undefined);
        setType(undefined);
      }
    },
    []
  );

  const setDialogError = useCallback(
    (error?: Error) => {
      setError(error);
    },
    [setError]
  );

  const addTransaction = useCallback(
    (hash: string, type: TransactionType, metadata?: TransactionMetadata) => {
      if (chainId !== undefined) {
        setHash(hash);

        console.log('chama nego');

        updateTransactions((txs) => ({
          ...txs,
          [hash]: {
            chainId,
            created: new Date().getTime(),
            status: TransactionStatus.Pending,
            type,
            metadata,
            checked: false,
          },
        }));
      }
    },
    [chainId]
  );

  return {
    redirectUrl,
    setRedirectUrl,
    error,
    hash,
    metadata,
    type,
    setHash,
    isOpen,
    setDialogIsOpen,
    setError,
    setMetadata,
    setType,
    showDialog,
    setDialogError,
    addTransaction,
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

const isConnectWalletOpenAtom = atom(false);

export function useConnectWalletDialog() {
  const [isOpen, setOpen] = useAtom(isConnectWalletOpenAtom);

  return {
    isOpen,
    setOpen,
  };
}

// App config context is passed on _app.tsx, in each page we need to pass
// app config in static props to context be initialized
export function useAppConfig() {
  return useContext(AppConfigContext);
}

export function useCollections() {
  const appConfig = useAppConfig();
  return appConfig?.collections;
}
