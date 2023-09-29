import { getNormalizedUrl } from "@dexkit/core/utils";
import MediaDialog from "@dexkit/ui/components/mediaDialog";
import ImageIcon from "@mui/icons-material/Image";
import { Box, ButtonBase, Stack, Typography, useTheme } from "@mui/material";
import { useFormikContext } from "formik";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
export interface ImageInputProps {
  name: string;
  label: string;
}

export function ImageInput({ name, label }: ImageInputProps) {
  const { setFieldValue, values } = useFormikContext<any>();

  const [showDialog, setShowDialog] = useState(false);

  const handleToggle = () => {
    setShowDialog((value) => !value);
    // setFieldValue(name, undefined);
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
        onConfirmSelectFile={(file) => setFieldValue(name, file.url)}
      />

      <ButtonBase
        onClick={handleToggle}
        sx={{
          display: "block",
          height: "100%",
          width: "100%",
          aspectRatio: "1/1",
          borderRadius: "50%",
        }}
      >
        {values[name] ? (
          <img
            src={getNormalizedUrl(values[name])}
            style={{
              border: `1px solid ${theme.palette.divider}`,
              display: "block",
              height: "100%",
              width: "100%",
              aspectRatio: "1/1",
              borderRadius: "50%",
            }}
          />
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
              <ImageIcon color="inherit" />
              <Typography color="inherit" variant="caption">
                <FormattedMessage id="image" defaultMessage="Image" />
              </Typography>
            </Stack>
          </Box>
        )}
      </ButtonBase>
    </>
  );
}
