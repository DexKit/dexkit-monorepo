import { useDexkitApiProvider } from "@dexkit/core/providers";
import { useMutation } from "@tanstack/react-query";
import { CategoryType } from "../../types";

export default function useCreateCategory() {
  const { instance } = useDexkitApiProvider();

  return useMutation(async (data: CategoryType) => {
    if (!instance) {
      throw new Error("no instance");
    }

    return (await instance?.post("/product-category/", data)).data;
  });
}
