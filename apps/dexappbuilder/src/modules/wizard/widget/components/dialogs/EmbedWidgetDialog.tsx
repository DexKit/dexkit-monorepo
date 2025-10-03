import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Stack,
  Tab,
  Tabs,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';

import { AppDialogTitle } from '@dexkit/ui/components/AppDialogTitle';
import { CopyText } from '@dexkit/ui/components/CopyText';
import { useApiKeyByAccount } from '@dexkit/ui/hooks/apiKey';
import { Grid } from '@mui/material';
import { useState } from 'react';

interface Props {
  onCancel: () => void;
  widgetId?: number;
  dialogProps: DialogProps;
}

export default function EmbedWidgetDialog({
  onCancel,
  widgetId,
  dialogProps,
}: Props) {
  const { onClose } = dialogProps;
  const [tab, setTab] = useState(0);

  const apiKeyQuery = useApiKeyByAccount();

  const uuid = apiKeyQuery.data?.uuid;

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
    onCancel();
  };

  const website =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : `https://dexappbuilder.dexkit.com`;

  const iframeText = `<iframe src="${website}/_widget_iframe?widgetId=${widgetId}" frameBorder="0" width="1000px" height="500px"></iframe>`;

  const widgetReactComponent = `
  
import { RenderDexAppBuilderWidget } from '@dexkit/dexappbuilder-render';

export default function Widget() {
  return (
    <RenderDexAppBuilderWidget
      widgetId={${widgetId}}
      apiKey="${uuid}"
    />
  );
}
  
  `;

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
            <Stack>
              <Tabs value={tab} onChange={(_, v) => setTab(v)}>
                <Tab
                  label={
                    <FormattedMessage id="iframe" defaultMessage="Iframe" />
                  }
                />
                {/*  
                <Tab
                  label={
                  <FormattedMessage id="react" defaultMessage="React" />
                  }
                />
                */}
              </Tabs>
              {tab === 0 && (
                <Stack direction="row" spacing={2} mt={2}>
                  <Box
                    component="code"
                    sx={{
                      bgcolor: 'background.paper',
                      color: 'text.primary',
                      p: 2,
                      borderRadius: 1,
                      fontSize: '0.95rem',
                      fontFamily: 'Monaco, monospace',
                      overflowX: 'auto',
                      flex: 1,
                      border: 1,
                      borderColor: 'divider',
                    }}
                  >
                    {iframeText}
                  </Box>
                  <CopyText text={iframeText} />
                </Stack>
              )}
              {tab === 1 && (
                <Stack direction="row" spacing={2} mt={2}>
                  <Box
                    component="code"
                    sx={{
                      bgcolor: 'background.paper',
                      color: 'text.primary',
                      p: 2,
                      borderRadius: 1,
                      fontSize: '0.95rem',
                      fontFamily: 'Monaco, monospace',
                      overflowX: 'auto',
                      flex: 1,
                      border: 1,
                      borderColor: 'divider',
                    }}
                  >
                    {widgetReactComponent}{' '}
                  </Box>
                  <CopyText text={widgetReactComponent} />
                </Stack>
              )}
            </Stack>
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
