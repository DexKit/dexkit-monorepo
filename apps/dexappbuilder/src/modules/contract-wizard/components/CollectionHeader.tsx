import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import Box from '@mui/material/Box';

import { useContractCollection } from '@dexkit/ui/modules/nft/hooks/collection';
import { styled, useTheme } from '@mui/material';
import Image from 'next/image';

const Img = styled(Image)({});

interface Props {
  address: string;
  networkId?: string;
}

export function ContractCollectionHeader(props: Props) {
  const { address, networkId } = props;
  const { data: contract } = useContractCollection(networkId, address);

  const collectionImage = contract?.collection?.imageUrl;
  const collection = contract?.collection;

  const theme = useTheme();

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
              {collectionImage ? (
                <Box
                  sx={(theme) => ({
                    position: 'relative',
                    height: theme.spacing(14),
                    width: theme.spacing(14),
                    borderRadius: '50%',
                  })}
                >
                  <img
                    src={collectionImage}
                    alt={collection?.name}
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
                {collection?.description}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}
