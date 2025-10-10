import { DexkitApiProvider } from '@dexkit/core/providers';
import { useMutation } from '@tanstack/react-query';
import React from 'react';

export default function useFinalizeOrder() {
  const { instance } = { instance: null };

  return useMutation(async (params: { id: string }) => {
    if (!instance) {
      throw new Error('no instance');
    }

    return (await (instance as any).post(`/orders/${params.id}/finalize`)).data;
  });
}
