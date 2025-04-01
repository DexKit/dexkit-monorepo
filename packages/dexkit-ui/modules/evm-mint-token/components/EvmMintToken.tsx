import { useDexKitContext } from "@dexkit/ui/hooks";
import WalletIcon from "@mui/icons-material/Wallet";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Stack,
  Switch,
} from "@mui/material";
import { Form, Formik } from "formik";
import { FormattedMessage } from "react-intl";
import { useMintToken } from "../hooks";

import { Token } from "@dexkit/core/types";
import { useState } from "react";
import { AddressField } from "../../../components/AddressField";
import FormikDecimalInput from "../../../components/FormikDecimalInput";

export interface EvmMintTokenProps {
  chainId?: number;
  account?: string;
  onConnectWallet?: () => void;
  token?: Token;
}

export default function EvmMintToken({
  chainId,
  account,
  onConnectWallet,
  token,
}: EvmMintTokenProps) {
  const [showAddress, setShowAddress] = useState(false);

  const { createNotification, watchTransactionDialog } = useDexKitContext();

  const mintTokenMutation = useMintToken({
    contractAddress: token?.address,
    onSubmit: (
      hash: string,
      quantity: string,
      name: string,
      symbol: string,
      to: string,
    ) => {
      if (hash && chainId) {
        createNotification({
          type: "transaction",
          icon: "receipt",
          subtype: "mintToken",
          values: { quantity, symbol, name, to },
          metadata: { chainId, hash },
        });

        watchTransactionDialog.watch(hash);
      }
    },
  });

  const handleSubmit = async ({
    amount,
    address,
  }: {
    amount: string;
    address?: string;
  }) => {
    if (token) {
      watchTransactionDialog.open("mintToken", {
        quantity: amount,
        to: address || account,
        symbol: token?.symbol,
        name: token?.name,
      });
    }

    try {
      await mintTokenMutation.mutateAsync({ quantity: amount, to: address });
    } catch (err) {
      watchTransactionDialog.setError(err as any);
    }
  };

  if (!account) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="center">
            <Button
              onClick={onConnectWallet}
              startIcon={<WalletIcon />}
              variant="contained"
              color="primary"
              size="large"
            >
              <FormattedMessage
                id="connect.wallet"
                defaultMessage="Connect Wallet"
              />
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Formik onSubmit={handleSubmit} initialValues={{ amount: "1" }}>
      {({ isSubmitting, isValid, submitForm, errors }) => (
        <Form>
          <Stack spacing={2}>
            <FormikDecimalInput
              name="amount"
              TextFieldProps={{
                label: <FormattedMessage id="amount" defaultMessage="Amount" />,
              }}
              maxDigits={token?.decimals}
            />
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    onChange={(ev) => setShowAddress(ev.currentTarget.checked)}
                  />
                }
                label={
                  <FormattedMessage id="sent.to" defaultMessage="Sent to" />
                }
              />
            </FormGroup>
            {showAddress && <AddressField />}
            <Button
              variant="contained"
              color="primary"
              onClick={submitForm}
              size="large"
              disabled={isSubmitting || !isValid}
              startIcon={
                isSubmitting ? (
                  <CircularProgress color="inherit" size="1rem" />
                ) : undefined
              }
            >
              <FormattedMessage id="mint" defaultMessage="Mint" />
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}
