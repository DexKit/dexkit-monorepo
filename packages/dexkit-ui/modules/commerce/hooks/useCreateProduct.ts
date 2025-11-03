import { useDexkitApiProvider } from "@dexkit/core/providers";
import { useMutation } from "@tanstack/react-query";
import { ProductFormType } from "../types";

export default function useCreateProduct() {
  const { instance } = useDexkitApiProvider();

  return useMutation(async (data: ProductFormType) => {
    if (!instance) {
      throw new Error("no instance");
    }

    return (await instance?.post("/products/", data)).data;
  });
}
