import { useMutation } from '@tanstack/react-query';
import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import {
  COIN_LEAGUES_FACTORY_ADDRESS_V3,
  GET_LEAGUES_CHAIN_ID,
} from '../constants';
import { COINLEAGUENFT_ROUTE, COINLEAGUE_ROUTE } from '../constants/routes';
import { createGame } from '../services/coinLeagueFactoryV3';
import { GameParamsV3 } from '../types';
import { useLeaguesChainInfo } from './chain';
import { useIsNFTGame } from './nft';

export const useFactoryAddress = () => {
  const { chainId } = useLeaguesChainInfo();

  return useMemo(() => {
    return COIN_LEAGUES_FACTORY_ADDRESS_V3[GET_LEAGUES_CHAIN_ID(chainId)];
  }, [chainId]);
};

export const useCoinLeagueFactoryRoutes = (isNFT = false) => {
  const router = useRouter();
  const { room } = router.query;
  const isNFTGame = useIsNFTGame() || isNFT;
  const { chainFromSearchName } = useLeaguesChainInfo();

  const enterGameRoute = useCallback(
    (address: string) => {
      if (room) {
        return `${COINLEAGUE_ROUTE}/room/${room}/game/${address}`;
      } else {
        if (isNFTGame) {
          return `${COINLEAGUENFT_ROUTE}/${address}`;
        } else {
          if (chainFromSearchName) {
            return `${COINLEAGUE_ROUTE}/${address}?network=${chainFromSearchName}`;
          } else {
            return `${COINLEAGUE_ROUTE}/${address}`;
          }
        }
      }
    },
    [room, isNFTGame, chainFromSearchName]
  );

  const activeGamesRoute = useMemo(() => {
    if (room) {
      return `${COINLEAGUE_ROUTE}/room/${room}/active-games`;
    } else {
      if (isNFTGame) {
        return `${COINLEAGUENFT_ROUTE}/active-games`;
      } else {
        if (chainFromSearchName) {
          return `${COINLEAGUE_ROUTE}/active-games?network=${chainFromSearchName}`;
        } else {
          return `${COINLEAGUE_ROUTE}/active-games`;
        }
      }
    }
  }, [room, isNFTGame, chainFromSearchName]);

  const listGamesRoute = useMemo(() => {
    if (room) {
      return `${COINLEAGUE_ROUTE}/room/${room}`;
    } else {
      if (isNFTGame) {
        return `${COINLEAGUENFT_ROUTE}`;
      } else {
        if (chainFromSearchName) {
          return `${COINLEAGUE_ROUTE}?network=${chainFromSearchName}`;
        } else {
          return `${COINLEAGUE_ROUTE}`;
        }
      }
    }
  }, [room, isNFTGame, chainFromSearchName]);

  return {
    enterGameRoute,
    activeGamesRoute,
    listGamesRoute,
  };
};

export const useCoinLeagueFactoryCreateGame = () => {
  const { provider, chainId } = useWeb3React();
  // const { createNotification } = useNotifications();
  const { formatMessage } = useIntl();
  const isNFTGame = useIsNFTGame();
  const factoryAddress = useFactoryAddress();

  const onGameCreateMutation = useMutation(async (params: GameParamsV3) => {
    if (!provider || !factoryAddress || !chainId) {
      return;
    }

    const tx = await createGame(factoryAddress, params, provider);

    // createNotification({
    //   title: isNFTGame
    //     ? formatMessage({
    //         id: 'created.game.main.room',
    //         defaultMessage: 'Created Game on Main room',
    //       })
    //     : formatMessage({
    //         id: 'created.game.nft.room',
    //         defaultMessage: 'Created Game on NFT room',
    //       }),
    //   body: isNFTGame
    //     ? formatMessage(
    //         {
    //           id: 'created.game.main.room.date',
    //           defaultMessage: 'Created Game on Main room at {date}',
    //         },
    //         { date: new Date().toLocaleTimeString() }
    //       )
    //     : formatMessage(
    //         {
    //           id: 'created.game.nft.room.date',
    //           defaultMessage: 'Created Game on NFT room at {date}',
    //         },
    //         { date: new Date().toLocaleTimeString() }
    //       ),

    //   timestamp: Date.now(),
    //   url: getTransactionScannerUrl(chainId, tx),
    //   urlCaption: formatMessage({
    //     id: 'view.transaction',
    //     defaultMessage: 'View transaction',
    //   }),
    //   type: NotificationType.TRANSACTION,
    //   metadata: {
    //     chainId: chainId,
    //     transactionHash: tx,
    //     status: 'pending',
    //   } as TxNotificationMetadata,
    // });
    await tx.wait();
  });
  return {
    onGameCreateMutation,
  };
};
