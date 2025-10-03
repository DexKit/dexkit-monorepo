import { DexkitApiProvider } from '@dexkit/core/providers';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { CheckoutFormType } from '../../types';

export default function useUpdateOrder() {
  const { instance } = { instance: null };

  return useMutation(async (data: CheckoutFormType) => {
    if (!instance) {
      throw new Error('no instance');
    }

    return (await (instance as any)?.put(`/orders/${data?.id}`, data)).data;
  });
}
