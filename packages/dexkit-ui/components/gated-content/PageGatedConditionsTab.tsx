import { GatedCondition } from '@dexkit/ui/modules/wizard/types';
import AddOutlined from '@mui/icons-material/AddOutlined';
import { Box, Button, Grid, Typography } from '@mui/material';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import EditGatedConditionDialog from '../section-config/dialogs/EditGatedConditionDialog';

import { AppConfirmDialog } from '@dexkit/ui';
import { useSnackbar } from 'notistack';
import PageGatedConditionsList from './PageGatedConditionsList';

export interface PageGatedConditionsTabProps {
  conditions: GatedCondition[];
  onSaveGatedConditions: (conditions: GatedCondition[]) => void;
}

export default function PageGatedConditionsTab({
  conditions,
  onSaveGatedConditions,
}: PageGatedConditionsTabProps) {
  const [showForm, setShowForm] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

  const [cond, setCond] = useState<{
    condition: GatedCondition;
    index: number;
  }>();

  const handleClose = () => {
    setShowForm(false);
    setCond(undefined);
  };

  const handleOpen = () => {
    setShowForm(true);
  };

  const { enqueueSnackbar } = useSnackbar();

  const handleAction = (index: number, action: string) => {
    const condition = conditions[index];

    setCond({ index, condition });

    if (action === 'edit') {
      setShowForm(true);
    } else if (action === 'remove') {
      setShowConfirm(true);
    }
  };

  const handleCloseConfirm = () => {
    setShowConfirm(false);
  };

  const handleConfirmRemove = () => {
    if (cond?.index !== undefined) {
      const newConditions = structuredClone(conditions);

      newConditions.splice(cond.index, 1);

      onSaveGatedConditions(newConditions);

      enqueueSnackbar(
        <FormattedMessage
          id="condition.removed"
          defaultMessage="Condition removed"
        />,
        { variant: 'success' },
      );

      handleCloseConfirm();
    }
  };

  const handleSaveCondition = (condition: GatedCondition) => {
    if (cond?.index !== undefined) {
      const newConditions = structuredClone(conditions);

      newConditions[cond.index] = { ...condition };

      onSaveGatedConditions(newConditions);
      enqueueSnackbar(
        <FormattedMessage
          id="condition.saved"
          defaultMessage="Condition saved"
        />,
        { variant: 'success' },
      );
    } else {
      const newConditions = structuredClone(conditions);

      newConditions.push(condition);

      onSaveGatedConditions(newConditions);

      enqueueSnackbar(
        <FormattedMessage
          id="new.condition.created"
          defaultMessage="New condition created"
        />,
        { variant: 'success' },
      );
    }

    handleClose();
  };

  return (
    <>
      {showForm && (
        <EditGatedConditionDialog
          DialogProps={{
            open: showForm,
            onClose: handleClose,
            fullWidth: true,
            maxWidth: 'lg',
          }}
          onSaveGatedCondition={handleSaveCondition}
          isFirst={cond?.index === 0 || cond === undefined}
          index={cond?.index}
          condition={cond?.condition}
        />
      )}
      {showConfirm && (
        <AppConfirmDialog
          DialogProps={{
            open: showConfirm,
            maxWidth: 'sm',
            fullWidth: true,
            onClose: handleCloseConfirm,
          }}
          onConfirm={handleConfirmRemove}
          title={
            <FormattedMessage
              id="remove.condition"
              defaultMessage="Remove Condition"
            />
          }
        >
          <Typography variant="subtitle1">
            <FormattedMessage
              id="are.you.sure.you.want.to.remove.your.this.condition"
              defaultMessage="Are you sure you want to remove this condition?"
            />
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <FormattedMessage
              id="if.you.remove.now.your.changes.will.be.permanent"
              defaultMessage="If you remove now, your changes will be permanent."
            />
          </Typography>
        </AppConfirmDialog>
      )}

      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button
              startIcon={<AddOutlined />}
              variant="outlined"
              color="primary"
              onClick={handleOpen}
            >
              <FormattedMessage
                id="add.condition"
                defaultMessage="Add condition"
              />
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" fontWeight="bold">
              <FormattedMessage
                id="condition.list"
                defaultMessage="Condition list"
              />
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <PageGatedConditionsList
              conditions={conditions}
              onAction={handleAction}
              onChange={onSaveGatedConditions}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
