import { ChainId } from '@/modules/common/constants/enums';
import axios from 'axios';
import { BigNumber, providers } from 'ethers';
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
  provider: providers.BaseProvider,
  factoryAddress: string,
  id: string
) {
  const contract = await getCoinLeagueV3Contract({ address: factoryAddress, provider });

  let game: Game = await contract.games(id);

  let players = await contract.getPlayers(id);

  let gamePlayers: any[] = [];

  const coinFeeds: { [key: string]: CoinLeagueGameCoinFeed } = {};

  for (let [index, p] of players.entries()) {
    const feeds = await contract.playerCoinFeeds(index, id);

    for (let feed of feeds) {
      if (!coinFeeds[feed]) {
        const coin = await contract.coins(id, feed);

        coinFeeds[feed] = {
          address: coin.coin_feed,
          end_price: coin.end_price.toString(),
          start_price: coin.start_price.toString(),
          score: coin.score.toString(),
        };
      }
    }

    if (!coinFeeds[p.captain_coin]) {
      const captainCoin = await contract.coins(id, p.captain_coin);

      coinFeeds[p.captain_coin] = {
        address: captainCoin.coin_feed,
        end_price: captainCoin.end_price.toString(),
        start_price: captainCoin.start_price.toString(),
        score: captainCoin.score.toString(),
      };
    }



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
  provider: providers.BaseProvider,
  factoryAddress: string,
  tokenAddress: string
) {
  const contract = await getCoinLeagueV3Contract({ address: factoryAddress, provider });

  return await contract.getPriceFeed(tokenAddress);
}

export async function getPlayersScoreGame({ game, factoryAddress, provider }: { game: CoinLeagueGame, factoryAddress: string, provider: providers.BaseProvider }) {
  const coinFeeds = game.coinFeeds;
  const coinCurrentPrices: { coin: string, currentPrice: number }[] = [];

  const playersScores: { score: number, address: string }[] = [];

  for (let player of game.players) {
    const playerCoinPriceFeeds: { captainCoin: { address: string, currentPrice: number }, coinFeeds: { address: string, currentPrice: number }[] } = { captainCoin: { address: '0x', currentPrice: 0 }, coinFeeds: [] };

    const index = coinCurrentPrices.findIndex((val) => val.coin === player.captain_coin);


    if (index !== -1) {
      playerCoinPriceFeeds.captainCoin = { address: player.captain_coin, currentPrice: coinCurrentPrices[index].currentPrice };

    } else {
      const captainCoinPrice = await getCurrentCoinPrice(provider, factoryAddress, player.captain_coin) as BigNumber;
      playerCoinPriceFeeds.captainCoin = { address: player.captain_coin, currentPrice: captainCoinPrice.toNumber() };
      coinCurrentPrices.push({
        currentPrice: captainCoinPrice.toNumber(),
        coin: player.captain_coin
      })
    }


    if (player?.coin_feeds) {
      for (let playerCoin of player?.coin_feeds) {
        const index = coinCurrentPrices.findIndex((val) => val.coin === playerCoin);
        if (index !== -1) {

          playerCoinPriceFeeds.coinFeeds.push({ address: playerCoin, currentPrice: coinCurrentPrices[index].currentPrice });
        } else {
          const coinPrice = await getCurrentCoinPrice(provider, factoryAddress, playerCoin) as BigNumber;
          playerCoinPriceFeeds.coinFeeds.push({ address: playerCoin, currentPrice: coinPrice.toNumber() });
          coinCurrentPrices.push({
            currentPrice: coinPrice.toNumber(),
            coin: playerCoin
          })
        }
      }
    }
    // Calculate captain score
    const captainCoin = playerCoinPriceFeeds.captainCoin;
    const coinCaptainFeed = coinFeeds[playerCoinPriceFeeds.captainCoin.address];
    let captainCoinScore = ((captainCoin.currentPrice - Number(coinCaptainFeed.start_price)) * 100000) / captainCoin.currentPrice;

    if (game.game_type === 0) {
      if (captainCoinScore >= 0) {
        captainCoinScore = captainCoinScore * 1.2;
      }

    } else {
      if (captainCoinScore <= 0) {
        captainCoinScore = captainCoinScore * 1.2;
      }
    }


    let coinsScore = 0;

    for (const playerCoinFeed of playerCoinPriceFeeds.coinFeeds) {
      const coinFeed = coinFeeds[playerCoinFeed.address];
      const end_price = playerCoinFeed.currentPrice;
      const score = ((end_price - Number(coinFeed.start_price)) * 100000) / end_price;
      coinsScore = coinsScore + score;
    }

    const playerScore = coinsScore + captainCoinScore;


    playersScores.push({ score: playerScore, address: player.player_address });
  }


  const gameType = game.game_type - 1;


  const playerScoreSorted = playersScores.sort((a: { score: number }, b: { score: number }) => {
    const x = gameType ? a.score : b.score;
    const y = gameType ? b.score : a.score;

    if (x > y) {
      return -1;
    }

    if (x < y) {
      return 1;
    }

    return 0;
  });

  for (const feed of coinCurrentPrices) {
    coinFeeds[feed.coin].end_price = feed.currentPrice.toString();
    const end_price = feed.currentPrice;
    const start_price = Number(coinFeeds[feed.coin].start_price);

    coinFeeds[feed.coin].score = String(((end_price - start_price) * 100000) / end_price);
  }
  console.log(coinFeeds);

  return { playerScoreSorted, coinFeeds };

}



export async function claimGame({ signer, provider, factoryAddress, account, id }: {
  signer: providers.JsonRpcSigner,
  provider: providers.Web3Provider,
  factoryAddress: string,
  account?: string,
  id?: string
}) {
  const contract = await getCoinLeagueV3Contract({
    address: factoryAddress,
    signer,
    useSigner: true,
    provider

  });

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
