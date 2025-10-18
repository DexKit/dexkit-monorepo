import { IPFS_GATEWAY } from "@dexkit/core/constants";
import { AppDialogTitle } from "@dexkit/ui/components";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import UploadIcon from "@mui/icons-material/Upload";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { ChangeEvent, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useIfpsUploadMutation } from "../hooks";
export interface IpfsMediaDialogProps {
  DialogProps: DialogProps;
  images: { cid: string }[];
  onSelect: (url: string) => void;
  hasMore?: boolean;
  isLoading?: boolean;
  onLoadMore: () => void;
}

export default function IpfsMediaDialog({
  DialogProps,
  images,
  onSelect,
  hasMore,
  isLoading,
  onLoadMore,
}: IpfsMediaDialogProps) {
  const ipfsFileUploadMutation = useIfpsUploadMutation();

  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }

    setSelectedCid(undefined);

    ipfsFileUploadMutation.reset();
  };

  const [selectedCid, setSelectedCid] = useState<string>();

  const handleConfirm = () => {
    if (selectedCid) {
      onSelect(`ipfs://${selectedCid}`);
    }
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      let file = e.target.files[0];

      let reader = new FileReader();

      reader.onload = async (e) => {
        if (e.target?.result && e.target?.result instanceof ArrayBuffer) {
          let cid = await ipfsFileUploadMutation.mutateAsync({
            content: Buffer.from(e.target.result),
            token: "",
            isImage: true,
          });

          setSelectedCid(cid);
        }
      };

      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <>
      <input
        type="file"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileSelected}
        accept="image/*"
      />
      <Dialog {...DialogProps}>
        <AppDialogTitle
          title={
            <FormattedMessage id="select.file" defaultMessage="Select file" />
          }
          onClose={handleClose}
        />
        {ipfsFileUploadMutation.isLoading ? (
          <LinearProgress color="primary" variant="indeterminate" />
        ) : (
          <Divider />
        )}
        <DialogContent>
          <Grid container spacing={2}>
            <Grid size={12}>
              <Alert severity="info">
                <FormattedMessage
                  id="all.files.here.are.stored.on.ipfs"
                  defaultMessage="All files here are stored on IPFS"
                />
              </Alert>
            </Grid>
            {images.length > 0 && (
              <>
                <Grid size={12}>
                  <Button
                    disabled={ipfsFileUploadMutation.isLoading}
                    startIcon={<UploadIcon />}
                    variant="contained"
                    onClick={handleSelectFile}
                  >
                    <FormattedMessage id="upload" defaultMessage="Upload" />
                  </Button>
                </Grid>

                <Grid size={12}>
                  <Divider />
                </Grid>
              </>
            )}

            {images.length === 0 ? (
              <Grid size={12}>
                <Box>
                  <Stack
                    spacing={2}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <UploadFileIcon fontSize="large" />
                    <Box>
                      <Typography align="center" variant="h5">
                        <FormattedMessage
                          id="no.files"
                          defaultMessage="No files"
                        />
                      </Typography>
                      <Typography align="center" variant="body1">
                        <FormattedMessage
                          id="upload.a.file.to.ipfs"
                          defaultMessage="Upload a file to ipfs"
                        />
                      </Typography>
                    </Box>
                    <Button
                      onClick={handleSelectFile}
                      disabled={ipfsFileUploadMutation.isLoading}
                      startIcon={<UploadIcon />}
                      variant="contained"
                    >
                      <FormattedMessage id="upload" defaultMessage="Upload" />
                    </Button>
                  </Stack>
                </Box>
              </Grid>
            ) : (
              images.map((img, index) => (
                <Grid size={{ xs: 6, sm: 3 }} key={index}>
                  <Card
                    sx={{
                      borderColor: (theme) =>
                        img.cid === selectedCid
                          ? theme.palette.primary.main
                          : undefined,
                    }}
                  >
                    <CardActionArea
                      onClick={() => setSelectedCid(img.cid)}
                      sx={{ p: 1 }}
                    >
                      <CardMedia
                        image={`${IPFS_GATEWAY}${img.cid}`}
                        sx={{
                          height: "100%",
                          width: "100%",
                          aspectRatio: "1/1",
                        }}
                      />
                    </CardActionArea>
                  </Card>
                </Grid>
              ))
            )}
            {hasMore && (
              <Grid size={12}>
                <Button
                  disabled={isLoading}
                  startIcon={
                    isLoading ? (
                      <CircularProgress size="1rem" color="inherit" />
                    ) : (
                      <ExpandMoreIcon />
                    )
                  }
                  onClick={onLoadMore}
                  fullWidth
                  variant="outlined"
                >
                  <FormattedMessage id="load more" defaultMessage="Load more" />
                </Button>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button variant="contained" onClick={handleConfirm}>
            <FormattedMessage id="confirm" defaultMessage="Confirm" />
          </Button>
          <Button onClick={handleClose}>
            <FormattedMessage id="cancel" defaultMessage="Cancel" />
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
