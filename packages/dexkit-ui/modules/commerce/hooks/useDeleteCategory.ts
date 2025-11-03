import { useDexkitApiProvider } from "@dexkit/core/providers";
import { useMutation } from "@tanstack/react-query";

export default function useDeleteCategory() {
  const { instance } = useDexkitApiProvider();

  return useMutation(async (data: { id: string }) => {
    if (!instance) {
      throw new Error("no instance");
    }

    return (await instance?.delete(`/product-category/${data.id}`)).data;
  });
}
