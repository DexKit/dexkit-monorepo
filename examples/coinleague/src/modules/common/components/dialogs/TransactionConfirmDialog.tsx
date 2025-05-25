import { useEvmCoinPrices } from '@/modules/wallet/hooks';
import { useERC20BalancesQuery } from '@/modules/wallet/hooks/balances';
import { CoinPrices } from '@/modules/wallet/types';
import { Check } from '@mui/icons-material';
import { default as Close } from '@mui/icons-material/Close';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReceiptIcon from '@mui/icons-material/Receipt';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { estimateFees } from '@mycrypto/gas-estimation';
import { useWeb3React } from '@web3-react/core';
import { BigNumber, ethers } from 'ethers';
import { useAtomValue } from 'jotai';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { currencyAtom } from '../../atoms';
import { ZEROEX_NATIVE_TOKEN_ADDRESS } from '../../constants';

import {
  getNativeTokenSymbol,
  hasLondonHardForkSupport,
  truncateAddress,
} from '../../utils/blockchain';
import AppDialogTitle from '../AppDialogTitle';

interface TransactionConfirmDialogProps {
  data?: any;
  onCancel?: () => void;
  onConfirm?: (data: any) => void;
  dialogProps: DialogProps;
}

interface ValuesType {
  maxPriorityFeePerGas?: ethers.BigNumber | null;
  maxFeePerGas?: ethers.BigNumber | null;
  gasPrice?: ethers.BigNumber | null;
  gasLimit?: ethers.BigNumber | null;
  value?: ethers.BigNumber | null;
}

export const TransactionConfirmDialog = (
  props: TransactionConfirmDialogProps
) => {
  const { data, onCancel, onConfirm } = props;
  const { dialogProps } = props;
  const { provider, chainId, account } = useWeb3React();
  const tokenBalancesQuery = useERC20BalancesQuery();
  const currency = useAtomValue(currencyAtom);
  const prices: CoinPrices = useEvmCoinPrices({ currency, coins: [] });

  const etherBalance = useMemo(() => {
    if (tokenBalancesQuery.data) {
      return tokenBalancesQuery.data.find(
        (t) =>
          t.token.address.toLowerCase() ===
          ZEROEX_NATIVE_TOKEN_ADDRESS.toLowerCase()
      )?.balance;
    }
  }, [tokenBalancesQuery.data]);

  const etherPrice = useMemo(() => {
    return 0;

    // if (prices && currency && chainId) {
    //   return prices[chainId][ethers.constants.AddressZero][currency];
    // }
  }, [prices, currency, chainId]);

  const [isInsufficientFunds, setIsInsufficientFunds] = useState(false);

  const [values, setValues] = useState<ValuesType>({});

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
        e.target.name === 'maxPriorityFeePerGas' ||
        e.target.name === 'maxFeePerGas' ||
        e.target.name === 'gasPrice'
      ) {
        setValues({
          ...values,
          [e.target.name]: ethers.utils.parseUnits(e.target.value, 'gwei'),
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

  const isEIP1559 = useCallback(() => {
    return values.maxFeePerGas && values.maxPriorityFeePerGas;
  }, [values]);

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

            if (params.value) {
              vals.value = BigNumber.from(params.value);
            }

            if (chainId && hasLondonHardForkSupport(chainId)) {
              let result = await estimateFees(provider);

              vals.maxFeePerGas = BigNumber.from(result.maxFeePerGas);

              vals.maxPriorityFeePerGas = BigNumber.from(
                result.maxPriorityFeePerGas
              );
            } else {
              vals.gasPrice = await pr.getGasPrice();
            }

            setValues(vals);
          })();
        }
      }
    }
  }, [data, chainId, dialogProps.open]);

  const gasCost = useCallback(
    (values: any) => {
      let cost = 0;

      if (isEIP1559()) {
        cost = parseFloat(
          ethers.utils.formatEther(
            values.gasLimit?.mul(
              values.maxFeePerGas || ethers.BigNumber.from(0)
            ) || BigNumber.from(0)
          )
        );
      } else {
        cost = parseFloat(
          ethers.utils.formatEther(
            values.gasLimit?.mul(values.gasPrice || ethers.BigNumber.from(0)) ||
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
            defaultMessage={'Confirm Transaction'}
          />
        }
        onClose={handleCancel}
      />
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
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
          <Grid item xs={12}>
            <Box
              display="flex"
              alignItems="center"
              alignContent="center"
              justifyContent="space-between"
            >
              <Typography variant="body1">
                <FormattedMessage id="balance" defaultMessage={'Balance'} />
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {Number(ethers.utils.formatEther(etherBalance || '0')).toFixed(
                  4
                )}{' '}
                {getNativeTokenSymbol(chainId)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box
              display="flex"
              alignItems="center"
              alignContent="center"
              justifyContent="space-between"
            >
              <Typography variant="body1">
                <FormattedMessage id="gas.cost" defaultMessage={'Gas cost'} />
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {gasCost(values)} {getNativeTokenSymbol(chainId)}
              </Typography>
            </Box>
          </Grid>
          {values.value ? (
            <Grid item xs={12}>
              <Box
                display="flex"
                alignItems="center"
                alignContent="center"
                justifyContent="space-between"
              >
                <Typography variant="body1">
                  <Typography variant="body1">
                    <FormattedMessage
                      id="send.amount"
                      defaultMessage={'Send amount'}
                    />
                  </Typography>
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {values.value ? ethers.utils.formatEther(values.value) : 0}{' '}
                  {getNativeTokenSymbol(chainId)}
                </Typography>
              </Box>
            </Grid>
          ) : null}
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Box
              display="flex"
              alignItems="center"
              alignContent="center"
              justifyContent="space-between"
            >
              <Typography variant="body1">
                <Typography variant="body1">
                  <FormattedMessage
                    id="total.cost"
                    defaultMessage={'Total cost'}
                  />
                </Typography>
              </Typography>
              <Typography variant="body1" color="textSecondary">
                $
                {(etherPrice || 0) *
                  (gasCost(values) +
                    parseInt(
                      values.value
                        ? ethers.utils.formatEther(values.value)
                        : '0'
                    ))}{' '}
                <FormattedMessage id="usd" defaultMessage={'USD'} />
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Paper variant="outlined">
              <Box p={2}>
                <Box
                  display="flex"
                  alignItems="center"
                  alignContent="center"
                  justifyContent="space-between"
                >
                  <Typography>
                    <Typography variant="body1">
                      <FormattedMessage
                        id="advanced"
                        defaultMessage={'Advanced'}
                      />
                    </Typography>
                  </Typography>
                  <IconButton size="small" onClick={handleToggleAdvanced}>
                    {showAdvanced ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Box>
                <Collapse in={showAdvanced}>
                  <Box mt={4}>
                    <Grid container spacing={4}>
                      <Grid item xs={12}>
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
                          <Grid item xs={12}>
                            <TextField
                              size="small"
                              value={ethers.utils.formatUnits(
                                values.maxPriorityFeePerGas?.toString() || '0',
                                'gwei'
                              )}
                              onChange={handleChange}
                              name="maxPriorityFeePerGas"
                              fullWidth
                              variant="outlined"
                              label={
                                <FormattedMessage
                                  id="max.priority.fee"
                                  defaultMessage={'Max priority fee'}
                                />
                              }
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              size="small"
                              value={ethers.utils.formatUnits(
                                values.maxFeePerGas?.toString() || '0',
                                'gwei'
                              )}
                              onChange={handleChange}
                              name="maxFeePerGas"
                              fullWidth
                              variant="outlined"
                              label={
                                <FormattedMessage
                                  id="max.fee"
                                  defaultMessage={'Max fee'}
                                />
                              }
                            />
                          </Grid>
                        </>
                      ) : (
                        <>
                          <Grid item xs={12}>
                            <TextField
                              size="small"
                              value={ethers.utils.formatUnits(
                                values.gasPrice?.toString() || '0',
                                'gwei'
                              )}
                              onChange={handleChange}
                              name="gasPrice"
                              fullWidth
                              variant="outlined"
                              label={
                                <FormattedMessage
                                  id="gas.price"
                                  defaultMessage={'Gas price'}
                                />
                              }
                            />
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </Box>
                </Collapse>
              </Box>
            </Paper>
          </Grid>
          {isInsufficientFunds && (
            <Grid item xs={12}>
              <Alert severity="error">
                {' '}
                <FormattedMessage
                  id="insufficient.funds"
                  defaultMessage={'Insufficient funds'}
                />{' '}
              </Alert>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          startIcon={<Check />}
          disabled={
            Number(ethers.utils.formatEther(etherBalance || '0')) <
              gasCost(values) +
                parseInt(
                  values.value ? ethers.utils.formatEther(values.value) : '0'
                ) || gasCost(values) === 0
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
};
