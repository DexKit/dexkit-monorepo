import { DexkitApiProvider } from '@dexkit/core/providers';
import { useMutation } from '@tanstack/react-query';
import { useContext } from 'react';
import { CheckoutNetworksUpdateType } from '../../types';

export default function useUpdateCheckoutNetworks() {
  const { instance } = useContext(DexkitApiProvider);

  return useMutation(async (data: CheckoutNetworksUpdateType) => {
    if (!instance) {
      throw new Error('no instance');
    }

    return (await instance.put('/checkouts-networks', data)).data;
  });
}
