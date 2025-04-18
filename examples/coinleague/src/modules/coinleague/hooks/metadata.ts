import { useMutation, useQuery } from '@tanstack/react-query';
import { useWeb3React } from '@web3-react/core';
import { RoomType } from '../constants/enums';
import {
  getGameMetadata,
  getGamesMetadata,
  remove,
  signUpdate,
  update,
} from '../services/gameMetadataApi';
import { useLeaguesChainInfo } from './chain';
import { useIsNFTGame } from './nft';

export function useGameMetadataMutation() {
  const { provider, account } = useWeb3React();
  const { chainId } = useLeaguesChainInfo();
  const isNFT = useIsNFTGame();
  return useMutation(async ({ data, id }: { data: any; id: string }) => {
    if (!chainId || !account || !provider) {
      return;
    }
    const signedData = await signUpdate(provider, chainId);

    await update(
      signedData.sig,
      signedData.messageSigned,
      data,
      isNFT ? RoomType.NFT : RoomType.Stable,
      id,
      account,
      chainId
    );
  });
}

export const useGameMetadataDeleteMutation = () => {
  const { provider, chainId, account } = useWeb3React();
  const isNFT = useIsNFTGame();
  return useMutation(async ({ data, id }: { data: any; id: string }) => {
    if (!chainId || !account || !provider) {
      return;
    }

    const signedData = await signUpdate(provider, chainId);

    await remove(
      signedData.sig,
      signedData.messageSigned,
      data,
      isNFT ? RoomType.NFT : RoomType.Stable,
      id,
      account
    );
  });
};

export const useGameMetadata = (id: string) => {
  const isNFT = useIsNFTGame();
  const { chainId } = useLeaguesChainInfo();
  return useQuery(['GET_GAME_METADATA', id, chainId], () => {
    return getGameMetadata(id, isNFT ? RoomType.NFT : RoomType.Stable, chainId);
  });
};

export const useGamesMetadata = (ids?: string) => {
  const isNFT = useIsNFTGame();
  const { chainId } = useLeaguesChainInfo();
  return useQuery(['GET_GAMES_METADATA', ids, chainId], () => {
    if (!ids) {
      return;
    }
    return getGamesMetadata(
      ids,
      isNFT ? RoomType.NFT : RoomType.Stable,
      chainId
    );
  });
};
