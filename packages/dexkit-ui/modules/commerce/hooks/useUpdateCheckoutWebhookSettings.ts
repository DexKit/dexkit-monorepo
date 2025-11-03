import { useDexkitApiProvider } from "@dexkit/core/providers";
import { useMutation } from "@tanstack/react-query";
import { CheckoutWebhookSettingsType } from "../types";

export default function useUpdateCheckoutWebhookSettings() {
  const { instance } = useDexkitApiProvider();

  return useMutation(async (data: CheckoutWebhookSettingsType) => {
    if (!instance) {
      throw new Error("no instance");
    }

    return (await instance.put("/checkouts/webhook-settings", data)).data;
  });
}
