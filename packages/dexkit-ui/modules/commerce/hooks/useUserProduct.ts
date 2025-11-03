import { useDexkitApiProvider } from "@dexkit/core/providers";
import { useQuery } from "@tanstack/react-query";

export const GET_USER_PRODUCT_QUERY = "GET_USER_PRODUCT_QUERY";

export default function useUserProduct(params: { id?: string }) {
  const { instance } = useDexkitApiProvider();

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
