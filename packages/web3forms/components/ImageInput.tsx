import { getNormalizedUrl } from "@dexkit/core/utils";
import MediaDialog from "@dexkit/ui/components/mediaDialog";
import { getAcceptedMultimediaTypes, validateMultimediaFile } from "@dexkit/ui/utils/fileValidation";
import ImageIcon from "@mui/icons-material/Image";
import { Alert, Box, ButtonBase, Snackbar, Stack, Typography, useTheme } from "@mui/material";
import { useFormikContext } from "formik";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

const getMediaTypeFromUrl = (url: string): 'image' | 'video' | 'audio' => {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('.mp4') || lowerUrl.includes('.mov') || lowerUrl.includes('.webm')) {
    return 'video';
  }
  if (lowerUrl.includes('.mp3') || lowerUrl.includes('.wav') || lowerUrl.includes('.ogg') || lowerUrl.includes('.flac')) {
    return 'audio';
  }
  return 'image';
};
export interface ImageInputProps {
  name: string;
  label: string;
}

export function ImageInput({ name, label }: ImageInputProps) {
  const { setFieldValue, values } = useFormikContext<any>();

  const [showDialog, setShowDialog] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleToggle = () => {
    setShowDialog((value) => !value);
    setValidationError(null);
  };

  const handleFileSelect = (file: any) => {
    if (file instanceof File) {
      const validation = validateMultimediaFile(file);
      if (!validation.isValid) {
        setValidationError(validation.error || 'Invalid file type');
        return;
      }
    }

    setFieldValue(name, file.url);
    setValidationError(null);
  };

  const theme = useTheme();

  return (
    <>
      <MediaDialog
        dialogProps={{
          open: showDialog,
          fullWidth: true,
          maxWidth: "lg",
          onClose: handleToggle,
        }}
        onConfirmSelectFile={handleFileSelect}
        accept={getAcceptedMultimediaTypes()}
      />

      <Snackbar
        open={!!validationError}
        autoHideDuration={6000}
        onClose={() => setValidationError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setValidationError(null)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {validationError}
        </Alert>
      </Snackbar>

      <ButtonBase
        onClick={handleToggle}
        sx={{
          display: "block",
          height: { xs: "120px", sm: "160px" },
          width: { xs: "120px", sm: "160px" },
          maxHeight: { xs: "120px", sm: "160px" },
          maxWidth: { xs: "120px", sm: "160px" },
          margin: { xs: "0 auto", sm: "0" },
          aspectRatio: "1/1",
          borderRadius: "50%",
          flexShrink: 0,
        }}
      >
        {values[name] ? (
          (() => {
            const mediaType = getMediaTypeFromUrl(values[name]);
            if (mediaType === 'video') {
              return (
                <Box
                  component="video"
                  src={getNormalizedUrl(values[name])}
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    display: "block",
                    height: "100%",
                    width: "100%",
                    aspectRatio: "1/1",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              );
            } else if (mediaType === 'audio') {
              return (
                <Box
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    height: "100%",
                    width: "100%",
                    aspectRatio: "1/1",
                    borderRadius: "50%",
                    background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="h4" color="white">♪</Typography>
                </Box>
              );
            } else {
              return (
                <img
                  src={getNormalizedUrl(values[name])}
                  style={{
                    border: `1px solid ${theme.palette.divider}`,
                    display: "block",
                    height: "100%",
                    width: "100%",
                    aspectRatio: "1/1",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              );
            }
          })()
        ) : (
          <Box
            sx={{
              display: "block",
              height: "100%",
              width: "100%",
              aspectRatio: "1/1",
              borderRadius: "50%",
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{
                height: "100%",
                width: "100%",
                color: (theme) => theme.palette.text.secondary,
              }}
              alignContent="center"
            >
              <ImageIcon sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }} color="inherit" />
              <Typography color="inherit" variant="caption">
                <FormattedMessage id="media" defaultMessage="Media" />
              </Typography>
            </Stack>
          </Box>
        )}
      </ButtonBase>
    </>
  );
}
