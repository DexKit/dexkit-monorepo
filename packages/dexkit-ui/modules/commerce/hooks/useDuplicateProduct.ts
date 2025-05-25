import { DexkitApiProvider } from "@dexkit/core/providers";
import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";

export default function useDuplicateProduct() {
  const { instance } = useContext(DexkitApiProvider);

  return useMutation(async (data: { id: string }) => {
    if (!instance) {
      throw new Error("no instance");
    }

    return (await instance?.post(`/products/${data.id}/duplicate`)).data;
  });
}
