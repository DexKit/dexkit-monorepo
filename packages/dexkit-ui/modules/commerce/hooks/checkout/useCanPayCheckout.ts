import { DexkitApiProvider } from '@dexkit/core/providers';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';

export const GET_CAN_PAY_CHECKOUT_QUERY = 'GET_CAN_PAY_CHECKOUT_QUERY';

export default function useCanPayCheckout({ siteId }: { siteId?: number }) {



  const { instance } = useContext(DexkitApiProvider);

  return useQuery(
    [GET_CAN_PAY_CHECKOUT_QUERY, siteId],
    async () => {
      if (!instance) {
        throw new Error('no instance');
      }

      if (!siteId) {
        return { canPay: false };
      }

      return (await instance.get(`/checkouts/can-pay/${siteId}`))
        .data as { canPay: boolean };
    },
    {
      refetchOnWindowFocus: 'always',
      refetchOnMount: 'always',
      staleTime: Infinity,
    },
  );
}
