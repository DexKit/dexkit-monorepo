import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Button } from 'react-admin';
import { FormattedMessage } from 'react-intl';
const ScanWalletQrCodeDialog = dynamic(
  () => import('./dialogs/ScanWalletQrCodeDialog'),
);

export default function QrReaderButton() {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleResult = (qrResult: string) => {
    setResult(qrResult);
    setOpen(false);
  };

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        <FormattedMessage id={'scan'} defaultMessage={'Scan'} />
      </Button>
      {open && (
        <ScanWalletQrCodeDialog
          DialogProps={{
            open,
            onClose: () => setOpen(false),
          }}
          onResult={handleResult}
        />
      )}
    </>
  );
}
