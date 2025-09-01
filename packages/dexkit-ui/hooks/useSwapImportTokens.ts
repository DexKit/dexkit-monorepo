import { ChainId, ZEROEX_NATIVE_TOKEN_ADDRESS } from "@dexkit/core";
import { Token } from "@dexkit/core/types";
import { isAddressEqual } from "@dexkit/core/utils";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useCallback, useMemo } from "react";

const swapImportTokensAtom = atomWithStorage<Token[]>("dexkit.swap.tokens", []);

export default function useSwapImportTokens({
  chainId,
}: {
  chainId?: ChainId;
}) {
  const [tokens, setTokens] = useAtom(swapImportTokensAtom);

  const tokenByChain = useMemo(() => {
    return tokens.filter((t) => t.chainId === chainId);
  }, [chainId]);

  const add = useCallback((token: Token) => {
    if (token.address.toLowerCase() === ZEROEX_NATIVE_TOKEN_ADDRESS.toLowerCase()) {
      return;
    }
    
    const found = tokens.find(
      (t) =>
        t.chainId === token.chainId && isAddressEqual(token.address, t.address)
    );

    if (!found) {
      setTokens((t) => [...t, token]);
    }
  }, []);

  return { tokens: tokenByChain, add };
}
