import { useDexkitApiProvider } from "@dexkit/core/providers";
import { useMutation } from "@tanstack/react-query";

export default function useDeleteManyProducts() {
  const { instance } = useDexkitApiProvider();

  return useMutation(async (data: { ids: string[] }) => {
    if (!instance) {
      throw new Error("no instance");
    }

    return (await instance?.delete(`/products`, { data })).data;
  });
}
