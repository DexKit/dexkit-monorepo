import { DexkitApiProvider } from "@dexkit/core/providers";
import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";

export default function useCheckcart() {
  const { instance } = useContext(DexkitApiProvider);

  return useMutation(async ({ productIds }: { productIds: string[] }) => {
    if (!instance) {
      throw new Error("no instance");
    }

    const removeIds = [];

    for (const id of productIds) {
      try {
        await instance.get(`/products/user/${id}`);
      } catch (err) {
        removeIds.push(id);
      }
    }

    return removeIds;
  });
}
