import Check from "@mui/icons-material/Check";
import Close from "@mui/icons-material/Close";
import Edit from "@mui/icons-material/Edit";
import { Box, IconButton, Paper, Skeleton, Stack, alpha } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";

export interface MaskEditorProps {
  imageUrl: string;
  size?: { width: number; height: number };
  onChange: (value: string) => void;
}

export default function MaskEditor({
  imageUrl,
  size,
  onChange,
}: MaskEditorProps) {
  const canvas = React.useRef<HTMLCanvasElement | null>(null);
  const circleCanvas = React.useRef<HTMLCanvasElement | null>(null);
  const maskCanvas = React.useRef<HTMLCanvasElement | null>(null);

  const circleCtx = React.useRef<CanvasRenderingContext2D | null>(null);
  const maskCtx = React.useRef<CanvasRenderingContext2D | null>(null);
  const ctx = React.useRef<CanvasRenderingContext2D | null>(null);

  const [canvasSize, setCanvasSize] = useState(
    size ? size : { width: 512, height: 512 }
  );

  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    if (canvas.current && circleCanvas.current && maskCanvas.current) {
      ctx.current = canvas.current?.getContext("2d");
      circleCtx.current = circleCanvas.current?.getContext("2d");
      maskCtx.current = maskCanvas.current?.getContext("2d");

      let img = new Image(canvasSize.width, canvasSize.height);
      img.src = imageUrl;

      if (maskCtx.current) {
        maskCtx.current.fillStyle = "rgba(0,0,0,1)";
        maskCtx.current?.fillRect(0, 0, canvasSize.width, canvasSize.height);
      }

      img.onload = () => {
        setIsImageLoading(false);
        ctx.current?.drawImage(img, 0, 0, canvasSize.width, canvasSize.height);
      };
    }
  }, [imageUrl, canvasSize]);

  const [isEditing, setIsEditing] = useState(false);

  const [isPressed, setIsPressed] = useState(false);
  const [imageMask, setImageMask] = useState<string>();

  const handleMouseDown = useCallback(() => {
    setIsPressed(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsPressed(false);
  }, []);

  const handleDrawCircle = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement, globalThis.MouseEvent>) => {
      if (circleCanvas.current) {
        let rect = circleCanvas.current?.getBoundingClientRect();

        const ctx = circleCtx.current;
        ctx?.clearRect(0, 0, canvasSize.width, canvasSize.height);
        ctx?.beginPath();
        if (ctx) {
          ctx.fillStyle = "rgba(255, 0, 0, 1)";
          ctx.lineWidth = 0;
        }

        ctx?.arc(
          event.clientX - rect.left,
          event.clientY - rect.top,
          20,
          0,
          2 * Math.PI
        );
        ctx?.fill();
      }

      if (maskCanvas.current && isPressed) {
        let rect = maskCanvas.current?.getBoundingClientRect();

        const ctx = maskCtx.current;

        if (ctx) {
          ctx.fillStyle = "rgba(255, 255, 255, 1)";
          ctx.lineWidth = 0;
          ctx.lineCap;
          ctx.strokeStyle = "none";
          ctx.imageSmoothingEnabled = false;
          //@ts-ignore
          ctx.mozImageSmoothingEnabled = false;
          //@ts-ignore
          ctx.msImageSmoothingEnabled = false;
          //@ts-ignore
          ctx.oImageSmoothingEnabled = false;
          //@ts-ignore
          ctx.webkitImageSmoothingEnabled = false;
        }
        ctx?.beginPath();

        ctx?.arc(
          event.clientX - rect.left,
          event.clientY - rect.top,
          20,
          0,
          2 * Math.PI
        );
        ctx?.fill();
      }
    },
    [
      circleCtx.current,
      isPressed,
      maskCtx.current,
      maskCanvas.current,
      circleCanvas.current,
      canvasSize,
    ]
  );

  const handleClear = () => {
    if (maskCtx.current) {
      maskCtx.current.clearRect(0, 0, canvasSize.width, canvasSize.width);
      maskCtx.current.fillStyle = "#000";
      maskCtx.current?.fillRect(0, 0, canvasSize.width, canvasSize.height);
    }
  };

  const handleGetMask = useCallback(() => {
    if (maskCanvas.current && maskCtx.current) {
      // Get the canvas image data
      let imageData = maskCtx.current.getImageData(
        0,
        0,
        canvasSize.width,
        canvasSize.height
      );

      let data = imageData?.data; // Array containing pixel data: [r, g, b, a, r, g, b, a, ...]

      if (data && imageData) {
        for (let i = 0; i < data.length; i += 4) {
          // Each pixel occupies 4 array elements: [r, g, b, a]
          let red = data[i];
          let green = data[i + 1];
          let blue = data[i + 2];

          if (red > 0 && green > 0 && blue > 0) {
            data[i + 3] = 0;
          }
        }

        maskCtx.current.putImageData(imageData, 0, 0);
        const url = maskCanvas.current.toDataURL("image/png");

        onChange(url);
        setIsEditing(false);
      }
    }
  }, [maskCanvas.current, maskCtx.current, canvasSize, onChange, handleClear]);

  const handleCancelEdit = () => {
    setIsEditing(false);
    handleClear();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <Stack spacing={1}>
      <Box
        sx={{
          display: isImageLoading ? "block" : "none",
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{
            aspectRatio: "1/1",
            width: "100%",
            height: "100%",
          }}
        />
      </Box>
      <Paper>
        <div
          style={{
            position: "relative",
            width: canvasSize.width,
            height: canvasSize.height,
            display: isImageLoading ? "none" : "block",
          }}
        >
          <canvas
            width={canvasSize.width}
            height={canvasSize.height}
            style={{ position: "absolute" }}
            ref={canvas}
          />

          <canvas
            width={canvasSize.width}
            height={canvasSize.height}
            style={{
              position: "absolute",
              opacity: 0.4,
              imageRendering: "crisp-edges",
            }}
            ref={maskCanvas}
          />
          <canvas
            width={canvasSize.width}
            height={canvasSize.height}
            style={{
              position: "absolute",
              display: isEditing ? "block" : "none",
            }}
            ref={circleCanvas}
            onMouseMove={handleDrawCircle}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          />

          {!isEditing && (
            <Stack
              justifyContent="center"
              alignItems="center"
              sx={{
                width: canvasSize.width,
                height: canvasSize.height,
                position: "absolute",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              <IconButton
                sx={{
                  backgroundColor: (theme) =>
                    alpha(theme.palette.primary.main, 0.3),
                }}
                onClick={handleEdit}
              >
                <Edit fontSize="large" />
              </IconButton>
            </Stack>
          )}
        </div>
      </Paper>
      {isEditing && (
        <Stack spacing={0.5} direction="row">
          <IconButton onClick={handleGetMask}>
            <Check />
          </IconButton>
          <IconButton onClick={handleCancelEdit}>
            <Close />
          </IconButton>
        </Stack>
      )}
    </Stack>
  );
}
