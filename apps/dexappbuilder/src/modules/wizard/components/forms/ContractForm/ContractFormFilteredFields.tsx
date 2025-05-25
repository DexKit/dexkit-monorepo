import { AbiFragment } from '@dexkit/web3forms/types';
import { useMemo } from 'react';
import ContractFormFieldsRow from './ContractFormFieldsRow';

export interface Props {
  abi: AbiFragment[];
  query: string;
  fieldVisibility: string;
  selectedTab: string;
}

export default function ContractFormFilteredFields({
  abi,
  query,
  fieldVisibility,
  selectedTab,
}: Props) {
  const filteredAbi = useMemo(() => {
    if (abi.length > 0) {
      let result: AbiFragment[] = abi?.filter((f) => f.type === 'function');

      if (query) {
        result = result.filter((f) => {
          if (f.name) {
            return f.name.toLowerCase().search(query.toLowerCase()) > -1;
          }
          return false;
        });
      }

      if (selectedTab === 'write') {
        result = result.filter(
          (f) =>
            f.stateMutability === 'nonpayable' ||
            f.stateMutability === 'payable'
        );
      } else if (selectedTab === 'read') {
        result = result.filter((f) => f.stateMutability === 'view');
      }

      return result;
    }

    return [];
  }, [abi]);

  return <ContractFormFieldsRow abi={filteredAbi} />;
}
