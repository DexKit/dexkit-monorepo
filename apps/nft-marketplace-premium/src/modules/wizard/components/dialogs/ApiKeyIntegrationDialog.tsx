import {
  Dialog,
  DialogContent,
  Divider,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import { Suspense } from 'react';

import { AppDialogTitle } from '@dexkit/ui';
import { DialogProps } from '@mui/material';
import dynamic from 'next/dynamic';
import { FormattedMessage } from 'react-intl';

const ZrxForm = dynamic(
  () => import('../containers/IntegrationsWizardContainer/ZrxForm')
);

export interface ApiKeyIntegrationDialogProps {
  DialogProps: DialogProps;
  siteId?: number;
}

export default function ApiKeyIntegrationDialog({
  DialogProps,
  siteId,
}: ApiKeyIntegrationDialogProps) {
  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'escapeKeyDown');
    }
  };

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        onClose={handleClose}
        title={
          <FormattedMessage id="set.api.key" defaultMessage="Set api key" />
        }
      />
      <Divider />
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold">
              <FormattedMessage id="0x.api" defaultMessage="0x API" />
            </Typography>
            <Typography gutterBottom variant="subtitle2" color="text.secondary">
              <FormattedMessage
                id="0x.is.a.decentralized.exchange.protocol.description"
                defaultMessage="0x is a decentralized exchange protocol on Ethereum, enabling peer-to-peer trading of various digital assets through open standards and smart contracts."
              />
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <FormattedMessage
                id="access.the.0x.dashboard.to.get.your.api.key"
                defaultMessage="Access the 0x dashboard to get your API Key"
              />
              :{' '}
              <Link target="_blank" href="https://dashboard.0x.org/">
                <FormattedMessage
                  id="0x.dashboard"
                  defaultMessage="0x Dashboard"
                />
              </Link>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Suspense fallback={<Typography>loading</Typography>}>
              <ZrxForm dialog siteId={siteId} />
            </Suspense>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
