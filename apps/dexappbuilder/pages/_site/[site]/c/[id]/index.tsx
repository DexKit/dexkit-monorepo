import CheckoutUserItemList from '@/modules/commerce/components/CheckoutUserItemsTable';
import { CHECKOUT_TOKENS } from '@/modules/commerce/constants';
import useUserCheckout from '@/modules/commerce/hooks/checkout/useUserCheckout';
import { sumItems } from '@/modules/commerce/hooks/utils';
import { ChainId, useErc20BalanceQuery } from '@dexkit/core';
import { NETWORKS } from '@dexkit/core/constants/networks';
import { DexkitApiProvider } from '@dexkit/core/providers';
import { Token, TokenWhitelabelApp } from '@dexkit/core/types';
import {
  convertTokenToEvmCoin,
  ipfsUriToUrl,
  parseChainId,
} from '@dexkit/core/utils';
import {
  useActiveChainIds,
  useConnectWalletDialog,
  useSwitchNetworkMutation,
} from '@dexkit/ui';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { myAppsApi } from '@dexkit/ui/constants/api';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import Wallet from '@mui/icons-material/Wallet';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  NoSsr,
  Select,
  SelectChangeEvent,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import Decimal from 'decimal.js';
import { ethers } from 'ethers';
import {
  GetStaticPaths,
  GetStaticPathsContext,
  GetStaticProps,
  GetStaticPropsContext,
} from 'next';
import { useRouter } from 'next/router';
import { ChangeEvent, ReactNode, useEffect, useMemo, useState } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import AuthMainLayout from 'src/components/layouts/authMain';
import { getAppConfig } from 'src/services/app';

import CheckoutConfirmDialog from '@/modules/commerce/components/dialogs/CheckoutConfirmDialog';
import useCheckoutPay from '@/modules/commerce/hooks/checkout/useCheckoutPay';

import useCheckoutNetworks from '@/modules/commerce/hooks/settings/useCheckoutNetworks';
import { UserCheckoutItemsFormSchema } from '@/modules/commerce/schemas';
import { CheckoutItem } from '@/modules/commerce/types';
import CheckoutTokenAutocomplete from '@dexkit/ui/modules/commerce/components/CheckoutTokenAutocomplete';
import { useSiteReceiver } from '@dexkit/ui/modules/commerce/hooks/useSiteReceiver';
import { useEvmTransferMutation } from '@dexkit/ui/modules/evm-transfer-coin/hooks';
import Edit from '@mui/icons-material/Edit';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';

const validEmail = z.string().email();

export interface UserCheckoutProps {
  siteId?: number;
}

export default function UserCheckout({ siteId }: UserCheckoutProps) {
  const router = useRouter();

  const { id } = router.query;

  const { data: receiverData } = useSiteReceiver({ siteId: siteId });

  console.log('siteId', siteId, receiverData);

  const userCheckout = useUserCheckout({ id: id as string });

  // const { data: availNetworks } = useUserCheckoutNetworks({ id: id as string });

  const { activeChainIds } = useActiveChainIds();

  const [open, setOpen] = useState(false);

  const [token, setToken] = useState<Token | null>(null);

  const [chainId, setChainId] = useState<ChainId>();

  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);

  const switchNetwork = useSwitchNetworkMutation();

  const handleSwitchNetwork = async () => {
    if (chainId) {
      await switchNetwork.mutateAsync({ chainId });
    }
  };

  const {
    chainId: providerChainId,
    account,
    isActive,
    provider,
  } = useWeb3React();

  const [hash, setHash] = useState<string>();

  const { mutateAsync: checkoutPay, reset } = useCheckoutPay();

  const { enqueueSnackbar } = useSnackbar();

  const {
    data,
    isLoading: isTransferLoading,
    mutateAsync: transfer,
  } = useEvmTransferMutation({
    provider,
    onConfirm: () => {},
    onSubmit: async (hash, params) => {
      setHash(hash);

      enqueueSnackbar(
        <FormattedMessage
          id="transaction.created"
          defaultMessage="Transaction created"
        />,
        { variant: 'success' },
      );

      if (chainId && token && userCheckout.data && account) {
        try {
          const result = await checkoutPay({
            id: userCheckout.data.id,
            chainId: chainId,
            hash,
            tokenAddress: token?.address,
            senderEmail: email,
            senderAddress: account,
            items,
          });

          enqueueSnackbar(
            <FormattedMessage
              id="order.created.alt"
              defaultMessage="Order created"
            />,
            { variant: 'success' },
          );

          router.push(`/c/orders/${result.id}`);
        } catch (err) {
          enqueueSnackbar(
            <FormattedMessage
              id="error.while.creating.order"
              defaultMessage="Error while creating order"
            />,
            { variant: 'error' },
          );
        }
      }
    },
  });

  const initialValues = useMemo(() => {
    const result = (userCheckout.data?.items ?? ([] as CheckoutItem[])).reduce(
      (prev, curr: CheckoutItem) => {
        prev[curr.id] = {
          quantity: curr.quantity,
          price: curr.price,
        } as { quantity: number; price: string };

        return prev;
      },
      {} as { [key: string]: { quantity: number; price: string } },
    );

    return result;
  }, [userCheckout.data]);

  const [items, setItems] = useState<{
    [key: string]: { quantity: number; price: string };
  }>({});

  const total = useMemo(() => {
    if (Object.keys(items).length > 0 && userCheckout.data?.editable) {
      return Object.keys(items).reduce((prev, curr) => {
        return prev.add(
          new Decimal(items[curr].price).mul(items[curr].quantity),
        );
      }, new Decimal(0));
    }

    if (userCheckout.data) {
      return sumItems(
        userCheckout.data.items.map((c) =>
          new Decimal(c.price).mul(c.quantity),
        ),
      );
    }

    return new Decimal('0');
  }, [userCheckout.data, items]);

  const balanceQuery = useErc20BalanceQuery({
    provider,
    contractAddress: token?.address,
    account,
    chainId,
  });

  const decimalBalance = useMemo(() => {
    if (balanceQuery.data === undefined || token === undefined) {
      return new Decimal(0);
    }

    return new Decimal(
      ethers.utils.formatUnits(balanceQuery.data, token?.decimals),
    );
  }, [balanceQuery.data, token]);

  const hasSufficientBalance = useMemo(() => {
    return decimalBalance.gte(total);
  }, [total.toString(), decimalBalance.toString()]);

  const disabled = useMemo(() => {
    return false;
  }, []);

  const { handleConnectWallet } = useConnectWalletDialog();

  const { data: availNetworks, refetch } = useCheckoutNetworks();

  const chainIds = availNetworks?.map((n) => n.chainId) ?? [];

  const networks = useMemo(() => {
    return Object.keys(NETWORKS)
      .map((key: string) => NETWORKS[parseChainId(key)])
      .filter((n) => chainIds?.includes(n.chainId))
      .filter((n) => {
        let token = CHECKOUT_TOKENS.find((t) => t.chainId === n.chainId);

        return Boolean(token);
      });
  }, [JSON.stringify(chainIds), chainId]);

  const handlePay = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeNetwork = (
    e: SelectChangeEvent<number>,
    child: ReactNode,
  ) => {
    const newChainId = e.target.value as number;

    setChainId(newChainId);

    let newToken = CHECKOUT_TOKENS.filter((t) => t.chainId === newChainId)[0];

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
          disabled={
            !hasSufficientBalance ||
            disabled ||
            !token ||
            (userCheckout.data?.requireEmail && (!email || !isValidEmail)) ||
            !receiverData ||
            !receiverData?.receiver
          }
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
              id="confirm.payment"
              defaultMessage="Confirm Payment"
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

  const handleChangeToken = (token: Token | null) => {
    setToken(token);
  };

  useEffect(() => {
    if (providerChainId) {
      setChainId(providerChainId);
      setToken(
        CHECKOUT_TOKENS.find((t) => t.chainId === providerChainId) ?? null,
      );
    }
  }, [providerChainId]);

  const handleConfirm = async () => {
    if (token && userCheckout.data?.owner) {
      try {
        await transfer({
          address: userCheckout.data?.owner,
          amount: total.toNumber(),
          coin: convertTokenToEvmCoin(token as TokenWhitelabelApp),
        });
      } catch (err) {}
    }
  };

  const handleCloseConfirm = () => {
    setOpen(false);
    setHash(undefined);
  };

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);

    try {
      validEmail.parse(e.target.value);
      setIsValidEmail(true);
    } catch (err) {
      setIsValidEmail(false);
    }
  };

  const [isEdit, setIsEdit] = useState(false);

  const handleEdit = () => {
    setIsEdit(true);
  };

  const handleCancelEdit = () => {
    setIsEdit(false);
  };

  return (
    <>
      <CheckoutConfirmDialog
        DialogProps={{
          open: open,
          onClose: handleCloseConfirm,
          maxWidth: 'xs',
          fullWidth: true,
        }}
        onConfirm={handleConfirm}
        txHash={hash}
        isLoading={isTransferLoading}
        token={token}
        total={total}
      />
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <PageHeader
              breadcrumbs={[
                {
                  caption: (
                    <FormattedMessage
                      id="my.orders"
                      defaultMessage="My Orders"
                    />
                  ),
                  uri: '/c/orders',
                },
                {
                  caption: (
                    <FormattedMessage id="checkout" defaultMessage="Checkout" />
                  ),
                  uri: `/c/${userCheckout.data?.id}`,
                  active: true,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} sm={8}>
            <Formik
              key={JSON.stringify(initialValues)}
              initialValues={{
                items: initialValues,
              }}
              validationSchema={toFormikValidationSchema(
                UserCheckoutItemsFormSchema,
              )}
              onSubmit={async ({
                items,
              }: {
                items: { [key: string]: { quantity: number; price: string } };
              }) => {
                setIsEdit(false);
                setItems(items);
              }}
            >
              {({ submitForm, values }) => (
                <>
                  <CheckoutUserItemList
                    token={token}
                    items={userCheckout.data?.items ?? []}
                    editable={isEdit}
                  />
                  {isEdit && (
                    <>
                      <Stack
                        direction="row"
                        justifyContent="flex-end"
                        spacing={2}
                        sx={{ p: 2 }}
                      >
                        <Button onClick={handleCancelEdit}>
                          <FormattedMessage
                            id="cancel"
                            defaultMessage="Cancel"
                          />
                        </Button>
                        <Button variant="outlined" onClick={submitForm}>
                          <FormattedMessage id="done" defaultMessage="Done" />
                        </Button>
                      </Stack>
                      <Divider />
                    </>
                  )}
                </>
              )}
            </Formik>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography variant="h5">
                    <FormattedMessage id="checkout" defaultMessage="Checkout" />
                  </Typography>
                  {userCheckout.data?.editable && !isEdit && (
                    <IconButton onClick={handleEdit}>
                      <Tooltip
                        title={
                          <FormattedMessage
                            id="edit.items"
                            defaultMessage="Edit items"
                          />
                        }
                      >
                        <Edit />
                      </Tooltip>
                    </IconButton>
                  )}
                </Stack>
              </CardContent>
              <Divider />
              <CardContent>
                <Stack
                  spacing={2}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography variant="body1">
                    <FormattedMessage id="total" defaultMessage="total" />
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    <FormattedNumber
                      value={total.toNumber()}
                      style="currency"
                      maximumFractionDigits={token?.decimals}
                    />{' '}
                    {token ? token?.symbol : 'USD'}
                  </Typography>
                </Stack>
              </CardContent>
              <Divider />
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="body2" color="text.secondary">
                    <FormattedMessage
                      id="select.token.for.payment"
                      defaultMessage="Select the token for payment:"
                    />
                  </Typography>
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
                        disabled={!isActive}
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
                  <NoSsr>
                    <CheckoutTokenAutocomplete
                      key={chainId}
                      tokens={CHECKOUT_TOKENS}
                      onChange={handleChangeToken}
                      chainId={chainId}
                      token={token}
                      disabled={disabled || !isActive}
                    />
                  </NoSsr>
                  {!token && (
                    <Alert severity="error">
                      <FormattedMessage
                        id="select.a.token.to.pay"
                        defaultMessage="Select a token to pay"
                      />
                    </Alert>
                  )}
                  {userCheckout.data?.requireEmail && (
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="body1" color="text.secondary">
                          <FormattedMessage
                            id="email.confirmation"
                            defaultMessage="Email confirmation:"
                          />
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <FormattedMessage
                            id="checkout.email.required.subtext"
                            defaultMessage="This email will be used for order status updates."
                          />
                        </Typography>
                      </Box>
                      <TextField
                        value={email}
                        onChange={handleChangeEmail}
                        fullWidth
                        label={
                          <FormattedMessage id="email" defaultMessage="Email" />
                        }
                        type="email"
                        error={!isValidEmail || email === ''}
                        helperText={
                          !isValidEmail || !Boolean(email) ? (
                            <FormattedMessage
                              id="email.is.required"
                              defaultMessage="Email is required"
                            />
                          ) : undefined
                        }
                        required
                      />
                    </Stack>
                  )}
                  {token && (
                    <Stack
                      direction="row"
                      spacing={2}
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="body2">
                        <FormattedMessage
                          id="wallet.balance"
                          defaultMessage="Wallet balance"
                        />
                      </Typography>
                      <Stack alignItems="flex-end">
                        <Typography
                          sx={(theme) => ({
                            color: hasSufficientBalance
                              ? theme.palette.success.main
                              : theme.palette.error.main,
                          })}
                          variant="body2"
                          color="text.secondary"
                        >
                          {balanceQuery.isLoading ? (
                            <Skeleton />
                          ) : (
                            <FormattedNumber
                              value={decimalBalance.toNumber()}
                              maximumFractionDigits={token?.decimals}
                            />
                          )}{' '}
                          {token?.symbol}
                        </Typography>
                        {!hasSufficientBalance && (
                          <Typography variant="body2" color="text.secondary">
                            <FormattedMessage
                              id="insufficient.balance"
                              defaultMessage="Insufficient balance"
                            />
                          </Typography>
                        )}
                      </Stack>
                    </Stack>
                  )}
                  {!receiverData ||
                    (!receiverData.receiver && (
                      <Alert severity="error">
                        <FormattedMessage
                          id="checkout.is.currently.unavailable"
                          defaultMessage="Checkout is currently unavailable. Please try again later."
                        />
                      </Alert>
                    ))}
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

(UserCheckout as any).getLayout = function getLayout(page: any) {
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
      siteId: configResponse?.siteId ?? null,
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
