import { getTokensBalance } from "@dexkit/core/services";
import { Token } from "@dexkit/core/types";
import { useQuery } from "@tanstack/react-query";
import { providers } from "ethers";

export const MULTI_TOKEN_BALANCE_QUERY = "MULTI_TOKEN_BALANCE_QUERY";

export function useMultiTokenBalance({
  tokens,
  account,
  provider,
  chainId,
}: {
  account?: string;
  tokens?: Token[];
  provider?: providers.BaseProvider;
  chainId?: number;
}) {
  //const enabled = Boolean(tokens && provider && account);

  return useQuery(
    [MULTI_TOKEN_BALANCE_QUERY, tokens, account, chainId],
    async () => {

      if (!tokens || !provider || !account) {
        return null;
      }


      await provider.ready;

      const chainId = (await provider.getNetwork()).chainId;

      return await getTokensBalance(
        tokens
          .filter((t) => t.chainId === chainId)
          .map((t) => ({ contractAddress: t.address })),
        provider,
        account
      );
    },
    {
      refetchOnMount: "always",
      refetchOnWindowFocus: "always",
      staleTime: 1000,
      enabled: Boolean(provider),
    }
  );
}
