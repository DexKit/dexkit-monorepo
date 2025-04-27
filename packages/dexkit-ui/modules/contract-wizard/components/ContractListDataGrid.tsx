import {
  NETWORK_EXPLORER,
  NETWORK_NAME,
  NETWORK_SLUG,
} from "@dexkit/core/constants/networks";
import { truncateAddress } from "@dexkit/core/utils";
import Link from "@dexkit/ui/components/AppLink";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import Settings from "@mui/icons-material/SettingsOutlined";
import VisibilityOff from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import { IconButton, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
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

  const [queryOptions, setQueryOptions] = useState<any>({
    filter: { owner: account?.toLowerCase() },
  });

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

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
        owner: account?.toLowerCase() || "",
        hide: showHidden ? undefined : false,
      },
    });
  }, [account, showHidden]);

  const [rowCountState, setRowCountState] = useState((data?.total as any) || 0);

  useEffect(() => {
    setRowCountState((prevRowCountState: number) =>
      data?.total !== undefined ? data?.total : prevRowCountState
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

  const columns: GridColDef[] = [
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
      valueGetter: ({ row }) => {
        return new Date(row.createdAt).toLocaleString();
      },
    },
    {
      field: "type",
      headerName: "Type",
      width: 150,
    },
    {
      field: "chainId",
      headerName: "Network",
      width: 110,
      valueGetter: ({ row }) => {
        return NETWORK_NAME(row.chainId);
      },
    },
    {
      field: "contractAddress",
      headerName: "Address",
      width: 160,
      renderCell: (params: any) => (
        <Link
          target="_blank"
          href={`${NETWORK_EXPLORER(params.row.chainId)}/address/${
            params.row.contractAddress
          }`}
        >
          {truncateAddress(params.row.contractAddress)}
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
                    address: row.contractAddress,
                    network: NETWORK_SLUG(row.chainId) as string,
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
                href={`/contract/${NETWORK_SLUG(row.chainId)}/${
                  row.contractAddress
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
                href={`/forms/create?contractAddress=${row.contractAddress}&chainId=${row.chainId}`}
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

  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>();

  const handleChangeRowSelectionModel = (
    rowSelectionModel: GridRowSelectionModel,
    details: GridCallbackDetails<any>
  ) => {
    setRowSelectionModel(rowSelectionModel);
  };

  return (
    <Box sx={{ width: "100%", height: 450 }}>
      <DataGrid
        rows={data?.data || []}
        rowCount={rowCountState}
        loading={isLoading}
        columns={columns}
        pageSizeOptions={[5, 10, 25, 50, 100]}
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
      />
    </Box>
  );
}
