import { useIsMobile } from '@dexkit/core';
import {
  AppPageSection,
  WalletPageSection,
} from '@dexkit/ui/modules/wizard/types/section';
import { Alert, Box, Button, Grid, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
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
  const isMobile = useIsMobile();

  useEffect(() => {
    onChange({
      ...section,
      type: 'wallet',
    });
  }, []);

  return (
    <Grid container spacing={isMobile ? 1.5 : 2}>
      <Grid item xs={12}>
        <Box p={isMobile ? 1 : 2}>
          <Alert severity="info" sx={{ py: isMobile ? 0.5 : 1 }}>
            <Typography variant={isMobile ? "body2" : "body1"}>
              <FormattedMessage
                id={'wallet.section.form.info'}
                defaultMessage={
                  "Wallet section don't accepts configs at the moment. In next updates, you will be able to customize buttons and networks"
                }
              ></FormattedMessage>
              .
            </Typography>
          </Alert>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Stack spacing={isMobile ? 1 : 2} direction="row" justifyContent="flex-end">
          <Button onClick={onCancel} size={isMobile ? "small" : "medium"}>
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
            size={isMobile ? "small" : "medium"}
          >
            <FormattedMessage id="save" defaultMessage="Save" />
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}
