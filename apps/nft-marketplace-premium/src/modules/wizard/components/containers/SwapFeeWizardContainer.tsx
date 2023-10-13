import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { AppConfig } from '../../../../types/config';
import { SwapFeeForm } from '../../types';
import SwapFeesSection from '../sections/SwapFeesSection';

interface Props {
  config: AppConfig;
  onSave: (config: AppConfig) => void;
}

export default function SwapFeeWizardContainer({ config, onSave }: Props) {
  const [swapFee, setSwapFee] = useState<SwapFeeForm>();
  useEffect(() => {
    if (config.swapFees) {
      setSwapFee({
        amountPercentage: config.swapFees.amount_percentage,
        recipient: config.swapFees.recipient,
      });
    }
  }, [config]);

  const handleSaveSwapFee = (fee: SwapFeeForm) => {
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

  const handleRemoveSwapFee = () => setSwapFee(undefined);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack>
          <Typography variant={'h6'}>
            <FormattedMessage id="swap.fees" defaultMessage="Swap fees" />
          </Typography>
          <Typography variant={'body2'}>
            <FormattedMessage
              id="adjust.swap.fees"
              defaultMessage="Adjust swap fees"
            />
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>

      <Grid item xs={12} sm={6}>
        <SwapFeesSection
          fee={swapFee}
          onSave={handleSaveSwapFee}
          onRemove={handleRemoveSwapFee}
        />
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Stack spacing={1} direction="row" justifyContent="flex-end">
          <Button variant="contained" color="primary" onClick={handleSave}>
            <FormattedMessage id="save" defaultMessage="Save" />
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}
