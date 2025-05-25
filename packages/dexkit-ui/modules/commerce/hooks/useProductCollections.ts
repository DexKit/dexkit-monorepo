import { DexkitApiProvider } from "@dexkit/core/providers";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { ProductCollectionType } from "../types";

export const GET_PRODUCT_COLLECTIONS = "GET_PRODUCT_COLLECTIONS";

export default function useProductCollections(params: { id?: string }) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery(
    [GET_PRODUCT_COLLECTIONS, params],
    async () => {
      if (!instance) {
        throw new Error("no instance");
      }

      return (
        await instance.get(
          `/product/${params.id}/collections`
        )
      ).data as ProductCollectionType[];
    },
    {
      refetchOnMount: "always",
      refetchOnWindowFocus: "always",
      staleTime: 1000,
      enabled: Boolean(params.id)
    }
  );
}
