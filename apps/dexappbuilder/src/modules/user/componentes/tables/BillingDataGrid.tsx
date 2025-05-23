import Link from '@dexkit/ui/components/AppLink';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Decimal from 'decimal.js';
import moment from 'moment';
import { useState } from 'react';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import { useBillingHistoryQuery } from '../../hooks/payments';

interface Row {
  id: number;
  periodStart: string;
  periodEnd: string;
  used: number;
}

export default function BillingDataGrid() {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [filterModel, setFilterModel] = useState({ items: [] });
  const [sortModel, setSortModel] = useState<string[]>([]);

  const billingHistoryQuery = useBillingHistoryQuery({
    skip: paginationModel.page * paginationModel.pageSize,
    take: paginationModel.pageSize,
    sort: sortModel,
  });

  const rows = (billingHistoryQuery?.data?.data as Row[]) || [];
  const total = (billingHistoryQuery?.data?.total as number) || 0;

  const { formatMessage } = useIntl();

  const columns: GridColDef<Row>[] = [
    // { field: 'id', headerName: 'ID', width: 90, hideable: true },
    {
      field: 'periodStart',
      headerName: formatMessage({ id: 'start', defaultMessage: 'Start' }),
      width: 150,
      valueGetter: ({ row }) => {
        return moment(row.periodStart).format('DD/MM/YYYY');
      },
    },
    {
      field: 'periodEnd',
      headerName: formatMessage({ id: 'end', defaultMessage: 'End' }),
      width: 150,
      valueGetter: ({ row }) => {
        return moment(row.periodEnd).format('DD/MM/YYYY');
      },
    },
    {
      field: 'used',
      headerName: formatMessage({ id: 'used', defaultMessage: 'Used' }),
      width: 150,
      sortable: false,
      renderCell: ({ row }) => {
        return (
          <Typography>
            <FormattedNumber
              value={new Decimal(row?.used).toNumber()}
              style="currency"
              currencyDisplay="narrowSymbol"
              currency="USD"
              minimumFractionDigits={4}
            />
          </Typography>
        );
      },
    },
    {
      field: 'view',
      headerName: formatMessage({ id: 'view', defaultMessage: 'View' }),
      width: 150,
      sortable: false,
      renderCell: ({ row }) => {
        return (
          <Link variant="body1" href={`/u/settings/billing/${row.id}`}>
            <FormattedMessage id="view" defaultMessage="View" />
          </Link>
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
        filterMode="server"
        paginationMode="server"
        rowSelection={false}
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
