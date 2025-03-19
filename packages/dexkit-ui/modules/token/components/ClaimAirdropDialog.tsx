import { isValidDecimal } from "@dexkit/core/utils";
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
import { useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";

import { isAddress } from "@dexkit/core/utils/ethers/isAddress";
import { createMerkleTreeFromAllowList } from "@thirdweb-dev/react";
import { AppDialogTitle } from "../../../components/AppDialogTitle";

export interface AirdropDialogProps {
  dialogProps: DialogProps;
  dialogTitle?: React.ReactNode;
  onConfirm: ({
    data,
    merkleProof,
  }: {
    data: { address: string; maxClaimable: string }[];
    merkleProof: string;
  }) => void;
  value?: { address: string; maxClaimable: string }[];
}

export default function ClaimAirdropDialog({
  dialogProps,
  dialogTitle,
  onConfirm,
  value,
}: AirdropDialogProps) {
  const { onClose } = dialogProps;
  const [error, setError] = useState<string>();

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
    setValues(undefined);
  };

  const [values, setValues] =
    useState<{ address: string; maxClaimable: string }[]>();

  const handleConfirm = async () => {
    const filteredValues = values?.filter((v) => v.address);

    if (filteredValues) {
      try {
        const merkleTree = await createMerkleTreeFromAllowList(filteredValues);
        onConfirm({
          data: filteredValues.map((a) => {
            return {
              address: a?.address?.toLowerCase(),
              maxClaimable: a?.maxClaimable,
            };
          }),
          merkleProof: merkleTree.getHexRoot(),
        });
        handleClose();
      } catch (e: any) {
        setError(JSON.stringify(e));
      }
    }
  };

  const handleChange = (data: { address: string; maxClaimable: string }[]) => {
    setValues(
      data.map((a) => {
        return {
          address: a?.address?.toLowerCase(),
          maxClaimable: a?.maxClaimable,
        };
      }),
    );
  };

  const [editRows, setEditRow] = useState<{ [key: GridRowId]: boolean }>({});

  const handleEditRow = (id: GridRowId, value: boolean) => {
    setEditRow((values) => ({ ...values, [id]: value }));
  };

  const canSave = useMemo(() => {
    const rowValues = Object.values(editRows);
    return rowValues.findIndex((c) => c) === -1;
  }, [editRows]);

  const isEmpty = useMemo(() => {
    return values && values?.length === 0;
  }, [values]);

  return (
    <Dialog {...dialogProps}>
      <AppDialogTitle
        title={
          dialogTitle ? (
            dialogTitle
          ) : (
            <FormattedMessage id="airdrop" defaultMessage="Airdrop" />
          )
        }
      />
      <DialogContent sx={{ p: 0 }} dividers>
        <AppDataTable
          dataColumns={[
            {
              headerName: "Address",
              name: "address",
              width: 400,
              isValid: (value: unknown) => {
                return isAddress(value as string);
              },
              editable: true,
            },
            {
              headerName: "Max Claimable",
              name: "maxClaimable",
              width: 120,
              isValid: (value: unknown) => {
                return isValidDecimal(value as string, 18);
              },
              editable: true,
            },
          ]}
          data={value || []}
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
