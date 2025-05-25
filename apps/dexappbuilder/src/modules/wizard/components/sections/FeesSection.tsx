import AddIcon from '@mui/icons-material/Add';
import { Alert, Button, Stack, useTheme } from '@mui/material';
import { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { MAX_FEES } from '../../constants';
import { isBelowMaxFees, totalInFees } from '../../utils';
import FeesSectionForm, { FeeForm } from './FeesSectionForm';
import FeesSectionItem from './FeesSectionItem';

interface Props {
  fees: FeeForm[];
  onSave: (fees: FeeForm) => void;
  onRemove: (index: number) => void;
  isMobile?: boolean;
}

export default function FeesSection({ fees, onSave, onRemove, isMobile }: Props) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const theme = useTheme();

  const handleSubmit = (values: FeeForm) => {
    onSave(values);
    setIsFormOpen(false);
  };

  const handleOpenForm = () => setIsFormOpen(true);

  const handleCancel = () => setIsFormOpen(false);

  const isFeesAboveLimit = useMemo(() => {
    return !isBelowMaxFees(fees);
  }, [String(fees)]);

  return (
    <Stack spacing={isMobile ? theme.spacing(1.5) : theme.spacing(2)}>
      {isFeesAboveLimit && (
        <Alert severity="error" sx={{ fontSize: isMobile ? theme.typography.caption.fontSize : undefined }}>
          <FormattedMessage
            id="your.fees.are.above.the.limit"
            defaultMessage="Your fees ({total}%) are above the limit ({maxFee}%)"
            values={{
              total: totalInFees(fees),
              maxFee: MAX_FEES,
            }}
          />
        </Alert>
      )}
      {fees.map((fee, index) => (
        <FeesSectionItem
          key={index}
          index={index}
          amountPercentage={fee.amountPercentage}
          recipient={fee.recipient}
          onRemove={onRemove}
          isMobile={isMobile}
        />
      ))}

      {fees.length === 0 && (
        <Alert severity="info" sx={{ fontSize: isMobile ? theme.typography.caption.fontSize : undefined }}>
          <FormattedMessage
            id="add.fees.to.your.marketplace"
            defaultMessage="Add fees to your marketplace"
          />
        </Alert>
      )}
      {isFormOpen ? (
        <FeesSectionForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          fees={fees}
          isMobile={isMobile}
        />
      ) : (
        <Button
          variant="outlined"
          disabled={isFeesAboveLimit}
          onClick={handleOpenForm}
          startIcon={<AddIcon fontSize={isMobile ? "small" : "medium"} />}
          size={isMobile ? "small" : "medium"}
          sx={{
            fontSize: isMobile ? theme.typography.body2.fontSize : undefined,
            py: isMobile ? theme.spacing(0.75) : undefined
          }}
        >
          <FormattedMessage id="add.fee" defaultMessage="Add fee" />
        </Button>
      )}
    </Stack>
  );
}
