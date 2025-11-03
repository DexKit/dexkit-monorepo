import { useDexkitApiProvider } from "@dexkit/core/providers";
import { useQuery } from "@tanstack/react-query";

export const GET_SITE_RECEIVER = "GET_SITE_RECEIVER";

export function useSiteReceiver({ siteId }: { siteId?: number }) {
  const { instance } = useDexkitApiProvider();

  return useQuery([GET_SITE_RECEIVER, siteId], async () => {
    if (!instance || !siteId) {
      throw new Error("no instance");
    }

    const res = (await instance.get(`/orders/receiver/${siteId}`)).data;

    console.log(res);

    return res;
  });
}
