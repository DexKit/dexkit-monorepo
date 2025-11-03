import { useDexkitApiProvider } from "@dexkit/core/providers";
import { useQuery } from "@tanstack/react-query";

export const GET_PRODUCT_CONTENT_QUERY = "GET_PRODUCT_CONTENT_QUERY";

export type UseProductContentParams = { productId: string; orderId: string };

export default function useProductContent({
  productId,
  orderId,
}: UseProductContentParams) {
  const { instance } = useDexkitApiProvider();

  return useQuery([GET_PRODUCT_CONTENT_QUERY, orderId, productId], async () => {
    if (!instance) {
      throw new Error("no instance");
    }

    return (await instance.get(`/orders/${orderId}/content/${productId}`)).data;
  });
}
