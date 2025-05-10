import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRowSelectionModel,
  GridSortModel,
} from '@mui/x-data-grid';
import { useCallback, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { CategoryType } from '../types';

import { Box, IconButton, Stack } from '@mui/material';
import { LoadingOverlay } from './LoadingOverlay';
import { noRowsOverlay } from './NoRowsOverlay';

import useDeleteProductCollection from '@dexkit/ui/modules/commerce/hooks/useDeleteProductCollection';
import useProductCollectionList from '@dexkit/ui/modules/commerce/hooks/useProductCollectionList';
import Delete from '@mui/icons-material/DeleteOutline';
import dynamic from 'next/dynamic';
import { useSnackbar } from 'notistack';

import useDeleteManyCollections from '@dexkit/ui/modules/commerce/hooks/useDeleteManyCollections';

import LabelIcon from '@mui/icons-material/Label';
import { useRouter } from 'next/router';
import CustomToolbar from './CustomToolbar';

const AppConfirmDialog = dynamic(
  () => import('@dexkit/ui/components/AppConfirmDialog'),
);

export interface CollectionsTableProps {}

export default function CollectionsTable({}: CollectionsTableProps) {
  const [query, setQuery] = useState('');

  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: 'name', sort: 'asc' },
  ]);

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });

  const { data, isLoading, refetch } = useProductCollectionList({
    limit: paginationModel.pageSize,
    page: paginationModel.page,
    q: query,
    sortModel,
  });

  const { formatMessage } = useIntl();

  const { enqueueSnackbar } = useSnackbar();

  const { mutateAsync: deleteProductCollection, isLoading: isLoadingDelete } =
    useDeleteProductCollection();

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<string>();

  const [showDeleteMany, setShowDeleteMany] = useState(false);

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
        await deleteProductCollection({ id: selectedId });

        enqueueSnackbar(
          <FormattedMessage
            id="collection.deleted"
            defaultMessage="Collection deleted"
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
        field: 'name',
        headerName: formatMessage({ id: 'name', defaultMessage: 'Name' }),
        renderCell: ({ row }) => row.name,
      },
      {
        field: 'actions',
        flex: 1,
        headerName: formatMessage({ id: 'actions', defaultMessage: 'Actions' }),
        renderCell: ({ row }) => (
          <Stack direction="row">
            <IconButton onClick={handleDelete(row.id ?? '')}>
              <Delete color="error" />
            </IconButton>
          </Stack>
        ),
      },
    ] as GridColDef<CategoryType>[];
  }, []);

  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    [],
  );

  const handleCloseDeleteMany = () => {
    setShowDeleteMany(false);
  };

  const { mutateAsync: deleteMany, isLoading: isDeletingMany } =
    useDeleteManyCollections();

  const handleConfirmDeleteMany = async () => {
    try {
      await deleteMany({ ids: selectionModel as string[] });

      enqueueSnackbar(
        <FormattedMessage
          id="products.are.deleted"
          defaultMessage="Products are deleted"
        />,
        { variant: 'success' },
      );
      await refetch();
    } catch (err) {
      enqueueSnackbar(String(err), { variant: 'error' });
    }

    handleCloseDeleteMany();
  };

  const router = useRouter();

  return (
    <>
      {showConfirm && (
        <AppConfirmDialog
          DialogProps={{ open: showConfirm, onClose: handleClose }}
          onConfirm={handleConfirm}
          isConfirming={isLoading}
          title={
            <FormattedMessage
              id="delete.collection"
              defaultMessage="Delete Collection "
            />
          }
        >
          <FormattedMessage
            id="do.you.really.want.to.delete.this.collection"
            defaultMessage="Do you really want to delete this collection?"
          />
        </AppConfirmDialog>
      )}

      {showDeleteMany && (
        <AppConfirmDialog
          DialogProps={{ open: showDeleteMany, onClose: handleCloseDeleteMany }}
          onConfirm={handleConfirmDeleteMany}
          isConfirming={isDeletingMany}
          title={
            <FormattedMessage
              id="delete.collections.s"
              defaultMessage="Delete collection(s)"
            />
          }
        >
          <FormattedMessage
            id="do.you.really.want.to.delete.amount.collections"
            defaultMessage="Do you really want to delete {amount} collection(s)?"
            values={{ amount: selectionModel.length }}
          />
        </AppConfirmDialog>
      )}

      <Box>
        <DataGrid
          columns={columns}
          rows={data?.items ?? []}
          rowCount={data?.totalItems}
          paginationMode="client"
          getRowId={(row) => String(row.id)}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          loading={isLoading}
          checkboxSelection
          disableRowSelectionOnClick
          onRowClick={({ row }) => {
            router.push(`/u/account/commerce/collections/${row.id}`);
          }}
          slotProps={{
            toolbar: {
              placeholder: formatMessage({
                id: 'search.products',
                defaultMessage: 'Search products',
              }),
              onDelete: () => {
                setShowDeleteMany(true);
              },
              showDelete: selectionModel.length > 0,
              printOptions: { disableToolbarButton: true },
              csvOptions: { disableToolbarButton: true },
              showQuickFilter: true,
              quickFilterProps: {
                value: query,
                onChange: (e) => {
                  setQuery(e.target.value);
                },
              },
            },
          }}
          onRowSelectionModelChange={setSelectionModel}
          slots={{
            toolbar: CustomToolbar,
            noRowsOverlay: noRowsOverlay(
              <FormattedMessage
                id="no.collections"
                defaultMessage="No Collections"
              />,
              <FormattedMessage
                id="create.a.collection.to.see.it.here"
                defaultMessage="Create a collection to see it here"
              />,
              <Box sx={{ fontSize: '3rem' }}>
                <LabelIcon fontSize="inherit" />
              </Box>,
            ),
            loadingOverlay: LoadingOverlay,
            noResultsOverlay: noRowsOverlay(
              <FormattedMessage
                id="no.collections"
                defaultMessage="No collections"
              />,
              <FormattedMessage
                id="add.collections.to.your.store"
                defaultMessage="Add collections to your store"
              />,
              <Box sx={{ fontSize: '3rem' }}>
                <LabelIcon fontSize="inherit" />
              </Box>,
            ),
          }}
          sortingOrder={['asc', 'desc']}
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          sortingMode="server"
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
          pageSizeOptions={[5, 10, 25]}
        />
      </Box>
    </>
  );
}
