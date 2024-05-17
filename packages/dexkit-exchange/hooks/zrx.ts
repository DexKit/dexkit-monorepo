import { ChainId } from "@dexkit/core";
import { ZeroExApiClient } from "@dexkit/zrx-swap/services";
import {
  ZeroExQuote,
  ZeroExQuoteGasless,
  ZrxOrderRecord,
  ZrxOrderbookResponse,
} from "@dexkit/zrx-swap/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getZrxExchangeAddress } from "../utils";

import { ZrxOrder } from "@dexkit/zrx-swap/types";
import type { providers } from 'ethers';
import { BigNumber, Contract } from "ethers";
import { useContext } from "react";
import { ZRX_EXCHANGE_ABI } from "../constants/zrx";

import { SiteContext } from "@dexkit/ui/providers/SiteProvider";

export function useZrxQuoteMutation({ chainId, useGasless }: { chainId?: ChainId, useGasless?: boolean }) {
  const { siteId } = useContext(SiteContext);

  return useMutation(async (params: ZeroExQuote | ZeroExQuoteGasless) => {
    if (!chainId) {
      return null;
    }

    const zrxClient = new ZeroExApiClient(
      chainId,
      process.env.NEXT_PUBLIC_ZRX_API_KEY,
      siteId
    );

    if (useGasless) {
      let gaslessParams = params as ZeroExQuoteGasless;
      if (params.intentOnFilling) {
        return zrxClient.quoteGasless(gaslessParams, {});
      } else {
        return zrxClient.priceGasless(gaslessParams, {});
      }

    } else {
      return zrxClient.quote(params as ZeroExQuote, {});
    }
  });
}


export function useZrxQuoteQuery({ chainId, params, useGasless }: { chainId?: ChainId, params: ZeroExQuote | ZeroExQuoteGasless, useGasless?: boolean }) {
  const { siteId } = useContext(SiteContext);

  return useQuery([chainId, params, params.skipValidation], async () => {
    if (!chainId || !(params.buyAmount || params.sellAmount)) {
      return null;
    }

    const zrxClient = new ZeroExApiClient(
      chainId,
      process.env.NEXT_PUBLIC_ZRX_API_KEY,
      siteId
    );

    if (useGasless) {
      let gaslessParams = params as ZeroExQuoteGasless;
      if (params.skipValidation === false) {
        return zrxClient.quoteGasless(gaslessParams, {});
      } else {
        return zrxClient.priceGasless(gaslessParams, {});
      }

    } else {
      return zrxClient.quote(params as ZeroExQuote, {});
    }


  });
}

export const ZRX_ORDERBOOK_QUERY = "ZRX_ORDERBOOK_QUERY";

export function useZrxOrderbook({
  chainId,
  account,
}: {
  chainId?: ChainId;
  account?: string;
}) {
  return useQuery<ZrxOrderbookResponse | null>(
    [ZRX_ORDERBOOK_QUERY, account, chainId],
    async () => {
      if (!chainId || !account) {
        return null;
      }

      const zrxClient = new ZeroExApiClient(
        chainId,
        process.env.NEXT_PUBLIC_ZRX_API_KEY
      );

      return await zrxClient.orderbook({ trader: account });
    }
  );
}

export const ZRX_ORDERBOOK_ORDER_QUERY = "ZRX_ORDERBOOK_ORDER_QUERY";

export function useZrxOrderbookOrder({
  hash,
  chainId,
}: {
  hash?: string;
  chainId?: ChainId;
}) {
  return useQuery<ZrxOrderRecord | null>(
    [ZRX_ORDERBOOK_ORDER_QUERY, hash],
    async () => {
      if (!hash || !chainId) {
        return null;
      }

      const zrxClient = new ZeroExApiClient(
        chainId,
        process.env.NEXT_PUBLIC_ZRX_API_KEY
      );

      return await zrxClient.order(hash);
    }
  );
}



export function useZrxFillOrderMutation() {
  // const trackUserEvent = useTrackUserEventsMutation();
  return useMutation(
    async ({
      chainId,
      provider,
      order,
      fillAmount,
    }: {
      chainId?: ChainId;
      provider?: providers.Web3Provider;
      order: ZrxOrder;
      fillAmount?: BigNumber;
    }) => {
      const contractAddress = getZrxExchangeAddress(chainId);


      if (!contractAddress || !provider || !chainId) {
        throw new Error("no provider or contract address");
      }

      const contract = new Contract(
        contractAddress,
        ZRX_EXCHANGE_ABI,
        provider.getSigner()
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
