import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import { useMediaQuery, useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import FeesSection from '../sections/FeesSection';
import { FeeForm } from '../sections/FeesSectionForm';

interface Props {
  config: AppConfig;
  onSave: (config: AppConfig) => void;
  onHasChanges: (hasChanges: boolean) => void;
}

export default function MarketplaceFeeWizardContainer({
  config,
  onSave,
  onHasChanges,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [fees, setFees] = useState<FeeForm[]>([]);
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    if (onHasChanges) {
      onHasChanges(hasChanged);
    }
  }, [hasChanged, onHasChanges]);

  const handleSaveFees = (fee: FeeForm) => {
    setHasChanged(true);
    setFees((values) => [...values, fee]);
  };

  const handleRemoveFees = useCallback((index: number) => {
    setHasChanged(true);
    setFees((value) => {
      const newArr = [...value];

      newArr.splice(index, 1);

      return newArr;
    });
  }, []);

  useEffect(() => {
    if (config.fees) {
      setFees(
        config.fees?.map((f: any) => ({
          amountPercentage: f.amount_percentage,
          recipient: f.recipient,
        })) || [],
      );
    }
  }, [config]);

  const handleSave = () => {
    if (fees) {
      const newConfig = {
        ...config,
        fees: fees.map((f) => {
          return {
            amount_percentage: f.amountPercentage,
            recipient: f.recipient,
          };
        }),
      };
      onSave(newConfig);
    }
  };

  return (
    <Grid container spacing={isMobile ? 1.5 : 3}>
      <Grid item xs={12}>
        <Stack spacing={isMobile ? 0.5 : 1} sx={{ mb: isMobile ? 1.5 : 2 }}>
          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            sx={{
              fontWeight: 600,
              fontSize: isMobile ? '1.15rem' : '1.5rem',
              mb: 0.5
            }}
          >
            <FormattedMessage
              id="marketplace.fees.title"
              defaultMessage="Marketplace Fees"
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
              id="adjust.marketplace.fees.title"
              defaultMessage="Adjust your app's Marketplace fees"
            />
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FeesSection
          fees={fees}
          onSave={handleSaveFees}
          onRemove={handleRemoveFees}
          isMobile={isMobile}
        />
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
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
