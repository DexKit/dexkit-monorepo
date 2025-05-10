import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { EvmTokenList } from '../types';

export const EVM_TOKEN_LIST_QUERY = 'EVM_TOKEN_LIST_QUERY';

export function useEvmTokenList({ list }: { list?: EvmTokenList }) {
  return useQuery(
    [EVM_TOKEN_LIST_QUERY, list?.url],
    async () => {
      if (!list) {
        throw new Error('no list selected');
      }

      return (await axios.get(list.url)).data;
    },
    { enabled: Boolean(list) }
  );
}
