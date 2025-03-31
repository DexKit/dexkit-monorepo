import { DexkitApiProvider } from "@dexkit/core/providers";
import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { CartOrderType, Order } from "../types";

export default function useCreateOrderFromCart() {
  const { instance } = useContext(DexkitApiProvider);

  return useMutation(async (data: CartOrderType) => {
    if (!instance) {
      throw new Error("no instance");
    }

    return (await instance?.post("/orders/from-cart", data)).data;
  });
}
