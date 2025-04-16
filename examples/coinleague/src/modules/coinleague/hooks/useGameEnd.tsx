import Button from '@mui/material/Button';
import { useMutation } from '@tanstack/react-query';
import { useWeb3React } from '@web3-react/core';
import { useSnackbar } from 'notistack';
import { useCallback, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { endGame } from '../services/coinLeagueFactoryV3';
import { Game } from '../types';
import { useLeaguesChainInfo } from './chain';
import { useFactoryAddress } from './coinleagueFactory';

export function useGameEnd({ game }: { game?: Game }) {
  const { provider } = useWeb3React();
  // const { getScannerUrl } = useChainInfo();
  const factoryAddress = useFactoryAddress();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();
  const [transactionHash, setTransactionHash] = useState<string>();
  const { chainId } = useLeaguesChainInfo();

  // const { createNotification } = useNotifications();

  // const handleViewTransaction = useCallback(
  //   (chainId: number, hash: string) => {
  //     window.open(`${getScannerUrl(chainId)}/tx/${hash}`, '_blank');
  //   },
  //   [getScannerUrl]
  // );

  const reset = useCallback(() => {
    setTransactionHash(undefined);
  }, []);

  const endGameMutation = useMutation(async () => {
    if (game?.amount_to_play && chainId && provider) {
      const tx = await endGame(factoryAddress, provider, game.id.toString());
      const hash = tx.hash;
      setTransactionHash(hash);
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
      //     id: 'end.game',
      //     defaultMessage: 'End Game',
      //   }) as string,
      //   body: `${formatMessage({
      //     id: 'ending.game',
      //     defaultMessage: 'Ending Game',
      //   })} ${game.id}`,
      //   timestamp: Date.now(),
      //   url: getTransactionScannerUrl(chainId, hash),
      //   urlCaption: formatMessage({
      //     id: 'coinLeague.viewTransaction',
      //     defaultMessage: 'View Transaction',
      //   }),
      //   type: NotificationType.TRANSACTION,
      //   metadata: {
      //     chainId: chainId,
      //     transactionHash: hash,
      //     status: 'pending',
      //   } as TxNotificationMetadata,
      // });
      await tx.wait();
    }
  });

  return { reset, endGameMutation, transactionHash };
}
