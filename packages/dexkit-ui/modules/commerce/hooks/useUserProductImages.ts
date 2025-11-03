import { useDexkitApiProvider } from "@dexkit/core/providers";
import { useQuery } from "@tanstack/react-query";

export const GET_USER_PRODUCT_IMAGES = "GET_PRODUCT_IMAGES";

export type UseUserProductImagesParams = {
  productId: string;
};

export default function useUserProductImages({
  productId,
}: UseUserProductImagesParams) {
  const { instance } = useDexkitApiProvider();

  return useQuery([GET_USER_PRODUCT_IMAGES, productId], async () => {
    if (!instance) {
      throw new Error("no instance");
    }

    return (
      await instance.get(
        `/products/user/${productId}/images`
      )
    ).data as { id: string; imageUrl: string }[];
  });
}
