import { UseMutationOptions, useMutation } from "@tanstack/react-query";

import type { providers } from "ethers";
import { BigNumber, Contract } from "ethers";
import { ERC20Abi } from "../../constants/abis";

import { ChainId, ZEROEX_NATIVE_TOKEN_ADDRESS } from "@dexkit/core";
import { Token } from "@dexkit/core/types";
import { isAddressEqual } from "@dexkit/core/utils";
import useFetchTokenData from "@dexkit/ui/hooks/useFetchTokenData";
import useSwapImportTokens from "@dexkit/ui/hooks/useSwapImportTokens";
import { isAddress } from "ethers/lib/utils";
import { useMemo } from "react";
import { NotificationCallbackParams } from "./types";

export function useErc20ApproveMutation({
  options,
  onNotification,
}: {
  options?: Omit<UseMutationOptions, any>;
  onNotification: (params: NotificationCallbackParams) => void;
}) {
  const mutation = useMutation(
    async ({
      spender,
      amount,
      tokenAddress,
      signer,
      token,
      chainId,
    }: {
      spender: string;
      chainId: number;
      token: Token;
      amount: BigNumber;
      tokenAddress?: string;
      signer?: providers.JsonRpcSigner;
    }) => {
      if (!signer || tokenAddress === undefined || !chainId) {
        return undefined;
      }

      const contract = new Contract(
        tokenAddress,
        ERC20Abi,
        signer
      );

      const tx = await contract.approve(spender, amount);


      onNotification({
        chainId,
        title: "Approve token",
        hash: tx.hash,
        params: {
          type: "approve",
          token,
        },
      });

      return await tx.wait();
    },
    options
  );

  return mutation;
}

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
    if (value.toLowerCase() === ZEROEX_NATIVE_TOKEN_ADDRESS.toLowerCase()) {
      fetchTokenData.reset();
      onQueryChange(value);
      return;
    }
    
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
    if (isExtern && token.address.toLowerCase() === ZEROEX_NATIVE_TOKEN_ADDRESS.toLowerCase()) {
      fetchTokenData.reset();
      onSelect(token, false);
      return;
    }
    
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
