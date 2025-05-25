import { getBlockExplorerUrl, truncateAddress } from "@dexkit/core/utils";
import OpenInNew from "@mui/icons-material/OpenInNew";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Link,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { FormattedMessage } from "react-intl";
import { useTokenDataQuery } from "../../../hooks";
import { Order } from "../types";
import OrderStatusBadge from "./OrderStatusBadge";

export interface OrderDetailsCardProps {
  order: Order;
}

export default function OrderDetailsCard({ order }: OrderDetailsCardProps) {
  const theme = useTheme();

  const { data: tokenData } = useTokenDataQuery({
    chainId: order.chainId,
    address: order.contractAddress,
  });

  return (
    <Card>
      <CardContent sx={{ px: 0 }}>
        <Stack spacing={2}>
          <Stack
            sx={{ px: 2 }}
            justifyContent="space-between"
            direction="row"
            alignItems="center"
          >
            <Typography variant="h6">
              <FormattedMessage
                id="order.details"
                defaultMessage="Order Details"
              />
            </Typography>
          </Stack>
          <Divider />
          <Stack sx={{ px: 2 }} direction="row" alignItems="center" spacing={2}>
            <OrderStatusBadge status={order.status} palette={theme.palette} />
            <Button
              target="_blank"
              href={`${getBlockExplorerUrl(order.chainId)}/tx/${order.hash}`}
              startIcon={<OpenInNew />}
            >
              <FormattedMessage
                id="view.transaction"
                defaultMessage="view transaction"
              />
            </Button>
          </Stack>
          <Divider />
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Box>
                  <Stack spacing={1} sx={{ px: 2 }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography fontWeight="bold">
                        <FormattedMessage id="id" defaultMessage="ID" />
                      </Typography>
                      <Typography variant="body2">
                        {order.id.substring(10)}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography fontWeight="bold">
                        <FormattedMessage
                          id="creator"
                          defaultMessage="Creator"
                        />
                      </Typography>
                      <Typography variant="body2">
                        <Link
                          target="_blank"
                          href={`${getBlockExplorerUrl(
                            order.chainId
                          )}/address/${order.senderAddress}`}
                        >
                          {truncateAddress(order.senderAddress)}
                        </Link>
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography fontWeight="bold">
                        <FormattedMessage id="token" defaultMessage="Token" />
                      </Typography>
                      <Typography variant="body2">
                        <Link
                          target="_blank"
                          href={`${getBlockExplorerUrl(
                            order.chainId
                          )}/address/${order.contractAddress}`}
                        >
                          {tokenData?.name}
                        </Link>
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography fontWeight="bold">
                        <FormattedMessage id="total" defaultMessage="Total" />
                      </Typography>
                      <Typography variant="body2">
                        {order.amount} {tokenData?.symbol.toUpperCase()}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
