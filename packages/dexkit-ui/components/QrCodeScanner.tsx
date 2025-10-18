import { styled } from "@mui/material";
import QrScanner from "qr-scanner";
import { useEffect, useRef } from "react";

const CustomView = styled("video")(({ theme }) => ({
  width: "100%",
  height: "auto",
  borderRadius: theme.shape.borderRadius,
}));

export interface QrCodeScannerProps {
  cameraId: string;
  onResult: (result: string) => void;
}

export default function QrCodeScanner({
  cameraId,
  onResult,
}: QrCodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const scanner = useRef<QrScanner | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      scanner.current = new QrScanner(
        videoRef.current,
        (result) => {
          onResult(result.data);
          scanner.current?.stop();
        },
        {
          preferredCamera: cameraId,
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      (async () => {
        await scanner.current?.start();
      })();
    }

    return () => {
      scanner.current?.destroy();
    };
  }, [videoRef.current]);

  return <CustomView ref={videoRef} />;
}
