import {
  NETWORK_EXPLORER,
  NETWORK_NAME,
  NETWORK_SLUG,
} from '@dexkit/core/constants/networks';
import { truncateAddress } from '@dexkit/core/utils';
import Link from '@dexkit/ui/components/AppLink';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import Settings from '@mui/icons-material/SettingsOutlined';
import VisibilityOff from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import {
  Box,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  DataGrid,
  GridCallbackDetails,
  GridColDef,
  GridFilterModel,
  GridRowSelectionModel,
  GridSortModel,
  GridToolbar,
} from '@mui/x-data-grid';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  LIST_DEPLOYED_CONTRACTS,
  useContractVisibility,
  useListDeployedContracts,
} from '../hooks';

const MobileIconButton = styled(IconButton)(({ theme }) => ({
  padding: '4px',
  marginLeft: '2px',
  marginRight: '2px',
  '& svg': {
    fontSize: '1rem',
  }
}));

export interface ContractListDataGridProps {
  showHidden: boolean;
}

export default function ContractListDataGrid({
  showHidden,
}: ContractListDataGridProps) {
  const { account } = useWeb3React();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const mobilePageSize = 5;

  const [queryOptions, setQueryOptions] = useState<any>({
    filter: { owner: account?.toLowerCase() },
  });

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: isMobile ? mobilePageSize : 10,
  });

  useEffect(() => {
    setPaginationModel({
      page: 0,
      pageSize: isMobile ? mobilePageSize : 10,
    });
  }, [isMobile]);

  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useListDeployedContracts({
    ...queryOptions,
    ...paginationModel,
  });

  useEffect(() => {
    setQueryOptions({
      ...queryOptions,
      filter: {
        ...queryOptions?.filter,
        owner: account?.toLowerCase() || '',
        hide: showHidden ? undefined : false,
      },
    });
  }, [account, showHidden]);

  const [rowCountState, setRowCountState] = useState((data?.total as any) || 0);

  useEffect(() => {
    setRowCountState((prevRowCountState: number) =>
      data?.total !== undefined ? data?.total : prevRowCountState,
    );
  }, [data?.total, setRowCountState]);

  const handleSortModelChange = useCallback(
    (sortModel: GridSortModel) => {
      // Here you save the data you need from the sort model
      setQueryOptions({
        ...queryOptions,
        sort:
          sortModel && sortModel.length
            ? [sortModel[0].field, sortModel[0].sort]
            : [],
      });
    },
    [queryOptions],
  );

  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
  });

  const onFilterChange = useCallback(
    (filterModel: GridFilterModel) => {
      let filter = {
        ...queryOptions?.filter,
        owner: account?.toLowerCase() || '',
      };

      const firstFilter = filterModel.items[0];

      if (filterModel.quickFilterValues?.length) {
        filter = {
          ...filter,
          q: filterModel.quickFilterValues[0],
        };
      } else if (
        firstFilter?.field === 'name' &&
        firstFilter?.operator === 'contains' &&
        firstFilter?.value !== ''
      ) {
        filter = {
          ...filter,
          q: firstFilter.value,
        };
      }

      setFilterModel(filterModel);

      if (!filter.owner && account) {
        filter.owner = account.toLowerCase();
      }

      setQueryOptions({ ...queryOptions, filter });
    },
    [queryOptions, account],
  );

  const { mutateAsync: toggleVisibility } = useContractVisibility();

  const handleHideContract = (id: number) => {
    return async () => {
      const toggled = data?.data.find((c) => c.id === id);
      //@ts-ignore
      await toggleVisibility({ id, visibility: !Boolean(toggled?.hide) });

      queryClient.invalidateQueries({
        queryKey: [LIST_DEPLOYED_CONTRACTS],
      });
    };
  };

  const renderMobileName = (params: any) => (
    <Box>
      <Typography
        variant="body2"
        fontWeight="medium"
        sx={{ fontSize: '0.8rem', lineHeight: 1.2, mb: 0.5 }}
      >
        {params.row.name}
      </Typography>
      <Typography
        variant="caption"
        sx={{ fontSize: '0.7rem', display: 'block', color: 'text.secondary' }}
      >
        {new Date(params.row.createdAt).toLocaleDateString()}
      </Typography>
    </Box>
  );

  const renderMobileActions = (params: any) => (
    <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
      <Link href={`/contract/${NETWORK_SLUG(params.row.chainId)}/${params.row.contractAddress}`}>
        <MobileIconButton size="small">
          <Settings fontSize="small" />
        </MobileIconButton>
      </Link>
      <Link href={`/forms/create?contractAddress=${params.row.contractAddress}&chainId=${params.row.chainId}`} target="_blank">
        <MobileIconButton size="small">
          <PostAddOutlinedIcon fontSize="small" />
        </MobileIconButton>
      </Link>
      <MobileIconButton onClick={handleHideContract(params.row.id)} size="small">
        {params.row.hide ? (
          <VisibilityOff fontSize="small" />
        ) : (
          <VisibilityOutlined fontSize="small" />
        )}
      </MobileIconButton>
    </Stack>
  );

  const mobileColumns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 3,
      minWidth: 150,
      renderCell: renderMobileName,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 110,
      align: 'right',
      headerAlign: 'right',
      renderCell: renderMobileActions,
      sortable: false,
      filterable: false,
    },
  ];

  const desktopColumns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 150,
      flex: 1,
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      minWidth: 180,
      flex: 1,
      valueGetter: ({ row }) => {
        return new Date(row.createdAt).toLocaleString();
      },
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 150,
    },
    {
      field: 'chainId',
      headerName: 'Network',
      width: 110,
      valueGetter: ({ row }) => {
        return NETWORK_NAME(row.chainId);
      },
    },
    {
      field: 'contractAddress',
      headerName: 'Address',
      width: 160,
      renderCell: (params: any) => (
        <Link
          target="_blank"
          href={`${NETWORK_EXPLORER(params.row.chainId)}/address/${params.row.contractAddress}`}
        >
          {truncateAddress(params.row.contractAddress)}
        </Link>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 240,
      renderCell: ({ row }) => {
        return (
          <Stack direction={'row'} spacing={1}>
            <Link href={`/contract/${NETWORK_SLUG(row.chainId)}/${row.contractAddress}`}>
              <IconButton size="small">
                <Tooltip
                  title={
                    <FormattedMessage
                      id="config.contract"
                      defaultMessage="Config Contract"
                    />
                  }
                >
                  <Settings />
                </Tooltip>
              </IconButton>
            </Link>
            <Link href={`/forms/create?contractAddress=${row.contractAddress}&chainId=${row.chainId}`} target="_blank">
              <IconButton size="small">
                <Tooltip
                  title={
                    <FormattedMessage
                      id="create.form"
                      defaultMessage="Create form"
                    />
                  }
                >
                  <PostAddOutlinedIcon />
                </Tooltip>
              </IconButton>
            </Link>
            <IconButton onClick={handleHideContract(row.id)}>
              {row.hide ? (
                <Tooltip
                  title={
                    <FormattedMessage
                      id="make.visible"
                      defaultMessage="Make visible"
                    />
                  }
                >
                  <VisibilityOff />
                </Tooltip>
              ) : (
                <Tooltip
                  title={<FormattedMessage id="hide" defaultMessage="Hide" />}
                >
                  <VisibilityOutlined />
                </Tooltip>
              )}
            </IconButton>
          </Stack>
        );
      },
    },
  ];

  const columns = isMobile ? mobileColumns : desktopColumns;

  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>();

  const handleChangeRowSelectionModel = (
    rowSelectionModel: GridRowSelectionModel,
    details: GridCallbackDetails<any>,
  ) => {
    setRowSelectionModel(rowSelectionModel);
  };

  const mobileStyles = {
    '.MuiDataGrid-root': {
      border: 'none',
      borderRadius: '8px',
      overflow: 'hidden',
      width: '100%',
    },
    '.MuiDataGrid-columnHeader': {
      fontSize: '0.75rem',
      padding: '6px 4px',
      minHeight: '40px !important',
      maxHeight: '40px !important',
    },
    '.MuiDataGrid-columnHeaderTitle': {
      fontWeight: 'bold',
      fontSize: '0.75rem',
    },
    '.MuiDataGrid-row': {
      minHeight: '60px !important',
      maxHeight: '90px !important',
    },
    '.MuiDataGrid-cell': {
      fontSize: '0.75rem',
      padding: '6px 4px',
      lineHeight: 1.2,
    },
    '.MuiDataGrid-virtualScroller': {
      overflow: 'visible',
    },
    '.MuiDataGrid-toolbarContainer': {
      padding: '4px',
    },
    '.MuiDataGrid-toolbarContainer button': {
      padding: '4px',
    },
    '.MuiDataGrid-toolbarContainer .MuiInputBase-root': {
      height: '32px',
      fontSize: '0.75rem',
    },
    '.MuiTablePagination-root': {
      overflow: 'hidden',
      fontSize: '0.75rem',
    },
    '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
      fontSize: '0.7rem',
    },
    '.MuiDataGrid-columnHeaders': {
      height: '40px !important',
      minHeight: '40px !important',
      maxHeight: '40px !important',
    }
  };

  return (
    <Box sx={{
      width: '100%',
      height: { xs: 360, sm: 450 },
      '& .MuiDataGrid-cell': {
        fontSize: { xs: '0.75rem', sm: '0.875rem' },
      },
      '& .MuiDataGrid-columnHeader': {
        fontSize: { xs: '0.75rem', sm: '0.875rem' },
      },
      '& .MuiDataGrid-columnHeaders': {
        height: isMobile ? '40px !important' : '56px !important',
        minHeight: isMobile ? '40px !important' : '56px !important',
        maxHeight: isMobile ? '40px !important' : '56px !important',
      },
      ...(isMobile ? mobileStyles : {}),
    }}>
      <DataGrid
        rows={data?.data || []}
        rowCount={rowCountState}
        loading={isLoading}
        columns={columns}
        pageSizeOptions={isMobile ? [5] : [5, 10, 25, 50, 100]}
        paginationModel={paginationModel}
        paginationMode="server"
        sortingMode="server"
        filterMode="server"
        onPaginationModelChange={setPaginationModel}
        onSortModelChange={handleSortModelChange}
        onFilterModelChange={onFilterChange}
        disableRowSelectionOnClick
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        initialState={{
          columns: {
            columnVisibilityModel: {},
          },
        }}
        onRowSelectionModelChange={handleChangeRowSelectionModel}
        density="compact"
        rowHeight={isMobile ? 60 : 52}
        autoHeight={isMobile}
        sx={{
          width: '100%',
          maxWidth: '100%',
          overflow: 'auto',
          ...(isMobile && {
            '& .MuiDataGrid-virtualScroller': {
              overflow: 'visible',
            },
          }),
        }}
      />
    </Box>
  );
}
