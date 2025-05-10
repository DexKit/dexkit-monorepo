import { Button } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useWeb3React } from '@web3-react/core';
import { useSnackbar } from 'notistack';
import { useCallback, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { startGame } from '../services/coinLeagueFactoryV3';
import { Game } from '../types';
import { useLeaguesChainInfo } from './chain';
import { useFactoryAddress } from './coinleagueFactory';

export function useGameStart({ game }: { game?: Game }) {
  const { provider } = useWeb3React();

  // const { getScannerUrl } = useChainInfo();
  const factoryAddress = useFactoryAddress();
  const { enqueueSnackbar } = useSnackbar();

  const { formatMessage, messages } = useIntl();
  const [transactionHash, setTransactionHash] = useState<string>();

  const { chainId } = useLeaguesChainInfo();

  const reset = useCallback(() => {
    setTransactionHash(undefined);
  }, []);

  // const handleViewTransaction = useCallback(
  //   (chainId: number, hash: string) => {
  //     window.open(`${getScannerUrl(chainId)}/tx/${hash}`, '_blank');
  //   },
  //   [getScannerUrl]
  // );

  const startGameMutation = useMutation(async () => {
    if (game?.amount_to_play && chainId && provider) {
      const tx = await startGame(factoryAddress, provider, game.id.toString());
      const hash = tx.hash;
      setTransactionHash(hash);
      await tx.wait();
      enqueueSnackbar(
        formatMessage({
          id: 'transaction.created',
          defaultMessage: 'Transaction created',
        }),
        {
          variant: 'success',
          autoHideDuration: 5000,
          action: (
            <Button onClick={() => {}}>
              <FormattedMessage id="view" defaultMessage="View" />
            </Button>
          ),
        }
      );

      // createNotification({
      //   title: formatMessage({
      //     id: 'start.game',
      //     defaultMessage: 'Start game',
      //   }),
      //   body: formatMessage(
      //     { id: 'starting.game.id', defaultMessage: 'Starting  game {id}' },
      //     { id: game.id.toString() }
      //   ),
      //   timestamp: Date.now(),
      //   url: getTransactionScannerUrl(chainId, hash),
      //   urlCaption: formatMessage({
      //     id: 'view.transaction',
      //     defaultMessage: 'View Transaction',
      //   }),
      //   type: NotificationType.TRANSACTION,
      //   metadata: {
      //     chainId: chainId,
      //     transactionHash: hash,
      //     status: 'pending',
      //   } as TxNotificationMetadata,
      // });
    }
  });

  return {
    reset,
    startGameMutation,
    transactionHash,
  };
}
