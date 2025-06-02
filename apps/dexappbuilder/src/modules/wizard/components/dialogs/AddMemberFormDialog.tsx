import { SiteAction } from '@dexkit/core/constants/permissions';
import { AppDialogTitle } from '@dexkit/ui/components/AppDialogTitle';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import * as Yup from 'yup';
import { useAddPermissionMemberMutation } from '../../hooks';
import SendAddMemberDialog from './SendAddMemberDialog';

interface Props {
  dialogProps: DialogProps;
  siteId?: number;
}

interface AddMember {
  account?: string;
}

const AddMemberSchema: Yup.SchemaOf<AddMember> = Yup.object().shape({
  account: Yup.string().test('is-address', 'Address not valid', (value) => {
    if (value) {
      return value.match('^(0x)[0-9a-fA-F]{40}$') ? true : false;
    }
    return false;
  }),
});

export default function AddMemberFormDialog({ dialogProps, siteId }: Props) {
  const { onClose } = dialogProps;
  const [open, setOpen] = useState(false);
  const mutationAddMember = useAddPermissionMemberMutation();
  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  return (
    <>
      {open && (
        <SendAddMemberDialog
          dialogProps={{
            open: open,
            onClose: () => {
              setOpen(false);
              mutationAddMember.reset();
            },
          }}
          isLoading={mutationAddMember.isLoading}
          isSuccess={mutationAddMember.isSuccess}
          error={mutationAddMember.error}
        />
      )}

      <Dialog {...dialogProps}>
        <AppDialogTitle
          title={
            <FormattedMessage id="add.member" defaultMessage="Add member" />
          }
          onClose={handleClose}
        />

        <Formik
          initialValues={{
            account: '',
          }}
          validationSchema={AddMemberSchema}
          onSubmit={(value, helper) => {
            const perms: { [key: string]: boolean } = {};
            // we initially only add member
            for (const action of Object.values(SiteAction)) {
              perms[`${action}`] = false;
            }

            setOpen(true);

            mutationAddMember.mutate({
              siteId,
              account: value.account,
              permissions: JSON.stringify(perms),
            });
            helper.setSubmitting(false);
          }}
        >
          {({ submitForm }) => (
            <Form>
              <DialogContent dividers>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box>
                      <Stack spacing={2}>
                        <Field
                          component={TextField}
                          name="account"
                          label={
                            <FormattedMessage
                              id={'account'}
                              defaultMessage={'Account'}
                            />
                          }
                        />
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>
              </DialogContent>

              <DialogActions>
                <Grid item xs={12}>
                  <Stack spacing={1} direction="row" justifyContent="flex-end">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={submitForm}
                    >
                      <FormattedMessage id="save" defaultMessage="Save" />
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleClose}
                    >
                      <FormattedMessage id="cancel" defaultMessage="cancel" />
                    </Button>
                  </Stack>
                </Grid>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </>
  );
}
