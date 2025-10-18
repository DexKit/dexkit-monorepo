import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  FormControlLabel,
  Stack,
  Switch,
} from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';

import { AppDialogTitle } from '@dexkit/ui/components/AppDialogTitle';
import { CopyText } from '@dexkit/ui/components/CopyText';
import { Grid } from '@mui/material';
import { useState } from 'react';

interface Props {
  onCancel: () => void;

  site?: string;
  page?: string;
  sectionIndex?: number;
  dialogProps: DialogProps;
}

export default function EmebedPageDialog({
  site,
  onCancel,
  page,
  sectionIndex,
  dialogProps,
}: Props) {
  const { onClose } = dialogProps;
  const [hideLayout, setHideLayout] = useState(false);
  const { formatMessage } = useIntl();

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
    onCancel();
  };

  const website =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : `https://${site}.dexkit.app`;

  const iframeText = `<iframe src="${website}/embed?page=${page}${sectionIndex !== -1 ? `&sectionIndex=${sectionIndex}` : ''}&hideLayout=${hideLayout ? 'true' : 'false'}" frameBorder="0" width="1000px" height="500px"/>`;

  return (
    <Dialog {...dialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="embed.code.uppercased"
            defaultMessage="Embed code"
          />
        }
        onClose={handleClose}
      />
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Stack direction={'row'} spacing={2}>
              <code>{iframeText}</code>
              <CopyText text={iframeText} />
            </Stack>
          </Grid>
          <Grid size={12}>
            <FormControlLabel
              control={
                <Switch
                  defaultChecked
                  onChange={() => setHideLayout(!hideLayout)}
                />
              }
              label={
                <FormattedMessage
                  id="hide.layout"
                  defaultMessage="Hide layout"
                />
              }
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Stack
          py={0.5}
          px={2}
          direction="row"
          spacing={1}
          justifyContent="flex-end"
        >
          <Button onClick={onCancel}>
            <FormattedMessage id="cancel" defaultMessage="Cancel" />
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
