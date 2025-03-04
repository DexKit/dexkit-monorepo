import {
  AppPageSection,
  WalletPageSection,
} from '@dexkit/ui/modules/wizard/types/section';
import { Alert, Box } from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import '@uiw/react-markdown-preview/markdown.css';
import '@uiw/react-md-editor/markdown-editor.css';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

interface Props {
  section?: WalletPageSection;
  onSave: (section: AppPageSection) => void;
  onChange: (section: AppPageSection) => void;
  onCancel: () => void;
}

export default function WalletSectionForm({
  section,
  onSave,
  onChange,
  onCancel,
}: Props) {
  useEffect(() => {
    onChange({
      ...section,
      type: 'wallet',
    });
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box p={2}>
          <Alert severity="info">
            <FormattedMessage
              id={'wallet.section.form.info'}
              defaultMessage={
                "Wallet section don't accepts configs at the moment. In next updates, you will be able to customize buttons and networks"
              }
            ></FormattedMessage>
            .
          </Alert>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Stack spacing={2} direction="row" justifyContent="flex-end">
          <Button onClick={onCancel}>
            <FormattedMessage id="cancel" defaultMessage="Cancel" />
          </Button>
          <Button
            onClick={() =>
              onSave({
                ...section,
                type: 'wallet',
              })
            }
            variant="contained"
            color="primary"
          >
            <FormattedMessage id="save" defaultMessage="Save" />
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}
