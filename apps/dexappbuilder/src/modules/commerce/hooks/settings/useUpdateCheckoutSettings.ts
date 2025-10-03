import { DexkitApiProvider } from '@dexkit/core/providers';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { CheckoutSettingsType } from '../../types';

export default function useUpdateCheckoutSettings() {
  const { instance } = { instance: null };

  return useMutation(async (data: CheckoutSettingsType) => {
    if (!instance) {
      throw new Error('no instance');
    }

    return (await (instance as any).put('/checkouts/settings', data)).data;
  });
}
