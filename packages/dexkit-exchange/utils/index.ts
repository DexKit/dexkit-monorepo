import { getContractAddressesForChainOrThrow } from "@0x/contract-addresses";
import { LimitOrder, SignatureType } from "@0x/protocol-utils";
import { ChainId } from "@dexkit/core";
import { Token } from "@dexkit/core/types";
import { isAddressEqual } from "@dexkit/core/utils";
import { parseUnits } from "@dexkit/core/utils/ethers/parseUnits";
import { BigNumber } from "bignumber.js";
import { BigNumber as EthersBigNumber, constants, providers } from "ethers";

export const EIP712_DOMAIN_PARAMETERS = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "chainId", type: "uint256" },
  { name: "verifyingContract", type: "address" },
];

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
    Math.floor(new Date().valueOf() / 1000) + seconds.toNumber(),
  );
};

export interface CreateZrxOrderParams {
  provider: providers.Web3Provider;
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
  provider,
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
      getExpirationTimeFromSeconds(new BigNumber(expirationTime)),
    ),
    maker,
    chainId,
    verifyingContract: getZrxExchangeAddress(chainId),
  };

  let order = new LimitOrder(params);

  if (window.ethereum) {
    const signature = await order.getSignatureWithProviderAsync(
      window.ethereum as any,
      SignatureType.EIP712,
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
  constructor() {}

  public multiply(
    bn: EthersBigNumber | string,
    number: number | string,
  ): EthersBigNumber {
    const bnForSure = EthersBigNumber.from(bn);
    const numberBN = parseUnits(number.toString() || "0.0", 18);

    return bnForSure.mul(numberBN).div(this.oneBN);
  }

  public divide(
    bn: EthersBigNumber | string,
    number: number | string,
  ): EthersBigNumber {
    const bnForSure = EthersBigNumber.from(bn);
    const numberBN = parseUnits(number.toString() || "0.0", 18);

    return bnForSure.div(numberBN).div(this.oneBN);
  }
}
