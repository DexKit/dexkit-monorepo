import { DexkitApiProvider } from "@dexkit/core/providers";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

export const GET_USER_PRODUCT_QUERY = "GET_USER_PRODUCT_QUERY";

export default function useUserProduct(params: { id?: string }) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery(
    [GET_USER_PRODUCT_QUERY, params],
    async () => {
      if (!instance) {
        throw new Error("no instance");
      }

      return (await instance?.get(`/products/user/${params.id}`))
        ?.data;
    },
    { enabled: Boolean(params.id) }
  );
}
