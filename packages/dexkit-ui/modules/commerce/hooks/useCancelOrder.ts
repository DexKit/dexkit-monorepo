import { useDexkitApiProvider } from "@dexkit/core/providers";
import { useMutation } from "@tanstack/react-query";

export default function useCancelOrder() {
  const { instance } = useDexkitApiProvider();

  return useMutation(async (params: { id: string }) => {
    if (!instance) {
      throw new Error("no instance");
    }

    return (await instance.post(`/orders/${params.id}/cancel`)).data;
  });
}
