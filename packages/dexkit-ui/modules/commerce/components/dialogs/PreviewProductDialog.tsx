import { Dialog, DialogContent, DialogProps, Divider } from "@mui/material";

import { FormattedMessage } from "react-intl";
import { AppDialogTitle } from "../../../../components";

import CommerceSection from "../CommerceSection";

export interface PreviewProductDialogProps {
  DialogProps: DialogProps;
  id?: string;
}

export default function PreviewProductDialog({
  DialogProps,
  id,
}: PreviewProductDialogProps) {
  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  return (
    <Dialog {...DialogProps} maxWidth="lg" fullWidth>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="preview.product"
            defaultMessage="Preview product"
          />
        }
        onClose={handleClose}
        sx={{ px: 4, py: 2 }}
      />
      <Divider />
      <DialogContent>
        <CommerceSection
          section={{
            type: "commerce",
            settings: {
              content: {
                type: "single-product",
                id: id ?? "",
              },
            },
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
