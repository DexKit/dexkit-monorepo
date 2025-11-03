import { useDexkitApiProvider } from "@dexkit/core/providers";
import { useQuery } from "@tanstack/react-query";

export const GET_COLLECTION_PRODUCTS_QUERY = "GET_COLLECTION_PRODUCTS_QUERY";

export default function useCollectionProductsList(params: {
  id: string;
  page: number;
  limit: number;
  query: string;
  categories?: string[];
}) {
  const { id, page, limit, query } = params;

  const { instance } = useDexkitApiProvider();

  return useQuery([GET_COLLECTION_PRODUCTS_QUERY, params], async () => {
    if (!instance) {
      throw new Error("no instance");
    }

    let queryParams: {
      page: number;
      limit: number;
      q: string;
      categories?: string;
    } = { page, limit, q: query };

    return (
      await instance?.get(`/product-collections/user/${id}/products`, {
        params: queryParams,
      })
    )?.data;
  });
}
