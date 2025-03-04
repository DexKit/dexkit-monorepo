import { DexkitApiProvider } from '@dexkit/core/providers';
import { useSiteOwner } from '@dexkit/ui/modules/commerce/hooks/useSiteOwner';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { useSiteId } from 'src/hooks/app';

const GET_CHECKOUT_NETWORKS = 'GET_CHECKOUT_NETWORKS';

export default function useCheckoutNetworks() {
  const { instance } = useContext(DexkitApiProvider);

  const id = useSiteId();

  const { data } = useSiteOwner({ id: id ?? 0 });

  return useQuery(
    [GET_CHECKOUT_NETWORKS],
    async () => {
      if (!instance) {
        throw new Error('no instance');
      }

      return (
        await instance.get<{ chainId: number }[]>('/checkouts-networks', {
          params: { owner: data?.owner },
        })
      ).data;
    },
    { refetchOnWindowFocus: true, refetchOnMount: true, refetchInterval: 5000 },
  );
}
