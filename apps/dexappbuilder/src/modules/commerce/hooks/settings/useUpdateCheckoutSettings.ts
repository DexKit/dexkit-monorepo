import { DexkitApiProvider } from '@dexkit/core/providers';
import { useMutation } from '@tanstack/react-query';
import { useContext } from 'react';
import { CheckoutSettingsType } from '../../types';

export default function useUpdateCheckoutSettings() {
  const { instance } = useContext(DexkitApiProvider);

  return useMutation(async (data: CheckoutSettingsType) => {
    if (!instance) {
      throw new Error('no instance');
    }

    return (await instance.put('/checkouts/settings', data)).data;
  });
}
