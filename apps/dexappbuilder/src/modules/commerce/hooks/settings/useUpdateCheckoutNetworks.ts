import { DexkitApiProvider } from '@dexkit/core/providers';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { CheckoutNetworksUpdateType } from '../../types';

export default function useUpdateCheckoutNetworks() {
  const { instance } = { instance: null };

  return useMutation(async (data: CheckoutNetworksUpdateType) => {
    if (!instance) {
      throw new Error('no instance');
    }

    return (await (instance as any).put('/checkouts-networks', data)).data;
  });
}
