import { ChainId } from "@dexkit/core";
import { useMemo } from "react";
import { useMarketGaslessTradeStatusQuery } from "./useMarketTradeGaslessExec";

export function useMarketTradeGaslessState({
  chainId,
  tradeHash,
}: {
  zeroExApiKey?: string;
  chainId?: ChainId;
  tradeHash?: string;
}) {
  const statusGaslessQuery = useMarketGaslessTradeStatusQuery({
    chainId,
    tradeHash,
  });

  const isLoadingStatusGasless = useMemo(() => {
    if (statusGaslessQuery.isLoading) {
      return true;
    }
    if (
      statusGaslessQuery.data &&
      statusGaslessQuery.data.status !== "confirmed"
    ) {
      return true;
    }
    return false;
  }, [statusGaslessQuery.isLoading, statusGaslessQuery.data]);

  const successTxGasless = useMemo(() => {
    if (!tradeHash) {
      return;
    }

    if (
      statusGaslessQuery.data &&
      statusGaslessQuery.data.status === "succeeded"
    ) {
      return statusGaslessQuery.data.transactions
        ? statusGaslessQuery.data.transactions[0]
        : undefined;
    }
  }, [statusGaslessQuery.isLoading, tradeHash, statusGaslessQuery.data]);

  const confirmedTxGasless = useMemo(() => {
    if (!tradeHash) {
      return;
    }

    if (
      statusGaslessQuery.data &&
      statusGaslessQuery.data.status === "confirmed"
    ) {
      return statusGaslessQuery.data.transactions
        ? statusGaslessQuery.data.transactions[0]
        : undefined;
    }
  }, [statusGaslessQuery.isLoading, tradeHash, statusGaslessQuery.data]);

  const reasonFailedGasless = useMemo(() => {
    if (!tradeHash) {
      return;
    }
    if (
      statusGaslessQuery.data &&
      statusGaslessQuery.data.status !== "failed" &&
      statusGaslessQuery.data.reason
    ) {
      return statusGaslessQuery.data.reason;
    }
  }, [statusGaslessQuery?.data, tradeHash]);

  return {
    statusGaslessQuery,
    isLoadingStatusGasless,
    successTxGasless,
    reasonFailedGasless,
    confirmedTxGasless,
  };
}
