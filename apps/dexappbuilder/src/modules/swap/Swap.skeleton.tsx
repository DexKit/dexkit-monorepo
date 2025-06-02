import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import SettingsIcon from '@mui/icons-material/Settings';
import { FormattedMessage } from 'react-intl';

import { ChainId } from '@dexkit/core/constants';
import { NetworkSelectButton } from '../../components/NetworkSelectButton';

export function SwapSkeleton() {
  return (
    <>
      <Card>
        <CardHeader
          title={
            <Stack
              spacing={2}
              direction={'row'}
              alignContent={'center'}
              alignItems={'center'}
            >
              <Typography variant="h5">
                <Skeleton>
                  <FormattedMessage id="swap" defaultMessage="Swap" />
                </Skeleton>
              </Typography>
            </Stack>
          }
          action={
            <Stack
              spacing={1}
              direction={'row'}
              alignContent={'center'}
              alignItems={'center'}
            >
              <Skeleton>
                <NetworkSelectButton
                  chainId={ChainId.Ethereum}
                  onChange={() => {}}
                />
              </Skeleton>
              <IconButton>
                <SettingsIcon />
              </IconButton>
            </Stack>
          }
        />
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Button
                    size="large"
                    variant="outlined"
                    fullWidth
                    endIcon={<KeyboardArrowDownIcon />}
                  >
                    <Skeleton>
                      <FormattedMessage id="select" defaultMessage="Select" />
                    </Skeleton>
                  </Button>
                </Grid>
                <Grid item xs>
                  <Skeleton>
                    <TextField autoComplete="off" fullWidth size="small" />
                  </Skeleton>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center">
                <IconButton size="small">
                  <ArrowDownwardRoundedIcon fontSize="small" />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Button
                    variant="outlined"
                    size="large"
                    fullWidth
                    endIcon={<KeyboardArrowDownIcon />}
                  >
                    <Skeleton>
                      <FormattedMessage id="select" defaultMessage="Select" />
                    </Skeleton>
                  </Button>
                </Grid>
                <Grid item xs>
                  <Skeleton>
                    <TextField size="small" autoComplete="off" fullWidth />
                  </Skeleton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
}

export default SwapSkeleton;
