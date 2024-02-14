import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import Box from '@mui/material/Box';

import { useMemo } from 'react';
import { useCollection } from '../../../hooks/nft';
import { isAddressEqual } from '../../../utils/blockchain';

import { ChainId } from '@dexkit/core/constants';
import { styled, useTheme } from '@mui/material';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAppConfig } from '../../../hooks/app';
const BuyLockContainer = dynamic(
  async () => await import('@dexkit/unlock-widget'),
);

const Img = styled(Image)({});

interface Props {
  address: string;
  chainId?: ChainId;
  lazy?: boolean;
  isLock?: boolean;
}

export function CollectionHeader(props: Props) {
  const appConfig = useAppConfig();

  const { address, chainId, lazy, isLock } = props;

  const { data: collection } = useCollection(address as string, chainId, lazy);

  const collectionImage = useMemo(() => {
    return (
      appConfig.collections?.find(
        (c) =>
          c.chainId === collection?.chainId &&
          isAddressEqual(c.contractAddress, collection?.address),
      )?.image || collection?.imageUrl
    );
  }, [collection]);

  const collectionBackgroundImage = useMemo(() => {
    return appConfig.collections?.find(
      (c) =>
        c.chainId === collection?.chainId &&
        isAddressEqual(c.contractAddress, collection?.address),
    )?.backgroundImage;
  }, [collection]);

  const theme = useTheme();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            sx={{
              backgroundImage: collectionBackgroundImage
                ? `url(${collectionBackgroundImage})`
                : undefined,
              height: theme.spacing(20),
              width: theme.spacing(20),
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                algnItems: 'center',
                alignContent: 'center',
                justifyContent: { xs: 'center', sm: 'left' },
                marginTop: 'auto',
              }}
            >
              {collectionImage ? (
                <Avatar
                  sx={(theme) => ({
                    height: theme.spacing(14),
                    width: theme.spacing(20),
                  })}
                  variant="square"
                  src={collectionImage}
                  alt={collection?.name}
                />
              ) : (
                <Avatar
                  variant="square"
                  sx={(theme) => ({
                    height: theme.spacing(14),
                    width: theme.spacing(20),
                  })}
                />
              )}
            </Box>
          </Grid>

          <Grid item xs>
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
              {collection?.name}
            </Typography>
          </Grid>
          {isLock && (
            <Grid item xs={12} sm={12}>
              <Box sx={{ maxWidth: '300px' }} justifyContent={'center'}>
                <BuyLockContainer
                  lockAddress={address.toLowerCase()}
                  lockChainId={chainId}
                />
              </Box>
            </Grid>
          )}

          {collection?.description && (
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
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {collection?.description}
                </ReactMarkdown>
              </Typography>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}
