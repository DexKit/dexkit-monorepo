import { TOKEN_ICON_URL } from "@dexkit/core";
import { Token } from "@dexkit/core/types";
import { arrayify } from "@dexkit/core/utils/ethers/arrayify";

export function TOKEN_ICON_URL_V2(token: Token) {
  return token.logoURI
    ? token.logoURI
    : TOKEN_ICON_URL(token.address, token.chainId);
}

export function hexToString(hexValue?: string) {
  if (hexValue) {
    return new TextDecoder()
      .decode(arrayify(hexValue, { hexPad: "right" }))
      .replaceAll("\0", "");
  }

  return "";
}
