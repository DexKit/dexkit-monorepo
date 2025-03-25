import { pendingTransactionsAtom } from '@/modules/common/atoms/index';
import { TransactionStatus } from '@/modules/common/types/transactions';
import { useWeb3React } from '@web3-react/core';
import { useAtom } from 'jotai';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect } from 'react';
import { useIntl } from 'react-intl';

import { useBlockNumber } from '@/modules/common/hooks/blockchain';

export default function TransactionUpdater() {
  const { chainId, provider } = useWeb3React();
  const [pendingTransactions, setPendingTransactions] = useAtom(
    pendingTransactionsAtom
  );
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

          getReceipt(hash)?.then((receipt) => {
            if (!canceled) {
              if (receipt?.confirmations > 0) {
                const newTx = pendingTransactions[hash];

                if (receipt?.status !== undefined) {
                  if (receipt?.status === 1) {
                    newTx.status = TransactionStatus.Confirmed;

                    enqueueSnackbar(
                      formatMessage({
                        defaultMessage: 'Transaction confirmed',
                        id: 'transaction.confirmed',
                      }),
                      {
                        variant: 'success',
                      }
                    );
                  } else if (receipt?.status === 0) {
                    newTx.status = TransactionStatus.Failed;
                    enqueueSnackbar(
                      formatMessage({
                        defaultMessage: 'Transaction failed',
                        id: 'transaction.failed',
                      }),
                      {
                        variant: 'error',
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
