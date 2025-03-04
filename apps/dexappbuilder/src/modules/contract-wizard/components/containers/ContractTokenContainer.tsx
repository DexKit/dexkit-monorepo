import { CoinTypes, TOKEN_ICON_URL } from '@dexkit/core';
import { NETWORKS, NETWORK_SLUG } from '@dexkit/core/constants/networks';
import { EvmCoin } from '@dexkit/core/types';
import { convertTokenToEvmCoin } from '@dexkit/core/utils';
import { useTokenList } from '@dexkit/ui';
import TokenDropSummary from '@dexkit/ui/modules/token/components/TokenDropSummary';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { Button, Divider, Tab, Tabs } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useQuery } from '@tanstack/react-query';
import { useContract } from '@thirdweb-dev/react';
import dynamic from 'next/dynamic';
import { SyntheticEvent, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import ContractAdminTab from '../ContractAdminTab';
import ContractMetadataTab from '../ContractMetadataTab';
import BurnTokenDialog from '../dialogs/BurnNftDIalog';

const EvmTransferCoinDialog = dynamic(
  () =>
    import(
      '@dexkit/ui/modules/evm-transfer-coin/components/dialogs/EvmSendDialog'
    ),
);

const EvmMintTokenDialog = dynamic(
  () =>
    import(
      '@dexkit/ui/modules/evm-mint-token/components/dialogs/EvmMintTokenDialog'
    ),
);

interface ContractTokenDropContainerProps {
  address: string;
  network: string;
}

export default function ContractTokenContainer({
  address,
  network,
}: ContractTokenDropContainerProps) {
  const { data: contract, isLoading } = useContract(address, 'token-drop');

  const [currTab, setCurrTab] = useState('token');

  const handleChange = (e: SyntheticEvent, value: string) => {
    setCurrTab(value);
  };

  const [showBurn, setShowBurn] = useState(false);
  const [showMint, setShowMint] = useState(false);

  const handleCloseBurn = () => {
    setShowBurn(false);
  };

  const handleCloseMint = () => {
    setShowMint(false);
  };

  const handleBurn = () => {
    setShowBurn(true);
  };

  const handleMint = () => {
    setShowMint(true);
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
      {token && chainId && showMint && (
        <EvmMintTokenDialog
          DialogProps={{
            open: showMint,
            maxWidth: 'sm',
            fullWidth: true,
            onClose: handleCloseMint,
          }}
          chainId={chainId}
          account={account}
          token={{
            address: address,
            chainId: chainId,
            decimals: token.decimals,
            symbol: token.symbol,
            name: token.name,
            logoURI: TOKEN_ICON_URL(address, chainId),
          }}
        />
      )}

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
          provider: provider,
          coins: token
            ? [...tokens.map(convertTokenToEvmCoin), token]
            : tokens.map(convertTokenToEvmCoin),
          defaultCoin: token,
        }}
      />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TokenDropSummary contract={contract} />
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>

        <Grid item xs={12}>
          <Tabs value={currTab} onChange={handleChange}>
            <Tab
              value="token"
              label={<FormattedMessage id="token" defaultMessage="Token" />}
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

        {currTab === 'token' && (
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item>
                <Button
                  onClick={handleMint}
                  variant="contained"
                  disabled={NETWORK_SLUG(chainId) !== network}
                >
                  <FormattedMessage id="mint" defaultMessage="Mint" />
                </Button>
              </Grid>
              <Grid item>
                <Button
                  onClick={handleBurn}
                  variant="contained"
                  disabled={NETWORK_SLUG(chainId) !== network}
                >
                  <FormattedMessage id="burn" defaultMessage="Burn" />
                </Button>
              </Grid>
              <Grid item>
                <Button
                  onClick={handleShowTransfer}
                  variant="contained"
                  disabled={NETWORK_SLUG(chainId) !== network}
                >
                  <FormattedMessage id="transfer" defaultMessage="Transfer" />
                </Button>
              </Grid>
            </Grid>
          </Grid>
        )}
        {currTab === 'metadata' && (
          <Grid item xs={12}>
            <ContractMetadataTab address={address} />
          </Grid>
        )}
        {currTab === 'admin' && (
          <Grid item xs={12}>
            <ContractAdminTab address={address} />
          </Grid>
        )}
      </Grid>
    </>
  );
}
