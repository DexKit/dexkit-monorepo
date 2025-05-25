import { DexkitApiProvider } from "@dexkit/core/providers";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

export const GET_PRODUCTS_BY_SITE = "GET_PRODUCTS_BY_SITE";

export default function useProductsBySite(params: {
  siteId: number;
  page: number;
  limit: number;
  sort: string;
  query: string;
  categories?: string[];
}) {
  const { siteId, page, limit, query } = params;

  const { instance } = useContext(DexkitApiProvider);

  return useQuery([GET_PRODUCTS_BY_SITE, params], async () => {
    if (!instance) {
      throw new Error("no instance");
    }

    let queryParams: {
      page: number;
      limit: number;
      q: string;
      categories?: string;
      sort?: string;
    } = { page, limit, q: query };

    if (params.categories) {
      queryParams.categories = JSON.stringify(params.categories);
    }

    if (params.sort !== "") {
      queryParams.sort = params.sort;
    }

    return (
      await instance?.get(`/products/by-site/${siteId}`, {
        params: queryParams,
      })
    )?.data;
  });
}
