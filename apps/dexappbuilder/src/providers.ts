import { JsonRpcProvider } from '@ethersproject/providers';

// this strategy is deprecated use src/constants/chains.ts file

const infuraKey = process.env.INFURA_API_KEY;

export const mainnetProvider = new JsonRpcProvider(
  `https://mainnet.infura.io/v3/${infuraKey}`
);

export const ropstenProvider = new JsonRpcProvider(
  `https://ropsten.infura.io/v3/${infuraKey}`
);

export const rinkebyProvider = new JsonRpcProvider(
  `https://rinkeby.infura.io/v3/${infuraKey}`
);

export const mumbaiProvider = new JsonRpcProvider(
  `https://polygon-mumbai.infura.io/v3/${infuraKey}`
);

export const polygonProvider = new JsonRpcProvider(
  `https://polygon-mainnet.infura.io/v3/${infuraKey}`
);

export const bscProvider = new JsonRpcProvider(
  'https://bsc-dataseed.binance.org/'
);


export const JSON_RPC_PROVIDERS: {
  [key: string]: JsonRpcProvider;
} = {
  ropsten: ropstenProvider,
  rinkeby: rinkebyProvider,
  mumbai: mumbaiProvider,
  ethereum: mainnetProvider,
  polygon: polygonProvider,
  bsc: bscProvider,
};
