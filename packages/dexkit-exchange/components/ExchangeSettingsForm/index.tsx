import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { Field, Formik, getIn } from "formik";

import FormikDecimalInput from "@dexkit/ui/components/FormikDecimalInput";

import { ChainId } from "@dexkit/core";
import { Token } from "@dexkit/core/types";
import { ipfsUriToUrl, isAddressEqual, parseChainId } from "@dexkit/core/utils";
import { Select as FormikSelect, TextField } from "formik-mui";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { DexkitExchangeSettings, ExchangeSettingsSchema } from "../../types";
import FormActions from "./ExchangeSettingsFormActions";

import { ZEROEX_AFFILIATE_ADDRESS } from "@dexkit/core/services/zrx/constants";
import { useNetworkMetadata } from "@dexkit/ui/hooks/app";
import Edit from "@mui/icons-material/Edit";
import TextFieldMui from "@mui/material/TextField";
import { useFormikContext } from "formik";
import setWith from "lodash/setWith";
import {
  DEFAULT_TOKENS,
  QUOTE_TOKENS_SUGGESTION,
} from "../../constants/tokens";
import ExchangeQuoteTokensInput from "./ExchangeQuoteTokensInput";
import ExchangeTokenInput from "./ExchangeTokenInput";
import SelectNetworksDialog from "./SelectNetworksDialog";

function SaveOnChangeListener({
  onSave,
  onValidate,
}: {
  onSave: (settings: DexkitExchangeSettings) => void;
  onValidate?: (isValid: boolean) => void;
}) {
  const { values, isValid } = useFormikContext<DexkitExchangeSettings>();
  useEffect(() => {
    onSave(values);
  }, [values, isValid]);

  useEffect(() => {
    if (onValidate) {
      onValidate(isValid);
    }
  }, [isValid, onValidate]);

  return null;
}

export interface ExchangeSettingsFormProps {
  onCancel: () => void;
  onSave: (settings: DexkitExchangeSettings) => void;
  onChange?: (settings: DexkitExchangeSettings) => void;
  saveOnChange?: boolean;
  showSaveButton?: boolean;
  settings?: DexkitExchangeSettings;
  tokens: Token[];
  onValidate?: (isValid: boolean) => void;
}

export default function ExchangeSettingsForm({
  onCancel,
  onSave,
  onChange,
  settings,
  tokens,
  saveOnChange,
  showSaveButton,
  onValidate,
}: ExchangeSettingsFormProps) {
  const { NETWORKS, NETWORK_NAME } = useNetworkMetadata();

  const handleSubmit = async (values: DexkitExchangeSettings) => {
    onSave(values);
  };

  const [chainId, setChainId] = useState<ChainId>(ChainId.Ethereum);

  const handleChange = (event: SelectChangeEvent<ChainId>) => {
    if (typeof event.target.value === "number") {
      setChainId(event.target.value);
    }
  };

  const [showSelectNetworks, setShowSelectNetworks] = useState(false);

  const handleShowSelectNetworks = () => {
    setShowSelectNetworks(true);
  };

  const handleCloseSelectNetworks = () => {
    setShowSelectNetworks(false);
  };

  const { formatMessage } = useIntl();

  const handleValidate = async (values: DexkitExchangeSettings) => {
    let errors: any = {};

    if (values.buyTokenPercentageFee && values.buyTokenPercentageFee > 10) {
      errors["buyTokenPercentageFee"] = formatMessage({
        id: "the.max.fee.is.ten.percent",
        defaultMessage: "The max fee is 10%",
      });
    }

    for (let chainId of values.availNetworks) {
      if (
        values.defaultPairs[chainId] &&
        !values.defaultPairs[chainId].baseToken
      ) {
        let error = formatMessage(
          {
            id: "the.base.token.is.required.on.chain",
            defaultMessage: "The base token is required on {chainName}",
          },
          { chainName: NETWORK_NAME(chainId) }
        );

        setWith(
          errors,
          `defaultPairs.${String(chainId)}.baseToken`,
          error,
          Object
        );
      }

      if (
        values.defaultPairs[chainId] &&
        !values.defaultPairs[chainId].quoteToken
      ) {
        let error = formatMessage(
          {
            id: "the.base.token.is.required.on.chain",
            defaultMessage: "The quote token is required on {chainName}",
          },
          { chainName: NETWORK_NAME(chainId) }
        );

        setWith(
          errors,
          `defaultPairs.${String(chainId)}.quoteToken`,
          error,
          Object
        );
      }
      if (
        values?.defaultSlippage &&
        values?.defaultSlippage[chainId] &&
        values?.defaultSlippage[chainId].slippage > 50
      ) {
        let error = formatMessage({
          id: "max.slippage.is.value.percent",
          defaultMessage: "Max slippage is 50 percent",
        });

        setWith(
          errors,
          `defaultSlippage.${String(chainId)}.slippage`,
          error,
          Object
        );
      }
    }

    return errors;
  };

  const getInitialTokens = useCallback(() => {
    const resQuote = QUOTE_TOKENS_SUGGESTION.map((t) => {
      return { chainId: t.chainId, token: t };
    }).reduce((prev, curr) => {
      let obj = { ...prev };

      if (!obj[curr.chainId]) {
        obj[curr.chainId] = { baseTokens: [], quoteTokens: [] };
      }

      let index = tokens.findIndex(
        (t) =>
          curr.token.chainId === t.chainId &&
          isAddressEqual(curr.token.address, t.address)
      );

      if (index > -1) {
        obj[curr.chainId].quoteTokens.push(curr.token);
      }

      return obj;
    }, {} as { [key: number]: { quoteTokens: Token[]; baseTokens: Token[] } });

    for (let chain of Object.keys(NETWORKS)) {
      let chainId = parseChainId(chain);

      if (resQuote[chainId]) {
        let chainTokens = tokens.filter((t) => t.chainId === chainId);

        for (let token of chainTokens) {
          let index = resQuote[chainId].quoteTokens.findIndex(
            (t) =>
              t.chainId === token.chainId &&
              isAddressEqual(t.address, token.address)
          );

          if (index === -1) {
            resQuote[chainId].baseTokens.push(token);
          }
        }
      } else {
        resQuote[chainId] = { baseTokens: [], quoteTokens: [] };
      }
    }

    return resQuote;
  }, [tokens]);

  const networks = useMemo(() => {
    return Object.keys(NETWORKS)
      .filter((key) => {
        let chain = parseChainId(key);

        return NETWORKS[chain].testnet === undefined;
      })
      .map((key) => NETWORKS[parseChainId(key)]);
  }, []);

  return (
    <Formik
      initialValues={
        settings
          ? settings
          : {
              defaultNetwork: ChainId.Ethereum,
              defaultPairs: DEFAULT_TOKENS,
              quoteTokens: [],
              defaultTokens: getInitialTokens(),
              affiliateAddress: ZEROEX_AFFILIATE_ADDRESS,
              defaultSlippage: {},
              zrxApiKey: "",
              buyTokenPercentageFee: 0.0,
              availNetworks: networks.map((n) => n.chainId),
            }
      }
      onSubmit={handleSubmit}
      validationSchema={ExchangeSettingsSchema}
      validateOnChange
      validate={handleValidate}
    >
      {({ submitForm, values, errors, setFieldValue }) => (
        <>
          <SelectNetworksDialog
            DialogProps={{
              open: showSelectNetworks,
              maxWidth: "sm",
              fullWidth: true,
              onClose: handleCloseSelectNetworks,
            }}
          />
          {saveOnChange && onChange && (
            <SaveOnChangeListener onSave={onChange} onValidate={onValidate} />
          )}
          <Grid container spacing={2}>
            {/* <Grid item xs={12}>
              <Field
                component={TextField}
                label={
                  <FormattedMessage
                    id="0x.api.key"
                    defaultMessage="0x Api Key"
                  />
                }
                name="zrxApiKey"
                fullWidth
              />
            </Grid> */}

            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <Field
                    component={FormikSelect}
                    label={
                      <FormattedMessage
                        id="default.network"
                        defaultMessage="Default network"
                      />
                    }
                    name="defaultNetwork"
                    fullWidth
                    renderValue={(value: ChainId) => {
                      return (
                        <Stack
                          direction="row"
                          alignItems="center"
                          alignContent="center"
                          spacing={1}
                        >
                          <Avatar
                            src={ipfsUriToUrl(NETWORKS[value].imageUrl || "")}
                            style={{ width: "auto", height: "1rem" }}
                          />
                          <Typography variant="body1">
                            {NETWORKS[value].name}
                          </Typography>
                        </Stack>
                      );
                    }}
                  >
                    {networks.map((n) => (
                      <MenuItem key={n.chainId} value={n.chainId}>
                        <ListItemIcon>
                          <Avatar
                            src={ipfsUriToUrl(
                              NETWORKS[n.chainId].imageUrl || ""
                            )}
                            style={{ width: "1rem", height: "1rem" }}
                          />
                        </ListItemIcon>
                        <ListItemText primary={n.name} />
                      </MenuItem>
                    ))}
                  </Field>
                  <Stack
                    justifyContent="space-between"
                    alignItems="center"
                    direction="row"
                  >
                    <Typography variant="subtitle2">
                      <FormattedMessage
                        id="choose.the.networks.that.your.exchange.will.be.enabled"
                        defaultMessage="Choose the networks that your exchange will be enabled"
                      />
                    </Typography>
                    {values.availNetworks.length > 0 && (
                      <Tooltip
                        title={
                          <FormattedMessage
                            id="edit.networks"
                            defaultMessage="Edit Networks"
                          />
                        }
                      >
                        <IconButton
                          onClick={handleShowSelectNetworks}
                          size="small"
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>
                  <Divider />
                  <Box>
                    <Grid container spacing={2}>
                      {values.availNetworks.length > 0 ? (
                        networks
                          .filter((network) =>
                            values.availNetworks.includes(network.chainId)
                          )
                          .map((n) => (
                            <Grid item key={n.chainId}>
                              <Chip
                                size="small"
                                avatar={
                                  <Avatar
                                    src={ipfsUriToUrl(
                                      NETWORKS[n.chainId].imageUrl || ""
                                    )}
                                  />
                                }
                                label={n.name}
                              />
                            </Grid>
                          ))
                      ) : (
                        <Grid item xs={12}>
                          <Box>
                            <Stack spacing={2} alignItems="center">
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                <FormattedMessage
                                  id="No.networks.selected"
                                  defaultMessage="No networks selected"
                                />
                              </Typography>
                              <Button
                                onClick={handleShowSelectNetworks}
                                variant="outlined"
                              >
                                <FormattedMessage
                                  id="select.networks"
                                  defaultMessage="Select networks"
                                />
                              </Button>
                            </Stack>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>
                        <FormattedMessage
                          id="network"
                          defaultMessage="Network"
                        />
                      </InputLabel>
                      <Select
                        disabled={values.availNetworks.length === 0}
                        label={
                          <FormattedMessage
                            id="network"
                            defaultMessage="Network"
                          />
                        }
                        fullWidth
                        value={chainId}
                        onChange={handleChange}
                        renderValue={(value) => {
                          return (
                            <Stack
                              direction="row"
                              alignItems="center"
                              alignContent="center"
                              spacing={1}
                            >
                              <Avatar
                                src={ipfsUriToUrl(
                                  NETWORKS[value].imageUrl || ""
                                )}
                                style={{ width: "auto", height: "1rem" }}
                              />
                              <Typography variant="body1">
                                {NETWORKS[value].name}
                              </Typography>
                            </Stack>
                          );
                        }}
                      >
                        {networks
                          .filter((n) =>
                            values.availNetworks.includes(n.chainId)
                          )
                          .map((n) => (
                            <MenuItem key={n.chainId} value={n.chainId}>
                              <ListItemIcon>
                                <Avatar
                                  src={ipfsUriToUrl(
                                    NETWORKS[n.chainId].imageUrl || ""
                                  )}
                                  style={{ width: "1rem", height: "1rem" }}
                                />
                              </ListItemIcon>
                              <ListItemText primary={n.name} />
                            </MenuItem>
                          ))}
                      </Select>
                      <FormHelperText>
                        <FormattedMessage
                          id="define.the.tokens.and.the.default.pair.for.this.network"
                          defaultMessage="Define the tokens and the default pair for this network"
                        />
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <ExchangeQuoteTokensInput
                      tokens={tokens}
                      chainId={chainId}
                      label={
                        <FormattedMessage
                          id="quote.tokens"
                          defaultMessage="Quote tokens"
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <ExchangeTokenInput
                      name={`defaultPairs[${chainId}].baseToken`}
                      tokens={
                        getIn(values, `defaultTokens.${chainId}.baseTokens`) ||
                        []
                      }
                      label={
                        <FormattedMessage
                          id="base.token"
                          defaultMessage="Base token"
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <ExchangeTokenInput
                      name={`defaultPairs[${chainId}].quoteToken`}
                      tokens={
                        getIn(values, `defaultTokens.${chainId}.quoteTokens`) ||
                        []
                      }
                      label={
                        <FormattedMessage
                          id="quote.token"
                          defaultMessage="Quote token"
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextFieldMui
                      inputProps={{
                        type: "number",
                        min: 0,
                        max: 50,
                        step: 0.01,
                      }}
                      InputLabelProps={{ shrink: true }}
                      label={
                        <FormattedMessage
                          id="default.slippage.percentage"
                          defaultMessage="Default slippage (0-50%)"
                        />
                      }
                      value={
                        getIn(values, `defaultSlippage.${chainId}.slippage`) ||
                        1
                      }
                      onChange={(event: any) => {
                        let value = event.target.value;
                        if (value < 0) {
                          value = 0;
                        }
                        if (value > 50) {
                          value = 50;
                        }
                        setFieldValue(
                          `defaultSlippage.${chainId}.slippage`,
                          value
                        );
                      }}
                      fullWidth
                    />

                    {/*<FormikDecimalInput
                      name={`defaultSlippage.${String(chainId)}.slippage`}
                      decimals={2}
                      maxDigits={3}
                      TextFieldProps={{
                        fullWidth: true,
                        label: (
                          <FormattedMessage
                            id="default.slippage"
                            defaultMessage="Default Slippage"
                          />
                        ),
                        InputProps: {
                          endAdornment: (
                            <InputAdornment position="end">%</InputAdornment>
                          ),
                        },
                      }}
                    />*/}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={9}>
              <Field
                component={TextField}
                label={
                  <FormattedMessage
                    id="fee.recipient.address"
                    defaultMessage="Fee recipient address"
                  />
                }
                fullWidth
                name="feeRecipientAddress"
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormikDecimalInput
                name="buyTokenPercentageFee"
                decimals={2}
                maxDigits={3}
                TextFieldProps={{
                  fullWidth: true,
                  label: (
                    <FormattedMessage
                      id="fee.amount"
                      defaultMessage="Fee amount"
                    />
                  ),
                  InputProps: {
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            {(!saveOnChange || showSaveButton) && (
              <Grid item xs={12}>
                <FormActions onSubmit={submitForm} onCancel={onCancel} />
              </Grid>
            )}
          </Grid>
        </>
      )}
    </Formik>
  );
}
