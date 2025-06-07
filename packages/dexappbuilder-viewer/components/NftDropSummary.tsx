import { useIsMobile } from '@dexkit/core';
import { ConnectWalletMessage } from '@dexkit/ui/components';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { Skeleton, Stack, Typography } from '@mui/material';
import {
  NFTDrop,
  useClaimedNFTSupply,
  useUnclaimedNFTSupply,
} from '@thirdweb-dev/react';
import { FormattedMessage } from 'react-intl';

export interface NFTDropSummaryProps {
  contract?: NFTDrop;
}

export default function NFTDropSummary({ contract }: NFTDropSummaryProps) {
  const isMobile = useIsMobile();
  const { account } = useWeb3React();

  const unclaimedSupply = useUnclaimedNFTSupply(contract);
  const claimedSupply = useClaimedNFTSupply(contract);

  return (
    <Stack spacing={{ sm: 2, xs: 0 }} direction={{ sm: 'row', xs: 'column' }}>
      <Stack
        justifyContent="space-between"
        direction={{ xs: 'row', sm: 'column' }}
      >
        <Typography
          color="text.secondary"
          variant={isMobile ? 'body1' : 'caption'}
        >
          <FormattedMessage id="total.supply" defaultMessage="Total supply" />
        </Typography>
        <Typography variant={isMobile ? 'body1' : 'h5'}>
          {!account ? (
            <ConnectWalletMessage
              variant="inline"
              title={
                <FormattedMessage
                  id="connect.wallet.to.view.supply"
                  defaultMessage="Connect wallet to view supply"
                />
              }
              showButton={false}
            />
          ) : unclaimedSupply.isLoading || claimedSupply.isLoading ? (
            <Skeleton />
          ) : unclaimedSupply.data && claimedSupply.data ? (
            claimedSupply.data.add(unclaimedSupply.data || 0).toNumber()
          ) : (
            '0'
          )}
        </Typography>
      </Stack>
      <Stack
        justifyContent="space-between"
        direction={{ xs: 'row', sm: 'column' }}
      >
        <Typography
          color="text.secondary"
          variant={isMobile ? 'body1' : 'caption'}
        >
          <FormattedMessage
            id="claimed.supply"
            defaultMessage="Claimed supply"
          />
        </Typography>
        <Typography variant={isMobile ? 'body1' : 'h5'}>
          {!account ? (
            <ConnectWalletMessage
              variant="inline"
              title={
                <FormattedMessage
                  id="connect.wallet.to.view.claimed"
                  defaultMessage="Connect wallet to view claimed"
                />
              }
              showButton={false}
            />
          ) : claimedSupply.isLoading ? (
            <Skeleton />
          ) : (
            claimedSupply.data?.toNumber()
          )}
        </Typography>
      </Stack>
      <Stack
        justifyContent="space-between"
        direction={{ xs: 'row', sm: 'column' }}
      >
        <Typography
          color="text.secondary"
          variant={isMobile ? 'body1' : 'caption'}
        >
          <FormattedMessage
            id="unclaimed.supply"
            defaultMessage="Unclaimed Supply"
          />
        </Typography>
        <Typography variant={isMobile ? 'body1' : 'h5'}>
          {!account ? (
            <ConnectWalletMessage
              variant="inline"
              title={
                <FormattedMessage
                  id="connect.wallet.to.view.unclaimed"
                  defaultMessage="Connect wallet to view unclaimed"
                />
              }
              showButton={false}
            />
          ) : unclaimedSupply.isLoading ? (
            <Skeleton />
          ) : (
            unclaimedSupply.data?.toNumber()
          )}
        </Typography>
      </Stack>
    </Stack>
  );
}
