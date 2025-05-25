import ChecklistIcon from '@mui/icons-material/Checklist';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useField } from 'formik';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import AirdropDialog from '../dialogs/AirdropDialog';

export interface AllowListInputProps {
  name: string;
}

export default function AllowListInput({ name }: AllowListInputProps) {
  const [input, meta, helpers] = useField<
    {
      price?: string | undefined;
      currencyAddress?: string | undefined;
      address: string;
      maxClaimable: string;
    }[]
  >(name);

  const [open, setOpen] = useState(false);

  const handleChangeAllowList = (
    data: { quantity: string; address: string }[],
  ) => {
    helpers.setValue(
      data.map((item) => {
        return { address: item.address, maxClaimable: item.quantity };
      }),
    );
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      {open && (
        <AirdropDialog
          DialogProps={{
            maxWidth: 'lg',
            fullWidth: true,
            open,
            onClose: handleClose,
          }}
          DialogTitle={
            <FormattedMessage
              id={'edit.claimers'}
              defaultMessage={'Edit claimers'}
            />
          }
          value={
            input.value?.map((item) => ({
              address: item.address,
              quantity: item.maxClaimable,
            })) || []
          }
          onConfirm={handleChangeAllowList}
        />
      )}

      <Stack direction="row" alignItems="center" spacing={2}>
        <Button
          startIcon={<ChecklistIcon />}
          variant="outlined"
          onClick={handleOpen}
        >
          <FormattedMessage id="Edit claimers" defaultMessage="Edit claimers" />
        </Button>
        {input.value?.length > 0 && (
          <Typography>
            <FormattedMessage
              id="selected.addresses.amount"
              defaultMessage="Selected addresses: {amount}"
              values={{ amount: input.value?.length }}
            />
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
