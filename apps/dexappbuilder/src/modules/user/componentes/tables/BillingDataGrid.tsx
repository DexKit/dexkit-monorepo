import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Decimal from 'decimal.js';
import moment from 'moment';
import { useState } from 'react';
import { FormattedNumber, useIntl } from 'react-intl';
import { useBillingHistoryQuery } from '../../hooks/payments';
import { useIsMobile } from '@dexkit/ui/hooks/misc';

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
  const isMobile = useIsMobile();

  const billingHistoryQuery = useBillingHistoryQuery({
    skip: paginationModel.page * paginationModel.pageSize,
    take: paginationModel.pageSize,
    sort: sortModel,
  });

  const rows = (billingHistoryQuery?.data?.data as Row[]) || [];
  const total = (billingHistoryQuery?.data?.total as number) || 0;

  const { formatMessage } = useIntl();

  const columns: GridColDef<Row>[] = [
    {
      field: 'periodStart',
      headerName: formatMessage({ id: 'start', defaultMessage: 'Start' }),
      width: isMobile ? 100 : 150,
      minWidth: 80,
      flex: isMobile ? 1 : 0,
      valueGetter: (value, row) => {
        return row?.periodStart ? moment(row.periodStart).format(isMobile ? 'DD/MM/YY' : 'DD/MM/YYYY') : 'N/A';
      },
    },
    {
      field: 'periodEnd',
      headerName: formatMessage({ id: 'end', defaultMessage: 'End' }),
      width: isMobile ? 100 : 150,
      minWidth: 80,
      flex: isMobile ? 1 : 0,
      valueGetter: (value, row) => {
        return row?.periodEnd ? moment(row.periodEnd).format(isMobile ? 'DD/MM/YY' : 'DD/MM/YYYY') : 'N/A';
      },
    },
    {
      field: 'used',
      headerName: formatMessage({ id: 'used', defaultMessage: 'Used' }),
      width: isMobile ? 120 : 150,
      minWidth: 100,
      flex: isMobile ? 1 : 0,
      sortable: false,
      renderCell: ({ row }) => {
        return (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            height: '100%',
            width: '100%'
          }}>
            <Typography sx={{ 
              textAlign: 'left', 
              lineHeight: 1,
              fontSize: isMobile ? '0.75rem' : '0.875rem'
            }}>
              <FormattedNumber
                value={row?.used ? new Decimal(row.used).toNumber() : 0}
                style="currency"
                currencyDisplay="narrowSymbol"
                currency="USD"
                minimumFractionDigits={isMobile ? 2 : 4}
              />
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <Box sx={{ 
      height: isMobile ? 300 : 400, 
      width: '100%',
      '& .MuiDataGrid-root': {
        border: 'none',
      },
      '& .MuiDataGrid-cell': {
        borderBottom: '1px solid rgba(224, 224, 224, 0.1)',
      },
      '& .MuiDataGrid-columnHeaders': {
        borderBottom: '1px solid rgba(224, 224, 224, 0.1)',
      },
      '& .MuiDataGrid-footerContainer': {
        borderTop: '1px solid rgba(224, 224, 224, 0.1)',
      },
    }}>
      <DataGrid
        rows={rows}
        columns={columns}
        sortingMode="server"
        filterMode="server"
        paginationMode="server"
        rowSelection={false}
        onPaginationModelChange={setPaginationModel}
        onSortModelChange={(model: any) =>
          setSortModel([model[0]?.field, model[0]?.sort as string])
        }
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: isMobile ? 5 : 10,
            },
          },
        }}
        rowCount={total}
        pageSizeOptions={isMobile ? [5] : [5, 10]}
        checkboxSelection={!isMobile}
        disableRowSelectionOnClick
        autoHeight={isMobile}
        hideFooter={isMobile && rows.length <= 5}
        density={isMobile ? 'compact' : 'standard'}
      />
    </Box>
  );
}
