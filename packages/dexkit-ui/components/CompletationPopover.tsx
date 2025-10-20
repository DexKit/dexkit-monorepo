import AutoFixHigh from "@mui/icons-material/AutoFixHigh";
import {
  Box,
  Button,
  CircularProgress,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { FormattedMessage } from "react-intl";
import { usePlanCheckoutMutation, useSubscription } from "../hooks/payments";
import { TextImproveAction } from "../types/ai";
import CompletationForm from "./CompletationForm";

export interface CompletationPopoverProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  output?: string;
  initialPrompt?: string;
  onClose: () => void;
  onGenerate: (prompt: string, action?: TextImproveAction) => Promise<void>;
  onConfirm: () => void;
  multiline?: boolean;
  filteredActions?: TextImproveAction[];
  selectedAction?: TextImproveAction;
}

export default function CompletationPopover({
  open,
  anchorEl,
  output,
  initialPrompt,
  onClose,
  onGenerate,
  onConfirm,
  multiline,
  selectedAction,
  filteredActions,
}: CompletationPopoverProps) {
  const subQuery = useSubscription();
  const { mutateAsync: checkoutPlan, isLoading } = usePlanCheckoutMutation();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubscribe = async () => {
    try {
      await checkoutPlan({ plan: "free" });

      enqueueSnackbar(
        <FormattedMessage id="ai.activated" defaultMessage="AI Activated" />,
        { variant: "success" }
      );

      await subQuery.refetch();
    } catch (err) {
      enqueueSnackbar(String(err), { variant: "error" });
    }
  };

  return (
    <Popover
      onClose={onClose}
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: "center", vertical: "center" }}
      transformOrigin={{ horizontal: "center", vertical: "center" }}
      sx={{
        '& .MuiPopover-paper': {
          maxWidth: '90vw',
          maxHeight: '90vh',
        }
      }}
    >
      <Box
        sx={(theme) => ({
          [theme.breakpoints.up("sm")]: {
            width: theme.breakpoints.values.lg,
          },
          width: "100%",
        })}
      >
        {subQuery.data ? (
          <CompletationForm
            onGenerate={onGenerate}
            output={output}
            onConfirm={onConfirm}
            initialPrompt={initialPrompt}
            multiline={multiline}
            filteredActions={filteredActions}
            selectedAction={selectedAction}
          />
        ) : subQuery.isSuccess ? (
          <Stack sx={{ p: 2 }} spacing={2} alignItems="center">
            <AutoFixHigh fontSize="large" />
            <Box>
              <Typography align="center" variant="h5">
                <FormattedMessage
                  id="ai.assistant"
                  defaultMessage="AI Assistant"
                />
              </Typography>
              <Typography align="center" variant="body1" color="text.secondary">
                <FormattedMessage
                  id="unlock.the.power.of.artificial.intelligence.by.activating.it"
                  defaultMessage="Unlock the power of artificial intelligence by activating it"
                />
              </Typography>
            </Box>
            <Button onClick={handleSubscribe} variant="contained">
              <FormattedMessage id="activate" defaultMessage="Activate AI" />
            </Button>
          </Stack>
        ) : (
          <Stack alignItems="center" sx={{ py: 2 }} justifyContent="center">
            <CircularProgress />
          </Stack>
        )}
      </Box>
    </Popover>
  );
}
