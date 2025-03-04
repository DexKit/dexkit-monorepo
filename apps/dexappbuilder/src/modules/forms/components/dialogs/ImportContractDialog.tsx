import { Network } from '@dexkit/core/types';
import { ipfsUriToUrl, parseChainId } from '@dexkit/core/utils';
import { AppDialogTitle, useDexKitContext } from '@dexkit/ui';
import { hexToString } from '@dexkit/ui/utils';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  FormControl,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';

import { isAddress } from 'ethers/lib/utils';
import { Field, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { FormattedMessage } from 'react-intl';
import { NETWORKS } from 'src/constants/chain';

import { ChainId } from '@dexkit/core';
import { getProviderByChainId } from '@dexkit/core/utils/blockchain';
import { Contract } from 'ethers';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import { useImportContract } from '../../hooks';

const Schema = Yup.object({
  contractAddress: Yup.string().test('address', (value) => {
    return value !== undefined ? isAddress(value) : true;
  }),
  chainId: Yup.number(),
  name: Yup.string(),
});

export interface ImportContractDialogProps {
  DialogProps: DialogProps;
}

export default function ImportContractDialog({
  DialogProps,
}: ImportContractDialogProps) {
  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  const { chainId } = useWeb3React();

  const { mutateAsync: importContract } = useImportContract();

  const { affiliateReferral } = useDexKitContext();

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (values: {
    chainId: ChainId;
    contractAddress: string;
    name: string;
  }) => {
    const provider = getProviderByChainId(chainId);

    const contract = new Contract(
      values.contractAddress,
      [
        {
          inputs: [],
          name: 'contractType',
          outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
          stateMutability: 'pure',
          type: 'function',
        },
      ],
      provider,
    );

    let contractTypeHex = '';

    try {
      contractTypeHex = await contract.contractType();
    } catch (err) {}

    let contractType = '';

    if (contractTypeHex) {
      contractType = hexToString(contractTypeHex);
    } else {
      contractType = 'custom';
    }

    try {
      await importContract({
        chainId: parseChainId(values.chainId),
        contractAddress: values.contractAddress,
        name: values.name,
        type: contractType,
        referral: affiliateReferral,
      });

      enqueueSnackbar(
        <FormattedMessage
          id="contract.imported"
          defaultMessage="Contract imported"
        />,
        { variant: 'success' },
      );

      handleClose();
    } catch (err) {
      enqueueSnackbar(
        <FormattedMessage
          id="error.while.import"
          defaultMessage="Error while import"
        />,
        { variant: 'error' },
      );
    }
  };

  return (
    <Dialog {...DialogProps}>
      {chainId && (
        <Formik
          initialValues={{
            contractAddress: '',
            chainId: chainId,
            name: '',
          }}
          onSubmit={handleSubmit}
          validationSchema={Schema}
        >
          {({ values, handleChange, submitForm }) => (
            <>
              <AppDialogTitle
                title={
                  <FormattedMessage
                    id="import.contract"
                    defaultMessage="Import contract"
                  />
                }
                sx={{ px: 4 }}
                onClose={handleClose}
              />
              <DialogContent sx={{ p: 4 }} dividers>
                <Stack spacing={2}>
                  <FormControl>
                    <Select
                      fullWidth
                      value={values.chainId}
                      onChange={handleChange}
                      name="chainId"
                      renderValue={(value) => {
                        return (
                          <Stack
                            direction="row"
                            alignItems="center"
                            alignContent="center"
                            spacing={1}
                          >
                            <Avatar
                              src={ipfsUriToUrl(
                                NETWORKS[values.chainId].imageUrl || '',
                              )}
                              style={{ width: 'auto', height: '1rem' }}
                            />
                            <Typography variant="body1">
                              {NETWORKS[values.chainId].name}
                            </Typography>
                          </Stack>
                        );
                      }}
                    >
                      {Object.keys(NETWORKS)
                        .filter((key: any) => !NETWORKS[key].testnet)
                        .map((key: any, index: number) => (
                          <MenuItem key={index} value={key}>
                            <ListItemIcon>
                              <Box
                                sx={{
                                  width: (theme) => theme.spacing(4),
                                  display: 'flex',
                                  alignItems: 'center',
                                  alignContent: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Avatar
                                  src={ipfsUriToUrl(
                                    (NETWORKS[key] as Network)?.imageUrl || '',
                                  )}
                                  sx={{
                                    width: 'auto',
                                    height: '1rem',
                                  }}
                                />
                              </Box>
                            </ListItemIcon>
                            <ListItemText primary={NETWORKS[key].name} />
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                  <Field
                    component={TextField}
                    name="contractAddress"
                    label={
                      <FormattedMessage
                        id="contract.address"
                        defaultMessage="Contract address"
                      />
                    }
                    fullWidth
                  />
                  <Field
                    component={TextField}
                    name="name"
                    label={<FormattedMessage id="name" defaultMessage="Name" />}
                    fullWidth
                  />
                </Stack>
              </DialogContent>
              <DialogActions sx={{ py: 2, px: 4 }}>
                <Button onClick={handleClose}>
                  <FormattedMessage id="cancel" defaultMessage="Cancel" />
                </Button>
                <Button onClick={submitForm} type="submit" variant="contained">
                  <FormattedMessage id="import" defaultMessage="Import" />
                </Button>
              </DialogActions>
            </>
          )}
        </Formik>
      )}
    </Dialog>
  );
}
