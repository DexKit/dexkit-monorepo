import { CoinTypes } from '@dexkit/core';
import { NETWORKS } from '@dexkit/core/constants/networks';
import { EvmCoin } from '@dexkit/core/types';
import { convertTokenToEvmCoin } from '@dexkit/core/utils';
import { useTokenList } from '@dexkit/ui';
import TokenDropSummary from '@dexkit/ui/modules/token/components/TokenDropSummary';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { Alert, Button, Divider, Tab, Tabs, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useQuery } from '@tanstack/react-query';
import { useContract, useContractRead } from '@thirdweb-dev/react';
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

const EvmApproveTokenDialog = dynamic(
  () =>
    import(
      '@dexkit/ui/modules/evm-approve-token/components/dialogs/EvmApproveTokenDialog'
    ),
);

interface ContractTokenDropContainerProps {
  address: string;
  network: string;
}

export default function ContractTokenAllowanceDropContainer({
  address,
  network,
}: ContractTokenDropContainerProps) {
  const { data: dropContract } = useContract(address);

  const { data: contract, isLoading } = useContract(address, 'token-drop');
  const { data: tokenAddress } = useContractRead(dropContract, 'token');
  const { data: tokenOwner } = useContractRead(dropContract, 'tokenOwner');
  const { data: tokenContract, isLoading: isLoadingToken } = useContract(
    tokenAddress,
    'token',
  );

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

  const [showApprove, setShowApprove] = useState(false);

  const handleShowApprove = () => {
    setShowApprove(true);
  };

  const handleCloseApprove = () => {
    setShowApprove(false);
  };

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

        const meta = await tokenContract?.erc20.get();
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

  const { data: allowance } = useQuery(
    ['GET_TOKEN_ALLOWANCE_ON_DROP', isLoadingToken, address, chainId],
    async () => {
      if (chainId && tokenContract) {
        return await tokenContract?.allowanceOf(tokenOwner, address);
      }
      return null;
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
      {token && (
        <EvmApproveTokenDialog
          DialogProps={{
            onClose: handleCloseApprove,
            open: showApprove,
            maxWidth: 'sm',
            fullWidth: true,
          }}
          chainId={chainId}
          spender={address}
          account={account}
          token={{
            address: tokenAddress,
            name: token?.name as string,
            decimals: token?.decimals as number,
            chainId: chainId as number,
            symbol: token?.symbol as string,
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
          <Grid item xs={12}>
            <ClaimConditionsContainer address={address} network={network} />
          </Grid>
        )}
        {currTab === 'token' && (
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {tokenOwner?.toLowerCase() !== account?.toLowerCase() && (
                <>
                  <Grid item>
                    <Alert severity={'info'}>
                      {' '}
                      {
                        <FormattedMessage
                          id="change.wallet.to.account.to.give.allowance.value"
                          defaultMessage="Change wallet to {account} to give allowance to drop contract"
                          values={{ account: tokenOwner?.toLowerCase() || ' ' }}
                        />
                      }
                    </Alert>
                  </Grid>
                </>
              )}

              {tokenOwner?.toLowerCase() === account?.toLowerCase() && (
                <>
                  <Grid item xs={12}>
                    <Typography>
                      {' '}
                      <FormattedMessage
                        id="drop.allowance.value.symbol"
                        defaultMessage="Drop allowance {value} {symbol}"
                        values={{
                          value: allowance?.displayValue || ' ',
                          symbol: allowance?.symbol || ' ',
                        }}
                      />
                    </Typography>
                  </Grid>

                  <Grid item>
                    <Button
                      onClick={handleShowApprove}
                      variant="contained"
                      disabled={!token}
                    >
                      <FormattedMessage id="approve" defaultMessage="Approve" />
                    </Button>
                  </Grid>
                </>
              )}
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
