import { useDexKitContext } from "@dexkit/ui/hooks";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
} from "@mui/material";
import { Form, Formik } from "formik";
import { FormattedMessage } from "react-intl";
import { useBurnToken } from "../../evm-burn-nft/hooks";

import { Token } from "@dexkit/core/types";
import { ConnectButton } from "../../../components/ConnectButton";
import FormikDecimalInput from "../../../components/FormikDecimalInput";

export interface EvmBurnTokenProps {
  chainId?: number;
  account?: string;
  onConnectWallet?: () => void;
  token?: Token;
}

export default function EvmBurnToken({
  chainId,
  account,
  onConnectWallet,
  token,
}: EvmBurnTokenProps) {
  const { createNotification, watchTransactionDialog } = useDexKitContext();

  const burnTokenMutation = useBurnToken({
    contractAddress: token?.address,
    onSubmit: (
      hash: string,
      quantity: string,
      name: string,
      symbol: string
    ) => {
      if (hash && chainId) {
        createNotification({
          type: "transaction",
          icon: "receipt",
          subtype: "burnToken",
          values: { quantity, symbol, name },
          metadata: { chainId, hash },
        });

        watchTransactionDialog.watch(hash);
      }
    },
  });

  const handleSubmit = async ({ amount }: { amount: string }) => {
    if (token) {
      watchTransactionDialog.open("burnToken", {
        quantity: amount,
        symbol: token?.symbol,
        name: token?.name,
      });
    }

    try {
      await burnTokenMutation.mutateAsync({ quantity: amount });
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
              <FormattedMessage id="burn" defaultMessage="Burn" />
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}
