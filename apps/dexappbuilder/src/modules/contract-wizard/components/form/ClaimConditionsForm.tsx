import AppConfirmDialog from '@dexkit/ui/components/AppConfirmDialog';
import Delete from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { NATIVE_TOKEN_ADDRESS } from '@thirdweb-dev/sdk';
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
  const theme = useTheme();
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
        <CardContent sx={{ p: { xs: theme.spacing(2), sm: theme.spacing(3) } }}>
          <Form>
            <FieldArray
              name="phases"
              render={(arrayHelper: any) => (
                <Stack spacing={theme.spacing(3)}>
                  {values.phases?.map((_, index: number, arr: any[]) => (
                    <React.Fragment key={index}>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        spacing={{ xs: theme.spacing(1), sm: 0 }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 500 }}>
                          <FormattedMessage
                            id="phases"
                            defaultMessage={'Phases'}
                          />
                          : {index + 1}
                        </Typography>

                        <Button
                          startIcon={<Delete />}
                          size="small"
                          color="error"
                          variant="outlined"
                          sx={{
                            alignSelf: { xs: 'flex-end', sm: 'auto' },
                            minWidth: { xs: 'auto', sm: 'auto' }
                          }}
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
                    fullWidth
                    sx={{ py: theme.spacing(1.5) }}
                    onClick={() => arrayHelper.push({
                      name: 'new phase',
                      startTime: new Date().toISOString().slice(0, 19),
                      waitInSeconds: '0',
                      price: '0',
                      maxClaimableSupply: 'unlimited',
                      maxClaimablePerWallet: 'unlimited',
                      currencyAddress: NATIVE_TOKEN_ADDRESS
                    })}
                  >
                    <FormattedMessage
                      id="add.claim.condition"
                      defaultMessage="Add claim condition"
                    />
                  </Button>

                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent={{ xs: 'stretch', sm: 'flex-end' }}
                    spacing={theme.spacing(2)}
                  >
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
                      fullWidth
                      sx={{
                        py: theme.spacing(1.5),
                        maxWidth: { sm: theme.spacing(37.5) }
                      }}
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
