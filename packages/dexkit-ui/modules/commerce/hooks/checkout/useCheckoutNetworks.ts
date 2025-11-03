import { useDexkitApiProvider } from "@dexkit/core/providers";
import { useQuery } from "@tanstack/react-query";

const GET_CHECKOUT_NETWORKS = "GET_CHECKOUT_NETWORKS";

export default function useCheckoutNetworks() {
  const { instance } = useDexkitApiProvider();

  return useQuery(
    [GET_CHECKOUT_NETWORKS],
    async () => {
      if (!instance) {
        throw new Error("no instance");
      }

      return (await instance.get("/checkouts-networks"))
        .data;
    },
    { refetchOnWindowFocus: true, refetchOnMount: true }
  );
}
