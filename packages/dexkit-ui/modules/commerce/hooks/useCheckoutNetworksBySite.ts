import { useDexkitApiProvider } from "@dexkit/core/providers";
import { useQuery } from "@tanstack/react-query";

const GET_SITE_NETWORKS_QUERY = "GET_SITE_NETWORKS_QUERY";

export default function useCheckoutNetworksBySite({ id }: { id: number }) {
  const { instance } = useDexkitApiProvider();

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
