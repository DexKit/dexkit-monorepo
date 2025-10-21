import {
  Alert,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Grid,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { AppDialogTitle } from "../../../../components/AppDialogTitle";

import { useErc20Balance } from "@dexkit/core/hooks";
import { Asset, AssetMetadata, Token } from "@dexkit/core/types";
import { isAddressEqual } from "@dexkit/core/utils";
import { formatUnits } from "@dexkit/core/utils/ethers/formatUnits";
import { ipfsUriToUrl } from "@dexkit/core/utils/ipfs";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { Box } from "@mui/material";
import { BigNumber } from "ethers";
import Image from "next/image";
import { useMemo, useState } from "react";
import { FormattedMessage, FormattedNumber, useIntl } from "react-intl";
import { useCoinPricesQuery, useCurrency } from "../../../../hooks/currency";
interface Props {
  tokens: Token[];
  order?: any;
  dialogProps: DialogProps;
  account?: string;
  asset?: Asset;
  metadata?: AssetMetadata;
  onConfirm: ({ quantity }: { quantity?: number }) => void;
}

export default function ConfirmBuyDialog({
  tokens,
  dialogProps,
  onConfirm,
  order,
  asset,
  metadata,
}: Props) {
  const { onClose } = dialogProps;

  const { formatMessage } = useIntl();

  const currency = useCurrency();

  const { provider, account } = useWeb3React();

  const [quantity, setQuantity] = useState(1);

  const erc20Balance = useErc20Balance(provider, order?.erc20Token, account);

  const handleClose = () => onClose!({}, "backdropClick");

  const token = useMemo(() => {
    if (order) {
      const tokenIndex = tokens.findIndex((t) =>
        isAddressEqual(t.address, order?.erc20Token)
      );

      if (tokenIndex > -1) {
        return tokens[tokenIndex];
      }
    }
  }, [tokens, order]);

  const hasSufficientFunds = useMemo(() => {
    if (token !== undefined) {
      const orderTokenAmount: BigNumber = BigNumber.from(
        order?.erc20TokenAmount
      );
      if (quantity > 1) {
        if (erc20Balance.data?.gte(orderTokenAmount.div(quantity))) {
          return true;
        }
      }

      if (erc20Balance.data?.gte(orderTokenAmount)) {
        return true;
      }
    }

    return false;
  }, [erc20Balance, tokens, order]);

  const coinPricesQuery = useCoinPricesQuery({ includeNative: true });

  const totalInCurrency = useMemo(() => {
    if (token && currency && order) {
      if (
        coinPricesQuery?.data &&
        `${token.address.toLowerCase()}` in coinPricesQuery.data
      ) {
        const ratio =
          coinPricesQuery.data[token.address.toLowerCase()][currency.currency];

        if (ratio) {
          if (quantity > 1) {
            return (
              (ratio *
                parseFloat(
                  formatUnits(order?.erc20TokenAmount, token.decimals)
                )) /
              quantity
            );
          }

          return (
            ratio *
            parseFloat(formatUnits(order?.erc20TokenAmount, token.decimals))
          );
        } else {
          return 0;
        }
      }
    }
  }, [token, coinPricesQuery, currency, order]);

  return (
    <Dialog {...dialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="buy.asset"
            defaultMessage="Buy Asset"
            description="Buy asset title"
          />
        }
        onClose={handleClose}
      />

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Grid container spacing={2}>
              <Grid>
                {metadata?.image === undefined ? (
                  <Skeleton
                    variant="rectangular"
                    sx={{ paddingTop: "100%", width: "100%" }}
                  />
                ) : (
                  <Image
                    fill
                    alt={formatMessage({
                      id: "nft.image",
                      defaultMessage: "NFT Image",
                    })}
                    src={ipfsUriToUrl(metadata?.image)}
                  />
                )}
              </Grid>
              <Grid size={12}>
                <Stack spacing={1}>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      {asset?.collectionName === undefined ? (
                        <Skeleton />
                      ) : (
                        asset?.collectionName
                      )}
                    </Typography>
                    <Typography variant="subtitle1">
                      {metadata?.name === undefined ? (
                        <Skeleton />
                      ) : (
                        metadata?.name
                      )}
                    </Typography>
                  </Box>
                  <Paper sx={{ p: 1 }}>
                    <Typography variant="caption" color="textSecondary">
                      {asset?.protocol === "ERC1155" ? (
                        <FormattedMessage
                          id="listing.price.per.item"
                          defaultMessage="Listing price per item"
                        />
                      ) : (
                        <FormattedMessage
                          id="listing.price"
                          defaultMessage="Listing price"
                        />
                      )}
                    </Typography>
                    <Stack
                      direction="row"
                      alignItems="center"
                      alignContent="center"
                      spacing={0.5}
                    >
                      <Tooltip title={token?.name || ""}>
                        <img
                          alt={token?.name}
                          src={ipfsUriToUrl(token?.logoURI || "")}
                          style={{ width: "auto", height: "1rem" }}
                        />
                      </Tooltip>
                      <Typography sx={{ fontWeight: 600 }} variant="body1">
                        {asset?.protocol === "ERC1155"
                          ? formatUnits(
                            BigNumber.from(
                              order?.erc20TokenAmount || "0"
                            ).div(order?.erc1155TokenAmount || "1"),
                            token?.decimals
                          )
                          : formatUnits(
                            BigNumber.from(order?.erc20TokenAmount || "0"),
                            token?.decimals
                          )}{" "}
                        {token?.symbol}
                      </Typography>

                      {totalInCurrency !== undefined && (
                        <Chip
                          size="small"
                          label={
                            <Typography variant="caption">
                              {totalInCurrency ? (
                                <>
                                  <FormattedNumber
                                    value={totalInCurrency}
                                    currency={currency?.currency}
                                  />{" "}
                                  {currency?.currency.toUpperCase()}
                                </>
                              ) : (
                                <Skeleton />
                              )}
                            </Typography>
                          }
                        />
                      )}
                    </Stack>
                  </Paper>
                  {asset?.protocol === "ERC1155" && (
                    <Stack spacing={2}>
                      <Typography variant="body1">
                        <FormattedMessage
                          id="max.quantity"
                          defaultMessage="Max quantity"
                        />{" "}
                        : {order?.erc1155TokenAmount || "0"}
                      </Typography>
                      <TextField
                        type={"number"}
                        inputProps={{
                          min: 1,
                          max: Number(order?.erc1155TokenAmount),
                          step: 1,
                        }}
                        value={Number(quantity || 1)}
                        onChange={(e) => {
                          const value = Number(e.currentTarget.value);
                          const maxValue = Number(order?.erc1155TokenAmount);
                          if (value < maxValue + 1) {
                            setQuantity(value);
                          }
                        }}
                        name="quantity"
                        label={
                          <FormattedMessage
                            id="quantity"
                            defaultMessage="Quantity"
                            description="Price label"
                          />
                        }
                      />
                      <Typography variant="body1">
                        <FormattedMessage
                          id="total.cost"
                          defaultMessage="Total cost"
                        />
                        :{" "}
                        <b>
                          {quantity *
                            Number(
                              formatUnits(
                                BigNumber.from(
                                  order?.erc20TokenAmount || "0"
                                ).div(order?.erc1155TokenAmount || "1"),
                                token?.decimals
                              )
                            )}{" "}
                          {token?.symbol}
                        </b>
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </Grid>
          <Grid size={12}>
            <Stack
              spacing={1}
              direction="row"
              alignItems="center"
              alignContent="center"
              justifyContent="flex-end"
            >
              <Typography variant="body1">
                <FormattedMessage
                  id="available.balance"
                  defaultMessage="Available balance"
                />
                :
              </Typography>
              <Stack
                spacing={0.5}
                direction="row"
                alignItems="center"
                alignContent="center"
              >
                <Tooltip title={token?.name || ""}>
                  <img
                    alt={token?.name}
                    src={ipfsUriToUrl(token?.logoURI || "")}
                    style={{ width: "auto", height: "1rem" }}
                  />
                </Tooltip>
                <Typography sx={{ fontWeight: 600 }} variant="body1">
                  {erc20Balance.isLoading ? (
                    <Skeleton />
                  ) : (
                    formatUnits(
                      erc20Balance.data || BigNumber.from(0),
                      token?.decimals
                    )
                  )}{" "}
                  {token?.symbol}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
          {!hasSufficientFunds && (
            <Grid size={12}>
              <Alert severity="error">
                <FormattedMessage
                  defaultMessage="Insufficient Funds"
                  description="insufficient funds"
                  id="insufficient.funds"
                />
              </Alert>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={!hasSufficientFunds}
          onClick={() => onConfirm({ quantity })}
          variant="contained"
          color="primary"
        >
          <FormattedMessage defaultMessage="Buy" description="Buy" id="buy" />
        </Button>
        <Button onClick={handleClose}>
          <FormattedMessage
            defaultMessage="Cancel"
            id="cancel"
            description="Cancel"
          />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
