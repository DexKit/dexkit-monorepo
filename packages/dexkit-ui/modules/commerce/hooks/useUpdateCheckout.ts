import { useDexkitApiProvider } from "@dexkit/core/providers";
import { useMutation } from "@tanstack/react-query";
import { CheckoutFormType } from "../types";
export default function useUpdateCheckout() {
  const { instance } = useDexkitApiProvider();

  return useMutation(async (data: CheckoutFormType) => {
    if (!instance) {
      throw new Error("no instance");
    }

    return (await instance?.put(`/checkouts/${data?.id}`, data)).data;
  });
}
