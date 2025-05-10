import { ChainId } from '@/modules/common/constants/enums';
import { BigNumber } from 'ethers';
import {
  GameDuration,
  GameLevel,
  GameOrderBy,
  GameStakeAmount,
  GameType,
  NumberOfPLayers,
} from '../constants/enums';

export interface CoinFeed {
  base: string;
  baseName: string;
  quote: string;
  address: string;
  logo: string;
}

export interface GameGraph {
  id: string;
  intId: string;
  type: string;
  status: string;
  duration: string;
  numCoins: string;
  startsAt: string;
  numPlayers: string;
  currentPlayers: string;
  entry: string;
  coinToPlay: string;
  startedAt?: string;
  endedAt?: string;
  title?: string;
  description?: string;
  smallDescription?: string;
  creator?: string;
}

export enum ChampionsEventRound {
  FIRST,
  SECOND,
  THIRD,
}

export interface PlayerGraph {
  id: string;
  totalWinnedGames: string;
  totalJoinedGames: string;
  totalFirstWinnedGames: string;
  totalThirdWinnedGames: string;
  totalSecondWinnedGames: string;
  totalEarned: string;
  EarnedMinusSpent: string;
}

export interface ChampionMetadata {
  image: string;
  description: string;
  name: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
}

export interface ChampionMetaItem {
  id: string;
  image: string;
  name: string;
  rarity: number;
}

export interface CoinLeaguesChampion {
  id: string;
  name: string;
  rarity?: number;
  description: string;
  image?: string;
  attack: number;
  defense: number;
  run: number;
}

export interface GameMetadata {
  gameId: string;
  title: string;
  smallDescription: string;
  description: string;
  creator: string;
}

export interface GameProfile {
  id: string;
  address: string;
  username: string;
  profileImage: string;
  coverImage: string;
  tokenAddress: string;
  tokenId: string;
  chainId: ChainId;
}

export interface MultiplierInterface {
  playerAddress: string;
  kitBalance: BigNumber;
  isHoldingMultiplier: boolean;
  isHoldingKitMultiplier: boolean;
  championsMultiplier: number;
  rarity: BigNumber;
  championId: BigNumber;
  isChampionsMultiplier: boolean;
}

export interface ProfileStats {
  totalWinnedGames: string;
  totalFirstWinnedGames: string;
  totalSecondWinnedGames: string;
  totalThirdWinnedGames: string;
  totalJoinedGames: string;
  totalEarned: string;
  totalSpent: string;
}

export enum CoinLeagueGames {
  CoinLeague,
  CoinLeagueNFT,
  SquidGame,
  NFTLeague,
}

export interface ProfileContextState {
  profiles: GameProfile[];
}

export interface Game {
  players: Player[];
  coinFeeds?: CoinFeed[];
  game_type: GameType;
  started: boolean;
  finished: boolean;
  aborted: boolean;
  scores_done: boolean;
  duration: BigNumber;
  id: BigNumber;
  num_players: BigNumber;
  coin_to_play: string;
  amount_to_play: BigNumber;
  total_amount_collected: BigNumber;
  num_coins: BigNumber;
  start_timestamp: BigNumber;
  abort_timestamp: BigNumber;
  address: string;
}

export interface CoinLeagueGameCoinFeed {
  address: string;
  start_price: string;
  end_price: string;
  score: string;
}

export interface CoinLeagueGamePlayer {
  score: string;
  player_address: string;
  captain_coin: string;
  champion_id: string;
  affiliate?: string;
  coin_feeds?: string[];
}

export interface CoinLeagueGame {
  players: CoinLeagueGamePlayer[];
  coinFeeds: { [key: string]: CoinLeagueGameCoinFeed };
  game_type: GameType;
  started: boolean;
  finished: boolean;
  aborted: boolean;
  scores_done: boolean;
  duration: number;
  id: number;
  num_players: number;
  coin_to_play: string;
  amount_to_play: string;
  total_amount_collected: string;
  num_coins: number;
  start_timestamp: number;
  abort_timestamp: number;
  address: string;
}

export interface Player {
  score: BigNumber;
  player_address: string;
  captain_coin: string;
  champion_id: string;
  affiliate?: string;
  coin_feeds?: CoinFeed[];
}

export interface CoinFeed {
  address: string;
  start_price: BigNumber;
  end_price: BigNumber;
  score: BigNumber;
}

export interface GameFiltersState {
  numberOfPlayers: NumberOfPLayers;
  setNumberOfPlayers: (value: NumberOfPLayers) => void;
  stakeAmount: GameStakeAmount;
  setStakeAmount: (value: GameStakeAmount) => void;
  gameLevel: GameLevel;
  setGameLevel: (value: GameLevel) => void;
  gameType: GameType;
  setGameType: (value: GameType) => void;
  setDuration: (value: GameDuration) => void;
  duration: GameDuration;
  setIsBitboy: (value: boolean) => void;
  isBitboy: boolean;
  setIsMyGames: (value: boolean) => void;
  isMyGames: boolean;
  setIsJackpot: (value: boolean) => void;
  isJackpot: boolean;
  setOrderByGame: (value: GameOrderBy) => void;
  orderByGame: GameOrderBy;
  reset(): void;
  isModified(): boolean;
}

export interface GameParamsV3 {
  numPlayers: number;
  duration: number;
  amountUnit: BigNumber;
  numCoins: number;
  abortTimestamp: number;
  startTimestamp: number;
  type: number;
  coin_to_play: string;
  championRoom?: number;
  isNFT: boolean;
}

export interface GamesFilter {
  numberOfPlayers: NumberOfPLayers;
  stakeAmount: GameStakeAmount;
  gameLevel: GameLevel;
  gameType: number;
  duration: GameDuration;
  isBitboy: boolean;
  isMyGames: boolean;
  isJackpot: boolean;
  orderByGame: GameOrderBy;
}

export interface Coin {
  address: string;
  logo: string;
  base: string;
  baseName: string;
  quote: string;
  tv?: string;
}

export interface CoinLeagueAffiliateEntry {
  id: string;
  type: string;
  status: string;
  createdAt: string;
  game: {
    intId: number;
    coinToPlay: string;
  };
  player: {
    id: string;
  };
}
