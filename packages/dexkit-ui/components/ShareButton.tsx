import ShareIcon from "@mui/icons-material/Share";
import { Button, IconButton } from "@mui/material";
import dynamic from "next/dynamic";
import { useState } from "react";
const ShareDialog = dynamic(() => import("./dialogs/ShareDialog"));

interface Props {
  url?: string;
  shareButtonText?: string | React.ReactNode;
  shareButtonProps?: any;
}

export function ShareButton({ url, shareButtonProps, shareButtonText }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <ShareDialog
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
        />
      )}

      {shareButtonText ? (
        <Button
          {...shareButtonProps}
          variant={"contained"}
          onClick={() => setOpen(true)}
          startIcon={<ShareIcon />}
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
