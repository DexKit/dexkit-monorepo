import { Token } from "@dexkit/core/types";
import { isAddressEqual } from "@dexkit/core/utils";
import { formatUnits } from "@dexkit/core/utils/ethers/formatUnits";
import MomentFromSpan from "@dexkit/ui/components/MomentFromSpan";
import { ZrxOrder, ZrxOrderRecord } from "@dexkit/ui/modules/swap/types";
import { Button, TableCell, TableRow, Typography } from "@mui/material";
import { BigNumber } from "ethers";
import moment from "moment";
import { useMemo } from "react";
import { FormattedMessage } from "react-intl";

export interface OrdersTableRowProps {
  baseToken?: Token;
  quoteToken?: Token;
  record: ZrxOrderRecord;
  account?: string;
  onCancel: (
    order: ZrxOrder,
    baseTokenSymbol?: string,
    quoteTokenSymbol?: string,
    baseTokenAmount?: string,
    quoteTokenAmount?: string,
  ) => void;
}

export default function OrdersTableRow({
  record,
  quoteToken,
  baseToken,
  account,
  onCancel,
}: OrdersTableRowProps) {
  const side = useMemo(() => {
    return isAddressEqual(baseToken?.address, record.order.takerToken)
      ? "buy"
      : "sell";
  }, [baseToken, record]);

  const quoteTokenAmount = useMemo(() => {
    const decimals =
      side === "sell" ? quoteToken?.decimals : baseToken?.decimals;

    return formatUnits(record.order.takerAmount, decimals);
  }, [record, quoteToken]);

  const baseTokenAmount = useMemo(() => {
    const decimals =
      side === "buy" ? quoteToken?.decimals : baseToken?.decimals;

    return formatUnits(record.order.makerAmount, decimals);
  }, [record, baseToken, side]);

  const price = useMemo(() => {
    if (baseTokenAmount && quoteTokenAmount) {
      return side === "buy"
        ? Number(baseTokenAmount) / Number(quoteTokenAmount)
        : Number(quoteTokenAmount) / Number(baseTokenAmount);
    }
  }, [quoteTokenAmount, baseTokenAmount, side]);

  const remainingFillableAmountFormatted = useMemo(() => {
    const decimals =
      side === "buy" ? baseToken?.decimals : quoteToken?.decimals;

    const amountToBeFilled = BigNumber.from(record.order.takerAmount);
    const remainingFillableAmount = BigNumber.from(
      record.metaData.remainingFillableTakerAmount,
    );

    return formatUnits(amountToBeFilled.sub(remainingFillableAmount), decimals);
  }, [quoteToken, record]);

  const quoteTokenSymbol = useMemo(() => {
    const symbol =
      side === "sell"
        ? quoteToken?.symbol.toUpperCase()
        : baseToken?.symbol.toUpperCase();

    return symbol;
  }, [record, quoteToken]);

  const baseTokenSymbol = useMemo(() => {
    const symbol =
      side === "buy"
        ? quoteToken?.symbol.toUpperCase()
        : baseToken?.symbol.toUpperCase();

    return symbol;
  }, [record, quoteToken]);

  const handleCancel = () => {
    onCancel(
      record.order,
      baseTokenSymbol,
      quoteTokenSymbol,
      baseTokenAmount,
      quoteTokenAmount,
    );
  };

  return (
    <TableRow>
      <TableCell>
        <Typography
          sx={{
            color: (theme) =>
              side === "buy"
                ? theme.palette.success.main
                : theme.palette.error.main,
          }}
        >
          {side === "buy" ? (
            <FormattedMessage id="buy" defaultMessage="Buy" />
          ) : (
            <FormattedMessage id="sell" defaultMessage="Sell" />
          )}
        </Typography>
      </TableCell>
      <TableCell>
        {baseTokenAmount} {baseTokenSymbol}
      </TableCell>
      <TableCell>
        {remainingFillableAmountFormatted} {quoteTokenSymbol}
      </TableCell>

      <TableCell>
        {price} {quoteTokenSymbol}
      </TableCell>
      <TableCell>
        <MomentFromSpan from={moment(parseInt(record.order.expiry) * 1000)} />
      </TableCell>
      <TableCell>
        <Button
          onClick={handleCancel}
          disabled={
            !isAddressEqual(account, record.order.maker) &&
            !isAddressEqual(account, record.order.taker)
          }
          size="small"
        >
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
