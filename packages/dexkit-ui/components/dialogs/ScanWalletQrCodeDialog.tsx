import VideoCall from "@mui/icons-material/VideoCall";

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import QrScanner from "qr-scanner";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { AppDialogTitle } from "../AppDialogTitle";
import QrCodeScanner from "../QrCodeScanner";

export interface ScanWalletQrCodeDialogProps {
  DialogProps: DialogProps;
  onResult: (result: string) => void;
}

export default function ScanWalletQrCodeDialog({
  DialogProps,
  onResult,
}: ScanWalletQrCodeDialogProps) {
  const [cameras, setCameras] = useState<QrScanner.Camera[]>([]);
  const [camera, setCamera] = useState<string>();

  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  const requestCameraAccess = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(async function (stream) {
        let cameras = await QrScanner.listCameras();

        setCameras(cameras);

        if (cameras.length > 0) {
          setCamera(cameras[0].id);
        }
      })
      .catch(function (error) {
        console.error("Error accessing the camera: ", error);
      });
  };

  useEffect(() => {
    (async () => {
      let cameras = await QrScanner.listCameras();

      setCameras(cameras);
    })();
  }, []);

  useEffect(() => {
    if (cameras.length > 0) {
      setCamera(cameras[0].id);
    }
  }, [cameras]);

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage id="scan.wallet" defaultMessage="Scan wallet" />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent>
        <Stack spacing={2}>
          <Select
            value={camera || ""}
            onChange={(e: SelectChangeEvent<string>) =>
              setCamera(e.target.value)
            }
          >
            {cameras.map((camera: any) => (
              <MenuItem key={camera.id} value={camera.id}>
                {camera.label}
              </MenuItem>
            ))}
          </Select>

          {camera && cameras.length > 0 ? (
            <QrCodeScanner cameraId={camera} key={camera} onResult={onResult} />
          ) : (
            <Stack justifyContent="center" alignItems="center" spacing={2}>
              <VideoCall fontSize="large" />
              <Box>
                <Typography align="center" variant="h5">
                  <FormattedMessage
                    id="camera.permission"
                    defaultMessage="Camera Permission"
                  />
                </Typography>
                <Typography
                  align="center"
                  variant="body1"
                  color="text.secondary"
                >
                  <FormattedMessage
                    id="camera.permission.message"
                    defaultMessage="Please grant permission to continue."
                  />
                </Typography>
              </Box>

              <Button onClick={requestCameraAccess} variant="contained">
                <FormattedMessage
                  id="grang.access"
                  defaultMessage="Grant acccess"
                />
              </Button>
            </Stack>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
