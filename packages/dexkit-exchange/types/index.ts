import { ChainId } from "@dexkit/core";
import { Token } from "@dexkit/core/types";
import { isAddress } from "@dexkit/core/utils/ethers/isAddress";
import type { providers } from "ethers";

import * as Yup from "yup";

export type ExchangeVariant = "default" | "custom";

export type ExchangeCustomVariantSettings = {
  showPairInfo?: boolean;
  showTradingGraph?: boolean;
  showTradeWidget?: boolean;
  layout?: "horizontal" | "vertical" | "grid";
  spacing?: number;
  backgroundColor?: string;
  borderRadius?: number;
  padding?: number;
  componentOrder?: string[];
  pairInfoBackgroundColor?: string;
  pairInfoTextColor?: string;
  pairInfoBorderColor?: string;
  tradeWidgetBackgroundColor?: string;
  tradeWidgetTextColor?: string;
  tradeWidgetBorderColor?: string;
  tradeWidgetButtonColor?: string;
  tradeWidgetButtonTextColor?: string;
  tradingGraphBackgroundColor?: string;
  tradingGraphBorderColor?: string;
};

export type DexkitExchangeSettings = {
  zrxApiKey?: string;
  quoteToken?: Token;
  defaultNetwork: ChainId;
  defaultPairs: { [key: number]: { quoteToken: Token; baseToken: Token } };
  defaultSlippage?: { [key: number]: { slippage: number } };
  defaultTokens: {
    [key: number]: { quoteTokens: Token[]; baseTokens: Token[] };
  };
  buyTokenPercentageFee?: number;
  feeRecipientAddress?: string;
  affiliateAddress?: string;
  availNetworks: ChainId[];
  container?: boolean;
  variant?: ExchangeVariant;
  customVariantSettings?: ExchangeCustomVariantSettings;
};

export type DexkitExchangeContextState = {
  container?: boolean;
  zrxApiKey?: string;
  quoteToken?: Token;
  baseToken?: Token;
  baseTokens: Token[];
  account?: string;
  chainId?: ChainId;
  provider?: providers.Web3Provider;
  signer?: providers.JsonRpcSigner;
  quoteTokens: Token[];
  buyTokenPercentageFee?: number;
  feeRecipient?: string;
  affiliateAddress?: string;
  tokens?: { [key: string]: Token };
  defaultSlippage?: { [key: string]: { slippage: number } };
  availNetworks: ChainId[];
  setPair: (baseToken: Token, quoteToken: Token) => void;
  onSwitchNetwork: (chainId: ChainId) => Promise<void>;
  variant?: ExchangeVariant;
  customVariantSettings?: ExchangeCustomVariantSettings;
};

export type GtPool = {
  id: string;
  type: string;
  attributes: {
    base_token_price_usd: string;
    base_token_price_native_currency: string;
    quote_token_price_usd: string;
    quote_token_price_native_currency: string;
    address: string;
    name: string;
    reserve_in_usd: string;
    pool_created_at: null;
    token_price_usd: string;
    fdv_usd: string;
    market_cap_usd: string;
    price_change_percentage: {
      h1: string;
      h24: string;
    };
    transactions: {
      h1: {
        buys: number;
        sells: number;
      };
      h24: {
        buys: number;
        sells: number;
      };
    };
    volume_usd: {
      h24: string;
    };
  };
};

export type GtTopPoolsApiResponse = {
  data: GtPool[];
};

export const TokenSchema = Yup.object().shape({
  contractAddress: Yup.string(),
  chainId: Yup.number(),
  symbol: Yup.string(),
  name: Yup.string(),
});

export const ExchangeSettingsSchema = Yup.object({
  zrxApiKey: Yup.string().optional(),
  defaultTokens: Yup.object().required(),
  defaultPairs: Yup.object().required(),
  defaultSlippage: Yup.object(),
  buyTokenPercentageFee: Yup.number().required(),
  feeRecipientAddress: Yup.string().test("address", (value) => {
    return value !== undefined ? isAddress(value) : true;
  }),
  affiliateAddress: Yup.string()
    .test("address", (value) => {
      return value !== undefined ? isAddress(value) : true;
    })
    .required(),
  variant: Yup.string().oneOf(["default", "custom"]).optional(),
  customVariantSettings: Yup.object({
    showPairInfo: Yup.boolean().optional(),
    showTradingGraph: Yup.boolean().optional(),
    showTradeWidget: Yup.boolean().optional(),
    layout: Yup.string().oneOf(["horizontal", "vertical", "grid"]).optional(),
    spacing: Yup.number().min(0).max(8).optional(),
    backgroundColor: Yup.string().optional(),
    borderRadius: Yup.number().min(0).max(50).optional(),
    padding: Yup.number().min(0).max(8).optional(),
    componentOrder: Yup.array().of(Yup.string()).optional(),
    pairInfoBackgroundColor: Yup.string().optional(),
    pairInfoTextColor: Yup.string().optional(),
    pairInfoBorderColor: Yup.string().optional(),
    tradeWidgetBackgroundColor: Yup.string().optional(),
    tradeWidgetTextColor: Yup.string().optional(),
    tradeWidgetBorderColor: Yup.string().optional(),
    tradeWidgetButtonColor: Yup.string().optional(),
    tradeWidgetButtonTextColor: Yup.string().optional(),
    tradingGraphBackgroundColor: Yup.string().optional(),
    tradingGraphBorderColor: Yup.string().optional(),
  }).optional(),
});

export type ExchangeSettingsFormType = Yup.InferType<
  typeof ExchangeSettingsSchema
>;
