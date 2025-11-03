import { useDexkitApiProvider } from "@dexkit/core/providers";
import { useMutation } from "@tanstack/react-query";

export default function useNotificationsMarkAllAsRead() {
  const { instance } = useDexkitApiProvider();

  return useMutation(async ({ ids }: { ids: string[] }) => {
    if (!instance) {
      throw new Error("no instance");
    }

    return await Promise.all(
      ids.map((id) => instance?.post(`/notifications/${id}/read`))
    );
  });
}
