import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { Field, Formik } from "formik";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FormattedMessage } from "react-intl";

import { TextField } from "formik-mui";

import { Decimal } from "decimal.js";

import { MouseEvent, useMemo, useState } from "react";
import * as Yup from "yup";
import { TextImproveAction } from "../../constants/ai";
import { useActiveFeatUsage, useSubscription } from "../../hooks/payments";
import AIOptionsMenu from "../AIOptionsMenu";
import AddCreditsButton from "../AddCreditsButton";
import PaywallBackdrop from "../PaywallBackdrop";
import ImproveTextActionList from "./ImproveTextActionList";

const FormScheme = Yup.object({
  prompt: Yup.string().required(),
  action: Yup.mixed<TextImproveAction>()
    .oneOf(Object.values(TextImproveAction))
    .required(),
});

export interface CompletationFormProps {
  onGenerate: (prompt: string, action?: TextImproveAction) => Promise<void>;
  output?: string;
  initialPrompt?: string;
  onConfirm: () => void;
  multiline?: boolean;
  filteredActions?: TextImproveAction[];
}

export default function CompletationForm({
  onGenerate,
  output,
  initialPrompt,
  onConfirm,
  multiline,
  filteredActions,
}: CompletationFormProps) {
  const handleSubmit = async ({
    prompt,
    action,
  }: {
    prompt: string;
    action?: TextImproveAction;
  }) => {
    await onGenerate(prompt, action);
  };

  const { data: sub } = useSubscription();

  const { data: featUsage } = useActiveFeatUsage();

  const total = useMemo(() => {
    if (sub && featUsage) {
      return new Decimal(featUsage?.available)
        .minus(new Decimal(featUsage?.used))
        .add(
          new Decimal(sub?.creditsAvailable).minus(
            new Decimal(sub?.creditsUsed)
          )
        )
        .toNumber();
    }

    return 0;
  }, [featUsage, sub]);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AIOptionsMenu
        MenuProps={{ open: Boolean(anchorEl), anchorEl, onClose: handleClose }}
      />
      <Box sx={{ position: "relative", p: 2 }}>
        <Formik
          initialValues={{ prompt: initialPrompt ? initialPrompt : "" }}
          onSubmit={handleSubmit}
          validationSchema={FormScheme}
        >
          {({ submitForm, isSubmitting, values, isValid, setFieldValue }) => (
            <Stack spacing={2}>
              {total <= 0.5 && (
                <>
                  <Alert
                    severity="warning"
                    action={
                      <AddCreditsButton ButtonProps={{ color: "warning" }} />
                    }
                  >
                    <FormattedMessage
                      id="credits.below0.50"
                      defaultMessage="Your credits are now below $0.50. Please consider adding more credits to continue using our services."
                    />
                  </Alert>
                </>
              )}
              <Field
                component={TextField}
                variant="outlined"
                name="prompt"
                fullWidth
                disabled={total === 0 || isSubmitting}
                label={<FormattedMessage id="prompt" defaultMessage="Prompt" />}
                multiline={multiline}
                rows={3}
              />
              {(output || isSubmitting) && (
                <Stack spacing={2}>
                  <Typography variant="body1" color="text.secondary">
                    {isSubmitting ? (
                      <Skeleton />
                    ) : (
                      <>
                        <FormattedMessage
                          id="answer"
                          defaultMessage="Answer:"
                        />{" "}
                        {output}
                      </>
                    )}
                  </Typography>
                  {output && (
                    <Stack spacing={2}>
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="contained"
                          onClick={onConfirm}
                          size="small"
                        >
                          <FormattedMessage id="use" defaultMessage="use" />
                        </Button>
                        <Button
                          onClick={() => setFieldValue("prompt", output)}
                          size="small"
                          variant="outlined"
                        >
                          <FormattedMessage
                            id="use.as.prompt"
                            defaultMessage="use as prompt"
                          />
                        </Button>
                      </Stack>
                      <Divider />
                    </Stack>
                  )}
                </Stack>
              )}
              <Box>
                <ImproveTextActionList
                  value={values.action}
                  filteredActions={filteredActions}
                  onChange={(value: string) => {
                    if (value === values.action) {
                      return setFieldValue("action", undefined);
                    }
                    setFieldValue("action", value);
                  }}
                  disabled={total === 0}
                />
              </Box>
              <Divider />
              <Box>
                <Stack direction="row" justifyContent="flex-end" spacing={1}>
                  <Button
                    onClick={handleClick}
                    startIcon={<ExpandMoreIcon />}
                    disabled={isSubmitting}
                    variant="outlined"
                  >
                    <FormattedMessage id="settings" defaultMessage="Settings" />
                  </Button>
                  <Button
                    onClick={submitForm}
                    disabled={
                      isSubmitting || !values.action || !isValid || total === 0
                    }
                    startIcon={
                      isSubmitting ? (
                        <CircularProgress size="1rem" color="inherit" />
                      ) : (
                        <AutoAwesomeIcon />
                      )
                    }
                    variant="contained"
                  >
                    <FormattedMessage id="confirm" defaultMessage="Confirm" />
                  </Button>
                </Stack>
              </Box>
            </Stack>
          )}
        </Formik>
        <PaywallBackdrop />
      </Box>
    </>
  );
}
