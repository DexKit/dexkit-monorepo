import { useDexkitApiProvider } from "@dexkit/core/providers";
import { useMutation } from "@tanstack/react-query";
import { CategoryType } from "../../types";

export default function useUpdateCategory() {
  const { instance } = useDexkitApiProvider();

  return useMutation(async (data: CategoryType) => {
    if (!instance) {
      throw new Error("no instance");
    }

    return (await instance?.put(`/product-category/${data?.id}`, data)).data;
  });
}
