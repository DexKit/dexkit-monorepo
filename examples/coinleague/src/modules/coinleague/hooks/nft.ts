import { useRouter } from "next/router";
import { useMemo } from "react";
import { COINLEAGUENFT_ROUTE } from "../constants/routes";


export const useIsNFTGame = () => {
  const { pathname } = useRouter();
  return useMemo(() => {
    if (pathname.startsWith(COINLEAGUENFT_ROUTE)) {
      return true;
    } else {
      return false;
    }
  }, [pathname]);
};
