import AppDataTable from "@dexkit/ui/components/AppDataTable";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
} from "@mui/material";
import { GridRowId } from "@mui/x-data-grid";
import React, { useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { AppDialogTitle } from "../AppDialogTitle";

export interface AppDataTableDialogProps {
  DialogProps: DialogProps;
  onConfirm: (data: { [key: string]: string }[]) => void;
  value: { [key: string]: string }[];
  title: React.ReactNode;
  dataColumns: {
    isValid?: ((value: unknown) => boolean) | undefined;
    name: string;
    headerName: string;
    editable?: boolean | undefined;
    width?: number;
  }[];
}

export default function AppDataTableDialog({
  DialogProps,
  onConfirm,
  value,
  dataColumns,
  title,
}: AppDataTableDialogProps) {
  const { onClose } = DialogProps;

  const [editRows, setEditRow] = useState<{ [key: GridRowId]: boolean }>({});

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
    setValues(undefined);
    setEditRow({});
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

  const handleEditRow = (id: GridRowId, value: boolean) => {
    setEditRow((values: any) => ({ ...values, [id]: value }));
  };

  const canSave = useMemo(() => {
    const rowValues = Object.values(editRows);
    return rowValues.findIndex((c) => c) === -1;
  }, [editRows]);

  const isEmpty = useMemo(() => {
    return values && values?.length === 0;
  }, [values]);

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle title={title} />
      <DialogContent sx={{ p: 0 }} dividers>
        <AppDataTable
          dataColumns={dataColumns}
          data={value}
          onChange={handleChange}
          onEditRow={handleEditRow}
        />

        <Box p={2}>
          {isEmpty && (
            <Alert severity="warning">
              <FormattedMessage
                id="add.addresses.to.airdrop"
                defaultMessage="Add addresses to airdrop"
              />
            </Alert>
          )}
          {!canSave && (
            <Alert severity="error">
              <FormattedMessage
                id="save.your.row.changes.before.confirm"
                defaultMessage="Save your row changes before confirm"
              />
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={isEmpty || !canSave}
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
