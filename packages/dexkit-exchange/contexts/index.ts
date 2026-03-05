import { ChainId } from "@dexkit/core";
import React from "react";
import { DexkitExchangeContextState } from "../types";

export const DexkitExchangeContext =
  React.createContext<DexkitExchangeContextState>({
    setPair: () => {},
    onSwitchNetwork: async (chainId: ChainId) => {},
    onlyMyTokensOnSearch: false,
    defaultSlippage: {},
    baseTokens: [],
    quoteTokens: [],
    availNetworks: [],
    container: true,
  });
