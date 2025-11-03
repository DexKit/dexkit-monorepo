import { useDexkitApiProvider } from "@dexkit/core/providers";
import { useMutation } from "@tanstack/react-query";
import { CartOrderType, Order } from "../types";

export default function useCreateOrderFromCart() {
  const { instance } = useDexkitApiProvider();

  return useMutation(async (data: CartOrderType) => {
    if (!instance) {
      throw new Error("no instance");
    }

    return (await instance?.post("/orders/from-cart", data)).data;
  });
}
