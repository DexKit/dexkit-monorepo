import { getTokensBalance } from "@dexkit/core/services";
import { Token } from "@dexkit/core/types";
import { useQuery } from "@tanstack/react-query";
import type { Account } from "thirdweb/wallets";

export const MULTI_TOKEN_BALANCE_QUERY = "MULTI_TOKEN_BALANCE_QUERY";

export function useMultiTokenBalance({
  tokens,
  activeAccount,
  chainId
}: {
  activeAccount?: Account;
  tokens?: Token[];
  chainId?: number;
}) {
  //const enabled = Boolean(tokens && provider && account);

  return useQuery(
    [MULTI_TOKEN_BALANCE_QUERY, tokens, chainId, activeAccount],
    async () => {

      if (!tokens || !chainId || !activeAccount) {
        return null;
      }

      return await getTokensBalance({
        tokens: tokens
          .filter((t) => t.chainId === chainId)
          .map((t) => ({ contractAddress: t.address })),
        activeAccount: activeAccount,
        chainId
      }
      );
    },
    {
      refetchOnMount: "always",
      refetchOnWindowFocus: "always",
      staleTime: 1000,

    }
  );
}
