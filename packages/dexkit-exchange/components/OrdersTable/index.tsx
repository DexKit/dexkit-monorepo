import { ChainId } from "@dexkit/core";
import { ConnectButton } from "@dexkit/ui/components/ConnectButton";
import {
  useDexKitContext,
  useExecuteTransactionsDialog,
} from "@dexkit/ui/hooks";
import { ZrxOrder } from "@dexkit/ui/modules/swap/types";
import { AppNotificationType } from "@dexkit/ui/types";
import {
  Box,
  Card,
  Divider,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { providers } from "ethers";
import { useCallback, useMemo } from "react";
import { FormattedMessage } from "react-intl";
import { EXCHANGE_NOTIFICATION_TYPES } from "../../constants/messages";
import { useExchangeContext } from "../../hooks";
import { useZrxOrderbook } from "../../hooks/zrx";
import { useZrxCancelOrderMutation } from "../../hooks/zrx/useZrxCancelOrderMutation";
import OrdersTableRow from "./OrdersTableRow";

export interface OrdersTable {
  chainId?: ChainId;
  account?: string;
  signer?: providers.JsonRpcSigner;
  active?: boolean;
}

export default function OrdersTable({
  chainId,
  account,
  signer,
  active,
}: OrdersTable) {
  const { baseToken, quoteToken } = useExchangeContext();
  const { createNotification } = useDexKitContext();
  const orderbookQuery = useZrxOrderbook({ chainId, account });

  const cancelOrderMutation = useZrxCancelOrderMutation();

  const transactionDialog = useExecuteTransactionsDialog();

  const handleCancelOrder = useCallback(
    async (
      order: ZrxOrder,
      baseTokenSymbol?: string,
      quoteTokenSymbol?: string,
      baseTokenAmount?: string,
      quoteTokenAmount?: string
    ) => {
      transactionDialog.execute([
        {
          action: async () => {
            const result = await cancelOrderMutation.mutateAsync({
              order,
              chainId,
              signer,
            });
            const subType = "orderCancelled";
            const messageType = EXCHANGE_NOTIFICATION_TYPES[
              subType
            ] as AppNotificationType;

            createNotification({
              type: "transaction",
              icon: messageType.icon,
              subtype: subType,
              metadata: {
                hash: result,
                chainId: chainId,
              },
              values: {
                sellAmount: baseTokenAmount || " ",
                sellTokenSymbol: baseTokenSymbol?.toUpperCase() || " ",
                buyAmount: quoteTokenAmount || " ",
                buyTokenSymbol: quoteTokenSymbol?.toUpperCase() || " ",
              },
            });

            return { hash: result };
          },
          icon: "receipt",
          title: {
            id: "cancel.token.order",
            defaultMessage: "Cancel token order",
          },
        },
      ]);
    },
    [chainId, signer]
  );

  const records = useMemo(() => {
    if (orderbookQuery.data?.records) {
      return orderbookQuery.data?.records.filter(
        (r) =>
          (r.order.makerToken.toLowerCase() ===
            baseToken?.address.toLowerCase() &&
            r.order.takerToken.toLowerCase() ===
              quoteToken?.address.toLowerCase()) ||
          (r.order.makerToken.toLowerCase() ===
            quoteToken?.address.toLowerCase() &&
            r.order.takerToken.toLowerCase() ===
              baseToken?.address.toLowerCase())
      );
    }
    return [];
  }, [orderbookQuery.data?.records, baseToken?.address, quoteToken?.address]);

  return (
    <Card>
      <Box sx={{ p: 2 }}>
        <Typography>
          <FormattedMessage id="my.orders" defaultMessage="My Orders" />
        </Typography>
      </Box>
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <FormattedMessage id="side" defaultMessage="Side" />
              </TableCell>
              <TableCell>
                <FormattedMessage id="size" defaultMessage="Size" />
              </TableCell>
              <TableCell>
                <FormattedMessage id="filled" defaultMessage="Filled" />
              </TableCell>
              <TableCell>
                <FormattedMessage id="price" defaultMessage="Price" />
              </TableCell>
              <TableCell>
                <FormattedMessage id="expires.in" defaultMessage="Expires in" />
              </TableCell>
              <TableCell>
                <FormattedMessage id="actions" defaultMessage="Actions" />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!active && (
              <TableRow>
                <TableCell colSpan={7}>
                  <Stack alignItems="center" spacing={2}>
                    <Typography align="center" variant="body1">
                      <FormattedMessage
                        id="your.wallet.is.not.connected"
                        defaultMessage="Your wallet is not connected"
                      />
                    </Typography>
                    <ConnectButton variant="contained" />
                  </Stack>
                </TableCell>
              </TableRow>
            )}

            {records?.length === 0 && (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography align="center" variant="body1">
                    <FormattedMessage
                      id="there.are.no.orders.to.show"
                      defaultMessage="There are no orders to show"
                    />
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {records.map((record, index) => (
              <OrdersTableRow
                key={index}
                onCancel={handleCancelOrder}
                record={record}
                account={account}
                baseToken={baseToken}
                quoteToken={quoteToken}
              />
            ))}
            {orderbookQuery.isLoading &&
              new Array(2).fill(null).map((_, key) => (
                <TableRow key={key}>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
