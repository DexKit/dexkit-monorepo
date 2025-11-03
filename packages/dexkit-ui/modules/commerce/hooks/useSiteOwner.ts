import { useDexkitApiProvider } from "@dexkit/core/providers";
import { useQuery } from "@tanstack/react-query";

export const GET_SITE_OWNER = "GET_SITE_OWNER";

export function useSiteOwner({ id }: { id: number }) {
  const { instance } = useDexkitApiProvider();

  return useQuery([GET_SITE_OWNER, id], async () => {
    if (!instance) {
      throw new Error("no instance");
    }

    return (await instance.get(`/site/by-id/${id}`)).data;
  });
}
