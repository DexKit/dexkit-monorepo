import { useCreditHistory } from '@dexkit/ui/hooks/payments';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Decimal from 'decimal.js';
import moment from 'moment';
import { useState } from 'react';
import { FormattedNumber, useIntl } from 'react-intl';

interface Row {
  id: number;
  enabled: boolean;
  createdAt: string;
  amount: number;
}

export default function CreditsDataGrid() {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [sortModel, setSortModel] = useState<string[]>([]);

  const creditHistoryQuery = useCreditHistory({
    skip: paginationModel.page * paginationModel.pageSize,
    take: paginationModel.pageSize,
    sort: sortModel,
  });

  const rows = (creditHistoryQuery?.data?.data as Row[]) || [];
  const total = (creditHistoryQuery?.data?.total as number) || 0;
  const { formatMessage } = useIntl();

  const columns: GridColDef<Row>[] = [
    // { field: 'id', headerName: 'ID', width: 90, hideable: true },
    {
      field: 'status',
      headerName: formatMessage({ id: 'status', defaultMessage: 'Status' }),
      width: 150,
      sortable: false,
      renderCell: ({ row }) =>
        row.enabled ? (
          <Chip
            size="small"
            color="success"
            variant="outlined"
            label={formatMessage({
              id: 'credited',
              defaultMessage: 'Credited',
            })}
          />
        ) : (
          <Chip
            size="small"
            color="warning"
            variant="outlined"
            label={formatMessage({
              id: 'payment.pending',
              defaultMessage: 'Payment Pending',
            })}
          />
        ),
    },
    {
      field: 'createdAt',
      headerName: formatMessage({ id: 'created', defaultMessage: 'Created' }),
      width: 150,
      valueGetter: ({ row }) => {
        return moment(row.createdAt).format('DD/MM/YYYY');
      },
    },
    {
      field: 'amount',
      headerName: formatMessage({ id: 'amount', defaultMessage: 'Amount' }),
      width: 150,
      sortable: false,
      renderCell: ({ row }) => {
        return (
          <Typography>
            <FormattedNumber
              value={new Decimal(row?.amount).toNumber()}
              style="currency"
              currencyDisplay="narrowSymbol"
              currency="USD"
              minimumFractionDigits={4}
            />
          </Typography>
        );
      },
    },
  ];

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        sortingMode="server"
        rowSelection={false}
        filterMode="server"
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}
        onSortModelChange={(model) =>
          setSortModel([model[0]?.field, model[0]?.sort as string])
        }
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        rowCount={total}
        pageSizeOptions={[10]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}
