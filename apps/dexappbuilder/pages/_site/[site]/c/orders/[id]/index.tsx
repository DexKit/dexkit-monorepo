import useUserOrder from '@/modules/commerce/hooks/orders/useUserOrder';
import useUserOrderItems from '@/modules/commerce/hooks/orders/useUserOrderItems';
import { Order } from '@/modules/commerce/types';
import { DexkitApiProvider } from '@dexkit/core/providers';
import { useTokenDataQuery } from '@dexkit/ui';
import MainLayout from '@dexkit/ui/components/layouts/main';

import LockOpenIcon from '@mui/icons-material/LockOpen';
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Decimal from 'decimal.js';
import { useRouter } from 'next/router';
import { FormattedMessage, useIntl } from 'react-intl';
import { myAppsApi } from 'src/services/whitelabel';

import dynamic from 'next/dynamic';

import { useCallback, useState } from 'react';

const ConfirmOpenContentDialog = dynamic(
  () =>
    import(
      '@dexkit/ui/modules/commerce/components/dialogs/ConfirmOpenContentDialog'
    ),
);

import { copyToClipboard } from '@dexkit/core/utils';
import CopyIconButton from '@dexkit/ui/components/CopyIconButton';
import OrderDetailsCard from '@dexkit/ui/modules/commerce/components/OrderDetailsCard';
import ArrowBack from '@mui/icons-material/ArrowBack';
import FileCopy from '@mui/icons-material/FileCopy';
import Inventory from '@mui/icons-material/Inventory';

interface OrderComponentProps {
  order: Order;
}

function OrderComponent({ order }: OrderComponentProps) {
  const { data: items } = useUserOrderItems({ id: order.id });

  const { data: tokenData } = useTokenDataQuery({
    chainId: order.chainId,
    address: order.contractAddress,
  });

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(true);
  };

  const [selected, setSelected] = useState<{
    productId: string;
    orderId: string;
  }>();

  const handleOpen = useCallback((orderId: string, productId: string) => {
    return () => {
      setOpen(true);
      setSelected({ orderId, productId });
    };
  }, []);

  const handleConfirm = () => {
    if (selected) {
      window.open(
        `/c/content/${selected?.orderId}/${selected?.productId}`,
        '_blank',
      );
    }
    setOpen(false);
    setSelected(undefined);
  };

  const { formatMessage } = useIntl();

  const handleCopy = () => {
    if (order.id) {
      copyToClipboard(order.id);
    }
  };

  const router = useRouter();

  return (
    <>
      {open && (
        <ConfirmOpenContentDialog
          onConfirm={handleConfirm}
          DialogProps={{ open, onClose: handleClose }}
        />
      )}

      <Container>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton
              onClick={() => router.push('/c/orders')}
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
                size: 'small',
              }}
              tooltip={formatMessage({
                id: 'copy',
                defaultMessage: 'Copy',
                description: 'Copy text',
              })}
              activeTooltip={formatMessage({
                id: 'copied',
                defaultMessage: 'Copied!',
                description: 'Copied text',
              })}
            >
              <FileCopy />
            </CopyIconButton>
          </Stack>
          <Box>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={8}>
                <OrderDetailsCard order={order} />
                <Box>
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
                              id="quantity"
                              defaultMessage="Quantity"
                            />
                          </TableCell>
                          <TableCell>
                            <FormattedMessage
                              id="total"
                              defaultMessage="Total"
                            />
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {items?.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Stack
                                direction="row"
                                spacing={2}
                                sx={{ height: '100%' }}
                              >
                                <Avatar
                                  variant="rounded"
                                  sx={{ height: '5rem', width: '5rem' }}
                                  src={item.product.imageUrl ?? ''}
                                >
                                  <Inventory />
                                </Avatar>
                                <Stack
                                  sx={{ height: '100%' }}
                                  justifyContent="space-between"
                                >
                                  <Typography gutterBottom variant="body1">
                                    {item.title}
                                  </Typography>
                                  {item.product.digital && (
                                    <Button
                                      variant="text"
                                      size="small"
                                      startIcon={<LockOpenIcon />}
                                      onClick={handleOpen(
                                        order.id,
                                        item.productId,
                                      )}
                                    >
                                      <FormattedMessage
                                        id="view.protected.content"
                                        defaultMessage="View protected content"
                                      />
                                    </Button>
                                  )}
                                </Stack>
                              </Stack>
                            </TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>
                              {new Decimal(item.quantity)
                                .mul(item.price)
                                .toNumber()}{' '}
                              {tokenData?.symbol.toUpperCase()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        <TableCell></TableCell>
                        <TableCell>
                          <Typography variant="body1" color="text.primary">
                            <FormattedMessage
                              id="total"
                              defaultMessage="Total"
                            />
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="h5" color="text.primary">
                            {order.amount} {tokenData?.symbol.toUpperCase()}
                          </Typography>
                        </TableCell>
                      </TableFooter>
                    </Table>
                  </TableContainer>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </Container>
    </>
  );
}

export default function OrderPage() {
  const router = useRouter();

  const { id } = router.query;

  const { data } = useUserOrder({ id: id as string });

  return data && <OrderComponent order={data} />;
}

OrderPage.getLayout = (page: any) => {
  return (
    <DexkitApiProvider.Provider value={{ instance: myAppsApi }}>
      <MainLayout>{page}</MainLayout>
    </DexkitApiProvider.Provider>
  );
};
