import { useDexkitApiProvider } from "@dexkit/core/providers";
import { useQuery } from "@tanstack/react-query";

export const GET_CHECKOUT_SETTINGS = "GET_CHECKOUT_SETTINGS";

export default function useCheckoutSettings() {
  const { instance } = useDexkitApiProvider();

  return useQuery(
    [GET_CHECKOUT_SETTINGS],
    async () => {
      if (!instance) {
        throw new Error("no instance");
      }

      const result = (
        await instance.get("/checkouts/settings")
      ).data;

      return result;
    },
    {
      refetchOnWindowFocus: "always",
      refetchOnMount: "always",
      staleTime: Infinity,
    }
  );
}
