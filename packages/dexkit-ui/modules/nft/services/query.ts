import { ChainId } from "@dexkit/core/constants/enums";
import { NETWORK_FROM_SLUG } from "@dexkit/core/constants/networks";
import { Asset } from "@dexkit/core/types/nft";
import {
  getChainIdFromSlug,
  getNetworkSlugFromChainId,
} from "@dexkit/core/utils/blockchain";
import {
  getApiMultipleAssets,
  getAssetData,
  getAssetMetadata,
  getAssetProtocol,
} from ".";
import { getAssetDexKitApi } from "../../../constants/api";
import { getProviderBySlug } from "../../../services/providers";
import { AppPageSection } from "../../wizard/types/section";
import { GET_ASSET_BY_API, GET_ASSET_DATA, GET_ASSET_METADATA } from "../hooks";
import { GET_COLLECTION_DATA } from "../hooks/collection";
import { AssetAPI } from "../types";
import {
  getWhereNFTQuery,
  parseNFTPageEditorConfig,
  returnNFTmap,
} from "../utils/query";
// The editor core
import { Value } from "@react-page/editor";
import { QueryClient } from "@tanstack/react-query";

/**
 * Server side function to refetch query client data
 */
export async function fetchAssetForQueryClient({
  item,
  queryClient,
}: {
  item: { chainId: ChainId; contractAddress: string; tokenId: string };
  queryClient: QueryClient;
}) {
  const slug = getNetworkSlugFromChainId(item.chainId);

  if (slug === undefined) {
    return;
  }
  let assetApi: AssetAPI | undefined;
  try {
    assetApi = await getAssetDexKitApi({
      networkId: slug,
      contractAddress: item.contractAddress,
      tokenId: item.tokenId,
    });
  } catch (e) {
    console.log(e);
    console.log(
      `fetchAsset: error fetching token ${item.tokenId}, address: ${item.contractAddress} at ${slug} from api`,
    );
  }

  if (assetApi) {
    const provider = getProviderBySlug(slug);

    await provider?.ready;

    const asset = await getAssetData(
      provider,
      item.contractAddress,
      item.tokenId,
      undefined,
      slug,
    );

    const rawMetadata = assetApi.rawData
      ? JSON.parse(assetApi.rawData)
      : undefined;
    let image = assetApi?.imageUrl;

    if (
      rawMetadata &&
      rawMetadata?.image &&
      (rawMetadata?.image as string).endsWith(".gif")
    ) {
      image = rawMetadata?.image;
    }

    const newAsset: Asset = {
      id: assetApi.tokenId,
      chainId: getChainIdFromSlug(slug)?.chainId as ChainId,
      contractAddress: assetApi.address,
      tokenURI: assetApi.tokenURI || "",
      collectionName: assetApi.collectionName || "",
      symbol: assetApi.symbol || "",
      protocol: assetApi?.protocol,
      metadata: { ...rawMetadata, image },
      owner: asset?.owner,
    };

    await queryClient.prefetchQuery(
      [GET_ASSET_DATA, item.contractAddress, item.tokenId],
      async () => newAsset,
    );

    await queryClient.prefetchQuery(
      [GET_ASSET_METADATA, newAsset.tokenURI],
      async () => {
        return { ...rawMetadata, image: assetApi?.imageUrl };
      },
    );
  } else {
    const provider = getProviderBySlug(slug);

    await provider?.ready;

    const protocol = await getAssetProtocol(provider, item.contractAddress);

    const isERC1155 = protocol === "ERC1155";
    const asset = await getAssetData(
      provider,
      item.contractAddress,
      item.tokenId,
      undefined,
      slug,
    );

    if (asset) {
      await queryClient.prefetchQuery(
        [GET_ASSET_DATA, item.contractAddress, item.tokenId],
        async () => asset,
      );

      const metadata = await getAssetMetadata(
        asset.tokenURI,
        {
          image: "",
          name: `${asset.collectionName} #${asset.id}`,
        },
        isERC1155,
        item.tokenId,
      );

      await queryClient.prefetchQuery(
        [GET_ASSET_METADATA, asset.tokenURI, asset.id, asset.protocol],
        async () => {
          return metadata;
        },
      );
    }
  }
}

/**
 * Server side function to refetch query client data
 */
export async function fetchMultipleAssetForQueryClient({
  sections,
  queryClient,
}: {
  sections: AppPageSection[];
  queryClient: QueryClient;
}) {
  try {
    let assetsToFetch = new Map<number, Map<string, Set<string>>>();

    for (let section of sections) {
      if (
        section.type === "featured" ||
        section.type === "call-to-action" ||
        section.type === "collections"
      ) {
        for (let item of section.items) {
          if (item.type === "asset" && item.tokenId !== undefined) {
            assetsToFetch = returnNFTmap({
              address: item.contractAddress.toLowerCase(),
              chainId: item.chainId,
              tokenId: item.tokenId,
              currentMap: assetsToFetch,
            });
          }

          if (item.type === "collection") {
            await queryClient.prefetchQuery(
              [GET_COLLECTION_DATA, item.contractAddress, item.chainId],
              async () => {
                return {
                  name: item.title || " ",
                  symbol: " ",
                  address: item.contractAddress,
                  chainId: item.chainId,
                };
              },
            );
          }
        }
      }
      if (section.type === "asset-section") {
        const data = section.config;
        assetsToFetch = returnNFTmap({
          address: data.address.toLowerCase(),
          chainId: NETWORK_FROM_SLUG(data.network)?.chainId,
          tokenId: data.tokenId,
          currentMap: assetsToFetch,
        });
      }
      if (section.type === "custom") {
        const config = section.data
          ? (JSON.parse(section.data) as Value)
          : undefined;
        if (config) {
          const editorNfts = parseNFTPageEditorConfig({ config });

          for (const item of editorNfts) {
            assetsToFetch = returnNFTmap({
              address: item.contractAddress.toLowerCase(),
              chainId: NETWORK_FROM_SLUG(item.network)?.chainId,
              tokenId: item.id,
              currentMap: assetsToFetch,
            });
          }
        }
      }
    }

    const query = getWhereNFTQuery({ mapData: assetsToFetch });

    const assets = await getApiMultipleAssets({ query });

    if (assets) {
      for (const assetApi of assets) {
        const rawMetadata = assetApi.rawData
          ? JSON.parse(assetApi.rawData)
          : undefined;
        let image = assetApi?.imageUrl;

        if (
          rawMetadata &&
          rawMetadata?.image &&
          (rawMetadata?.image as string).endsWith(".gif")
        ) {
          image = rawMetadata?.image;
        }
        const chainId = getChainIdFromSlug(assetApi.networkId)
          ?.chainId as ChainId;

        const newAsset: Asset = {
          id: assetApi.tokenId,
          chainId: chainId,
          contractAddress: assetApi.address,
          tokenURI: assetApi.tokenURI || "",
          collectionName: assetApi.collectionName || "",
          symbol: assetApi.symbol || "",
          metadata: { ...rawMetadata, image },
        };

        await queryClient.prefetchQuery(
          [GET_ASSET_DATA, assetApi.address, assetApi.tokenId],
          async () => newAsset,
        );

        await queryClient.prefetchQuery(
          [GET_ASSET_BY_API, chainId, assetApi.address, assetApi.tokenId],
          async () => newAsset,
        );

        await queryClient.prefetchQuery(
          [GET_ASSET_METADATA, newAsset.tokenURI],
          async () => {
            return { ...rawMetadata, image: assetApi?.imageUrl };
          },
        );
      }
    }
  } catch (e) {
    console.error("error fetching multiple assets", e);
  }
}
