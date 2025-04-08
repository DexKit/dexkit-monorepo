import { ChainId } from "@dexkit/core/constants";
import { UserEvents } from "@dexkit/core/constants/userEvents";
import { Token } from "@dexkit/core/types";
import { useTrackUserEventsMutation } from "@dexkit/ui/hooks/userEvents";
import { ZeroExApiClient } from "@dexkit/ui/modules/swap/services/zrxClient";
import { SiteContext } from "@dexkit/ui/providers/SiteProvider";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useContext } from "react";

export function useMarketTradeGaslessExec({
  onNotification,
}: {
  onNotification: (params: any) => void;
}) {
  const { siteId } = useContext(SiteContext);

  const trackUserEvent = useTrackUserEventsMutation();

  return useMutation(
    async ({
      quote,
      trade,
      approval,
      chainId,
      sellToken,
      buyToken,
      side,
    }: {
      quote: any;
      trade: any;
      approval?: any;
      chainId?: number;
      sellToken: Token;
      buyToken: Token;
      side: "sell" | "buy";
    }) => {
      if (!chainId) {
        return null;
      }

      const client = new ZeroExApiClient(chainId, siteId);

      try {
        const { tradeHash } = await client.submitGasless({
          trade,
          approval,
          chainId: chainId.toString(),
        });

        trackUserEvent.mutate({
          event:
            side === "buy"
              ? UserEvents.marketBuyGasless
              : UserEvents.marketSellGasless,
          chainId,
          metadata: JSON.stringify({
            quote: quote,
          }),
        });

        return tradeHash;
      } catch (err) {
        throw err;
      }
    }
  );
}

export function useMarketGaslessTradeStatusQuery({
  chainId,
  tradeHash,
  canGasless,
}: {
  chainId?: ChainId;
  tradeHash: string | undefined;
  canGasless?: boolean;
}) {
  const { siteId } = useContext(SiteContext);

  return useQuery(
    ["useMarketGaslessTradeStatusQuery", tradeHash],
    async ({ signal }) => {
      if (!tradeHash || !chainId) {
        return null;
      }

      const client = new ZeroExApiClient(chainId, siteId);

      try {
        const status = await client.submitStatusGasless(
          { tradeHash },
          { signal }
        );

        return status;
      } catch (err) {
        throw err;
      }
    },
    {
      enabled: Boolean(tradeHash) && Boolean(chainId) && canGasless,
      refetchInterval: 2000,
    }
  );
}
