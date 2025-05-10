import { isValidDecimal } from '@dexkit/core/utils';
import AppDataTable from '@dexkit/ui/components/AppDataTable';
import { AppDialogTitle } from '@dexkit/ui/components/AppDialogTitle';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
} from '@mui/material';
import { GridRowId } from '@mui/x-data-grid';
import { utils } from 'ethers';
import { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

export interface AirdropDialogProps {
  DialogProps: DialogProps;
  DialogTitle?: React.ReactNode;
  onConfirm: (data: { address: string; quantity: string }[]) => void;
  value: { address: string; quantity: string }[];
}

export default function AirdropDialog({
  DialogProps,
  DialogTitle,
  onConfirm,
  value,
}: AirdropDialogProps) {
  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
    setValues(undefined);
  };

  const [values, setValues] =
    useState<{ address: string; quantity: string }[]>();

  const handleConfirm = () => {
    if (values) {
      onConfirm(values);
      handleClose();
    }
  };

  const handleChange = (data: { address: string; quantity: string }[]) => {
    setValues(data);
  };

  const [editRows, setEditRow] = useState<{ [key: GridRowId]: boolean }>({});

  const handleEditRow = (id: GridRowId, value: boolean) => {
    setEditRow((values) => ({ ...values, [id]: value }));
  };

  const canSave = useMemo(() => {
    const rowValues = Object.values(editRows);
    return rowValues.findIndex((c) => c) === -1;
  }, [editRows, values]);

  const isEmpty = useMemo(() => {
    return values && values?.length === 0;
  }, [values]);

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={
          DialogTitle ? (
            DialogTitle
          ) : (
            <FormattedMessage id="airdrop" defaultMessage="Airdrop" />
          )
        }
      />
      <DialogContent sx={{ p: 0 }} dividers>
        <AppDataTable
          dataColumns={[
            {
              headerName: 'Address',
              name: 'address',
              width: 400,
              isValid: (value: unknown) => {
                return utils.isAddress(value as string);
              },
              editable: true,
            },
            {
              headerName: 'Quantity',
              name: 'quantity',
              width: 120,
              isValid: (value: unknown) => {
                return isValidDecimal(value as string, 18);
              },
              editable: true,
            },
          ]}
          data={value}
          onChange={handleChange}
          onEditRow={handleEditRow}
        />
        {isEmpty && (
          <Box p={2}>
            <Alert severity="warning">
              <FormattedMessage
                id="add.addresses.to.airdrop"
                defaultMessage="Add addresses to airdrop"
              />
            </Alert>
          </Box>
        )}
        {!canSave && (
          <Box p={2}>
            <Alert severity="error">
              <FormattedMessage
                id="save.your.row.changes.before.confirm"
                defaultMessage="Save your row changes before confirm"
              />
            </Alert>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          disabled={!canSave || isEmpty}
          onClick={handleConfirm}
          variant="contained"
        >
          <FormattedMessage id="confirm" defaultMessage="Confirm" />
        </Button>
        <Button onClick={handleClose}>
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
