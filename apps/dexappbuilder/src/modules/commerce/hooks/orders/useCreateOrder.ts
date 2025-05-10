import { DexkitApiProvider } from '@dexkit/core/providers';
import { useMutation } from '@tanstack/react-query';
import { useContext } from 'react';
import { CheckoutFormType } from '../../types';

export default function useCreateOrder() {
  const { instance } = useContext(DexkitApiProvider);

  return useMutation(async (data: CheckoutFormType) => {
    if (!instance) {
      throw new Error('no instance');
    }

    return (await instance?.post('/orders/', data)).data;
  });
}
