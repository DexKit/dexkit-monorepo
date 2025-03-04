import {
  Alert,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  FormControl,
  Grid,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { FormikHelpers, getIn, useFormik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import * as Yup from 'yup';

import { ImageFormUpload } from '@/modules/contract-wizard/components/ImageFormUpload';
import { isAddress } from '@dexkit/core/utils/ethers/isAddress';
import { useSnackbar } from 'notistack';

import { NETWORKS } from '../../../../constants/chain';

import { Token } from '../../../../types/blockchain';

import { useDebounce } from '@dexkit/core';
import { parseChainId } from '@dexkit/core/utils';
import { ipfsUriToUrl } from '@dexkit/core/utils/ipfs';
import { useTokenData } from '@dexkit/ui';
import { AppDialogTitle } from '@dexkit/ui/components/AppDialogTitle';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { AxiosError } from 'axios';
import { SearchMultiTokenAutocomplete } from '../pageEditor/components/SearchMultiTokenAutocomplete';

interface Props {
  dialogProps: DialogProps;
  tokens: Token[];
  onSave: (tokens: Token[]) => void;
}

interface Form {
  type: string;
  chainId: number;
  tokens?: Token[];
}

const FormSchema: Yup.SchemaOf<Form> = Yup.object().shape({
  type: Yup.string().required(),
  chainId: Yup.number().required(),
  tokens: Yup.array()
    .of(
      Yup.object().shape({
        address: Yup.string()
          .test('address', (value) => {
            return value !== undefined ? isAddress(value) : true;
          })
          .required(),

        name: Yup.string().required(),
        symbol: Yup.string().required(),
        decimals: Yup.number().required(),
        logoURI: Yup.string(),
      }),
    )
    .optional(),
});

function AddTokenDialog({ dialogProps, tokens, onSave }: Props) {
  const { onClose } = dialogProps;

  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [autocompleteToken, setAutoCompleteToken] = useState<any>();

  const handleSubmit = useCallback(
    (values: Form, formikHelpers: FormikHelpers<Form>) => {
      if (values.tokens) {
        onSave(values.tokens);

        enqueueSnackbar(
          formatMessage({
            defaultMessage: 'Token added',
            id: 'token.added',
          }),
          {
            variant: 'success',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'right',
            },
          },
        );
      }

      formikHelpers.resetForm();

      if (onClose) {
        onClose({}, 'escapeKeyDown');
      }
    },
    [String(tokens), enqueueSnackbar, onClose],
  );

  const { chainId } = useWeb3React();

  const formik = useFormik<Form>({
    initialValues: {
      type: 'via-api',
      chainId,
    },
    validationSchema: FormSchema,
    onSubmit: handleSubmit,
  });

  const handleSubmitForm = () => {
    formik.submitForm();
  };

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
    formik.resetForm();
  };

  const lazyAddress = useDebounce(
    getIn(formik.values, 'tokens[0].address'),
    500,
  );

  const tokenData = useTokenData({
    onSuccess: ({
      decimals,
      name,
      symbol,
    }: {
      decimals: number;
      name: string;
      symbol: string;
    }) => {
      formik.setFieldValue(
        'tokens.0',
        {
          address: lazyAddress,
          chainId: getIn(formik.values, 'chainId'),
          decimals,
          name,
          symbol,
        } as Token,
        true,
      );
    },
    onError: (err: AxiosError) => {},
  });

  useEffect(() => {
    const address = getIn(formik.values, 'tokens.0.address');

    if (formik.values.type === 'contract-address' && isAddress(address)) {
      tokenData.mutate({
        address: getIn(formik.values, 'tokens.0.address'),
        chainId: formik.values.chainId,
      });
    }
  }, [lazyAddress, formik.values.type]);

  const renderViaApi = () => {
    return (
      <Stack spacing={2}>
        <SearchMultiTokenAutocomplete
          data={autocompleteToken}
          chainId={formik.values.chainId}
          value={formik.values.tokens ?? []}
          onChange={(value: Token[]) => {
            formik.setFieldValue('tokens', value);
          }}
        />
      </Stack>
    );
  };

  const renderViaContractAddress = () => {
    return (
      <Stack spacing={2}>
        <TextField
          fullWidth
          value={getIn(formik.values, 'tokens[0].address')}
          onChange={formik.handleChange}
          name="tokens[0].address"
          label={formatMessage({
            id: 'contract.address',
            defaultMessage: 'Contract address',
          })}
          error={Boolean(getIn(formik.errors, 'tokens[0].address'))}
          helperText={
            Boolean(getIn(formik.errors, 'tokens[0].address'))
              ? getIn(formik.errors, 'tokens[0].address')
              : undefined
          }
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          disabled={tokenData.isLoading || tokenData.isSuccess}
          fullWidth
          value={getIn(formik.values, 'tokens[0].name')}
          onChange={formik.handleChange}
          name="tokens[0].name"
          label={formatMessage({
            id: 'name',
            defaultMessage: 'Name',
          })}
          InputLabelProps={{ shrink: true }}
          error={Boolean(getIn(formik.errors, 'tokens[0].name'))}
          helperText={
            Boolean(getIn(formik.errors, 'tokens[0].name'))
              ? getIn(formik.errors, 'tokens[0].name')
              : undefined
          }
        />
        <TextField
          disabled={tokenData.isLoading || tokenData.isSuccess}
          fullWidth
          value={getIn(formik.values, 'tokens[0].symbol')}
          onChange={formik.handleChange}
          name="tokens[0].symbol"
          label={formatMessage({
            id: 'symbol',
            defaultMessage: 'Symbol',
          })}
          InputLabelProps={{ shrink: true }}
          error={Boolean(getIn(formik.errors, 'tokens[0].symbol'))}
          helperText={
            Boolean(getIn(formik.errors, 'tokens[0].symbol'))
              ? getIn(formik.errors, 'tokens[0].symbol')
              : undefined
          }
        />
        <TextField
          type="number"
          fullWidth
          disabled={tokenData.isLoading || tokenData.isSuccess}
          value={getIn(formik.values, 'tokens[0].decimals')}
          onChange={formik.handleChange}
          name="decimals"
          label={formatMessage({
            id: 'decimals',
            defaultMessage: 'Decimals',
          })}
          InputLabelProps={{ shrink: true }}
          error={Boolean(getIn(formik.errors, 'tokens[0].decimals'))}
          helperText={
            Boolean(getIn(formik.errors, 'tokens[0].decimals'))
              ? getIn(formik.errors, 'tokens[0].decimals')
              : undefined
          }
        />
        <Stack spacing={2}>
          <Box pl={2}>
            <Typography variant="caption">
              <FormattedMessage id="logo" defaultMessage="Logo" />
            </Typography>
          </Box>
          <ImageFormUpload
            error={Boolean(getIn(formik.errors, 'tokens[0].logoURI'))}
            value={getIn(formik.values, 'tokens[0].logoURI') || null}
            onSelectFile={(file) =>
              formik.setFieldValue('tokens[0].logoURI', file)
            }
            imageHeight={10}
            imageWidth={10}
          />
        </Stack>
      </Stack>
    );
  };

  return (
    <Dialog {...dialogProps} maxWidth="sm" fullWidth>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="import.token"
            defaultMessage="Import Token"
            description="Import token dialog title"
          />
        }
        onClose={handleClose}
        titleBox={{ px: 2, py: 0 }}
      />
      <DialogContent dividers sx={{ py: 2, px: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box mb={2}>
              <Alert severity="info">
                <FormattedMessage
                  id="search.for.tokens.with.our.api.or.import.them.using.the.contract.address."
                  defaultMessage={
                    'Search for tokens with our API or import them using the contract address.'
                  }
                />
              </Alert>
              {tokenData.isError && (
                <Alert severity="error" onClose={() => tokenData.reset()}>
                  {String(tokenData.error)}
                </Alert>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sm={9}>
            <Box>
              <Stack spacing={2}>
                <FormControl>
                  <InputLabel>
                    <FormattedMessage
                      id="choose.an.option"
                      defaultMessage="Choose an option"
                    />
                  </InputLabel>
                  <Select
                    value={formik.values.type}
                    onChange={formik.handleChange}
                    name="type"
                    label={
                      <FormattedMessage
                        id="choose.an.option"
                        defaultMessage="Choose an option"
                      />
                    }
                  >
                    <MenuItem value="via-api">
                      <FormattedMessage
                        id="search.via.api"
                        defaultMessage="Search via API"
                      />
                    </MenuItem>
                    <MenuItem value="contract-address">
                      <FormattedMessage
                        id="import.via.address"
                        defaultMessage="Import via address"
                      />
                    </MenuItem>
                  </Select>
                </FormControl>
                <FormControl>
                  <InputLabel>
                    <FormattedMessage id="network" defaultMessage="Network" />
                  </InputLabel>
                  <Select
                    fullWidth
                    value={formik.values.chainId}
                    onChange={(e) => {
                      formik.setFieldValue('tokens', []);
                      formik.setFieldValue('chainId', e.target.value);
                    }}
                    label={
                      <FormattedMessage id="network" defaultMessage="Network" />
                    }
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
                            src={ipfsUriToUrl(NETWORKS[value]?.imageUrl || '')}
                            style={{ width: 'auto', height: '1rem' }}
                          />
                          <Typography variant="body1">
                            {NETWORKS[value]?.name}
                          </Typography>
                        </Stack>
                      );
                    }}
                  >
                    {Object.keys(NETWORKS)
                      .filter((key: any) => !NETWORKS[key].testnet)
                      .map((key) => NETWORKS[parseChainId(key)])
                      .sort((a, b) => {
                        return a.name.localeCompare(b.name);
                      })
                      .map((net, index: number) => (
                        <MenuItem key={index} value={net.chainId}>
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
                                src={ipfsUriToUrl(net?.imageUrl || '')}
                                sx={{
                                  width: 'auto',
                                  height: '1rem',
                                }}
                              />
                            </Box>
                          </ListItemIcon>
                          <ListItemText primary={net.name} />
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                {formik.values.type === 'via-api' && renderViaApi()}
                {formik.values.type === 'contract-address' &&
                  renderViaContractAddress()}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 4, py: 2 }}>
        <Button onClick={handleClose}>
          <FormattedMessage
            id="cancel"
            defaultMessage="Cancel"
            description="Cancel"
          />
        </Button>

        <Button
          disabled={!formik.isValid}
          onClick={handleSubmitForm}
          variant="contained"
          color="primary"
        >
          <FormattedMessage
            id="import"
            defaultMessage="Import"
            description="Import"
          />
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddTokenDialog;
