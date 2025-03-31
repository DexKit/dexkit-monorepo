import { DexkitApiProvider } from "@dexkit/core/providers";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

export const GET_PRODUCT_COLLECTION_ITEMS_QUERY =
  "GET_PRODUCT_COLLECTION_ITEMS_QUERY";

export default function useProductCollectionItems(params: { id?: string }) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery(
    [GET_PRODUCT_COLLECTION_ITEMS_QUERY, params],
    async () => {
      if (!instance) {
        throw new Error("no instance");
      }

      if (!params.id) {
        return null;
      }

      return (await instance.get(`/product-collections/${params.id}/items`))
        .data;
    },
    {
      refetchOnWindowFocus: "always",
      refetchOnMount: "always",
      staleTime: Infinity,
    }
  );
}
