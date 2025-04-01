import dynamic from "next/dynamic";
import { useState } from "react";
import { Button } from "react-admin";
import { FormattedMessage } from "react-intl";
const QrReaderDialog = dynamic(
  () => import("@dexkit/ui/components/dialogs/QrReaderDialog"),
);

export default function QrReaderButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="contained">
        <FormattedMessage id={"scan"} defaultMessage={"Scan"} />
      </Button>
      <QrReaderDialog
        dialogProps={{
          open,
          onClose: () => setOpen(false),
        }}
      />
    </>
  );
}
