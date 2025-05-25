import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useSnackbar } from "notistack";
import { useCallback } from "react";

import { useIntl } from "react-intl";

export const wishlistAtom = atomWithStorage<string[]>(
  "dexkit.commerce.wishlist",
  []
);

export function useCommerceWishlist() {
  const [wishlist, setWishlist] = useAtom(wishlistAtom);

  const handleAddToWishlist = useCallback((id: string) => {
    return () => {
      setWishlist((values) => [...values, id]);
      enqueueSnackbar(
        formatMessage({
          id: "add.to.wishlist",
          defaultMessage: "Added to wishlist",
        }),
        { variant: "success" }
      );
    };
  }, []);

  const { formatMessage } = useIntl();

  const { enqueueSnackbar } = useSnackbar();

  const handleRemoveFromWishlist = useCallback((id: string) => {
    return () => {
      setWishlist((values) => values.filter((v) => v !== id));
      enqueueSnackbar(
        formatMessage({
          id: "removed.from.wishlist",
          defaultMessage: "Removed from wishlist",
        }),
        { variant: "success" }
      );
    };
  }, []);

  const isOnWishlist = useCallback(
    (id: string) => {
      return wishlist.includes(id);
    },
    [wishlist]
  );

  return {
    wishlist,
    isOnWishlist,
    handleAddToWishlist,
    handleRemoveFromWishlist,
  };
}
