import { DexkitApiProvider } from "@dexkit/core/providers";
import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";

export const GET_PRODUCT_IMAGES = "GET_PRODUCT_IMAGES";

export type UseProductImagesParams = {
  productId?: string;
};

export default function useRemoveProductImages({
  productId,
}: UseProductImagesParams) {
  const { instance } = useContext(DexkitApiProvider);

  return useMutation(async ({ imageIds }: { imageIds: string[] }) => {
    if (!instance) {
      throw new Error("no instance");
    }

    if (!productId) {
      return null;
    }

    return (
      await instance.delete(`/products/${productId}/images`, {
        data: { ids: imageIds },
      })
    ).data;
  });
}
