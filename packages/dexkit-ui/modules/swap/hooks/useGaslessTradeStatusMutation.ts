import { useMutation } from "@tanstack/react-query";
import { ZeroExApiClient } from "../services/zrxClient";

export function useGaslessTradeStatusMutation({
  zeroExApiKey,
}: {
  zeroExApiKey?: string;
}) {
  return useMutation(
    async ({
      tradeHash,
      chainId,
    }: {
      tradeHash?: string;
      chainId?: number;
    }) => {
      /* if (!zeroExApiKey) {
       throw new Error("no api key");
     }*/
      if (!tradeHash || !chainId) {
        return null;
      }

      const client = new ZeroExApiClient(chainId, zeroExApiKey);

      try {
        const status = await client.submitStatusGasless({ tradeHash }, {});

        return status;
      } catch (err) {
        throw err;
      }
    },
  );
}
