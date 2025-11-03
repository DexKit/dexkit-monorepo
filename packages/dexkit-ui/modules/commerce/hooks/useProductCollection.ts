import { useDexkitApiProvider } from "@dexkit/core/providers";
import { useQuery } from "@tanstack/react-query";
import { ProductCollectionType } from "../types";

export const GET_PRODUCT_COLLECTION_QUERY = "GET_PRODUCT_COLLECTION_QUERY";

export default function useProductCollection(params: { id?: string }) {
  const { instance } = useDexkitApiProvider();

  return useQuery(
    [GET_PRODUCT_COLLECTION_QUERY, params],
    async () => {
      if (!instance) {
        throw new Error("no instance");
      }

      if (!params.id) {
        return null;
      }

      return (
        await instance.get(
          `/product-collections/${params.id}`
        )
      ).data;
    },
    {
      refetchOnWindowFocus: "always",
      refetchOnMount: "always",
      staleTime: Infinity,
    }
  );
}
