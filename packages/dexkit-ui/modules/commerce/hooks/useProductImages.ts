import { DexkitApiProvider } from "@dexkit/core/providers";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

export const GET_PRODUCT_IMAGES = "GET_PRODUCT_IMAGES";

export type UseProductImagesParams = {
  productId?: string;
};

export default function useProductImages({
  productId,
}: UseProductImagesParams) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery(
    [GET_PRODUCT_IMAGES, productId],
    async () => {
      if (!instance) {
        throw new Error("no instance");
      }

      if (!productId) {
        return null;
      }

      return (
        await instance.get<{ id: string; imageUrl: string }[]>(
          `/products/${productId}/images`
        )
      ).data;
    },
    { enabled: !!productId }
  );
}
