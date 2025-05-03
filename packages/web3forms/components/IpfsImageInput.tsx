import { getNormalizedUrl } from "@dexkit/core/utils";
import ImageIcon from "@mui/icons-material/Image";
import { Box, ButtonBase, Stack, Typography, useTheme } from "@mui/material";
import { useFormikContext } from "formik";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useIpfsFileListQuery } from "../hooks";
import IpfsMediaDialog from "./IpfsMediaDialog";

export interface ImageInputProps {
  name: string;
  label: string;
}

export function IpfsImageInput({ name, label }: ImageInputProps) {
  const { setFieldValue, values } = useFormikContext<any>();

  const [showDialog, setShowDialog] = useState(false);

  const handleToggle = () => {
    setShowDialog((value) => !value);
    setFieldValue(name, undefined);
  };

  const handleSelect = (url: string) => {
    setFieldValue(name, url);
    setShowDialog(false);
  };

  const ipfsFileListQuery = useIpfsFileListQuery({ page: 1, onlyImages: true });

  const theme = useTheme();

  return (
    <>
      <IpfsMediaDialog
        DialogProps={{
          open: showDialog,
          fullWidth: true,
          maxWidth: "sm",
          onClose: handleToggle,
        }}
        images={
          ipfsFileListQuery.data
            ? ipfsFileListQuery.data.pages
                .map((p) => p.items.map((f) => f))
                .flat()
            : []
        }
        hasMore={ipfsFileListQuery.hasNextPage}
        onSelect={handleSelect}
        isLoading={ipfsFileListQuery.isLoading}
        onLoadMore={() => ipfsFileListQuery.fetchNextPage()}
      />

      <ButtonBase
        onClick={handleToggle}
        sx={{
          display: "block",
          height: { xs: "100px", sm: "100%" },
          width: { xs: "100px", sm: "100%" },
          maxHeight: { xs: "100px", sm: "unset" },
          maxWidth: { xs: "100px", sm: "unset" },
          margin: { xs: "0 auto", sm: "unset" },
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
