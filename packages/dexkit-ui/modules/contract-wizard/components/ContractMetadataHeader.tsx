import {
  NETWORK_EXPLORER,
  NETWORK_FROM_SLUG,
  NETWORK_IMAGE,
  NETWORK_NAME,
} from "@dexkit/core/constants/networks";
import {
  copyToClipboard,
  ipfsUriToUrl,
  truncateAddress,
} from "@dexkit/core/utils";
import CopyIconButton from "@dexkit/ui/components/CopyIconButton";
import FileCopy from "@mui/icons-material/FileCopy";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Button, Chip, Stack, styled, useMediaQuery, useTheme } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {
  CustomContractMetadata,
  useContract,
  useContractMetadata,
} from "@thirdweb-dev/react";
import Image from "next/image";
import { FormattedMessage, useIntl } from "react-intl";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { THIRDWEB_CONTRACTTYPE_TO_NAME } from "@dexkit/ui/constants/thirdweb";
import { useContractCollection } from "@dexkit/ui/modules/nft/hooks/collection";
import { useMemo } from "react";
import { PageHeader } from "../../../components/PageHeader";

const getMediaTypeFromUrl = (url: string): 'image' | 'video' | 'audio' => {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('.mp4') || lowerUrl.includes('.mov') || lowerUrl.includes('.webm')) {
    return 'video';
  }
  if (lowerUrl.includes('.mp3') || lowerUrl.includes('.wav') || lowerUrl.includes('.ogg') || lowerUrl.includes('.flac')) {
    return 'audio';
  }
  return 'image';
};

const Img = styled(Image)({});

interface Props {
  address: string;
  contractType?: string | null;
  contractTypeV2?: string;
  network?: string;
  hidePublicPageUrl?: boolean;
  onGoBack?: () => void;
  showPageHeader?: boolean;
}

export function ContractMetadataHeader({
  address,
  contractType,
  network,
  contractTypeV2,
  hidePublicPageUrl,
  showPageHeader,
  onGoBack,
}: Props) {
  const { data: contract } = useContract(address);
  const { data } = useContractMetadata(contract);
  const { data: contractData } = useContractCollection(network, address);
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const serverMetadata = useMemo(() => {
    if (contractData?.metadata) {
      return JSON.parse(contractData?.metadata);
    }
  }, [contractData]);

  const metadata = data as CustomContractMetadata;
  const chainId = NETWORK_FROM_SLUG(network)?.chainId;

  const getContractUrl = (contractType?: string) => {
    let url: string | null = "";
    if (hidePublicPageUrl) {
      return null;
    }

    switch (contractType) {
      case "NFTStake":
      case "EditionStake":
      case "TokenStake":
        url = `/stake/${network}/${address}`;
        break;
      case "TokenERC721":
        url = `/collection/${network}/${address}`;
        break;
      case "TokenERC1155":
        url = `/collection/${network}/${address}`;
        break;
      case "TokenERC20":
        url = `/token/${network}/${address}`;
        break;
      case "DropERC1155":
        url = null;
        break;
      case "DropERC721":
        url = `/drop/nft/${network}/${address}`;
        break;
      case "DropAllowanceERC20":
      case "DropERC20":
        url = `/drop/token/${network}/${address}`;
        break;
      case "AirdropERC20Claimable":
        url = `/contract/${network}/${address}/airdrop`;
        break;
    }

    return url;
  };

  return (
    <Grid container spacing={isMobile ? 1 : 2}>
      {showPageHeader && (
        <Grid size={12}>
          <PageHeader
            onGoBackCallbackMobile={onGoBack}
            useBackMenu={true}
            breadcrumbs={[
              {
                caption:
                  metadata?.name === "AirdropERC20Claimable" &&
                    serverMetadata?.name
                    ? serverMetadata?.name
                    : metadata?.name || serverMetadata?.name,
                uri: `/forms/deploy`,
                active: true,
              },
            ]}
          />
        </Grid>
      )}

      <Grid size={12}>
        <Grid container spacing={isMobile ? 1 : 2}>
          <Grid size={{ xs: 12, sm: 3, md: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                alignContent: "center",
                justifyContent: { xs: "center", sm: "flex-start" },
                mb: { xs: 1, sm: 0 }
              }}
            >
              {metadata?.image || serverMetadata?.image ? (
                <Box
                  sx={(theme) => ({
                    position: "relative",
                    height: isMobile ? theme.spacing(10) : theme.spacing(14),
                    width: isMobile ? theme.spacing(10) : theme.spacing(14),
                    borderRadius: "50%",
                    overflow: "hidden",
                  })}
                >
                  {(() => {
                    const imageUrl = metadata?.image || serverMetadata?.image;
                    const mediaType = getMediaTypeFromUrl(imageUrl);

                    if (mediaType === 'video') {
                      return (
                        <Box
                          component="video"
                          src={ipfsUriToUrl(imageUrl)}
                          sx={{
                            height: "100%",
                            width: "100%",
                            objectFit: "cover",
                          }}
                          autoPlay
                          muted
                          loop
                          playsInline
                        />
                      );
                    } else if (mediaType === 'audio') {
                      return (
                        <Box
                          sx={{
                            height: "100%",
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                          }}
                        >
                          <Typography variant="h4" color="white">♪</Typography>
                        </Box>
                      );
                    } else {
                      return (
                        <img
                          src={ipfsUriToUrl(imageUrl)}
                          alt={metadata?.name}
                          style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "cover"
                          }}
                        />
                      );
                    }
                  })()}
                </Box>
              ) : (
                <Avatar
                  sx={(theme) => ({
                    height: isMobile ? theme.spacing(10) : theme.spacing(14),
                    width: isMobile ? theme.spacing(10) : theme.spacing(14),
                  })}
                />
              )}
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 9, md: 10 }}>
            <Stack spacing={isMobile ? 1 : 2}>
              <Stack
                direction={isMobile ? "column" : "row"}
                spacing={isMobile ? 1 : 2}
                alignItems={isMobile ? "center" : "flex-start"}
              >
                <Typography
                  sx={{
                    display: "block",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    textAlign: { xs: "center", sm: "left" },
                    fontSize: isMobile ? '1.25rem' : '1.5rem',
                    fontWeight: 600,
                    lineHeight: 1.2
                  }}
                  variant={isMobile ? "h6" : "h5"}
                  component="h1"
                >
                  {metadata?.name === "AirdropERC20Claimable" &&
                    serverMetadata?.name
                    ? serverMetadata?.name
                    : metadata?.name || serverMetadata?.name}
                </Typography>
                <Chip
                  icon={
                    <Avatar
                      src={NETWORK_IMAGE(chainId)}
                      sx={(theme) => ({
                        width: theme.spacing(2),
                        height: theme.spacing(2),
                      })}
                      alt={NETWORK_NAME(chainId) || ""}
                    />
                  }
                  label={NETWORK_NAME(chainId)}
                  size={isMobile ? "small" : "medium"}
                />
              </Stack>

              {(metadata?.description || serverMetadata?.description) && (
                <Box
                  sx={{
                    textAlign: { xs: "center", sm: "left" },
                    fontSize: isMobile ? '0.875rem' : '0.875rem',
                    lineHeight: 1.4,
                    color: 'text.secondary',
                    '& p': {
                      margin: 0,
                      fontSize: 'inherit',
                      lineHeight: 'inherit',
                      color: 'inherit'
                    },
                    '& p:not(:last-child)': {
                      marginBottom: 1
                    },
                    '& ul, & ol': {
                      paddingLeft: 2,
                      margin: 0
                    },
                    '& li': {
                      fontSize: 'inherit',
                      lineHeight: 'inherit'
                    },
                    '& strong': {
                      fontWeight: 600
                    },
                    '& em': {
                      fontStyle: 'italic'
                    },
                    '& code': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      padding: '2px 4px',
                      borderRadius: '4px',
                      fontSize: '0.875em'
                    },
                    '& pre': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      padding: 1,
                      borderRadius: '4px',
                      overflow: 'auto'
                    },
                    '& blockquote': {
                      borderLeft: '4px solid',
                      borderColor: 'primary.main',
                      paddingLeft: 2,
                      margin: '8px 0',
                      fontStyle: 'italic'
                    },
                    '& a': {
                      color: 'primary.main',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }
                  }}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {metadata?.description || serverMetadata?.description}
                  </ReactMarkdown>
                </Box>
              )}

              <Stack
                direction={isMobile ? "column" : "row"}
                spacing={isMobile ? 1 : 2}
                alignContent={"center"}
                alignItems={isMobile ? "center" : "center"}
              >
                <Stack
                  direction="row"
                  spacing={0.5}
                  alignItems="center"
                  justifyContent={isMobile ? "center" : "flex-start"}
                >
                  <Typography
                    color="textSecondary"
                    variant={isMobile ? "caption" : "caption"}
                    sx={{ fontSize: isMobile ? '0.75rem' : '0.75rem' }}
                  >
                    {truncateAddress(address)}
                  </Typography>
                  <CopyIconButton
                    iconButtonProps={{
                      onClick: () => copyToClipboard(address),
                      size: "small",
                      color: "inherit",
                    }}
                    tooltip={formatMessage({
                      id: "copy",
                      defaultMessage: "Copy",
                      description: "Copy text",
                    })}
                    activeTooltip={formatMessage({
                      id: "copied",
                      defaultMessage: "Copied!",
                      description: "Copied text",
                    })}
                  >
                    <FileCopy fontSize="inherit" color="inherit" />
                  </CopyIconButton>
                </Stack>

                {isMobile ? (
                  <Box width="100%">
                    <Grid container spacing={0.5} sx={{ mb: 1 }}>
                      <Grid size={getContractUrl(contractTypeV2 || metadata?.name) ? 6 : 12}>
                        <Button
                          size="small"
                          href={`${NETWORK_EXPLORER(chainId)}/address/${address}`}
                          endIcon={<OpenInNewIcon fontSize="small" />}
                          target="_blank"
                          variant="outlined"
                          fullWidth
                          sx={{
                            fontSize: '0.75rem',
                            py: 0.5,
                            px: 1
                          }}
                        >
                          <FormattedMessage id="explorer" defaultMessage="Explorer" />
                        </Button>
                      </Grid>

                      {getContractUrl(contractTypeV2 || metadata?.name) && (
                        <Grid size={6}>
                          <Button
                            size="small"
                            href={
                              getContractUrl(contractTypeV2 || metadata?.name) as string
                            }
                            endIcon={<OpenInNewIcon fontSize="small" />}
                            target="_blank"
                            variant="outlined"
                            fullWidth
                            sx={{
                              fontSize: '0.75rem',
                              py: 0.5,
                              px: 1
                            }}
                          >
                            <FormattedMessage
                              id="view.public.page"
                              defaultMessage="View public page"
                            />
                          </Button>
                        </Grid>
                      )}
                    </Grid>

                    <Box display="flex" justifyContent="center">
                      <Chip
                        label={
                          contractTypeV2 !== undefined
                            ? (THIRDWEB_CONTRACTTYPE_TO_NAME[
                              contractTypeV2 as string
                            ] as string)
                            : "custom"
                        }
                        size="small"
                        sx={{
                          fontSize: '0.7rem',
                          height: 24
                        }}
                      />
                    </Box>
                  </Box>
                ) : (
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <Button
                      size="small"
                      href={`${NETWORK_EXPLORER(chainId)}/address/${address}`}
                      endIcon={<OpenInNewIcon fontSize="medium" />}
                      target="_blank"
                      variant="outlined"
                      sx={{
                        fontSize: '0.875rem',
                        py: 0.5,
                        px: 1.5
                      }}
                    >
                      <FormattedMessage id="explorer" defaultMessage="Explorer" />
                    </Button>

                    {getContractUrl(contractTypeV2 || metadata?.name) && (
                      <Button
                        size="small"
                        href={
                          getContractUrl(contractTypeV2 || metadata?.name) as string
                        }
                        endIcon={<OpenInNewIcon fontSize="medium" />}
                        target="_blank"
                        variant="outlined"
                        sx={{
                          fontSize: '0.875rem',
                          py: 0.5,
                          px: 1.5
                        }}
                      >
                        <FormattedMessage
                          id="view.public.page"
                          defaultMessage="View public page"
                        />
                      </Button>
                    )}

                    <Chip
                      label={
                        contractTypeV2 !== undefined
                          ? (THIRDWEB_CONTRACTTYPE_TO_NAME[
                            contractTypeV2 as string
                          ] as string)
                          : "custom"
                      }
                      size="medium"
                      sx={{
                        fontSize: '0.8125rem',
                        height: 32
                      }}
                    />
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
