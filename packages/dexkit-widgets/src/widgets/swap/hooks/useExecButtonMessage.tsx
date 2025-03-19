import { useMemo } from "react";
import { FormattedMessage } from "react-intl";

export function useExecButtonMessage({
  quoteQuery,
  sellTokenSymbol,
  execType,
  networkName,
  insufficientBalance,
}: {
  quoteQuery: any;
  sellTokenSymbol?: string;
  execType?: string;
  networkName?: string;
  insufficientBalance?: boolean;
}) {
  return useMemo(() => {
    return () => {
      if (quoteQuery?.isError) {
        if (quoteQuery?.error) {
          if (quoteQuery?.error?.response?.data.details) {
            return quoteQuery?.error?.response?.data.details[0].reason;
          } else if (quoteQuery?.error?.response?.data.name) {
            return quoteQuery?.error?.response?.data.name.split("_").join(" ");
          }
        }
      }

      if (quoteQuery?.isLoading) {
        return <FormattedMessage id="quoting" defaultMessage="Quoting" />;
      }

      if (insufficientBalance) {
        return (
          <FormattedMessage
            id="insufficient.symbol.balance"
            defaultMessage="Insufficient {symbol} balance"
            values={{ symbol: sellTokenSymbol?.toUpperCase() }}
          />
        );
      }
      return execType === "wrap" ? (
        <FormattedMessage id="wrap" defaultMessage="Wrap" />
      ) : execType === "unwrap" ? (
        <FormattedMessage id="Unwrap" defaultMessage="Unwrap" />
      ) : execType === "switch" ? (
        <FormattedMessage
          id="switch.wallet.network"
          defaultMessage="Switch wallet to {networkName}"
          values={{ networkName }}
        />
      ) : execType === "approve" ? (
        <FormattedMessage id="approve" defaultMessage="Approve" />
      ) : execType === "network_not_supported" ? (
        <FormattedMessage
          id="network_not_supported"
          defaultMessage="Network not supported"
        />
      ) : (
        <FormattedMessage id="swap" defaultMessage="Swap" />
      );
    };
  }, [
    quoteQuery?.isError,
    quoteQuery?.isLoading,
    quoteQuery?.error,
    networkName,
    sellTokenSymbol,
    insufficientBalance,
  ]);
}
