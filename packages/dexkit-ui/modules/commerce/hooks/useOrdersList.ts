import { DexkitApiProvider } from "@dexkit/core/providers";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { Order } from "../types";

export const GET_ORDER_LIST_QUERY = "GET_ORDER_LIST_QUERY";

export default function useOrdersList(params: {
  page: number;
  limit: number;
  status: string;
  q?: string;
}) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery(
    [GET_ORDER_LIST_QUERY, params],
    async () => {
      if (!instance) {
        throw new Error("no instance");
      }

      return (
        await instance.get("/orders", { params })
      ).data;
    },
    {
      refetchOnWindowFocus: "always",
      refetchOnMount: "always",
      staleTime: Infinity,
    }
  );
}
