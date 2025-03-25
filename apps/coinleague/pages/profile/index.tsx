import type { NextPage } from 'next';

import MainLayout from '@/modules/common/components/layouts/MainLayout';

import AppPageHeader from '@/modules/common/components/AppPageHeader';
import MagicNetworkSelect from '@/modules/common/components/MagicNetworkSelect';
import KittygotchiPreviewDialog from '@/modules/profile/components/dialogs/KittygotchiPreviewDialog';
import KittygotchiProfileCard from '@/modules/profile/components/KittygotchiProfileCard';
import KittygotchiRankingCard from '@/modules/profile/components/KittygotchiRankingCard';
import { Box, Grid, NoSsr, Stack } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { NextSeo } from 'next-seo';
import { useCallback, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

const ProfilePage: NextPage = () => {
  const { chainId, provider } = useWeb3React();

  const { formatMessage } = useIntl();

  const [showPreview, setShowPreview] = useState(false);
  const [tokenId, setTokenId] = useState<string>();
  const handleClickRanking = useCallback((tokenId: string) => {
    setTokenId(tokenId);
    setShowPreview(true);
  }, []);

  const handleClosePreview = () => {
    setShowPreview(false);
    setTokenId(undefined);
  };

  return (
    <>
      <NextSeo
        title={formatMessage({
          id: 'profile',
          defaultMessage: 'Profile',
        })}
      />
      <KittygotchiPreviewDialog
        tokenId={tokenId}
        chainId={chainId}
        provider={provider}
        DialogProps={{
          onClose: handleClosePreview,
          open: showPreview,
          maxWidth: 'xs',
          fullWidth: true,
        }}
      />
      <MainLayout>
        <Stack spacing={2}>
          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={2}
              alignItems="center"
              alignContent="center"
            >
              <AppPageHeader
                breadcrumbs={[
                  {
                    caption: (
                      <FormattedMessage id="home" defaultMessage="Home" />
                    ),
                    uri: '/',
                  },
                  {
                    caption: (
                      <FormattedMessage id="profile" defaultMessage="Profile" />
                    ),
                    uri: '/coinleague',
                    active: true,
                  },
                ]}
              />
              <MagicNetworkSelect SelectProps={{ size: 'small' }} />
            </Stack>
          </Box>
          <Box>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={4}>
                <NoSsr>
                  <KittygotchiProfileCard chainId={chainId} />
                </NoSsr>
              </Grid>
              <Grid item xs={12} sm={4}>
                <KittygotchiRankingCard
                  onClick={handleClickRanking}
                  chainId={chainId}
                />
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </MainLayout>
    </>
  );
};

export default ProfilePage;
