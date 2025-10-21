import GenericForm from "@dexkit/web3forms/components/GenericForm";
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
  useMediaQuery,
  useTheme
} from "@mui/material";
import { useColorScheme } from "@mui/material/styles";

import { ReactNode, useCallback, useEffect, useState } from "react";

import { DexkitApiProvider } from "@dexkit/core/providers";

import { ChainId } from "@dexkit/core";
import { NETWORKS, NETWORK_SLUG } from "@dexkit/core/constants/networks";
import {
  getBlockExplorerUrl,
  getNormalizedUrl,
  parseChainId,
  truncateAddress,
} from "@dexkit/core/utils";
import {
  AppDialogTitle,
  useActiveChainIds,
  useDexKitContext,
  useSwitchNetworkMutation,
} from "@dexkit/ui";
import { PageHeader } from "@dexkit/ui/components/PageHeader";
import { myAppsApi } from "@dexkit/ui/constants/api";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import useThirdwebContractMetadataQuery, {
  useDeployThirdWebContractMutation,
  useFormConfigParamsQuery,
} from "@dexkit/web3forms/hooks";
import { useTrustedForwarders } from "@dexkit/web3forms/hooks/useTrustedForwarders";
import CheckCircle from "@mui/icons-material/CheckCircle";

import MenuBookIcon from "@mui/icons-material/MenuBook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { useSnackbar } from "notistack";
import { FormattedMessage, useIntl } from "react-intl";
import contractTutorials from "../../../../../../apps/dexappbuilder/src/constants/contract-tutorials.json";
import { THIRDWEB_CLIENT_ID } from "../../../../constants/thirdweb";
import { useSaveContractDeployed } from "../../../forms/hooks";

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

interface Props {
  slug: string;
  creator: string;
  onGoBack: () => void;
  onGoToContract: ({
    address,
    network,
  }: {
    address: string;
    network: string;
  }) => void;
  onGoToListContracts: () => void;
  hideButtonForm?: boolean;
}

export default function ContractDeployContainer({
  slug,
  creator,
  onGoBack,
  onGoToContract,
  onGoToListContracts,
  hideButtonForm,
}: Props) {
  const { chainId } = useWeb3React();
  const { activeChainIds } = useActiveChainIds();
  const theme = useTheme();
  const { mode } = useColorScheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getDexKitLogo = (isDark: boolean = false) => {
    return isDark
      ? "https://dexkit.com/branding/Normal_logo/Normal_Isotype/white_Isotype_DexKit.png"
      : "https://dexkit.com/branding/Normal_logo/Normal_Isotype/black_Isotype_DexKit.png";
  };

  const contractTutorial: ContractTutorial | undefined = slug ?
    (contractTutorials as Record<string, ContractTutorial>)[slug as string] :
    undefined;

  const switchNetworkMutation = useSwitchNetworkMutation();

  const [selectedChainId, setSelectedChainId] = useState<ChainId>(
    ChainId.Ethereum
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
      const params = values["params"];

      if (hasChainDiff) {
        try {
          await switchNetworkMutation.mutateAsync({
            chainId: selectedChainId,
          });

          enqueueSnackbar(
            formatMessage({
              id: "network.switched",
              defaultMessage: "Network changed",
            }),
            { variant: "success" }
          );

          return;
        } catch (err) {
          enqueueSnackbar(
            formatMessage({
              id: "error.while.switching.network",
              defaultMessage: "Error while switching network",
            }),
            { variant: "error" }
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

          const name = params["name"] || formValues?.name;

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
            id: "contract.deployed.successfully",
            defaultMessage: "Contract deployed successfully",
          }),
          { variant: "success" }
        );
      } catch (err) {
        enqueueSnackbar(
          formatMessage({
            id: "error.while.deploying.contract",
            defaultMessage: "Error while deploying contract",
          }),
          { variant: "error" }
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
      chainId,
      enqueueSnackbar,
      formatMessage,
      saveContractDeployedMutation,
      slug,
      switchNetworkMutation,
      thirdWebDeployMutation
    ]
  );

  const [contractAddress, setContractAddress] = useState<string>();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setContractAddress(undefined);
  };

  const handleChangeChainId = (
    event: SelectChangeEvent<number>,
    child: ReactNode
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
              <Typography
                variant="h5"
                align="center"
                sx={{
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  lineHeight: { xs: 1.3, sm: 1.5 }
                }}
              >
                <FormattedMessage
                  id="deploying.contract"
                  defaultMessage="Deploying Contract"
                />
              </Typography>
              <Typography
                color="text.secondary"
                variant="body1"
                align="center"
                sx={{
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  lineHeight: { xs: 1.3, sm: 1.5 }
                }}
              >
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
              <Typography
                align="center"
                variant="h5"
                sx={{
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  lineHeight: { xs: 1.3, sm: 1.5 }
                }}
              >
                <FormattedMessage
                  id="contract.deployed"
                  defaultMessage="Contract deployed"
                />
              </Typography>
              <Typography
                align="center"
                color="text.secondary"
                variant="body1"
                sx={{
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  lineHeight: { xs: 1.3, sm: 1.5 }
                }}
              >
                <FormattedMessage
                  id="contract.deployed.succefully"
                  defaultMessage="Contract deployed successfully"
                />
              </Typography>
            </Box>
            <Stack direction={"row"} spacing={1} justifyContent={"center"}>
              {onGoToContract ? (
                <Button
                  onClick={() =>
                    onGoToContract({
                      address: contractAddress as string,
                      network: NETWORK_SLUG(selectedChainId) as string,
                    })
                  }
                  variant="contained"
                >
                  <FormattedMessage
                    id="manage.contract"
                    defaultMessage="Manage Contract"
                  />
                </Button>
              ) : (
                <Button
                  href={`/contract/${NETWORK_SLUG(
                    selectedChainId
                  )}/${contractAddress}`}
                  variant="contained"
                >
                  <FormattedMessage
                    id="manage.contract"
                    defaultMessage="Manage Contract"
                  />
                </Button>
              )}

              {hideButtonForm ? (
                <></>
              ) : (
                <Button
                  href={`/forms/create?contractAddress=${contractAddress}&chainId=${selectedChainId}`}
                  variant="contained"
                >
                  <FormattedMessage
                    id="create.form"
                    defaultMessage="Create form"
                  />
                </Button>
              )}
              {onGoToListContracts ? (
                <Button
                  onClick={() => onGoToListContracts()}
                  variant="contained"
                >
                  <FormattedMessage
                    id="view.contracts"
                    defaultMessage="View contracts"
                  />
                </Button>
              ) : (
                <Button href={`/forms/contracts/list`} variant="contained">
                  <FormattedMessage
                    id="view.contracts"
                    defaultMessage="View contracts"
                  />
                </Button>
              )}
            </Stack>
            <Button
              href={`${getBlockExplorerUrl(
                selectedChainId
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
              onGoBackCallbackMobile={onGoBack}
              useBackMenu={true}
              breadcrumbs={[
                {
                  caption: <FormattedMessage id="home" defaultMessage="Home" />,
                  uri: "/",
                },
                {
                  caption: (
                    <FormattedMessage
                      id="dexcontract"
                      defaultMessage="DexContract"
                    />
                  ),
                  uri: "/forms",
                },
                {
                  caption: (
                    <FormattedMessage
                      id="manage.contracts"
                      defaultMessage="Manage Contracts"
                    />
                  ),
                  uri: "/forms/contracts",
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
            {formConfigParamsQuery.data && (
              <Box>
                <Grid spacing={2} container>
                  <Grid size={12}>
                    <Paper sx={{ p: { xs: 1, sm: 1.5 } }}>
                      <Stack>
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
                            <Typography
                              variant="h5"
                              sx={{
                                fontSize: { xs: '1.125rem', sm: '1.375rem' },
                                lineHeight: { xs: 1.3, sm: 1.4 }
                              }}
                            >
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
                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                lineHeight: { xs: 1.3, sm: 1.5 }
                              }}
                            >
                              {thirdwebMetadataQuery.data?.description ? (
                                thirdwebMetadataQuery.data?.description
                              ) : (
                                <Skeleton />
                              )}
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{
                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                lineHeight: { xs: 1.3, sm: 1.5 }
                              }}
                            >
                              {thirdwebMetadataQuery.data?.publisher &&
                                getBlockExplorerUrl(chainId) ? (
                                <FormattedMessage
                                  id="published.by.publisher"
                                  defaultMessage="Published by: {publisher}"
                                  values={{
                                    publisher: (
                                      <Link
                                        href={`${getBlockExplorerUrl(
                                          chainId
                                        )}/address/${thirdwebMetadataQuery.data
                                          ?.publisher}`}
                                        target="_blank"
                                      >
                                        {truncateAddress(
                                          thirdwebMetadataQuery.data?.publisher
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
                  <Grid size={12}>
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
                              src={NETWORKS[selectedChainId]?.imageUrl || ""}
                              style={{ width: "auto", height: "1rem" }}
                            />
                            <Typography
                              variant="body1"
                              sx={{
                                fontSize: { xs: '0.875rem', sm: '1rem' }
                              }}
                            >
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
                                sx={{ width: "1.5rem", height: "1.5rem" }}
                              />
                            </Box>
                            <ListItemText primary={network.name} />
                          </MenuItem>
                        ))}
                    </Select>
                  </Grid>
                  <Grid size={12}>
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

                  {contractTutorial && (
                    <Grid size={12}>
                      <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, mt: { xs: 1, sm: 2 }, bgcolor: 'background.paper' }}>
                        <Typography variant="h6" gutterBottom sx={{ mb: { xs: 1, sm: 2 }, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                          <FormattedMessage
                            id="learn.more.about.contract"
                            defaultMessage="Learn more about {contractName}"
                            values={{ contractName: contractTutorial.name }}
                          />
                        </Typography>

                        <Grid container spacing={3}>
                          {contractTutorial.videos.length > 0 && contractTutorial.videos.map((video, index) => (
                            <Grid size={{ xs: 12, md: contractTutorial.videos.length >= 2 ? 4 : 6 }} key={video.id}>
                              <Card>
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
                                  <Typography
                                    variant="subtitle1"
                                    gutterBottom
                                    sx={{
                                      fontSize: { xs: '0.9rem', sm: '1rem' },
                                      lineHeight: { xs: 1.2, sm: 1.4 }
                                    }}
                                  >
                                    <YouTubeIcon color="error" sx={{ mr: 1, verticalAlign: 'middle', fontSize: { xs: '1rem', sm: '1.2rem' } }} />
                                    {video.title}
                                  </Typography>
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}

                          <Grid size={{ xs: 12, md: contractTutorial.videos.length >= 2 ? 4 : 12 }}>
                            <Card sx={{ height: '100%' }}>
                              <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <Typography
                                  variant="subtitle1"
                                  gutterBottom
                                  sx={{
                                    fontSize: { xs: '0.9rem', sm: '1rem' },
                                    lineHeight: { xs: 1.2, sm: 1.4 }
                                  }}
                                >
                                  <MenuBookIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle', fontSize: { xs: '1rem', sm: '1.2rem' } }} />
                                  <FormattedMessage id="documentation" defaultMessage="Documentation" />
                                </Typography>
                                <Box sx={{ my: 2 }}>
                                  <Typography
                                    variant="body2"
                                    paragraph
                                    sx={{
                                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                      lineHeight: { xs: 1.3, sm: 1.5 }
                                    }}
                                  >
                                    {contractTutorial.documentation.description}
                                  </Typography>
                                </Box>
                                <Button
                                  variant="outlined"
                                  component={Link}
                                  href={contractTutorial.documentation.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  startIcon={<MenuBookIcon sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }} />}
                                  fullWidth
                                  sx={{
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                  }}
                                >
                                  <FormattedMessage id="view.documentation" defaultMessage="View documentation" />
                                </Button>
                              </CardContent>
                            </Card>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}
          </Stack>
        </Container>
      </DexkitApiProvider.Provider>
    </>
  );
}
