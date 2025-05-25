import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRowSelectionModel,
  GridSortModel,
} from "@mui/x-data-grid";
import { MouseEvent, useCallback, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { CategoryType } from "../types";

import useDeleteCategory from "@dexkit/ui/modules/commerce/hooks/useDeleteCategory";
import Delete from "@mui/icons-material/DeleteOutline";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import dynamic from "next/dynamic";
import { useSnackbar } from "notistack";
import { noRowsOverlay } from "./NoRowsOverlay";

import { useDebounce } from "@dexkit/core";
import EditCategoryFormDialog from "@dexkit/ui/modules/commerce/components/dialogs/EditCategoryFormDialog";
import AppsIcon from "@mui/icons-material/Apps";
import CustomToolbar from "./CustomToolbar";
import { LoadingOverlay } from "./LoadingOverlay";
const AppConfirmDialog = dynamic(
  () => import("@dexkit/ui/components/AppConfirmDialog")
);

import useDeleteManyCategories from "@dexkit/ui/modules/commerce/hooks/useDeleteManyCategories";
import useCategoryList from "../hooks/useCategoryList";
import useParams from "./containers/hooks/useParams";

export interface CategoriesTableProps {}

export default function CategoriesTable({}: CategoriesTableProps) {
  const [query, setQuery] = useState("");

  const [categoryName, setCategoryName] = useState<string>();

  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );

  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "name", sort: "asc" },
  ]);

  const lazyQuery = useDebounce<string>(query, 500);

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const { data, isLoading, refetch } = useCategoryList({
    limit: paginationModel.pageSize,
    page: paginationModel.page,
    q: lazyQuery,
    sortModel,
  });

  const { formatMessage } = useIntl();

  const { enqueueSnackbar } = useSnackbar();

  const { mutateAsync: deleteCategory, isLoading: isLoadingDelete } =
    useDeleteCategory();

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<string>();

  const [showDeleteMany, setShowDeleteMany] = useState(false);

  const handleDelete = useCallback((id: string, name: string) => {
    return (e: MouseEvent) => {
      e.stopPropagation();
      setSelectedId(id);
      setShowConfirm(true);
      setCategoryName(name);
    };
  }, []);

  const handleClose = () => {
    setShowConfirm(false);
    setSelectedId(undefined);
    setCategoryName(undefined);
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

  const [showEdit, setShowEdit] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>();

  const columns = useMemo(() => {
    return [
      {
        sortable: true,
        disableColumnMenu: true,

        flex: 1,
        field: "name",
        headerName: formatMessage({ id: "name", defaultMessage: "Name" }),
        renderCell: ({ row }) => <Typography>{row.name}</Typography>,
      },

      {
        sortable: false,
        disableColumnMenu: true,
        flex: 1,
        field: "itemCount",
        headerName: formatMessage({ id: "items", defaultMessage: "Items" }),
        renderCell: ({ row }) => <Typography>{row.countItems}</Typography>,
      },
      {
        field: "actions",
        sortable: false,
        disableColumnMenu: true,
        flex: 1,
        headerName: formatMessage({ id: "actions", defaultMessage: "Actions" }),
        renderCell: ({ row }) => (
          <Stack direction="row">
            <IconButton onClick={handleDelete(row.id ?? "", row.name)}>
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

  const handleCloseDeleteMany = () => {
    setShowDeleteMany(false);
  };

  const { mutateAsync: deleteMany, isLoading: isDeletingMany } =
    useDeleteManyCategories();

  const handleConfirmDeleteMany = async () => {
    try {
      await deleteMany({ ids: selectionModel as string[] });

      enqueueSnackbar(
        <FormattedMessage
          id="categories.deleted"
          defaultMessage="Categories deleted"
        />,
        { variant: "success" }
      );
      await refetch();
    } catch (err) {
      enqueueSnackbar(String(err), { variant: "error" });
    }

    handleCloseDeleteMany();
  };

  const { setContainer } = useParams();

  return (
    <>
      {showDeleteMany && (
        <AppConfirmDialog
          DialogProps={{ open: showDeleteMany, onClose: handleCloseDeleteMany }}
          onConfirm={handleConfirmDeleteMany}
          isConfirming={isDeletingMany}
          title={
            <FormattedMessage
              id="delete.categories.alt"
              defaultMessage="Delete Categories"
            />
          }
          actionCaption={
            <FormattedMessage id="delete" defaultMessage="Delete" />
          }
        >
          <FormattedMessage
            id="are.you.sure.you.want.to.delete.amount.categories?"
            defaultMessage="Are you sure you want to delete {amount} categories?"
            values={{ amount: selectionModel.length }}
          />
        </AppConfirmDialog>
      )}
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
            <strong>
              <FormattedMessage
                id="delete.category.name"
                defaultMessage="Delete Category: {category}"
                values={{
                  category: (
                    <Typography
                      variant="inherit"
                      fontWeight="400"
                      component="span"
                    >
                      {categoryName}
                    </Typography>
                  ),
                }}
              />
            </strong>
          }
          actionCaption={
            <FormattedMessage id="delete" defaultMessage="Delete" />
          }
        >
          <FormattedMessage
            id="Are.you.sure.you.want.to.delete.this.category"
            defaultMessage="Are you sure you want to delete this category?"
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
          pageSizeOptions={[5, 10, 25]}
          onRowClick={({ row }, e) => {
            e.stopPropagation();
            setSelectedCategory(row);
            setShowEdit(true);
          }}
          disableRowSelectionOnClick
          onRowSelectionModelChange={setSelectionModel}
          rowSelectionModel={selectionModel}
          checkboxSelection
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          sortingMode="server"
          sortingOrder={["asc", "desc"]}
          slotProps={{
            toolbar: {
              onDelete: () => {
                setShowDeleteMany(true);
              },
              placeholder: formatMessage({
                id: "search.categories",
                defaultMessage: "Search categories",
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
              <Box sx={{ fontSize: "3rem" }}>
                <AppsIcon fontSize="inherit" />
              </Box>
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
              <Box sx={{ fontSize: "3rem" }}>
                <AppsIcon fontSize="inherit" />
              </Box>
            ),
          }}
        />
      </Box>
    </>
  );
}
