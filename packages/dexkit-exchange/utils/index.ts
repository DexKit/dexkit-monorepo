import { getContractAddressesForChainOrThrow } from "@0x/contract-addresses";
import { LimitOrder, SignatureType } from "@0x/protocol-utils";
import { ChainId } from "@dexkit/core";
import { Token } from "@dexkit/core/types";
import { isAddressEqual } from "@dexkit/core/utils";
import { parseUnits } from "@dexkit/core/utils/ethers/parseUnits";
import { secp256k1 } from "@noble/curves/secp256k1";
import { BigNumber } from "bignumber.js";
import { constants, BigNumber as EthersBigNumber, providers } from "ethers";
import { Hex, hexToNumber, Signature, toHex } from "viem";

export const EIP712_DOMAIN_PARAMETERS = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "chainId", type: "uint256" },
  { name: "verifyingContract", type: "address" },
];

export type SignatureExtended = Signature & {
  recoveryParam: number;
};

export const isTokenEqual = (token?: Token, other?: Token) => {
  if (!token || !other) {
    return false;
  }

  return (
    isAddressEqual(token.address, other.address) &&
    token.chainId === other.chainId
  );
};

export const getExpirationTimeFromSeconds = (seconds: BigNumber) => {
  return new BigNumber(
    Math.floor(new Date().valueOf() / 1000) + seconds.toNumber()
  );
};

export interface CreateZrxOrderParams {
  signer: providers.JsonRpcSigner;
  chainId: ChainId;
  maker?: string;
  makerToken: string;
  takerToken: string;
  makerAmount: BigNumber;
  takerAmount: BigNumber;
  expirationTime: number;
}

export async function createZrxOrder({
  maker,
  signer,
  chainId,
  makerToken,
  takerToken,
  makerAmount,
  takerAmount,
  expirationTime,
}: CreateZrxOrderParams) {
  let params: any = {
    makerToken,
    takerToken,
    makerAmount, // NOTE: This is 1 WEI, 1 ETH would be 1000000000000000000
    takerAmount, // NOTE this is 0.001 ZRX. 1 ZRX would be 1000000000000000000
    salt: new BigNumber(Date.now()),
    taker: constants.AddressZero,
    sender: constants.AddressZero,
    expiry: new BigNumber(
      getExpirationTimeFromSeconds(new BigNumber(expirationTime))
    ),
    maker,
    chainId,
    verifyingContract: getZrxExchangeAddress(chainId),
  };

  let order = new LimitOrder(params);

  if (signer) {
    const signature = await order.getSignatureWithProviderAsync(
      //window.ethereum as any,
      signer as any,
      SignatureType.EIP712
    );

    return { ...order, signature };
  }
}

export function getZrxExchangeAddress(chainId?: ChainId) {
  return chainId !== undefined
    ? getContractAddressesForChainOrThrow(chainId as number).exchangeProxy
    : undefined;
}

export class BigNumberUtils {
  protected oneBN: EthersBigNumber = parseUnits("1", 18);
  constructor() { }

  public multiply(
    bn: EthersBigNumber | string,
    number: number | string
  ): EthersBigNumber {
    const bnForSure = EthersBigNumber.from(bn);
    const numberBN = parseUnits(number.toString() || "0.0", 18);

    return bnForSure.mul(numberBN).div(this.oneBN);
  }

  public divide(
    bn: EthersBigNumber | string,
    number: number | string
  ): EthersBigNumber {
    const bnForSure = EthersBigNumber.from(bn);
    const numberBN = parseUnits(number.toString() || "0.0", 18);

    return bnForSure.div(numberBN).div(this.oneBN);
  }
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
