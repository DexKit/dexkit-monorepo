import AppConfirmDialog from '@dexkit/ui/components/AppConfirmDialog';
import Delete from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FieldArray, Form, useFormikContext } from 'formik';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { ClaimConditionTypeForm } from '../../types';
import { ClaimConditionForm } from './ClaimConditionForm';

interface Props {
  network: string;

  isEdit: boolean;
}

export function ClaimConditionsForm({ network, isEdit }: Props) {
  const { submitForm, isValid, values, isSubmitting } = useFormikContext<{
    phases: ClaimConditionTypeForm[];
  }>();

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmCallback, setConfirmCallback] = useState<() => void>();

  const handleCloseConfirm = () => {
    setShowConfirm(false);
    setConfirmCallback(undefined);
  };

  const handleConfirm = () => {
    if (confirmCallback) {
      confirmCallback();
    }
  };

  return (
    <>
      <AppConfirmDialog
        DialogProps={{
          open: showConfirm,
          onClose: handleCloseConfirm,
          fullWidth: true,
          maxWidth: 'sm',
        }}
        title={
          <FormattedMessage
            id="remove.condition"
            defaultMessage="Remove condition"
          />
        }
        onConfirm={handleConfirm}
      >
        <Typography variant="body1">
          <FormattedMessage
            id="do.you.really.want.to.remove.this.condition"
            defaultMessage="Do you really want to remove this Condition?"
          />
        </Typography>
      </AppConfirmDialog>

      <Card>
        <CardContent>
          <Form>
            <FieldArray
              name="phases"
              render={(arrayHelper) => (
                <Stack spacing={2}>
                  {values.phases?.map((_, index: number, arr: any[]) => (
                    <React.Fragment key={index}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography>
                          <FormattedMessage
                            id="phases"
                            defaultMessage={'Phases'}
                          />
                          : {index + 1}
                        </Typography>

                        <Button
                          startIcon={<Delete />}
                          onClick={() => {
                            setShowConfirm(true);
                            setConfirmCallback(() => () => {
                              arrayHelper.remove(index);
                              setShowConfirm(false);
                            });
                          }}
                        >
                          <FormattedMessage
                            id="remove"
                            defaultMessage="Remove"
                          />
                        </Button>
                      </Stack>

                      <ClaimConditionForm itemIndex={index} network={network} />
                      {index < arr.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}

                  <Button
                    variant="outlined"
                    onClick={() => arrayHelper.push({ name: 'new phase' })}
                  >
                    <FormattedMessage
                      id="add.claim.condition"
                      defaultMessage="Add claim condition"
                    />
                  </Button>

                  <Stack direction="row" justifyContent="space-between">
                    <Button
                      disabled={
                        !isValid || values.phases.length === 0 || isSubmitting
                      }
                      startIcon={
                        isSubmitting && (
                          <CircularProgress size="1rem" color="inherit" />
                        )
                      }
                      onClick={submitForm}
                      variant="contained"
                      color="primary"
                    >
                      {isEdit ? (
                        <FormattedMessage
                          id="edit.claim.conditions"
                          defaultMessage="Edit claim conditions"
                        />
                      ) : (
                        <FormattedMessage
                          id="create.claim.conditions"
                          defaultMessage="Create claim conditions"
                        />
                      )}
                    </Button>
                  </Stack>
                </Stack>
              )}
            />
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
