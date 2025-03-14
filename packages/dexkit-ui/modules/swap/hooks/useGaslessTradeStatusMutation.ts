import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { SiteContext } from "../../../providers/SiteProvider";
import { ZeroExApiClient } from "../services/zrxClient";

export function useGaslessTradeStatusMutation({
  zeroExApiKey,
}: {
  zeroExApiKey?: string;
}) {
  const { siteId } = useContext(SiteContext);

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

      const client = new ZeroExApiClient(chainId, siteId);

      try {
        const status = await client.submitStatusGasless({ tradeHash }, {});

        return status;
      } catch (err) {
        throw err;
      }
    }
  );
}
