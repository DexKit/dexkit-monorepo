import { ChainId } from '@dexkit/core';
import { AbiFragment, ContractFormParams } from '@dexkit/web3forms/types';
import { useFormikContext } from 'formik';

export default function ContractFormAbiFetcher({
  contractAddress,
  onSuccess,
  onStatus,
  chainId,
  enabled,
}: {
  contractAddress: string;
  onSuccess: (abi: AbiFragment[]) => void;
  onStatus: (loading: boolean) => void;
  chainId: ChainId;
  enabled: boolean;
}) {
  const { values, setFieldValue } = useFormikContext<ContractFormParams>();

  // useEffect(() => {
  //   onStatus(scanContractAbiQuery.isLoading);
  // }, [scanContractAbiQuery.isLoading, onStatus]);

  return null;
}
