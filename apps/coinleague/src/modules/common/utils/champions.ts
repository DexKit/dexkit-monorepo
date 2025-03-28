import { ChampionsEventRound } from '@/modules/coinleague/types';
import { ethers } from 'ethers';
import {
  CHAMPIONS,
  EARLY_ACCESS_BITT_AMOUNT,
  EARLY_ACCESS_KIT_AMOUNT,
  EVENT_HOLDING_AMOUNT,
  FIRST_ROUND_DATE,
  SALE_EARLY_FIRST_ROUND_DATE,
  SALE_EARLY_SECOND_ROUND_DATE,
  SALE_EARLY_THIRD_ROUND_DATE,
  SECOND_ROUND_DATE,
  THIRD_ROUND_DATE,
} from '../constants/champions';
import { ChainId } from '../constants/enums';

export function getEventCurrentRound(): ChampionsEventRound {
  return ChampionsEventRound.FIRST;
}

export function getEventAccessDate(
  round: ChampionsEventRound,
  offset = 0,
  chainId?: number
): number {
  let currChain = chainId ? chainId : ChainId.Polygon;

  if (chainId !== ChainId.Polygon && chainId !== ChainId.Mumbai) {
    currChain = ChainId.Polygon;
  }

  if (round === ChampionsEventRound.FIRST) {
    return FIRST_ROUND_DATE[currChain] - offset;
  }

  if (round === ChampionsEventRound.SECOND) {
    return SECOND_ROUND_DATE[currChain] - offset;
  }

  if (round === ChampionsEventRound.THIRD) {
    return THIRD_ROUND_DATE[currChain] - offset;
  }

  return 0;
}

export function getMaxSupplyForRound(round: ChampionsEventRound): number {
  if (round === ChampionsEventRound.FIRST) {
    return 3300 + 1000;
  } else if (round === ChampionsEventRound.SECOND) {
    return 3300;
  } else if (round === ChampionsEventRound.THIRD) {
    return 3400;
  }

  return 0;
}

export function getEventEarlyAccessDate(
  round: ChampionsEventRound,
  offset = 0,
  chainId?: number
): number {
  if (chainId && IS_CHAMPIONS_SUPPORTED_NETWORK(chainId)) {
    if (round === ChampionsEventRound.FIRST) {
      return SALE_EARLY_FIRST_ROUND_DATE[chainId] - offset;
    }

    if (round === ChampionsEventRound.SECOND) {
      return SALE_EARLY_SECOND_ROUND_DATE[chainId] - offset;
    }

    if (round === ChampionsEventRound.THIRD) {
      return SALE_EARLY_THIRD_ROUND_DATE[chainId] - offset;
    }
  }

  return 0;
}

// mudar para uma variavel.
export function getEventHoldingAmount(
  chainId?: number
): ethers.BigNumber | undefined {
  if (chainId && IS_CHAMPIONS_SUPPORTED_NETWORK(chainId)) {
    return EVENT_HOLDING_AMOUNT[chainId];
  }
  return ethers.BigNumber.from(0);
}

export function GET_EVENT_HOLDING_AMOUNT(chanId?: number): number | string {
  const amount = getEventHoldingAmount(chanId);

  if (amount) {
    return ethers.utils.formatUnits(amount, 18);
  }

  return 0;
}

export function GET_EARLY_ACCESS_KIT_AMOUNT(chainId?: number): number {
  if (chainId) {
    if (IS_CHAMPIONS_SUPPORTED_NETWORK(chainId)) {
      return EARLY_ACCESS_KIT_AMOUNT[chainId];
    }
  }

  return EARLY_ACCESS_KIT_AMOUNT[ChainId.Polygon];
}

export function GET_EARLY_ACCESS_BITT_AMOUNT(chainId?: number): number {
  if (chainId) {
    if (IS_CHAMPIONS_SUPPORTED_NETWORK(chainId)) {
      return EARLY_ACCESS_BITT_AMOUNT[chainId];
    }
  }

  return EARLY_ACCESS_BITT_AMOUNT[ChainId.Polygon];
}

export const getChampionsMultiplier = (rarityBN: ethers.BigNumber) => {
  const rarity = rarityBN.toNumber();
  switch (rarity) {
    case 0:
      return 1.7;
    case 1:
      return 1.65;
    case 2:
      return 1.6;
    case 3:
      return 1.55;
    case 4:
      return 1.5;
    case 5:
      return 1.45;
    case 6:
      return 1.4;
    case 7:
      return 1.35;

    default:
      return 1;
  }
};

export const isChampionsFromRarity = (rarityBN: ethers.BigNumber) => {
  const rarity = rarityBN.toNumber();
  switch (rarity) {
    case 0:
      return true;
    case 1:
      return true;
    case 2:
      return true;
    case 3:
      return true;
    case 4:
      return true;
    case 5:
      return true;
    case 6:
      return true;
    case 7:
      return true;
    default:
      return false;
  }
};

export const getChampionsCoinSymbol = (rarityBN: ethers.BigNumber) => {
  const rarity = rarityBN.toNumber();
  switch (rarity) {
    case 0:
      return 'BITT';
    case 1:
      return 'BTC';
    case 2:
      return 'ETH';
    case 3:
      return 'LINK';
    case 4:
      return 'DOT';
    case 5:
      return 'UNI';
    case 6:
      return 'ADA';
    case 7:
      return 'DOGE';

    default:
      return 'DOGE';
  }
};

export const getRarityFromBodyType = (body?: string) => {
  switch (body) {
    case 'Bittoken':
      return 0;
    case 'Bitcoin':
      return 1;
    case 'Ethereum':
      return 2;
    case 'ChainLink':
      return 3;
    case 'Polkadot':
      return 4;
    case 'Uniswap':
      return 5;
    case 'Cardano':
      return 6;
    case 'Doge':
      return 7;

    default:
      return undefined;
  }
};

export function IS_CHAMPIONS_SUPPORTED_NETWORK(chainId?: number) {
  if (chainId) {
    return (
      chainId === ChainId.Polygon ||
      chainId === ChainId.Mumbai ||
      chainId === ChainId.BSC
    );
  }

  return false;
}

export function GET_CHAMPIONS_CONTRACT_ADDR(chainId?: number) {
  if (chainId) {
    if (IS_CHAMPIONS_SUPPORTED_NETWORK(chainId)) {
      return CHAMPIONS[chainId as ChainId];
    }
  }

  return undefined;
}

export function IS_CHAMPIONS_NETWORK_ENABLED(chainId?: number): boolean {
  if (!chainId) {
    return false;
  }

  if (chainId === ChainId.BSC || chainId === ChainId.Polygon) {
    return false;
  }

  if (chainId === ChainId.Mumbai) {
    return true;
  }

  return false;
}
