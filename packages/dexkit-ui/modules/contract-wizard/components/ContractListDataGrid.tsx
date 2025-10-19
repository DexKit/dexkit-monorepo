import {
  NETWORK_EXPLORER,
  NETWORK_NAME,
  NETWORK_SLUG,
} from "@dexkit/core/constants/networks";
import { truncateAddress } from "@dexkit/core/utils";
import Link from "@dexkit/ui/components/AppLink";
import MobilePagination from "@dexkit/ui/components/MobilePagination";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import Settings from "@mui/icons-material/SettingsOutlined";
import VisibilityOff from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  IconButton,
  Stack,
  Tooltip,
  useMediaQuery,
  useTheme
} from "@mui/material";
import {
  DataGrid,
  GridCallbackDetails,
  GridColDef,
  GridFilterModel,
  GridRowSelectionModel,
  GridSortModel,
  GridToolbar,
} from "@mui/x-data-grid";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import {
  LIST_DEPLOYED_CONTRACTS,
  useContractVisibility,
  useListDeployedContracts,
} from "../hooks";

export interface ContractListDataGridProps {
  hideFormButton?: boolean;
  showHidden: boolean;
  onClickContract?: ({
    address,
    network,
  }: {
    address: string;
    network: string;
  }) => void;
}

export default function ContractListDataGrid({
  hideFormButton,
  showHidden,
  onClickContract,
}: ContractListDataGridProps) {
  const { account } = useWeb3React();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [queryOptions, setQueryOptions] = useState<any>({
    filter: { owner: account?.toLowerCase() },
  });

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: isMobile ? 5 : 10,
  });

  useEffect(() => {
    setPaginationModel({
      page: 0,
      pageSize: isMobile ? 5 : 10,
    });
  }, [isMobile]);

  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useListDeployedContracts({
    ...queryOptions,
    ...paginationModel,
  });

  useEffect(() => {
    setQueryOptions(prevOptions => ({
      ...prevOptions,
      filter: {
        ...prevOptions?.filter,
        owner: account?.toLowerCase() || "",
        hide: showHidden ? undefined : false,
      },
    }));
    setPaginationModel(prev => ({ ...prev, page: 0 }));
  }, [account, showHidden]);

  const [rowCountState, setRowCountState] = useState(0);

  useEffect(() => {
    if (data?.total !== undefined) {
      setRowCountState(data.total);
    }
  }, [data?.total]);

  useEffect(() => {
    if (data?.total !== undefined) {
      setRowCountState(data.total);
    }
  }, [paginationModel.page, paginationModel.pageSize]);


  const handleSortModelChange = useCallback(
    (sortModel: GridSortModel) => {
      setQueryOptions({
        ...queryOptions,
        sort:
          sortModel && sortModel.length
            ? [sortModel[0].field, sortModel[0].sort]
            : [],
      });
    },
    [queryOptions]
  );

  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
  });

  const onFilterChange = useCallback(
    (filterModel: GridFilterModel) => {
      let filter = {
        ...queryOptions?.filter,
        owner: account?.toLowerCase() || "",
      };

      const firstFilter = filterModel.items[0];

      if (filterModel.quickFilterValues?.length) {
        filter = {
          ...filter,
          q: filterModel.quickFilterValues[0],
        };
      } else if (
        firstFilter?.field === "name" &&
        firstFilter?.operator === "contains" &&
        firstFilter?.value !== ""
      ) {
        filter = {
          ...filter,
          q: firstFilter.value,
        };
      } else if (firstFilter?.field === "type" && firstFilter?.value) {
        filter = {
          ...filter,
          type: firstFilter.value,
        };
      } else if (firstFilter?.field === "chainId" && firstFilter?.value) {
        filter = {
          ...filter,
          chainId: firstFilter.value,
        };
      }

      setFilterModel(filterModel);

      if (!filter.owner && account) {
        filter.owner = account.toLowerCase();
      }

      setQueryOptions({ ...queryOptions, filter });
    },
    [queryOptions, account]
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

  const desktopColumns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      minWidth: 200,
      flex: 1,
      valueGetter: (value, row) => {
        return row?.createdAt ? new Date(row.createdAt).toLocaleString() : 'N/A';
      },
    },
    {
      field: "type",
      headerName: "Type",
      width: 150,
      filterable: true,
      type: 'singleSelect',
      filterOperators: [
        {
          label: 'Contains',
          value: 'contains',
          getApplyFilterFn: (filterItem: any) => {
            if (!filterItem.field || !filterItem.value) {
              return null;
            }
            return (params: any) => {
              return params.value?.toString().toLowerCase().includes(filterItem.value.toLowerCase());
            };
          },
        },
      ],
    },
    {
      field: "chainId",
      headerName: "Network",
      width: 110,
      filterable: true,
      type: 'singleSelect',
      valueGetter: (value, row) => {
        return row?.chainId ? NETWORK_NAME(row.chainId) : 'N/A';
      },
      filterOperators: [
        {
          label: 'Contains',
          value: 'contains',
          getApplyFilterFn: (filterItem: any) => {
            if (!filterItem.field || !filterItem.value) {
              return null;
            }
            return (params: any) => {
              const networkName = params.row?.chainId ? NETWORK_NAME(params.row.chainId) : 'N/A';
              return networkName.toLowerCase().includes(filterItem.value.toLowerCase());
            };
          },
        },
      ],
    },
    {
      field: "contractAddress",
      headerName: "Address",
      width: 160,
      renderCell: (params: any) => (
        <Link
          target="_blank"
          href={`${NETWORK_EXPLORER(params.row?.chainId)}/address/${params.row?.contractAddress
            }`}
        >
          {truncateAddress(params.row?.contractAddress)}
        </Link>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 240,
      renderCell: ({ row }) => {
        return (
          <Stack direction={"row"} spacing={1}>
            {onClickContract ? (
              <IconButton
                onClick={() =>
                  onClickContract({
                    address: row?.contractAddress,
                    network: NETWORK_SLUG(row?.chainId) as string,
                  })
                }
                size="small"
              >
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
            ) : (
              <IconButton
                LinkComponent={Link}
                href={`/contract/${NETWORK_SLUG(row?.chainId)}/${row?.contractAddress
                  }`}
                size="small"
              >
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
            )}

            {hideFormButton ? (
              <></>
            ) : (
              <IconButton
                LinkComponent={Link}
                href={`/forms/create?contractAddress=${row?.contractAddress}&chainId=${row?.chainId}`}
                target="_blank"
                size="small"
              >
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
            )}
            <IconButton onClick={handleHideContract(row?.id)}>
              {row?.hide ? (
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

  const mobileColumns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      minWidth: 120,
      flex: 1,
      cellClassName: 'mobile-name-cell',
      filterable: true,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      align: "right",
      headerAlign: "right",
      cellClassName: 'mobile-actions-cell',
      renderCell: ({ row }) => {
        return (
          <Stack direction={"row"} spacing={0.5} sx={{ justifyContent: 'flex-end', width: '100%' }}>
            {onClickContract ? (
              <IconButton
                onClick={() =>
                  onClickContract({
                    address: row?.contractAddress,
                    network: NETWORK_SLUG(row?.chainId) as string,
                  })
                }
                size="small"
              >
                <Settings fontSize="small" />
              </IconButton>
            ) : (
              <IconButton
                LinkComponent={Link}
                href={`/contract/${NETWORK_SLUG(row?.chainId)}/${row?.contractAddress
                  }`}
                size="small"
              >
                <Settings fontSize="small" />
              </IconButton>
            )}

            {hideFormButton ? (
              <></>
            ) : (
              <IconButton
                LinkComponent={Link}
                href={`/forms/create?contractAddress=${row?.contractAddress}&chainId=${row?.chainId}`}
                target="_blank"
                size="small"
              >
                <PostAddOutlinedIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton onClick={handleHideContract(row?.id)} size="small">
              {row?.hide ? (
                <VisibilityOff fontSize="small" />
              ) : (
                <VisibilityOutlined fontSize="small" />
              )}
            </IconButton>
          </Stack>
        );
      },
      sortable: false,
      filterable: false,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 140,
      filterable: true,
      valueGetter: (value, row) => {
        return row?.createdAt ? new Date(row.createdAt).toLocaleString() : 'N/A';
      },
      cellClassName: 'mobile-date-cell',
    },
    {
      field: "type",
      headerName: "Type",
      width: 120,
      filterable: true,
      type: 'singleSelect',
      cellClassName: 'mobile-type-cell',
      filterOperators: [
        {
          label: 'Contains',
          value: 'contains',
          getApplyFilterFn: (filterItem: any) => {
            if (!filterItem.field || !filterItem.value) {
              return null;
            }
            return (params: any) => {
              return params.value?.toString().toLowerCase().includes(filterItem.value.toLowerCase());
            };
          },
        },
      ],
    },
    {
      field: "chainId",
      headerName: "Network",
      width: 100,
      filterable: true,
      type: 'singleSelect',
      valueGetter: (value, row) => {
        return row?.chainId ? NETWORK_NAME(row.chainId) : 'N/A';
      },
      cellClassName: 'mobile-network-cell',
      filterOperators: [
        {
          label: 'Contains',
          value: 'contains',
          getApplyFilterFn: (filterItem: any) => {
            if (!filterItem.field || !filterItem.value) {
              return null;
            }
            return (params: any) => {
              const networkName = params.row?.chainId ? NETWORK_NAME(params.row.chainId) : 'N/A';
              return networkName.toLowerCase().includes(filterItem.value.toLowerCase());
            };
          },
        },
      ],
    },
    {
      field: "contractAddress",
      headerName: "Address",
      width: 120,
      filterable: true,
      cellClassName: 'mobile-address-cell',
      renderCell: (params: any) => (
        <Link
          target="_blank"
          href={`${NETWORK_EXPLORER(params.row?.chainId)}/address/${params.row?.contractAddress
            }`}
          style={{ fontSize: '0.75rem' }}
        >
          {truncateAddress(params.row?.contractAddress)}
        </Link>
      ),
    },
  ];

  const columns = isMobile ? mobileColumns : desktopColumns;

  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>();

  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});
  const [density, setDensity] = useState<'comfortable' | 'standard' | 'compact'>('standard');

  const handleChangeRowSelectionModel = (
    rowSelectionModel: GridRowSelectionModel,
    details: GridCallbackDetails<any>
  ) => {
    setRowSelectionModel(rowSelectionModel);
  };

  const handleColumnVisibilityModelChange = (newModel: any) => {
    setColumnVisibilityModel(newModel);
  };

  const handleDensityChange = (newDensity: 'comfortable' | 'standard' | 'compact') => {
    setDensity(newDensity);
  };

  const handleExport = () => {
    const csvContent = [
      ['Name', 'Created At', 'Type', 'Network', 'Address', 'Hidden'].join(','),
      ...(data?.data || []).map((contract: any) => [
        `"${contract.name || ''}"`,
        `"${contract.createdAt ? new Date(contract.createdAt).toLocaleString() : 'N/A'}"`,
        `"${contract.type || 'N/A'}"`,
        `"${contract.chainId ? NETWORK_NAME(contract.chainId) : 'N/A'}"`,
        `"${contract.contractAddress || ''}"`,
        `"${contract.hide ? 'Yes' : 'No'}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `contracts_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMobilePageChange = (newPage: number) => {
    setPaginationModel({ ...paginationModel, page: newPage });
  };

  const handleMobilePageSizeChange = (newPageSize: number) => {
    setPaginationModel({ page: 0, pageSize: newPageSize });
  };

  return (
    <Box sx={{
      width: "100%",
      height: isMobile ? 'auto' : 450,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <DataGrid
        rows={data?.data || []}
        rowCount={rowCountState || -1}
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
        hideFooterPagination={isMobile}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={handleColumnVisibilityModelChange}
        density={density}
        onDensityChange={handleDensityChange}
        initialState={{
          columns: {
            columnVisibilityModel: {},
          },
        }}
        onRowSelectionModelChange={handleChangeRowSelectionModel}
        sx={{
          height: isMobile ? 500 : 450,
          '& .MuiDataGrid-main': {
            overflow: 'auto',
          },
          '& .MuiDataGrid-virtualScroller': {
            overflow: 'auto',
          },
          ...(isMobile && {
            '& .mobile-name-cell': {
              paddingLeft: theme.spacing(1),
              paddingRight: theme.spacing(0.5),
            },
            '& .mobile-actions-cell': {
              paddingLeft: theme.spacing(0.5),
              paddingRight: theme.spacing(1),
            },
            '& .mobile-date-cell': {
              paddingLeft: theme.spacing(0.5),
              paddingRight: theme.spacing(0.5),
              fontSize: '0.75rem',
            },
            '& .mobile-type-cell': {
              paddingLeft: theme.spacing(0.5),
              paddingRight: theme.spacing(0.5),
              fontSize: '0.75rem',
            },
            '& .mobile-network-cell': {
              paddingLeft: theme.spacing(0.5),
              paddingRight: theme.spacing(0.5),
              fontSize: '0.75rem',
            },
            '& .mobile-address-cell': {
              paddingLeft: theme.spacing(0.5),
              paddingRight: theme.spacing(0.5),
              fontSize: '0.75rem',
            },
            '& .MuiDataGrid-cell': {
              display: 'flex',
              alignItems: 'center',
              minHeight: '48px !important',
              fontSize: '0.75rem',
            },
            '& .MuiDataGrid-row': {
              minHeight: '48px !important',
              maxHeight: '48px !important',
            },
            '& .MuiDataGrid-columnHeader': {
              fontSize: '0.75rem',
              padding: `${theme.spacing(0.5)} ${theme.spacing(0.5)}`,
            },
          }),
        }}
      />

      {isMobile && (
        <MobilePagination
          page={paginationModel.page}
          pageSize={paginationModel.pageSize}
          totalRows={rowCountState}
          onPageChange={handleMobilePageChange}
          onPageSizeChange={handleMobilePageSizeChange}
          pageSizeOptions={[5, 10, 25]}
        />
      )}
    </Box>
  );
}
