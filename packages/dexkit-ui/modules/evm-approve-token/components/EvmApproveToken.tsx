import { useDexKitContext } from "@dexkit/ui/hooks";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  TextField,
} from "@mui/material";
import { Form, Formik } from "formik";
import { FormattedMessage } from "react-intl";

import { Token } from "@dexkit/core/types";
import { ConnectButton } from "../../../components/ConnectButton";
import FormikDecimalInput from "../../../components/FormikDecimalInput";
import { useSetAllowanceToken } from "../hooks";

export interface EvmApproveTokenProps {
  chainId?: number;
  account?: string;
  spender?: string;
  showSpenderField?: boolean;
  isRevoke?: boolean;
  onConnectWallet?: () => void;
  token?: Token;
}

export default function EvmApproveToken({
  chainId,
  account,
  spender,
  isRevoke,
  showSpenderField,
  onConnectWallet,
  token,
}: EvmApproveTokenProps) {
  const { createNotification, watchTransactionDialog } = useDexKitContext();

  const setAllowanceTokenMutation = useSetAllowanceToken({
    contractAddress: token?.address,
    onSubmit: (
      hash: string,
      quantity: string,
      spender: string,
      name: string,
      symbol: string
    ) => {
      if (hash && chainId) {
        createNotification({
          type: "transaction",
          icon: "receipt",
          subtype: isRevoke ? "revokeSpender" : "approveSpender",
          values: { quantity, symbol, name, spender },
          metadata: { chainId, hash },
        });

        watchTransactionDialog.watch(hash);
      }
    },
  });

  const handleSubmit: any = async ({
    amount,
    spender,
  }: {
    amount: string;
    spender: string;
  }) => {
    if (token) {
      watchTransactionDialog.open(
        isRevoke ? "revokeSpender" : "approveSpender",
        {
          quantity: amount,
          symbol: token?.symbol,
          spender: spender,
          name: token?.name,
        }
      );
    }

    try {
      await setAllowanceTokenMutation.mutateAsync({
        quantity: amount,
        spender,
      });
    } catch (err) {
      watchTransactionDialog.setError(err as any);
    }
  };

  if (!account) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="center">
            <ConnectButton variant="contained" color="primary" size="large" />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={{ amount: isRevoke ? "0" : "1", spender: spender }}
    >
      {({ isSubmitting, isValid, submitForm, errors }) => (
        <Form>
          <Stack spacing={2}>
            {!isRevoke && (
              <FormikDecimalInput
                name="amount"
                TextFieldProps={{
                  label: (
                    <FormattedMessage id="amount" defaultMessage="Amount" />
                  ),
                }}
                maxDigits={token?.decimals}
              />
            )}
            {showSpenderField && (
              <TextField
                name="spender"
                label={
                  <FormattedMessage id="spender" defaultMessage="Spender" />
                }
              />
            )}

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
              {isRevoke ? (
                <FormattedMessage id="revoke" defaultMessage="Revoke" />
              ) : (
                <FormattedMessage id="approve" defaultMessage="Approve" />
              )}
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}
