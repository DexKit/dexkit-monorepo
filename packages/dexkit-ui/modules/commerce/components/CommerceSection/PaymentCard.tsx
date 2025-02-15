import { ChainId, useErc20BalanceQuery } from "@dexkit/core";
import { NETWORKS } from "@dexkit/core/constants/networks";
import { Token, TokenWhitelabelApp } from "@dexkit/core/types";
import {
  convertTokenToEvmCoin,
  getBlockExplorerUrl,
  ipfsUriToUrl,
  parseChainId,
} from "@dexkit/core/utils";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import Wallet from "@mui/icons-material/Wallet";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  Link,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Decimal from "decimal.js";
import { formatUnits } from "ethers/lib/utils";
import { useSnackbar } from "notistack";
import {
  ChangeEvent,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FormattedMessage, FormattedNumber } from "react-intl";
import { z } from "zod";
import {
  useConnectWalletDialog,
  useSwitchNetworkMutation,
} from "../../../../hooks";
import { CHECKOUT_TOKENS } from "../../constants";
import useCheckoutNetworksBySite from "../../hooks/useCheckoutNetworksBySite";
import useCommerce from "../../hooks/useCommerce";
import useCreateOrderFromCart from "../../hooks/useCreateOrderFromCart";
import CheckoutTokenAutocomplete from "../CheckoutTokenAutocomplete";

import { useRouter } from "next/router";
import { useEvmTransferMutation } from "../../../evm-transfer-coin/hooks";
import { useSiteOwner } from "../../hooks/useSiteOwner";
import ConfirmPaymentDialog from "../dialogs/ConfirmPaymentDialog";

const validEmail = z.string().email();

import { SiteContext } from "@dexkit/ui/providers/SiteProvider";
import { useSiteReceiver } from "../../hooks/useSiteReceiver";

export default function PaymentCard() {
  const { siteId } = useContext(SiteContext);

  const { data: receiverData } = useSiteReceiver({ siteId: siteId });

  const { cartItems, clearCart, requireEmail } = useCommerce();

  const [chainId, setChainId] = useState<ChainId>();

  const [token, setToken] = useState<Token | null>(null);

  const { data: availNetworks } = useCheckoutNetworksBySite({
    id: siteId ?? 0,
  });

  const { mutateAsync: createOrderFromCart } = useCreateOrderFromCart();

  const {
    chainId: providerChainId,
    account,
    isActive,
    provider,
  } = useWeb3React();

  const balanceQuery = useErc20BalanceQuery({
    provider,
    contractAddress: token?.address,
    account,
    chainId,
  });

  const networks = useMemo(() => {
    return Object.keys(NETWORKS)
      .map((key: string) => NETWORKS[parseChainId(key)])
      .filter((n) => availNetworks?.includes(n.chainId))
      .filter((n) => {
        if (n.chainId === 81457) {
          let token = CHECKOUT_TOKENS.find((t) => t.chainId === n.chainId);

          console.log("TEM BLAST", token);
        }

        let token = CHECKOUT_TOKENS.find((t) => t.chainId === n.chainId);

        return Boolean(token);
      });
  }, [JSON.stringify(availNetworks)]);

  const [items, setItems] = useState<{
    [key: string]: { quantity: number; price: string };
  }>({});

  useEffect(() => {
    if (cartItems.length > 0) {
      const items = cartItems.reduce(
        (prev, curr) => {
          prev[curr.productId] = { price: curr.price, quantity: curr.quantity };
          return prev;
        },
        {} as {
          [key: string]: { quantity: number; price: string };
        }
      );

      setItems(items);
    }
  }, [cartItems]);

  const total = useMemo(() => {
    if (cartItems.length > 0) {
      return cartItems.reduce((prev, curr) => {
        return prev.add(new Decimal(curr.price).mul(curr.quantity));
      }, new Decimal("0"));
    }

    return new Decimal("0");
  }, [items, cartItems]);

  const disabled = false;

  const decimalBalance = useMemo(() => {
    if (balanceQuery.data === undefined || token === undefined) {
      return new Decimal(0);
    }

    return new Decimal(formatUnits(balanceQuery.data, token?.decimals));
  }, [balanceQuery.data, token]);

  const hasSufficientBalance = useMemo(() => {
    return decimalBalance.gte(total);
  }, [total.toString(), decimalBalance.toString()]);

  const [email, setEmail] = useState("");

  const isValidEmail = useMemo(() => {
    try {
      validEmail.parse(email);
      return true;
    } catch (err) {
      return false;
    }
  }, [email]);

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleChangeToken = (token: Token | null) => {
    setToken(token);
  };

  const switchNetwork = useSwitchNetworkMutation();

  const handleSwitchNetwork = async () => {
    if (chainId) {
      await switchNetwork.mutateAsync({ chainId });
    }
  };

  const { data: site } = useSiteOwner({ id: siteId ?? 0 });

  const { handleConnectWallet } = useConnectWalletDialog();

  const { enqueueSnackbar } = useSnackbar();

  const [hash, setHash] = useState<string>();

  const router = useRouter();

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
        { variant: "success" }
      );

      if (chainId && hash && cartItems.length > 0 && account && token) {
        try {
          const result = await createOrderFromCart({
            chainId,
            email: isValidEmail ? email : null,
            hash,
            items: cartItems,
            sender: account,
            siteId: siteId ?? 0,
            tokenAddress: token?.address,
          });

          enqueueSnackbar(
            <FormattedMessage
              id="order.created.alt"
              defaultMessage="Order created"
            />,
            { variant: "success" }
          );

          clearCart();

          router.push(`/c/orders/${result.id}`);
        } catch (err) {
          enqueueSnackbar(
            <FormattedMessage
              id="error.while.creating.order"
              defaultMessage="Error while creating order"
            />,
            { variant: "error" }
          );
        }
      }
    },
  });

  const [showConfirm, setShowConfirm] = useState(false);

  const handlePay = async () => {
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    if (token && site?.owner) {
      try {
        await transfer({
          address: site?.owner,
          amount: total.toNumber(),
          coin: convertTokenToEvmCoin(token as TokenWhitelabelApp),
        });
      } catch (err) {}
    }
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
            (requireEmail && (!email || !isValidEmail)) ||
            total.isZero() ||
            showConfirm ||
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
              defaultMessage="Confirm payment"
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

  const handleChangeNetwork = (
    e: SelectChangeEvent<number>,
    child: ReactNode
  ) => {
    const newChainId = e.target.value as number;

    setChainId(newChainId);

    let newToken = CHECKOUT_TOKENS.filter((t) => t.chainId === newChainId)[0];

    setToken(newToken);
  };

  useEffect(() => {
    if (providerChainId) {
      setChainId(providerChainId);
      setToken(
        CHECKOUT_TOKENS.find((t) => t.chainId === providerChainId) ?? null
      );
    }
  }, [providerChainId]);

  const handleCloseConfirm = () => {
    setShowConfirm(false);
  };

  return (
    <>
      {showConfirm && (
        <ConfirmPaymentDialog
          DialogProps={{
            open: showConfirm,
            onClose: handleCloseConfirm,
            maxWidth: "xs",
            fullWidth: true,
          }}
          onConfirm={handleConfirm}
          txHash={hash}
          isLoading={isTransferLoading}
          token={token}
          total={total}
        />
      )}

      <Card>
        <CardContent>
          <Typography variant="h5">
            <FormattedMessage id="checkout" defaultMessage="Checkout" />
          </Typography>
        </CardContent>
        <Divider />
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body1">
              <FormattedMessage id="total" defaultMessage="Total" />
            </Typography>
            <Typography variant="h6">
              {total.toString()} {token?.symbol}
            </Typography>
          </Stack>
        </CardContent>
        <Divider />
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              <FormattedMessage
                id="select.the.token.for.payment"
                defaultMessage="Select the token for payment:"
              />
            </Typography>
            {chainId !== undefined && (
              <FormControl fullWidth>
                <InputLabel>
                  <FormattedMessage id="network" defaultMessage="Network" />
                </InputLabel>
                <Select
                  label={
                    <FormattedMessage id="network" defaultMessage="Network" />
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
                              ?.imageUrl || ""
                          )}
                          style={{ width: "1rem", height: "1rem" }}
                        />
                        <Typography variant="body1">
                          {networks.find((n) => n.chainId === chainId)?.name}
                        </Typography>
                      </Stack>
                    );
                  }}
                >
                  {networks.map((n) => (
                    <MenuItem key={n.chainId} value={n.chainId}>
                      <ListItemIcon>
                        <Avatar
                          src={ipfsUriToUrl(n?.imageUrl || "")}
                          style={{ width: "1rem", height: "1rem" }}
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
              tokens={CHECKOUT_TOKENS}
              onChange={handleChangeToken}
              chainId={chainId}
              token={token}
              disabled={false}
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
              <Typography variant="caption" color="text.secondary">
                <FormattedMessage
                  id="token.on.explorer"
                  defaultMessage="Token on explorer:"
                />{" "}
                <Link
                  target="_blank"
                  href={`${getBlockExplorerUrl(
                    token?.chainId
                  )}/address/${token?.address}`}
                >
                  <FormattedMessage id="view" defaultMessage="view" />
                </Link>
              </Typography>
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
                    variant="body2"
                    sx={{
                      color: (theme) =>
                        !hasSufficientBalance
                          ? theme.palette.error.main
                          : theme.palette.success.light,
                    }}
                  >
                    {balanceQuery.isLoading ? (
                      <Skeleton />
                    ) : (
                      <FormattedNumber
                        value={decimalBalance.toNumber()}
                        maximumFractionDigits={token?.decimals}
                      />
                    )}{" "}
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
          </Stack>
        </CardContent>
        {requireEmail && (
          <>
            <Divider />
            <CardContent>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    <FormattedMessage
                      id="email.confirmation"
                      defaultMessage="Email confirmation:"
                    />
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <FormattedMessage
                      id="email.confirmation.this.email.text"
                      defaultMessage="This email will be used for order status updates."
                    />
                  </Typography>
                </Box>
                <TextField
                  value={email}
                  onChange={handleChangeEmail}
                  fullWidth
                  label={
                    <FormattedMessage id="email.alt" defaultMessage="Email" />
                  }
                  type="email"
                  error={!isValidEmail || email === ""}
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
            </CardContent>
          </>
        )}
        <Divider />
        <CardContent>
          <Stack spacing={2}>
            <Alert severity="error">
              <FormattedMessage
                id="checkout.is.currently.unavailable"
                defaultMessage="Checkout is currently unavailable. Please try again later."
              />
            </Alert>
            {renderPayButton()}
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
