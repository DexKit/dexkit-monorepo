import { isIpfsUri } from "@dexkit/core/utils/ipfs";
import { WHITELISTED_IMAGE_DOMAINS } from "../constants";



export function isWhitelistedDomain(src: string) {
  if (isIpfsUri(src)) {
    return src;
  } else {
    const imageUrl = new URL(src);
    return WHITELISTED_IMAGE_DOMAINS.includes(imageUrl.hostname);
  }
}