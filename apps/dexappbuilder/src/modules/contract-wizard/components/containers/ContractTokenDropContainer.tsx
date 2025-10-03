import { CoinTypes } from '@dexkit/core';
import { NETWORKS } from '@dexkit/core/constants/networks';
import { EvmCoin } from '@dexkit/core/types';
import { convertTokenToEvmCoin } from '@dexkit/core/utils';
import { useTokenList } from '@dexkit/ui';
import TokenDropSummary from '@dexkit/ui/modules/token/components/TokenDropSummary';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { Button, Divider, Tab, Tabs, useMediaQuery, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useQuery } from '@tanstack/react-query';
import { useContract } from '@thirdweb-dev/react';
import dynamic from 'next/dynamic';
import { SyntheticEvent, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import ContractAdminTab from '../ContractAdminTab';
import ContractMetadataTab from '../ContractMetadataTab';
import BurnTokenDialog from '../dialogs/BurnNftDIalog';
import { ClaimConditionsContainer } from './ClaimConditionsContainer';

const EvmTransferCoinDialog = dynamic(
  () =>
    import(
      '@dexkit/ui/modules/evm-transfer-coin/components/dialogs/EvmSendDialog'
    ),
);

interface ContractTokenDropContainerProps {
  address: string;
  network: string;
}

export default function ContractTokenDropContainer({
  address,
  network,
}: ContractTokenDropContainerProps) {
  const { data: contract, isLoading } = useContract(address, 'token-drop');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [currTab, setCurrTab] = useState('token');

  const handleChange = (e: SyntheticEvent, value: string) => {
    setCurrTab(value);
  };

  const [showBurn, setShowBurn] = useState(false);

  const handleCloseBurn = () => {
    setShowBurn(false);
  };

  const handleBurn = () => {
    setShowBurn(true);
  };

  const { account, provider, chainId, ENSName } = useWeb3React();

  const tokens = useTokenList({ chainId, includeNative: true });

  const [showTransfer, setShowTransfer] = useState(false);

  const handleCloseTransfer = () => {
    setShowTransfer(false);
  };

  const handleShowTransfer = () => {
    setShowTransfer(true);
  };

  const { data: token } = useQuery(
    ['GET_TOKEN_METADATA', chainId, isLoading, address],
    async () => {
      if (chainId) {
        const network = NETWORKS[chainId];

        const meta = await contract?.erc20.get();
        if (meta) {
          return {
            coinType: CoinTypes.EVM_ERC20,
            contractAddress: address,
            decimals: meta.decimals,
            symbol: meta.symbol,
            name: meta.name,
            network: {
              id: network.slug || '',
              name: network.name,
              chainId: chainId,
              coingeckoPlatformId: network.coingeckoPlatformId,
              icon: network.imageUrl,
            },
          } as EvmCoin;
        }
      }
    },
  );

  return (
    <>
      <BurnTokenDialog
        DialogProps={{
          onClose: handleCloseBurn,
          open: showBurn,
          maxWidth: 'sm',
          fullWidth: true,
        }}
        contractAddress={address}
      />
      <EvmTransferCoinDialog
        dialogProps={{
          open: showTransfer,
          onClose: handleCloseTransfer,
          fullWidth: true,
          maxWidth: 'sm',
        }}
        params={{
          ENSName,
          account: account,
          chainId: chainId,

          coins: token
            ? [...tokens.map(convertTokenToEvmCoin), token]
            : tokens.map(convertTokenToEvmCoin),
          defaultCoin: token,
        }}
      />
      <Grid container spacing={isMobile ? 1 : 2}>
        <Grid size={12}>
          <TokenDropSummary contract={contract} />
        </Grid>
        <Grid size={12}>
          <Divider />
        </Grid>

        <Grid size={12}>
          <Tabs
            value={currTab}
            onChange={handleChange}
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons={isMobile ? "auto" : false}
            allowScrollButtonsMobile={isMobile}
            sx={{
              '& .MuiTab-root': {
                fontSize: isMobile ? '0.75rem' : '0.875rem',
                minHeight: isMobile ? 40 : 48,
                padding: isMobile ? theme.spacing(0.5, 1) : theme.spacing(1, 2),
                minWidth: isMobile ? 'auto' : 160,
              },
              '& .MuiTabs-indicator': {
                height: isMobile ? 2 : 3,
              }
            }}
          >
            <Tab
              value="token"
              label={<FormattedMessage id="token" defaultMessage="Token" />}
            />
            <Tab
              value="claim-conditions"
              label={
                <FormattedMessage
                  id="claim.conditions"
                  defaultMessage="Claim Conditions"
                />
              }
            />
            <Tab
              value="metadata"
              label={
                <FormattedMessage id="metadata" defaultMessage="Metadata" />
              }
            />
            <Tab
              value="admin"
              label={<FormattedMessage id="admin" defaultMessage="Admin" />}
            />
          </Tabs>
        </Grid>
        {currTab === 'claim-conditions' && (
          <Grid size={12}>
            <ClaimConditionsContainer address={address} network={network} />
          </Grid>
        )}
        {currTab === 'token' && (
          <Grid size={12}>
            <Grid container spacing={isMobile ? 1 : 2}>
              <Grid size={isMobile ? 6 : 'auto'}>
                <Button
                  onClick={handleBurn}
                  variant="contained"
                  size={isMobile ? "small" : "medium"}
                  fullWidth={isMobile}
                  sx={{
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                    py: isMobile ? 0.75 : 1,
                    px: isMobile ? 1 : 2,
                  }}
                >
                  <FormattedMessage id="burn" defaultMessage="Burn" />
                </Button>
              </Grid>
              <Grid size={isMobile ? 6 : 'auto'}>
                <Button
                  onClick={handleShowTransfer}
                  variant="contained"
                  size={isMobile ? "small" : "medium"}
                  fullWidth={isMobile}
                  sx={{
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                    py: isMobile ? 0.75 : 1,
                    px: isMobile ? 1 : 2,
                  }}
                >
                  <FormattedMessage id="transfer" defaultMessage="Transfer" />
                </Button>
              </Grid>
            </Grid>
          </Grid>
        )}
        {currTab === 'metadata' && (
          <Grid size={12}>
            <ContractMetadataTab address={address} />
          </Grid>
        )}
        {currTab === 'admin' && (
          <Grid size={12}>
            <ContractAdminTab address={address} />
          </Grid>
        )}
      </Grid>
    </>
  );
}
