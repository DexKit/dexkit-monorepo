import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import Box from '@mui/material/Box';

import { ShareButton } from '@dexkit/ui/components/ShareButton';
import Verified from '@mui/icons-material/Verified';
import { Chip, IconButton, Stack, SvgIcon, Tooltip, useTheme } from '@mui/material';
import Image from 'next/image';
import { FormattedMessage } from 'react-intl';

const XIcon = (props: any) => (
  <SvgIcon {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </SvgIcon>
);

interface Props {
  username?: string;
  name?: string;
  twitterVerified?: boolean;
  discordVerified?: boolean;
  profileImageURL?: string;
  backgroundImageURL?: string;
  bio?: string;
  shortBio?: string;
  createdBy?: string;
  twitterUsername?: string;
  profileNft?: any;
  nftChainId?: number;
  nftAddress?: string;
  nftId?: string;
}

export function UserHeader(props: Props) {
  const {
    profileImageURL,
    backgroundImageURL,
    bio,
    shortBio,
    username,
    twitterVerified,
    discordVerified,
    profileNft,
    nftChainId,
    nftAddress,
    nftId,
  } = props;
  const theme = useTheme();

  const isNftImage =
    (!!profileNft || !!nftChainId || !!nftAddress || !!nftId) ||
    (profileImageURL && (
      profileImageURL.includes('metadata.ens.domains') ||
      profileImageURL.includes('ipfs') ||
      profileImageURL.includes('arweave') ||
      profileImageURL.startsWith('data:') ||
      !profileImageURL.startsWith('/')
    ));

  const NETWORK_COLORS: Record<string, string> = {
    'ethereum': '#627EEA',
    'polygon': '#8247E5',
    'arbitrum': '#23A7E0',
    'base': '#0052FF',
    'optimism': '#FF0420',
    'bsc': '#F0B90B',
    'Ethereum': '#627EEA',
    'Polygon': '#8247E5',
    'Arbitrum': '#23A7E0',
    'Base': '#0052FF',
    'Optimism': '#FF0420',
    'BNB Chain': '#F0B90B',
  };

  console.log('UserHeader NFT props:', {
    nftChainId,
    nftAddress,
    nftId,
    hasProfileNft: !!profileNft,
    profileNftData: profileNft,
    isNftImage
  });

  const getNetworkIdFromChainId = (chainId?: number): string => {
    if (!chainId) return '';

    switch (chainId) {
      case 1:
        return 'ethereum';
      case 137:
        return 'polygon';
      case 42161:
        return 'arbitrum';
      case 8453:
        return 'base';
      case 10:
        return 'optimism';
      case 56:
      case 97:
        return 'bsc';
      default:
        return '';
    }
  };

  const getNetworkName = (chainId?: number): string => {
    if (!chainId) return '';

    switch (chainId) {
      case 1:
        return 'Ethereum';
      case 137:
        return 'Polygon';
      case 42161:
        return 'Arbitrum';
      case 8453:
        return 'Base';
      case 10:
        return 'Optimism';
      case 56:
      case 97:
        return 'BNB Chain';
      default:
        return `Chain ${chainId}`;
    }
  };

  const getNetworkColor = (chainId?: number): string => {
    if (!chainId) return '#627EEA';

    switch (chainId) {
      case 1:
        return '#627EEA';
      case 137:
        return '#8247E5';
      case 42161:
        return '#23A7E0';
      case 8453:
        return '#0052FF';
      case 10:
        return '#FF0420';
      case 56:
      case 97:
        return '#F0B90B';
      default:
        return '#627EEA';
    }
  };

  const nftName = profileNft?.metadata?.name || profileNft?.name || profileNft?.collectionName || "";

  let networkName = "";
  if (typeof profileNft?.networkId === 'string') {
    networkName = profileNft.networkId.charAt(0).toUpperCase() + profileNft.networkId.slice(1);
  } else if (nftChainId) {
    networkName = getNetworkName(nftChainId);
  }

  let networkColor = "#627EEA";
  if (networkName in NETWORK_COLORS) {
    networkColor = NETWORK_COLORS[networkName];
  } else if (networkName.toLowerCase() in NETWORK_COLORS) {
    networkColor = NETWORK_COLORS[networkName.toLowerCase()];
  }

  const networkId = getNetworkIdFromChainId(nftChainId);

  const networkInfo = networkId ? {
    id: networkId,
    name: networkName,
    color: networkColor
  } : null;

  return (
    <Grid container spacing={2}>
      <Grid
        item
        xs={12}
        sx={(theme) => ({
          height: theme.spacing(20),
          position: 'relative',
          backgroundImage: `url(${backgroundImageURL})`,
        })}
      >
        {profileImageURL ? (
          <Box
            sx={(theme) => ({
              position: 'absolute',
              bottom: theme.spacing(-2),
              left: theme.spacing(3),
              width: theme.spacing(14),
              height: theme.spacing(14),
              borderRadius: '50%',
              overflow: 'hidden',
            })}
          >
            {isNftImage ? (
              <img
                src={profileImageURL}
                alt={bio || ' '}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <Image
                src={profileImageURL}
                alt={bio || ' '}
                width={14 * 8}
                height={14 * 8}
              />
            )}
          </Box>
        ) : (
          <Avatar
            sx={(theme) => ({
              height: theme.spacing(14),
              width: theme.spacing(14),
            })}
          />
        )}
      </Grid>
      <Grid item xs>
        <Stack
          direction={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <Box display={'flex'} alignItems={'center'}>
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
              {username}
            </Typography>
            {discordVerified ||
              (twitterVerified && (
                <Tooltip
                  title={
                    <FormattedMessage
                      id={'user.verified.social'}
                      defaultMessage={'Verified in: {discord} {twitter}'}
                      values={{
                        discord: discordVerified ? 'Discord' : '',
                        twitter: twitterVerified ? 'Twitter' : '',
                      }}
                    />
                  }
                >
                  <IconButton color={'primary'}>
                    <Verified />
                  </IconButton>
                </Tooltip>
              ))}
          </Box>
          <ShareButton />
        </Stack>
      </Grid>

      {isNftImage && (
        <Grid item xs={12}>
          <Stack direction="row" spacing={1} alignItems="center" mt={0.5} mb={1}>
            {nftName && (
              <Typography variant="caption" component="div">
                {nftName}
              </Typography>
            )}

            {networkName && (
              <Chip
                label={networkName}
                size="small"
                sx={{
                  bgcolor: networkColor,
                  color: 'white',
                  fontSize: '0.75rem',
                  height: '22px',
                  fontWeight: 'bold',
                }}
              />
            )}

            <Chip
              label="NFT"
              color="secondary"
              size="small"
              variant="outlined"
              sx={{
                fontSize: '0.75rem',
                height: '22px',
                fontWeight: 'bold',
              }}
            />
          </Stack>
        </Grid>
      )}

      {shortBio && (
        <Grid item xs={12}>
          <Typography
            sx={{
              display: 'block',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              textAlign: { xs: 'center', sm: 'left' },
            }}
            variant="body1"
            component="p"
          >
            {shortBio}
          </Typography>
        </Grid>
      )}

      {bio && (
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between">
            <Typography
              sx={{
                display: 'block',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                textAlign: { xs: 'center', sm: 'left' },
              }}
              variant="caption"
              component="p"
            >
              {bio || ''}
            </Typography>
            {false && (
              <Box>
                <IconButton aria-label="twitter">
                  <XIcon />
                </IconButton>
                <IconButton aria-label="discord">
                  <Image
                    priority
                    src="/assets/icons/discord.svg"
                    height={24}
                    width={24}
                    alt="Discord"
                  />
                </IconButton>
              </Box>
            )}
          </Stack>
        </Grid>
      )}
    </Grid>
  );
}
