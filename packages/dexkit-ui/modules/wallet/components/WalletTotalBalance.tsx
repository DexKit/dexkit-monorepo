import { ChainId } from "@dexkit/core/constants";
import { useMemo } from "react";
import { FormattedNumber } from "react-intl";

import { formatUnits } from "@dexkit/core/utils/ethers/formatUnits";
import { useCurrency } from "../../../hooks/currency";
import { useSimpleCoinPricesQuery } from "../../../hooks/currency/useSimpleCoinPricesCurrency";
import { useERC20BalancesQuery, useIsBalanceVisible } from "../hooks";

interface Props {
  chainId?: ChainId;
}

export function WalletTotalBalance({ chainId }: Props) {
  const isBalancesVisible = useIsBalanceVisible();
  const currency = useCurrency();

  const coinPricesQuery = useSimpleCoinPricesQuery({
    includeNative: true,
    chainId: chainId,
  });
  const tokenBalancesQuery = useERC20BalancesQuery(undefined, chainId, false);

  console.log(tokenBalancesQuery);

  const totalBalance = useMemo(() => {
    if (tokenBalancesQuery.data && coinPricesQuery.data) {
      const prices = coinPricesQuery.data;

      const tokenBalances = tokenBalancesQuery.data.map((tb) => {
        return {
          balanceUnits: formatUnits(tb.balance, tb.token.decimals),
          address: tb.token.address.toLowerCase(),
        };
      });

      const tokenValues = tokenBalances
        .filter((t) => prices[t.address])
        .map(
          (t) => Number(t.balanceUnits) * prices[t.address][currency.currency]
        );

      if (tokenValues && tokenValues.length) {
        return (
          <FormattedNumber
            value={tokenValues.reduce((p, c) => p + c)}
            style="currency"
            currency={currency.currency}
          />
        );
      } else {
        ("----.--");
      }
    }
  }, [tokenBalancesQuery.data, coinPricesQuery.data, currency]);

  return <>{isBalancesVisible ? totalBalance : "-------"}</>;
}
