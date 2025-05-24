import { TOKEN_ICON_URL } from "@dexkit/core";
import { Token } from "@dexkit/core/types";
import { arrayify } from "@dexkit/core/utils/ethers/arrayify";
import { secp256k1 } from "@noble/curves/secp256k1";
import { Hex, hexToNumber, Signature, toHex } from "viem";
import { SignatureType } from "../modules/swap/types";

export type SignatureExtended = Signature & {
  recoveryParam: number;
};

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

export async function splitSignature(signatureHex: Hex) {
  const { r, s } = secp256k1.Signature.fromCompact(signatureHex.slice(2, 130));
  const v = hexToNumber(`0x${signatureHex.slice(130)}`);
  const signatureType = SignatureType.EIP712;

  return padSignature({
    v: BigInt(v),
    r: toHex(r),
    s: toHex(s),
    recoveryParam: 1 - (v % 2),
  });

  function padSignature(signature: SignatureExtended): SignatureExtended {
    const hexLength = 64;

    const result = { ...signature };

    const hexExtractor = /^0(x|X)(\w+)$/;
    const rMatch = signature.r.match(hexExtractor);
    const rHex = rMatch ? rMatch[2] : undefined;
    if (rHex) {
      if (rHex.length !== hexLength) {
        result.r = `0x${rHex.padStart(hexLength, "0")}`;
      }
    }

    const sMatch = signature.s.match(hexExtractor);
    const sHex = sMatch ? sMatch[2] : undefined;
    if (sHex) {
      if (sHex.length !== hexLength) {
        result.s = `0x${sHex.padStart(hexLength, "0")}`;
      }
    }
    return result;
  }
}

export const stringToJson = (str: string) => {
  try {
    const cleanString = str.replace(/`([\s\S]*?)`/g, (_, content) => {
      const escaped = content
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"')
        .replace(/\n/g, "")
        .replace(/\r/g, "")
        .replace(/\$/g, "\\$");
      return `"${escaped}"`;
    });

    return JSON.parse(cleanString);
  } catch (e) {
    return str;
  }
};
