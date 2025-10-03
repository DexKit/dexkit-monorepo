import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import { useMediaQuery, useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { SwapFeeForm } from '../../types';
import SwapFeesSection from '../sections/SwapFeesSection';

interface Props {
  config: Partial<AppConfig>;
  onSave: (config: Partial<AppConfig>) => void;
  onHasChanges: (hasChanges: boolean) => void;
}

export default function SwapFeeWizardContainer({
  config,
  onSave,
  onHasChanges,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [swapFee, setSwapFee] = useState<SwapFeeForm>();
  const [hasChanged, setHasChanged] = useState(false);
  useEffect(() => {
    if (onHasChanges) {
      onHasChanges(hasChanged);
    }
  }, [hasChanged, onHasChanges]);

  useEffect(() => {
    if (config.swapFees) {
      setSwapFee({
        amountPercentage: config.swapFees.amount_percentage,
        recipient: config.swapFees.recipient,
      });
    }
  }, [config]);

  const handleSaveSwapFee = (fee: SwapFeeForm) => {
    setHasChanged(true);
    setSwapFee(fee);
  };
  const handleSave = () => {
    if (swapFee) {
      const newConfig = {
        ...config,
        swapFees: {
          amount_percentage: swapFee?.amountPercentage,
          recipient: swapFee?.recipient,
        },
      };
      onSave(newConfig);
    }
  };

  const handleRemoveSwapFee = () => {
    setHasChanged(true);
    setSwapFee(undefined);
  };

  return (
    <Grid container spacing={isMobile ? 1.5 : 3}>
      <Grid size={12}>
        <Stack spacing={isMobile ? 0.5 : 1} sx={{ mb: isMobile ? 1.5 : 2 }}>
          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            sx={{
              fontWeight: 600,
              fontSize: isMobile ? '1.15rem' : '1.5rem',
              mb: 0.5
            }}
          >
            <FormattedMessage id="swap.fees.title" defaultMessage="Swap Fees" />
          </Typography>
          <Typography
            variant={isMobile ? 'body2' : 'body1'}
            color="text.secondary"
            sx={{
              fontSize: isMobile ? '0.85rem' : 'inherit',
            }}
          >
            <FormattedMessage
              id="adjust.your.app.swap.fees.title"
              defaultMessage="Adjust your app's Swap fees"
            />
          </Typography>
        </Stack>
      </Grid>
      <Grid size={12}>
        <Divider />
      </Grid>
      <Grid
        size={{
          xs: 12,
          sm: 6
        }}>
        <SwapFeesSection
          fee={swapFee}
          onSave={handleSaveSwapFee}
          onRemove={handleRemoveSwapFee}
          isMobile={isMobile}
        />
      </Grid>
      <Grid size={12}>
        <Divider />
      </Grid>
      <Grid size={12}>
        <Stack spacing={1} direction="row" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={!hasChanged}
            size={isMobile ? "small" : "medium"}
            sx={{
              fontSize: isMobile ? theme.typography.body2.fontSize : undefined,
              py: isMobile ? theme.spacing(0.75) : undefined,
              px: isMobile ? theme.spacing(2) : undefined,
            }}
          >
            <FormattedMessage id="save" defaultMessage="Save" />
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}
