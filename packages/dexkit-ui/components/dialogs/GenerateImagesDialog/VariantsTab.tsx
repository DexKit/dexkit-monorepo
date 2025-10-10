import ArrowBack from "@mui/icons-material/ArrowBack";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Formik } from "formik";
import { useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import VariantsGrid from "./VariantsGrid";

import * as Yup from "yup";

const FormSchema = Yup.object({
  amount: Yup.number().min(1).max(10),
});

export interface VariantsTabProps {
  onCancel: () => void;
  imageUrl: string;
  isLoading?: boolean;
  disabled?: boolean;
  variants: string[];
  onGenVariants: ({ numImages }: { numImages: number }) => Promise<void>;
  onMenuOption: (opt: string, { url }: { url: string }) => void;
}

export default function VariantsTab({
  onCancel,
  imageUrl,
  isLoading,
  variants,
  disabled,
  onGenVariants,
  onMenuOption,
}: VariantsTabProps) {
  const [amount, setAmount] = useState(1);

  const handleSubmit = async (values: { amount: number }) => {
    setAmount(values.amount);

    await onGenVariants({
      numImages: values.amount,
    });
  };

  const gridSize = useMemo(() => {
    if (variants.length) {
      if (variants.length === 1) {
        return 6;
      } else if (variants.length === 2) {
        return 6;
      }
    }

    return 4;
  }, [variants]);

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={{ amount: 1 }}
      validationSchema={FormSchema}
    >
      {({ submitForm, setFieldValue, values, errors, isValid }: any) => (
        <Box>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box>
                <Stack spacing={2}>
                  <Stack spacing={0.5} direction="row" alignItems="center">
                    <IconButton onClick={onCancel}>
                      <ArrowBack />
                    </IconButton>
                    <Typography variant="h5" fontWeight="bold">
                      <FormattedMessage id="back" defaultMessage="Back" />
                    </Typography>
                  </Stack>
                  <Typography variant="subtitle1">
                    <FormattedMessage
                      id="original.image"
                      defaultMessage="Original image"
                    />
                  </Typography>
                  <Box>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Paper>
                          <img
                            src={imageUrl}
                            key={imageUrl}
                            style={{
                              display: "block",
                              aspectRatio: "1/1",
                              width: "100%",
                            }}
                          />
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>
                  <Divider />
                  <TextField
                    name="amount"
                    type="number"
                    disabled={disabled}
                    value={values.amount === 0 ? "" : values.amount}
                    onChange={(e: any) =>
                      setFieldValue("amount", parseInt(e.target.value || "0"))
                    }
                    label={
                      <FormattedMessage
                        id="num.of.variant"
                        defaultMessage="Num of variants"
                      />
                    }
                    error={Boolean(errors.amount)}
                    helperText={errors.amount ? errors.amount : undefined}
                  />
                  <Button
                    startIcon={
                      isLoading ? (
                        <CircularProgress color="inherit" size="1rem" />
                      ) : undefined
                    }
                    disabled={
                      isLoading || disabled || !isValid || values.amount === 0
                    }
                    onClick={submitForm}
                    variant="contained"
                  >
                    {isLoading ? (
                      <FormattedMessage
                        id="generating.variants"
                        defaultMessage="Generating Variants"
                      />
                    ) : (
                      <FormattedMessage
                        id="generate.variants"
                        defaultMessage="Generate Variants"
                      />
                    )}
                  </Button>
                </Stack>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              {variants.length > 0 && (
                <>
                  <Typography variant="subtitle1" fontWeight="bold">
                    <FormattedMessage id="variants" defaultMessage="Variants" />
                  </Typography>
                </>
              )}
              <VariantsGrid
                gridSize={gridSize}
                amount={amount}
                isLoading={isLoading}
                images={variants}
                disabled={disabled}
                onMenuOption={onMenuOption}
              />
            </Grid>
          </Grid>
        </Box>
      )}
    </Formik>
  );
}
