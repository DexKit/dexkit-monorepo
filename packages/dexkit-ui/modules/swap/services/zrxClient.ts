import { ChainId } from "@dexkit/core/constants/enums";
import axios, { AxiosInstance } from "axios";

import {
  SUPPORTED_UNISWAP_V2,
  SWAP_UNI_V2_URL,
  ZEROEX_GASLESS_PRICE_ENDPOINT,
  ZEROEX_GASLESS_QUOTE_ENDPOINT,
  ZEROEX_GASLESS_STATUS_ENDPOINT,
  ZEROEX_GASLESS_SUBMIT_ENDPOINT,
  ZEROEX_ORDERBOOK_ENDPOINT,
  ZEROEX_ORDERBOOK_ORDERS_ENDPOINT,
  ZEROEX_PRICE_ENDPOINT,
  ZEROEX_QUOTE_ENDPOINT,
  ZEROEX_SUPPORTS_GASLESS_ENDPOINT,
  ZEROEX_TOKENS_ENDPOINT,
  ZERO_EX_V1_URL,
  ZERO_EX_V2_URL,
  ZERO_EX_V2_WIDGET_URL,
} from "@dexkit/ui/modules/swap/constants";

import {
  ZeroExGaslessQuoteResponse,
  ZeroExQuote,
  ZeroExQuoteGasless,
  ZeroExQuoteResponse,
  ZrxOrderRecord,
  ZrxOrderbookResponse,
} from "../types";

export function getZeroExApiClient(chainId: ChainId) {
  return new ZeroExApiClient(chainId);
}
/**
 * Rename this to Swap Client as we are now using as well uni v2
 */
export class ZeroExApiClient {
  private axiosInstance: AxiosInstance;

  constructor(
    private chainId: ChainId,
    private siteId?: number,
    private widgetId?: number,
    private apiKey?: string
  ) {
    this.axiosInstance = axios.create();
  }

  async quote(
    quote: ZeroExQuote,
    { }: {}
  ): Promise<ZeroExQuoteResponse> {
    const baseUrl = SUPPORTED_UNISWAP_V2.includes(this.chainId) ? SWAP_UNI_V2_URL() : this.widgetId ? ZERO_EX_V2_WIDGET_URL() : ZERO_EX_V2_URL(this.chainId, this.siteId);

    const url = baseUrl + `${SUPPORTED_UNISWAP_V2.includes(this.chainId) ? '/quote' : ZEROEX_QUOTE_ENDPOINT}`;


    const resp = await this.axiosInstance.get(
      url,
      {
        params: quote,
        headers: {
          "Dexkit-Api-Key": this?.apiKey || "",
        },
      },


    );

    const { data } = resp;

    if (!data.liquidityAvailable) {
      throw new Error("Liquidity not available");
    }

    return data;
  }

  async price(
    price: ZeroExQuote,
    { signal }: { signal?: AbortSignal }
  ): Promise<ZeroExQuoteResponse> {

    const baseUrl = SUPPORTED_UNISWAP_V2.includes(this.chainId) ? SWAP_UNI_V2_URL() : this.widgetId ? ZERO_EX_V2_WIDGET_URL() : ZERO_EX_V2_URL(this.chainId, this.siteId);
    const url = baseUrl + `${SUPPORTED_UNISWAP_V2.includes(this.chainId) ? '/price' : ZEROEX_PRICE_ENDPOINT}`;

    const resp = await this.axiosInstance.get(
      url,
      {
        params: price,
        headers: {
          "Dexkit-Api-Key": this?.apiKey || "",
        },
      }
    );

    const { data } = resp;

    if (!data.liquidityAvailable) {
      throw new Error("Liquidity not available");
    }

    return data;
  }

  async priceGasless(
    quote: ZeroExQuoteGasless,
    { signal }: { signal?: AbortSignal }
  ): Promise<ZeroExQuoteResponse> {
    const resp = await this.axiosInstance.get(
      (this.widgetId ? ZERO_EX_V2_WIDGET_URL() : ZERO_EX_V2_URL(this.chainId, this.siteId)) + ZEROEX_GASLESS_PRICE_ENDPOINT,
      {
        params: quote,
        headers: {
          "Dexkit-Api-Key": this?.apiKey || "",
        },
      }
    );

    const { data } = resp;

    if (!data.liquidityAvailable) {
      throw new Error("Liquidity not available");
    }

    return data;
  }

  async quoteGasless(
    quote: ZeroExQuoteGasless,
    { signal }: { signal?: AbortSignal }
  ): Promise<ZeroExGaslessQuoteResponse> {
    const resp = await this.axiosInstance.get(
      (this.widgetId ? ZERO_EX_V2_WIDGET_URL() : ZERO_EX_V2_URL(this.chainId, this.siteId)) + ZEROEX_GASLESS_QUOTE_ENDPOINT,
      {
        params: quote,
        headers: {
          "Dexkit-Api-Key": this?.apiKey || "",
        },
      }
    );

    const { data } = resp;

    if (!data.liquidityAvailable) {
      throw new Error("Liquidity not available");
    }

    return data;
  }

  async submitStatusGasless(
    { tradeHash }: { tradeHash: string },
    { signal }: { signal?: AbortSignal }
  ): Promise<{
    status: "confirmed" | "failed" | "pending" | "succeeded" | "submitted";
    transactions: { hash: string; timestamp: number }[];
    reason?: string;
  }> {
    const resp = await this.axiosInstance.get(
      (this.widgetId ? ZERO_EX_V2_WIDGET_URL() : ZERO_EX_V2_URL(this.chainId, this.siteId)) +
      ZEROEX_GASLESS_STATUS_ENDPOINT +
      `/${tradeHash}`,
      {
        headers: {
          "Dexkit-Api-Key": this?.apiKey || "",
        },

      }
    );

    return resp.data;
  }

  async submitGasless({
    trade,
    approval,
    chainId,
  }: {
    approval: any;
    trade: any;
    chainId: string;
  }): Promise<{ type: "metatransaction_v2"; tradeHash: string }> {
    const resp = await this.axiosInstance.post(
      (this.widgetId ? ZERO_EX_V2_WIDGET_URL() : ZERO_EX_V2_URL(this.chainId, this.siteId)) +
      ZEROEX_GASLESS_SUBMIT_ENDPOINT,
      { trade, approval, chainId },
      {
        headers: {
          "Dexkit-Api-Key": this?.apiKey || "",
        },
      }
    );
    return resp.data;
  }

  async tokens(): Promise<any> {
    return this.axiosInstance.get(
      (this.widgetId ? ZERO_EX_V2_WIDGET_URL() : ZERO_EX_V2_URL(this.chainId, this.siteId)) + ZEROEX_TOKENS_ENDPOINT
      ,
      {
        headers: {
          "Dexkit-Api-Key": this?.apiKey || "",
        },
      });
  }

  async isTokenGaslessSupported(): Promise<any> {
    return this.axiosInstance.get(
      (this.widgetId ? ZERO_EX_V2_WIDGET_URL() : ZERO_EX_V2_URL(this.chainId, this.siteId)) + ZEROEX_SUPPORTS_GASLESS_ENDPOINT
    );
  }

  async order(hash: string): Promise<ZrxOrderRecord> {
    const resp = await this.axiosInstance.get(
      `${ZERO_EX_V1_URL(this.chainId)}${ZEROEX_ORDERBOOK_ENDPOINT}/${hash}`
    );

    return resp.data;
  }

  async orderbook({
    signal,
    trader,
  }: {
    trader?: string;
    signal?: AbortSignal;
  }): Promise<ZrxOrderbookResponse> {
    const resp = await this.axiosInstance.get<ZrxOrderbookResponse>(
      ZERO_EX_V1_URL(this.chainId) + ZEROEX_ORDERBOOK_ORDERS_ENDPOINT,
      {
        params: { trader },
      }
    );
    return resp.data;
  }
}
