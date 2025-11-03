import { useDexkitApiProvider } from "@dexkit/core/providers";
import { useQuery } from "@tanstack/react-query";

export const NOTIFICATIONS_QUERY = "NOTIFICATIONS_QUERY";

export default function useNotifications(params: {
  page: number;
  limit: number;
  status: string;
  scope: string;
}) {
  const { instance } = useDexkitApiProvider();

  return useQuery([NOTIFICATIONS_QUERY, params], async () => {
    if (!instance) {
      throw new Error("no instance");
    }

    return (
      await instance?.get("/notifications/", { params })
    ).data;
  });
}
