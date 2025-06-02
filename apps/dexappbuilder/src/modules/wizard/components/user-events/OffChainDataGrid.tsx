import { myAppsApi } from '@dexkit/ui/constants/api';
import { useUserEventsList } from '@dexkit/ui/hooks/userEvents';
import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridSortModel,
  GridToolbar,
} from '@mui/x-data-grid';
import { useCallback, useEffect, useState } from 'react';

export interface OffChainDataGridProps {
  siteId?: number;
  columns: GridColDef[];
  type: string;
}

export default function OffChainDataGrid({
  siteId,
  columns,
  type,
}: OffChainDataGridProps) {
  const [queryOptions, setQueryOptions] = useState<any>({
    filter: {
      hash: null,
      type,
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
      rows={(data?.data as any) || []}
      columns={columns}
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
