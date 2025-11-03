import { useDexkitApiProvider } from "@dexkit/core/providers";
import { useMutation } from "@tanstack/react-query";

export default function useDuplicateProduct() {
  const { instance } = useDexkitApiProvider();

  return useMutation(async (data: { id: string }) => {
    if (!instance) {
      throw new Error("no instance");
    }

    return (await instance?.post(`/products/${data.id}/duplicate`)).data;
  });
}
