import { DexkitApiProvider } from '@dexkit/core/providers';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { CategoryType } from '../../types';

export default function useUpdateCategory() {
  const { instance } = { instance: null };

  return useMutation(async (data: CategoryType) => {
    if (!instance) {
      throw new Error('no instance');
    }

    return (await (instance as any)?.put(`/product-category/${data?.id}`, data)).data;
  });
}
