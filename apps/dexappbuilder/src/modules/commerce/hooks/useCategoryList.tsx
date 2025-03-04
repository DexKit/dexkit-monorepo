import { DexkitApiProvider } from '@dexkit/core/providers';
import { GridSortModel } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';

export const GET_CATEGORY_LIST = 'GET_CATEGORY_LIST';

export default function useCategoryList(params: {
  page: number;
  limit: number;
  q?: string;
  sortModel?: GridSortModel;
}) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery(
    [GET_CATEGORY_LIST, params],
    async () => {
      if (!instance) {
        throw new Error('no instance');
      }

      const newParams: any = { ...params };

      for (const sort of params?.sortModel ?? []) {
        newParams[sort.field] = sort.sort;
      }

      delete newParams['sortModel'];

      return (
        await instance.get<{
          items: {
            name: string;
            id: string;
            countItems: number;
            active: true;
          }[];
          totalItems: number;
          totalPages: number;
          currentPage: number;
        }>('/product-category', { params: newParams })
      ).data;
    },
    {
      refetchOnMount: 'always',
      refetchOnWindowFocus: 'always',
      staleTime: 1000,
    },
  );
}
