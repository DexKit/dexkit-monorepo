import dynamic from "next/dynamic";

const AddCreditDialog = dynamic(
  () => import("@dexkit/ui/components/dialogs/AddCreditDialog"),
  {
    ssr: false,
  }
);

import Add from "@mui/icons-material/Add";
import { Button, ButtonProps } from "@mui/material";
import { ReactNode, useState } from "react";
import { FormattedMessage } from "react-intl";

export interface AddCreditsButtonProps {
  ButtonProps?: ButtonProps;
  initialAmount?: string;
  buttonText?: ReactNode;
}

export default function AddCreditsButton({
  ButtonProps,
  initialAmount,
  buttonText,
}: AddCreditsButtonProps) {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <>
      {open && (
        <AddCreditDialog
          DialogProps={{
            open,
            onClose: handleClose,
            maxWidth: "sm",
            fullWidth: true,
          }}
          initialAmount={initialAmount}
        />
      )}

      <Button
        startIcon={<Add />}
        size="small"
        variant="outlined"
        onClick={handleOpen}
        {...ButtonProps}
      >
        {buttonText ? (
          buttonText
        ) : (
          <FormattedMessage id="add.credits" defaultMessage="Add credits" />
        )}
      </Button>
    </>
  );
}
