import { DexkitApiProvider } from '@dexkit/core/providers';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';

export const GET_CHECKOUT_RECEIVER_QUERY = 'GET_CHECKOUT_RECEIVER_QUERY';

export default function useCheckoutReceiver(params: { owner?: string }) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery(
    [GET_CHECKOUT_RECEIVER_QUERY, params],
    async () => {
      if (!instance) {
        throw new Error('no instance');
      }

      if (!params.owner) {
        return null;
      }

      return (await instance.get(`/checkouts/settings-by-owner/${params.owner}`))
        .data;
    },
    {
      refetchOnWindowFocus: 'always',
      refetchOnMount: 'always',
      staleTime: Infinity,
    },
  );
}
