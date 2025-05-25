import { DexkitApiProvider } from "@dexkit/core/providers";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

export const GET_SITE_OWNER = "GET_SITE_OWNER";

export function useSiteOwner({ id }: { id: number }) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery([GET_SITE_OWNER, id], async () => {
    if (!instance) {
      throw new Error("no instance");
    }

    return (await instance.get(`/site/by-id/${id}`)).data;
  });
}
