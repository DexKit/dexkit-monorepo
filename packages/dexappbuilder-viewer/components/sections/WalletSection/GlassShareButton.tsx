import ShareIcon from "@mui/icons-material/Share";
import { Button, IconButton } from "@mui/material";
import dynamic from "next/dynamic";
import { useState } from "react";

const GlassShareDialog = dynamic(() => import("./GlassShareDialog"));

interface Props {
  url?: string;
  shareButtonText?: string | React.ReactNode;
  shareButtonProps?: any;
  blurIntensity?: number;
  glassOpacity?: number;
  textColor?: string;
}

export function GlassShareButton({
  url,
  shareButtonProps,
  shareButtonText,
  blurIntensity = 40,
  glassOpacity = 0.10,
  textColor = '#ffffff',
}: Props) {
  const [open, setOpen] = useState(false);

  const glassButtonStyles = {
    background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.15, 0.6)}) !important`,
    backdropFilter: `blur(${blurIntensity * 0.8}px) saturate(180%) brightness(120%) !important`,
    WebkitBackdropFilter: `blur(${blurIntensity * 0.8}px) saturate(180%) brightness(120%) !important`,
    border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.3, 0.8)}) !important`,
    borderRadius: '12px !important',
    color: `${textColor} !important`,
    fontWeight: '600 !important',
    textTransform: 'none !important',
    padding: '14px 32px !important',
    fontSize: '1rem !important',
    transition: 'all 0.3s ease-in-out !important',
    boxShadow: `
      0 8px 25px rgba(0, 0, 0, 0.15) !important,
      inset 0 1px 0 rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.6)}) !important,
      inset 0 -1px 0 rgba(255, 255, 255, 0.1) !important
    `,
    textShadow: textColor.includes('255, 255, 255')
      ? '0 1px 2px rgba(0, 0, 0, 0.3)'
      : '0 1px 2px rgba(255, 255, 255, 0.3)',

    '&:hover': {
      background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.25, 0.75)}) !important`,
      backdropFilter: `blur(${blurIntensity * 1.0}px) saturate(200%) brightness(130%) !important`,
      WebkitBackdropFilter: `blur(${blurIntensity * 1.0}px) saturate(200%) brightness(130%) !important`,
      transform: 'translateY(-2px) scale(1.02) !important',
      boxShadow: `
        0 12px 35px rgba(0, 0, 0, 0.25) !important,
        inset 0 1px 0 rgba(255, 255, 255, ${Math.min(glassOpacity + 0.3, 0.8)}) !important,
        inset 0 -1px 0 rgba(255, 255, 255, 0.15) !important
      `,
      border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.4, 0.9)}) !important`,
    },

    '&:active': {
      transform: 'translateY(-1px) scale(1.0) !important',
      transition: 'all 0.15s ease-in-out !important',
    },

    '&.Mui-disabled': {
      background: `rgba(255, 255, 255, ${glassOpacity * 0.6}) !important`,
      color: `${textColor}50 !important`,
      opacity: '0.6 !important',
      transform: 'none !important',
      backdropFilter: `blur(${blurIntensity * 0.4}px) !important`,
      WebkitBackdropFilter: `blur(${blurIntensity * 0.4}px) !important`,
    },
  };

  return (
    <>
      {open && (
        <GlassShareDialog
          dialogProps={{
            open,
            fullWidth: true,
            maxWidth: "sm",
            onClose: () => setOpen(false),
          }}
          url={
            url
              ? url
              : typeof window !== "undefined"
                ? window.location.href
                : undefined
          }
          blurIntensity={blurIntensity}
          glassOpacity={glassOpacity}
          textColor={textColor}
        />
      )}

      {shareButtonText ? (
        <Button
          {...shareButtonProps}
          variant={"contained"}
          onClick={() => setOpen(true)}
          startIcon={<ShareIcon />}
          sx={{
            ...glassButtonStyles,
            ...shareButtonProps?.sx,
          }}
        >
          {shareButtonText}
        </Button>
      ) : (
        <IconButton {...shareButtonProps} onClick={() => setOpen(true)}>
          <ShareIcon />
        </IconButton>
      )}
    </>
  );
} 