import { useDexkitApiProvider } from "@dexkit/core/providers";
import { useQuery } from "@tanstack/react-query";

export const GET_ORDERS_COUNT = "GET_ORDERS_COUNT";

export default function useCountOrders() {
  const { instance } = useDexkitApiProvider();

  return useQuery([GET_ORDERS_COUNT], async () => {
    if (!instance) {
      throw new Error(" no instance");
    }

    return (await instance.get(`/orders/count`)).data;
  });
}
