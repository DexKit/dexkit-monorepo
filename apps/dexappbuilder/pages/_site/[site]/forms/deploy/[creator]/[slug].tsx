import GenericForm from '@dexkit/web3forms/components/GenericForm';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  Link,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import AuthMainLayout from 'src/components/layouts/authMain';

import { ReactNode, useCallback, useEffect, useState } from 'react';

import { myAppsApi } from '@/modules/admin/dashboard/dataProvider';
import { DexkitApiProvider } from '@dexkit/core/providers';

import { useSaveContractDeployed } from '@/modules/forms/hooks';
import { ChainId } from '@dexkit/core';
import { NETWORKS, NETWORK_SLUG } from '@dexkit/core/constants/networks';
import {
  getBlockExplorerUrl,
  getNormalizedUrl,
  parseChainId,
  truncateAddress,
} from '@dexkit/core/utils';
import {
  AppDialogTitle,
  useActiveChainIds,
  useDexKitContext,
  useSwitchNetworkMutation,
} from '@dexkit/ui';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import useThirdwebContractMetadataQuery, {
  useDeployThirdWebContractMutation,
  useFormConfigParamsQuery,
} from '@dexkit/web3forms/hooks';
import { useTrustedForwarders } from '@dexkit/web3forms/hooks/useTrustedForwarders';
import CheckCircle from '@mui/icons-material/CheckCircle';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import {
  GetStaticPaths,
  GetStaticPathsContext,
  GetStaticProps,
  GetStaticPropsContext,
} from 'next';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { FormattedMessage, useIntl } from 'react-intl';
import { THIRDWEB_CLIENT_ID } from 'src/constants';
import { getAppConfig } from 'src/services/app';

export default function DeployPage() {
  const { chainId } = useWeb3React();
  const { activeChainIds } = useActiveChainIds();

  const { query } = useRouter();

  const { slug, creator } = query;

  const switchNetworkMutation = useSwitchNetworkMutation();

  const [selectedChainId, setSelectedChainId] = useState<ChainId>(
    ChainId.Ethereum,
  );

  useEffect(() => {
    if (chainId) {
      setSelectedChainId(chainId);
    }
  }, [chainId]);

  const hasChainDiff =
    selectedChainId !== undefined &&
    chainId !== undefined &&
    chainId !== selectedChainId;

  const thirdWebDeployMutation = useDeployThirdWebContractMutation({
    clientId: THIRDWEB_CLIENT_ID,
  });

  const thirdwebMetadataQuery = useThirdwebContractMetadataQuery({
    id: slug as string,
    clientId: THIRDWEB_CLIENT_ID,
    creator: creator as string,
  });

  const formConfigParamsQuery = useFormConfigParamsQuery({
    contract: slug as string,
    creator: creator as string,
  });

  const saveContractDeployedMutation = useSaveContractDeployed();

  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const [showLoading, setShowLoading] = useState(false);

  const { affiliateReferral } = useDexKitContext();

  const handleSubmit = useCallback(
    async (values: any, formValues: any) => {
      const params = values['params'];

      if (hasChainDiff) {
        try {
          await switchNetworkMutation.mutateAsync({
            chainId: selectedChainId,
          });

          enqueueSnackbar(
            formatMessage({
              id: 'network.switched',
              defaultMessage: 'Network changed',
            }),
            { variant: 'success' },
          );

          return;
        } catch (err) {
          enqueueSnackbar(
            formatMessage({
              id: 'error.while.switching.network',
              defaultMessage: 'Error while switching network',
            }),
            { variant: 'error' },
          );
        }
      }

      if (!formConfigParamsQuery.data || !thirdwebMetadataQuery.data) {
        return;
      }

      setShowLoading(true);

      const metadata = thirdwebMetadataQuery.data;

      try {
        let result = await thirdWebDeployMutation.mutateAsync({
          chainId: selectedChainId,
          order: formConfigParamsQuery.data?.paramsOrder,
          params,
          metadata,
        });

        if (result) {
          setContractAddress(result.address);

          const name = params['name'] || formValues?.name;

          if (chainId) {
            saveContractDeployedMutation.mutateAsync({
              contractAddress: result.address,
              createdAtTx: result.tx,
              name,
              chainId,
              type: slug as string,
              referral: affiliateReferral,
              metadata: {
                name: formValues?.name,
                symbol: formValues?.symbol,
                image: formValues?.image,
                description: formValues?.description,
              },
            });
          }

          setShowSuccess(true);
        }

        enqueueSnackbar(
          formatMessage({
            id: 'contract.deployed.successfully',
            defaultMessage: 'Contract deployed successfully',
          }),
          { variant: 'success' },
        );
      } catch (err) {
        enqueueSnackbar(
          formatMessage({
            id: 'error.while.deploying.contract',
            defaultMessage: 'Error while deploying contract',
          }),
          { variant: 'error' },
        );
      }

      setShowLoading(false);
    },
    [
      formConfigParamsQuery.data,
      thirdwebMetadataQuery.data,
      selectedChainId,
      hasChainDiff,
      affiliateReferral,
    ],
  );

  const [contractAddress, setContractAddress] = useState<string>();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setContractAddress(undefined);
  };

  const handleChangeChainId = (
    event: SelectChangeEvent<number>,
    child: ReactNode,
  ) => {
    setSelectedChainId(parseChainId(event.target.value));
  };

  const { data: trustedForwarders } = useTrustedForwarders({
    clientId: THIRDWEB_CLIENT_ID,
  });

  return (
    <>
      <Dialog open={showLoading} fullWidth maxWidth="sm">
        <DialogContent>
          <Stack justifyContent="center" alignItems="center" spacing={2}>
            <CircularProgress color="primary" size="4rem" />
            <Box>
              <Typography variant="h5" align="center">
                <FormattedMessage
                  id="deploying.contract"
                  defaultMessage="Deploying Contract"
                />
              </Typography>
              <Typography color="text.secondary" variant="body1" align="center">
                <FormattedMessage
                  id="please.confirm.the.transaction.in.your.wallet.and.wait.for.confirmation"
                  defaultMessage="Please, confirm the transaction in your wallet and wait for confirmation"
                />
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
      </Dialog>
      <Dialog open={showSuccess} maxWidth="sm" fullWidth>
        <AppDialogTitle
          title={
            <FormattedMessage
              id="contract.deployed"
              defaultMessage="Contract Deployed"
            />
          }
          onClose={handleCloseSuccess}
        />
        <Divider />
        <DialogContent>
          <Stack spacing={2}>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              alignContent="center"
            >
              <CheckCircle color="success" fontSize="large" />
            </Stack>
            <Box>
              <Typography align="center" variant="h5">
                <FormattedMessage
                  id="contract.deployed"
                  defaultMessage="Contract deployed"
                />
              </Typography>
              <Typography align="center" color="text.secondary" variant="body1">
                <FormattedMessage
                  id="contract.deployed.succefully"
                  defaultMessage="Contract deployed successfully"
                />
              </Typography>
            </Box>
            <Stack direction={'row'} spacing={1} justifyContent={'center'}>
              <Button
                href={`/contract/${NETWORK_SLUG(
                  selectedChainId,
                )}/${contractAddress}`}
                variant="contained"
              >
                <FormattedMessage
                  id="manage.contract"
                  defaultMessage="Manage Contract"
                />
              </Button>
              <Button
                href={`/forms/create?contractAddress=${contractAddress}&chainId=${selectedChainId}`}
                variant="contained"
              >
                <FormattedMessage
                  id="create.form"
                  defaultMessage="Create form"
                />
              </Button>
              <Button href={`/forms/contracts/list`} variant="contained">
                <FormattedMessage
                  id="view.contracts"
                  defaultMessage="View contracts"
                />
              </Button>
            </Stack>
            <Button
              href={`${getBlockExplorerUrl(
                selectedChainId,
              )}/address/${contractAddress}`}
              target="_blank"
              variant="outlined"
            >
              <FormattedMessage
                id="view.on.explorer"
                defaultMessage="View on explorer"
              />
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
      <DexkitApiProvider.Provider value={{ instance: myAppsApi }}>
        <Container>
          <Stack spacing={2}>
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
                      id="manage.contracts"
                      defaultMessage="Manage Contracts"
                    />
                  ),
                  uri: '/forms/contracts',
                },
                {
                  caption: (
                    <FormattedMessage
                      id="deploy.contract"
                      defaultMessage="Deploy Contract"
                    />
                  ),
                  uri: `/forms/contracts/create`,
                },
                {
                  caption: thirdwebMetadataQuery.data?.displayName,
                  uri: `/forms/deploy/${
                    creator as string
                  }/${thirdwebMetadataQuery.data?.name}`,
                  active: true,
                },
              ]}
            />
            {formConfigParamsQuery.data && (
              <Box>
                <Grid spacing={2} container>
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                      <Stack>
                        <Stack
                          direction="row"
                          spacing={2}
                          alignItems="center"
                          alignContent="center"
                        >
                          {thirdwebMetadataQuery.data?.logo ? (
                            <Avatar
                              src={getNormalizedUrl(
                                thirdwebMetadataQuery.data?.logo,
                              )}
                            />
                          ) : (
                            <Skeleton
                              variant="circular"
                              sx={(theme) => ({
                                height: theme.spacing(6),
                                width: theme.spacing(6),
                              })}
                            />
                          )}
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h5">
                              {thirdwebMetadataQuery.data?.displayName ? (
                                thirdwebMetadataQuery.data?.displayName
                              ) : (
                                <Skeleton />
                              )}
                            </Typography>
                            <Typography
                              gutterBottom
                              color="text.secondary"
                              variant="body1"
                            >
                              {thirdwebMetadataQuery.data?.description ? (
                                thirdwebMetadataQuery.data?.description
                              ) : (
                                <Skeleton />
                              )}
                            </Typography>
                            <Typography variant="body1">
                              {thirdwebMetadataQuery.data?.publisher &&
                              getBlockExplorerUrl(chainId) ? (
                                <FormattedMessage
                                  id="published.by.publisher"
                                  defaultMessage="Published by: {publisher}"
                                  values={{
                                    publisher: (
                                      <Link
                                        href={`${getBlockExplorerUrl(
                                          chainId,
                                        )}/address/${thirdwebMetadataQuery.data
                                          ?.publisher}`}
                                        target="_blank"
                                      >
                                        {truncateAddress(
                                          thirdwebMetadataQuery.data?.publisher,
                                        )}
                                      </Link>
                                    ),
                                  }}
                                />
                              ) : (
                                <Skeleton />
                              )}
                            </Typography>
                          </Box>
                        </Stack>
                      </Stack>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Select
                      renderValue={(value) => {
                        return (
                          <Stack
                            direction="row"
                            alignItems="center"
                            alignContent="center"
                            spacing={1}
                          >
                            <Avatar
                              src={NETWORKS[selectedChainId]?.imageUrl || ''}
                              style={{ width: 'auto', height: '1rem' }}
                            />
                            <Typography variant="body1">
                              {NETWORKS[selectedChainId]?.name}
                            </Typography>
                          </Stack>
                        );
                      }}
                      fullWidth
                      value={selectedChainId}
                      onChange={handleChangeChainId}
                    >
                      {Object.keys(NETWORKS)
                        .filter((k) => activeChainIds.includes(Number(k)))
                        .map((key) => NETWORKS[parseChainId(key)])
                        .map((network) => (
                          <MenuItem
                            value={network.chainId.toString()}
                            key={network.chainId}
                          >
                            <Box mr={2}>
                              <Avatar
                                src={network.imageUrl}
                                sx={{ width: '1.5rem', height: '1.5rem' }}
                              />
                            </Box>
                            <ListItemText primary={network.name} />
                          </MenuItem>
                        ))}
                    </Select>
                  </Grid>
                  <Grid item xs={12}>
                    <GenericForm
                      output={{
                        objects: formConfigParamsQuery.data.output,
                      }}
                      context={{ trustedForwarders }}
                      onSubmit={handleSubmit}
                      form={{
                        elements: formConfigParamsQuery.data.form,
                      }}
                      actionLabel={
                        hasChainDiff ? (
                          <FormattedMessage
                            id="Switch Network"
                            defaultMessage="Switch Network"
                          />
                        ) : (
                          <FormattedMessage
                            id="deploy.contract"
                            defaultMessage="Deploy Contract"
                          />
                        )
                      }
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
          </Stack>
        </Container>
      </DexkitApiProvider.Provider>
    </>
  );
}

(DeployPage as any).getLayout = function getLayout(page: any) {
  return <AuthMainLayout>{page}</AuthMainLayout>;
};

type Params = {
  site?: string;
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  const queryClient = new QueryClient();
  const configResponse = await getAppConfig(params?.site, 'no-page-defined');

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      ...configResponse,
    },
    revalidate: 3000,
  };
};

export const getStaticPaths: GetStaticPaths<
  Params
> = ({}: GetStaticPathsContext) => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};
