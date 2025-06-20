import { DexkitApiProvider } from "@dexkit/core/providers";
import { GridSortModel } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

export const GET_CHECKOUT_LIST = "GET_CHECKOUT_LIST";

export default function useCheckoutList(params: {
  page: number;
  limit: number;
  q?: string;
  sortModel?: GridSortModel;
}) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery(
    [GET_CHECKOUT_LIST, params, params.q],
    async () => {
      if (!instance) {
        throw new Error("no instance");
      }



      const newParams: any = { ...params };

      for (const sort of params?.sortModel ?? []) {
        newParams[sort.field] = sort.sort;
      }

      delete newParams["sortModel"];

      return (
        await instance.get("/checkouts", { params: newParams })
      ).data;
    },
    {
      refetchOnWindowFocus: "always",
      refetchOnMount: "always",
      staleTime: Infinity,
    }
  );
}
