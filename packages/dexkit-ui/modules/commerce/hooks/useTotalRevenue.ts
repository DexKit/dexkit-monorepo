import { useDexkitApiProvider } from "@dexkit/core/providers";
import { useQuery } from "@tanstack/react-query";

export const GET_TOTAL_REVENUE = "GET_TOTAL_REVENUE";

export default function useTotalRevenue() {
  const { instance } = useDexkitApiProvider();

  return useQuery([GET_TOTAL_REVENUE], async () => {
    if (!instance) {
      throw new Error(" no instance");
    }

    return (await instance.get(`/orders/total-revenue`)).data;
  });
}
