import Check from "@mui/icons-material/Check";
import Close from "@mui/icons-material/Close";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ReceiptIcon from "@mui/icons-material/Receipt";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { estimateFees } from "@mycrypto/gas-estimation";
import { BigNumber, constants } from "ethers";

import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";

import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "@dexkit/core/constants";
import {
  getNativeTokenSymbol,
  hasLondonHardForkSupport,
  truncateAddress,
} from "@dexkit/core/utils";

import { formatEther } from "@dexkit/core/utils/ethers/formatEther";
import { formatUnits } from "@dexkit/core/utils/ethers/formatUnits";
import { parseUnits } from "@dexkit/core/utils/ethers/parseUnits";

import { ChainId, GET_NATIVE_TOKEN } from "@dexkit/core/constants";
import { useCoinPrices, useErc20BalanceQuery } from "@dexkit/core/hooks";
import { AppDialogTitle } from "../AppDialogTitle";

interface TransactionConfirmDialogProps {
  data?: any;
  onCancel?: () => void;
  onConfirm?: (data: any) => void;
  dialogProps: DialogProps;
  currency: string;
}

interface ValuesType {
  maxPriorityFeePerGas?: BigNumber | null;
  maxFeePerGas?: BigNumber | null;
  gasPrice?: BigNumber | null;
  gasLimit?: BigNumber | null;
  value?: BigNumber | null;
  nonce?: number | null;
}

export default function MagicTxConfirmDialog(
  props: TransactionConfirmDialogProps
) {
  const { data, onCancel, onConfirm, currency } = props;
  const { dialogProps } = props;
  const { provider, chainId, account } = useWeb3React();

  const coinPrices = useCoinPrices({
    currency,
    tokens: chainId ? [GET_NATIVE_TOKEN(chainId)] : [],
    chainId,
  });

  const tokenBalancesQuery = useErc20BalanceQuery({
    account,
    provider,
    contractAddress: ZEROEX_NATIVE_TOKEN_ADDRESS,
  });

  const etherBalance = useMemo(() => {
    return tokenBalancesQuery.data;
  }, [tokenBalancesQuery.data]);

  const [isInsufficientFunds, setIsInsufficientFunds] = useState(false);

  const [values, setValues] = useState<ValuesType>({});

  const isEIP1559 = useCallback(() => {
    return values.maxFeePerGas && values.maxPriorityFeePerGas;
  }, [values]);

  const totalFee = useMemo(() => {
    if (values.gasLimit) {
      if (isEIP1559() && values.maxFeePerGas) {
        return values.gasLimit.mul(values.maxFeePerGas);
      }

      if (values.gasPrice) {
        return values.gasLimit.mul(values.gasPrice);
      }
    }

    return BigNumber.from(0);
  }, [values, isEIP1559]);

  const etherPrice = useMemo(() => {
    const amount = parseFloat(formatEther(totalFee));

    if (coinPrices.data && chainId && currency) {
      const t = coinPrices.data[chainId];

      if (t) {
        const price = t[constants.AddressZero];

        return amount * price[currency];
      }
    }

    return 0;
  }, [coinPrices, totalFee]);

  const handleCancel = useCallback(() => {
    setIsInsufficientFunds(false);
    if (onCancel) {
      onCancel();
    }
  }, [onCancel]);

  const handleConfirm = useCallback(() => {
    if (onConfirm) {
      let dataCopy = { ...data };
      let params = { ...data.params[0] };
      params.gas = values.gasLimit?.toHexString();

      if (chainId && hasLondonHardForkSupport(chainId)) {
        params.maxPriorityFeePerGas =
          values.maxPriorityFeePerGas?.toHexString();
        params.maxFeePerGas = values.maxFeePerGas?.toHexString();
      } else {
        params.gasPrice = values.gasPrice?.toHexString();
      }

      dataCopy.params[0] = params;

      onConfirm(dataCopy);
    }
  }, [onConfirm, data, values, chainId]);

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleToggleAdvanced = useCallback(() => {
    setShowAdvanced((value) => !value);
  }, []);

  const handleChange = useCallback(
    (e: ChangeEvent<any>) => {
      if (
        e.target.name === "maxPriorityFeePerGas" ||
        e.target.name === "maxFeePerGas" ||
        e.target.name === "gasPrice"
      ) {
        setValues({
          ...values,
          [e.target.name]: parseUnits(e.target.value, "gwei"),
        });
      } else {
        setValues({
          ...values,
          [e.target.name]: BigNumber.from(e.target.value),
        });
      }
    },
    [values]
  );

  useEffect(() => {
    if (data && dialogProps.open) {
      if (provider) {
        if (data.params.length > 0) {
          (async () => {
            let params = data.params[0];
            let pr = provider;
            let vals: ValuesType = {};

            if (params.gas) {
              vals.gasLimit = BigNumber.from(parseInt(params.gas, 16));
            } else {
              try {
                vals.gasLimit = await pr.estimateGas(params);
              } catch (err) {
                vals.gasLimit = BigNumber.from(21000);
                setIsInsufficientFunds(true);
              }
            }
            if (account) {
              const nonce = await pr.getTransactionCount(account);
              if (nonce !== undefined) {
                vals.nonce = nonce;
              }
            }

            if (params.value) {
              vals.value = BigNumber.from(params.value);
            }

            if (chainId && hasLondonHardForkSupport(chainId)) {
              if (chainId === ChainId.Polygon) {
                const estimatedFeeResponse = await fetch(
                  "https://gasstation.polygon.technology/v2"
                );
                const estimatedFee = await estimatedFeeResponse.json();
                vals.maxFeePerGas = parseUnits(
                  String(estimatedFee["fast"].maxFee.toFixed(6)),
                  "gwei"
                );
                vals.maxPriorityFeePerGas = parseUnits(
                  String(estimatedFee["fast"].maxPriorityFee.toFixed(6)),
                  "gwei"
                );
              } else {
                let result = await estimateFees(provider);

                vals.maxFeePerGas = BigNumber.from(result.maxFeePerGas);

                vals.maxPriorityFeePerGas = BigNumber.from(
                  result.maxPriorityFeePerGas
                );
              }
            } else {
              vals.gasPrice = await pr.getGasPrice();
            }

            setValues(vals);
          })();
        }
      }
    }
  }, [data, chainId, dialogProps.open, account]);

  const gasCost = useCallback(
    (values: any) => {
      let cost = 0;

      if (isEIP1559()) {
        cost = parseFloat(
          formatEther(
            values.gasLimit?.mul(values.maxFeePerGas || BigNumber.from(0)) ||
            BigNumber.from(0)
          )
        );
      } else {
        cost = parseFloat(
          formatEther(
            values.gasLimit?.mul(values.gasPrice || BigNumber.from(0)) ||
            BigNumber.from(0)
          )
        );
      }

      return cost;
    },
    [isEIP1559]
  );

  return (
    <Dialog {...dialogProps}>
      <AppDialogTitle
        icon={<ReceiptIcon />}
        title={
          <FormattedMessage
            id="confirm.transaction"
            defaultMessage={"Confirm Transaction"}
          />
        }
        onClose={handleCancel}
      />
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Box
              display="flex"
              alignItems="center"
              alignContent="center"
              justifyContent="space-between"
            >
              <Typography variant="body1">
                <FormattedMessage id="account" defaultMessage="Account" />
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {account ? truncateAddress(account) : null}
              </Typography>
            </Box>
          </Grid>
          <Grid size={12}>
            <Box
              display="flex"
              alignItems="center"
              alignContent="center"
              justifyContent="space-between"
            >
              <Typography variant="body1">
                <FormattedMessage id="balance" defaultMessage={"Balance"} />
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {Number(formatEther(etherBalance || "0")).toFixed(4)}{" "}
                {getNativeTokenSymbol(chainId)}
              </Typography>
            </Box>
          </Grid>
          <Grid size={12}>
            <Box
              display="flex"
              alignItems="center"
              alignContent="center"
              justifyContent="space-between"
            >
              <Typography variant="body1">
                <FormattedMessage id="gas.cost" defaultMessage="Gas cost" />
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {gasCost(values)} {getNativeTokenSymbol(chainId)}
              </Typography>
            </Box>
          </Grid>
          {values.value ? (
            <Grid size={12}>
              <Box
                display="flex"
                alignItems="center"
                alignContent="center"
                justifyContent="space-between"
              >
                <Typography variant="body1">
                  <FormattedMessage
                    id="send.amount"
                    defaultMessage="Send amount"
                  />
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {values.value ? formatEther(values.value) : 0}{" "}
                  {getNativeTokenSymbol(chainId)}
                </Typography>
              </Box>
            </Grid>
          ) : null}
          <Grid size={12}>
            <Divider />
          </Grid>
          <Grid size={12}>
            <Box
              display="flex"
              alignItems="center"
              alignContent="center"
              justifyContent="space-between"
            >
              <Typography variant="body1">
                <FormattedMessage
                  id="total.cost"
                  defaultMessage={"Total cost"}
                />
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {etherPrice} {currency.toUpperCase()}
              </Typography>
            </Box>
          </Grid>
          <Grid size={12}>
            <Paper variant="outlined">
              <Box p={2}>
                <Box
                  display="flex"
                  alignItems="center"
                  alignContent="center"
                  justifyContent="space-between"
                >
                  <Typography variant="body1">
                    <FormattedMessage id="advanced" defaultMessage="Advanced" />
                  </Typography>
                  <IconButton size="small" onClick={handleToggleAdvanced}>
                    {showAdvanced ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Box>
                <Collapse in={showAdvanced}>
                  <Box mt={4}>
                    <Grid container spacing={4}>
                      <Grid size={12}>
                        <TextField
                          size="small"
                          value={values.gasLimit?.toNumber() || 0}
                          onChange={handleChange}
                          name="gasLimit"
                          fullWidth
                          variant="outlined"
                          label="Gas Limit"
                        />
                      </Grid>
                      {isEIP1559() ? (
                        <>
                          <Grid size={12}>
                            <TextField
                              size="small"
                              value={formatUnits(
                                values.maxPriorityFeePerGas?.toString() || "0",
                                "gwei"
                              )}
                              onChange={handleChange}
                              name="maxPriorityFeePerGas"
                              fullWidth
                              variant="outlined"
                              label={
                                <FormattedMessage
                                  id="max.priority.fee"
                                  defaultMessage="Max priority fee"
                                />
                              }
                            />
                          </Grid>
                          <Grid size={12}>
                            <TextField
                              size="small"
                              value={formatUnits(
                                values.maxFeePerGas?.toString() || "0",
                                "gwei"
                              )}
                              onChange={handleChange}
                              name="maxFeePerGas"
                              fullWidth
                              variant="outlined"
                              label={
                                <FormattedMessage
                                  id="max.fee"
                                  defaultMessage="Max fee"
                                />
                              }
                            />
                          </Grid>
                        </>
                      ) : (
                        <>
                          <Grid size={12}>
                            <TextField
                              size="small"
                              value={formatUnits(
                                values.gasPrice?.toString() || "0",
                                "gwei"
                              )}
                              onChange={handleChange}
                              name="gasPrice"
                              fullWidth
                              variant="outlined"
                              label={
                                <FormattedMessage
                                  id="gas.price"
                                  defaultMessage="Gas price"
                                />
                              }
                            />
                          </Grid>
                        </>
                      )}
                      <>
                        {values?.nonce !== undefined && (
                          <Grid size={12}>
                            <TextField
                              size="small"
                              value={values?.nonce}
                              onChange={handleChange}
                              name="nonce"
                              fullWidth
                              variant="outlined"
                              label={
                                <FormattedMessage
                                  id="nonce"
                                  defaultMessage="Nonce"
                                />
                              }
                            />
                          </Grid>
                        )}
                      </>
                    </Grid>
                  </Box>
                </Collapse>
              </Box>
            </Paper>
          </Grid>
          {isInsufficientFunds && (
            <Grid size={12}>
              <Alert severity="error">
                {" "}
                <FormattedMessage
                  id="insufficient.funds"
                  defaultMessage="Insufficient funds"
                />{" "}
              </Alert>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          startIcon={<Check />}
          disabled={
            Number(formatEther(etherBalance || "0")) <
            gasCost(values) +
            parseInt(values.value ? formatEther(values.value) : "0") ||
            gasCost(values) === 0
          }
          onClick={handleConfirm}
          color="primary"
          variant="contained"
        >
          <FormattedMessage id="confirm" defaultMessage="Confirm" />
        </Button>
        <Button startIcon={<Close />} color="inherit" onClick={handleCancel}>
          <FormattedMessage id="reject" defaultMessage="Reject" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
