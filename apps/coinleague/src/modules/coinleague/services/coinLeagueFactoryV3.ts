import { getMulticall } from '@/modules/common/services/multicall';
import type { CallInput } from '@indexed-finance/multicall';
import { BigNumber, Contract, ContractTransaction, providers } from 'ethers';
import { Interface } from 'ethers/lib/utils';
import { COINLEAGUE_DEFAULT_AFFILIATE } from '../constants';

import coinLeagueFactoryAbi from '../constants/ABI/CoinLeagueFactoryV3.json';
import { Game, GameParamsV3 } from '../types';


export const getCoinLeagueV3Contract = async ({ address, provider, signer, useSigner }: {
  address: string,
  provider: providers.BaseProvider | providers.Web3Provider,
  signer?: providers.JsonRpcSigner,
  useSigner?: boolean
}) => {
  if (useSigner && signer) {
    return new Contract(
      address,
      coinLeagueFactoryAbi,
      signer
    );
  }

  return new Contract(address, coinLeagueFactoryAbi, provider);
};

export const createGame = async ({ address, params, provider, signer }: {
  address: string,
  params: GameParamsV3,
  provider: providers.Web3Provider,
  signer: providers.JsonRpcSigner,
}): Promise<ContractTransaction> => {
  return (await getCoinLeagueV3Contract({ address, provider, useSigner: true, signer })).createGame(
    params.numPlayers,
    params.duration,
    params.amountUnit,
    params.numCoins,
    params.abortTimestamp,
    params.startTimestamp,
    params.type,
    params.coin_to_play
  ) as Promise<ContractTransaction>;
};

export const joinGame = async ({ factoryAddress, feeds, captainCoin, provider, id, affiliate, signer }: {
  factoryAddress: string,
  feeds: string[],
  captainCoin: string,
  provider: providers.Web3Provider,
  signer?: providers.JsonRpcSigner,
  id: string,
  affiliate?: string
}) => {
  return (
    await getCoinLeagueV3Contract({ address: factoryAddress, provider, useSigner: true, signer })
  ).joinGameWithCaptainCoin(
    feeds,
    captainCoin,
    affiliate || COINLEAGUE_DEFAULT_AFFILIATE,
    id
  ) as Promise<ContractTransaction>;
};

export const endGame = async ({ factoryAddress, signer, id, provider }: {
  factoryAddress: string,
  provider: providers.Web3Provider,
  signer: providers.JsonRpcSigner,
  id: string
}) => {
  return (await getCoinLeagueV3Contract({ address: factoryAddress, signer, provider, useSigner: true })).endGame(
    id
  ) as Promise<ContractTransaction>;
};

export const startGame = async ({ signer, provider, id, factoryAddress }: {
  factoryAddress: string,
  signer?: providers.JsonRpcSigner,
  provider: providers.Web3Provider,
  id: string
}) => {
  return (
    await getCoinLeagueV3Contract({ address: factoryAddress, signer, provider, useSigner: true })
  ).startGame(id) as Promise<ContractTransaction>;
};

/**
 * return all games data at once from chain
 * @param games
 */
export const getGamesData = async (
  ids: string[],
  address: string,
  provider: providers.JsonRpcProvider
): Promise<Game[]> => {
  try {
    const iface = new Interface(coinLeagueFactoryAbi);
    const multicall = await getMulticall(provider);
    const calls: CallInput[] = [];
    const games: Game[] = [];
    for (let index = 0; index < ids.length; index++) {
      const id = ids[index];
      calls.push({
        interface: iface,
        target: address,
        function: 'games',
        args: [id],
      });
      calls.push({
        interface: iface,
        target: address,
        function: 'getPlayers',
        args: [id],
      });
    }
    const response = await multicall.multiCall(calls);
    const [, results] = response;
    for (let index = 0; index < results.length; index += 2) {
      const g = results[index];
      const players = results[index + 1];
      games.push({
        players: players,
        ...g,
      });
    }
    return games;
  } catch (e) {
    return [];
  }
};

export const getWinner = async (
  gameAddress: string,
  account: string,
  id: string,
  provider: providers.Web3Provider
): Promise<{
  claimed: boolean;
  place: number;
  score: BigNumber;
  winner_address: string;
}> => {
  return (await getCoinLeagueV3Contract({ address: gameAddress, provider })).winners(
    id,
    account
  );
};

export const getTotalGames = async ({ factoryAddress, provider }: {
  factoryAddress: string,
  provider: providers.Web3Provider
}) => {
  return (await getCoinLeagueV3Contract({ address: factoryAddress, provider })).totalGames(

  ) as Promise<BigNumber>;
};