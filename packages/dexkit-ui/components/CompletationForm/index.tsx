import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { Decimal } from "decimal.js";
import { Field, Formik } from "formik";
import { TextField } from "formik-mui";
import { MouseEvent, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import * as Yup from "yup";
import { aiModelsItems } from "../../constants/ai";
import { useSubscription } from "../../hooks/payments";
import { AI_MODEL, AI_MODEL_TYPE, TextImproveAction } from "../../types/ai";
import { stringToJson } from "../../utils";
import AIOptionsMenu from "../AIOptionsMenu";
import AddCreditsButton from "../AddCreditsButton";
import CodeSection from "../CodeSection";
import PaywallBackdrop from "../PaywallBackdrop";
import ImproveTextActionList from "./ImproveTextActionList";

const FormScheme = Yup.object({
  prompt: Yup.string().required(),
  action: Yup.mixed<TextImproveAction>()
    .oneOf(Object.values(TextImproveAction))
    .required(),
});

export interface CompletationFormProps {
  onGenerate: (
    prompt: string,
    action?: TextImproveAction,
    model?: AI_MODEL
  ) => Promise<void>;
  output?: string;
  initialPrompt?: string;
  onConfirm: () => void;
  multiline?: boolean;
  filteredActions?: TextImproveAction[];
  selectedAction?: TextImproveAction;
}

export default function CompletationForm({
  onGenerate,
  output,
  initialPrompt,
  onConfirm,
  multiline,
  filteredActions,
  selectedAction
}: CompletationFormProps) {
  const handleSubmit = async ({
    prompt,
    action,
    model,
  }: {
    prompt: string;
    action?: TextImproveAction;
    model: AI_MODEL;
  }) => {
    await onGenerate(prompt, action, model);
  };

  const { data: sub } = useSubscription();

  const total = useMemo(() => {
    if (sub) {
      return new Decimal(sub?.creditsAvailable).minus(new Decimal(sub?.creditsUsed)).toNumber();
    }

    return 0;
  }, [sub]);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [selectedAiModelType, setSelectedAiModelType] = useState<
    AI_MODEL_TYPE | undefined
  >(

    selectedAction ?

      selectedAction === TextImproveAction.GENERATE_IMAGE ? AI_MODEL_TYPE.IMAGE : selectedAction === TextImproveAction.GENERATE_CODE ? AI_MODEL_TYPE.CODE : AI_MODEL_TYPE.TEXT
      : undefined

  );

  function getInitialModel() {

    if (selectedAction === TextImproveAction.GENERATE_CODE) {
      return AI_MODEL.CLAUDE_4_SONNET;
    }
    return AI_MODEL.GPT_3_5_TURBO;

  }
  const isSingleAction = filteredActions && filteredActions.length === 1 && selectedAction;

  const isGenerateCode = selectedAction === TextImproveAction.GENERATE_CODE;


  return (
    <>
      <AIOptionsMenu
        MenuProps={{ open: Boolean(anchorEl), anchorEl, onClose: handleClose }}
      />
      <Box sx={{ position: "relative", p: 2 }}>
        <Formik
          initialValues={{
            prompt: initialPrompt ? initialPrompt : "",
            action: selectedAction,
            model: getInitialModel(),
          }}
          onSubmit={handleSubmit}
          validationSchema={FormScheme}
        >
          {({ submitForm, isSubmitting, values, isValid, setFieldValue }: any) => (
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

                  {selectedAction === TextImproveAction.GENERATE_CODE ?
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                      >

                        <Typography variant="body1" color="text.secondary">{isSubmitting ? (
                          <Skeleton />
                        ) : <FormattedMessage
                          id="code"
                          defaultMessage="Code"
                        />}</Typography>

                      </AccordionSummary>
                      <AccordionDetails>

                        {output}
                      </AccordionDetails>

                    </Accordion>


                    : <Typography variant="body1" color="text.secondary">
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
                    </Typography>}
                  {output &&
                    selectedAction === TextImproveAction.GENERATE_CODE &&
                    typeof stringToJson(output) === "object" && (
                      <Box
                        mt={12}
                        position="relative"
                        sx={{ transform: "translate(0,0)" }}
                      >
                        <CodeSection
                          section={{
                            type: "code-page-section",
                            config: {
                              html: stringToJson(output)?.html,
                              js: stringToJson(output)?.js,
                              css: stringToJson(output)?.css,
                            },
                          }}
                        />
                      </Box>
                    )}
                  {output && (
                    <Stack spacing={2}>
                      {values.action === TextImproveAction.GENERATE_CODE &&
                        typeof stringToJson(output) !== "object" && (
                          <Alert severity="warning">
                            <FormattedMessage
                              id="code.malformatted"
                              defaultMessage="The response from the AI model is not properly formatted! It's recommended to copy and paste the response into a code editor manually."
                            />
                          </Alert>
                        )}
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="contained"
                          onClick={onConfirm}
                          size="small"
                        >
                          <FormattedMessage id="use" defaultMessage="use" />
                        </Button>
                        {/* <Button
                          onClick={() => setFieldValue("prompt", output)}
                          size="small"
                          variant="outlined"
                        >
                          <FormattedMessage
                            id="use.as.prompt"
                            defaultMessage="use as prompt"
                          />
                        </Button>*/}
                      </Stack>
                      <Divider />
                    </Stack>
                  )}
                </Stack>
              )}
              {!isSingleAction && <Box>
                <ImproveTextActionList
                  value={values.action}
                  onChange={(item) => {
                    if (item.action === values.action) {
                      setSelectedAiModelType(undefined);
                      return setFieldValue("action", undefined);
                    }
                    setSelectedAiModelType(item.type);
                    setFieldValue("action", item.action);
                  }}
                  disabled={total === 0}
                  filteredActions={filteredActions}
                />
              </Box>}
              <Divider />

              <Stack direction="row" justifyContent={isGenerateCode ? "space-between" : 'end'}>
                {isGenerateCode && <Field name="model">
                  {({ field }: any) => (
                    <Select
                      {...field}
                      color="primary"
                      sx={{ minWidth: 200 }}
                      disabled={values.action === undefined}
                    >
                      {aiModelsItems
                        .filter(
                          (model) =>
                            selectedAiModelType === undefined ||
                            model.type === selectedAiModelType
                        )
                        .map((model) => {
                          return (
                            <MenuItem key={model.model} value={model.model}>
                              {model.model}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  )}
                </Field>}
                <Stack direction="row" spacing={1}>
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
              </Stack>
            </Stack>
          )}
        </Formik>
        <PaywallBackdrop />
      </Box>
    </>
  );
}
