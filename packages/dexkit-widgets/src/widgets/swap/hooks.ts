

import { ChainId } from "@dexkit/core";
import { Token } from "@dexkit/core/types";
import { isAddressEqual } from "@dexkit/core/utils";
import useFetchTokenData from "@dexkit/ui/hooks/useFetchTokenData";
import useSwapImportTokens from "@dexkit/ui/hooks/useSwapImportTokens";
import { isAddress } from "ethers/lib/utils";
import { useMemo } from "react";



export function useSelectImport({
  chainId,
  onQueryChange,
  onSelect,
  tokens,
  enableImportExterTokens,
}: {
  tokens: Token[];
  chainId?: ChainId;
  onQueryChange: (value: string) => void;
  onSelect: (token: Token, isExtern?: boolean) => void;
  enableImportExterTokens?: boolean;
}) {
  const importedTokens = useSwapImportTokens({ chainId });
  const fetchTokenData = useFetchTokenData({ chainId });

  const handleChangeQuery = (value: string) => {
    if (isAddress(value) && enableImportExterTokens) {
      fetchTokenData.mutate({ contractAddress: value });
    } else {
      fetchTokenData.reset();
    }

    onQueryChange(value);
  };

  const isOnList = useMemo(() => {
    if (fetchTokenData.data) {
      let token = fetchTokenData.data;

      return Boolean(
        tokens.find(
          (t) =>
            t.chainId === token.chainId &&
            isAddressEqual(t.address, token.address)
        )
      );
    }

    return false;
  }, [fetchTokenData.data]);

  const handleSelect = (token: Token, isExtern?: boolean) => {
    if (isExtern) {
      importedTokens.add(token);
    }

    fetchTokenData.reset();

    onSelect(token, isExtern);
  };

  return {
    handleChangeQuery,
    handleSelect,
    isOnList,
    fetchTokenData,
    importedTokens,
  };
}
