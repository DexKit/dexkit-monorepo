import { BigNumber } from "ethers";
import React from "react";
import { ChainId } from "../../constants/enum";
import { ZeroExQuoteResponse } from "../../services/zeroex/types";
import { Token } from "../../types";

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
  | "switch";

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
    token?: Token | undefined
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
  enableBuyCryptoButton?: boolean;
  disableFooter?: boolean;
  configsByChain: { [key: number]: ChainConfig };
  zeroExApiKey?: string;
  defaultChainId?: ChainId;
  transakApiKey?: string;
  currency: string;
};

export type SwapNotificationParams = {
  type: "swap";
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
  | SwapNotificationParams;

export type NotificationCallbackParams = {
  title: string;
  hash: string;
  chainId: ChainId;
  params: BaseNotificationParams;
};
