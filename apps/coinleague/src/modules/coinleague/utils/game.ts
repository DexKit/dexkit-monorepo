import { ZEROEX_NATIVE_TOKEN_ADDRESS } from '@/modules/common/constants';
import { ChainId } from '@/modules/common/constants/enums';
import { BigNumber, ethers } from 'ethers';
import { gql } from 'graphql-request';
import {
  CoinToPlay,
  CoinToPlayInterface,
  CREATOR_LABELS,
  GAME_ABORTED,
  GAME_ENDED,
  GAME_STARTED,
  GAME_WAITING,
  NativeCoinAddress,
  PriceFeeds,
} from '../constants';
import { GameDuration, GameLevel, GameOrderBy } from '../constants/enums';
import { CoinLeagueGame } from '../types';

export const GET_GAME_LEVEL = (
  entry: BigNumber,
  chainId = ChainId.Polygon,
  coinToPlayAddress?: string
) => {
  const coinToPlay = CoinToPlay[chainId]?.find(
    (c) => c.address.toLowerCase() === coinToPlayAddress?.toLowerCase()
  );
  if (
    coinToPlay &&
    coinToPlay.address.toLowerCase() !== NativeCoinAddress.toLowerCase()
  ) {
    if (entry.lt(ethers.utils.parseUnits('2', coinToPlay.decimals))) {
      return 'Beginner';
    } else if (entry.lt(ethers.utils.parseUnits('11', coinToPlay.decimals))) {
      return 'Intermediate';
    } else if (entry.lt(ethers.utils.parseUnits('50', coinToPlay.decimals))) {
      return 'Advanced';
    } else if (entry.lt(ethers.utils.parseUnits('110', coinToPlay.decimals))) {
      return 'Expert';
    } else if (entry.lt(ethers.utils.parseUnits('270', coinToPlay.decimals))) {
      return 'Master';
    } else {
      return 'Grand Master';
    }
  }

  if (chainId === ChainId.BSC) {
    if (entry.lt(ethers.utils.parseEther('0.02'))) {
      return 'Beginner';
    } else if (entry.lt(ethers.utils.parseEther('0.05'))) {
      return 'Intermediate';
    } else if (entry.lt(ethers.utils.parseEther('0.1'))) {
      return 'Advanced';
    } else if (entry.lt(ethers.utils.parseEther('0.3'))) {
      return 'Expert';
    } else if (entry.lt(ethers.utils.parseEther('1'))) {
      return 'Master';
    } else {
      return 'Grand Master';
    }
  }

  if (entry.lt(ethers.utils.parseEther('5'))) {
    return 'Beginner';
  } else if (entry.lt(ethers.utils.parseEther('10'))) {
    return 'Intermediate';
  } else if (entry.lt(ethers.utils.parseEther('50'))) {
    return 'Advanced';
  } else if (entry.lt(ethers.utils.parseEther('100'))) {
    return 'Expert';
  } else if (entry.lt(ethers.utils.parseEther('500'))) {
    return 'Master';
  } else {
    return 'Grand Master';
  }
};

export const GET_GAME_LEVEL_AMOUNTS = (
  gameLevel: GameLevel,
  chainId = ChainId.Polygon,
  coinToPlayAddress?: string
) => {
  const coinToPlay = CoinToPlay[chainId]?.find(
    (c) => c.address.toLowerCase() === coinToPlayAddress?.toLowerCase()
  ) as CoinToPlayInterface;
  const isStable =
    coinToPlay &&
    coinToPlay.address.toLowerCase() !==
      ZEROEX_NATIVE_TOKEN_ADDRESS.toLowerCase();
  switch (gameLevel) {
    case GameLevel.Beginner:
      if (isStable) {
        return ethers.utils.parseUnits('1', coinToPlay.decimals);
      }
      switch (chainId) {
        case ChainId.Polygon:
          return ethers.utils.parseEther('1');
        case ChainId.BSC:
          return ethers.utils.parseEther('0.01');
        default:
          return ethers.utils.parseEther('1');
      }

    case GameLevel.Intermediate:
      if (isStable) {
        return ethers.utils.parseUnits('10', coinToPlay.decimals);
      }
      switch (chainId) {
        case ChainId.Polygon:
          return ethers.utils.parseEther('5');
        case ChainId.BSC:
          return ethers.utils.parseEther('0.05');
        default:
          return ethers.utils.parseEther('5');
      }

    case GameLevel.Advanced:
      if (isStable) {
        return ethers.utils.parseUnits('25', coinToPlay.decimals);
      }
      switch (chainId) {
        case ChainId.Polygon:
          return ethers.utils.parseEther('10');
        case ChainId.BSC:
          return ethers.utils.parseEther('0.1');
        default:
          return ethers.utils.parseEther('10');
      }
    case GameLevel.Expert:
      if (isStable) {
        return ethers.utils.parseUnits('100', coinToPlay.decimals);
      }
      switch (chainId) {
        case ChainId.Polygon:
          return ethers.utils.parseEther('50');
        case ChainId.BSC:
          return ethers.utils.parseEther('0.3');
        default:
          return ethers.utils.parseEther('50');
      }
    case GameLevel.Master:
      if (isStable) {
        return ethers.utils.parseUnits('250', coinToPlay.decimals);
      }

      switch (chainId) {
        case ChainId.Polygon:
          return ethers.utils.parseEther('250');
        case ChainId.BSC:
          return ethers.utils.parseEther('1');
        default:
          return ethers.utils.parseEther('250');
      }
    case GameLevel.GrandMaster:
      if (isStable) {
        return ethers.utils.parseUnits('500', coinToPlay.decimals);
      }
      switch (chainId) {
        case ChainId.Polygon:
          return ethers.utils.parseEther('500');
        case ChainId.BSC:
          return ethers.utils.parseEther('2');
        default:
          return ethers.utils.parseEther('500');
      }
    default:
      return ethers.utils.parseEther('0');
  }
};

export const GET_DURATION_FROM_FILTER = (filter: GameDuration) => {
  switch (filter) {
    case GameDuration.ALL:
      return null;
    case GameDuration.FAST:
      return 60 * 60;
    case GameDuration.MEDIUM:
      return 4 * 60 * 60;
    case GameDuration.EIGHT:
      return 8 * 60 * 60;
    case GameDuration.DAY:
      return 24 * 60 * 60;
    case GameDuration.WEEK:
      return 7 * 24 * 60 * 60;
    case GameDuration.MONTH:
      return 30 * 7 * 24 * 60 * 60;
    default:
      return null;
  }
};

export const GET_GAME_ORDER_VARIABLES = (orderBy?: GameOrderBy) => {
  switch (orderBy) {
    case GameOrderBy.HighLevel:
      return { orderBy: 'entry', orderDirection: 'desc' };
    case GameOrderBy.LowLevel:
      return { orderBy: 'entry', orderDirection: 'asc' };
    case GameOrderBy.AboutStart:
      return { orderBy: 'startsAt', orderDirection: 'asc' };
    case GameOrderBy.MostFull:
      return { orderBy: 'currentPlayers', orderDirection: 'desc' };
    case GameOrderBy.MostEmpty:
      return { orderBy: 'currentPlayers', orderDirection: 'asc' };
    case GameOrderBy.HighDuration:
      return { orderBy: 'duration', orderDirection: 'desc' };
    case GameOrderBy.LowerDuration:
      return { orderBy: 'duration', orderDirection: 'asc' };
    case GameOrderBy.MoreCoins:
      return { orderBy: 'numCoins', orderDirection: 'desc' };
    case GameOrderBy.LessCoins:
      return { orderBy: 'numCoins', orderDirection: 'asc' };
    default:
      return { orderBy: 'entry', orderDirection: 'desc' };
  }
};

export function renderEarningsField(params: string) {
  return `earnings(where: {${params}}){
    place
    amount
    claimed 
  }`;
}

export function renderWithdrawsField(params: string) {
  return `withdraws(where: {${params}}){
    player{
      id
    }
    at
  }`;
}

export function getGamesQuery(params: any) {
  let queryVariableParams = [];
  let queryParams = [];
  let whereParams = [];
  let earningsWhere = [];
  let withdrawsWhere = [];

  if (params.skip) {
    queryVariableParams.push('$skip: Int');
    queryParams.push('skip: $skip');
  }

  if (params.first) {
    queryVariableParams.push('$first: Int');
    queryParams.push('first: $first');
  }

  if (params.status) {
    queryVariableParams.push('$status: String!');
    whereParams.push('status: $status');
  }

  if (params.duration) {
    queryVariableParams.push('$duration: Int');
    whereParams.push('duration: $duration');
  }

  if (params.numPlayers) {
    queryVariableParams.push('$numPlayers: BigInt!');
    whereParams.push('numPlayers: $numPlayers');
  }

  if (params.type) {
    queryVariableParams.push('$type: BigInt!');
    whereParams.push('type: $type');
  }

  if (params.orderDirection) {
    queryVariableParams.push('$orderDirection: String');
    queryParams.push('orderDirection: $orderDirection');
  }

  if (params.orderBy) {
    queryVariableParams.push('$orderBy: String');
    queryParams.push('orderBy: $orderBy');
  }

  if (params.entry) {
    queryVariableParams.push('$entry: String');
    whereParams.push('entry: $entry');
  }

  if (params.isBitboyTeam) {
    queryVariableParams.push('$isBitboyTeam: Boolean');
    whereParams.push('isBitboyTeam: $isBitboyTeam');
  }

  if (params.accounts) {
    queryVariableParams.push('$accounts: [String]');
    whereParams.push('playerAddresses_contains: $accounts');
  }

  if (params.player) {
    queryVariableParams.push('$player: String');
    earningsWhere.push('player_contains: $player');
    withdrawsWhere.push('player_contains: $player');
  }

  let paramsString = queryVariableParams.join(', ');

  let receiveParamsString = queryParams.join(', ');

  let whereParamsString = whereParams.join(', ');

  let earningsWhereString = earningsWhere.join(', ');

  let withdrawWhereString = withdrawsWhere.join(', ');

  let query = gql`
  query GetGames(${paramsString}) {
    games(where: {${whereParamsString}}, ${receiveParamsString}) {
        id
        intId
        type
        duration
        status
        numCoins
        numPlayers
        currentPlayers
        entry
        createdAt
        startedAt
        startsAt
        abortedAt
        coinToPlay
        endedAt
        ${earningsWhereString ? renderEarningsField(earningsWhereString) : ''}
        ${withdrawWhereString ? renderWithdrawsField(withdrawWhereString) : ''}
      }
  }
`;

  return query;
}

export const GET_CREATOR_LABELS = (address?: string) => {
  if (!address) {
    return false;
  }
  const creator = CREATOR_LABELS.find(
    (a) => a.address.toLowerCase() === address.toLowerCase()
  );
  if (creator) {
    return creator.label;
  }
};

export const getIconByCoin = (coin: string, chainId: ChainId) => {
  const feedLogo =
    PriceFeeds[chainId].find((c) => {
      return c.address.toLowerCase() === coin.toLowerCase();
    })?.logo || '';

  return feedLogo;
};

export function getGameStatus(game: CoinLeagueGame): string {
  if (game.finished) {
    return GAME_ENDED;
  } else if (game.started) {
    return GAME_STARTED;
  } else if (game.aborted) {
    return GAME_ABORTED;
  }
  return GAME_WAITING;
}

export function reduceAddress(address?: string) {
  if (address) {
    return address.substring(2, 8).toUpperCase();
  }

  return '';
}
