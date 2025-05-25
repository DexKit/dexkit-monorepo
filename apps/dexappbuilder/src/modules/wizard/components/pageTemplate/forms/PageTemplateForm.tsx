import { Button, Grid, Stack, Typography } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import * as Yup from 'yup';
import { useUpsertPageTemplateMutation } from '../../../../../hooks/whitelabel';
import { PageTemplateFormData } from '../../../../../types/whitelabel';
import PageEditor from '../../pageEditor/PageEditor';
import UpsertPageTemplateDialog from '../dialogs/UpsertPageTemplateDialog';

const FormSchema: Yup.SchemaOf<PageTemplateFormData> = Yup.object().shape({
  title: Yup.string().required(),
  description: Yup.string().required(),
  config: Yup.string().required(),
  imageUrl: Yup.string().url().nullable(),
  id: Yup.number(),
});

interface Props {
  initialValues?: PageTemplateFormData;
}

export default function PageTemplateForm({ initialValues }: Props) {
  const [showUpsertDialog, setShowUpsertDialog] = useState(false);
  const upsertPageTemplateMutation = useUpsertPageTemplateMutation();
  const handleCloseUpsertPageTemplate = () => {
    setShowUpsertDialog(false);
  };

  return (
    <>
      <UpsertPageTemplateDialog
        dialogProps={{
          open: showUpsertDialog,
          maxWidth: 'xs',
          fullWidth: true,
          onClose: handleCloseUpsertPageTemplate,
        }}
        isLoading={upsertPageTemplateMutation.isLoading}
        isSuccess={upsertPageTemplateMutation.isSuccess}
        error={upsertPageTemplateMutation.error}
        isEdit={!!initialValues}
      />

      <Stack>
        <Formik
          validationSchema={FormSchema}
          onSubmit={(values, { setSubmitting }) => {
            setShowUpsertDialog(true);
            upsertPageTemplateMutation.mutate({
              data: values as PageTemplateFormData,
            });
            setSubmitting(false);
          }}
          enableReinitialize={true}
          initialValues={
            initialValues ||
            ({
              title: '',
              description: '',
            } as PageTemplateFormData)
          }
        >
          {({ isValid, setFieldValue, values }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field
                    component={TextField}
                    fullWidth
                    name="title"
                    label={
                      <FormattedMessage id="title" defaultMessage="Title" />
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    component={TextField}
                    fullWidth
                    name="description"
                    label={
                      <FormattedMessage
                        id="description"
                        defaultMessage="Description"
                      />
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    component={TextField}
                    fullWidth
                    name="imageUrl"
                    label={
                      <FormattedMessage
                        id="image.url"
                        defaultMessage="Image Url"
                      />
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <Typography>
                      <FormattedMessage
                        id="page.wizard"
                        defaultMessage="Page wizard"
                      />
                    </Typography>

                    <PageEditor
                      onChange={(val) => setFieldValue('config', val)}
                      value={values?.config}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <Stack spacing={1} direction="row" justifyContent="flex-end">
                    <Button
                      disabled={!isValid}
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      <FormattedMessage id="save" defaultMessage="Save" />
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Stack>
    </>
  );
}
