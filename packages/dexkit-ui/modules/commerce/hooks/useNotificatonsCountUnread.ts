import { useDexkitApiProvider } from "@dexkit/core/providers";
import { useQuery } from "@tanstack/react-query";

export const NOTIFICATIONS_COUNT_UNREAD_QUERY =
  "NOTIFICATIONS_COUNT_UNREAD_QUERY";

export default function useNotificationsCountUnread({
  scope,
}: {
  scope: string;
}) {
  const { instance } = useDexkitApiProvider();

  return useQuery(
    [NOTIFICATIONS_COUNT_UNREAD_QUERY, scope],
    async () => {
      if (!instance) {
        throw new Error("no instance");
      }

      return (
        await instance?.get("/notifications/count-unread", { params: { scope } })
      ).data;
    },
    {
      refetchOnMount: "always",
      refetchOnWindowFocus: "always",
      refetchInterval: 5000,
    }
  );
}
