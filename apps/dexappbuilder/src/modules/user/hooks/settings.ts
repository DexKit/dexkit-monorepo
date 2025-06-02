import { DexkitApiProvider } from '@dexkit/core/providers';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';

export const ADD_PAYMENT_INTENT_QUERY = 'ADD_PAYMENT_INTENT_QUERY';

export default function useAddPaymentIntent() {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery(
    [ADD_PAYMENT_INTENT_QUERY],
    async () => {
      const result = (
        await instance?.get<{ clientSecret: string }>(
          '/payments/add-method-intent',
        )
      )?.data;

      return result;
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );
}
