import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { PrimitiveAtom, useAtom } from "jotai";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useMemo } from "react";
import { useIntl } from "react-intl";

import { TransactionStatus } from "@dexkit/core/constants";
import type { AppTransaction } from "@dexkit/core/types";
import { useBlockNumber } from "@dexkit/ui/hooks/useBlockNumber";

interface Props {
  pendingTransactionsAtom: PrimitiveAtom<{
    [hash: string]: AppTransaction;
  }>;
}

export default function TransactionUpdater({ pendingTransactionsAtom }: Props) {
  const { chainId, provider } = useWeb3React();

  const [transactions, setPendingTransactions] = useAtom(
    pendingTransactionsAtom
  );

  const pendingTransactions = useMemo(() => {
    let objs = Object.keys(transactions)
      .map((key) => {
        return { key, tx: transactions[key] };
      })
      .filter((t) => t.tx.status === TransactionStatus.Pending);

    return objs.reduce((prev: any, curr) => {
      prev[curr.key] = curr.tx;

      return prev;
    }, {});
  }, [transactions]);

  const blockNumber = useBlockNumber();

  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const getReceipt = useCallback(
    (hash: string) => {
      if (provider !== undefined || chainId !== undefined) {
        return provider?.getTransactionReceipt(hash);
      }
    },
    [chainId, provider]
  );

  useEffect(() => {
    if (
      chainId !== undefined &&
      blockNumber !== undefined &&
      pendingTransactions
    ) {
      const cancels = Object.keys(pendingTransactions)
        .filter((hash) => pendingTransactions[hash].chainId === chainId)
        .map((hash) => {
          let canceled = false;

          const cancelFunc = () => {
            canceled = true;
          };

          getReceipt(hash)?.then((receipt: any) => {
            if (!canceled) {
              if (receipt?.confirmations > 0) {
                const newTx = pendingTransactions[hash];

                if (receipt?.status !== undefined) {
                  if (receipt?.status === 1) {
                    newTx.status = TransactionStatus.Confirmed;

                    enqueueSnackbar(
                      formatMessage({
                        defaultMessage: "Transaction confirmed",
                        id: "transaction.confirmed",
                      }),
                      {
                        variant: "success",
                      }
                    );
                  } else if (receipt?.status === 0) {
                    newTx.status = TransactionStatus.Failed;
                    enqueueSnackbar(
                      formatMessage({
                        defaultMessage: "Transaction failed",
                        id: "transaction.failed",
                      }),
                      {
                        variant: "error",
                      }
                    );
                  }
                }

                setPendingTransactions((txs: any) => ({
                  ...txs,
                  [hash]: newTx,
                }));
              }
            }
          });

          return cancelFunc;
        });

      return () => {
        cancels.forEach((fn) => fn());
      };
    }
  }, [
    pendingTransactions,
    blockNumber,
    getReceipt,
    chainId,
    enqueueSnackbar,
    formatMessage,
    setPendingTransactions,
  ]);

  return null;
}
