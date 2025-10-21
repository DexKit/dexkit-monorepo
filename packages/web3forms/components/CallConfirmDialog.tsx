import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";

import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { FormattedMessage } from "react-intl";

import { formatEther } from "@dexkit/core/utils/ethers/formatEther";
import { parseUnits } from "@dexkit/core/utils/ethers/parseUnits";
import { AppDialogTitle } from "@dexkit/ui/components/AppDialogTitle";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import {
  Alert,
  Box,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { BigNumber } from "ethers";
import { ChangeEvent, useEffect, useState } from "react";
import { PARSE_UNITS } from "../constants";

export interface CallConfirmDialogProps {
  DialogProps: DialogProps;
  onConfirm: (value: BigNumber) => void;
  payable?: boolean;
  payableAmount?: BigNumber;
  execLabel?: string;
}

export default function CallConfirmDialog({
  DialogProps,
  onConfirm,
  payable,
  execLabel,
  payableAmount,
}: CallConfirmDialogProps) {
  const { onClose } = DialogProps;
  const { account, provider } = useWeb3React();

  const [unit, setUnit] = useState(PARSE_UNITS[0]);
  const [balance, setBalance] = useState<BigNumber | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  const [value, setValue] = useState({
    value: payableAmount ? formatEther(payableAmount) : "",
    parsed: payableAmount ? payableAmount : BigNumber.from(0),
  });

  useEffect(() => {
    const checkBalance = async () => {
      if (account && provider) {
        setIsLoadingBalance(true);
        try {
          const userBalance = await provider.getBalance(account);
          setBalance(userBalance);
        } catch (error) {
          console.error("Error fetching balance:", error);
        } finally {
          setIsLoadingBalance(false);
        }
      }
    };

    checkBalance();
  }, [account, provider]);

  const handleChangeUnit = (
    event: SelectChangeEvent<string>,
    child: React.ReactNode
  ) => {
    setUnit(event.target.value);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let parsedValue = BigNumber.from(0);

    const regex = /^\d+\.?(?:\d{1,2})?$/;

    try {
      parsedValue = parseUnits(e.target.value, unit);
    } catch (err) { }

    if (regex.test(e.target.value)) {
      setValue({ value: e.target.value, parsed: parsedValue });
    }
  };

  const handleConfirm = () => {
    onConfirm(value.parsed);
  };

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  const hasInsufficientBalance = balance && value.parsed.gt(balance);
  const estimatedGasCost = parseUnits("0.01", "ether");
  const totalCost = value.parsed.add(estimatedGasCost);
  const hasInsufficientBalanceWithGas = balance && totalCost.gt(balance);

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage id="confirm.call" defaultMessage="Confirm call" />
        }
      />
      <DialogContent dividers>
        <Stack spacing={2}>
          <Stack spacing={2} alignItems="center">
            <Box>
              <Typography variant="h5" align="center">
                <FormattedMessage
                  id="confirm.transaction"
                  defaultMessage="Confirm transaction"
                />
              </Typography>
              <Typography align="center" variant="body1" color="text.secondary">
                <FormattedMessage
                  id="please.confirm.the.transaction.in.your.wallet"
                  defaultMessage="Please, confirm the transaction in your wallet"
                />
              </Typography>
              {execLabel && (
                <Typography align="center" variant="body1">
                  <FormattedMessage
                    id="method.label"
                    defaultMessage="Method: {label}"
                    values={{ label: <strong>{execLabel}</strong> }}
                  />
                </Typography>
              )}
            </Box>
          </Stack>

          {balance && (
            <Box>
              <Typography variant="body2" color="text.secondary">
                <FormattedMessage
                  id="your.balance"
                  defaultMessage="Your balance"
                />: {formatEther(balance)} ETH
              </Typography>
            </Box>
          )}

          {hasInsufficientBalance && (
            <Alert severity="error">
              <FormattedMessage
                id="insufficient.balance.for.transaction"
                defaultMessage="Insufficient balance for this transaction"
              />
            </Alert>
          )}

          {!hasInsufficientBalance && hasInsufficientBalanceWithGas && (
            <Alert severity="warning">
              <FormattedMessage
                id="insufficient.balance.for.gas"
                defaultMessage="You may not have enough balance to cover gas fees. Consider reducing the amount."
              />
            </Alert>
          )}

          {payable && (
            <Box>
              <Grid container spacing={2}>
                <Grid size="grow">
                  <TextField
                    label={
                      <FormattedMessage id="amount" defaultMessage="Amount" />
                    }
                    value={value.value}
                    onChange={handleChange}
                    fullWidth
                    error={!!hasInsufficientBalance}
                    helperText={
                      hasInsufficientBalance ? (
                        <FormattedMessage
                          id="amount.exceeds.balance"
                          defaultMessage="Amount exceeds your balance"
                        />
                      ) : undefined
                    }
                  />
                </Grid>
                <Grid>
                  <Select value={unit} onChange={handleChangeUnit}>
                    {PARSE_UNITS.map((unit, key) => (
                      <MenuItem value={unit} key={key}>
                        {unit.toUpperCase()}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="primary"
          disabled={hasInsufficientBalance || isLoadingBalance}
        >
          <FormattedMessage id="confirm" defaultMessage="Confirm" />
        </Button>
        <Button onClick={handleClose}>
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
