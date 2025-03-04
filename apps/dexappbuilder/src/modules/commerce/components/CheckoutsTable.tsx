import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridSortModel,
} from '@mui/x-data-grid';
import { useCallback, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import useCheckoutList from '../hooks/checkout/useCheckoutList';
import { CheckoutFormType } from '../types';

import { getWindowUrl } from '@dexkit/core/utils/browser';
import Share from '@mui/icons-material/Share';
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import { LoadingOverlay } from './LoadingOverlay';
import { noRowsOverlay } from './NoRowsOverlay';

import useDeleteCheckout from '@dexkit/ui/modules/commerce/hooks/useDeleteCheckout';
import Delete from '@mui/icons-material/DeleteOutline';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import CustomToolbar from './CustomToolbar';

import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

const AppConfirmDialog = dynamic(
  () => import('@dexkit/ui/components/AppConfirmDialog'),
);

export interface CheckoutsTableProps {
  onShare: (url: string) => void;
}

export default function CheckoutsTable({ onShare }: CheckoutsTableProps) {
  const [query, setQuery] = useState('');

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });

  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: 'title', sort: 'asc' },
  ]);

  const { data, isLoading, refetch } = useCheckoutList({
    limit: paginationModel.pageSize,
    page: paginationModel.page,
    q: query,
    sortModel,
  });

  const { formatMessage } = useIntl();

  const { enqueueSnackbar } = useSnackbar();

  const { mutateAsync: deleteCheckout, isLoading: isLoadingDelete } =
    useDeleteCheckout();

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<string>();

  const handleDelete = useCallback((id: string) => {
    return () => {
      setSelectedId(id);
      setShowConfirm(true);
    };
  }, []);

  const handleClose = () => {
    setShowConfirm(false);
    setSelectedId(undefined);
  };

  const handleConfirm = async () => {
    if (selectedId) {
      try {
        await deleteCheckout({ id: selectedId });

        enqueueSnackbar(
          <FormattedMessage
            id="checkout.deleted"
            defaultMessage="Checkout deleted"
          />,
          { variant: 'success' },
        );
        setShowConfirm(false);
        setSelectedId(undefined);
      } catch (err) {
        enqueueSnackbar(String(err), { variant: 'error' });
      }
    }

    await refetch();
  };

  const columns = useMemo(() => {
    return [
      {
        flex: 1,
        sortable: true,
        disableColumnMenu: true,
        field: 'title',
        headerName: formatMessage({ id: 'title', defaultMessage: 'Title' }),
        renderCell: ({ row }) => <Typography>{row.title}</Typography>,
      },
      {
        sortable: false,
        disableColumnMenu: true,
        flex: 1,
        field: 'description',
        headerName: formatMessage({
          id: 'description',
          defaultMessage: 'Description',
        }),
        renderCell: ({ row }) => <Typography>{row.description}</Typography>,
      },
      {
        field: 'actions',
        flex: 1,
        sortable: false,
        disableColumnMenu: true,
        headerName: formatMessage({ id: 'actions', defaultMessage: 'Actions' }),
        renderCell: ({ row }) => (
          <Stack direction="row">
            <IconButton
              onClick={() => onShare(`${getWindowUrl()}/c/${row.id}`)}
            >
              <Tooltip
                title={<FormattedMessage id="share" defaultMessage="Share" />}
              >
                <Share />
              </Tooltip>
            </IconButton>
            <IconButton onClick={handleDelete(row.id ?? '')}>
              <Delete color="error" />
            </IconButton>
          </Stack>
        ),
      },
    ] as GridColDef<CheckoutFormType>[];
  }, []);

  const router = useRouter();

  return (
    <>
      {showConfirm && (
        <AppConfirmDialog
          DialogProps={{ open: showConfirm, onClose: handleClose }}
          onConfirm={handleConfirm}
          isConfirming={isLoadingDelete}
          title={
            <FormattedMessage
              id="delete.checkout"
              defaultMessage="Delete checkout"
            />
          }
        >
          <FormattedMessage
            id="do.you.really.want.to.delete.this.checkout"
            defaultMessage="Do you really want to delete this checkout?"
          />
        </AppConfirmDialog>
      )}
      <Box>
        <DataGrid
          localeText={{
            toolbarQuickFilterPlaceholder: formatMessage({
              id: 'search.checkouts',
              defaultMessage: 'Search checkouts',
            }),
          }}
          columns={columns}
          rows={data?.items ?? []}
          rowCount={data?.totalItems}
          paginationMode="client"
          getRowId={(row) => String(row.id)}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          loading={isLoading}
          onRowClick={({ row }, e) => {
            router.push(`/u/account/commerce/checkouts/${row.id}`);
          }}
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
          sortingOrder={['asc', 'desc']}
          onSortModelChange={setSortModel}
          sortModel={sortModel}
          sortingMode="server"
          disableRowSelectionOnClick
          slotProps={{
            toolbar: {
              placeholder: formatMessage({
                id: 'search.products',
                defaultMessage: 'Search products',
              }),
              quickFilterProps: {
                value: query,
                onChange: (e) => {
                  setQuery(e.target.value);
                },
              },
            },
          }}
          slots={{
            toolbar: CustomToolbar,
            noRowsOverlay: noRowsOverlay(
              <FormattedMessage
                id="no.checkouts"
                defaultMessage="No Checkouts"
              />,
              <FormattedMessage
                id="create.checkouts.to.see.it.here"
                defaultMessage="Create checkouts to see it here"
              />,
              <Box sx={{ fontSize: '3rem' }}>
                <ShoppingCartCheckoutIcon fontSize="inherit" />
              </Box>,
            ),
            loadingOverlay: LoadingOverlay,
            noResultsOverlay: noRowsOverlay(
              <FormattedMessage
                id="no.checkouts"
                defaultMessage="No Checkouts"
              />,
              <FormattedMessage
                id="create.checkouts.to.see.it.here"
                defaultMessage="Create checkouts to see it here"
              />,
              <Box sx={{ fontSize: '3rem' }}>
                <ShoppingCartCheckoutIcon fontSize="inherit" />
              </Box>,
            ),
          }}
        />
      </Box>
    </>
  );
}
