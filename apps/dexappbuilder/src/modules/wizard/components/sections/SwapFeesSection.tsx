import { truncateAddress } from '@dexkit/core/utils/blockchain';
import Close from '@mui/icons-material/Close';
import Edit from '@mui/icons-material/Edit';
import { Button, IconButton, Paper, Stack, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { SwapFeeForm } from '../../types';
import SwapFeesSectionForm from './SwapFeesSectionForm';

interface Props {
  fee?: SwapFeeForm;
  onSave: (fees: SwapFeeForm) => void;
  onRemove: () => void;
  isMobile?: boolean;
}

export default function SwapFeesSection({ fee, onSave, onRemove, isMobile }: Props) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const theme = useTheme();

  const handleSubmit = (values: SwapFeeForm) => {
    onSave(values);
    setIsFormOpen(false);
  };

  const handleOpenForm = () => setIsFormOpen(true);

  const handleCancel = () => setIsFormOpen(false);

  return (
    <Stack spacing={isMobile ? theme.spacing(1.5) : theme.spacing(2)}>
      {isFormOpen ? (
        <SwapFeesSectionForm
          fee={fee}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isMobile={isMobile}
        />
      ) : (
        <>
          {fee && (
            <Paper sx={{ px: isMobile ? theme.spacing(1.5) : theme.spacing(2), py: isMobile ? theme.spacing(0.75) : theme.spacing(1) }}>
              <Stack
                spacing={isMobile ? theme.spacing(1) : theme.spacing(2)}
                direction="row"
                alignItems="center"
                alignContent="center"
                justifyContent="space-between"
              >
                <Stack
                  spacing={isMobile ? theme.spacing(0.5) : theme.spacing(1)}
                  direction="row"
                  alignItems="center"
                  alignContent="center"
                >
                  <Typography variant={isMobile ? "body2" : "body1"}>
                    {fee.amountPercentage || 0}%
                  </Typography>
                  <Typography variant={isMobile ? "body2" : "body1"} sx={{ wordBreak: 'break-all' }}>
                    {truncateAddress(fee.recipient)}
                  </Typography>
                </Stack>
                <IconButton size="small" onClick={onRemove}>
                  <Close fontSize={isMobile ? "small" : "medium"} />
                </IconButton>
              </Stack>
            </Paper>
          )}

          <Button
            variant="outlined"
            onClick={handleOpenForm}
            startIcon={<Edit fontSize={isMobile ? "small" : "medium"} />}
            size={isMobile ? "small" : "medium"}
            sx={{
              fontSize: isMobile ? theme.typography.body2.fontSize : undefined,
              py: isMobile ? theme.spacing(0.75) : undefined
            }}
          >
            <FormattedMessage id="add.fee" defaultMessage="Edit fee" />
          </Button>
        </>
      )}
    </Stack>
  );
}
