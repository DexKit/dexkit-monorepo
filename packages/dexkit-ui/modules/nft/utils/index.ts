import { ChainId } from "@dexkit/core/constants";
import { Asset, AssetMetadata } from "@dexkit/core/types/nft";
import { getNetworkSlugFromChainId } from "@dexkit/core/utils/blockchain";
import { UserFacingFeeStruct } from "@traderxyz/nft-swap-sdk";
import { BigNumber } from "ethers";
import { NETWORK_ID } from "../../../constants/enum";
import {
  IS_CHAIN_SUPPORTED_BY_RARIBLE,
  MARKETPLACES,
  MARKETPLACES_INFO,
} from "../constants/marketplaces";
import { AssetAPI, AssetBalance } from "../types";

export function truncateErc1155TokenId(id?: string) {
  if (id === undefined) {
    return "";
  }
  if (id.length < 12) {
    return id;
  }

  return `${String(id).substring(0, 6)}...${String(id).substring(id.length - 6, id.length)}`;
}

export function getNFTMediaSrcAndType(
  address: string,
  chainId: ChainId,
  tokenId: string,
  metadata?: AssetMetadata,
): { type: "iframe" | "image" | "gif" | "mp4"; src?: string } {
  if (
    address.toLowerCase() === "0x5428dff180837ce215c8abe2054e048da311b751" &&
    chainId === ChainId.Polygon
  ) {
    return {
      type: "iframe",
      src: `https://arpeggi.io/player?type=song&token=${tokenId}`,
    };
  }
  if (metadata && metadata.animation_url) {
    return { type: "mp4" };
  }

  return { type: "image" };
}

export function calculeFees(
  amount: BigNumber,
  decimals: number,
  fees: { amount_percentage: number; recipient: string }[],
): UserFacingFeeStruct[] {
  let tempFees: UserFacingFeeStruct[] = [];

  for (let fee of fees) {
    tempFees.push({
      amount: amount
        .mul((fee.amount_percentage * 100).toFixed(0))
        .div(10000)
        .toString(),
      recipient: fee.recipient,
    });
  }

  return tempFees;
}

export function parseAssetApi(assetApi?: AssetAPI): Asset | undefined {
  if (!assetApi) {
    return;
  }

  const rawMetadata = assetApi.rawData
    ? JSON.parse(assetApi.rawData)
    : undefined;
  const newAsset: Asset = {
    id: assetApi.tokenId,
    chainId: assetApi.chainId as ChainId,
    contractAddress: assetApi.address,
    tokenURI: assetApi.tokenURI || "",
    collectionName: assetApi.collectionName || "",
    symbol: assetApi.symbol || "",
    metadata: { ...rawMetadata, image: assetApi?.imageUrl },
    protocol: assetApi.protocol,
  };
  return newAsset;
}

export function isENSContract(address: string) {
  if (
    address.toLowerCase() ===
    "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85".toLowerCase()
  ) {
    return true;
  } else {
    false;
  }
}

export function getAssetProtocol(asset?: Asset) {
  return asset?.protocol === "ERC1155" ? "ERC1155" : "ERC721";
}

export function isERC1155Owner(assetBalance?: AssetBalance) {
  return (
    assetBalance?.balance?.gt(0) && assetBalance.asset.protocol === "ERC1155"
  );
}

export function getMarketplaceForAssetURL(
  platform: MARKETPLACES,
  asset?: Asset,
) {
  if (platform === MARKETPLACES.OPEN_SEA && asset?.chainId !== ChainId.Fantom) {
    const openSeaInfo = MARKETPLACES_INFO[MARKETPLACES.OPEN_SEA];
    const networkSlug = getNetworkSlugFromChainId(asset?.chainId) as NETWORK_ID;
    //@ts-ignore
    const net = networkSlug ? openSeaInfo.networkMapping[networkSlug] : "";

    return `${openSeaInfo.baseAssetUrl}${net}/${asset?.contractAddress}/${asset?.id}`;
  }
  if (
    platform === MARKETPLACES.LOOKS_RARE &&
    asset?.chainId !== ChainId.Ethereum
  ) {
    const marketplaceInfo = MARKETPLACES_INFO[MARKETPLACES.LOOKS_RARE];
    return `${marketplaceInfo.baseAssetUrl}${asset?.contractAddress}/${asset?.id}`;
  }

  if (
    platform === MARKETPLACES.SUDOSWAP &&
    asset?.chainId !== ChainId.Ethereum
  ) {
    const marketplaceInfo = MARKETPLACES_INFO[MARKETPLACES.SUDOSWAP];
    return `${marketplaceInfo.baseAssetUrl}${asset?.contractAddress}/${asset?.id}`;
  }

  if (
    platform === MARKETPLACES.RARIBLE &&
    IS_CHAIN_SUPPORTED_BY_RARIBLE(asset?.chainId)
  ) {
    const marketplaceInfo = MARKETPLACES_INFO[MARKETPLACES.RARIBLE];
    const networkSlug = getNetworkSlugFromChainId(asset?.chainId) as any;
    //@ts-ignore
    const net = networkSlug ? marketplaceInfo.networkMapping[networkSlug] : "";
    return `${marketplaceInfo.baseAssetUrl}${net}/${asset?.contractAddress}:${asset?.id}`;
  }
}
