import { DexkitApiProvider } from "@dexkit/core/providers";
import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { ProductCollectionType } from "../types";

export default function useCreateProductCollection() {
  const { instance } = useContext(DexkitApiProvider);

  return useMutation(async (data: ProductCollectionType) => {
    if (!instance) {
      throw new Error("no instance");
    }

    return (await instance?.post("/product-collections/", data)).data;
  });
}
