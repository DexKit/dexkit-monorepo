import { DexkitApiProvider } from '@dexkit/core/providers';
import { useMutation } from '@tanstack/react-query';
import { useContext } from 'react';
import { Order } from '../../types';

export default function useCheckoutPay() {
  const { instance } = useContext(DexkitApiProvider);

  return useMutation(
    async ({
      id,
      hash,
      tokenAddress,
      chainId,
      senderEmail,
      senderAddress,
      items,
    }: {
      id: string;
      hash: string;
      tokenAddress: string;
      chainId: number;
      senderEmail: string;
      senderAddress: string;
      items: { [key: string]: { quantity: number } };
    }) => {
      if (!instance) {
        throw new Error('no instance');
      }

      const params: any = {
        hash,
        tokenAddress,
        chainId,
        senderAddress,
        items,
      };

      if (senderEmail) {
        params.senderEmail = senderEmail;
      }

      return (await instance.post<Order>(`/checkouts/${id}/pay`, params)).data;
    },
  );
}
