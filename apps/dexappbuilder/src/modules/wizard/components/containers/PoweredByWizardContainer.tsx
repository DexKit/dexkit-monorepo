import {
  AppConfig,
  SiteResponse,
} from '@dexkit/ui/modules/wizard/types/config';
import { useMediaQuery, useTheme } from '@mui/material';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FormattedMessage } from 'react-intl';
import { PremiumAppBuilder } from '../PremiumAppBuilder';

import {
  CUSTOM_DOMAINS_AND_SIGNATURE_FEAT,
  WIDGET_SIGNATURE_FEAT,
} from '@dexkit/ui/constants/featPayments';
import { useActiveFeatUsage } from '@dexkit/ui/hooks/payments';
import HidePoweredContainer from './HidePoweredContainer';

interface Props {
  site?: SiteResponse | null;
  isWidget?: boolean;
  config: AppConfig;
  onSave: (config: AppConfig) => void;
  onHasChanges: (hasChanges: boolean) => void;
}
export default function PoweredByWizardContainer({
  config,
  onSave,
  isWidget,
  onHasChanges,
  site,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const activeFeatUsageQuery = useActiveFeatUsage({
    slug: isWidget ? WIDGET_SIGNATURE_FEAT : CUSTOM_DOMAINS_AND_SIGNATURE_FEAT,
  });

  const isPaid = activeFeatUsageQuery.data
    ? activeFeatUsageQuery?.data?.active
    : undefined;

  return (
    <Grid container spacing={isMobile ? 1.5 : 3}>
      <Grid item xs={12}>
        <Stack spacing={isMobile ? 0.5 : 1} sx={{ mb: isMobile ? 1.5 : 2 }}>
          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            sx={{
              fontSize: isMobile ? '1.15rem' : '1.5rem',
              fontWeight: 600,
              mb: 0.5,
            }}
          >
            <FormattedMessage
              id="powered.by.dexkit"
              defaultMessage="Powered by DexKit"
            />
          </Typography>
          <Typography
            variant={isMobile ? 'body2' : 'body1'}
            color="text.secondary"
            sx={{
              fontSize: isMobile ? '0.85rem' : 'inherit',
            }}
          >
            <FormattedMessage
              id="powered.by.settings.description"
              defaultMessage="Hide powered by DexKit"
            />
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <PremiumAppBuilder isHidePowered={true} isWidget={isWidget} />
      </Grid>

      <Grid item xs={12}>
        {(site?.id || isWidget) !== undefined && (
          <HidePoweredContainer
            config={config}
            onSave={onSave}
            isDisabled={!isPaid}
            hasNFT={site?.nft !== undefined}
          />
        )}
      </Grid>
    </Grid>
  );
}
