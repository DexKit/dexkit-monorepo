import { DexkitApiProvider } from "@dexkit/core/providers";
import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";

export const GET_PRODUCT_IMAGES = "GET_PRODUCT_IMAGES";

export type UseAddProductImagesParams = {
  productId?: string;
};

export default function useAddProductImages({
  productId,
}: UseAddProductImagesParams) {
  const { instance } = useContext(DexkitApiProvider);

  return useMutation(async ({ images }: { images: string[] }) => {
    if (!instance) {
      throw new Error("no instance");
    }

    if (!productId) {
      return null;
    }

    return (await instance.post(`/products/${productId}/images`, { images }))
      .data;
  });
}
