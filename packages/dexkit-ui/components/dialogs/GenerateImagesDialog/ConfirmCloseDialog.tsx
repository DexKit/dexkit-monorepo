import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Grid,
  styled,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { FormattedMessage } from "react-intl";
import { useGenerateImageContext } from "../../../hooks/ai";
import { AppDialogTitle } from "../../AppDialogTitle";

const Img = styled("img")({});

export interface ConfirmCloseDialogProps {
  DialogProps: DialogProps;
  onClose: () => void;
}

export default function ConfirmCloseDialog({
  DialogProps,
  onClose,
}: ConfirmCloseDialogProps) {
  const { onClose: onDialogClose } = DialogProps;

  const handleClose = () => {
    if (onDialogClose) {
      onDialogClose({}, "backdropClick");
    }
  };

  const { unsavedImages, saveImages, isSavingImages, addSavedImages } =
    useGenerateImageContext();

  const { enqueueSnackbar } = useSnackbar();

  const handleSaveImages = async () => {
    if (saveImages && unsavedImages) {
      try {
        await saveImages({ urls: unsavedImages });
        addSavedImages(unsavedImages);
        handleClose();
      } catch (err) {
        enqueueSnackbar(String(err), { variant: "error" });
      }
    }
  };

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="save.generated.images"
            defaultMessage="Save generated images?"
          />
        }
        onClose={handleClose}
        disableClose={isSavingImages}
      />
      <DialogContent dividers>
        <Grid container spacing={2}>
          {unsavedImages.map((img: string) => (
            <Grid size={3}>
              <Img
                src={img}
                sx={{
                  aspectRatio: "1/1",
                  width: "100%",
                  height: "100%",
                  borderRadius: (theme) => typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius / 2 : theme.shape.borderRadius,
                }}
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleSaveImages}
          startIcon={
            isSavingImages ? (
              <CircularProgress color="inherit" size="1rem" />
            ) : undefined
          }
          disabled={isSavingImages}
          variant="contained"
        >
          <FormattedMessage id="save" defaultMessage="Save" />
        </Button>
        <Button disabled={isSavingImages} variant="outlined" onClick={onClose}>
          <FormattedMessage id="close.anyway" defaultMessage="Close anyway" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
