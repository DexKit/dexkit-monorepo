import { DexkitApiProvider } from "@dexkit/core/providers";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

const GET_CHECKOUT_NETWORKS = "GET_CHECKOUT_NETWORKS";

export default function useCheckoutNetworks() {
  const { instance } = useContext(DexkitApiProvider);

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
