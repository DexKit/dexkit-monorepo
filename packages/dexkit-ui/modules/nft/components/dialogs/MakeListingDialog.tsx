import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  FormControl,
  Grid,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { isAddress } from "@dexkit/core/utils/ethers/isAddress";

import { BigNumber, utils } from "ethers";

import moment from "moment";
import { useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { FormikHelpers, useFormik } from "formik";

import { Token } from "@dexkit/core/types";
import { Asset, AssetMetadata } from "@dexkit/core/types/nft";
import { ipfsUriToUrl } from "@dexkit/core/utils";
import { isAddressEqual } from "@dexkit/core/utils/blockchain";
import { isValidDecimal } from "@dexkit/core/utils/numbers";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Image from "next/image";
import * as Yup from "yup";
import { AppDialogTitle } from "../../../../components/AppDialogTitle";
import AppFeePercentageSpan from "../../../../components/AppFeePercentageSpan";
import { MIN_ORDER_DATE_TIME } from "../../../../constants";
import { AssetBalance } from "../../types";
import DurationSelect from "../DurationSelect";

interface Form {
  price: string;
  quantity?: string;
  tokenAddress: string;
  expiry: Date;
  taker?: string;
}

const FormSchema: Yup.Schema<Form> = Yup.object().shape({
  price: Yup.string().required(),
  quantity: Yup.string().optional(),
  tokenAddress: Yup.string().required(),
  expiry: Yup.date().required(),
  taker: Yup.string()
    .test("address", (value) => {
      return value !== undefined ? isAddress(value) : true;
    })
    .optional(),
});

interface Props {
  dialogProps: DialogProps;
  account?: string;
  asset?: Asset;
  metadata?: AssetMetadata;
  assetBalance?: AssetBalance;
  tokenList: Token[];
  onConfirm: (
    price: BigNumber,
    tokenAddress: string,
    expiry: Date | null,
    takerAddress?: string,
    quantity?: BigNumber
  ) => void;
}

export default function MakeListingDialog({
  dialogProps,
  onConfirm,
  asset,
  metadata,
  assetBalance,
  tokenList,
}: Props) {
  const { onClose } = dialogProps;

  const { chainId } = useWeb3React();

  const { formatMessage } = useIntl();

  // const tokenList = useTokenList({
  //   chainId,
  //   includeNative: true,
  //   onlyTradable: true,
  // });

  const handleConfirm = (values: Form, formikHelpers: FormikHelpers<Form>) => {
    if (form.isValid) {
      const decimals = tokenList.find(
        (t) => t.address === values.tokenAddress
      )?.decimals;

      if (!isValidDecimal(values.price, decimals || 0)) {
        formikHelpers.setFieldError(
          "price",
          formatMessage({
            id: "invalid.price",
            defaultMessage: "Invalid price",
          })
        );

        return;
      }

      onConfirm(
        utils.parseUnits(values.price, decimals),
        values.tokenAddress,
        values.expiry || null,
        values.taker,
        asset?.protocol === "ERC1155"
          ? BigNumber.from(values.quantity)
          : BigNumber.from(1)
      );

      formikHelpers.resetForm();
    }
  };

  const form = useFormik<Form>({
    initialValues: {
      price: "0",
      quantity: "1",
      expiry: moment().add(MIN_ORDER_DATE_TIME).toDate(),
      tokenAddress: tokenList.length > 0 ? tokenList[0].address : "",
    },
    validationSchema: FormSchema,
    isInitialValid: false,
    onSubmit: handleConfirm,
  });

  const tokenSelected = useMemo(() => {
    const tokenIndex = tokenList.findIndex((t) =>
      isAddressEqual(t.address, form.values.tokenAddress)
    );

    if (tokenIndex > -1) {
      return tokenList[tokenIndex];
    }
  }, [tokenList, form.values.tokenAddress]);

  const handleChangeExpiry = (newValue: moment.Moment | null) => {
    form.setFieldValue("expiry", newValue?.toDate());
  };

  const handleChangeExpiryDuration = (newValue: moment.Duration | null) => {
    form.setFieldValue("expiry", moment().add(newValue).toDate());
  };

  const handleChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue("price", e.target.value);
  };

  const handleChangeQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue("quantity", e.target.value);
  };

  const handleClose = () => {
    form.resetForm();

    onClose!({}, "backdropClick");
  };

  return (
    <Dialog {...dialogProps} onClose={handleClose}>
      <AppDialogTitle
        title={
          <FormattedMessage
            defaultMessage="Sell asset"
            id="sell.asset"
            description="Sell asset dialog title"
          />
        }
        onClose={handleClose}
      />
      <form onSubmit={form.handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item>
                  {metadata?.image === undefined ? (
                    <Skeleton
                      variant="rectangular"
                      sx={{ height: "100%", width: "100%" }}
                    />
                  ) : (
                    <Box
                      sx={{
                        position: "relative",
                        height: "100%",
                        width: "100%",
                      }}
                    >
                      <Image
                        fill
                        alt={metadata?.name}
                        src={ipfsUriToUrl(metadata?.image || "")}
                        objectFit="contain"
                      />
                    </Box>
                  )}
                </Grid>
                <Grid item xs>
                  <Typography variant="body2" color="textSecondary">
                    {asset?.collectionName === undefined ? (
                      <Skeleton />
                    ) : (
                      asset?.collectionName
                    )}
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }} variant="body1">
                    {metadata?.name === undefined ? (
                      <Skeleton />
                    ) : (
                      metadata?.name
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <Select
                      fullWidth
                      variant="outlined"
                      value={form.values.tokenAddress}
                      onChange={form.handleChange}
                      name="tokenAddress"
                      renderValue={(value) => {
                        return (
                          <Stack
                            direction="row"
                            alignItems="center"
                            alignContent="center"
                            spacing={1}
                          >
                            <img
                              alt={tokenSelected?.name}
                              src={ipfsUriToUrl(tokenSelected?.logoURI || "")}
                              style={{ width: "auto", height: "1rem" }}
                            />
                            <Box>
                              <Typography variant="body1">
                                {tokenSelected?.symbol}
                              </Typography>
                            </Box>
                          </Stack>
                        );
                      }}
                    >
                      {tokenList.map((token: Token, index: number) => (
                        <MenuItem value={token.address} key={index}>
                          <ListItemIcon>
                            <img
                              alt={token.name}
                              src={ipfsUriToUrl(token.logoURI || "")}
                              style={{ width: "auto", height: "1rem" }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={token.symbol}
                            secondary={token.name}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    disabled={tokenSelected === undefined}
                    value={form.values.price}
                    onChange={handleChangePrice}
                    name="price"
                    label={
                      asset?.protocol === "ERC1155" ? (
                        <FormattedMessage
                          id="price.per.item"
                          defaultMessage="Price per item"
                          description="Price label per item"
                        />
                      ) : (
                        <FormattedMessage
                          id="price"
                          defaultMessage="Price"
                          description="Price label"
                        />
                      )
                    }
                    fullWidth
                    error={Boolean(form.errors.price)}
                    helperText={
                      Boolean(form.errors.price) ? form.errors.price : undefined
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
            {asset?.protocol === "ERC1155" &&
              assetBalance &&
              assetBalance.balance?.gt(0) && (
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <Typography gutterBottom>
                      {" "}
                      <FormattedMessage
                        id="available.to.sell"
                        defaultMessage="Available to sell: {quantity}"
                        values={{
                          quantity: assetBalance.balance.toNumber(),
                        }}
                      />
                    </Typography>
                    <TextField
                      type={"number"}
                      inputProps={{
                        min: 1,
                        max: assetBalance.balance.toNumber(),
                        step: 1,
                      }}
                      value={Number(form.values.quantity || 1)}
                      onChange={handleChangeQuantity}
                      name="quantity"
                      label={
                        <FormattedMessage
                          id="quantity"
                          defaultMessage="Quantity"
                          description="Price label"
                        />
                      }
                      fullWidth
                      error={Boolean(form.errors.quantity)}
                      helperText={
                        Boolean(form.errors.quantity)
                          ? form.errors.quantity
                          : undefined
                      }
                    />
                  </Stack>
                </Grid>
              )}

            <Grid item xs={12}>
              <Stack direction={"row"} spacing={1}>
                <Typography>
                  <FormattedMessage
                    id="total.to.receive"
                    defaultMessage="Total to receive"
                  />
                  :{" "}
                  {Number(form.values.quantity || 1) *
                    Number(form.values.price || 0)}
                </Typography>
                <Typography>{tokenSelected?.symbol}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <DurationSelect
                label={<FormattedMessage id="expiry" defaultMessage="Expiry" />}
                onChange={handleChangeExpiryDuration}
              />
            </Grid>
            {/* <Grid item xs={12}>
              <DateTimePicker
                ampm={false}
                label="Listing expires"
                onChange={handleChangeExpiry}
                value={form.values.expiry}
                minDateTime={moment().add(MIN_ORDER_DATE_TIME)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={Boolean(form.errors.expiry)}
                    helperText={
                      Boolean(form.errors.expiry)
                        ? String(form.errors.expiry)
                        : undefined
                    }
                  />
                )}
                InputProps={{
                  name: 'expiry',
                }}
              />
            </Grid> */}
            <Grid item xs={12}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                    <FormattedMessage
                      id="advanced"
                      defaultMessage="Advanced"
                      description="Make listing advanced accordion"
                    />
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <Alert severity="info">
                      <FormattedMessage
                        id="advanced.info"
                        defaultMessage="Only the address entered below can buy this listing. If empty, any account can buy this listing."
                      />
                    </Alert>
                    <TextField
                      label={
                        <FormattedMessage
                          id="buyer.address"
                          defaultMessage="Buyer address"
                          description="Buyer address input label"
                        />
                      }
                      fullWidth
                      name="taker"
                      value={form.values.taker}
                      onChange={form.handleChange}
                      error={Boolean(form.errors.taker)}
                      helperText={
                        Boolean(form.errors.taker)
                          ? String(form.errors.taker)
                          : undefined
                      }
                    />
                  </Stack>
                </AccordionDetails>
              </Accordion>
            </Grid>
            {tokenSelected && (
              <Grid item xs={12}>
                <Alert severity="info">
                  <FormattedMessage
                    id="the.buyer.will.pay.percentage.in.fees"
                    defaultMessage="The buyer will pay {price} {symbol} +{percentage} in fees"
                    values={{
                      price: form.values.price,
                      symbol: tokenSelected?.symbol,
                      percentage: (
                        <b>
                          <AppFeePercentageSpan />
                        </b>
                      ),
                    }}
                  />
                </Alert>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={!form.isValid}
            type="submit"
            variant="contained"
            color="primary"
          >
            <FormattedMessage
              defaultMessage="Confirm"
              description="Confirm"
              id="confirm"
            />
          </Button>
          <Button onClick={handleClose}>
            <FormattedMessage
              defaultMessage="Cancel"
              id="cancel"
              description="Cancel"
            />
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
