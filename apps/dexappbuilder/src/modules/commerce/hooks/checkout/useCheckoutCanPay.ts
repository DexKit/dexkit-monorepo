import { DexkitApiProvider } from '@dexkit/core/providers';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';

export const GET_CHECKOUT_CAN_PAY_QUERY = 'GET_CHECKOUT_CAN_PAY_QUERY';

export default function useCheckoutCanPay(params: { owner?: string }) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery(
    [GET_CHECKOUT_CAN_PAY_QUERY, params],
    async () => {
      if (!instance) {
        throw new Error('no instance');
      }

      if (!params.owner) {
        return null;
      }

      return (await instance.get(`/checkouts/can-pay-owner/${params.owner}`))
        .data;
    },
    {
      refetchOnWindowFocus: 'always',
      refetchOnMount: 'always',
      staleTime: Infinity,
    },
  );
}
