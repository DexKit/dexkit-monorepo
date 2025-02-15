import { DexkitApiProvider } from "@dexkit/core/providers";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

export const GET_USER_PRODUCT_IMAGES = "GET_PRODUCT_IMAGES";

export type UseUserProductImagesParams = {
  productId: string;
};

export default function useUserProductImages({
  productId,
}: UseUserProductImagesParams) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery([GET_USER_PRODUCT_IMAGES, productId], async () => {
    if (!instance) {
      throw new Error("no instance");
    }

    return (
      await instance.get<{ id: string; imageUrl: string }[]>(
        `/products/user/${productId}/images`
      )
    ).data;
  });
}
