import { DexkitApiProvider } from "@dexkit/core/providers";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

export const GET_ORDERS_COUNT = "GET_ORDERS_COUNT";

export default function useCountOrders() {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery([GET_ORDERS_COUNT], async () => {
    if (!instance) {
      throw new Error(" no instance");
    }

    return (await instance.get(`/orders/count`)).data;
  });
}
