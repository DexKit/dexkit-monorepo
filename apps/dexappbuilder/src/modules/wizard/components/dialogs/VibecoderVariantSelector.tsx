import { SwapVariant } from '@dexkit/ui/modules/wizard/types';
import {
  Button,
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

interface Props {
  dialogProps: DialogProps;
  sectionType: string;
  availableVariants: string[];
  onSelect: (variant: string) => void;
}

const VARIANT_LABELS: Record<string, Record<string, string>> = {
  swap: {
    classic: 'Classic - Traditional swap interface',
    'uniswap-like': 'Modern - Clean, contemporary design',
    'matcha-like': 'Pro - Advanced trading interface',
    minimal: 'Minimal - Ultra-clean interface',
    compact: 'Compact - Space-efficient for small areas',
    mobile: 'Mobile - Touch-optimized with gestures',
    glass: 'Glass - Glassmorphism design',
  },
  exchange: {
    classic: 'Classic - Traditional exchange interface',
    modern: 'Modern - Clean, contemporary design',
    advanced: 'Advanced - Professional trading interface',
  },
};

export default function VibecoderVariantSelector({
  dialogProps,
  sectionType,
  availableVariants,
  onSelect,
}: Props) {
  const { onClose } = dialogProps;
  const { formatMessage } = useIntl();
  const [selectedVariant, setSelectedVariant] = useState<string>(
    availableVariants[0] || ''
  );

  const handleConfirm = () => {
    onSelect(selectedVariant);
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  const getVariantLabel = (variant: string): string => {
    const labels = VARIANT_LABELS[sectionType] || {};
    return labels[variant] || variant;
  };

  return (
    <Dialog {...dialogProps} maxWidth="sm" fullWidth>
      <DialogTitle>
        <FormattedMessage
          id="vibecoder.select.variant"
          defaultMessage="Select Variant"
        />
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <Typography variant="body2" color="text.secondary">
            <FormattedMessage
              id="vibecoder.select.variant.description"
              defaultMessage="Choose a variant for the {sectionType} section:"
              values={{ sectionType }}
            />
          </Typography>

          <FormControl fullWidth>
            <InputLabel>
              <FormattedMessage id="variant" defaultMessage="Variant" />
            </InputLabel>
            <Select
              value={selectedVariant}
              onChange={(e) => setSelectedVariant(e.target.value)}
              label={formatMessage({ id: 'variant', defaultMessage: 'Variant' })}
            >
              {availableVariants.map((variant) => (
                <MenuItem key={variant} value={variant}>
                  {getVariantLabel(variant)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button variant="outlined" onClick={handleClose}>
              <FormattedMessage id="cancel" defaultMessage="Cancel" />
            </Button>
            <Button variant="contained" onClick={handleConfirm}>
              <FormattedMessage id="confirm" defaultMessage="Confirm" />
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

