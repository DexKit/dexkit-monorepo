import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Stack,
  Typography,
} from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';

import slugify from 'slugify';
import * as Yup from 'yup';

import { AppDialogTitle } from '@dexkit/ui/components/AppDialogTitle';
import { AppPageOptions } from '@dexkit/ui/modules/wizard/types/config';
import { Grid, LinearProgress } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';

interface PageOptions {
  title: string;
}

const PageOptionsSchema: Yup.SchemaOf<PageOptions> = Yup.object().shape({
  title: Yup.string().required(),
});

interface Props {
  onCancel: () => void;
  onSubmit: (item: AppPageOptions) => void;
  clonedPage?: {
    key?: string;
    title?: string;
  };
  item?: PageOptions;
  dialogProps: DialogProps;
}

export default function AddPageDialog({
  item,
  onCancel,
  onSubmit,
  clonedPage,
  dialogProps,
}: Props) {
  const { onClose } = dialogProps;
  const { formatMessage } = useIntl();

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
    onCancel();
  };

  return (
    <Dialog {...dialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="create.new.page.uppercased"
            defaultMessage="Create New Page"
          />
        }
        onClose={handleClose}
      />
      <Formik
        initialValues={{ ...item }}
        onSubmit={(values, helpers) => {
          if (values.title === 'Home') {
            helpers.setFieldError(
              'title',
              formatMessage({
                id: 'use.home.as.title.not.allowed',
                defaultMessage: 'Use Home as title is not allowed for pages',
              })
            );
            return;
          }

          onSubmit({
            title: values.title as string,
            uri: `/${slugify(values.title as string).toLowerCase()}`,
            key: slugify(values.title as string).toLowerCase(),
            clonedPageKey: clonedPage?.key,
          });
          handleClose();
        }}
        validationSchema={PageOptionsSchema}
      >
        {({ submitForm, isSubmitting, isValid }) => (
          <Form>
            <DialogContent dividers>
              <Grid container spacing={2}>
                {clonedPage && (
                  <Grid item xs={12}>
                    <Typography>
                      <FormattedMessage
                        id={'you.are.cloning.page.message'}
                        defaultMessage={'You are cloning {page} page'}
                        values={{
                          page: clonedPage.title || '',
                        }}
                      />
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Box py={2}>
                    <Field
                      component={TextField}
                      name="title"
                      fullWidth
                      label={
                        <FormattedMessage
                          id="page.title"
                          defaultMessage="Page title"
                        />
                      }
                    />
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              {isSubmitting && <LinearProgress />}
              <Stack
                py={0.5}
                px={2}
                direction="row"
                spacing={1}
                justifyContent="flex-end"
              >
                <Button onClick={onCancel}>
                  <FormattedMessage id="cancel" defaultMessage="Cancel" />
                </Button>
                <Button
                  disabled={!isValid || isSubmitting}
                  variant="contained"
                  onClick={submitForm}
                >
                  <FormattedMessage id="create" defaultMessage="Create" />
                </Button>
              </Stack>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
