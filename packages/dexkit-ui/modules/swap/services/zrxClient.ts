import { ChainId } from "@dexkit/core/constants/enums";
import axios, { AxiosInstance, AxiosRequestHeaders } from "axios";

import {
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
  ZERO_EX_URL,
} from "@dexkit/ui/modules/swap/constants";

import {
  ZeroExQuote,
  ZeroExQuoteGasless,
  ZeroExQuoteResponse,
  ZrxOrderRecord,
  ZrxOrderbookResponse,
} from "../types";

export function getZeroExApiClient(chainId: ChainId) {
  return new ZeroExApiClient(chainId);
}

export class ZeroExApiClient {
  private axiosInstance: AxiosInstance;

  constructor(
    private chainId: ChainId,
    zeroExApiKey?: string,
    private siteId?: number,
  ) {
    const headers: AxiosRequestHeaders = {};

    if (zeroExApiKey) {
      headers["0x-api-key"] = zeroExApiKey;
    }

    this.axiosInstance = axios.create({
      headers,
    });
  }

  async quote(
    quote: ZeroExQuote,
    { signal }: { signal?: AbortSignal },
  ): Promise<ZeroExQuoteResponse> {
    const resp = await this.axiosInstance.get(
      ZERO_EX_URL(this.chainId, this.siteId) + ZEROEX_QUOTE_ENDPOINT,
      {
        params: quote,
        signal,
      },
    );

    return resp.data;
  }

  async price(
    quote: ZeroExQuote,
    { signal }: { signal?: AbortSignal },
  ): Promise<ZeroExQuoteResponse> {
    const resp = await this.axiosInstance.get(
      ZERO_EX_URL(this.chainId, this.siteId) + ZEROEX_PRICE_ENDPOINT,
      {
        params: quote,
        signal,
      },
    );

    return resp.data;
  }

  async priceGasless(
    quote: ZeroExQuoteGasless,
    { signal }: { signal?: AbortSignal },
  ): Promise<ZeroExQuoteResponse> {
    const resp = await this.axiosInstance.get(
      ZERO_EX_URL(this.chainId, this.siteId) + ZEROEX_GASLESS_PRICE_ENDPOINT,
      {
        params: quote,
        signal,
      },
    );

    return resp.data;
  }

  async quoteGasless(
    quote: ZeroExQuoteGasless,
    { signal }: { signal?: AbortSignal },
  ): Promise<ZeroExQuoteResponse> {
    const resp = await this.axiosInstance.get(
      ZERO_EX_URL(this.chainId, this.siteId) + ZEROEX_GASLESS_QUOTE_ENDPOINT,
      {
        params: quote,
        signal,
      },
    );

    return resp.data;
  }

  async submitStatusGasless(
    { tradeHash }: { tradeHash: string },
    { signal }: { signal?: AbortSignal },
  ): Promise<{
    status: "confirmed" | "failed" | "pending" | "succeeded" | "submitted";
    transactions: { hash: string; timestamp: number }[];
    reason?: string;
  }> {
    const resp = await this.axiosInstance.get(
      ZERO_EX_URL(this.chainId, this.siteId) +
        ZEROEX_GASLESS_STATUS_ENDPOINT +
        `/${tradeHash}`,
      {
        signal,
      },
    );

    return resp.data;
  }

  async submitGasless({
    trade,
    approval,
  }: {
    approval: any;
    trade: any;
  }): Promise<{ type: "metatransaction_v2"; tradeHash: string }> {
    const resp = await this.axiosInstance.post(
      ZERO_EX_URL(this.chainId, this.siteId) + ZEROEX_GASLESS_SUBMIT_ENDPOINT,
      { trade, approval },
    );

    return resp.data;
  }

  async tokens(): Promise<any> {
    return this.axiosInstance.get(
      ZERO_EX_URL(this.chainId) + ZEROEX_TOKENS_ENDPOINT,
    );
  }

  async isTokenGaslessSupported(): Promise<any> {
    return this.axiosInstance.get(
      ZERO_EX_URL(this.chainId) + ZEROEX_SUPPORTS_GASLESS_ENDPOINT,
    );
  }

  async order(hash: string): Promise<ZrxOrderRecord> {
    const resp = await this.axiosInstance.get(
      `${ZERO_EX_URL(this.chainId)}${ZEROEX_ORDERBOOK_ENDPOINT}/${hash}`,
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
      ZERO_EX_URL(this.chainId) + ZEROEX_ORDERBOOK_ORDERS_ENDPOINT,
      {
        signal,
        params: { trader },
      },
    );
    return resp.data;
  }
}
