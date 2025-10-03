import { DexkitApiProvider } from '@dexkit/core/providers';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { ProductFormType } from '../types';

export default function useCreateProduct() {
  const { instance } = { instance: null };

  return useMutation(async (data: ProductFormType) => {
    if (!instance) {
      throw new Error('no instance');
    }

    return (await (instance as any)?.post('/products/', data)).data;
  });
}
