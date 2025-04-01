import { useQuery } from "@tanstack/react-query";
import { getDKAssetOrderbook } from "../services";
import { TraderOrderFilter } from "../types";

export const GET_ASSETS_ORDERBOOK = "GET_ASSETS_ORDERBOOK";

export const useAssetsOrderBook = (orderFilter?: TraderOrderFilter) => {
  return useQuery([GET_ASSETS_ORDERBOOK, orderFilter], async () => {
    return (await getDKAssetOrderbook(orderFilter)).data;
  });
};
