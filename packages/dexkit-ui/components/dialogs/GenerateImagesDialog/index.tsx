import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import Close from "@mui/icons-material/Close";
import ExpandMore from "@mui/icons-material/ExpandMore";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { createPortal } from "react-dom";
import Decimal from "decimal.js";
import { useSnackbar } from "notistack";
import { MouseEvent, useCallback, useMemo, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useGenVariants, useGenerateImageContext } from "../../../hooks/ai";
import {
  usePlanCheckoutMutation,
  useSubscription
} from "../../../hooks/payments";
import AIOptionsMenu from "../../AIOptionsMenu";
import AddCreditsButton from "../../AddCreditsButton";
import PaywallBackdrop from "../../PaywallBackdrop";
import ConfirmCloseDialog from "./ConfirmCloseDialog";
import EditTab from "./EditTab";
import GenerateTab from "./GenerateTab";
import ImagesContextProvider from "./ImagesContextProvider";
import SelectTab from "./SelectTab";
import VariantsTab from "./VariantsTab";

export interface GenerateImagesDialogProps {
  DialogProps: DialogProps;
  tab?: string;
  image?: string;
  defaultPrompt?: string;
}

function GenerateImagesDialog({
  DialogProps,
  tab,
  image,
  defaultPrompt,
}: GenerateImagesDialogProps) {
  const { onClose } = DialogProps;

  // generated images
  const { isSavingImages, generatedImages, savedImages, hasUnsavedImages } =
    useGenerateImageContext();

  const [showConfirm, setShowConfirm] = useState(false);

  const handleClose = () => {
    if (onClose) {
      if (hasUnsavedImages) {
        setShowConfirm(true);
      } else {
        onClose({}, "backdropClick");
      }
    }
  };

  const [selectedTab, setTab] = useState(tab ? tab : "select");

  const [varImgUrl, setVarImgUrl] = useState<string | undefined>(
    image ? image : undefined
  );

  const {
    mutateAsync: genVariants,
    isLoading: isGenVariants,
    data: variants,
    reset: resetGenVariants,
  } = useGenVariants();

  const handleCancelVariant = () => {
    setTab("select");
    resetGenVariants();
  };

  const handleOpenMenu = useCallback(
    (opt: string, { url }: { url: string }) => {
      setVarImgUrl(url);
      if (opt === "variant") {
        setTab("variants");
        resetGenVariants();
      } else if (opt === "edit") {
        setTab("edit");
      }
    },
    []
  );

  const { addGeneratedImages } = useGenerateImageContext();

  const handleGenVariants = useCallback(
    async ({ numImages }: { numImages: number }) => {
      if (varImgUrl) {
        try {
          let variants = await genVariants({
            numImages: numImages,
            url: varImgUrl,
          });

          if (variants) {
            addGeneratedImages(variants);
          }
        } catch (err) {
          enqueueSnackbar(String(err), { variant: "error" });
        }
      }
    },
    [varImgUrl]
  );

  const { data: sub, refetch: refetchSub } = useSubscription();

  const { mutateAsync: checkoutPlan, isLoading } = usePlanCheckoutMutation();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubscribe = async () => {
    try {
      await checkoutPlan({ plan: "free" });

      enqueueSnackbar(
        <FormattedMessage id="ai.activated" defaultMessage="AI Activated" />,
        { variant: "success" }
      );

      await refetchSub();
    } catch (err) {
      enqueueSnackbar(String(err), { variant: "error" });
    }
  };

  const handleEdit = () => {
    setTab("edit");
  };

  const handleVariants = () => {
    setTab("variants");
  };

  const renderContent = () => {
    if (!sub) {
      return (
        <Stack sx={{ p: 2 }} spacing={2} alignItems="center">
          <AutoFixHighIcon fontSize="large" />
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
            <FormattedMessage id="activate.ai" defaultMessage="Activate AI" />
          </Button>
        </Stack>
      );
    }

    return (
      <Stack sx={{ p: 2 }} spacing={2}>
        {selectedTab === "select" && varImgUrl && (
          <SelectTab
            imageUrl={varImgUrl}
            onEdit={handleEdit}
            onGenVariants={handleVariants}
            key={varImgUrl}
          />
        )}
        {selectedTab === "generator" && (
          <GenerateTab
            onMenuOption={handleOpenMenu}
            disabled={isSavingImages}
            defaultPrompt={defaultPrompt}
            key={varImgUrl}
          />
        )}
        {selectedTab === "variants" && varImgUrl && (
          <VariantsTab
            onCancel={handleCancelVariant}
            onMenuOption={handleOpenMenu}
            disabled={isSavingImages}
            isLoading={isGenVariants}
            onGenVariants={handleGenVariants}
            variants={variants || []}
            imageUrl={varImgUrl}
            key={varImgUrl}
          />
        )}
        {selectedTab === "edit" && varImgUrl && (
          <EditTab
            key={varImgUrl}
            imageUrl={varImgUrl}
            onMenuOption={handleOpenMenu}
          />
        )}
      </Stack>
    );
  };
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleBillingClick = () => {
    setAnchorEl(null);
    if (onClose) {
      onClose({}, "backdropClick");
    }
    setTimeout(() => {
      window.location.href = "/u/settings?section=billing";
    }, 200);
  };



  const credits = useMemo(() => {
    if (sub) {
      return (new Decimal(sub?.creditsAvailable).minus(
        new Decimal(sub?.creditsUsed)
      )
      ).toNumber();
    }

    return 0;
  }, [sub]);

  const handleCloseConfirm = (
    event: {},
    reason: "backdropClick" | "escapeKeyDown"
  ) => {
    if (reason !== "backdropClick") {
      if (onClose) {
        onClose({}, "backdropClick");
      }
      setShowConfirm(false);
    }
  };

  const handleCloseDialog = () => {
    setShowConfirm(false);

    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  return (
    <>
      <ConfirmCloseDialog
        DialogProps={{
          maxWidth: "sm",
          fullWidth: true,
          onClose: handleCloseConfirm,
          open: showConfirm,
        }}
        onClose={handleCloseDialog}
      />
      <AIOptionsMenu
        MenuProps={{
          open: Boolean(anchorEl),
          anchorEl,
          onClose: handleCloseMenu,
          onBillingClick: handleBillingClick,
        }}
      />

      <Dialog {...DialogProps}>
        <DialogTitle
          sx={{
            zIndex: (theme) => theme.zIndex.modal + 1,
            display: "flex",
            justifyContent: "space-between",
            p: 2,
            alignItems: "center",
            alignContent: "center",
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            alignContent="center"
          >
            <Typography variant="inherit">
              <FormattedMessage
                id="ai.image.generator"
                defaultMessage="AI Image Generator"
              />
            </Typography>
          </Stack>
          {onClose && (
            <Stack spacing={1} direction="row" alignItems="center">
              <Button
                ref={buttonRef}
                startIcon={<ExpandMore fontSize="small" />}
                onClick={handleClick}
                size="small"
                variant="outlined"
              >
                <FormattedMessage id="settings" defaultMessage="Settings" />
              </Button>
              <IconButton onClick={handleClose}>
                <Close />
              </IconButton>
            </Stack>
          )}
        </DialogTitle>
        <Divider />
        <Box sx={{ position: "relative" }}>
          <DialogContent sx={{ p: 0 }}>
            {credits <= 0.5 && (
              <>
                <Box p={2}>
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
                </Box>

                <Divider />
              </>
            )}
            {renderContent()}
          </DialogContent>
          <PaywallBackdrop />
        </Box>
      </Dialog>
    </>
  );
}

export default function GenerateImagesDialogWrapper(
  props: GenerateImagesDialogProps
) {
  return (
    <ImagesContextProvider>
      <GenerateImagesDialog {...props} />
    </ImagesContextProvider>
  );
}
