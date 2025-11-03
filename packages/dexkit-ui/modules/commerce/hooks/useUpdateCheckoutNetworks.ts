import { useDexkitApiProvider } from "@dexkit/core/providers";
import { useMutation } from "@tanstack/react-query";
import { CheckoutNetworksUpdateType } from "../types";

export default function useUpdateCheckoutNetworks() {
  const { instance } = useDexkitApiProvider();

  return useMutation(async (data: CheckoutNetworksUpdateType) => {
    if (!instance) {
      throw new Error("no instance");
    }

    return (await instance.put("/checkouts-networks", data)).data;
  });
}
