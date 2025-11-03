import { useDexkitApiProvider } from "@dexkit/core/providers";
import { useMutation } from "@tanstack/react-query";
import { ProductCollectionType } from "../types";

export default function useCreateProductCollection() {
  const { instance } = useDexkitApiProvider();

  return useMutation(async (data: ProductCollectionType) => {
    if (!instance) {
      throw new Error("no instance");
    }

    return (await instance?.post("/product-collections/", data)).data;
  });
}
