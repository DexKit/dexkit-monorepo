import { ChainId } from "@dexkit/core";
import { ZeroExApiClient } from "@dexkit/ui/modules/swap/services/zrxClient";
import {
  ZeroExQuote,
  ZeroExQuoteGasless,
  ZrxOrderRecord,
  ZrxOrderbookResponse,
} from "@dexkit/ui/modules/swap/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getZrxExchangeAddress } from "../utils";

import { ZrxOrder } from "@dexkit/ui/modules/swap/types";
import type { providers } from "ethers";
import { BigNumber, Contract } from "ethers";
import { useContext } from "react";
import { ZRX_EXCHANGE_ABI } from "../constants/zrx";

import { SiteContext } from "@dexkit/ui/providers/SiteProvider";

export const ZRX_ORDERBOOK_QUERY = "ZRX_ORDERBOOK_QUERY";
export const ZRX_ORDERBOOK_ORDER_QUERY = "ZRX_ORDERBOOK_ORDER_QUERY";

export function useZrxQuoteMutation({
  chainId,
  useGasless,
}: {
  chainId?: ChainId;
  useGasless?: boolean;
}) {
  const { siteId } = useContext(SiteContext);

  return useMutation(async (params: ZeroExQuote | ZeroExQuoteGasless) => {
    if (!chainId) {
      return null;
    }

    const zrxClient = new ZeroExApiClient(chainId, siteId);

    if (useGasless) {
      let gaslessParams = params as ZeroExQuoteGasless;

      return zrxClient.quoteGasless(gaslessParams, {});
    } else {
      return zrxClient.quote(params as ZeroExQuote, {});
    }
  });
}

export function useZrxPriceMutation({
  chainId,
  useGasless,
}: {
  chainId?: ChainId;
  useGasless?: boolean;
}) {
  const { siteId } = useContext(SiteContext);

  return useMutation(async (params: ZeroExQuote | ZeroExQuoteGasless) => {
    if (!chainId) {
      return null;
    }

    const zrxClient = new ZeroExApiClient(chainId, siteId);

    if (useGasless) {
      let gaslessParams = params as ZeroExQuoteGasless;

      return zrxClient.priceGasless(gaslessParams, {});
    } else {
      return zrxClient.price(params as ZeroExQuote, {});
    }
  });
}

export function useZrxOrderbook({
  chainId,
  account,
}: {
  chainId?: ChainId;
  account?: string;
}) {
  const { siteId } = useContext(SiteContext);

  return useQuery<ZrxOrderbookResponse | null>(
    [ZRX_ORDERBOOK_QUERY, account, chainId],
    async () => {
      if (!chainId || !account) {
        return null;
      }

      const zrxClient = new ZeroExApiClient(chainId, siteId);
      return await zrxClient.orderbook({ trader: account });
    }
  );
}

export function useZrxOrderbookOrder({
  hash,
  chainId,
}: {
  hash?: string;
  chainId?: ChainId;
}) {
  const { siteId } = useContext(SiteContext);
  return useQuery<ZrxOrderRecord | null>(
    [ZRX_ORDERBOOK_ORDER_QUERY, hash],
    async () => {
      if (!hash || !chainId) {
        return null;
      }

      const zrxClient = new ZeroExApiClient(chainId, siteId);

      return await zrxClient.order(hash);
    }
  );
}

export function useZrxFillOrderMutation() {
  // const trackUserEvent = useTrackUserEventsMutation();
  return useMutation(
    async ({
      chainId,
      signer,
      order,
      fillAmount,
    }: {
      chainId?: ChainId;
      signer?: providers.JsonRpcSigner;
      order: ZrxOrder;
      fillAmount?: BigNumber;
    }) => {
      const contractAddress = getZrxExchangeAddress(chainId);

      if (!contractAddress || !signer || !chainId) {
        throw new Error("no provider or contract address");
      }

      const contract = new Contract(
        contractAddress,
        ZRX_EXCHANGE_ABI,
        signer
      );

      // let newOrder = new LimitOrder({
      //   makerToken: order.makerToken,
      //   takerToken: order.takerToken,
      //   makerAmount: new BigNumber(order.makerAmount), // NOTE: This is 1 WEI, 1 ETH would be 1000000000000000000
      //   takerAmount: new BigNumber(order.takerAmount), // NOTE this is 0.001 ZRX. 1 ZRX would be 1000000000000000000
      //   salt: new BigNumber(Date.now()),
      //   taker: constants.AddressZero,
      //   sender: constants.AddressZero,
      //   expiry: new BigNumber(order.expiry),
      //   maker: order.maker,
      //   chainId: order.chainId,
      //   verifyingContract: getZrxExchangeAddress(chainId),
      //   feeRecipient: order.feeRecipient,
      //   pool: order.pool,
      //   takerTokenFeeAmount: new BigNumber(order.takerTokenFeeAmount),
      // });

      const tx = await contract.fillLimitOrder(
        order,
        order.signature,
        fillAmount?.toString()
      );

      // trackUserEvent.mutate({
      //   event: UserEvents.swap,
      //   hash: tx.hash,
      //   chainId,
      //   metadata: JSON.stringify({
      //     order,
      //   }),
      // });

      return tx.hash;
    }
  );
}
