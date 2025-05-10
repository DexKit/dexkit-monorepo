import { DexkitApiProvider } from '@dexkit/core/providers';
import { useMutation } from '@tanstack/react-query';
import { useContext } from 'react';

export default function useFinalizeOrder() {
  const { instance } = useContext(DexkitApiProvider);

  return useMutation(async (params: { id: string }) => {
    if (!instance) {
      throw new Error('no instance');
    }

    return (await instance.post(`/orders/${params.id}/finalize`)).data;
  });
}
