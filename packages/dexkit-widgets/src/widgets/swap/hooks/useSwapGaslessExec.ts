import { ChainId } from "@dexkit/core";
import { UserEvents } from "@dexkit/core/constants/userEvents";
import { Token } from "@dexkit/core/types";
import { useTrackUserEventsMutation } from "@dexkit/ui/hooks/userEvents";
import { useGaslessTrades } from "@dexkit/ui/modules/swap/hooks/useGaslessTrades";
import { ZeroExApiClient } from "@dexkit/ui/modules/swap/services/zrxClient";
import { ZeroExQuoteGasless } from "@dexkit/ui/modules/swap/types";
import { SiteContext } from "@dexkit/ui/providers/SiteProvider";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useContext } from "react";

export interface SwapGaslessExecParams {
  quote: ZeroExQuoteGasless;
  trade: any;
  approval: any;
  chainId: ChainId;
  onHash: (hash: string) => void;
  sellToken: Token;
  buyToken: Token;
}

export function useSwapGaslessExec({
  zeroExApiKey,
}: {
  zeroExApiKey?: string;
}) {
  const { siteId } = useContext(SiteContext);
  const [gaslessTrades, setGaslessTrades] = useGaslessTrades();

  const trackUserEvent = useTrackUserEventsMutation();

  return useMutation(
    async ({
      quote,
      trade,
      approval,
      chainId,
      sellToken,
      buyToken,
    }: SwapGaslessExecParams) => {
      if (!zeroExApiKey) {
        throw new Error("no api key");
      }
      const client = new ZeroExApiClient(chainId, zeroExApiKey, siteId);

      try {
        const { tradeHash } = await client.submitGasless({ trade, approval });

        /* onNotification({
           chainId,
           title: formatMessage({
             id: "swap.tokens",
             defaultMessage: "Swap Tokens", // TODO: add token symbols and amounts
           }),
           params: {
             type: "swapGasless",
             sellAmount: quote.sellAmount as string,
             buyAmount: quote.buyAmount as string,
             sellToken,
             buyToken,
           },
         });*/
        if (tradeHash) {
          gaslessTrades.push({
            type: "swap",
            chainId,
            tradeHash,
            values: {
              sellAmount: quote.sellAmount as string,
              buyAmount: quote.buyAmount as string,
              sellToken,
              buyToken,
            },
          });
          // We use this on gasless trade updater to issue swap trades notifications
          setGaslessTrades(gaslessTrades);
        }

        trackUserEvent.mutate({
          event: UserEvents.swapGasless,
          chainId,
          metadata: JSON.stringify({
            quote: quote,
          }),
        });

        return tradeHash;
      } catch (err) {
        throw err;
      }
    },
  );
}

export function useSwapGaslessTradeStatusQuery({
  zeroExApiKey,
  tradeHash,
  chainId,
}: {
  chainId?: ChainId;
  zeroExApiKey?: string;
  tradeHash: string | undefined;
}) {
  const { siteId } = useContext(SiteContext);

  return useQuery(
    [tradeHash],
    async ({ signal }) => {
      if (!zeroExApiKey) {
        throw new Error("no api key");
      }
      if (!tradeHash || !chainId) {
        return null;
      }

      const client = new ZeroExApiClient(chainId, zeroExApiKey, siteId);

      try {
        const status = await client.submitStatusGasless(
          { tradeHash },
          { signal },
        );

        return status;
      } catch (err) {
        throw err;
      }
    },
    { refetchInterval: 2000 },
  );
}
