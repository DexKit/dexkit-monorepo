import { AppDialogTitle } from '@dexkit/ui/components';
import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogContent,
    DialogProps,
    Divider,
    Grid,
    Stack,
    Typography,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';

import { ChainId } from '@dexkit/core';
import { getBlockExplorerUrl } from '@dexkit/core/utils';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import ContractDeployForm from '@dexkit/web3forms/components/ContractDeployForm';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useState } from 'react';
import { useSaveInstanceMutation } from '../hooks';

export interface DeployContractDialogProps {
  DialogProps: DialogProps;
  abi: any[];
  bytecode: string;
  templateId?: number;
  name?: string;
  description?: string;
}

export default function DeployContractDialog({
  DialogProps,
  abi,
  bytecode,
  templateId,
  name,
  description,
}: DeployContractDialogProps) {
  const { onClose } = DialogProps;

  const { chainId } = useWeb3React();
  const [contractAddress, setContractAddress] = useState<string>();
  const [tx, setTx] = useState<string>();
  const [deployChainId, setDeployChainId] = useState<ChainId>();

  const handleReset = () => {
    setContractAddress(undefined);
    setTx(undefined);
    setDeployChainId(undefined);
  };

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'escapeKeyDown');
    }

    handleReset();
  };

  const saveInstanceMutation = useSaveInstanceMutation();

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="deploy.contract.template"
            defaultMessage="Deploy Contract Template"
          />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent>
        <Grid container spacing={2}>
          {contractAddress && deployChainId && templateId && tx ? (
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Stack spacing={2} justifyContent="center">
                    <Stack direction="row" justifyContent="center">
                      <CheckCircleIcon color="success" />
                    </Stack>
                    <Box>
                      <Typography align="center" variant="h5">
                        <FormattedMessage
                          id="contract.deployed"
                          defaultMessage="Contract deployed"
                        />
                      </Typography>
                      <Typography
                        align="center"
                        color="text.secondary"
                        variant="body1"
                      >
                        <FormattedMessage
                          id="create.a.form.to.interact.with.your.new.contract"
                          defaultMessage="Create a form to interact with your new contract"
                        />
                      </Typography>
                    </Box>
                    <Button
                      href={`/forms/create?contractAddress=${contractAddress}&templateId=${templateId}&chainId=${deployChainId}`}
                      target="_blank"
                      variant="contained"
                    >
                      <FormattedMessage
                        id="create.form"
                        defaultMessage="Create form"
                      />
                    </Button>
                    <Button
                      href={`${getBlockExplorerUrl(chainId)}/tx/${tx}`}
                      target="_blank"
                      variant="outlined"
                    >
                      <FormattedMessage
                        id="view.transaction"
                        defaultMessage="View transaction"
                      />
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ) : (
            <Grid item xs={12}>
              <ContractDeployForm
                abi={abi}
                contractType=""
                contractBytecode={bytecode}
                onContractCreated={async (contract) => {
                  setContractAddress(contract.address);
                  setTx(contract.deployTransaction.hash);
                  setDeployChainId(chainId);

                  if (chainId !== undefined && templateId) {
                    await saveInstanceMutation.mutateAsync({
                      chainId,
                      contractAddress: contract.address,
                      templateId,
                      name: name || '',
                      description: description || '',
                    });
                  }
                }}
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
