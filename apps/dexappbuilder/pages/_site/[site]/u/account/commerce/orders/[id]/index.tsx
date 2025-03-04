import DashboardLayout from '@/modules/commerce/components/layout/DashboardLayout';
import useOrder from '@/modules/commerce/hooks/orders/useOrder';
import useOrderItems from '@/modules/commerce/hooks/orders/useOrderItems';
import useCancelOrder from '@/modules/commerce/hooks/useCancelOrder';
import useFinalizeOrder from '@/modules/commerce/hooks/useFinalizeOrder';
import useRefundOrder from '@/modules/commerce/hooks/useRefundOrder';
import { Order } from '@/modules/commerce/types';
import { getBlockExplorerUrl, truncateAddress } from '@dexkit/core/utils';
import { useTokenDataQuery } from '@dexkit/ui';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import Check from '@mui/icons-material/Check';
import Close from '@mui/icons-material/Close';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import {
  Button,
  Card,
  CardContent,
  Grid,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Decimal from 'decimal.js';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { FormattedMessage } from 'react-intl';

interface OrderComponentProps {
  order: Order;
}

function OrderComponent({ order }: OrderComponentProps) {
  const { data: items } = useOrderItems({ id: order.id });

  const { data: tokenData } = useTokenDataQuery({
    chainId: order.chainId,
    address: order.contractAddress,
  });

  const renderStatusText = (status: string) => {
    const statusText: { [key: string]: React.ReactNode } = {
      PaymentConfirmed: (
        <FormattedMessage id="confirmed" defaultMessage="Confirmed" />
      ),
      Pending: <FormattedMessage id="pending" defaultMessage="Pending" />,
      Finalized: <FormattedMessage id="finalzied" defaultMessage="Finalized" />,
      Refunded: <FormattedMessage id="refunded" defaultMessage="Refunded" />,
      Cancelled: <FormattedMessage id="cancelled" defaultMessage="Cancelled" />,
    };

    return statusText[status];
  };

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
          variant: 'success',
        },
      );
    } catch (err) {
      enqueueSnackbar(String(err), { variant: 'error' });
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
          variant: 'success',
        },
      );
    } catch (err) {
      enqueueSnackbar(String(err), { variant: 'error' });
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
          variant: 'success',
        },
      );
    } catch (err) {
      enqueueSnackbar(String(err), { variant: 'error' });
    }
  };

  return (
    <Stack spacing={2}>
      <PageHeader
        breadcrumbs={[
          {
            caption: (
              <FormattedMessage id="commerce" defaultMessage="Commerce" />
            ),
            uri: '/u/account/commerce',
          },
          {
            caption: <FormattedMessage id="orders" defaultMessage="Orders" />,
            uri: '/u/account/commerce/orders',
          },
          {
            caption: order.id.substring(10),
            uri: `/u/account/commerce/orders/${order.id}`,
            active: true,
          },
        ]}
      />
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item>
              <Typography variant="caption" color="text.secondary">
                <FormattedMessage id="id" defaultMessage="ID" />
              </Typography>
              <Typography variant="body2">{order.id.substring(10)}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="caption" color="text.secondary">
                <FormattedMessage id="creator" defaultMessage="Creator" />
              </Typography>
              <Typography variant="body2">
                <Link
                  target="_blank"
                  href={`${getBlockExplorerUrl(order.chainId)}/address/${
                    order.senderAddress
                  }`}
                >
                  {truncateAddress(order.senderAddress)}
                </Link>
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="caption" color="text.secondary">
                <FormattedMessage id="token" defaultMessage="Token" />
              </Typography>
              <Typography variant="body2">
                <Link
                  target="_blank"
                  href={`${getBlockExplorerUrl(order.chainId)}/address/${
                    order.contractAddress
                  }`}
                >
                  {tokenData?.name}
                </Link>
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="caption" color="text.secondary">
                <FormattedMessage id="status" defaultMessage="Status" />
              </Typography>
              <Typography variant="body2">
                {renderStatusText(order.status)}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="caption" color="text.secondary">
                <FormattedMessage id="total" defaultMessage="Total" />
              </Typography>
              <Typography variant="body2">
                {order.amount} {tokenData?.symbol.toUpperCase()}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <FormattedMessage id="product" defaultMessage="Product" />
                </TableCell>
                <TableCell>
                  <FormattedMessage id="un.price" defaultMessage="Un. Price" />
                </TableCell>
                <TableCell>
                  <FormattedMessage id="quantity" defaultMessage="Quantity" />
                </TableCell>
                <TableCell>
                  <FormattedMessage id="total" defaultMessage="Total" />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>
                    {item.price} {tokenData?.symbol.toUpperCase()}
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    {new Decimal(item.quantity).mul(item.price).toNumber()}{' '}
                    {tokenData?.symbol.toUpperCase()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
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
        <Button onClick={handleCancel} startIcon={<Close />} variant="outlined">
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
      </Stack>
    </Stack>
  );
}

export default function OrderPage() {
  const router = useRouter();

  const { id } = router.query;

  const { data, isFetchedAfterMount } = useOrder({ id: id as string });

  return data && isFetchedAfterMount && <OrderComponent order={data} />;
}

OrderPage.getLayout = (page: any) => {
  return <DashboardLayout page="orders">{page}</DashboardLayout>;
};
