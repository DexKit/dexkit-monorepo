import { DexkitApiProvider } from "@dexkit/core/providers";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { ProductCollectionType } from "../types";

const GET_COLLECTIONS_BY_SITE_QUERY = "GET_COLLECTIONS_BY_SITE_QUERY";

export default function useCollectionsBySite(params: {
  siteId: number;
  page: number;
  limit: number;
}) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery(
    [GET_COLLECTIONS_BY_SITE_QUERY, params],
    async () => {
      if (!instance) {
        throw new Error("no instance");
      }

      return (
        await instance.get(`/product-collections/by-site/${params.siteId}`, { params })
      ).data;
    },
    { refetchOnWindowFocus: true, refetchOnMount: true }
  );
}
