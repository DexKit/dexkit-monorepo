import { AppDialogTitle } from '@dexkit/ui';
import { usePlanCosts } from '@dexkit/ui/hooks/payments';
import {
  Dialog,
  DialogContent,
  DialogProps,
  Stack,
  Typography,
} from '@mui/material';
import Decimal from 'decimal.js';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { FEAT_NAMES, FEAT_UNITS } from '../../constants';

export interface PlanDetailsDialogProps {
  DialogProps: DialogProps;
  slug?: string;
}

export default function PlanDetailsDialog({
  DialogProps,
  slug,
}: PlanDetailsDialogProps) {
  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  const planCostsQuery = usePlanCosts(slug);

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage id="plan.details" defaultMessage="Plan details" />
        }
        onClose={handleClose}
      />
      <DialogContent dividers>
        <Stack spacing={1}>
          {planCostsQuery.data?.map((cost, index: number) => (
            <Stack
              justifyContent="space-between"
              alignItems="center"
              direction="row"
              key={index}
              spacing={2}
            >
              <Typography>
                {FEAT_NAMES[cost.feat]} {cost.model ? <>({cost.model})</> : ''}
              </Typography>

              <Typography>
                <FormattedNumber
                  currency="USD"
                  style="currency"
                  value={new Decimal(cost.price || '0').toNumber()}
                  minimumFractionDigits={4}
                />{' '}
                / {FEAT_UNITS[cost.feat]}
              </Typography>
            </Stack>
          ))}

          <Stack></Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
