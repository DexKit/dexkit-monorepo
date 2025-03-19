import { ChainId } from "@dexkit/core/constants/enums";
import { Token } from "@dexkit/core/types";
import { ZeroExQuoteResponse } from "@dexkit/ui/modules/swap/types";
import { SwapVariant } from "@dexkit/ui/modules/wizard/types";
import type { BigNumber } from "ethers";
import React from "react";

export type Empty = {
  name: string;
};

export type SwapSide = "sell" | "buy";
export type ExecType =
  | "swap"
  | "wrap"
  | "unwrap"
  | "approve"
  | "quote"
  | "switch"
  | "network_not_supported"
  | "approve_gasless"
  | "swap_gasless"
  | "quote_gasless";

export type SwapState = {
  chainId?: ChainId;
  buyToken?: Token;
  sellToken?: Token;
  showConfirmSwap: boolean;
  showSelect: boolean;
  selectSide: SwapSide | undefined;
  sellAmount: BigNumber;
  buyAmount: BigNumber;
  quoteFor?: SwapSide;
  execType?: ExecType;
  isExecuting: boolean;
  quote?: ZeroExQuoteResponse | null;
  sellTokenBalance?: BigNumber;
  buyTokenBalance?: BigNumber;
  insufficientBalance: boolean;
  showSettings: boolean;
  isProviderReady?: boolean;
  isQuoting?: boolean;
  recentTokens?: Token[];
  handleConnectWallet: () => void;
  handleOpenSelectToken: (
    selectFor: SwapSide,
    token?: Token | undefined,
  ) => void;
  handleSelectToken: (token: Token) => void;
  setBuyToken: React.Dispatch<Token | undefined>;
  setQuoteFor: React.Dispatch<SwapSide | undefined>;
  setSellToken: React.Dispatch<Token | undefined>;
  setBuyAmount: React.Dispatch<BigNumber>;
  setSellAmount: React.Dispatch<BigNumber>;
  handleChangeSellAmount: (value: BigNumber) => void;
  handleChangeBuyAmount: (value: BigNumber) => void;
  handleSwapTokens: () => void;
  handleExecSwap: () => void;
  handleCloseSelectToken: () => void;
  handleCloseConfirmSwap: () => void;
  handleConfirmExecSwap: () => void;
  handleChangeNetwork: (chainId: ChainId) => void;
  handleCloseSettings: () => void;
  handleShowSettings: () => void;
  handleShowTransactions: () => void;
  handleClearRecentTokens: () => void;
  handleShowTransak: () => void;
};

export type ChainConfig = {
  slippage: number;
  sellToken?: Token;
  buyToken?: Token;
};

//TODO: array of tokens by chainId e defaultChainId without
export type RenderOptions = {
  disableNotificationsButton?: boolean;
  featuredTokens?: Token[];
  nonFeaturedTokens?: Token[];
  enableBuyCryptoButton?: boolean;
  disableFooter?: boolean;
  variant?: SwapVariant;
  enableUrlParams?: boolean;
  configsByChain: { [key: number]: ChainConfig };
  zeroExApiKey?: string;
  defaultChainId?: ChainId;
  transakApiKey?: string;
  currency: string;
  useGasless?: boolean;
  myTokensOnlyOnSearch?: boolean;
  enableImportExterTokens?: boolean;
};

export type SwapNotificationParams = {
  type: "swap";
  sellToken: Token;
  buyToken: Token;
  sellAmount: string;
  buyAmount: string;
};

export type SwapGaslessNotificationParams = {
  type: "swapGasless";
  sellToken: Token;
  buyToken: Token;
  sellAmount: string;
  buyAmount: string;
};

export type ApproveNotificationParams = {
  type: "approve";
  token: Token;
};

export type BaseNotificationParams =
  | ApproveNotificationParams
  | SwapNotificationParams
  | SwapGaslessNotificationParams;

export type NotificationCallbackParams = {
  title: string;
  hash?: string;
  chainId: ChainId;
  params: BaseNotificationParams;
};
