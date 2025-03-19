import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useCallback } from "react";

export const wishlistAtom = atomWithStorage<string[]>(
  "dexkit.commerce.wishlist",
  [],
);

export function useCommerceWishlist() {
  const [wishlist, setWishlist] = useAtom(wishlistAtom);

  const handleAddToWishlist = useCallback((id: string) => {
    return () => {
      setWishlist((values) => [...values, id]);
    };
  }, []);

  const handleRemoveFromWishlist = useCallback((id: string) => {
    return () => {
      setWishlist((values) => values.filter((v) => v !== id));
    };
  }, []);

  const isOnWishlist = useCallback(
    (id: string) => {
      return wishlist.includes(id);
    },
    [wishlist],
  );

  return {
    wishlist,
    isOnWishlist,
    handleAddToWishlist,
    handleRemoveFromWishlist,
  };
}
