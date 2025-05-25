import { DexkitApiProvider } from "@dexkit/core/providers";
import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";

export default function useNotificationsMarkAsRead() {
  const { instance } = useContext(DexkitApiProvider);

  return useMutation(async ({ id }: { id: string }) => {
    if (!instance) {
      throw new Error("no instance");
    }

    return (await instance?.post(`/notifications/${id}/read`)).data;
  });
}
