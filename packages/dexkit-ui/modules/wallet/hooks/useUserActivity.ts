import { DexkitApiProvider } from "@dexkit/core/providers";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useContext } from "react";

export const USER_ACTIVITY_QUERY = "USER_ACTIVITY_QUERY";

export interface UserActivityParams {
  account?: string;
  pageSize?: number;
}

export type UserEvent = {
  id: number;
  type: string | null;
  hash: string | null;
  chainId: number | null;
  networkId: string | null;
  status: string | null;
  from: string | null;
  referral: string | null;
  processed: boolean | null;
  createdAt: string;
  updatedAt: string;
  siteId: number | null;
  userId: number | null;
  accountId: number | null;
  metadata: any | null;
  processedMetadata: any | null;
};

export default function useUserActivity({
  account,
  pageSize,
}: UserActivityParams) {
  const { instance } = useContext(DexkitApiProvider);

  return useInfiniteQuery(
    [USER_ACTIVITY_QUERY, account, pageSize],
    async ({ pageParam = 0 }) => {
      const data = (
        await instance?.get(
          "/user-events/events",
          { params: { page: pageParam, pageSize } }
        )
      )?.data;
      // Remove offchain wallet events from the activity feed
      // Currently we identify these as events of type 'connectAccount'
      if (data?.data && Array.isArray(data.data)) {
        return {
          ...data,
          data: data.data.filter((e: any) => e?.type !== "connectAccount"),
        };
      }

      return data;
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage) {
          return lastPage?.page + 1;
        }
      },
    }
  );
}
