import { useCreditHistory } from '@dexkit/ui/hooks/payments';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import Decimal from 'decimal.js';
import moment from 'moment';
import { useState } from 'react';
import { FormattedNumber, useIntl } from 'react-intl';
import { useIsMobile } from '@dexkit/ui/hooks/misc';

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
  const isMobile = useIsMobile();

  const creditHistoryQuery = useCreditHistory({
    skip: paginationModel.page * paginationModel.pageSize,
    take: paginationModel.pageSize,
    sort: sortModel,
  });

  const rows = (creditHistoryQuery?.data?.data as Row[]) || [];
  const total = (creditHistoryQuery?.data?.total as number) || 0;

  const { formatMessage } = useIntl();

  const columns: GridColDef<Row>[] = [
    {
      field: 'status',
      headerName: formatMessage({ id: 'status', defaultMessage: 'Status' }),
      width: isMobile ? 100 : 150,
      minWidth: 80,
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
            {row?.enabled ? (
              <Chip
                size={isMobile ? "small" : "medium"}
                color="success"
                variant="outlined"
                label={formatMessage({
                  id: 'credited',
                  defaultMessage: 'Credited',
                })}
                sx={{
                  fontSize: isMobile ? '0.7rem' : '0.75rem',
                  height: isMobile ? 20 : 24
                }}
              />
            ) : (
              <Chip
                size={isMobile ? "small" : "medium"}
                color="warning"
                variant="outlined"
                label={formatMessage({
                  id: 'payment.pending',
                  defaultMessage: 'Payment Pending',
                })}
                sx={{
                  fontSize: isMobile ? '0.7rem' : '0.75rem',
                  height: isMobile ? 20 : 24
                }}
              />
            )}
          </Box>
        );
      },
    },
    {
      field: 'createdAt',
      headerName: formatMessage({ id: 'created', defaultMessage: 'Created' }),
      width: isMobile ? 100 : 150,
      minWidth: 80,
      flex: isMobile ? 1 : 0,
      valueGetter: (value, row) => {
        return row?.createdAt ? moment(row.createdAt).format(isMobile ? 'DD/MM/YY' : 'DD/MM/YYYY') : 'N/A';
      },
    },
    {
      field: 'amount',
      headerName: formatMessage({ id: 'amount', defaultMessage: 'Amount' }),
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
                value={row?.amount ? new Decimal(row.amount).toNumber() : 0}
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
        rowSelection={false}
        filterMode="server"
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}
        onSortModelChange={(model: GridSortModel) =>
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
