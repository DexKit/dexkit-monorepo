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
import { getBlockExplorerUrl } from "@dexkit/core/utils";

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
        flex: 1.2,
        minWidth: 150,
        field: "order",
        headerName: formatMessage({
          id: "order.id",
          defaultMessage: "Order ID",
        }),
        renderCell: ({ row }) => (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', height: '100%' }}>
            <Typography>{row.id.substring(10)}</Typography>
          </Box>
        ),
      },
      {
        flex: 1.5,
        minWidth: 200,
        field: "createdAt",
        headerName: formatMessage({
          id: "created.On",
          defaultMessage: "Created On",
        }),
        renderCell: ({ row }) => {
          return (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', height: '100%' }}>
              <Typography>{moment(row.createdAt).format("L LTS")}</Typography>
            </Box>
          );
        },
      },
      {
        flex: 0.8,
        minWidth: 120,
        field: "status",
        headerName: formatMessage({
          id: "status",
          defaultMessage: "Status",
        }),
        renderCell: ({ row }) => {
          return (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', height: '100%' }}>
              <OrderStatusBadge status={row.status} palette={theme.palette} />
            </Box>
          );
        },
      },
      {
        flex: 0.5,
        minWidth: 80,
        field: "actions",
        headerName: formatMessage({
          id: "actions",
          defaultMessage: "Actions",
        }),
        renderCell: ({ row }) => {
          const handleViewTransaction = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (row.hash) {
              const explorerUrl = `${getBlockExplorerUrl(row.chainId)}/tx/${row.hash}`;
              window.open(explorerUrl, '_blank');
            }
          };

          return (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', height: '100%' }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <IconButton
                  onClick={handleViewTransaction}
                  disabled={!row.hash}
                >
                  <Tooltip
                    title={
                      row.hash ? (
                        <FormattedMessage
                          id="view.transaction.on.blockchain"
                          defaultMessage="View transaction on blockchain"
                        />
                      ) : (
                        <FormattedMessage
                          id="no.transaction.hash"
                          defaultMessage="No transaction hash available"
                        />
                      )
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
