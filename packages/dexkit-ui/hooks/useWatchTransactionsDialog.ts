import {
  ChainId,
  TransactionStatus,
  TransactionType,
} from "@dexkit/core/constants/enums";
import { AppTransaction, TransactionMetadata } from "@dexkit/core/types";
import { PrimitiveAtom } from "jotai";
import { useUpdateAtom } from "jotai/utils";
import { useCallback, useState } from "react";
export function useWatchTransactionDialog({
  transactionsAtom,
}: {
  transactionsAtom: PrimitiveAtom<{
    [key: string]: AppTransaction;
  }>;
}) {
  const updateTransactions = useUpdateAtom(transactionsAtom);

  const [isOpen, setDialogIsOpen] = useState(false);
  const [hash, setHash] = useState<string>();
  const [error, setError] = useState<Error>();
  const [metadata, setMetadata] = useState<TransactionMetadata>();
  const [type, setType] = useState<string>();

  const [values, setValues] = useState<Record<string, any>>();

  const [redirectUrl, setRedirectUrl] = useState<string>();

  const watch = useCallback((hash: string) => {
    setHash(hash);
  }, []);

  const open = useCallback((type: string, values: Record<string, any>) => {
    setDialogIsOpen(true);
    setValues(values);
    setType(type);
    setHash(undefined);
  }, []);

  const close = useCallback(() => {
    setDialogIsOpen(false);
    setType(undefined);
    setValues(undefined);
    setMetadata(undefined);
    setError(undefined);
    setHash(undefined);
  }, []);

  const showDialog = useCallback(
    (open: boolean, metadata?: TransactionMetadata, type?: TransactionType) => {
      setDialogIsOpen(open);
      setMetadata(metadata);

      if (!open) {
        setHash(undefined);
        setMetadata(undefined);
        setType(undefined);
        setError(undefined);
      }
    },
    [],
  );

  const setDialogError = useCallback(
    (error?: Error) => {
      if (isOpen) {
        setError(error);
      }
    },
    [setError, isOpen],
  );

  const addTransaction = ({
    hash,
    type,
    metadata,
    values,
    chainId,
  }: {
    hash: string;
    type: TransactionType;
    metadata?: TransactionMetadata;
    values: Record<string, any>;
    chainId: ChainId;
  }) => {
    if (chainId !== undefined) {
      setHash(hash);

      updateTransactions((txs) => ({
        ...txs,
        [hash]: {
          chainId,
          created: new Date().getTime(),
          status: TransactionStatus.Pending,
          type,
          metadata,
          checked: false,
          values,
        },
      }));
    }
  };

  return {
    values,
    open,
    close,
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
    watch,
  };
}
