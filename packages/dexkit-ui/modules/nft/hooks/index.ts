import { ChainId } from "@dexkit/core/constants";
import { NETWORKS } from "@dexkit/core/constants/networks";
import { useNetworkProvider } from "@dexkit/core/hooks/blockchain";
import { Asset, AssetMetadata, SwapApiOrder } from "@dexkit/core/types/nft";
import { isAddressEqual } from "@dexkit/core/utils";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import {
  NftSwapV4,
  SwappableAssetV4,
  SwappableNftV4,
} from "@traderxyz/nft-swap-sdk";
import { PostOrderResponsePayload } from "@traderxyz/nft-swap-sdk/dist/sdk/v4/orderbook";
import axios from "axios";
import { BigNumber } from "ethers";
import { useAtom } from "jotai";
import { useCallback, useMemo } from "react";
import { getAssetDexKitApi, TRADER_BASE_API } from "../../../constants/api";
import { useAppConfig, useDexKitContext } from "../../../hooks";
import { useActiveChainIds, useTokenList } from "../../../hooks/blockchain";
import { accountAssetsAtom } from "../../../state";
import { NFTType } from "../constants/enum";
import {
  getAssetByApi,
  getAssetData,
  getAssetMetadata,
  getAssetsData,
  getDKAssetOrderbook,
  getERC1155Balance,
  getOrderbookOrders,
  searchAssetsDexKitApi,
} from "../services";
import {
  AssetAPI,
  AssetBalance,
  CollectionUniformItem,
  HiddenAsset,
  OrderBookItem,
  TraderOrderFilter,
} from "../types";
import {
  calculeFees,
  detectIPFSContentType,
  getMediaTypeFromContentType,
  getNFTMediaSrcAndType as getNFTMediaSrcAndTypeUtil,
  parseAssetApi,
} from "../utils";

import { UserEvents } from "@dexkit/core/constants/userEvents";
import {
  getChainSlug,
  getNetworkSlugFromChainId,
} from "@dexkit/core/utils/blockchain";
import { SignedNftOrderV4, TradeDirection } from "@traderxyz/nft-swap-sdk";
import { SUPPORTED_SWAP_CHAIN_IDS } from "../../../constants/zrx";
import { useTrackUserEventsMutation } from "../../../hooks/userEvents";
import { getCollectionByApi } from "../services/collection";
import { AssetRari } from "../types/rarible";

export const GET_ASSET_BALANCE = "GET_ASSET_BALANCE";

export function useAssetBalance(asset?: Asset, account?: string) {
  const { provider, chainId } = useWeb3React();
  return useQuery({
    queryKey: [GET_ASSET_BALANCE, asset, account, chainId],
    queryFn: async () => {
      let balance: BigNumber | undefined;

      if (asset?.protocol === "ERC1155") {
        balance = await getERC1155Balance({
          provider: provider!,
          account: account!,
          contractAddress: asset.contractAddress,
          tokenId: asset.id,
        });
      }

      return {
        asset,
        balance,
      } as AssetBalance;
    },
    enabled: !!(chainId && provider && asset && account)
  });
}

export const GET_NFT_ORDERS = "GET_NFT_ORDERS";

export const GET_COLLECTION_BY_API = "GET_COLLECTION_BY_API";

export function useCollectionByApi({
  chainId,
  contractAddress,
}: {
  chainId?: number;
  contractAddress?: string;
}) {
  return useQuery({
    queryKey: [GET_COLLECTION_BY_API, chainId, contractAddress],
    queryFn: async () => {
      if (chainId === undefined || contractAddress === undefined) {
        return;
      }

      return await getCollectionByApi({ chainId, contractAddress });
    }
  });
}

export const GET_ASSETS_ORDERBOOK = "GET_ASSETS_ORDERBOOK";

export const useAssetsOrderBook = (orderFilter?: TraderOrderFilter) => {
  return useQuery({
    queryKey: [GET_ASSETS_ORDERBOOK, orderFilter],
    queryFn: async () => {
      return (await getDKAssetOrderbook(orderFilter)).data;
    }
  });
};

export const GET_ASSET_BY_API = "GET_ASSET_BY_API";

export function useAssetByApi({
  chainId,
  contractAddress,
  tokenId,
}: {
  chainId?: number;
  contractAddress?: string;
  tokenId?: string;
}) {
  return useQuery({
    queryKey: [GET_ASSET_BY_API, chainId, contractAddress, tokenId],
    queryFn: async () => {
      if (
        chainId === undefined ||
        contractAddress === undefined ||
        tokenId === undefined
      ) {
        return;
      }

      return await getAssetByApi({ chainId, contractAddress, tokenId });
    }
  });
}

export function useFullAsset({
  address,
  id,
  chainId,
  lazy,
}: {
  address?: string;
  id?: string;
  chainId?: ChainId;
  lazy?: boolean;
}) {
  const { data: asset } = useAsset(address, id, undefined, lazy, chainId);
  const { data: metadata } = useAssetMetadata(asset);

  if (asset && metadata) {
    return { ...asset, metadata } as Asset;
  }
}

export const GET_ASSET_METADATA = "GET_ASSET_METADATA";

export function useAssetMetadata(
  asset?: Asset,
  options?: Omit<UseQueryOptions, any>
) {
  return useQuery<AssetMetadata | undefined>({
    queryKey: [GET_ASSET_METADATA, asset?.tokenURI, asset?.protocol, asset?.id],
    queryFn: async () => {
      if (asset?.tokenURI === undefined) {
        return;
      }
      // Note: we are returning all metadata from dexkit api, so we check if asset has metadata before fetching it from the api
      if (asset?.metadata) {
        const hasImage = asset.metadata.image && asset.metadata.image !== null && asset.metadata.image !== "";
        const hasAnimationUrl = asset.metadata.animation_url && asset.metadata.animation_url !== "";

        if ((!hasImage || !hasAnimationUrl) && asset.tokenURI) {
          try {
            const ipfsMetadata = await getAssetMetadata(
              asset.tokenURI,
              asset.metadata,
              asset?.protocol === "ERC1155",
              asset?.id
            );

            return { ...asset.metadata, ...ipfsMetadata };
          } catch (e) {
            return asset.metadata;
          }
        }

        return asset.metadata;
      }

      return await getAssetMetadata(
        asset?.tokenURI,
        {
          image: "",
          name: `${asset.collectionName} #${asset.id}`,
        },
        asset?.protocol === "ERC1155",
        asset?.id
      );
    },
    enabled: asset?.tokenURI !== undefined,
    ...options
  });
}

export function useSwapSdkV4({ provider, signer, chainId }: { provider: any, signer: any, chainId?: number }) {
  return useMemo(() => {
    if (chainId === undefined || signer === undefined) {
      return undefined;
    }
    // swap sdk gives error if chainId not supported
    if (chainId && !SUPPORTED_SWAP_CHAIN_IDS.includes(chainId)) {
      return undefined;
    }

    return new NftSwapV4(provider, signer, chainId, { orderbookRootUrl: TRADER_BASE_API });
  }, [signer, chainId, provider]);
}

export function useApproveAssetMutation(
  nftSwapSdk?: NftSwapV4,
  address?: string,
  onSuccess?: (hash: string, asset: SwappableAssetV4) => void,
  options?: Omit<UseMutationOptions, any>
) {
  const mutation = useMutation(
    async ({ asset }: { asset: SwappableAssetV4 }) => {
      if (address === undefined || nftSwapSdk === undefined) {
        return undefined;
      }

      const tx = await nftSwapSdk.approveTokenOrNftByAsset(asset, address);

      if (onSuccess) {
        onSuccess!(tx.hash, asset);
      }

      const receipt = await tx.wait();

      return receipt.status === 1 && receipt.confirmations >= 1;
    },
    options
  );

  return mutation;
}

export function useMakeOfferMutation(
  nftSwapSdk?: NftSwapV4,
  address?: string,
  chainId?: number,
  options?: UseMutationOptions<PostOrderResponsePayload | undefined, any, any>
) {
  const appConfig = useAppConfig();
  const tokens = useTokenList({ chainId });

  const trackEvent = useTrackUserEventsMutation();

  const mutation = useMutation<PostOrderResponsePayload | undefined, any, any>(
    async ({
      assetOffer,
      another,
      expiry,
    }: {
      assetOffer: SwappableNftV4;
      another: SwappableAssetV4;
      expiry?: number | Date | undefined;
    }) => {
      if (address === undefined || nftSwapSdk === undefined) {
        return undefined;
      }

      if (another.type !== "ERC20") {
        return;
      }

      let options: any = {
        expiry,
      };

      const token = tokens.find((t) =>
        isAddressEqual(t.address, another.tokenAddress)
      );

      if (appConfig.fees && token) {
        options.fees = calculeFees(
          BigNumber.from(another.amount),
          token.decimals,
          appConfig.fees
        );
      }

      const order = nftSwapSdk.buildOrder(
        another,
        //@ts-ignore
        assetOffer,
        address,
        options
      );

      const signedOrder = await nftSwapSdk.signOrder(order);

      const newOrder = await nftSwapSdk.postOrder(
        signedOrder,
        nftSwapSdk.chainId.toString()
      );

      let event: any;

      if (assetOffer.type === "ERC1155") {
        event = UserEvents.nftERC1155Offer;
      } else if (assetOffer.type === "ERC721") {
        event = UserEvents.nftERC721Offer;
      }

      await trackEvent.mutateAsync({
        event: event,
        chainId,
        metadata: JSON.stringify({ order: newOrder }),
      });

      return newOrder;
    },
    options
  );

  return mutation;
}

export function useMakeListingMutation(
  nftSwapSdk?: NftSwapV4,
  address?: string,
  chainId?: number,
  options?: UseMutationOptions<PostOrderResponsePayload | undefined, any, any>
) {
  const tokens = useTokenList({ includeNative: true, chainId });
  const appConfig = useAppConfig();

  const trackEvent = useTrackUserEventsMutation();

  const mutation = useMutation<PostOrderResponsePayload | undefined, any, any>(
    async ({ assetOffer, another, expiry, taker }: any) => {
      if (address === undefined || nftSwapSdk === undefined) {
        return undefined;
      }

      let options: any = {
        expiry,
        taker,
      };

      const token = tokens.find((t) =>
        isAddressEqual(t.address, another.tokenAddress)
      );

      if (appConfig.fees && token) {
        options.fees = calculeFees(
          BigNumber.from(another.amount),
          token.decimals,
          appConfig.fees
        );
      }

      const order = nftSwapSdk.buildOrder(
        assetOffer,
        another,
        address,
        options
      );

      const signedOrder = await nftSwapSdk.signOrder(order);

      const newOrder = await nftSwapSdk.postOrder(
        signedOrder,
        nftSwapSdk.chainId.toString()
      );

      let event: any;

      if (assetOffer.type === "ERC1155") {
        event = UserEvents.nftERC1155List;
      } else if (assetOffer.type === "ERC721") {
        event = UserEvents.nftERC721List;
      }

      await trackEvent.mutateAsync({
        event: event,
        chainId,
        metadata: JSON.stringify({ order: newOrder }),
      });

      return newOrder;
    },
    options
  );

  return mutation;
}

export function useFavoriteAssets() {
  const { assets, setAssets } = useDexKitContext();

  const add = (asset: Asset) => {
    setAssets((value: Record<string, Asset>) => ({
      ...value,
      [`${asset.chainId}-${asset.contractAddress?.toLowerCase()}-${asset.id}`]:
        asset,
    }));
  };

  const remove = (asset: Asset) => {
    setAssets((value: Record<string, Asset>) => {
      let tempValue = { ...value };

      delete tempValue[
        `${asset.chainId}-${asset.contractAddress?.toLowerCase()}-${asset.id}`
      ];

      return tempValue;
    });
  };
  const isFavorite = useCallback(
    (asset?: Asset) => {
      return (
        asset !== undefined &&
        assets !== undefined &&
        assets[
        `${asset.chainId}-${asset.contractAddress.toLowerCase()}-${asset.id}`
        ] !== undefined
      );
    },
    [assets]
  );
  const toggleFavorite = (asset?: Asset) => {
    if (asset !== undefined) {
      if (isFavorite(asset)) {
        remove(asset);
      } else {
        add(asset);
      }
    }
  };
  return { add, remove, assets, isFavorite, toggleFavorite };
}

const GET_ACCOUNTS_ASSETS = "GET_ACCOUNTS_ASSETS";

export function useAccountAssetsBalance(
  accounts: string[],
  useSuspense = true
) {
  const [accountAssets, setAccountAssets] = useAtom(accountAssetsAtom);
  const { activeChainIds } = useActiveChainIds();

  const accountAssetsQuery = useQuery({
    queryKey: [GET_ACCOUNTS_ASSETS, accounts],
    queryFn: async () => {
      if (!accounts) {
        return false;
      }
      if (!accounts.length) {
        return false;
      }
      const atualDate = new Date().getTime();
      const query = JSON.stringify(accounts);
      if (
        accountAssets?.lastTimeFetched &&
        accountAssets?.lastTimeFetched.time < atualDate + 86400000 &&
        accountAssets?.lastTimeFetched.query === query
      ) {
        return false;
      }
      const networks = Object.values(NETWORKS)
        .filter((n) => activeChainIds.includes(n.chainId))
        .filter((n) => !n.testnet)
        .map((n) => n.slug)
        .join(",");
      const accFlat = accounts.join(",");
      const response = await axios.get<
        {
          total?: number;
          page?: number;
          account?: string;
          network?: string;
          perPage?: number;
          assets?: AssetAPI[];
        }[]
      >(`/api/wallet/nft`, {
        params: { accounts: accFlat, networks: networks },
      });
      if (response.data && response.data.length) {
        setAccountAssets({
          data: response.data.map((a) => {
            return {
              ...a,
              assets: a.assets?.map(parseAssetApi) as unknown as Asset[],
            };
          }),
          lastTimeFetched: {
            time: new Date().getTime(),
            query: JSON.stringify(accounts),
          },
        });
        return true;
      }
      return true;
    },
    suspense: useSuspense
  });
  return { accountAssets, accountAssetsQuery };
}

export const GET_ASSET_DATA = "GET_ASSET_DATA";

const GET_IPFS_CONTENT_TYPE = "GET_IPFS_CONTENT_TYPE";

export function useIPFSContentType(url: string | undefined) {
  return useQuery<string | null, Error>(
    [GET_IPFS_CONTENT_TYPE, url],
    async (): Promise<string | null> => {
      if (!url) return null;
      return await detectIPFSContentType(url);
    },
    {
      enabled: !!url,
      staleTime: 10 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
    } as any
  );
}

export function useNFTMediaType(
  address: string,
  chainId: ChainId,
  tokenId: string,
  metadata?: AssetMetadata
) {
  const mediaTypeResult = getNFTMediaSrcAndTypeUtil(address, chainId, tokenId, metadata);

  const needsDetection = mediaTypeResult.needsContentTypeDetection && mediaTypeResult.src;
  const urlToDetect = needsDetection ? mediaTypeResult.src : undefined;
  const { data: contentType, isLoading: isDetectingContentType } = useIPFSContentType(urlToDetect);

  if (contentType && needsDetection && typeof contentType === 'string') {
    const detectedType = getMediaTypeFromContentType(contentType);
    if (detectedType) {
      const correctSrc = metadata?.animation_url && (detectedType === 'mp4' || detectedType === 'audio')
        ? metadata.animation_url
        : metadata?.image || mediaTypeResult.src;

      return {
        type: detectedType,
        src: correctSrc || mediaTypeResult.src,
        isDetecting: false,
      };
    }
  }

  if (needsDetection && isDetectingContentType) {
    return {
      type: mediaTypeResult.type,
      src: mediaTypeResult.src,
      isDetecting: true,
    };
  }

  let finalSrc = mediaTypeResult.src;
  if (!finalSrc) {
    if (mediaTypeResult.type === 'mp4' || mediaTypeResult.type === 'audio') {
      finalSrc = metadata?.animation_url;
    } else {
      finalSrc = metadata?.image;
    }
  }

  return {
    type: mediaTypeResult.type,
    src: finalSrc,
    isDetecting: false,
  };
}

export function useAsset(
  contractAddress?: string,
  tokenId?: string,
  options?: Omit<UseQueryOptions<Asset>, any>,
  lazy?: boolean,
  networkChainId?: ChainId
) {
  const queryClient = useQueryClient();
  const networkProvider = useNetworkProvider(networkChainId);
  const {
    provider: injectedProvider,
    chainId: injectedChainId,
    isActive,
    account,
  } = useWeb3React();

  const assetCached = queryClient.getQueryState<Asset | undefined>([
    GET_ASSET_DATA,
    contractAddress,
    tokenId,
  ]);

  const provider = networkProvider || injectedProvider;
  const chainId = networkChainId || injectedChainId;

  const hasChainDiff =
    provider !== undefined &&
    typeof window !== "undefined" &&
    assetCached?.data?.chainId !== chainId;

  return useQuery({
    queryKey: [GET_ASSET_DATA, contractAddress, tokenId],
    queryFn: async () => {
      if (
        chainId === undefined ||
        provider === undefined ||
        contractAddress === undefined ||
        tokenId === undefined
      ) {
        return;
      }
      const asset = await getAssetData(
        provider,
        contractAddress,
        tokenId,
        account
      );

      let assetApi: AssetAPI | undefined;
      try {
        assetApi = await getAssetDexKitApi({
          networkId: getChainSlug(chainId) || "",
          contractAddress: contractAddress,
          tokenId: tokenId,
        });
      } catch {
        console.log(
          `error fetching token ${tokenId}, address: ${contractAddress} at ${getChainSlug(
            chainId
          )} from api`
        );
      }
      if (assetApi) {
        const rawMetadata = assetApi.rawData
          ? JSON.parse(assetApi.rawData)
          : undefined;
        const newAsset: Asset = {
          id: assetApi.tokenId,
          chainId: chainId as ChainId,
          contractAddress: assetApi.address,
          tokenURI: assetApi.tokenURI || "",
          collectionName: assetApi.collectionName || "",
          symbol: assetApi.symbol || "",
          metadata: { ...rawMetadata, image: assetApi?.imageUrl },
          owner: asset?.owner,
          protocol: asset?.protocol,
          balance: asset?.balance,
        };
        return newAsset;
      }
      return asset;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: !hasChainDiff && isActive == true,
    enabled:
      !hasChainDiff ||
      (Boolean(lazy) &&
        contractAddress !== undefined &&
        tokenId !== undefined),
    ...options
  });
}

export function useCancelSignedOrderMutation(
  nftSwapSdk?: NftSwapV4,
  orderType?: "ERC721" | "ERC1155", // TODO: types
  onHash?: (hash: string, order: SwapApiOrder) => void,
  options?: Omit<UseMutationOptions, any>
) {
  return useMutation<any, any, any>(
    async ({ order }: { order: SwapApiOrder }) => {
      if (orderType === undefined || nftSwapSdk === undefined) {
        return undefined;
      }

      const tx = await nftSwapSdk.cancelOrder(order.nonce, orderType);

      if (onHash) {
        onHash!(tx.hash, order);
      }

      return await tx.wait();
    },
    options
  );
}
/**
 * mutation to fill nft signed orderr
 * @param nftSwapSdk
 * @param address
 * @param options
 * @returns
 */
export function useFillSignedOrderMutation(
  nftSwapSdk?: NftSwapV4,
  address?: string,
  options?: Omit<UseMutationOptions, any>,
  onHash?: ({
    hash,
    accept,
    order,
    quantity,
  }: {
    hash: string;
    accept?: boolean;
    order: SignedNftOrderV4;
    quantity?: number;
  }) => void
) {
  return useMutation(
    async ({
      order,
      accept = false,
      quantity,
    }: {
      accept?: boolean;
      order: SignedNftOrderV4;
      quantity?: number;
    }) => {
      if (address === undefined || nftSwapSdk === undefined) {
        return undefined;
      }
      // this is an ERC1155 order buy order
      if (
        quantity &&
        quantity > 1 &&
        order.direction === TradeDirection.SellNFT &&
        "erc1155Token" in order &&
        quantity !== Number(order.erc1155TokenAmount)
      ) {
        const canOrderTypeBeFilledWithNativeToken =
          order.direction === TradeDirection.SellNFT;
        const isNativeToken = nftSwapSdk.isErc20NativeToken(order);
        const needsEthAttached =
          isNativeToken && canOrderTypeBeFilledWithNativeToken;

        const erc20TotalAmount = nftSwapSdk
          .getErc20TotalIncludingFees(order)
          .mul(
            BigNumber.from(quantity).mul(100000).div(order.erc1155TokenAmount)
          )
          .div(100000);

        const tx = await nftSwapSdk.exchangeProxy.buyERC1155(
          order as any,
          order.signature,
          quantity,
          "0x",
          {
            value: needsEthAttached ? erc20TotalAmount : undefined,
          }
        );
        if (onHash) {
          onHash({ hash: tx?.hash, accept, order, quantity });
        }
        await tx.wait();
        return { hash: tx?.hash, accept, order, quantity };
      }

      const tx = await nftSwapSdk.fillSignedOrder(order, {});
      if (onHash) {
        onHash({ hash: tx?.hash, accept, order });
      }
      await tx.wait();

      return { hash: tx?.hash, accept, order };
    },
    options
  );
}

const SEARCH_ASSETS = "SEARCH_ASSETS";

export function useSearchAssets(
  search?: string,
  collections?: CollectionUniformItem[]
) {
  return useQuery({
    queryKey: [SEARCH_ASSETS, search],
    queryFn: () => {
      if (!search) {
        return [];
      }
      let collectionsFilter = undefined;
      if (collections) {
        collectionsFilter = collections
          .map(
            (c) =>
              `${getNetworkSlugFromChainId(
                c.chainId
              )}:${c.contractAddress.toLowerCase()}`
          )
          .join(",");
      }

      return searchAssetsDexKitApi({
        keyword: search,
        collections: collectionsFilter,
      });
    }
  });
}

export const GET_ASSET_LIST_FROM_ORDERBOOK = "GET_ASSET_LIST_FROM_ORDERBOOK";
/**
 * Returns nfts associated with orders
 * @param orderFilter
 * @returns
 */
export const useAssetListFromOrderbook = (orderFilter: TraderOrderFilter) => {
  const ordebookQuery = useOrderBook(orderFilter);
  const provider = useNetworkProvider(orderFilter.chainId);
  return useQuery({
    queryKey: [GET_ASSET_LIST_FROM_ORDERBOOK, ordebookQuery.data],
    queryFn: async () => {
      if (ordebookQuery.data === undefined || provider === undefined) {
        return [];
      }
      // We are mapping Collections ---> nft token id's ---> orders
      const orderItemsMap = new Map<string, Map<string, OrderBookItem>>();
      const orders = ordebookQuery.data.orders;
      for (const order of orders) {
        const orderKey = `${order.nftToken}`;
        if (orderItemsMap.has(orderKey)) {
          const collectionMap = orderItemsMap.get(orderKey) as Map<
            string,
            OrderBookItem
          >;
          if (collectionMap.has(order.nftTokenId)) {
            const or = collectionMap.get(order.nftTokenId) as OrderBookItem;
            or.orders?.push(or.order);
            collectionMap.set(order.nftTokenId, or);
            orderItemsMap.set(orderKey, collectionMap);
          } else {
            collectionMap.set(order.nftTokenId, {
              ...order,
              orders: [order.order],
            });
            orderItemsMap.set(orderKey, collectionMap);
          }
        } else {
          const initNFTmap = new Map<string, OrderBookItem>();
          initNFTmap.set(order.nftTokenId, {
            ...order,
            orders: [order.order],
          });
          orderItemsMap.set(orderKey, initNFTmap);
        }
      }
      let assets: Asset[] = [];
      const collections = Array.from(orderItemsMap.keys());

      for (const collection of collections) {
        const itensCollectionMap = orderItemsMap.get(collection) as Map<
          string,
          OrderBookItem
        >;
        const itensCollection = Array.from(itensCollectionMap.values());
        const nftType = itensCollection[0].nftType;
        const nfts = await getAssetsData(
          provider,
          collection,
          itensCollection.map((or) => or.nftTokenId),
          nftType === NFTType.ERC1155
        );
        if (nfts) {
          assets = assets.concat(nfts);
        }
      }
      return assets;
    },
    enabled: provider !== undefined,
    suspense: true
  });
};

/**
 * Return nft orderbook
 * @param orderFilter
 * @returns
 */
export const useOrderBook = (orderFilter: TraderOrderFilter) => {
  return useQuery({
    queryKey: [GET_NFT_ORDERS, orderFilter],
    queryFn: async () => {
      if (orderFilter.chainId === undefined) {
        return;
      }

      return await getOrderbookOrders(orderFilter);
    },
    enabled: orderFilter.chainId !== undefined,
    suspense: true
  });
};

export const GET_ASSET_METADATA_FROM_LIST = "GET_ASSET_METADATA_FROM_LIST";
/**
 * Returns assets metadata from orderbook list
 * @param orderFilter
 * @returns
 */
export const useAssetMetadataFromList = (orderFilter: TraderOrderFilter) => {
  const assetListQuery = useAssetListFromOrderbook(orderFilter);
  return useQuery({
    queryKey: [GET_ASSET_METADATA_FROM_LIST, assetListQuery.data],
    queryFn: async () => {
      if (!assetListQuery.data) {
        return;
      }
      const data = assetListQuery.data;
      const assetMetadata: Asset[] = [];

      for (let index = 0; index < data.length; index++) {
        const asset = data[index];
        const metadata = await getAssetMetadata(
          asset.tokenURI,
          undefined,
          asset.protocol === "ERC1155",
          asset.id
        );
        assetMetadata.push({
          ...asset,
          metadata: metadata,
        });
      }
      return assetMetadata;
    },
    suspense: true
  });
};

export function useHiddenAssets() {
  const { hiddenAssets: assets, setHiddenAssets: setAssets } =
    useDexKitContext();

  const add = (asset: HiddenAsset) => {
    setAssets((value: Record<string, boolean>) => ({
      ...value,
      [`${asset.chainId}-${asset.contractAddress?.toLowerCase()}-${asset.id}`]:
        true,
    }));
  };

  const remove = (asset: HiddenAsset) => {
    setAssets((value: Record<string, boolean>) => {
      let tempValue = { ...value };

      tempValue[
        `${asset.chainId}-${asset.contractAddress?.toLowerCase()}-${asset.id}`
      ] = false;

      return tempValue;
    });
  };
  const isHidden = useCallback(
    (asset?: Asset) => {
      return (
        asset !== undefined &&
        assets !== undefined &&
        assets[
        `${asset.chainId}-${asset.contractAddress.toLowerCase()}-${asset.id}`
        ] === true
      );
    },
    [assets]
  );
  const toggleHidden = (asset?: Asset) => {
    if (asset !== undefined) {
      if (isHidden(asset)) {
        remove(asset);
      } else {
        add(asset);
      }
    }
  };

  return { add, remove, assets, isHidden, toggleHidden };
}

export const BEST_SELL_ORDER_RARIBLE = "BEST_SELL_ORDER_RARIBLE";

export function useBestSellOrderAssetRari(
  network?: string,
  address?: string,
  id?: string
) {
  return useQuery<AssetRari | undefined>({
    queryKey: [BEST_SELL_ORDER_RARIBLE, network, address, id],
    queryFn: () => {
      return undefined;
    },
    enabled: false
  });
}

export const GET_ASSET_APPROVAL = "GET_ASSET_APPROVAL";

export function useIsAssetApproved(
  nftSwapSdk?: NftSwapV4,
  asset?: SwappableAssetV4,
  address?: string
) {
  return useQuery({
    queryKey: [GET_ASSET_APPROVAL, nftSwapSdk, address, asset],
    queryFn: async () => {
      if (
        address === undefined ||
        nftSwapSdk === undefined ||
        asset === undefined
      ) {
        return undefined;
      }

      return await nftSwapSdk?.loadApprovalStatus(asset, address);
    }
  });
}
