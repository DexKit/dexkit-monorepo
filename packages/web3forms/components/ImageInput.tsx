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
                <FormattedMessage id="image" defaultMessage="Image" />
              </Typography>
            </Stack>
          </Box>
        )}
      </ButtonBase>
    </>
  );
}
