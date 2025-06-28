import { ChainId } from "@dexkit/core";
import { Token } from "@dexkit/core/types";
import { isAddress } from "@dexkit/core/utils/ethers/isAddress";
import type { providers } from "ethers";

import * as Yup from "yup";

export type ExchangeVariant = "default" | "custom" | "glass";

export type ExchangeCustomVariantSettings = {
  showPairInfo?: boolean;
  showTradingGraph?: boolean;
  showTradeWidget?: boolean;
  layout?: "horizontal" | "vertical" | "grid";
  spacing?: number;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: "cover" | "contain" | "auto" | "100% 100%";
  backgroundPosition?: "center" | "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
  backgroundRepeat?: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
  backgroundAttachment?: "fixed" | "scroll";
  borderRadius?: number;
  padding?: number;
  componentOrder?: string[];
  pairInfoBackgroundColor?: string;
  pairInfoTextColor?: string;
  pairInfoSecondaryTextColor?: string;
  pairInfoBorderColor?: string;
  tradeWidgetBackgroundColor?: string;
  tradeWidgetTextColor?: string;
  tradeWidgetBorderColor?: string;
  tradeWidgetButtonColor?: string;
  tradeWidgetButtonTextColor?: string;
  tradeWidgetTabTextColor?: string;
  tradeWidgetInputTextColor?: string;
  tradingGraphBackgroundColor?: string;
  tradingGraphControlTextColor?: string;
  tradingGraphBorderColor?: string;
};

export type ExchangeGlassSettings = {
  primaryColor?: string;
  accentColor?: string;
  textColor?: string;
  backgroundType?: "solid" | "gradient" | "image";
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: "cover" | "contain" | "auto" | "100% 100%";
  backgroundPosition?: "center" | "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
  backgroundRepeat?: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
  backgroundAttachment?: "fixed" | "scroll";
  gradientStartColor?: string;
  gradientEndColor?: string;
  gradientDirection?: string;
  blurIntensity?: number;
  glassOpacity?: number;
  disableBackground?: boolean;
  buyTabColor?: string;
  sellTabColor?: string;
  buyTabTextColor?: string;
  sellTabTextColor?: string;
  buyText?: string;
  sellText?: string;
  fillButtonBackgroundColor?: string;
  fillButtonTextColor?: string;
  fillButtonHoverBackgroundColor?: string;
  fillButtonHoverTextColor?: string;
  fillButtonDisabledBackgroundColor?: string;
  fillButtonDisabledTextColor?: string;
  backgroundGradient?: {
    from?: string;
    to?: string;
    direction?: "to-r" | "to-br" | "to-b" | "to-bl";
  };
  glassmorphism?: {
    enabled?: boolean;
    opacity?: number;
    blur?: number;
  };
  animations?: {
    enabled?: boolean;
    duration?: number;
    easing?: "ease-in-out" | "ease-in" | "ease-out" | "linear";
  };
  minimalism?: {
    hideLabels?: boolean;
    compactMode?: boolean;
    hideSecondaryInfo?: boolean;
  };
  spacing?: {
    component?: number;
    internal?: number;
  };
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
  glassSettings?: ExchangeGlassSettings;
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
  glassSettings?: ExchangeGlassSettings;
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
  variant: Yup.string().oneOf(["default", "custom", "glass"]).optional(),
  customVariantSettings: Yup.object({
    showPairInfo: Yup.boolean().optional(),
    showTradingGraph: Yup.boolean().optional(),
    showTradeWidget: Yup.boolean().optional(),
    layout: Yup.string().oneOf(["horizontal", "vertical", "grid"]).optional(),
    spacing: Yup.number().min(0).max(8).optional(),
    backgroundColor: Yup.string().optional(),
    backgroundImage: Yup.string().optional(),
    backgroundSize: Yup.string().oneOf(["cover", "contain", "auto", "100% 100%"]).optional(),
    backgroundPosition: Yup.string().oneOf(["center", "top", "bottom", "left", "right", "top-left", "top-right", "bottom-left", "bottom-right"]).optional(),
    backgroundRepeat: Yup.string().oneOf(["no-repeat", "repeat", "repeat-x", "repeat-y"]).optional(),
    backgroundAttachment: Yup.string().oneOf(["fixed", "scroll"]).optional(),
    borderRadius: Yup.number().min(0).max(50).optional(),
    padding: Yup.number().min(0).max(8).optional(),
    componentOrder: Yup.array().of(Yup.string()).optional(),
    pairInfoBackgroundColor: Yup.string().optional(),
    pairInfoTextColor: Yup.string().optional(),
    pairInfoSecondaryTextColor: Yup.string().optional(),
    pairInfoBorderColor: Yup.string().optional(),
    tradeWidgetBackgroundColor: Yup.string().optional(),
    tradeWidgetTextColor: Yup.string().optional(),
    tradeWidgetBorderColor: Yup.string().optional(),
    tradeWidgetButtonColor: Yup.string().optional(),
    tradeWidgetButtonTextColor: Yup.string().optional(),
    tradeWidgetTabTextColor: Yup.string().optional(),
    tradeWidgetInputTextColor: Yup.string().optional(),
    tradingGraphBackgroundColor: Yup.string().optional(),
    tradingGraphControlTextColor: Yup.string().optional(),
    tradingGraphBorderColor: Yup.string().optional(),
  }).optional(),
  glassSettings: Yup.object({
    primaryColor: Yup.string().optional(),
    accentColor: Yup.string().optional(),
    textColor: Yup.string().optional(),
    backgroundType: Yup.string().oneOf(["solid", "gradient", "image"]).optional(),
    backgroundColor: Yup.string().optional(),
    backgroundImage: Yup.string().optional(),
    backgroundSize: Yup.string().oneOf(["cover", "contain", "auto", "100% 100%"]).optional(),
    backgroundPosition: Yup.string().oneOf(["center", "top", "bottom", "left", "right", "top-left", "top-right", "bottom-left", "bottom-right"]).optional(),
    backgroundRepeat: Yup.string().oneOf(["no-repeat", "repeat", "repeat-x", "repeat-y"]).optional(),
    backgroundAttachment: Yup.string().oneOf(["fixed", "scroll"]).optional(),
    gradientStartColor: Yup.string().optional(),
    gradientEndColor: Yup.string().optional(),
    gradientDirection: Yup.string().optional(),
    blurIntensity: Yup.number().min(10).max(60).optional(),
    glassOpacity: Yup.number().min(0.01).max(0.15).optional(),
    disableBackground: Yup.boolean().optional(),
    buyTabColor: Yup.string().optional(),
    sellTabColor: Yup.string().optional(),
    buyTabTextColor: Yup.string().optional(),
    sellTabTextColor: Yup.string().optional(),
    buyText: Yup.string().optional(),
    sellText: Yup.string().optional(),
    fillButtonBackgroundColor: Yup.string().optional(),
    fillButtonTextColor: Yup.string().optional(),
    fillButtonHoverBackgroundColor: Yup.string().optional(),
    fillButtonHoverTextColor: Yup.string().optional(),
    fillButtonDisabledBackgroundColor: Yup.string().optional(),
    fillButtonDisabledTextColor: Yup.string().optional(),
    fillButtonText: Yup.string().optional(),
    backgroundGradient: Yup.object({
      from: Yup.string().optional(),
      to: Yup.string().optional(),
      direction: Yup.string().oneOf(["to-r", "to-br", "to-b", "to-bl"]).optional(),
    }).optional(),
    glassmorphism: Yup.object({
      enabled: Yup.boolean().optional(),
      opacity: Yup.number().min(0).max(1).optional(),
      blur: Yup.number().min(0).max(50).optional(),
    }).optional(),
    animations: Yup.object({
      enabled: Yup.boolean().optional(),
      duration: Yup.number().min(100).max(2000).optional(),
      easing: Yup.string().oneOf(["ease-in-out", "ease-in", "ease-out", "linear"]).optional(),
    }).optional(),
    minimalism: Yup.object({
      hideLabels: Yup.boolean().optional(),
      compactMode: Yup.boolean().optional(),
      hideSecondaryInfo: Yup.boolean().optional(),
    }).optional(),
    spacing: Yup.object({
      component: Yup.number().min(0).max(8).optional(),
      internal: Yup.number().min(0).max(8).optional(),
    }).optional(),
  }).optional(),
});

export type ExchangeSettingsFormType = Yup.InferType<
  typeof ExchangeSettingsSchema
>;
