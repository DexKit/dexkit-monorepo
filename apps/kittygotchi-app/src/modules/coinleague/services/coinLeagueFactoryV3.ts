import { getMulticall } from '@/modules/common/services/multicall';
import { CallInput } from '@indexed-finance/multicall';
import { BigNumber, ContractTransaction, ethers } from 'ethers';
import { Interface } from 'ethers/lib/utils';
import { COINLEAGUE_DEFAULT_AFFILIATE } from '../constants';

import coinLeagueFactoryAbi from '../constants/ABI/CoinLeagueFactoryV3.json';
import { Game, GameParamsV3 } from '../types';

export const getCoinLeagueV3Contract = async (
  address: string,
  provider: ethers.providers.BaseProvider | ethers.providers.Web3Provider,
  useSigner?: boolean
) => {
  if (useSigner && provider instanceof ethers.providers.Web3Provider) {
    return new ethers.Contract(
      address,
      coinLeagueFactoryAbi,
      provider.getSigner()
    );
  }

  return new ethers.Contract(address, coinLeagueFactoryAbi, provider);
};

export const createGame = async (
  address: string,
  params: GameParamsV3,
  provider: ethers.providers.Web3Provider
): Promise<ContractTransaction> => {
  return (await getCoinLeagueV3Contract(address, provider, true)).createGame(
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

export const joinGame = async (
  factoryAddress: string,
  feeds: string[],
  captainCoin: string,
  provider: ethers.providers.Web3Provider,
  id: string,
  affiliate?: string
) => {
  return (
    await getCoinLeagueV3Contract(factoryAddress, provider, true)
  ).joinGameWithCaptainCoin(
    feeds,
    captainCoin,
    affiliate || COINLEAGUE_DEFAULT_AFFILIATE,
    id
  ) as Promise<ContractTransaction>;
};

export const endGame = async (
  factoryAddress: string,
  provider: ethers.providers.Web3Provider,
  id: string
) => {
  return (await getCoinLeagueV3Contract(factoryAddress, provider)).endGame(
    id
  ) as Promise<ContractTransaction>;
};

export const startGame = async (
  factoryAddress: string,
  provider: ethers.providers.Web3Provider,
  id: string
) => {
  return (
    await getCoinLeagueV3Contract(factoryAddress, provider, true)
  ).startGame(id) as Promise<ContractTransaction>;
};

/**
 * return all games data at once from chain
 * @param games
 */
export const getGamesData = async (
  ids: string[],
  address: string,
  provider: ethers.providers.JsonRpcProvider
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
  provider: ethers.providers.Web3Provider
): Promise<{
  claimed: boolean;
  place: number;
  score: BigNumber;
  winner_address: string;
}> => {
  return (await getCoinLeagueV3Contract(gameAddress, provider)).winners(
    id,
    account
  );
};
