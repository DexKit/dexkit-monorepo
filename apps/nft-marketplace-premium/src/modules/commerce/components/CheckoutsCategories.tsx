import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRowSelectionModel,
} from '@mui/x-data-grid';
import { MouseEvent, useCallback, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { CategoryType } from '../types';

import useDeleteCategory from '@dexkit/ui/modules/commerce/hooks/useDeleteCategory';
import Delete from '@mui/icons-material/DeleteOutline';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import { useSnackbar } from 'notistack';
import useCategoryList from '../hooks/useCategoryList';
import { noRowsOverlay } from './NoRowsOverlay';

import { useDebounce } from '@dexkit/core';
import EditCategoryFormDialog from '@dexkit/ui/modules/commerce/components/dialogs/EditCategoryFormDialog';
import AppsIcon from '@mui/icons-material/Apps';
import CustomToolbar from './CustomToolbar';
import { LoadingOverlay } from './LoadingOverlay';
const AppConfirmDialog = dynamic(
  () => import('@dexkit/ui/components/AppConfirmDialog'),
);

export interface CategoriesTableProps {}

export default function CategoriesTable({}: CategoriesTableProps) {
  const [query, setQuery] = useState('');

  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    [],
  );

  const lazyQuery = useDebounce<string>(query, 500);

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });

  const { data, isLoading, refetch } = useCategoryList({
    limit: paginationModel.pageSize,
    page: paginationModel.page,
    q: lazyQuery,
  });

  const { formatMessage } = useIntl();

  const { enqueueSnackbar } = useSnackbar();

  const { mutateAsync: deleteCategory, isLoading: isLoadingDelete } =
    useDeleteCategory();

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<string>();

  const handleDelete = useCallback((id: string) => {
    return (e: MouseEvent) => {
      e.stopPropagation();
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
        await deleteCategory({ id: selectedId });

        enqueueSnackbar(
          <FormattedMessage
            id="category.deleted"
            defaultMessage="Category deleted"
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

  const [showEdit, setShowEdit] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>();

  const columns = useMemo(() => {
    return [
      {
        flex: 1,
        field: 'name',
        headerName: formatMessage({ id: 'name', defaultMessage: 'Name' }),
        renderCell: ({ row }) => <Typography>{row.name}</Typography>,
      },

      {
        flex: 1,
        field: 'itemCount',
        headerName: formatMessage({ id: 'items', defaultMessage: 'Items' }),
        renderCell: ({ row }) => <Typography>{row.countItems}</Typography>,
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
    ] as GridColDef<{ id: string; name: string; countItems: number }>[];
  }, []);

  const handleRefetch = async () => {
    await refetch();
  };

  const handleCloseEdit = () => {
    setSelectedCategory(undefined);
    setShowEdit(false);
  };

  return (
    <>
      {showEdit && (
        <EditCategoryFormDialog
          DialogProps={{
            open: showEdit,
            onClose: handleCloseEdit,
          }}
          onRefetch={handleRefetch}
          category={selectedCategory}
        />
      )}
      {showConfirm && (
        <AppConfirmDialog
          DialogProps={{ open: showConfirm, onClose: handleClose }}
          onConfirm={handleConfirm}
          isConfirming={isLoading}
          title={
            <FormattedMessage
              id="delete.category"
              defaultMessage="Delete category"
            />
          }
        >
          <FormattedMessage
            id="do.you.really.want.to.delete.this.category"
            defaultMessage="Do you really want to delete this categogry?"
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
          sx={{ height: 300 }}
          onRowClick={({ row }, e) => {
            e.stopPropagation();
            setSelectedCategory(row);
            setShowEdit(true);
          }}
          onRowSelectionModelChange={setSelectionModel}
          rowSelectionModel={selectionModel}
          checkboxSelection
          slotProps={{
            toolbar: {
              onDelete: () => {},
              placeholder: formatMessage({
                id: 'search.categories',
                defaultMessage: 'Search categories',
              }),
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
          slots={{
            toolbar: CustomToolbar,
            noRowsOverlay: noRowsOverlay(
              <FormattedMessage
                id="no.categories"
                defaultMessage="No Categories"
              />,
              <FormattedMessage
                id="create.a.category.to.see.it.here"
                defaultMessage="Create a category to see it here"
              />,
              <Box sx={{ fontSize: '3rem' }}>
                <AppsIcon fontSize="inherit" />
              </Box>,
            ),
            loadingOverlay: LoadingOverlay,
            noResultsOverlay: noRowsOverlay(
              <FormattedMessage
                id="no.categories"
                defaultMessage="No Categories"
              />,
              <FormattedMessage
                id="create.a.category.to.see.it.here"
                defaultMessage="Create a category to see it here"
              />,
              <Box sx={{ fontSize: '3rem' }}>
                <AppsIcon fontSize="inherit" />
              </Box>,
            ),
          }}
        />
      </Box>
    </>
  );
}
