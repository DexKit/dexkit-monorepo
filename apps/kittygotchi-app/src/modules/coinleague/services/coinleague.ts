import { ChainId } from '@/modules/common/constants/enums';
import axios from 'axios';
import { ethers } from 'ethers';
import request from 'graphql-request';
import { GET_GAME_QUERY } from '../constants/queries';
import {
  ChampionMetadata,
  CoinLeagueGame,
  CoinLeagueGameCoinFeed,
  Game,
  GameGraph,
} from '../types';
import { getCoinLeagueV3Contract } from './coinLeagueFactoryV3';
import { getGraphEndpoint } from './graphql';

export const getCoinLeagueGame = async (chainId: ChainId, id: number) => {
  return (
    await request<{ game: GameGraph }>(
      getGraphEndpoint(false, chainId),
      GET_GAME_QUERY,
      {
        id,
      }
    )
  ).game;
};

export async function getCoinLeagueGameOnChain(
  provider: ethers.providers.BaseProvider,
  factoryAddress: string,
  id: string
) {
  const contract = await getCoinLeagueV3Contract(factoryAddress, provider);

  let game: Game = await contract.games(id);

  let players = await contract.getPlayers(id);

  let gamePlayers: any[] = [];

  const coinFeeds: { [key: string]: CoinLeagueGameCoinFeed } = {};

  for (let [index, p] of players.entries()) {
    const feeds = await contract.playerCoinFeeds(index, id);

    for (let feed of feeds) {
      const coin = await contract.coins(id, feed);

      coinFeeds[feed] = {
        address: coin.coin_feed,
        end_price: coin.end_price.toString(),
        start_price: coin.start_price.toString(),
        score: coin.score.toString(),
      };
    }

    const captainCoin = await contract.coins(id, p.captain_coin);

    coinFeeds[p.captain_coin] = {
      address: captainCoin.coin_feed,
      end_price: captainCoin.end_price.toString(),
      start_price: captainCoin.start_price.toString(),
      score: captainCoin.score.toString(),
    };

    gamePlayers.push({
      captain_coin: p.captain_coin,
      score: p.score.toString(),
      champion_id: p.champion_id || '',
      player_address: p.player_address,
      affiliate: p.affiliate,
      coin_feeds: feeds,
    });
  }

  if (game) {
    const newGame: CoinLeagueGame = {
      abort_timestamp: game.abort_timestamp.toNumber(),
      aborted: game.aborted,
      address: game.address || '',
      duration: game.duration.toNumber(),
      amount_to_play: game.amount_to_play.toString(),
      coin_to_play: game.coin_to_play,
      finished: game.finished,
      game_type: game.game_type,
      id: game.id.toNumber(),
      num_coins: game.num_coins.toNumber(),
      num_players: game.num_players.toNumber(),
      scores_done: game.scores_done,
      players: gamePlayers,
      start_timestamp: game.start_timestamp.toNumber(),
      started: game.started,
      coinFeeds: coinFeeds,
      total_amount_collected: game.total_amount_collected.toString(),
    };

    return newGame;
  }
}

export async function getCurrentCoinPrice(
  provider: ethers.providers.BaseProvider,
  factoryAddress: string,
  tokenAddress: string
) {
  const contract = await getCoinLeagueV3Contract(factoryAddress, provider);

  return await contract.getPriceFeed(tokenAddress);
}

export async function claimGame(
  provider: ethers.providers.BaseProvider,
  factoryAddress: string,
  account?: string,
  id?: string
) {
  const contract = await getCoinLeagueV3Contract(
    factoryAddress,
    provider,
    true
  );

  return await contract.claim(account, id);
}

export const getChampionApiEndpoint = (chainId?: number) => {
  if (!chainId) {
    return undefined;
  }

  if (chainId === ChainId.Polygon) {
    return `https://coinleaguechampions.dexkit.com/api`;
  }

  if (chainId === ChainId.Mumbai) {
    return `https://coinleaguechampions-mumbai.dexkit.com/api`;
  }

  if (chainId === ChainId.BSC) {
    return `https://coinleaguechampions-bsc.dexkit.com/api`;
  }
};

export const getChampionMetadata = (tokenId: string, chainId?: number) => {
  return axios
    .get<ChampionMetadata>(`${getChampionApiEndpoint(chainId)}/${tokenId}`)
    .then((response: any) => response.data);
};
