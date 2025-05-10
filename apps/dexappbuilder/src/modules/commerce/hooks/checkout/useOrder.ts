import { useQuery } from 'react-query';

export default function useOrder({ id }: { id: string }) {
  return useQuery([], async () => {});
}
