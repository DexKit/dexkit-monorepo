import { DexkitApiProvider } from "@dexkit/core/providers";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

const GET_SITE_NETWORKS_QUERY = "GET_SITE_NETWORKS_QUERY";

export default function useCheckoutNetworksBySite({ id }: { id: number }) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery(
    [GET_SITE_NETWORKS_QUERY],
    async () => {
      if (!instance) {
        throw new Error("no instance");
      }

      return (await instance.get(`/checkouts-networks/by-site/${id}`))
        .data;
    },
    { refetchOnWindowFocus: true, refetchOnMount: true }
  );
}
