import { UserEventsType } from "@dexkit/core/constants/userEvents";
import { DexkitApiProvider } from "@dexkit/core/providers";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import { useContext } from "react";
import { useDexKitContext } from ".";
import { postTrackUserEvent } from "../services/userEvents";

export function useTrackUserEventsMutation() {
  const { userEventURL, siteId, affiliateReferral, apiKey } = useDexKitContext();
  const { account } = useWeb3React();

  return useMutation(
    async ({
      event,
      metadata,
      hash,
      chainId,
      from,
    }: {
      event: UserEventsType;
      metadata?: string;
      hash?: string;
      chainId?: number;
      from?: string;
    }) => {
      return postTrackUserEvent({
        event,
        metadata,
        hash,
        chainId,
        apiKey,
        siteId,
        account: account || from,
        userEventURL,
        referral: affiliateReferral,
      });
    }
  );
}

const USER_EVENTS_LIST_QUERY = "user-events-list-query";

export type UserEvent<T = any> = {
  id: number;
  type: string | null;
  hash: string | null;
  chainId: number | null;
  networkId: string | null;
  status: string | null;
  from: string | null;
  referral: string | null;
  processed: boolean | null;
  createdAt: Date;
  updatedAt: Date;
  siteId: number | null;
  userId: number | null;
  accountId: number | null;
  metadata: any;
  processedMetadata: T;
};

export function useUserEventsList<T = any>({
  instance,
  page = 0,
  pageSize = 10,
  sort,
  siteId,
  filter,
}: {
  page?: number;
  pageSize?: number;
  siteId?: number;
  sort?: string[];
  filter?: any;
  instance?: AxiosInstance | null;
}) {
  return useQuery<{
    data: UserEvent<T>[];
    skip?: number;
    take?: number;
    total?: number;
  }>(
    [USER_EVENTS_LIST_QUERY, siteId, sort, page, pageSize, filter],
    async () => {
      if (instance) {
        return (
          await instance.get<{
            data: UserEvent<T>[];
            skip?: number;
            take?: number;
            total?: number;
          }>(`/user-events/site/all/${siteId}`, {
            params: {
              skip: page * pageSize,
              take: pageSize,
              sort,
              filter: filter ? JSON.stringify(filter) : undefined,
            },
          })
        ).data;
      }

      return { data: [] };
    }
  );
}

export type CountFilter = {
  siteId?: number;
  chainId?: number;
  referral?: string;
  skip?: number;
  take?: number;
  from?: string;
  start: string;
  end: string;
  type?: string;
};

export const TOP_USER_EVENTS_QUERY = "TOP_USER_EVENTS_QUERY";

export function useTopUserEvents({ filters }: { filters: CountFilter }) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery([TOP_USER_EVENTS_QUERY, filters], async () => {
    if (!filters.siteId) {
      return [];
    }

    if (!instance) {
      throw new Error("no http client");
    }

    return (
      (
        await instance?.get("/user-events/count-by-type", {
          params: filters,
        })
      ).data || []
    );
  });
}

const COUNT_USER_EVENTS_QUERY = "COUNT_USER_EVENTS_QUERY";

export function useCountUserEvents({ filters }: { filters: CountFilter }) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery([COUNT_USER_EVENTS_QUERY, filters], async () => {
    if (!filters.siteId) {
      return 0;
    }

    if (!instance) {
      throw new Error("no http client");
    }

    return (
      (
        await instance?.get("/user-events/count", {
          params: filters,
        })
      ).data?.count || Number(0)
    );
  });
}

export const COUNT_EVENT_ACCOUNTS_QUERY = "COUNT_EVENT_ACCOUNTS_QUERY";

export function useCountEventAccounts({ filters }: { filters: CountFilter }) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery([COUNT_EVENT_ACCOUNTS_QUERY, filters], async () => {
    if (!filters.siteId) {
      return 0;
    }

    if (!instance) {
      throw new Error("no http client");
    }

    return (
      (
        await instance?.get("/user-events/count-accounts", {
          params: filters,
        })
      ).data?.count || Number(0)
    );
  });
}

type TokenInfo = {
  tokenName: string;
  symbol: string;
  amount: string;
  decimals: number;
};

type TokenFeesResult = {
  [tokenAddress: string]: TokenInfo;
};

const SWAP_FEES_BY_TOKEN_QUERY = "SWAP_FEES_BY_TOKEN_QUERY";

export function useSwapFeesByToken({ filters }: { filters: CountFilter }) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery([SWAP_FEES_BY_TOKEN_QUERY, filters], async () => {
    if (!filters.siteId) {
      return {};
    }

    if (!instance) {
      throw new Error("no http client");
    }

    return (
      (
        await instance?.get("/user-events/fees-by-token", {
          params: filters,
        })
      ).data || {}
    );
  });
}

export type DropNFTTokenInfo = {
  tokenName: string;
  symbol: string;
  amount: string;
  decimals: number;
  nftAmount: number;
};

type DropNFTTokenResult = {
  [tokenAddress: string]: DropNFTTokenInfo;
};

const COUNT_COLLECTION_DROPS_QUERY = "COUNT_COLLECTION_DROPS_QUERY";

export function useCountDropCollection({ filters }: { filters: CountFilter }) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery([COUNT_COLLECTION_DROPS_QUERY, filters], async () => {
    if (!filters.siteId) {
      return {};
    }

    if (!instance) {
      throw new Error("no http client");
    }

    return (
      (
        await instance?.get("/user-events/count-buy-drop-collection", {
          params: filters,
        })
      ).data || {}
    );
  });
}

export const COUNT_COLLECTION_DROPS_BY_GROUP_QUERY =
  "COUNT_COLLECTION_DROPS_BY_GROUP_QUERY";

type DropNFTTokenAccountResult = {
  [key: string]: { tokens: DropNFTTokenResult };
};

export function useCountDropCollectionByGroup({
  filters,
  group,
}: {
  filters: CountFilter;
  group: string;
}) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery(
    [COUNT_COLLECTION_DROPS_BY_GROUP_QUERY, filters, group],
    async () => {
      if (!filters.siteId) {
        return {};
      }

      if (!instance) {
        throw new Error("no http client");
      }

      return (
        (
          await instance?.get(
            "/user-events/count-buy-drop-collection-by-group",
            {
              params: { ...filters, group },
            }
          )
        ).data || {}
      );
    }
  );
}

export const COUNT_DROP_BY_TOKEN_GROUP_QUERY =
  "COUNT_DROP_BY_TOKEN_GROUP_QUERY";

export type DropNFTTokenDropInfo = {
  [key: string]: {
    tokenName: string;
    symbol: string;
    amount: string;
    decimals: number;
    quantity: number;
  };
};

export type DropNFTTokenDropResult = {
  [key: string]: { tokens: DropNFTTokenDropInfo };
};

export function useCountDropTokenByGroup({
  filters,
  group,
}: {
  filters: CountFilter;
  group: string;
}) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery(
    [COUNT_DROP_BY_TOKEN_GROUP_QUERY, filters, group],
    async () => {
      if (!filters.siteId) {
        return {};
      }

      if (!instance) {
        throw new Error("no http client");
      }

      return (
        (
          await instance?.get("/user-events/count-buy-drop-token", {
            params: { ...filters, group },
          })
        ).data || {}
      );
    }
  );
}

export const COUNT_EDITION_DROPS_BY_GROUP_QUERY =
  "COUNT_COLLECTION_DROPS_BY_GROUP_QUERY";

export function useCountDropEditionByGroup({
  filters,
  group,
}: {
  filters: CountFilter;
  group: string;
}) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery(
    [COUNT_EDITION_DROPS_BY_GROUP_QUERY, filters, group],
    async () => {
      if (!filters.siteId) {
        return {};
      }

      if (!instance) {
        throw new Error("no http client");
      }

      return (
        (
          await instance?.get("/user-events/count-buy-drop-edition-by-group", {
            params: { ...filters, group },
          })
        ).data || {}
      );
    }
  );
}

type DropNFTEditionInfo = {
  tokenName: string;
  symbol: string;
  amount: string;
  decimals: number;
  nftAmount: number;
};

type DropNFTEditionResult = {
  [tokenAddress: string]: DropNFTEditionInfo;
};

const COUNT_EDITION_DROPS_QUERY = "COUNT_EDITION_DROPS_QUERY";

export function useCountDropEdition({ filters }: { filters: CountFilter }) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery([COUNT_EDITION_DROPS_QUERY, filters], async () => {
    if (!filters.siteId) {
      return {};
    }

    if (!instance) {
      throw new Error("no http client");
    }

    return (
      (
        await instance?.get("/user-events/count-buy-drop-edition", {
          params: filters,
        })
      ).data || {}
    );
  });
}
