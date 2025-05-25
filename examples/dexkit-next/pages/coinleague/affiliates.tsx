import AppConnectWalletEmtpy from '@/modules/common/components/AppConnectWalletEmpty';
import AppPageHeader from '@/modules/common/components/AppPageHeader';
import MainLayout from '@/modules/common/components/layouts/MainLayout';
import Link from '@/modules/common/components/Link';
import { copyToClipboard, getWindowUrl } from '@/modules/common/utils/browser';
import {
  Avatar,
  Box,
  Button,
  Card,
  Grid,
  InputAdornment,
  NoSsr,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { NextPage } from 'next';
import { Suspense, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import AffiliateHistoryTable from '@/modules/coinleague/components/AffiliateHistoryTable';
import { useAffiliatePlayer } from '@/modules/coinleague/hooks/affiliate';
import { useCoinToPlayStable } from '@/modules/coinleague/hooks/coinleague';
import AppErrorBoundary from '@/modules/common/components/AppErrorBoundary';
import AppStandardErrorBlock from '@/modules/common/components/AppStandardErrorBlock';
import CopyIconButton from '@/modules/common/components/CopyIconButton';
import TableSkeleton from '@/modules/common/components/skeletons/TableSkeleton';
import { truncateAddress } from '@/modules/common/utils';
import { Money } from '@mui/icons-material';
import FileCopy from '@mui/icons-material/FileCopy';
import LinkIcon from '@mui/icons-material/Link';
import Wallet from '@mui/icons-material/Wallet';
import { ethers } from 'ethers';

const AffiliatesPage: NextPage = () => {
  const { account, isActive, chainId } = useWeb3React();

  const { formatMessage } = useIntl();

  const affiliateUrl = useMemo(() => {
    if (account) {
      return `${getWindowUrl()}/coinleague?affiliate=${account}`;
    }
  }, [account]);

  const handleCopy = () => {
    if (affiliateUrl) {
      copyToClipboard(affiliateUrl);
    }
  };

  const queryPlayer = useAffiliatePlayer(account, false);

  const coinToPlay = useCoinToPlayStable(chainId);

  return (
    <MainLayout>
      <Stack spacing={2}>
        <AppPageHeader
          breadcrumbs={[
            {
              caption: <FormattedMessage id="home" defaultMessage="home" />,
              uri: '/',
            },
            {
              caption: (
                <FormattedMessage
                  id="coin.league"
                  defaultMessage="Coin League"
                />
              ),
              uri: '/coinleague',
            },
            {
              caption: (
                <FormattedMessage id="affiliate" defaultMessage="Affiliate" />
              ),
              uri: '/coinleague/affiliate',
              active: true,
            },
          ]}
        />

        {!isActive ? (
          <AppConnectWalletEmtpy />
        ) : (
          <Box>
            <Grid container spacing={2}>
              <Grid item>
                <Card>
                  <Stack
                    direction="row"
                    alignContent="center"
                    alignItems="center"
                    spacing={2}
                    sx={{ p: 2 }}
                  >
                    <Avatar>
                      <Wallet fontSize="medium" color="action" />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        <FormattedMessage
                          id="affiliate.address"
                          defaultMessage="Affiliate Address"
                        />
                      </Typography>
                      <Typography sx={{ fontWeight: 600 }} variant="body2">
                        {!isActive ? <Skeleton /> : truncateAddress(account)}
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
              </Grid>
              <Grid item>
                <Card>
                  <Stack
                    direction="row"
                    alignContent="center"
                    alignItems="center"
                    spacing={2}
                    sx={{ p: 2 }}
                  >
                    <Avatar>
                      <Money fontSize="medium" color="action" />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        <FormattedMessage
                          id="estimated.earnings"
                          defaultMessage="Estimated earnings"
                        />
                      </Typography>
                      <Typography sx={{ fontWeight: 600 }} variant="body2">
                        {queryPlayer.isLoading ? (
                          <Skeleton />
                        ) : (
                          <>
                            {ethers.utils.formatUnits(
                              queryPlayer.data?.player
                                ?.estimatedAffiliateEarnings || '0',
                              coinToPlay?.decimals
                            )}{' '}
                            {coinToPlay?.symbol.toUpperCase()}
                          </>
                        )}
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
              </Grid>
              {affiliateUrl && (
                <Grid item xs>
                  <Card>
                    <Stack
                      direction="row"
                      alignItems="center"
                      alignContent="center"
                      spacing={2}
                      sx={{ p: 2 }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <TextField
                          size="small"
                          value={affiliateUrl}
                          fullWidth
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <CopyIconButton
                                  iconButtonProps={{
                                    onClick: handleCopy,
                                    size: 'small',
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
                                  <FileCopy />
                                </CopyIconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>
                      <Button
                        startIcon={<LinkIcon />}
                        variant="contained"
                        color="primary"
                        href={affiliateUrl}
                        LinkComponent={Link}
                        target="_blank"
                      >
                        <FormattedMessage id="open" defaultMessage="Open" />
                      </Button>
                    </Stack>
                  </Card>
                </Grid>
              )}
              <Grid item xs={12}>
                <NoSsr>
                  <AppErrorBoundary
                    fallbackRender={({ resetErrorBoundary }) => (
                      <AppStandardErrorBlock onTryAgain={resetErrorBoundary} />
                    )}
                  >
                    <Suspense fallback={<TableSkeleton cols={4} rows={5} />}>
                      <AffiliateHistoryTable
                        account={account}
                        chainId={chainId}
                      />
                    </Suspense>
                  </AppErrorBoundary>
                </NoSsr>
              </Grid>
            </Grid>
          </Box>
        )}
      </Stack>
    </MainLayout>
  );
};

export default AffiliatesPage;
