import { ERC1155Abi, ERC165Abi, ERC721Abi, IERC7572 } from '@dexkit/core/constants/abis';
import { NETWORK_FROM_SLUG } from '@dexkit/core/constants/networks';
import { Asset, AssetMetadata } from '@dexkit/core/types/nft';
import { Interface } from '@dexkit/core/utils/ethers/abi/Interface';
import { ipfsUriToUrl } from '@dexkit/core/utils/ipfs';
import { CallInput } from '@indexed-finance/multicall';
import axios from 'axios';
import { BigNumber, Contract, providers } from 'ethers';
import { DEXKIT_NFT_BASE_URL, ENS_BASE_URL, TRADER_ORDERBOOK_API, dexkitNFTapi, metadataENSapi } from '../../../constants/api';
import { getMulticallFromProvider } from '../../../services/multical';
import { AssetAPI, ContractURIMetadata, OrderbookAPI, OrderbookResponse, TraderOrderFilter } from '../types';
import { isENSContract } from '../utils';

const orderbookNFTapi = axios.create({ baseURL: DEXKIT_NFT_BASE_URL, timeout: 10000 });




export async function getDKAssetOrderbook(orderFilter?: TraderOrderFilter) {
  return await orderbookNFTapi.get<OrderbookAPI>(`/asset/orderbook`, { params: orderFilter });
}

export async function getAssetByApi({
  chainId,
  contractAddress,
  tokenId,
}: {
  chainId: number;
  contractAddress: string;
  tokenId: string;
}) {
  const resp = await axios.get<Asset>('/api/asset', {
    params: { chainId, contractAddress, tokenId },
  });

  return resp.data;
}

export async function getAssetMetadata(
  tokenURI: string,
  defaultValue?: AssetMetadata,
  isERC1155?: boolean,
  tokenId?: string,
) {
  let uri = tokenURI || '';

  if (tokenId && uri) {
    const formattedTokenId = tokenId;

    if (uri.includes('%7Bid%7D')) {
      uri = uri.replace(/%7Bid%7D/g, formattedTokenId);
    }

    if (uri.includes('/0x{id}')) {
      uri = uri.replace('/0x{id}', `/${formattedTokenId}`);
    }
    if (uri.includes('/0x%7Bid%7D')) {
      uri = uri.replace('/0x%7Bid%7D', `/${formattedTokenId}`);
    }

    if (uri.includes('{id}')) {
      uri = uri.replace(/{id}/g, formattedTokenId);
    }
  }

  if (tokenURI?.startsWith('data:application/json;base64')) {
    const jsonURI = Buffer.from(tokenURI.substring(29), "base64").toString();
    return JSON.parse(jsonURI);
  }

  try {
    const finalUri = ipfsUriToUrl(uri || '');
    const response = await axios.get<AssetMetadata>(
      finalUri,
      {
        timeout: 5000,
      }
    );
    return response.data;
  } catch (e) {
    return defaultValue;
  }
}

export async function getAssetsData(
  provider: providers.JsonRpcProvider,
  contractAddress: string,
  ids: string[],
  isERC1155 = false
): Promise<Asset[] | undefined> {

  if (isENSContract(contractAddress)) {
    const data: Asset[] = [];
    for (const id of ids) {
      const response = await getENSAssetData(provider, contractAddress, id);
      if (response) {
        data.push(response);
      }
    }
    return data;
  }
  const multicall = await getMulticallFromProvider(provider);
  const iface = new Interface(isERC1155 ? ERC1155Abi : ERC721Abi);
  let calls: CallInput[] = [];
  calls.push({
    interface: iface,
    target: contractAddress,
    function: 'name',
  });

  calls.push({
    interface: iface,
    target: contractAddress,
    function: 'symbol',
  });
  for (let index = 0; index < ids.length; index++) {
    calls.push({
      interface: iface,
      target: contractAddress,
      function: isERC1155 ? 'uri' : 'tokenURI',
      args: [ids[index]],
    });
  }


  const response = await multicall?.multiCall(calls);
  const assets: Asset[] = [];
  if (response) {
    const { chainId } = await provider.getNetwork();
    const [, results] = response;
    const name = results[0];
    const symbol = results[1];

    for (let index = 0; index < ids.length; index++) {
      assets.push({
        tokenURI: results[index + 2],
        collectionName: name,
        symbol,
        id: ids[index],
        contractAddress,
        chainId,
        protocol: isERC1155 ? 'ERC1155' : 'ERC721',
      });
    }
    return assets;
  }
  return assets;
}

export async function getENSAssetData(
  provider?: providers.JsonRpcProvider,
  contractAddress?: string,
  id?: string
): Promise<Asset | undefined> {
  if (!provider || !contractAddress || !id) {
    return;
  }

  const response = await metadataENSapi.get(`/mainnet/${contractAddress}/${id}`);
  const data = response.data;
  const iface = new Interface(ERC721Abi);
  const contract = new Contract(contractAddress, iface, provider);
  const owner = await contract.ownerOf(id);

  if (data) {
    const { chainId } = await provider.getNetwork();
    return {
      owner,
      tokenURI: `${ENS_BASE_URL}/mainnet/${contractAddress}/${id}`,
      collectionName: data.name,
      symbol: 'ENS',
      id,
      contractAddress,
      chainId,
    };
  }
}
export async function getAssetProtocol(provider?: providers.JsonRpcProvider, contractAddress?: string): Promise<'ERC721' | 'ERC1155' | 'ERC20' | 'UNKNOWN'> {
  if (!provider || !contractAddress) {
    return 'UNKNOWN';
  }


  const multicall = await getMulticallFromProvider(provider);
  const iface = new Interface(ERC165Abi);
  let calls: CallInput[] = [];
  calls.push({
    interface: iface,
    target: contractAddress,
    function: 'supportsInterface',
    args: ['0xd9b67a26'],
  });
  const response = await multicall?.multiCall(calls);
  if (response) {
    const [, results] = response;
    const isERC1155 = results[0];
    if (isERC1155) {
      return 'ERC1155';
    }
  }
  return 'ERC721'
}



export async function getAssetData(
  provider?: providers.JsonRpcProvider,
  contractAddress?: string,
  id?: string,
  account?: string,
  network?: string
): Promise<Asset | undefined> {
  if (!provider || !contractAddress || !id) {
    return;
  }
  if (isENSContract(contractAddress)) {
    const data = await getENSAssetData(provider, contractAddress, id);
    return data;
  }
  const protocol = await getAssetProtocol(provider, contractAddress);
  const isERC1155 = protocol === 'ERC1155' ? true : false;

  const multicall = await getMulticallFromProvider(provider);
  const iface = new Interface(isERC1155 ? ERC1155Abi : ERC721Abi);
  let calls: CallInput[] = [];
  if (!isERC1155) {
    calls.push({
      interface: iface,
      target: contractAddress,
      function: 'ownerOf',
      args: [id],
    });
  }

  if (isERC1155 && account) {
    calls.push({
      interface: iface,
      target: contractAddress,
      function: 'balanceOf',
      args: [account, id],
    });
  }

  calls.push({
    interface: iface,
    target: contractAddress,
    function: isERC1155 ? 'uri' : 'tokenURI',
    args: [id],
  });

  calls.push({
    interface: iface,
    target: contractAddress,
    function: 'name',
  });

  calls.push({
    interface: iface,
    target: contractAddress,
    function: 'symbol',
  });

  const response = await multicall?.multiCall(calls);

  if (response) {
    const [, results] = response;

    let owner = '0x';
    let tokenURI;
    let name;
    let symbol;
    let balance = null;
    if (isERC1155) {

      if (account) {
        balance = results[0]
        tokenURI = results[1];
        name = results[2];
        symbol = results[3];
      } else {
        tokenURI = results[0];
        name = results[1];
        symbol = results[2];
      }


    } else {
      owner = results[0];
      tokenURI = results[1];
      name = results[2];
      symbol = results[3];
    }

    let chainId;
    if (network) {
      chainId = NETWORK_FROM_SLUG(network)?.chainId;
    }
    if (!chainId) {
      const { chainId: networkChain } = await provider.getNetwork();
      chainId = networkChain;
    }

    return {
      owner,
      tokenURI,
      collectionName: name,
      symbol,
      id,
      contractAddress,
      chainId,
      protocol: isERC1155 ? 'ERC1155' : 'ERC721',
      balance,
    };
  }
}

export async function searchAssetsDexKitApi({ keyword, collections }: { keyword: string, collections?: string }) {
  const resp = await dexkitNFTapi.get<AssetAPI[]>(`/asset/search`, { params: { keyword, collections } });
  return resp.data;

}

export function getOrderbookOrders(orderFilter?: TraderOrderFilter) {
  return axios
    .get<OrderbookResponse>(`${TRADER_ORDERBOOK_API}`, { params: orderFilter })
    .then((resp) => resp.data);
}

export async function getContractUriMetadata({ contractURI }: { contractURI?: string }) {


  try {
    const response = await axios.get<ContractURIMetadata>(
      ipfsUriToUrl(contractURI || ''),
      {
        timeout: 5000,
      }
    );
    return response.data;
  } catch (e) {
    return undefined;
  }
}

export async function getContractURI({ provider, contractAddress }: {
  provider?: providers.JsonRpcProvider,
  contractAddress?: string
}) {
  if (!contractAddress) {
    return;
  }
  const iface = new Interface(IERC7572);
  const contract = new Contract(contractAddress, iface, provider);
  return await contract.contractURI()

}




export async function getERC1155Balance({
  provider,
  contractAddress,
  tokenId,
  account,
}: {
  provider?: providers.JsonRpcProvider,
  contractAddress: string;
  tokenId: string;
  account: string;
}) {
  if (!provider || !contractAddress || !tokenId || !account) {
    return;
  }

  const multicall = await getMulticallFromProvider(provider);
  const iface = new Interface(ERC1155Abi);
  let calls: CallInput[] = [];
  calls.push({
    interface: iface,
    target: contractAddress,
    function: 'balanceOf',
    args: [account, tokenId],
  });
  const response = await multicall?.multiCall(calls);
  if (response) {
    const [, results] = response;
    return results[0] as BigNumber;
  }
}

export async function getApiMultipleAssets({ query }: { query: any }

): Promise<AssetAPI[] | undefined> {
  if (!query) {
    return;
  }

  const response = await dexkitNFTapi.post<AssetAPI[]>(`/asset/multiple-assets`, query);
  return response.data
}

export async function getAssetDexKitApi({
  networkId,
  contractAddress,
  tokenId,
}: {
  networkId: string;
  contractAddress: string;
  tokenId: string;
}) {

  const resp = await dexkitNFTapi.get<AssetAPI>(`/asset/${networkId}/${contractAddress.toLowerCase()}/${tokenId}`);
  // We replace it with the cdn image
  const imageUrl = resp.data.imageUrl?.replace('dexkit-storage.nyc3.digitaloceanspaces.com', 'dexkit-storage.nyc3.cdn.digitaloceanspaces.com');

  if (imageUrl) {
    return { ...resp.data, imageUrl };
  }
  return resp.data
}

export async function getMultipleAssetDexKitApi({
  networkId,
  contractAddress,
  tokenIds,
}: {
  networkId: string;
  contractAddress: string;
  tokenIds: string[];
}) {

  const resp = await dexkitNFTapi.get<AssetAPI[]>(`/asset/multiple/${networkId}/${contractAddress.toLowerCase()}/${tokenIds.join(',')}`);
  // We replace it with the cdn image
  const imageUrl = resp.data.map((a) => {
    let imageUrl;
    if (a.imageUrl) {
      imageUrl = a.imageUrl.replace('dexkit-storage.nyc3.digitaloceanspaces.com', 'dexkit-storage.nyc3.cdn.digitaloceanspaces.com');
    }
    if (imageUrl) {
      return { ...a, imageUrl };
    } else {
      return a;
    }
  })

  if (imageUrl) {
    return { ...resp.data, imageUrl };
  }
  return resp.data
}


export async function getERC721TotalSupply({
  provider,
  contractAddress,
}: {
  provider?: providers.JsonRpcProvider,
  contractAddress: string;
}) {
  if (!provider || !contractAddress) {
    return;
  }

  const multicall = await getMulticallFromProvider(provider);
  const iface = new Interface(ERC721Abi);
  let calls: CallInput[] = [];
  calls.push({
    interface: iface,
    target: contractAddress,
    function: 'totalSupply'
  });
  const response = await multicall?.multiCall(calls);
  if (response) {
    const [, results] = response;
    return results[0] as BigNumber;
  }
}


export async function getAssetsFromOrderbook(
  provider?: providers.JsonRpcProvider,
  filters?: TraderOrderFilter
) {
  if (provider === undefined) {
    return;
  }

  const orderbook = await getOrderbookOrders(filters);

  const ids = new Set<{
    id: string, address: string, chainId: string
  }>(
    orderbook.orders.map((order) => {
      return {
        id: order.nftTokenId,
        address: order.nftToken,
        chainId: order.chainId,

      }
    })
  );
}
