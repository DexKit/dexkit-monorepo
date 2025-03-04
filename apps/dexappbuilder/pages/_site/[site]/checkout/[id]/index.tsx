import CheckoutItemList from '@/modules/checkout/components/CheckoutItemList';
import CheckoutTokenAutocomplete from '@/modules/checkout/components/CheckoutTokenAutocomplete';
import CheckoutConfirmDialog from '@/modules/checkout/components/dialogs/CheckoutConfirmDialog';
import { ChainId, useErc20Balance } from '@dexkit/core';
import { ERC20Abi } from '@dexkit/core/constants/abis';
import { NETWORKS } from '@dexkit/core/constants/networks';
import { DexkitApiProvider } from '@dexkit/core/providers';
import { Token } from '@dexkit/core/types';
import { ipfsUriToUrl, parseChainId } from '@dexkit/core/utils';
import {
  useActiveChainIds,
  useConnectWalletDialog,
  useSwitchNetworkMutation,
} from '@dexkit/ui';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import {
  useCheckoutData,
  useCheckoutItems,
  useConfirmCheckout,
} from '@dexkit/ui/hooks/payments';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import Wallet from '@mui/icons-material/Wallet';
import {
  Alert,
  Avatar,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { QueryClient, dehydrate, useMutation } from '@tanstack/react-query';
import { BigNumber, ethers } from 'ethers';
import {
  GetStaticPaths,
  GetStaticPathsContext,
  GetStaticProps,
  GetStaticPropsContext,
} from 'next';
import { useSnackbar } from 'notistack';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import AuthMainLayout from 'src/components/layouts/authMain';
import { getAppConfig } from 'src/services/app';
import { myAppsApi } from 'src/services/whitelabel';

export interface CheckoutPageProps {
  id: string;
}

const tokens: Token[] = [
  {
    address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    chainId: 137,
    decimals: 6,
    logoURI:
      'https://raw.githubusercontent.com/dexkit/icons/master/token/usdc.jpg',
    name: 'USD Coin',
    symbol: 'USDC',
  },
  {
    address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    chainId: 137,
    decimals: 6,
    logoURI:
      'https://raw.githubusercontent.com/dexkit/icons/master/token/usdt.jpg',
    name: 'Tether USD',
    symbol: 'USDT',
  },
  {
    address: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
    chainId: 250,
    decimals: 6,
    logoURI:
      'https://raw.githubusercontent.com/dexkit/icons/master/token/usdc.jpg',
    name: 'USD Coin',
    symbol: 'USDC',
  },
  {
    address: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7',
    chainId: 43114,
    decimals: 6,
    logoURI:
      'https://raw.githubusercontent.com/dexkit/icons/master/token/usdt.jpg',
    name: 'Tether USD',
    symbol: 'USDT',
  },
  {
    address: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e',
    decimals: 6,
    name: 'USD Coin',
    symbol: 'USDC',
    coingeckoId: 'usdc',
    chainId: 43114,
    logoURI:
      'https://github.com/trustwallet/assets/blob/master/blockchains/binance/assets/USDC-CD2/logo.png?raw=true',
  },
  {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    chainId: 1,
    decimals: 6,
    logoURI:
      'https://raw.githubusercontent.com/dexkit/icons/master/token/usdc.jpg',
    name: 'USD Coin',
    symbol: 'USDC',
  },
  {
    address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
    chainId: 10,
    decimals: 6,
    logoURI:
      'https://raw.githubusercontent.com/dexkit/icons/master/token/usdc.jpg',
    name: 'USD Coin',
    symbol: 'USDC',
  },
  {
    address: '0x55d398326f99059fF775485246999027B3197955',
    chainId: 56,
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/dexkit/icons/master/token/usdt.jpg',
    name: 'USDT',
    symbol: 'USDT',
  },
  {
    address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    chainId: 56,
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/dexkit/icons/master/token/usdc.jpg',
    name: 'USDC',
    symbol: 'USDC',
  },
];

export default function CheckoutPage({ id }: CheckoutPageProps) {
  const checkoutItemsQuery = useCheckoutItems({ id: id });
  const { activeChainIds } = useActiveChainIds();

  const [token, setToken] = useState<Token | null>();

  const [hash, setHash] = useState<string>();

  const total = useMemo(() => {
    if (token?.decimals) {
      return checkoutItemsQuery.data
        ?.map((item: any) =>
          BigNumber.from(item.amount).mul(
            BigNumber.from(item.price).mul(
              BigNumber.from('10').pow(token?.decimals),
            ),
          ),
        )
        .reduce((prev, curr) => {
          return prev.add(curr);
        }, BigNumber.from(0));
    }
  }, [checkoutItemsQuery.data, token?.decimals]);

  const { provider, account, isActive } = useWeb3React();
  const balanceQuery = useErc20Balance(provider, token?.address, account);

  const confirmCheckoutMutation = useConfirmCheckout();

  const checkoutQuery = useCheckoutData({ id });

  const transferMutation = useMutation(
    async ({
      address,
      amount,
      token,
      onSubmit,
    }: {
      address: string;
      amount: BigNumber;
      token?: Token;
      onSubmit: (hash: string) => void;
    }) => {
      if (token) {
        const contract = new ethers.Contract(
          token?.address,
          ERC20Abi,
          provider?.getSigner(),
        );

        const tx = await contract.transfer(address, amount);

        onSubmit(tx.hash);

        return await tx.wait();
      }
    },
  );

  const { enqueueSnackbar } = useSnackbar();

  const handleConfirm = async () => {
    if (total && token && checkoutQuery.data?.receiver) {
      try {
        await transferMutation.mutateAsync({
          address: checkoutQuery.data?.receiver,
          amount: total,
          token,
          onSubmit: async (hash: string) => {
            setHash(hash);

            if (token) {
              await confirmCheckoutMutation.mutateAsync({
                chainId: token?.chainId,
                checkoutId: id,
                tokenAddress: token?.address,
                txHash: hash,
              });

              await checkoutQuery.refetch();
            }
          },
        });
      } catch (err) {
        enqueueSnackbar(
          <FormattedMessage
            id="error.while.tranfer"
            defaultMessage="Error while transfer"
          />,
          { variant: 'error' },
        );
      }
    }
  };

  const handleChangeToken = (token: Token | null) => {
    setToken(token);
  };

  const { handleConnectWallet } = useConnectWalletDialog();

  const hasSufficientBalance = useMemo(() => {
    if (total && balanceQuery.data) {
      return balanceQuery.data?.gte(total);
    }
    return false;
  }, [total, balanceQuery.data]);

  const [open, setOpen] = useState(false);

  const handlePay = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const disabled = useMemo(() => {
    return (
      checkoutQuery.data &&
      ['confirmed', 'expired'].includes(checkoutQuery.data?.status)
    );
  }, [checkoutQuery.data]);

  const networks = useMemo(() => {
    return Object.keys(NETWORKS)
      .map((key: string) => NETWORKS[parseChainId(key)])
      .filter((n) => {
        let token = tokens.find((t) => t.chainId === n.chainId);

        return Boolean(token);
      });
  }, []);

  const { chainId: providerChainId } = useWeb3React();

  const [chainId, setChainId] = useState<ChainId>();

  useEffect(() => {
    if (providerChainId) {
      setChainId(providerChainId);
      setToken(tokens.find((t) => t.chainId === providerChainId));
    }
  }, [providerChainId]);

  const switchNetwork = useSwitchNetworkMutation();

  const handleSwitchNetwork = async () => {
    if (chainId) {
      await switchNetwork.mutateAsync({ chainId });
    }
  };

  const handleChangeNetwork = (
    e: SelectChangeEvent<number>,
    child: ReactNode,
  ) => {
    const newChainId = e.target.value as number;

    setChainId(newChainId);

    let newToken = tokens.filter((t) => t.chainId === newChainId)[0];

    setToken(newToken);
  };

  const renderPayButton = () => {
    if (chainId && providerChainId && chainId !== providerChainId) {
      return (
        <Button
          onClick={handleSwitchNetwork}
          startIcon={
            switchNetwork.isLoading ? (
              <CircularProgress size="1rem" color="inherit" />
            ) : undefined
          }
          fullWidth
          disabled={switchNetwork.isLoading}
          variant="contained"
          size="large"
        >
          <FormattedMessage
            id="switch.to.network.network"
            defaultMessage="Switch to {network} network"
            values={{
              network: networks.find((n) => n.chainId === chainId)?.name,
            }}
          />
        </Button>
      );
    }

    if (isActive) {
      return (
        <Button
          disabled={!hasSufficientBalance || disabled || !token}
          fullWidth
          onClick={handlePay}
          variant="contained"
          size="large"
        >
          {disabled ? (
            <FormattedMessage
              id="not.available"
              defaultMessage="Not available"
            />
          ) : hasSufficientBalance ? (
            <FormattedMessage
              id="pay.amount.symbol"
              defaultMessage="Pay {amount} {tokenSymbol}"
              values={{
                tokenSymbol: token?.symbol,
                amount:
                  total && ethers.utils.formatUnits(total, token?.decimals),
              }}
            />
          ) : (
            <FormattedMessage
              id="insufficient.balance"
              defaultMessage="Insufficient balance"
            />
          )}
        </Button>
      );
    }

    return (
      <Button
        onClick={handleConnectWallet}
        startIcon={<Wallet />}
        fullWidth
        variant="contained"
        size="large"
      >
        <FormattedMessage id="connect.wallet" defaultMessage="Connect wallet" />
      </Button>
    );
  };

  return (
    <>
      <CheckoutConfirmDialog
        token={token}
        DialogProps={{
          open,
          maxWidth: 'sm',
          fullWidth: true,
          onClose: handleClose,
        }}
        id={id}
        total={total}
        txHash={hash}
        isLoading={transferMutation.isLoading}
        onConfirm={handleConfirm}
      />
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <PageHeader
              breadcrumbs={[
                {
                  caption: <FormattedMessage id="home" defaultMessage="Home" />,
                  uri: '/',
                },
                {
                  caption: (
                    <FormattedMessage id="checkout" defaultMessage="Checkout" />
                  ),
                  uri: '/checkout/asd8as7d98as',
                  active: true,
                },
              ]}
            />
          </Grid>
          {checkoutQuery.data?.status === 'confirmed' && (
            <Grid item xs={12}>
              <Alert severity="success">
                <FormattedMessage
                  id="payment.confirmed"
                  defaultMessage="Payment Confirmed"
                />
              </Alert>
            </Grid>
          )}

          {checkoutQuery.data?.status === 'expired' && (
            <Grid item xs={12}>
              <Alert severity="warning">
                <FormattedMessage
                  id="payment.confirmed"
                  defaultMessage="Payment expired"
                />
              </Alert>
            </Grid>
          )}

          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  <FormattedMessage id="total" defaultMessage="total" />
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {total &&
                    ethers.utils.formatUnits(total, token?.decimals || 6)}{' '}
                  {token ? token?.symbol : 'USD'}
                </Typography>
              </CardContent>
              <Divider />
              <CheckoutItemList id={id} token={token} />
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Typography variant="body2">
                    <FormattedMessage
                      id="total.usd"
                      defaultMessage="Total in USD"
                    />
                  </Typography>

                  <Typography color="text.secondary" variant="body2">
                    {total &&
                      ethers.utils.formatUnits(
                        total,
                        token?.decimals || 6,
                      )}{' '}
                    USD
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  {chainId !== undefined && (
                    <FormControl fullWidth>
                      <InputLabel>
                        <FormattedMessage
                          id="network"
                          defaultMessage="Network"
                        />
                      </InputLabel>
                      <Select
                        label={
                          <FormattedMessage
                            id="network"
                            defaultMessage="Network"
                          />
                        }
                        disabled={
                          checkoutQuery.data?.status === 'confirmed' ||
                          checkoutQuery.data?.status === 'expired' ||
                          !isActive
                        }
                        onChange={handleChangeNetwork}
                        value={chainId}
                        name="network"
                        fullWidth
                        renderValue={(value: number) => {
                          return (
                            <Stack
                              direction="row"
                              alignItems="center"
                              alignContent="center"
                              spacing={1}
                            >
                              <Avatar
                                src={ipfsUriToUrl(
                                  networks.find((n) => n.chainId === chainId)
                                    ?.imageUrl || '',
                                )}
                                style={{ width: '1rem', height: '1rem' }}
                              />
                              <Typography variant="body1">
                                {
                                  networks.find((n) => n.chainId === chainId)
                                    ?.name
                                }
                              </Typography>
                            </Stack>
                          );
                        }}
                      >
                        {networks
                          .filter((n) => activeChainIds.includes(n.chainId))
                          .map((n) => (
                            <MenuItem key={n.chainId} value={n.chainId}>
                              <ListItemIcon>
                                <Avatar
                                  src={ipfsUriToUrl(n?.imageUrl || '')}
                                  style={{ width: '1rem', height: '1rem' }}
                                />
                              </ListItemIcon>
                              <ListItemText primary={n.name} />
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  )}

                  <CheckoutTokenAutocomplete
                    key={chainId}
                    tokens={tokens}
                    onChange={handleChangeToken}
                    chainId={chainId}
                    token={token}
                    disabled={disabled}
                  />
                  {!token && (
                    <Alert severity="error">
                      <FormattedMessage
                        id="select.a.token.to.pay"
                        defaultMessage="Select a token to pay"
                      />
                    </Alert>
                  )}

                  {token && (
                    <Stack
                      direction="row"
                      spacing={2}
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="body1">
                        <FormattedMessage
                          id="balance"
                          defaultMessage="Balance"
                        />
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {balanceQuery.data ? (
                          ethers.utils.formatUnits(
                            balanceQuery.data,
                            token?.decimals,
                          )
                        ) : (
                          <Skeleton />
                        )}{' '}
                        {token?.symbol}
                      </Typography>
                    </Stack>
                  )}

                  {renderPayButton()}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

(CheckoutPage as any).getLayout = function getLayout(page: any) {
  return (
    <AuthMainLayout noSsr>
      <DexkitApiProvider.Provider value={{ instance: myAppsApi }}>
        {page}
      </DexkitApiProvider.Provider>
    </AuthMainLayout>
  );
};

type Params = {
  site?: string;
  id?: string;
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  const queryClient = new QueryClient();

  const configResponse = await getAppConfig(params?.site, 'home');

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      ...configResponse,
      id: params?.id,
    },
    revalidate: 300,
  };
};

export const getStaticPaths: GetStaticPaths<
  Params
> = ({}: GetStaticPathsContext) => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};
