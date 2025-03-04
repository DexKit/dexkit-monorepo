import { truncateAddress } from '@dexkit/core/utils/blockchain';
import Close from '@mui/icons-material/Close';
import Edit from '@mui/icons-material/Edit';
import { Button, IconButton, Paper, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { SwapFeeForm } from '../../types';
import SwapFeesSectionForm from './SwapFeesSectionForm';

interface Props {
  fee?: SwapFeeForm;
  onSave: (fees: SwapFeeForm) => void;
  onRemove: () => void;
}

export default function SwapFeesSection({ fee, onSave, onRemove }: Props) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmit = (values: SwapFeeForm) => {
    onSave(values);
    setIsFormOpen(false);
  };

  const handleOpenForm = () => setIsFormOpen(true);

  const handleCancel = () => setIsFormOpen(false);

  return (
    <Stack spacing={2}>
      {isFormOpen ? (
        <SwapFeesSectionForm
          fee={fee}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <>
          {fee && (
            <Paper sx={{ px: 2, py: 1 }}>
              <Stack
                spacing={2}
                direction="row"
                alignItems="center"
                alignContent="center"
                justifyContent="space-between"
              >
                <Stack
                  spacing={1}
                  direction="row"
                  alignItems="center"
                  alignContent="center"
                >
                  <Typography variant="body1">
                    {fee.amountPercentage || 0}%
                  </Typography>
                  <Typography variant="body1">
                    {truncateAddress(fee.recipient)}
                  </Typography>
                </Stack>
                <IconButton size="small" onClick={onRemove}>
                  <Close fontSize="small" />
                </IconButton>
              </Stack>
            </Paper>
          )}

          <Button
            variant="outlined"
            onClick={handleOpenForm}
            startIcon={<Edit />}
          >
            <FormattedMessage id="add.fee" defaultMessage="Edit fee" />
          </Button>
        </>
      )}
    </Stack>
  );
}
