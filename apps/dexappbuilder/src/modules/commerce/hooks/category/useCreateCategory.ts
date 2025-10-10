import { DexkitApiProvider } from '@dexkit/core/providers';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { CategoryType } from '../../types/index';

export default function useCreateCategory() {
  const { instance } = { instance: null };

  return useMutation(async (data: CategoryType) => {
    if (!instance) {
      throw new Error('no instance');
    }

    return (await (instance as any)?.post('/product-category/', data)).data;
  });
}
