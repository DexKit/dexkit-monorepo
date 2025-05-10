import {
  AppPageSection,
  TokenTradePageSection,
} from '@dexkit/ui/modules/wizard/types/section';
import { Button, Grid, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { useAppWizardConfig } from '../../hooks';
import { TokenTradeConfigForm } from './TokenTradeConfigForm';

interface Props {
  onSave: (section: AppPageSection) => void;
  onChange: (section: AppPageSection) => void;
  onCancel: () => void;
  section?: TokenTradePageSection;
}
export function TokenTradeSectionForm({
  onSave,
  onCancel,
  onChange,
  section,
}: Props) {
  const [data, setData] = useState(section?.config);
  const { wizardConfig } = useAppWizardConfig();
  useEffect(() => {
    onChange({
      type: 'token-trade',
      config: data || {},
    });
  }, [data]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TokenTradeConfigForm
          data={data}
          onChange={(d) => setData(d)}
          featuredTokens={
            wizardConfig?.tokens ? wizardConfig?.tokens[0].tokens : undefined
          }
        />
      </Grid>
      <Grid item xs={12}>
        <Stack spacing={2} direction="row" justifyContent="flex-end">
          <Button onClick={onCancel}>
            <FormattedMessage id="cancel" defaultMessage="Cancel" />
          </Button>
          <Button
            onClick={() =>
              onSave({
                type: 'token-trade',
                config: data || {},
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
