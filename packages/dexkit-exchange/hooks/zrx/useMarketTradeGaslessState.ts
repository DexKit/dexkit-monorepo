import { ChainId } from "@dexkit/core";
import { useMemo } from "react";
import { useMarketGaslessTradeStatusQuery } from "./useMarketTradeGaslessExec";

export function useMarketTradeGaslessState({
  chainId,
  tradeHash,
  canGasless,
}: {
  chainId?: ChainId;
  tradeHash?: string;
  canGasless?: boolean;
}) {
  const statusGaslessQuery = useMarketGaslessTradeStatusQuery({
    chainId,
    tradeHash,
    canGasless,
  });

  const isLoadingStatusGasless = useMemo(() => {
    if (!canGasless) {
      return false;
    }

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
  }, [statusGaslessQuery.isLoading, statusGaslessQuery.data, canGasless]);

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
