import { DexkitApiProvider } from '@dexkit/core/providers';
import { useMutation } from '@tanstack/react-query';
import { useContext } from 'react';
import { CategoryType } from '../../types/index';

export default function useCreateCategory() {
  const { instance } = useContext(DexkitApiProvider);

  return useMutation(async (data: CategoryType) => {
    if (!instance) {
      throw new Error('no instance');
    }

    return (await instance?.post('/product-category/', data)).data;
  });
}
