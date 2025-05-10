import { myAppsApi } from '@dexkit/ui/constants/api';
import { CountFilter, useUserEventsList } from '@dexkit/ui/hooks/userEvents';
import {
  DataGrid,
  GridFilterModel,
  GridSortModel,
  GridToolbar,
} from '@mui/x-data-grid';

import { GridColDef } from '@mui/x-data-grid';
import { useCallback, useEffect, useState } from 'react';

import { UserOnChainEvents } from '@dexkit/core/constants/userEvents';

export interface UserEventsTableProps {
  siteId?: number;
  type?: UserOnChainEvents;
  filters?: CountFilter;
  columns: GridColDef[];
}

export default function UserEventsTable({
  siteId,
  type,
  columns,
  filters,
}: UserEventsTableProps) {
  const [queryOptions, setQueryOptions] = useState<any>({
    filter: {
      type,
      hash: {
        not: null,
      },
      createdAt: { gte: filters?.start, lte: filters?.end },
      referral: filters?.referral ? filters.referral : undefined,
      from: filters?.from ? filters.from : undefined,
      chainId:
        filters?.chainId && filters?.chainId > 0 ? filters?.chainId : undefined,
    },
  });

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const { data, isLoading } = useUserEventsList({
    instance: myAppsApi,
    ...paginationModel,
    ...queryOptions,
    siteId,
  });

  const [rowCountState, setRowCountState] = useState((data?.total as any) || 0);

  useEffect(() => {
    setRowCountState((prevRowCountState: number) =>
      data?.total !== undefined ? data?.total : prevRowCountState,
    );
  }, [data?.total, setRowCountState]);

  const handleSortModelChange = useCallback((sortModel: GridSortModel) => {
    // Here you save the data you need from the sort model
    setQueryOptions({
      ...queryOptions,
      sort:
        sortModel && sortModel.length
          ? [sortModel[0].field, sortModel[0].sort]
          : [],
    });
  }, []);

  const onFilterChange = useCallback((filterModel: GridFilterModel) => {
    // Here you save the data you need from the filter model
    let filter = { ...queryOptions?.filter };
    if (filterModel.quickFilterValues?.length) {
      filter = {
        ...filter,
        q: filterModel.quickFilterValues[0],
      };
    }

    setQueryOptions({ ...queryOptions, filter });
  }, []);

  return (
    <DataGrid
      autoHeight
      slots={{ toolbar: GridToolbar }}
      rows={data?.data || []}
      columns={columns ? columns : []}
      rowCount={rowCountState}
      paginationModel={paginationModel}
      paginationMode="server"
      disableColumnFilter
      sortingMode="server"
      slotProps={{
        toolbar: {
          showQuickFilter: true,
        },
      }}
      onPaginationModelChange={setPaginationModel}
      filterMode="server"
      onFilterModelChange={onFilterChange}
      onSortModelChange={handleSortModelChange}
      pageSizeOptions={[5, 10, 25, 50]}
      disableRowSelectionOnClick
      loading={isLoading}
    />
  );
}
