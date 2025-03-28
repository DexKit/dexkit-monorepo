import { ZERO_ADDRESS } from '@/modules/common/constants';
import Button from '@mui/material/Button';

import { useMutation } from '@tanstack/react-query';
import { useWeb3React } from '@web3-react/core';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { joinGame } from '../services/coinLeagueFactoryV3';
import { Game } from '../types';
import { useLeaguesChainInfo } from './chain';
import { useFactoryAddress } from './coinleagueFactory';

export function useGameJoin({ game }: { game?: Game }) {
  // const { getScannerUrl } = useChainInfo();
  const factoryAddress = useFactoryAddress();
  const { provider } = useWeb3React();
  const { formatMessage } = useIntl();
  const [transactionHash, setTransactionHash] = useState<string>();

  const { enqueueSnackbar } = useSnackbar();

  const { chainId } = useLeaguesChainInfo();

  // const { createNotification } = useNotifications();

  // const handleViewTransaction = useCallback(
  //   (chainId: number, hash: string) => {
  //     window.open(`${getScannerUrl(chainId)}/tx/${hash}`, '_blank');
  //   },
  //   [getScannerUrl]
  // );

  const joinGameMutation = useMutation(
    async ({
      coins,
      captainCoin,
      isNFTGame,
      affiliate,
    }: {
      coins: string[];
      captainCoin: string;
      isNFTGame: Boolean;
      affiliate?: string | null;
    }) => {
      if (game?.amount_to_play && chainId && provider) {
        const tx = await joinGame(
          factoryAddress,
          coins,
          captainCoin,
          provider,
          affiliate || ZERO_ADDRESS,
          game.id.toString()
        );
        setTransactionHash(tx.hash);

        enqueueSnackbar(
          formatMessage({
            id: 'transaction.created',
            defaultMessage: 'Transaction created',
          }),
          {
            variant: 'success',
            autoHideDuration: 5000,
            action: (
              <Button>
                <FormattedMessage id="view" defaultMessage="View" />
              </Button>
            ),
          }
        );

        // createNotification({
        //   title: isNFTGame
        //     ? ''
        //     : (formatMessage({
        //         id: 'join.game',
        //         defaultMessage: 'Join Game',
        //       }) as string), // isNFTGame
        //   body: `${formatMessage({
        //     id: 'joining.game',
        //     defaultMessage: 'Joining Game',
        //   })} ${game.id}`,
        //   timestamp: Date.now(),
        //   url: getTransactionScannerUrl(chainId, tx.hash),
        //   urlCaption: formatMessage({
        //     id: 'view.transaction',
        //     defaultMessage: 'View Transaction',
        //   }),
        //   type: NotificationType.TRANSACTION,
        //   metadata: {
        //     chainId: chainId,
        //     transactionHash: tx.hash,
        //     status: 'pending',
        //   } as TxNotificationMetadata,
        // });
        await tx.wait();
      }
    }
  );

  return {
    joinGameMutation,
    transactionHash,
  };
}
