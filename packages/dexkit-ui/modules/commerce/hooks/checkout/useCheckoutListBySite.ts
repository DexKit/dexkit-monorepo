import { DexkitApiProvider } from "@dexkit/core/providers";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { Checkout } from "../../types";

export const GET_CHECKOUT_LIST_BY_SITE = "GET_CHECKOUT_LIST_BY_SITE";

export default function useCheckoutListBySite(params: {
  siteId: number;
  page: number;
  limit: number;
  q?: string;
}) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery(
    [GET_CHECKOUT_LIST_BY_SITE, params],
    async () => {
      if (!instance) {
        throw new Error("no instance");
      }

      return (
        await instance.get(`/checkouts/by-site/${params.siteId}`, { params })
      ).data;
    },
    {
      refetchOnWindowFocus: "always",
      refetchOnMount: "always",
      staleTime: Infinity,
    }
  );
}
