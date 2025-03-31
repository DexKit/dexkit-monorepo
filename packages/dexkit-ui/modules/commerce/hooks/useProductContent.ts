import { DexkitApiProvider } from "@dexkit/core/providers";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

export const GET_PRODUCT_CONTENT_QUERY = "GET_PRODUCT_CONTENT_QUERY";

export type UseProductContentParams = { productId: string; orderId: string };

export default function useProductContent({
  productId,
  orderId,
}: UseProductContentParams) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery([GET_PRODUCT_CONTENT_QUERY, orderId, productId], async () => {
    if (!instance) {
      throw new Error("no instance");
    }

    return (await instance.get(`/orders/${orderId}/content/${productId}`)).data;
  });
}
