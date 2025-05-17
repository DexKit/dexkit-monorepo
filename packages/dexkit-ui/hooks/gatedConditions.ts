import { GatedCondition } from "@dexkit/ui/modules/wizard/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { checkGatedConditions } from "../services/gatedConditions";
import { PROTECTED_CONFIG_QUERY } from "./app/useProtectedAppConfig";

export interface GatedConditionsResult {
  result: boolean;
  balances: { [key: number]: string };
  partialResults: { [key: number]: boolean };
  error?: boolean;
  errorMessage?: string;
}

export function useCheckGatedConditions({
  conditions,
  account,
}: {
  conditions?: GatedCondition[];
  account?: string;
}) {
  const queryClient = useQueryClient();

  return useQuery<GatedConditionsResult | null>(
    ["GET_CHECKED_GATED_CONDITIONS", account, conditions],
    async () => {
      if (!conditions) {
        return null;
      }

      if (!account) {
        return {
          result: false,
          balances: {},
          partialResults: {},
        };
      }

      try {
        const data = await checkGatedConditions({ account, conditions });

        const hasAnyTokenCondition = Object.values(data.balances || {}).some(
          (balance) => balance === "Any token"
        );

        if (hasAnyTokenCondition) {
          const allConditionsMet = Object.values(
            data.partialResults || {}
          ).every((result) => result === true);

          if (allConditionsMet && !data.result) {
            data.result = true;
          }
        }

        return data;
      } catch (error) {
        console.error("Error verifying gated conditions", error);
        const balances: { [key: number]: string } = {};
        const partialResults: { [key: number]: boolean } = {};

        conditions.forEach((_, index) => {
          balances[index] = "Error";
          partialResults[index] = false;
        });

        return {
          result: false,
          balances,
          partialResults,
          error: true,
          errorMessage:
            "An error occurred while verifying your assets. Please try again.",
        };
      }
    },
    {
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
      keepPreviousData: true,
      staleTime: 10000,
      onSuccess: (data) => {
        if (data && data.result) {
          queryClient.invalidateQueries([PROTECTED_CONFIG_QUERY]);
          queryClient.invalidateQueries(["GET_PROTECTED_APP_CONFIG"]);
        }
      },
    }
  );
}
