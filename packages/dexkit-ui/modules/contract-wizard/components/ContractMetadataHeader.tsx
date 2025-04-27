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
import { Button, Chip, Stack, styled, useTheme } from "@mui/material";
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

import { THIRDWEB_CONTRACTTYPE_TO_NAME } from "@dexkit/ui/constants/thirdweb";
import { useContractCollection } from "@dexkit/ui/modules/nft/hooks/collection";
import { useMemo } from "react";
import Link from "../../../components/AppLink";
import { PageHeader } from "../../../components/PageHeader";

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

  const serverMetadata = useMemo(() => {
    if (contractData?.metadata) {
      return JSON.parse(contractData?.metadata);
    }
  }, [contractData]);

  const metadata = data as CustomContractMetadata;
  const theme = useTheme();
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
    <Grid container spacing={2}>
      {showPageHeader && (
        <Grid item xs={12}>
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

      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                algnItems: "center",
                alignContent: "center",
                justifyContent: { xs: "center", sm: "left" },
              }}
            >
              {metadata?.image || serverMetadata?.image ? (
                <Box
                  sx={(theme) => ({
                    position: "relative",
                    height: theme.spacing(14),
                    width: theme.spacing(14),
                    borderRadius: "50%",
                  })}
                >
                  <img
                    src={ipfsUriToUrl(metadata?.image || serverMetadata?.image)}
                    alt={metadata?.name}
                    height={theme.spacing(14)}
                    width={theme.spacing(14)}
                  />
                </Box>
              ) : (
                <Avatar
                  sx={(theme) => ({
                    height: theme.spacing(14),
                    width: theme.spacing(14),
                  })}
                />
              )}
            </Box>
          </Grid>
          <Grid item xs>
            <Stack direction="row" spacing={2}>
              <Typography
                sx={{
                  display: "block",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  textAlign: { xs: "center", sm: "left" },
                }}
                variant="h5"
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
              />
            </Stack>
          </Grid>

          {metadata?.description ||
            (serverMetadata?.description && (
              <Grid item xs={12}>
                <Typography
                  sx={{
                    display: "block",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    textAlign: { xs: "center", sm: "left" },
                  }}
                  variant="body2"
                  component="p"
                >
                  {metadata?.description || serverMetadata?.description}
                </Typography>
              </Grid>
            ))}
          <Grid item xs={12}>
            <Stack
              direction={"row"}
              spacing={2}
              alignContent={"center"}
              alignItems={"center"}
            >
              <Typography color="textSecondary" variant="caption">
                {truncateAddress(address)}

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
              </Typography>
              <Button
                LinkComponent={Link}
                href={`${NETWORK_EXPLORER(chainId)}/address/${address}`}
                target="_blank"
                endIcon={<OpenInNewIcon />}
                size="small"
              >
                <FormattedMessage id="explorer" defaultMessage="Explorer" />
              </Button>
              {getContractUrl(contractTypeV2 || metadata?.name) && (
                <Button
                  size="small"
                  href={
                    getContractUrl(contractTypeV2 || metadata?.name) as string
                  }
                  endIcon={<OpenInNewIcon />}
                  target="_blank"
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
              />
            </Stack>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
