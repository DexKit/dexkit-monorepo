import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Order } from '../types';

import { getBlockExplorerUrl } from '@dexkit/core/utils';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { Box, IconButton, Stack, Tooltip, useTheme } from '@mui/material';
import useUserOrderList from '../hooks/orders/useUserOrdersList';
import { LoadingOverlay } from './LoadingOverlay';
import { noRowsOverlay } from './NoRowsOverlay';
import TokenDataContainer from './TokenDataContainer';

import OrderStatusBadge from '@dexkit/ui/modules/commerce/components/OrderStatusBadge';
import AssignmentIcon from '@mui/icons-material/Assignment';
import OpenInNew from '@mui/icons-material/OpenInNew';
import moment from 'moment';
import { useRouter } from 'next/router';

export interface OrdersTableProps {
  query: string;
  status: string;
}

export default function UserOrdersTable({ query, status }: OrdersTableProps) {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });

  const { account } = useWeb3React();

  const { data } = useUserOrderList({
    limit: paginationModel.pageSize,
    page: paginationModel.page,
    q: query,
    address: account ?? '',
    status,
  });

  const { formatMessage } = useIntl();

  const router = useRouter();

  const theme = useTheme();

  const columns = useMemo(() => {
    return [
      {
        flex: 1,
        field: 'order',
        disableColumnMenu: true,
        sortable: false,
        headerName: formatMessage({
          id: 'order.id',
          defaultMessage: 'Order ID',
        }),
        renderCell: ({ row }) => row.id.substring(10),
      },
      {
        flex: 1,
        disableColumnMenu: true,
        sortable: false,
        field: 'createdAt',
        headerName: formatMessage({
          id: 'created.on',
          defaultMessage: 'Created On',
        }),
        renderCell: ({ row }) => {
          return moment(row.createdAt).format('L LTS');
        },
      },
      {
        flex: 1,
        disableColumnMenu: true,
        sortable: false,
        field: 'total',
        headerName: formatMessage({
          id: 'total',
          defaultMessage: 'Total',
        }),
        renderCell: ({ row }) => {
          return (
            <TokenDataContainer
              contractAddress={row.contractAddress}
              chainId={row.chainId}
            >
              {({ symbol }) => `${row.amount} ${symbol}`}
            </TokenDataContainer>
          );
        },
      },
      {
        flex: 1,
        disableColumnMenu: true,
        sortable: false,
        field: 'status',
        headerName: formatMessage({
          id: 'status',
          defaultMessage: 'Status',
        }),
        renderCell: ({ row }) => {
          return (
            <OrderStatusBadge status={row.status} palette={theme.palette} />
          );
        },
      },

      {
        flex: 1,
        field: 'actions',
        disableColumnMenu: true,
        sortable: false,
        headerName: formatMessage({
          id: 'actions',
          defaultMessage: 'Actions',
        }),
        renderCell: ({ row }) => {
          return (
            <Box>
              <Stack direction="row" alignItems="center" spacing={2}>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  target="_blank"
                  href={`${getBlockExplorerUrl(row.chainId)}/tx/${row.hash}`}
                >
                  <Tooltip
                    title={
                      <FormattedMessage
                        id="view.transaction.on.blockchain"
                        defaultMessage="View transaction on blockchain"
                      />
                    }
                  >
                    <OpenInNew />
                  </Tooltip>
                </IconButton>
              </Stack>
            </Box>
          );
        },
      },
    ] as GridColDef<Order>[];
  }, []);

  return (
    <Box>
      <DataGrid
        columns={columns}
        rows={data?.items ?? []}
        rowCount={0}
        paginationMode="server"
        getRowId={(row) => String(row.id)}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        onRowClick={({ row }) => {
          router.push(`/c/orders/${row.id}`);
        }}
        disableRowSelectionOnClick
        sx={{
          height: 300,
          '& .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
          '& .MuiDataGrid-cell:focus-within': {
            outline: 'none !important',
          },
          '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
            outline: 'none !important',
          },
          '& .MuiDataGrid-columnHeader:focus': {
            outline: 'none !important',
          },
          '& .MuiDataGrid-columnHeader:focus-within': {
            outline: 'none !important',
          },
          border: 'none',
          '--DataGrid-overlayHeight': '150px', // disable cell selection style
          '.MuiDataGrid-cell:focus': {
            outline: 'none',
          },
          // pointer cursor on ALL rows
          '& .MuiDataGrid-row:hover': {
            cursor: 'pointer',
          },
        }}
        slots={{
          noRowsOverlay: noRowsOverlay(
            <FormattedMessage id="no.orders" defaultMessage="No Orders" />,
            <FormattedMessage
              id="create.orders.to.see.it.here"
              defaultMessage="Create orders to see it here"
            />,
            <Box sx={{ fontSize: '3rem' }}>
              <AssignmentIcon fontSize="inherit" />
            </Box>,
          ),
          loadingOverlay: LoadingOverlay,
          noResultsOverlay: noRowsOverlay(
            <FormattedMessage id="no.orders" defaultMessage="No Orders" />,
            <FormattedMessage
              id="create.orders.to.see.it.here"
              defaultMessage="Create orders to see it here"
            />,
            <Box sx={{ fontSize: '3rem' }}>
              <AssignmentIcon fontSize="inherit" />
            </Box>,
          ),
        }}
      />
    </Box>
  );
}
