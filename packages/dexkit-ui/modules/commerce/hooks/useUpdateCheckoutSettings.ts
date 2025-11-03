import { useDexkitApiProvider } from "@dexkit/core/providers";
import { useMutation } from "@tanstack/react-query";
import { CheckoutSettingsType } from "../types";

export default function useUpdateCheckoutSettings() {
  const { instance } = useDexkitApiProvider();

  return useMutation(async (data: CheckoutSettingsType) => {
    if (!instance) {
      throw new Error("no instance");
    }

    return (await instance.put("/checkouts/settings", data)).data;
  });
}
