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
  padding: theme.spacing(0.5),
  marginLeft: theme.spacing(0.25),
  marginRight: theme.spacing(0.25),
  '& svg': {
    fontSize: theme.typography.body1.fontSize,
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
        sx={{ fontSize: theme.typography.caption.fontSize, lineHeight: 1.2, mb: 0.5 }}
      >
        {params.row.name}
      </Typography>
      <Typography
        variant="caption"
        sx={{ fontSize: theme.typography.caption.fontSize, display: 'block', color: 'text.secondary' }}
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
      borderRadius: theme.shape.borderRadius,
      overflow: 'hidden',
      width: '100%',
    },
    '.MuiDataGrid-columnHeader': {
      fontSize: theme.typography.caption.fontSize,
      padding: `${theme.spacing(0.75)} ${theme.spacing(0.5)}`,
      minHeight: `${theme.spacing(5)} !important`,
      maxHeight: `${theme.spacing(5)} !important`,
    },
    '.MuiDataGrid-columnHeaderTitle': {
      fontWeight: 'bold',
      fontSize: theme.typography.caption.fontSize,
    },
    '.MuiDataGrid-row': {
      minHeight: `${theme.spacing(7.5)} !important`,
      maxHeight: `${theme.spacing(11.25)} !important`,
    },
    '.MuiDataGrid-cell': {
      fontSize: theme.typography.caption.fontSize,
      padding: `${theme.spacing(0.75)} ${theme.spacing(0.5)}`,
      lineHeight: 1.2,
    },
    '.MuiDataGrid-virtualScroller': {
      overflow: 'visible',
    },
    '.MuiDataGrid-toolbarContainer': {
      padding: theme.spacing(0.5),
    },
    '.MuiDataGrid-toolbarContainer button': {
      padding: theme.spacing(0.5),
    },
    '.MuiDataGrid-toolbarContainer .MuiInputBase-root': {
      height: theme.spacing(4),
      fontSize: theme.typography.caption.fontSize,
    },
    '.MuiTablePagination-root': {
      overflow: 'hidden',
      fontSize: theme.typography.caption.fontSize,
    },
    '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
      fontSize: theme.typography.caption.fontSize,
    },
    '.MuiDataGrid-columnHeaders': {
      height: `${theme.spacing(5)} !important`,
      minHeight: `${theme.spacing(5)} !important`,
      maxHeight: `${theme.spacing(5)} !important`,
    }
  };

  return (
    <Box sx={{
      width: '100%',
      height: { xs: theme.spacing(45), sm: theme.spacing(56.25) },
      '& .MuiDataGrid-cell': {
        fontSize: { xs: theme.typography.caption.fontSize, sm: theme.typography.body2.fontSize },
      },
      '& .MuiDataGrid-columnHeader': {
        fontSize: { xs: theme.typography.caption.fontSize, sm: theme.typography.body2.fontSize },
      },
      '& .MuiDataGrid-columnHeaders': {
        height: isMobile ? `${theme.spacing(5)} !important` : `${theme.spacing(7)} !important`,
        minHeight: isMobile ? `${theme.spacing(5)} !important` : `${theme.spacing(7)} !important`,
        maxHeight: isMobile ? `${theme.spacing(5)} !important` : `${theme.spacing(7)} !important`,
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
