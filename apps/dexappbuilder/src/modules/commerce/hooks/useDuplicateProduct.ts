import { DexkitApiProvider } from '@dexkit/core/providers';
import { useMutation } from '@tanstack/react-query';
import React from 'react';

export default function useDuplicateProduct() {
  const { instance } = { instance: null };

  return useMutation(async (data: { id: string }) => {
    if (!instance) {
      throw new Error('no instance');
    }

    return (await (instance as any)?.post(`/products/${data.id}/duplicate`)).data;
  });
}
