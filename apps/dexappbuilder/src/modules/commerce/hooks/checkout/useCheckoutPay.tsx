import { DexkitApiProvider } from '@dexkit/core/providers';
import { useMutation } from '@tanstack/react-query';
import React from 'react';

export default function useCheckoutPay() {
  const { instance } = { instance: null };

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

      return (await (instance as any).post(/*<Order>*/ `/checkouts/${id}/pay`, params))
        .data;
    },
  );
}
