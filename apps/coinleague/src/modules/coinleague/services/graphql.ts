import { ChainId } from '@/modules/common/constants/enums';

export const getGraphEndpoint = (isNFTGame: boolean, chainId?: ChainId) => {
  if (isNFTGame) {
    return GET_GRAPHQL_CLIENT_URL_NFT_ROOM[ChainId.Polygon];
  }

  if (chainId === ChainId.BSC) {
    return GET_GRAPHQL_CLIENT_URL_MAIN_ROOM[ChainId.BSC];
  }

  if (chainId === ChainId.Base) {
    return GET_GRAPHQL_CLIENT_URL_MAIN_ROOM[ChainId.Base];
  }

  if (chainId === ChainId.Mumbai) {
    return GET_GRAPHQL_CLIENT_URL_MAIN_ROOM[ChainId.Mumbai];
  }
  return GET_GRAPHQL_CLIENT_URL_MAIN_ROOM[ChainId.Polygon];
};

export const GET_GRAPHQL_CLIENT_URL_MAIN_ROOM = {
  [ChainId.Polygon]:
    //   'https://api.thegraph.com/subgraphs/name/joaocampos89/coinleaguev3',
    'https://api.studio.thegraph.com/query/1827/coinleague-polygon/version/latest',
  [ChainId.Base]:
    'https://api.studio.thegraph.com/query/1827/coinleague-base/version/latest',
  [ChainId.BSC]:
    'https://api.thegraph.com/subgraphs/name/joaocampos89/coinleaguebsc',
  [ChainId.Mumbai]:
    'https://api.thegraph.com/subgraphs/name/joaocampos89/coinleaguemumbaiv3',
};

export const GET_GRAPHQL_CLIENT_URL_NFT_ROOM = {
  [ChainId.Polygon]:
    'https://api.thegraph.com/subgraphs/name/joaocampos89/coinleagues-nftroom',
  [ChainId.BSC]: '',
  [ChainId.Mumbai]: '',
};
