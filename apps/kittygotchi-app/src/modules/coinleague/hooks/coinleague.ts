import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from '@tanstack/react-query';

import {
  CoinLeagueGameStatus,
  GameDuration,
  GameLevel,
  GameOrderBy,
  GameStakeAmount,
  GameType,
  NumberOfPLayers,
} from '../constants/enums';

import { ApolloClient, gql, InMemoryCache } from '@apollo/client';

import { ChainId } from '@/modules/common/constants/enums';
import { isAddressEqual } from '@/modules/common/utils';
import { getRarityFromBodyType } from '@/modules/common/utils/champions';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { request } from 'graphql-request';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { CoinToPlay, StableCoinToPlay } from '../constants';
import {
  claimGame,
  getChampionMetadata,
  getCoinLeagueGame,
  getCoinLeagueGameOnChain,
  getCurrentCoinPrice,
} from '../services/coinleague';
import {
  createGame,
  getGamesData,
  getWinner,
  joinGame,
  startGame,
} from '../services/coinLeagueFactoryV3';
import { getGraphEndpoint } from '../services/graphql';
import { getProfiles } from '../services/profileApi';
import {
  ChampionMetadata,
  CoinLeagueGame,
  CoinLeaguesChampion,
  GameFiltersState,
  GameGraph,
  GameParamsV3,
  ProfileContextState,
} from '../types';
import {
  getGamesQuery,
  GET_DURATION_FROM_FILTER,
  GET_GAME_LEVEL_AMOUNTS,
  GET_GAME_ORDER_VARIABLES,
} from '../utils/game';
import { getNetworkProvider } from '../utils/network';
import { useLeaguesChainInfo } from './chain';
import { useFactoryAddress } from './coinleagueFactory';
import { useIsNFTGame } from './nft';

interface GamesFilterParams {
  accounts?: string[];
  filters?: GameFiltersState;
}

export interface CoinLeagueGamesParams extends GamesFilterParams {
  status: string;
  first?: number;
  skip?: number;
  player?: string;
}

export const useCoinLeagueGames = (
  params: CoinLeagueGamesParams,
  isNFT = false
) => {
  const { chainId } = useLeaguesChainInfo();

  const { accounts, filters, status, first, skip, player } = params;
  const isNFTGame = useIsNFTGame() || isNFT;

  var variables: any = {};

  if (status) {
    if (status !== CoinLeagueGameStatus.All) {
      variables.status = status;
    }
  }

  if (skip) {
    variables.skip = skip;
  }

  if (first) {
    variables.first = first;
  } else {
    variables.first = 100;
  }

  const order = GET_GAME_ORDER_VARIABLES(filters?.orderByGame);

  variables.orderBy = order.orderBy;
  variables.orderDirection = order.orderDirection;

  if (filters?.duration !== GameDuration.ALL) {
    variables.duration = GET_DURATION_FROM_FILTER(
      filters?.duration || GameDuration.ALL
    );
  }

  if (filters?.gameLevel !== GameLevel.All) {
    let entryAmount = GET_GAME_LEVEL_AMOUNTS(
      filters?.gameLevel || GameLevel.All,
      chainId
    ).toString();

    variables.entry = entryAmount;
  }

  if (filters?.numberOfPlayers !== NumberOfPLayers.ALL) {
    variables.numPlayers = filters?.numberOfPlayers;
  }

  if (filters?.gameType !== GameType.ALL) {
    if (filters?.gameType === GameType.Bull) {
      variables.type = 'Bull';
    } else if (filters?.gameType === GameType.Bear) {
      variables.type = 'Bear';
    }
  }

  if (filters?.isMyGames) {
    variables.accounts = accounts?.map((a) => a.toLowerCase());
  } else if (filters?.isBitboy) {
    variables.isBitboyTeam = true;
  }

  if (player) {
    variables.player = player.toLowerCase();
  }

  let gqlQuery = getGamesQuery(variables);

  return useQuery<GameGraph[]>(
    [gqlQuery, variables, isNFTGame, chainId],
    async () => {
      const { games } = await request(
        getGraphEndpoint(isNFTGame, chainId),
        gqlQuery,
        variables
      );
      return games;
    }
  );
};

export const USE_COINLEAGUE_GAME = 'USE_COINLEAGUE_GAME';

export function useCoinLeagueGameQuery({
  id,
  chainId,
  options,
}: {
  chainId?: ChainId;
  id: number;
  options?: any;
}) {
  return useQuery(
    [USE_COINLEAGUE_GAME, chainId, id],
    async () => {
      if (!chainId) {
        return;
      }

      return await getCoinLeagueGame(chainId, id);
    },
    { refetchOnMount: false, ...options }
  );
}

export const useCoinToPlay = (chainId?: ChainId, address?: string) => {
  if (!address || !chainId) {
    return;
  }

  return CoinToPlay[chainId]?.find((c) =>
    isAddressEqual(c.address.toLowerCase(), address.toLowerCase())
  );
};

export const useCoinToPlayStable = (chainId?: ChainId) => {
  if (!chainId) {
    return;
  }
  return StableCoinToPlay[chainId];
};

export const useMultipliers = () => {
  const { formatMessage } = useIntl();

  const multiplier = 1.2;
  const tooltipMessage = formatMessage({
    id: 'captain.coin.with.multiplier',
    defaultMessage: 'Captain coin with multiplier 1.2',
  });

  return {
    tooltipMessage,
    multiplier,
  };
};

export function useCoinleagueOnchainGame(id?: string) {
  const { chainId } = useLeaguesChainInfo();
  const provider = getNetworkProvider(chainId);
  const factoryAddress = useFactoryAddress();
  return useQuery(['GetGameAdddress', factoryAddress, id], () => {
    if (!factoryAddress || !provider || !id) {
      return;
    }
    return getGamesData([id], factoryAddress, provider);
  });
}

export function useCoinleagueWinner(id?: string) {
  const { account, provider } = useWeb3React();
  const factoryAddress = useFactoryAddress();
  return useQuery(['GET_WINNER', factoryAddress, account, id], () => {
    if (!factoryAddress || !account || !id || !provider) {
      return;
    }
    return getWinner(factoryAddress, account, id, provider).then((w) => {
      return {
        place: w.place,
        address: w.winner_address,
        score: w.score,
        claimed: w.claimed,
      };
    });
  });
}
export function useGamesFilters({
  myGames = false,
}: {
  myGames: boolean;
}): GameFiltersState {
  const [orderByGame, setOrderByGame] = useState(GameOrderBy.HighLevel);
  const [numberOfPlayers, setNumberOfPlayers] = useState<NumberOfPLayers>(
    NumberOfPLayers.ALL
  );
  const [stakeAmount, setStakeAmount] = useState<GameStakeAmount>(
    GameStakeAmount.ALL
  );
  const [gameLevel, setGameLevel] = useState<GameLevel>(GameLevel.All);
  const [gameType, setGameType] = useState<GameType>(GameType.ALL);
  const [duration, setDuration] = useState<GameDuration>(GameDuration.ALL);

  const [isBitboy, setIsBitboy] = useState(false);
  const [isJackpot, setIsJackpot] = useState(false);
  const [isMyGames, setIsMyGames] = useState(myGames);

  const reset = useCallback(() => {
    setOrderByGame(GameOrderBy.HighLevel);
    setNumberOfPlayers(NumberOfPLayers.ALL);
    setStakeAmount(GameStakeAmount.ALL);
    setGameLevel(GameLevel.All);
    setGameType(GameType.ALL);
    setDuration(GameDuration.ALL);
    setIsBitboy(false);
    setIsJackpot(false);
    setIsMyGames(false);
  }, []);

  const isModified = useCallback(() => {
    return (
      orderByGame !== GameOrderBy.HighLevel ||
      isMyGames ||
      isBitboy ||
      isJackpot ||
      duration !== GameDuration.ALL ||
      numberOfPlayers !== NumberOfPLayers.ALL ||
      stakeAmount !== GameStakeAmount.ALL ||
      gameLevel !== GameLevel.All ||
      gameType !== GameType.ALL
    );
  }, [
    orderByGame,
    isMyGames,
    isBitboy,
    isJackpot,
    duration,
    numberOfPlayers,
    stakeAmount,
    gameLevel,
    gameType,
  ]);

  return {
    orderByGame,
    setOrderByGame,
    isModified,
    isMyGames,
    setIsMyGames,
    isBitboy,
    setIsBitboy,
    isJackpot,
    setIsJackpot,
    duration,
    setDuration,
    numberOfPlayers,
    setNumberOfPlayers,
    stakeAmount,
    setStakeAmount,
    gameLevel,
    setGameLevel,
    gameType,
    setGameType,
    reset,
  };
}

// v2

export const COIN_LEAGUE_GAME_ONCHAIN_QUERY = 'COIN_LEAGUE_GAME_ONCHAIN_QUERY';

export function useCoinLeagueGameOnChainQuery({
  factoryAddress,
  id,
  provider,
}: {
  factoryAddress: string;
  provider?: ethers.providers.Web3Provider;
  id?: string;
}) {
  return useQuery<CoinLeagueGame | undefined>(
    [COIN_LEAGUE_GAME_ONCHAIN_QUERY, factoryAddress, id],
    async () => {
      if (!provider || !factoryAddress || !id) {
        return;
      }

      return await getCoinLeagueGameOnChain(provider, factoryAddress, id);
    }
  );
}

export function useJoinGameMutation({
  options,
  gameId,
  coinFeeds,
  captainCoinFeed,
  affiliate,
  factoryAddress,
  provider,
  onSubmit,
}: {
  gameId?: string;
  coinFeeds?: string[];
  captainCoinFeed?: string;
  affiliate?: string;
  factoryAddress?: string;
  provider?: ethers.providers.Web3Provider;
  onSubmit?: (hash: string) => void;
  options?:
    | Omit<
        UseMutationOptions<
          ethers.ContractReceipt | undefined,
          unknown,
          void,
          unknown
        >,
        'mutationFn'
      >
    | undefined;
}) {
  return useMutation(async () => {
    if (
      !provider ||
      !coinFeeds ||
      !captainCoinFeed ||
      !gameId ||
      !factoryAddress
    ) {
      return;
    }

    const tx = await joinGame(
      factoryAddress,
      coinFeeds,
      captainCoinFeed,
      provider,
      gameId,
      affiliate
    );

    if (onSubmit) {
      onSubmit(tx.hash);
    }

    return await tx.wait();
  }, options);
}

export function useStartGameMutation({
  options,
  gameId,
  factoryAddress,
  provider,
  onSubmit,
}: {
  gameId?: string;
  provider?: ethers.providers.Web3Provider;
  onSubmit?: (hash: string) => void;
  factoryAddress?: string;
  options?:
    | Omit<
        UseMutationOptions<
          ethers.ContractReceipt | undefined,
          unknown,
          void,
          unknown
        >,
        'mutationFn'
      >
    | undefined;
}) {
  return useMutation(async () => {
    if (!provider || !gameId || !factoryAddress) {
      return;
    }

    const tx = await startGame(factoryAddress, provider, gameId);

    if (onSubmit) {
      onSubmit(tx.hash);
    }

    return await tx.wait();
  }, options);
}

const GAME_PROFILES_STATE = 'GAME_PROFILES_STATE';

export function useGameProfilesState(
  addresses?: string[]
): ProfileContextState {
  const query = useQuery([GAME_PROFILES_STATE, String(addresses)], async () => {
    if (!addresses) {
      return;
    }
    const profiles = await getProfiles(addresses);

    return profiles;
  });

  return { profiles: query.data || [] };
}

export function useCreateGameMutation({
  factoryAddress,
  provider,
  onHash,
}: {
  provider?: ethers.providers.Web3Provider;
  factoryAddress?: string;
  onHash: (hash: string) => void;
}) {
  return useMutation(async (params?: GameParamsV3) => {
    if (!provider || !factoryAddress || !params) {
      return;
    }

    const tx = await createGame(factoryAddress, params, provider);

    if (onHash) {
      onHash(tx.hash);
    }

    return await tx.wait();
  });
}

export const COINLEAGUE_GAME_COIN = 'COINLEAGUE_GAME_COIN';

export function useGameCoin({
  id,
  coinAddress,
  provider,
}: {
  id?: string;
  coinAddress?: string;
  provider?: ethers.providers.Web3Provider;
}) {
  return useQuery([COINLEAGUE_GAME_COIN, coinAddress, id], async () => {
    if (!provider || !coinAddress || !id) {
      return;
    }
  });
}

export const CURRENT_COIN_PRICE = 'CURRENT_COIN_PRICE';

export function useCurrentCoinPrice({
  coinAddress,
  provider,
  factoryAddress,
}: {
  coinAddress?: string;
  factoryAddress?: string;
  provider?: ethers.providers.Web3Provider;
}) {
  return useQuery([CURRENT_COIN_PRICE, coinAddress], async () => {
    if (!provider || !coinAddress || !factoryAddress) {
      return;
    }

    return await getCurrentCoinPrice(provider, factoryAddress, coinAddress);
  });
}

const ACCOUNT_CLAIMED_QUERY = 'ACCOUNT_CLAIMED_QUERY';

export function useWinner({
  account,
  id,
  factoryAddress,
  provider,
}: {
  account?: string;
  id: string;
  factoryAddress?: string;
  provider?: ethers.providers.Web3Provider;
}) {
  return useQuery(
    [ACCOUNT_CLAIMED_QUERY, factoryAddress, account, id],
    async () => {
      if (!provider || !account || !id || !factoryAddress) {
        return;
      }

      return await getWinner(factoryAddress, account, id, provider);
    }
  );
}

export function useCoinLeagueClaim({
  account,
  id,
  factoryAddress,
  provider,
  onSubmited,
}: {
  account?: string;
  id: string;
  factoryAddress?: string;
  provider?: ethers.providers.Web3Provider;
  onSubmited?: (hash: string) => void;
}) {
  return useMutation(async () => {
    if (!provider || !account || !id || !factoryAddress) {
      return;
    }

    const tx = await claimGame(provider, factoryAddress, account, id);

    if (onSubmited) {
      onSubmited(tx.hash);
    }

    return await tx.wait();
  });
}

const COIN_LEAGUES_CHAMPION_URL_NUMBAI =
  'https://api.thegraph.com/subgraphs/name/joaocampos89/championsmumbai';

const COIN_LEAGUES_CHAMPION_URL_MATIC =
  'https://api.thegraph.com/subgraphs/name/joaocampos89/champions';

const mumbaiClient = new ApolloClient({
  uri: COIN_LEAGUES_CHAMPION_URL_NUMBAI,
  cache: new InMemoryCache(),
});

const maticClient = new ApolloClient({
  uri: COIN_LEAGUES_CHAMPION_URL_MATIC,
  cache: new InMemoryCache(),
});

const GET_MY_CHAMPIONS = gql`
  query QueryChampions($owner: String!) {
    tokens(
      where: { owner_contains: $owner }
      first: 100
      orderBy: id
      orderDirection: desc
    ) {
      id
      attack
      defense
      run
      uri
    }
  }
`;

export function useMyChampions(
  params: { chainId?: number; limit?: number; account?: string } = {
    limit: 100,
  }
) {
  const { chainId, limit, account } = params;

  const defaultAccount = account;

  const [data, setData] = useState<CoinLeaguesChampion[]>();
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(() => {
    if (defaultAccount && chainId) {
      setLoading(true);
      if (chainId === ChainId.Polygon || chainId === ChainId.Mumbai) {
        let client = maticClient;

        if (chainId === ChainId.Mumbai) {
          client = mumbaiClient;
        }
        client
          .query({
            query: GET_MY_CHAMPIONS,
            variables: { owner: defaultAccount.toLocaleLowerCase() },
          })

          .then(async (result: any) => {
            let tokens: any[] = result.data.tokens;

            let champions: CoinLeaguesChampion[] = [];

            for (let t of tokens) {
              let metadata: ChampionMetadata = await getChampionMetadata(
                t.id,
                chainId
              );

              let champ: CoinLeaguesChampion = {
                id: t.id,
                name: metadata.name,
                description: metadata.description,
                image: metadata.image,
                attack: parseInt(t.attack),
                defense: parseInt(t.defense),
                run: parseInt(t.run),
                rarity: getRarityFromBodyType(
                  metadata.attributes.find((att) => att.trait_type === 'body')
                    ?.value
                ),
              };
              champions.push(champ);
            }

            setData(champions.slice(0, limit));
            setLoading(false);
          })
          .catch((err: any) => {
            setError(err);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    }
  }, [defaultAccount, chainId, limit]);

  useEffect(() => {
    if (chainId && defaultAccount) {
      fetch();
    }
  }, [chainId, defaultAccount, fetch]);

  return { fetch, data, loading, error };
}
