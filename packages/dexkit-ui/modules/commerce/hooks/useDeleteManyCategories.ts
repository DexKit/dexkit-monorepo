import { DexkitApiProvider } from "@dexkit/core/providers";
import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";

export default function useDeleteManyCategories() {
  const { instance } = useContext(DexkitApiProvider);

  return useMutation(async (data: { ids: string[] }) => {
    if (!instance) {
      throw new Error("no instance");
    }

    return (await instance?.delete(`/product-category`, { data })).data;
  });
}
