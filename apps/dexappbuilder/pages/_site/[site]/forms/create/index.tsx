import { useCreateFormMutation } from '@/modules/forms/hooks';
import { getFormTemplate } from '@/modules/forms/services';
import { FormTemplate } from '@/modules/forms/types';
import ContractForm from '@/modules/wizard/components/forms/ContractForm';
import { inputMapping } from '@/modules/wizard/utils';
import { ChainId } from '@dexkit/core';
import { NETWORKS } from '@dexkit/core/constants/networks';
import { DexkitApiProvider } from '@dexkit/core/providers';
import { parseChainId } from '@dexkit/core/utils';
import { isAddress } from '@dexkit/core/utils/ethers/isAddress';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import ContractFormView from '@dexkit/web3forms/components/ContractFormView';
import { ContractFormParams } from '@dexkit/web3forms/types';
import InfoIcon from '@mui/icons-material/Info';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  NoSsr,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import AppConfirmDialog from '@dexkit/ui/components/AppConfirmDialog';
import DKMDEditor from '@dexkit/ui/components/DKMDEditor';
import { myAppsApi } from '@dexkit/ui/constants/api';
import AuthMainLayout from 'src/components/layouts/authMain';
import { getAppConfig } from 'src/services/app';

export default function FormsCreatePage({
  contractAddress,
  abi,
  templateId,
  chainId,
  name,
  description,
}: {
  abi?: any[];
  contractAddress?: string;
  templateId?: number;
  chainId?: ChainId;
  name?: string;
  description?: string;
}) {
  const [params, setParams] = useState<ContractFormParams>({
    abi: abi || [],
    chainId: chainId !== undefined ? chainId : ChainId.Ethereum,
    contractAddress:
      contractAddress && isAddress(contractAddress) ? contractAddress : '',
    fields: abi ? inputMapping(abi) : {},
    disableProxy: false,
  });

  const [values, setValues] = useState({
    name: name || '',
    description: description || '',
  });

  const handleChange = (params: ContractFormParams) => {
    setParams(params);
  };

  const handleChangeInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((values: any) => ({ ...values, [e.target.name]: e.target.value }));
  };

  const [showConfirm, setShowConfirm] = useState(false);

  const handleShowConfirm = () => {
    setShowConfirm(true);
  };

  const handleCloseConfirm = () => {
    setShowConfirm(false);
  };

  const createFormMutation = useCreateFormMutation({
    templateId: templateId === null ? undefined : templateId,
  });

  const { account } = useWeb3React();

  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const router = useRouter();

  const handleConfirm = async () => {
    setShowConfirm(false);

    if (account && params && values.name && values.description) {
      try {
        let result = await createFormMutation.mutateAsync({
          name: values.name,
          description: values.description,
          creatorAddress: account,
          params,
        });

        enqueueSnackbar(
          formatMessage({
            id: 'form.created.successfully',
            defaultMessage: 'Form created successfully',
          }),
          { variant: 'success' },
        );

        router.push(`/forms/${result.id}`);
      } catch (err) {
        enqueueSnackbar(String(err), { variant: 'error' });
      }
    }
  };

  const hasVisibleFields = useMemo(() => {
    return (
      params !== undefined &&
      Object.keys(params.fields).filter((key) => params.fields[key].visible)
        .length > 0
    );
  }, [params]);

  const isFormInvalid = useMemo(() => {
    return (
      params?.contractAddress === '' ||
      params?.chainId === undefined ||
      params?.abi === undefined ||
      values.description === '' ||
      values.name === ''
    );
  }, [params, values]);

  return (
    <>
      <AppConfirmDialog
        DialogProps={{
          open: showConfirm,
          onClose: handleCloseConfirm,
          fullWidth: true,
          maxWidth: 'sm',
        }}
        title={
          <FormattedMessage id="create.form" defaultMessage="Create form" />
        }
        onConfirm={handleConfirm}
      >
        <Typography variant="body1">
          <FormattedMessage
            id="do.you.really.want.to.create.this.form"
            defaultMessage="Do you really want to create this form?"
          />
        </Typography>
      </AppConfirmDialog>
      <Backdrop
        open={createFormMutation.isLoading}
        sx={{ zIndex: (theme) => theme.zIndex.appBar + 30 }}
      >
        <CircularProgress color="primary" />
      </Backdrop>
      <Container>
        <Stack spacing={2}>
          <NoSsr>
            <PageHeader
              breadcrumbs={[
                {
                  caption: <FormattedMessage id="home" defaultMessage="Home" />,
                  uri: '/',
                },
                {
                  caption: (
                    <FormattedMessage
                      id="dexgenerator"
                      defaultMessage="DexGenerator"
                    />
                  ),
                  uri: '/forms',
                },
                {
                  caption: (
                    <FormattedMessage
                      id="manage.contract.forms"
                      defaultMessage="Manage Contract Forms"
                    />
                  ),
                  uri: '/forms',
                },
                {
                  caption: (
                    <FormattedMessage
                      id="create.contract.form"
                      defaultMessage="Create Contract Form"
                    />
                  ),
                  uri: `/forms/create`,
                  active: true,
                },
              ]}
            />
          </NoSsr>
          <Box>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                  <FormattedMessage
                    id="create.your.contract.form"
                    defaultMessage="Create your contract form"
                  />
                </Typography>
                <Button
                  disabled={createFormMutation.isLoading || isFormInvalid}
                  onClick={handleShowConfirm}
                  variant="contained"
                  size="large"
                  sx={{
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    px: 4,
                    py: 1.5
                  }}
                >
                  <FormattedMessage
                    id="create.contract.form"
                    defaultMessage="CREATE CONTRACT FORM"
                  />
                </Button>
              </Box>

              <Box>
                <Stack 
                  direction={{ xs: 'column', md: 'row' }} 
                  spacing={3}
                  alignItems="flex-start"
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack spacing={3}>
                      <TextField
                        fullWidth
                        disabled={createFormMutation.isLoading}
                        required
                        name="name"
                        value={values.name}
                        onChange={handleChangeInputs}
                        label={
                          <FormattedMessage id="name" defaultMessage="Name" />
                        }
                        sx={{ maxWidth: 400 }}
                      />

                      <FormControl fullWidth>
                        <FormLabel component="legend" required sx={{ mb: 1, fontWeight: 'bold' }}>
                          <FormattedMessage
                            id="description"
                            defaultMessage="Description"
                          />
                        </FormLabel>
                        <Box
                          sx={{
                            border: (theme) => `1px solid ${theme.palette.divider}`,
                            borderRadius: 1,
                            '& .w-md-editor': {
                              backgroundColor: 'transparent',
                            },
                            '& .w-md-editor-text-pre, & .w-md-editor-text-input, & .w-md-editor-text': {
                              fontSize: '14px !important',
                              lineHeight: '1.4375em !important',
                            },
                          }}
                        >
                          <DKMDEditor
                            value={values.description || ""}
                            setValue={(val) => setValues((values: any) => ({
                              ...values,
                              description: val || ""
                            }))}
                          />
                        </Box>
                        <FormHelperText>
                          <FormattedMessage
                            id="description.markdown.helper"
                            defaultMessage="You can use markdown formatting for rich text descriptions"
                          />
                        </FormHelperText>
                      </FormControl>

                      <Box>
                        {isAddress(params?.contractAddress || '') ? (
                          <ContractForm
                            key={contractAddress as string}
                            updateOnChange
                            params={params}
                            onChange={handleChange}
                            onSave={handleChange}
                            fetchOnMount
                          />
                        ) : (
                          <ContractForm
                            key={'another'}
                            updateOnChange
                            params={params}
                            onSave={handleChange}
                            onChange={handleChange}
                          />
                        )}
                      </Box>
                    </Stack>
                  </Box>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack spacing={2}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        <FormattedMessage id="preview" defaultMessage="Preview" />
                      </Typography>
                      {hasVisibleFields && params ? (
                        <ContractFormView
                          params={params}
                          key={String(params.abi)}
                        />
                      ) : (
                        <Paper sx={{ p: 4, minHeight: 300 }}>
                          <Stack
                            justifyContent="center"
                            alignItems="center"
                            spacing={2}
                            sx={{ height: '100%', minHeight: 200 }}
                          >
                            <InfoIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                            <Box textAlign="center">
                              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                <FormattedMessage
                                  id="form.preview"
                                  defaultMessage="Form Preview"
                                />
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                <FormattedMessage
                                  id="make.at.least.one.form.field.visible.to.see.a.preview"
                                  defaultMessage="Make at least one form field visible to see a preview"
                                />
                              </Typography>
                            </Box>
                          </Stack>
                        </Paper>
                      )}
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </>
  );
}

(FormsCreatePage as any).getLayout = function getLayout(page: any) {
  return (
    <AuthMainLayout>
      <DexkitApiProvider.Provider value={{ instance: myAppsApi }}>
        {page}
      </DexkitApiProvider.Provider>
    </AuthMainLayout>
  );
};

type Params = {
  site?: string;
  contractAddress?: string;
  templateId?: string;
};

export const getServerSideProps: GetServerSideProps = async ({
  query,
  params,
}: GetServerSidePropsContext<Params>) => {
  const queryClient = new QueryClient();
  const configResponse = await getAppConfig(params?.site, 'no-page-defined');

  const templateId = query.templateId
    ? parseInt(query.templateId as string)
    : undefined;

  let abi: any[] = [];
  let name = '';
  let description = '';

  if (templateId !== undefined) {
    let template = await (async () => {
      if (!query.templateId) {
        return null;
      }

      const data = (
        await getFormTemplate({
          id: templateId,
        })
      ).data;

      return {
        creatorAddress: data.creatorAddress ? data.creatorAddress : null,
        abi: JSON.parse(data.abi),
        bytecode: data.bytecode ? data.bytecode : null,
        description: data.description ? data.description : null,
        name: data.name ? data.name : null,
      } as FormTemplate;
    })();

    name = template?.name || '';
    description = template?.description || '';
    abi = template?.abi || [];
  }

  const chainId = parseChainId((query.chainId as string) || ChainId.Ethereum);

  const isValidChain = Object.keys(NETWORKS)
    .map((key) => parseChainId(key))
    .includes(chainId);

  return {
    props: {
      contractAddress: query.contractAddress ? query.contractAddress : null,
      abi: abi ? abi : null,
      chainId: query.chainId && isValidChain ? chainId : ChainId.Ethereum,
      name: name ? name : null,
      description: description ? description : null,
      templateId: templateId ? templateId : null,
      dehydratedState: dehydrate(queryClient),
      ...configResponse,
    },
  };
};
