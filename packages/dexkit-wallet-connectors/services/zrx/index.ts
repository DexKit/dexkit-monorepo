import axios, { AxiosInstance, AxiosRequestHeaders } from "axios";
import { ChainId } from "../../constants/enums";

import {
  ZEROEX_ORDERBOOK_ORDERS_ENDPOINT,
  ZEROEX_QUOTE_ENDPOINT,
  ZEROEX_TOKENS_ENDPOINT,
  ZERO_EX_V2_URL,
} from "./constants";

import {
  ZeroExQuote,
  ZeroExQuoteResponse,
  ZrxOrderbookResponse,
} from "./types";

export function getZeroExApiClient(chainId: ChainId) {
  return new ZeroExApiClient(chainId);
}

export class ZeroExApiClient {
  private axiosInstance: AxiosInstance;

  constructor(chainId: ChainId, zeroExApiKey?: string) {
    const headers: AxiosRequestHeaders = {};

    if (zeroExApiKey) {
      headers["0x-api-key"] = zeroExApiKey;
    }

    this.axiosInstance = axios.create({
      baseURL: ZERO_EX_V2_URL(chainId),
      headers,
    });
  }

  async quote(
    quote: ZeroExQuote,
    { signal }: { signal?: AbortSignal }
  ): Promise<ZeroExQuoteResponse> {
    const resp = await this.axiosInstance.get(ZEROEX_QUOTE_ENDPOINT, {
      params: quote,
    });

    return resp.data;
  }

  async tokens(): Promise<any> {
    return this.axiosInstance.get(ZEROEX_TOKENS_ENDPOINT);
  }

  async orderbook({
    signal,
    trader,
  }: {
    trader?: string;
    signal?: AbortSignal;
  }): Promise<ZrxOrderbookResponse> {
    const resp = await this.axiosInstance.get<ZrxOrderbookResponse>(
      ZEROEX_ORDERBOOK_ORDERS_ENDPOINT,
      {
        params: { trader },
      }
    );
    return resp.data;
  }
}
