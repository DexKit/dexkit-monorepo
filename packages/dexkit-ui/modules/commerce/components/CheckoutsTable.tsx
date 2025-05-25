import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridPaginationModel,
  GridSortModel,
} from "@mui/x-data-grid";
import { MouseEvent, useCallback, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import useCheckoutList from "../hooks/useCheckoutList";
import { CheckoutFormType } from "../types";

import { getWindowUrl } from "@dexkit/core/utils/browser";
import Share from "@mui/icons-material/Share";
import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import dynamic from "next/dynamic";
import { LoadingOverlay } from "./LoadingOverlay";
import { noRowsOverlay } from "./NoRowsOverlay";

import useDeleteCheckout from "@dexkit/ui/modules/commerce/hooks/useDeleteCheckout";
import Delete from "@mui/icons-material/DeleteOutline";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import CustomToolbar from "./CustomToolbar";

import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import useParams from "./containers/hooks/useParams";

const AppConfirmDialog = dynamic(
  () => import("@dexkit/ui/components/AppConfirmDialog")
);

export interface CheckoutsTableProps {
  onShare: (url: string) => void;
}

export default function CheckoutsTable({ onShare }: CheckoutsTableProps) {

  const [filterModel, setFilterModel] = useState<GridFilterModel>();

  const { setContainer } = useParams();

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });

  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "title", sort: "asc" },
  ]);

  const { data, isLoading, refetch } = useCheckoutList({
    limit: paginationModel.pageSize,
    page: paginationModel.page,
    q: filterModel?.quickFilterValues?.[0] as string,
    sortModel,
  });

  const { formatMessage } = useIntl();

  const { enqueueSnackbar } = useSnackbar();

  const { mutateAsync: deleteCheckout, isLoading: isLoadingDelete } =
    useDeleteCheckout();

  const [checkoutName, setCheckoutName] = useState<string>();

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<string>();

  const handleDelete = useCallback((id: string, name: string) => {
    return (e: MouseEvent) => {
      e.stopPropagation();
      setSelectedId(id);
      setShowConfirm(true);
      setCheckoutName(name);
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
          { variant: "success" }
        );
        setShowConfirm(false);
        setSelectedId(undefined);
      } catch (err) {
        enqueueSnackbar(String(err), { variant: "error" });
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
        field: "title",
        headerName: formatMessage({ id: "title", defaultMessage: "Title" }),
        renderCell: ({ row }) => <Typography>{row.title}</Typography>,
      },
      {
        sortable: false,
        disableColumnMenu: true,
        flex: 1,
        field: "description",
        headerName: formatMessage({
          id: "description",
          defaultMessage: "Description",
        }),
        renderCell: ({ row }) => <Typography>{row.description}</Typography>,
      },
      {
        field: "actions",
        flex: 1,
        sortable: false,
        disableColumnMenu: true,
        headerName: formatMessage({ id: "actions", defaultMessage: "Actions" }),
        renderCell: ({ row }) => (
          <Stack direction="row">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();

                onShare(`${getWindowUrl()}/c/${row.id}`);
              }}
            >
              <Tooltip
                title={<FormattedMessage id="share" defaultMessage="Share" />}
              >
                <Share />
              </Tooltip>
            </IconButton>
            <IconButton onClick={handleDelete(row.id ?? "", row?.title ?? "")}>
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
              id="delete.checkout.name"
              defaultMessage="Delete Checkout: {checkout}"
              values={{
                checkout: (
                  <Typography
                    variant="inherit"
                    fontWeight="400"
                    component="span"
                  >
                    {checkoutName}
                  </Typography>
                ),
              }}
            />
          }
          actionCaption={
            <FormattedMessage id="delete" defaultMessage="Delete" />
          }
        >
          <FormattedMessage
            id="are.you.sure.you.want.to.delete.this.checkout"
            defaultMessage="Are you sure you want to delete this checkout?"
          />
        </AppConfirmDialog>
      )}
      <Box sx={{ display: "flex" }}>
        <DataGrid
          localeText={{
            toolbarQuickFilterPlaceholder: formatMessage({
              id: "search.checkouts",
              defaultMessage: "Search checkouts",
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
            setContainer("commerce.checkouts.edit", { id: row.id });
          }}
          sx={{
            height: data?.items.length === 0 ? 300 : undefined,
            "& .MuiDataGrid-cell:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-cell:focus-within": {
              outline: "none !important",
            },
            "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
              outline: "none !important",
            },
            "& .MuiDataGrid-columnHeader:focus": {
              outline: "none !important",
            },
            "& .MuiDataGrid-columnHeader:focus-within": {
              outline: "none !important",
            },
            border: "none",
            "--DataGrid-overlayHeight": "150px", // disable cell selection style
            ".MuiDataGrid-cell:focus": {
              outline: "none",
            },
            // pointer cursor on ALL rows
            "& .MuiDataGrid-row:hover": {
              cursor: "pointer",
            },
          }}
          sortingOrder={["asc", "desc"]}
          onSortModelChange={setSortModel}
          sortModel={sortModel}
          sortingMode="server"
          disableRowSelectionOnClick
          onFilterModelChange={setFilterModel}
          filterModel={filterModel}
          slotProps={{
            toolbar: {
              placeholder: formatMessage({
                id: "search.products",
                defaultMessage: "Search products",
              }),
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
              <Box sx={{ fontSize: "3rem" }}>
                <ShoppingCartCheckoutIcon fontSize="inherit" />
              </Box>
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
              <Box sx={{ fontSize: "3rem" }}>
                <ShoppingCartCheckoutIcon fontSize="inherit" />
              </Box>
            ),
          }}
        />
      </Box>
    </>
  );
}
