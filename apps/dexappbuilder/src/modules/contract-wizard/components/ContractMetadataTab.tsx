import { useDexKitContext } from '@dexkit/ui';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { Box, CircularProgress, Grid } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import {
    useContract,
    useContractMetadata,
    useContractMetadataUpdate,
} from '@thirdweb-dev/react';
import { ContractMetadataFormType } from '../types';
import MetadataUpdateForm from './form/MetadataUpdateForm';

export interface ContractMetadataTabProps {
  address?: string;
}

export default function ContractMetadataTab({
  address,
}: ContractMetadataTabProps) {
  const { data: contract } = useContract(address);
  const updateMutationOld = useContractMetadataUpdate(contract);

  const contractMetadata = useContractMetadata(contract);

  const { watchTransactionDialog, createNotification } = useDexKitContext();

  const { chainId } = useWeb3React();

  const updateMutation = useMutation(
    async ({ values }: { values: ContractMetadataFormType }) => {
      let call = await contract?.metadata.update.prepare(values);

      let params = { contractName: contractMetadata.data?.name || '' };

      watchTransactionDialog.open('updateMetadata', params);

      let tx = await call?.send();

      if (tx?.hash && chainId) {
        createNotification({
          type: 'transaction',
          subtype: 'updateMetadata',
          values: params,
          metadata: { hash: tx.hash, chainId },
        });

        watchTransactionDialog.watch(tx.hash);
      }

      return await tx?.wait();
    },
  );

  const handleSubmit = async (values: ContractMetadataFormType) => {
    try {
      await updateMutation.mutateAsync({ values });
    } catch (err) {
      watchTransactionDialog.setError(err as any);
    }
  };

  if (!contractMetadata.isSuccess && !contractMetadata.data) {
    return (
      <Box sx={{ py: 4 }}>
        <Grid container justifyContent="center" alignItems="center">
          <Grid item>
            <CircularProgress color="primary" size="2rem" />
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <MetadataUpdateForm onSubmit={handleSubmit} data={contractMetadata.data} />
  );
}
