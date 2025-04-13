import { ChainId } from "@dexkit/core";
import { Token } from "@dexkit/core/types";
import { isAddress } from "@dexkit/core/utils/ethers/isAddress";
import type { providers } from "ethers";

import * as Yup from "yup";

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
});

export type ExchangeSettingsFormType = Yup.InferType<
  typeof ExchangeSettingsSchema
>;
