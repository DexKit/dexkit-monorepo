import {
  NETWORK_EXPLORER,
  NETWORK_FROM_SLUG,
  NETWORK_IMAGE,
  NETWORK_NAME,
} from '@dexkit/core/constants/networks';
import {
  copyToClipboard,
  ipfsUriToUrl,
  truncateAddress,
} from '@dexkit/core/utils';
import CopyIconButton from '@dexkit/ui/components/CopyIconButton';
import { THIRDWEB_CONTRACT_TYPES } from '@dexkit/web3forms/constants';
import FileCopy from '@mui/icons-material/FileCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Button, Chip, Stack, styled, useTheme } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {
  CustomContractMetadata,
  useContract,
  useContractMetadata,
} from '@thirdweb-dev/react';
import Image from 'next/image';
import { FormattedMessage, useIntl } from 'react-intl';
import Link from 'src/components/Link';

const Img = styled(Image)({});

interface Props {
  address: string;
  contractType?: string | null;
  contractTypeV2?: string;
  network?: string;
}

export function ContractMetadataHeader({
  address,
  contractType,
  network,
  contractTypeV2,
}: Props) {
  const { data: contract } = useContract(address);
  const { data } = useContractMetadata(contract);
  const { formatMessage } = useIntl();

  const metadata = data as CustomContractMetadata;
  const theme = useTheme();
  const chainId = NETWORK_FROM_SLUG(network)?.chainId;

  const getContractUrl = (contractType?: string) => {
    let url: string | null = '';

    switch (contractType) {
      case 'NFTStake':
      case 'EditionStake':
      case 'TokenStake':
        url = `/stake/${network}/${address}`;
        break;
      case 'TokenERC721':
        url = `/collection/${network}/${address}`;
        break;
      case 'TokenERC1155':
        url = `/collection/${network}/${address}`;
        break;
      case 'TokenERC20':
      case 'TokenERC721':
      case 'TokenERC1155':
        url = `/token/nft/${network}/${address}`;
        break;
      case 'DropERC1155':
        url = null;
        break;
      case 'DropERC721':
        url = `/drop/nft/${network}/${address}`;
        break;
      case 'DropERC20':
        url = `/drop/token/${network}/${address}`;
        break;
    }

    return url;
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                algnItems: 'center',
                alignContent: 'center',
                justifyContent: { xs: 'center', sm: 'left' },
              }}
            >
              {metadata?.image ? (
                <Box
                  sx={(theme) => ({
                    position: 'relative',
                    height: theme.spacing(14),
                    width: theme.spacing(14),
                    borderRadius: '50%',
                  })}
                >
                  <img
                    src={ipfsUriToUrl(metadata.image)}
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
            <Stack direction={'row'} spacing={2}>
              <Typography
                sx={{
                  display: 'block',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  textAlign: { xs: 'center', sm: 'left' },
                }}
                variant="h5"
                component="h1"
              >
                {metadata?.name}
              </Typography>
              <Stack
                direction={'row'}
                alignContent={'center'}
                alignItems={'center'}
              >
                <Avatar
                  src={NETWORK_IMAGE(chainId)}
                  sx={(theme) => ({
                    width: theme.spacing(4),
                    height: theme.spacing(4),
                  })}
                  alt={NETWORK_NAME(chainId) || ''}
                />
                <Typography>{NETWORK_NAME(chainId)}</Typography>
              </Stack>
            </Stack>
          </Grid>

          {metadata?.description && (
            <Grid item xs={12}>
              <Typography
                sx={{
                  display: 'block',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  textAlign: { xs: 'center', sm: 'left' },
                }}
                variant="body2"
                component="p"
              >
                {metadata?.description}
              </Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <Stack
              direction={'row'}
              spacing={2}
              alignContent={'center'}
              alignItems={'center'}
            >
              <Typography color="textSecondary" variant="caption">
                {truncateAddress(address)}

                <CopyIconButton
                  iconButtonProps={{
                    onClick: () => copyToClipboard(address),
                    size: 'small',
                    color: 'inherit',
                  }}
                  tooltip={formatMessage({
                    id: 'copy',
                    defaultMessage: 'Copy',
                    description: 'Copy text',
                  })}
                  activeTooltip={formatMessage({
                    id: 'copied',
                    defaultMessage: 'Copied!',
                    description: 'Copied text',
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
              {getContractUrl(contractTypeV2) && (
                <Link href={getContractUrl(contractTypeV2) as string}>
                  <FormattedMessage
                    id="view.public.page"
                    defaultMessage="View public page"
                  />
                </Link>
              )}
              <Chip
                label={
                  contractType
                    ? THIRDWEB_CONTRACT_TYPES[contractType]
                    : 'custom'
                }
              />
            </Stack>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
