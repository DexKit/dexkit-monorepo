import { ChainId } from "@dexkit/core/constants";
import { Asset, AssetMetadata } from "@dexkit/core/types/nft";
import { ipfsUriToUrl } from "@dexkit/core/utils";
import { getNetworkSlugFromChainId } from "@dexkit/core/utils/blockchain";
import { UserFacingFeeStruct } from '@traderxyz/nft-swap-sdk';
import { BigNumber } from "ethers";
import { NETWORK_ID } from "../../../constants/enum";
import { IS_CHAIN_SUPPORTED_BY_RARIBLE, MARKETPLACES, MARKETPLACES_INFO } from "../constants/marketplaces";
import { AssetAPI, AssetBalance } from "../types";

const contentTypeCache = new Map<string, Promise<string | null>>();

export async function detectIPFSContentType(url: string): Promise<string | null> {
  const normalizedUrl = ipfsUriToUrl(url);

  if (contentTypeCache.has(normalizedUrl)) {
    return contentTypeCache.get(normalizedUrl)!;
  }

  const contentTypePromise = (async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(normalizedUrl, {
        method: 'HEAD',
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const contentType = response.headers.get('content-type');
      return contentType;
    } catch (error) {
      console.warn(`Failed to detect Content-Type for ${normalizedUrl}:`, error);
      return null;
    }
  })();

  contentTypeCache.set(normalizedUrl, contentTypePromise);

  setTimeout(() => {
    contentTypeCache.delete(normalizedUrl);
  }, 10 * 60 * 1000);

  return contentTypePromise;
}

export function getMediaTypeFromContentType(contentType: string | null): 'image' | 'mp4' | 'audio' | null {
  if (!contentType) return null;

  const lowerContentType = contentType.toLowerCase();

  if (lowerContentType.startsWith('image/')) {
    return 'image';
  }

  if (lowerContentType.startsWith('video/')) {
    return 'mp4';
  }

  if (lowerContentType.startsWith('audio/')) {
    return 'audio';
  }

  return null;
}

export function truncateErc1155TokenId(id?: string) {
  if (id === undefined) {
    return '';
  }
  if (id.length < 12) {
    return id;
  }

  return `${String(id).substring(0, 6)}...${String(id).substring(id.length - 6, id.length)}`;
}

export function getNFTMediaSrcAndType(address: string, chainId: ChainId, tokenId: string, metadata?: AssetMetadata): { type: 'iframe' | 'image' | 'gif' | 'mp4' | 'audio', src?: string, needsContentTypeDetection?: boolean } {

  if (address.toLowerCase() === '0x5428dff180837ce215c8abe2054e048da311b751' && chainId === ChainId.Polygon) {
    return { type: 'iframe', src: `https://arpeggi.io/player?type=song&token=${tokenId}` }
  }

  if (metadata && metadata.animation_url) {
    const animationUrl = metadata.animation_url.toLowerCase();

    if (animationUrl.includes('.mp3') || animationUrl.includes('.wav') || animationUrl.includes('.ogg') || animationUrl.includes('.flac') || animationUrl.includes('.m4a')) {
      return { type: 'audio', src: metadata.animation_url };
    }
    else if (animationUrl.includes('.mp4') || animationUrl.includes('.mov') || animationUrl.includes('.webm') || animationUrl.includes('.avi')) {
      return { type: 'mp4', src: metadata.animation_url };
    }
    else {
      const isIpfsUrl = animationUrl.includes('ipfs') || animationUrl.includes('dweb.link') || animationUrl.includes('/ipfs/');
      if (isIpfsUrl) {
        const urlPath = metadata.animation_url.split('?')[0].split('#')[0];
        const hasVideoExtension = /\.(mp4|mov|webm|avi|mkv)$/i.test(urlPath);
        const hasAudioExtension = /\.(mp3|wav|ogg|flac|m4a)$/i.test(urlPath);
        const hasImageExtension = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|avif)$/i.test(urlPath);

        if (!hasVideoExtension && !hasAudioExtension && !hasImageExtension) {
          return { type: 'mp4', src: metadata.animation_url, needsContentTypeDetection: true };
        }
      }
      return { type: 'mp4', src: metadata.animation_url };
    }
  }

  if (metadata && metadata.image) {
    const imageUrl = metadata.image.toLowerCase();

    if (imageUrl.includes('.mp4') || imageUrl.includes('.mov') || imageUrl.includes('.webm') || imageUrl.includes('.avi')) {
      return { type: 'mp4', src: metadata.image };
    }

    if (imageUrl.includes('.mp3') || imageUrl.includes('.wav') || imageUrl.includes('.ogg') || imageUrl.includes('.flac') || imageUrl.includes('.m4a')) {
      return { type: 'audio', src: metadata.image };
    }

    const isIpfsUrl = imageUrl.includes('ipfs') || imageUrl.includes('dweb.link') || imageUrl.includes('/ipfs/');
    if (isIpfsUrl) {
      const urlPath = metadata.image.split('?')[0].split('#')[0];
      const hasImageExtension = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|avif)$/i.test(urlPath);
      const hasVideoExtension = /\.(mp4|mov|webm|avi|mkv)$/i.test(urlPath);
      const hasAudioExtension = /\.(mp3|wav|ogg|flac|m4a)$/i.test(urlPath);

      if (!hasImageExtension && !hasVideoExtension && !hasAudioExtension) {
        return { type: 'image', src: metadata.image, needsContentTypeDetection: true };
      }
    }
  }

  return { type: 'image' }
}

export function calculeFees(
  amount: BigNumber,
  decimals: number,
  fees: { amount_percentage: number; recipient: string }[]
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
    tokenURI: assetApi.tokenURI || '',
    collectionName: assetApi.collectionName || '',
    symbol: assetApi.symbol || '',
    metadata: { ...rawMetadata, image: assetApi?.imageUrl },
    protocol: assetApi.protocol
  };
  return newAsset
}

export function isENSContract(address: string) {
  if (address.toLowerCase() === '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85'.toLowerCase()) {
    return true;
  } else {
    false;
  }

}

export function getAssetProtocol(asset?: Asset) {
  return asset?.protocol === 'ERC1155' ? 'ERC1155' : 'ERC721';
}


export function isERC1155Owner(assetBalance?: AssetBalance) {
  return assetBalance?.balance?.gt(0) && assetBalance.asset.protocol === 'ERC1155'
}


export function getMarketplaceForAssetURL(platform: MARKETPLACES, asset?: Asset) {
  if (platform === MARKETPLACES.OPEN_SEA) {
    const openSeaInfo = MARKETPLACES_INFO[MARKETPLACES.OPEN_SEA];
    const networkSlug = getNetworkSlugFromChainId(asset?.chainId) as NETWORK_ID;
    //@ts-ignore
    const net = networkSlug ? openSeaInfo.networkMapping[networkSlug] : ''

    return `${openSeaInfo.baseAssetUrl}${net}/${asset?.contractAddress}/${asset?.id}`
  }
  if (platform === MARKETPLACES.LOOKS_RARE && asset?.chainId !== ChainId.Ethereum) {
    const marketplaceInfo = MARKETPLACES_INFO[MARKETPLACES.LOOKS_RARE];
    return `${marketplaceInfo.baseAssetUrl}${asset?.contractAddress}/${asset?.id}`
  }

  if (platform === MARKETPLACES.SUDOSWAP && asset?.chainId !== ChainId.Ethereum) {
    const marketplaceInfo = MARKETPLACES_INFO[MARKETPLACES.SUDOSWAP];
    return `${marketplaceInfo.baseAssetUrl}${asset?.contractAddress}/${asset?.id}`
  }

  if (platform === MARKETPLACES.RARIBLE && (IS_CHAIN_SUPPORTED_BY_RARIBLE(asset?.chainId))) {
    const marketplaceInfo = MARKETPLACES_INFO[MARKETPLACES.RARIBLE];
    const networkSlug = getNetworkSlugFromChainId(asset?.chainId) as any;
    //@ts-ignore
    const net = networkSlug ? marketplaceInfo.networkMapping[networkSlug] : ''
    return `${marketplaceInfo.baseAssetUrl}${net}/${asset?.contractAddress}:${asset?.id}`
  }




}


