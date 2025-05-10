import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRowSelectionModel,
  GridSortModel,
} from '@mui/x-data-grid';
import Decimal from 'decimal.js';
import { MouseEvent, useCallback, useMemo, useState } from 'react';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import useProductList from '../hooks/useProductList';
import { ProductFormType } from '../types';

import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';

import { LoadingOverlay } from './LoadingOverlay';
import { noRowsOverlay } from './NoRowsOverlay';

import ContentCopyIcon from '@mui/icons-material/ContentCopyOutlined';

import { useDebounce } from '@dexkit/core';
import Delete from '@mui/icons-material/DeleteOutline';
import InventoryIcon from '@mui/icons-material/Inventory';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import useDeleteProduct from '../hooks/useDeleteProduct';
import useDuplicateProduct from '../hooks/useDuplicateProduct';
import CustomToolbar from './CustomToolbar';

import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

import useDeleteManyProducts from '@dexkit/ui/modules/commerce/hooks/useDeleteManyProducts';

const AppConfirmDialog = dynamic(
  () => import('@dexkit/ui/components/AppConfirmDialog'),
);

const PreviewProductDialog = dynamic(
  () =>
    import(
      '@dexkit/ui/modules/commerce/components/dialogs/PreviewProductDialog'
    ),
);

export interface ProducstTableProps {}

export default function ProductsTable({}: ProducstTableProps) {
  const [query, setQuery] = useState('');

  const [productName, setProductName] = useState<string>();

  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: 'name', sort: 'asc' },
  ]);

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 5,
    pageSize: 10,
  });

  const lazyQuery = useDebounce<string>(query, 500);

  const { data, isFetched, refetch } = useProductList({
    limit: paginationModel.pageSize,
    page: paginationModel.page,
    q: lazyQuery,
    sortModel: sortModel,
  });

  const { formatMessage } = useIntl();

  const { enqueueSnackbar } = useSnackbar();

  const { mutateAsync: deleteProduct, isLoading } = useDeleteProduct();

  const [showConfirm, setShowConfirm] = useState(false);
  const [showConfirmDuplicate, setShowConfirmDuplicate] = useState(false);
  const [selectedId, setSelectedId] = useState<string>();

  const [showPreview, setShowPreview] = useState(false);

  const [showDeleteMany, setShowDeleteMany] = useState(false);

  const handleCloseDeleteMany = () => {
    setShowDeleteMany(false);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setSelectedId(undefined);
  };

  const handleShowPreview = useCallback((id: string) => {
    return (e: MouseEvent) => {
      e.stopPropagation();
      setSelectedId(id);
      setShowPreview(true);
    };
  }, []);

  const handleDuplicate = useCallback((id: string) => {
    return (e: MouseEvent) => {
      e.stopPropagation();
      setSelectedId(id);
      setShowConfirmDuplicate(true);
    };
  }, []);

  const handleDelete = useCallback((id: string, name: string) => {
    return (e: MouseEvent) => {
      e.stopPropagation();
      setSelectedId(id);
      setShowConfirm(true);
      setProductName(name);
    };
  }, []);

  const handleClose = () => {
    setShowConfirm(false);
    setSelectedId(undefined);
    setProductName(undefined);
  };

  const handleConfirm = async () => {
    if (selectedId) {
      try {
        await deleteProduct({ id: selectedId });

        enqueueSnackbar(
          <FormattedMessage
            id="product.deleted"
            defaultMessage="Product deleted"
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
        sortable: false,
        disableColumnMenu: true,
        field: 'image',
        headerName: formatMessage({
          id: 'image',
          defaultMessage: 'Image',
        }),
        renderCell: ({ row }) => (
          <Avatar variant="rounded" src={row.imageUrl ?? ''}>
            <InventoryIcon />
          </Avatar>
        ),
      },
      {
        field: 'name',
        flex: 1,
        headerName: formatMessage({ id: 'item', defaultMessage: 'Item' }),
        renderCell: ({ row }) => <Typography>{row.name}</Typography>,
      },
      {
        disableColumnMenu: true,
        sortable: false,
        field: 'status',
        flex: 1,
        headerName: formatMessage({
          id: 'visibility',
          defaultMessage: 'Visibility',
        }),
        renderCell: ({ row }) => {
          if (row.publishedAt) {
            return (
              <Chip
                color="success"
                label={<FormattedMessage id="active" defaultMessage="Active" />}
                sx={{ color: (theme) => theme.palette.common.white }}
              />
            );
          }

          return (
            <Chip
              color="error"
              label={
                <FormattedMessage id="inactive" defaultMessage="Inactive" />
              }
              sx={{ color: (theme) => theme.palette.common.white }}
            />
          );
        },
      },

      {
        disableColumnMenu: true,
        sortable: false,
        field: 'category',
        flex: 1,
        headerName: formatMessage({
          id: 'category',
          defaultMessage: 'Category',
        }),
        renderCell: ({ row }) => (
          <Typography variant="inherit">
            {row.category?.name ? (
              row.category?.name
            ) : (
              <FormattedMessage
                id="uncategorized"
                defaultMessage="Uncategorized"
              />
            )}
          </Typography>
        ),
      },
      {
        disableColumnMenu: true,
        sortable: false,
        field: 'price',
        flex: 1,
        headerName: formatMessage({ id: 'price', defaultMessage: 'Price' }),
        renderCell: ({ row }) => (
          <Typography variant="inherit">
            <FormattedNumber
              minimumFractionDigits={2}
              maximumFractionDigits={18}
              signDisplay="never"
              value={new Decimal(row.price).toNumber()}
            />{' '}
            USD
          </Typography>
        ),
      },

      {
        disableColumnMenu: true,
        field: 'actions',
        flex: 1,
        sortable: false,
        headerName: formatMessage({ id: 'actions', defaultMessage: 'Actions' }),
        renderCell: ({ row }) => (
          <Stack direction="row" spacing={1}>
            <IconButton size="small" onClick={handleShowPreview(row.id ?? '')}>
              <Tooltip
                title={
                  <FormattedMessage
                    id="preview.in.store"
                    defaultMessage="Preview in store"
                  />
                }
              >
                <VisibilityIcon fontSize="small" />
              </Tooltip>
            </IconButton>
            <IconButton size="small" onClick={handleDuplicate(row.id ?? '')}>
              <Tooltip
                title={
                  <FormattedMessage id="duplicate" defaultMessage="Duplicate" />
                }
              >
                <ContentCopyIcon fontSize="small" />
              </Tooltip>
            </IconButton>
            <IconButton
              size="small"
              onClick={handleDelete(row.id ?? '', row.name)}
            >
              <Tooltip
                title={<FormattedMessage id="delete" defaultMessage="Delete" />}
              >
                <Delete fontSize="small" color="error" />
              </Tooltip>
            </IconButton>
          </Stack>
        ),
      },
    ] as GridColDef<ProductFormType>[];
  }, []);

  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    [],
  );

  const handleCloseDuplicate = async () => {
    setShowConfirmDuplicate(false);
    setSelectedId(undefined);
  };

  const { mutateAsync: duplicate } = useDuplicateProduct();

  const handleConfirmDuplicate = async () => {
    if (selectedId) {
      try {
        await duplicate({ id: selectedId });

        enqueueSnackbar(
          <FormattedMessage
            id="product.duplicated"
            defaultMessage="Product duplicated"
          />,
          { variant: 'success' },
        );
        setShowConfirmDuplicate(false);
        setSelectedId(undefined);
        await refetch();
      } catch (err) {
        enqueueSnackbar(String(err), { variant: 'error' });
      }
    }
  };

  const { mutateAsync: deleteMany, isLoading: isDeletingMany } =
    useDeleteManyProducts();

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
      {showPreview && (
        <PreviewProductDialog
          DialogProps={{ open: showPreview, onClose: handleClosePreview }}
          id={selectedId}
        />
      )}
      {showConfirm && (
        <AppConfirmDialog
          DialogProps={{ open: showConfirm, onClose: handleClose }}
          onConfirm={handleConfirm}
          isConfirming={isLoading}
          title={
            <FormattedMessage
              id="delete.product"
              defaultMessage="Delete product {product}"
              values={{
                product: (
                  <Typography variant="inherit" fontWeight="400">
                    {productName}
                  </Typography>
                ),
              }}
            />
          }
        >
          <FormattedMessage
            id="are.you.sure.you.want.to.delete.this.product"
            defaultMessage="Are you sure you want to delete this product?"
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
              id="delete.products"
              defaultMessage="Delete products"
            />
          }
        >
          <FormattedMessage
            id="do.you.really.want.to.delete.amount.products"
            defaultMessage="Do you really want to delete {amount} products?"
            values={{ amount: selectionModel.length }}
          />
        </AppConfirmDialog>
      )}

      {showConfirmDuplicate && (
        <AppConfirmDialog
          DialogProps={{
            open: showConfirmDuplicate,
            onClose: handleCloseDuplicate,
          }}
          onConfirm={handleConfirmDuplicate}
          isConfirming={isLoading}
          title={
            <FormattedMessage
              id="duplicate.product"
              defaultMessage="Duplicate product"
            />
          }
        >
          <FormattedMessage
            id="do.you.really.want.to.duplicate.this.product"
            defaultMessage="Do you really want to duplicate this product?"
          />
        </AppConfirmDialog>
      )}
      <Box>
        {isFetched && (
          <DataGrid
            localeText={{
              toolbarQuickFilterPlaceholder: formatMessage({
                id: 'search.products',
                defaultMessage: 'Search products',
              }),
              footerTotalVisibleRows: (visibleCount, totalCount) => (
                <FormattedMessage
                  id="visiblecount.of.total.count.products"
                  defaultMessage="{visibleCount} of {totalCount} products"
                  values={{ visibleCount, totalCount }}
                />
              ),
            }}
            sortModel={sortModel}
            columns={columns}
            rowCount={data?.totalItems}
            rows={data?.items ?? []}
            paginationMode="server"
            checkboxSelection
            paginationModel={paginationModel}
            onRowSelectionModelChange={setSelectionModel}
            rowSelectionModel={selectionModel}
            onPaginationModelChange={setPaginationModel}
            disableRowSelectionOnClick
            onRowClick={({ row }, e) => {
              e.stopPropagation();

              router.push(`/u/account/commerce/products/${row.id}`);
            }}
            onSortModelChange={setSortModel}
            sortingOrder={['asc', 'desc']}
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
            slots={{
              toolbar: CustomToolbar,
              noRowsOverlay: noRowsOverlay(
                <FormattedMessage
                  id="no.products"
                  defaultMessage="No Products"
                />,
                <FormattedMessage
                  id="create.products.to.see.it.here"
                  defaultMessage="Create products to see it here"
                />,
                <Box sx={{ fontSize: '3rem' }}>
                  <ShoppingBagIcon fontSize="inherit" />
                </Box>,
              ),
              loadingOverlay: LoadingOverlay,
              noResultsOverlay: noRowsOverlay(
                <FormattedMessage
                  id="no.products"
                  defaultMessage="No Products"
                />,
                <FormattedMessage
                  id="create.products.to.see.it.here"
                  defaultMessage="Create products to see it here"
                />,
                <Box sx={{ fontSize: '3rem' }}>
                  <ShoppingBagIcon fontSize="inherit" />
                </Box>,
              ),
            }}
          />
        )}
      </Box>
    </>
  );
}
