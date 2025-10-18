import { copyToClipboard } from "@dexkit/core/utils";
import { useTokenDataQuery } from "@dexkit/ui";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Check from "@mui/icons-material/Check";
import Close from "@mui/icons-material/Close";
import FileCopyOutlined from "@mui/icons-material/FileCopyOutlined";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import Decimal from "decimal.js";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { FormattedMessage, useIntl } from "react-intl";
import CopyIconButton from "../../../../components/CopyIconButton";
import useCancelOrder from "../../hooks/useCancelOrder";
import useFinalizeOrder from "../../hooks/useFinalizeOrder";
import useOrder from "../../hooks/useOrder";
import useOrderItems from "../../hooks/useOrderItems";
import useRefundOrder from "../../hooks/useRefundOrders";
import { Order } from "../../types";
import DashboardLayout from "../layouts/DashboardLayout";
import OrderDetailsCard from "../OrderDetailsCard";
import useParams from "./hooks/useParams";

interface OrderComponentProps {
  order: Order;
  onRefetch: () => Promise<void>;
}

function OrderComponent({ order, onRefetch }: OrderComponentProps) {
  const { data: items } = useOrderItems({ id: order.id });

  const { data: tokenData } = useTokenDataQuery({
    chainId: order.chainId,
    address: order.contractAddress,
  });

  const { mutateAsync: finalize, isLoading: isFinalizeLoading } =
    useFinalizeOrder();
  const { mutateAsync: refund, isLoading: isRefundLoading } = useRefundOrder();
  const { mutateAsync: cancel, isLoading: isCancelLoading } = useCancelOrder();

  const { enqueueSnackbar } = useSnackbar();

  const handleFinalized = async () => {
    try {
      await finalize({ id: order.id });
      enqueueSnackbar(
        <FormattedMessage
          id="order.finalize"
          defaultMessage="Order finalized"
        />,
        {
          variant: "success",
        }
      );
      await onRefetch();
    } catch (err) {
      enqueueSnackbar(String(err), { variant: "error" });
    }
  };

  const handleCancel = async () => {
    try {
      await cancel({ id: order.id });
      enqueueSnackbar(
        <FormattedMessage
          id="order.cancelled"
          defaultMessage="Order cancelled"
        />,
        {
          variant: "success",
        }
      );
      await onRefetch();
    } catch (err) {
      enqueueSnackbar(String(err), { variant: "error" });
    }
  };

  const handleRefund = async () => {
    try {
      await refund({ id: order.id });
      enqueueSnackbar(
        <FormattedMessage
          id="order.refunded"
          defaultMessage="Order refunded"
        />,
        {
          variant: "success",
        }
      );
      await onRefetch();
    } catch (err) {
      enqueueSnackbar(String(err), { variant: "error" });
    }
  };

  const theme = useTheme();

  const { formatMessage } = useIntl();

  const { setContainer } = useParams();

  const handleCopy = () => {
    if (order.id) {
      copyToClipboard(order.id);
    }
  };

  return (
    <Stack spacing={2} alignItems="flex-start">
      <Stack direction="row" alignItems="center" spacing={1}>
        <IconButton
          onClick={() => {
            setContainer("commerce.orders");
          }}
          color="primary"
        >
          <ArrowBack color="primary" />
        </IconButton>
        <Typography variant="h5">
          <FormattedMessage
            id="order.id.order.alt"
            defaultMessage="Order ID: {order}"
            values={{
              order: (
                <Typography
                  variant="inherit"
                  component="span"
                  color="text.secondary"
                >
                  {order.id.substring(10)}
                </Typography>
              ),
            }}
          />
        </Typography>
        <CopyIconButton
          iconButtonProps={{
            onClick: handleCopy,
            size: "small",
          }}
          tooltip={formatMessage({
            id: "copy",
            defaultMessage: "Copy",
            description: "Copy text",
          })}
          activeTooltip={formatMessage({
            id: "copied",
            defaultMessage: "Copied!",
            description: "Copied text",
          })}
        >
          <FileCopyOutlined />
        </CopyIconButton>
      </Stack>
      <Box sx={{ width: "100%" }}>
        <Grid container spacing={2} justifyContent="center">
          <Grid size={{ xs: 12, sm: 8 }}>
            <Box>
              <Stack spacing={2}>
                <OrderDetailsCard order={order} />
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <FormattedMessage
                            id="product"
                            defaultMessage="Product"
                          />
                        </TableCell>
                        <TableCell>
                          <FormattedMessage
                            id="un.price"
                            defaultMessage="Un. Price"
                          />
                        </TableCell>
                        <TableCell>
                          <FormattedMessage
                            id="quantity"
                            defaultMessage="Quantity"
                          />
                        </TableCell>
                        <TableCell>
                          <FormattedMessage id="total" defaultMessage="Total" />
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items?.map((item: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Stack direction="row" spacing={2}>
                              <Avatar
                                src={item.product?.imageUrl ?? ""}
                                variant="rounded"
                                sx={{ height: "5rem", width: "5rem" }}
                              />
                              <Typography>{item.title}</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            {item.price} {tokenData?.symbol.toUpperCase()}
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>
                            {new Decimal(item.quantity)
                              .mul(item.price)
                              .toNumber()}{" "}
                            {tokenData?.symbol.toUpperCase()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Stack direction="row" alignItems="center" spacing={2}>
                  <Button
                    onClick={handleFinalized}
                    startIcon={<Check />}
                    variant="contained"
                  >
                    <FormattedMessage id="finalize" defaultMessage="Finalize" />
                  </Button>
                  <Button
                    onClick={handleRefund}
                    startIcon={<MoneyOffIcon />}
                    variant="outlined"
                  >
                    <FormattedMessage id="refund" defaultMessage="Refund" />
                  </Button>
                  <Button
                    onClick={handleCancel}
                    startIcon={<Close />}
                    variant="outlined"
                  >
                    <FormattedMessage id="cancel" defaultMessage="Cancel" />
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );
}

export default function OrderContainer() {
  const router = useRouter();

  const { get } = useParams();

  const id = get("id");

  const { data, isFetchedAfterMount, refetch } = useOrder({ id: id as string });

  return (
    data &&
    isFetchedAfterMount && (
      <DashboardLayout page="orders">
        <OrderComponent
          order={data}
          onRefetch={async () => {
            await refetch();
          }}
        />
      </DashboardLayout>
    )
  );
}
