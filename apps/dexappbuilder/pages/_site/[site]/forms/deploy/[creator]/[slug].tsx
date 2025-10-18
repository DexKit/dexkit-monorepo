import GenericForm from '@dexkit/web3forms/components/GenericForm';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  Divider,
  Link,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import AuthMainLayout from 'src/components/layouts/authMain';

import { useCallback, useEffect, useState } from 'react';

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
import { myAppsApi } from '@dexkit/ui/constants/api';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import useThirdwebContractMetadataQuery, {
  useDeployThirdWebContractMutation,
  useFormConfigParamsQuery,
} from '@dexkit/web3forms/hooks';
import { useTrustedForwarders } from '@dexkit/web3forms/hooks/useTrustedForwarders';
import CheckCircle from '@mui/icons-material/CheckCircle';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import YouTubeIcon from '@mui/icons-material/YouTube';
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
import contractTutorials from 'src/constants/contract-tutorials.json';
import { getAppConfig } from 'src/services/app';
interface TutorialVideo {
  id: string;
  title: string;
}
interface ContractDocumentation {
  description: string;
  url: string;
}
interface ContractTutorial {
  name: string;
  videos: TutorialVideo[];
  documentation: ContractDocumentation;
}

export default function DeployPage() {
  const { chainId } = useWeb3React();
  const { activeChainIds } = useActiveChainIds();
  const theme = useTheme();
  const { mode } = useColorScheme();

  const getDexKitLogo = (isDark: boolean = false) => {
    return isDark
      ? "https://dexkit.com/branding/Normal_logo/Normal_Isotype/white_Isotype_DexKit.png"
      : "https://dexkit.com/branding/Normal_logo/Normal_Isotype/black_Isotype_DexKit.png";
  };

  const { query } = useRouter();

  const { slug, creator } = query;

  const contractTutorial: ContractTutorial | undefined = slug ?
    (contractTutorials as Record<string, ContractTutorial>)[slug as string] :
    undefined;

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
    child: React.ReactNode,
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
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Header Section */}
            <Box>
              <PageHeader
                breadcrumbs={[
                  {
                    caption: <FormattedMessage id="home" defaultMessage="Home" />,
                    uri: '/',
                  },
                  {
                    caption: (
                      <FormattedMessage
                        id="dexcontract"
                        defaultMessage="DexContract"
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
                    uri: `/forms/deploy/${creator as string
                      }/${thirdwebMetadataQuery.data?.name}`,
                    active: true,
                  },
                ]}
              />
            </Box>

            {/* Main Content */}
            {formConfigParamsQuery.data && (
              <Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* Contract Header Card */}
                  <Box>
                    <Paper sx={{ p: { xs: 1, sm: 1.5 } }}>
                      <Stack spacing={1.5}>
                        <Stack
                          direction="row"
                          spacing={{ xs: 0.75, sm: 1.5 }}
                          alignItems="center"
                          alignContent="center"
                        >
                          <Avatar
                            src={getNormalizedUrl(
                              thirdwebMetadataQuery.data?.logo || getDexKitLogo(mode === 'dark')
                            )}
                            sx={{
                              width: { xs: '1.5rem', sm: '2.5rem' },
                              height: { xs: '1.5rem', sm: '2.5rem' },
                              '& .MuiAvatar-img': {
                                objectFit: 'contain',
                                padding: '0.25rem'
                              }
                            }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h4" sx={{
                              fontWeight: 600,
                              mb: 0.5,
                              fontSize: { xs: '1.25rem', sm: '1.5rem' },
                              lineHeight: { xs: 1.3, sm: 1.4 }
                            }}>
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
                              sx={{
                                mb: 0.5,
                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                lineHeight: { xs: 1.3, sm: 1.4 }
                              }}
                            >
                              {thirdwebMetadataQuery.data?.description ? (
                                thirdwebMetadataQuery.data?.description
                              ) : (
                                <Skeleton />
                              )}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
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
                  </Box>
                  {/* Network Selection */}
                  <Box>
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
                  </Box>
                  {/* Form Section */}
                  <Box>
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
                  </Box>

                  {/* Learn More Section */}
                  {contractTutorial && (
                    <Box>
                      <Paper elevation={0} sx={{ p: 3, mt: 2, bgcolor: 'background.paper' }}>
                        <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                          <FormattedMessage
                            id="learn.more.about.contract"
                            defaultMessage="Learn more about {contractName}"
                            values={{ contractName: contractTutorial.name }}
                          />
                        </Typography>

                        <Box sx={{
                          display: 'grid',
                          gridTemplateColumns: {
                            xs: '1fr',
                            sm: contractTutorial.videos.length >= 2 ? 'repeat(2, 1fr)' : '1fr',
                            md: contractTutorial.videos.length >= 2 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)'
                          },
                          gap: 3
                        }}>
                          {contractTutorial.videos.length > 0 && contractTutorial.videos.map((video, index) => (
                            <Box key={video.id}>
                              <Card sx={{ height: '100%' }}>
                                <CardMedia
                                  component="iframe"
                                  height="200"
                                  src={`https://www.youtube.com/embed/${video.id}`}
                                  title={video.title}
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                                <CardContent>
                                  <Typography variant="subtitle1" gutterBottom>
                                    <YouTubeIcon color="error" sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    {video.title}
                                  </Typography>
                                </CardContent>
                              </Card>
                            </Box>
                          ))}

                          <Box>
                            <Card sx={{ height: '100%' }}>
                              <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <Typography variant="subtitle1" gutterBottom>
                                  <MenuBookIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                                  <FormattedMessage id="documentation" defaultMessage="Documentation" />
                                </Typography>
                                <Box sx={{ my: 2 }}>
                                  <Typography variant="body2" paragraph>
                                    {contractTutorial.documentation.description}
                                  </Typography>
                                </Box>
                                <Button
                                  variant="outlined"
                                  component={Link}
                                  href={contractTutorial.documentation.url}
                                  target="_blank"
                                  sx={{ alignSelf: 'flex-start' }}
                                >
                                  <FormattedMessage id="read.documentation" defaultMessage="Read Documentation" />
                                </Button>
                              </CardContent>
                            </Card>
                          </Box>
                        </Box>
                      </Paper>
                    </Box>
                  )}
                </Box>
              </Box>
            )}
          </Box>
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
> = ({ }: GetStaticPathsContext) => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};
