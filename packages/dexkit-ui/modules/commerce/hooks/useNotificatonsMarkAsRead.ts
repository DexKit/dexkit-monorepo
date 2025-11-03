import { useDexkitApiProvider } from "@dexkit/core/providers";
import { useMutation } from "@tanstack/react-query";

export default function useNotificationsMarkAsRead() {
  const { instance } = useDexkitApiProvider();

  return useMutation(async ({ id }: { id: string }) => {
    if (!instance) {
      throw new Error("no instance");
    }

    return (await instance?.post(`/notifications/${id}/read`)).data;
  });
}
