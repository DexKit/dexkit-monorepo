import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Order } from "../types";

import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import moment from "moment";
import useOrdersList from "../hooks/useOrdersList";
import { LoadingOverlay } from "./LoadingOverlay";
import { noRowsOverlay } from "./NoRowsOverlay";

import AssignmentIcon from "@mui/icons-material/Assignment";

import OpenInNew from "@mui/icons-material/OpenInNew";
import { useTheme } from "@mui/material/styles";
import useParams from "./containers/hooks/useParams";
import OrderStatusBadge from "./OrderStatusBadge";

export interface OrdersTableProps {
  query: string;
  status: string;
}

export default function OrdersTable({ query, status }: OrdersTableProps) {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });

  const { data } = useOrdersList({
    limit: paginationModel.pageSize,
    page: paginationModel.page,
    status,
    q: query,
  });

  const { formatMessage } = useIntl();

  const theme = useTheme();

  const columns = useMemo(() => {
    return [
      {
        flex: 1,
        field: "order",
        headerName: formatMessage({
          id: "order.id",
          defaultMessage: "Order ID",
        }),
        renderCell: ({ row }) => (
          <Typography>{row.id.substring(10)}</Typography>
        ),
      },
      {
        flex: 1,
        field: "createdAt",
        headerName: formatMessage({
          id: "created.On",
          defaultMessage: "Created On",
        }),
        renderCell: ({ row }) => {
          return moment(row.createdAt).format("L LTS");
        },
      },
      {
        flex: 1,
        field: "status",
        headerName: formatMessage({
          id: "status",
          defaultMessage: "Status",
        }),
        renderCell: ({ row }) => {
          return (
            <OrderStatusBadge status={row.status} palette={theme.palette} />
          );
        },
      },
      {
        flex: 1,
        field: "actions",
        headerName: formatMessage({
          id: "actions",
          defaultMessage: "Actions",
        }),
        renderCell: ({ row }) => {
          return (
            <Box>
              <Stack direction="row" alignItems="center" spacing={2}>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
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

  const { setContainer } = useParams();

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
        disableRowSelectionOnClick
        onRowClick={({ row }) => {
          setContainer("commerce.order.edit", { id: row.id });
        }}
        slots={{
          noRowsOverlay: noRowsOverlay(
            <FormattedMessage id="no.orders" defaultMessage="No Orders" />,
            <FormattedMessage
              id="create.orders.to.see.it.here"
              defaultMessage="Create orders to see it here"
            />,
            <Box sx={{ fontSize: "3rem" }}>
              <AssignmentIcon fontSize="inherit" />
            </Box>
          ),
          loadingOverlay: LoadingOverlay,
          noResultsOverlay: noRowsOverlay(
            <FormattedMessage id="no.orders" defaultMessage="No Orders" />,
            <FormattedMessage
              id="create.orders.to.see.it.here"
              defaultMessage="Create orders to see it here"
            />,
            <Box sx={{ fontSize: "3rem" }}>
              <AssignmentIcon fontSize="inherit" />
            </Box>
          ),
        }}
      />
    </Box>
  );
}
