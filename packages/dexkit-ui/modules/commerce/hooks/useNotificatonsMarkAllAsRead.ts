import { DexkitApiProvider } from "@dexkit/core/providers";
import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";

export default function useNotificationsMarkAllAsRead() {
  const { instance } = useContext(DexkitApiProvider);

  return useMutation(async ({ ids }: { ids: string[] }) => {
    if (!instance) {
      throw new Error("no instance");
    }

    return await Promise.all(
      ids.map((id) => instance?.post(`/notifications/${id}/read`))
    );
  });
}
