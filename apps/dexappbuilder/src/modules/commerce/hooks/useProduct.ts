import { DexkitApiProvider } from '@dexkit/core/providers';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';

export const GET_PRODUCT_QUERY = 'GET_PRODUCT_QUERY';

export default function useProduct(params: { id?: string }) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery({
    queryKey: [GET_PRODUCT_QUERY, params],
    queryFn: async () => {
      if (!instance) {
        throw new Error('no instance');
      }

      if (!params.id) {
        return null;
      }

      return (await instance.get(`/products/${params.id}`))
        .data;
    },
    refetchOnWindowFocus: 'always',
    refetchOnMount: 'always',
    staleTime: Infinity,
  });
}
