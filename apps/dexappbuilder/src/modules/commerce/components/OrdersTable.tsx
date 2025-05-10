import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import React, { useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Order } from '../types';

import { getBlockExplorerUrl, truncateAddress } from '@dexkit/core/utils';
import { Box, Stack, Typography } from '@mui/material';
import Link from '@mui/material/Link';
import moment from 'moment';
import NextLink from 'next/link';
import useOrderList from '../hooks/orders/useOrdersList';
import { LoadingOverlay } from './LoadingOverlay';
import { noRowsOverlay } from './NoRowsOverlay';

const Component = () => {
  return (
    <Box>
      <Stack py={2} alignItems="center" justifyItems="center" spacing={1}>
        <Box>
          <Typography align="center" variant="h5">
            Hello
          </Typography>
          <Typography align="center" variant="body1" color="text.secondary">
            Hello
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export interface OrdersTableProps {
  query: string;
  status: string;
}

export default function OrdersTable({ query, status }: OrdersTableProps) {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });

  const { data } = useOrderList({
    limit: paginationModel.pageSize,
    page: paginationModel.page,
    status,
    q: query,
  });

  const { formatMessage } = useIntl();

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

  const columns = useMemo(() => {
    return [
      {
        flex: 1,
        field: 'order',
        headerName: formatMessage({
          id: 'order.id',
          defaultMessage: 'Order ID',
        }),
        renderCell: ({ row }) => (
          <Link
            component={NextLink}
            href={`/u/account/commerce/orders/${row.id}`}
          >
            {row.id.substring(10)}
          </Link>
        ),
      },
      {
        flex: 1,
        field: 'senderAddress',
        headerName: formatMessage({ id: 'creator', defaultMessage: 'Creator' }),
        renderCell: ({ row }) => (
          <Link component={NextLink} href={`/`}>
            {truncateAddress(row.senderAddress)}
          </Link>
        ),
      },
      {
        flex: 1,
        field: 'hash',
        headerName: formatMessage({
          id: 'transaction',
          defaultMessage: 'Transaction',
        }),
        renderCell: ({ row }) => {
          return (
            <Link
              target="_blank"
              href={`${getBlockExplorerUrl(row.chainId)}/tx/${row.hash}`}
            >
              <FormattedMessage id="transaction" defaultMessage="Transaction" />
            </Link>
          );
        },
      },
      {
        flex: 1,
        field: 'status',
        headerName: formatMessage({
          id: 'status',
          defaultMessage: 'Status',
        }),
        renderCell: ({ row }) => {
          return renderStatusText(row.status);
        },
      },
      {
        flex: 1,
        field: 'createdAt',
        headerName: formatMessage({
          id: 'created.at',
          defaultMessage: 'Created at',
        }),
        renderCell: ({ row }) => {
          return moment(row.createdAt).format('L LTS');
        },
      },
    ] as GridColDef<Order>[];
  }, []);

  return (
    <Box>
      <DataGrid
        columns={columns}
        rows={data?.items ?? []}
        rowCount={data?.totalItems}
        pageSizeOptions={[5, 10, 25, 50, 100]}
        paginationMode="server"
        getRowId={(row) => String(row.id)}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        sx={{ height: 300 }}
        slots={{
          noRowsOverlay: noRowsOverlay(
            <FormattedMessage id="no.orders" defaultMessage="No Orders" />,
            <FormattedMessage
              id="create.orders.to.see.it.here"
              defaultMessage="Create orders to see it here"
            />,
          ),
          loadingOverlay: LoadingOverlay,
          noResultsOverlay: noRowsOverlay(
            <FormattedMessage id="no.orders" defaultMessage="No Orders" />,
            <FormattedMessage
              id="create.orders.to.see.it.here"
              defaultMessage="Create orders to see it here"
            />,
          ),
        }}
      />
    </Box>
  );
}
