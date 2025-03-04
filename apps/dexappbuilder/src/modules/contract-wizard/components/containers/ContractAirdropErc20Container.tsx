import SelectTokenDialog from '@/modules/swap/dialogs/SelectTokenDialog';
import { Token } from '@dexkit/core/types';
import { formatBigNumber, isAddressEqual } from '@dexkit/core/utils';
import { formatUnits } from '@dexkit/core/utils/ethers/formatUnits';
import { parseUnits } from '@dexkit/core/utils/ethers/parseUnits';
import { useDexKitContext } from '@dexkit/ui';
import { useThirdwebApprove } from '@dexkit/ui/modules/contract-wizard/hooks/thirdweb';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { useAsyncMemo } from '@dexkit/widgets/src/hooks';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  NATIVE_TOKEN_ADDRESS,
  useBalance,
  useContract,
} from '@thirdweb-dev/react';
import { BigNumber, constants } from 'ethers';
import { useSnackbar } from 'notistack';
import { SyntheticEvent, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import ContractAdminTab from '../ContractAdminTab';
import ContractMetadataTab from '../ContractMetadataTab';
import AirdropDialog from '../dialogs/AirdropDialog';

export interface ContractAirdropErc20ContainerProps {
  address: string;
  network: string;
}

export default function ContractAirdropErc20Container({
  address,
  network,
}: ContractAirdropErc20ContainerProps) {
  const { data: contract } = useContract(address as string);
  const [recipients, setRecipients] = useState<
    { address: string; quantity: string }[]
  >([]);

  const [tokenAddress, setTokenAddress] = useState<string>();
  const { account } = useWeb3React();

  const { data: tokenContract, isLoading: isLoadingToken } = useContract(
    tokenAddress,
    'token',
  );

  const { data: allowance } = useQuery(
    ['REWARD_TOKEN_ALLOWANCE', tokenAddress],
    async () => {
      return await tokenContract?.erc20.allowance(address);
    },
  );

  const approve = useThirdwebApprove({ contract: tokenContract, address });

  const { chainId } = useWeb3React();

  const { createNotification, watchTransactionDialog } = useDexKitContext();

  const { data: tokenBalance, isLoading } = useBalance(
    tokenAddress !== NATIVE_TOKEN_ADDRESS &&
      tokenAddress !== constants.AddressZero
      ? tokenAddress
      : undefined,
  );

  const [totalAmount, totalAmountFormatted] = useAsyncMemo(
    async () => {
      const metadata = await tokenContract?.erc20.get();

      const amount = recipients
        .map((r) => parseUnits(r.quantity, metadata?.decimals))
        .reduce((prev, curr) => {
          return prev.add(curr);
        }, BigNumber.from(0));

      return [
        amount,
        `${formatUnits(amount, metadata?.decimals)} ${metadata?.symbol}`,
      ];
    },
    [BigNumber.from(0), '0.0'],
    [recipients, tokenContract],
  );

  const { enqueueSnackbar } = useSnackbar();

  const airdropMutation = useMutation(
    async ({
      recipients,
    }: {
      recipients: { address: string; quantity: string }[];
    }) => {
      const metadata = await tokenContract?.erc20.get();

      const amount = recipients
        .map((r) => parseUnits(r.quantity, metadata?.decimals))
        .reduce((prev, curr) => {
          return prev.add(curr);
        }, BigNumber.from(0));

      if (
        !isAddressEqual(tokenAddress, NATIVE_TOKEN_ADDRESS) &&
        !isAddressEqual(tokenAddress, constants.AddressZero)
      ) {
        if (!allowance?.value.gte(amount)) {
          await approve.mutateAsync({
            amount: formatUnits(amount, metadata?.decimals),
          });
        }
      }

      const values = {
        name: metadata?.name || '',
        amount: formatUnits(amount, metadata?.decimals),
      };

      if (!account || !tokenAddress) {
        return;
      }

      watchTransactionDialog.open('airdropErc20', values);

      try {
        let call = await contract?.airdrop20.drop.prepare(
          isAddressEqual(tokenAddress, NATIVE_TOKEN_ADDRESS) ||
            isAddressEqual(tokenAddress, constants.AddressZero)
            ? NATIVE_TOKEN_ADDRESS
            : tokenAddress,
          account,
          recipients.map((r) => ({
            recipient: r.address,
            amount: parseUnits(r.quantity, metadata?.decimals).toString(),
          })),
        );

        if (isAddressEqual(tokenAddress, NATIVE_TOKEN_ADDRESS)) {
          call?.setValue(totalAmount);
        }

        const tx = await call?.send();

        if (tx?.hash && chainId) {
          createNotification({
            type: 'transaction',
            subtype: 'airdropErc20',
            metadata: {
              hash: tx.hash,
              chainId,
            },
            values: values,
          });

          watchTransactionDialog.watch(tx?.hash);
        }

        return await tx?.wait();
      } catch (err) {
        enqueueSnackbar(String(err), { variant: 'error' });
        watchTransactionDialog.close();
        throw err;
      }
    },
  );

  const handleConfirm = (data: { address: string; quantity: string }[]) => {
    setRecipients(data);
  };

  const [showAirdrop, setShowAirdrop] = useState(false);

  const handleSelectRecipients = () => {
    setShowAirdrop(true);
  };

  const handleClose = () => {
    setShowAirdrop(false);
  };

  const handleAirdrop = async () => {
    await airdropMutation.mutateAsync({ recipients });
  };

  const [showSelectToken, setShowSelectToken] = useState(false);

  const handleCloseSelectToken = () => {
    setShowSelectToken(false);
  };

  const handleSelect = (token: Token) => {
    setTokenAddress(token.address);
    handleCloseSelectToken();
  };

  const handleShowSelectToken = () => {
    setShowSelectToken(true);
  };

  const [currTab, setCurrTab] = useState('airdrop');

  const handleChange = (e: SyntheticEvent, value: string) => {
    setCurrTab(value);
  };

  return (
    <>
      <AirdropDialog
        DialogProps={{
          open: showAirdrop,
          onClose: handleClose,
          fullWidth: true,
          maxWidth: 'lg',
        }}
        onConfirm={handleConfirm}
        value={recipients}
      />
      <SelectTokenDialog
        dialogProps={{ open: showSelectToken, onClose: handleCloseSelectToken }}
        onSelect={handleSelect}
        enableImport={true}
        chainId={chainId}
        includeNative
      />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Tabs value={currTab} onChange={handleChange}>
            <Tab
              value="airdrop"
              label={<FormattedMessage id="airdrop" defaultMessage="Airdrop" />}
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
        {currTab === 'airdrop' && (
          <>
            <Grid item xs={12}>
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Card>
                      <CardContent>
                        {tokenAddress ? (
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            spacing={2}
                          >
                            <Box>
                              <Box sx={{ mb: !tokenAddress ? 0.5 : 0 }}>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  <FormattedMessage
                                    id="your.airdrop.balance"
                                    defaultMessage="Your airdrop balance"
                                  />
                                </Typography>
                              </Box>
                              <Typography variant="h6">
                                {isLoading ? (
                                  <Skeleton />
                                ) : (
                                  `${formatBigNumber(
                                    tokenBalance?.value,
                                    tokenBalance?.decimals,
                                  )} ${tokenBalance?.symbol.toUpperCase()}`
                                )}
                              </Typography>
                            </Box>
                            <Button
                              onClick={handleShowSelectToken}
                              size="small"
                              variant="outlined"
                            >
                              <FormattedMessage
                                id="select"
                                defaultMessage="Select"
                              />
                            </Button>
                          </Stack>
                        ) : (
                          <Stack alignItems="flex-start" spacing={0.5}>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              <FormattedMessage
                                id="select.a.token.for.your.airdrop"
                                defaultMessage="Select a token for your airdrop"
                              />
                            </Typography>
                            <Button
                              onClick={handleShowSelectToken}
                              size="small"
                              variant="outlined"
                            >
                              <FormattedMessage
                                id="select"
                                defaultMessage="Select"
                              />
                            </Button>
                          </Stack>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card>
                      <CardContent>
                        {isLoadingToken && tokenAddress ? (
                          <>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              <FormattedMessage
                                id="total.for.airdrop"
                                defaultMessage="Total for Airdrop"
                              />
                            </Typography>
                            <Skeleton>
                              {' '}
                              <Typography variant="h5">0.00 Token</Typography>
                            </Skeleton>
                          </>
                        ) : (
                          <>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              <FormattedMessage
                                id="total.for.airdrop"
                                defaultMessage="Total for Airdrop"
                              />
                            </Typography>
                            <Typography variant="h5">
                              {tokenAddress ? totalAmountFormatted : '0.00'}
                            </Typography>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card>
                      <CardContent>
                        <Stack
                          spacing={2}
                          justifyContent="space-between"
                          direction="row"
                          alignItems="center"
                        >
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              <FormattedMessage
                                id="total.recipients"
                                defaultMessage="Total recipients"
                              />
                            </Typography>
                            <Typography variant="h5">
                              {recipients.length}
                            </Typography>
                          </Box>
                          <Button
                            size="small"
                            disabled={airdropMutation.isLoading}
                            onClick={handleSelectRecipients}
                            variant="outlined"
                          >
                            <FormattedMessage
                              id="select.recipients"
                              defaultMessage="Select"
                            />
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={2}>
                <Divider />
                {tokenBalance && totalAmount.gt(tokenBalance.value) && (
                  <Alert severity="error">
                    <FormattedMessage
                      id="you.do.not.have.enough.balance.for.your.airdrop"
                      defaultMessage="You do not have enough balance for your Airdrop"
                    />
                  </Alert>
                )}

                <Stack direction="row">
                  <Button
                    startIcon={
                      airdropMutation.isLoading ? (
                        <CircularProgress color="inherit" size="1rem" />
                      ) : undefined
                    }
                    disabled={
                      recipients.length === 0 ||
                      airdropMutation.isLoading ||
                      !tokenAddress ||
                      (tokenBalance && totalAmount.gt(tokenBalance.value))
                    }
                    onClick={handleAirdrop}
                    variant="contained"
                  >
                    <FormattedMessage id="airdrop" defaultMessage="Airdrop" />
                  </Button>
                </Stack>
              </Stack>
            </Grid>
          </>
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
