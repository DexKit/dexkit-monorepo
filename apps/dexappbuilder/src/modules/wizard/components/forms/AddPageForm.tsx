import { Button, Grid, LinearProgress, Stack } from '@mui/material';
import { Field, Form, Formik, useFormikContext } from 'formik';
import { TextField } from 'formik-mui';
import Slugify from 'slugify';
import * as Yup from 'yup';

import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

interface PageOptions {
  title: string;
  uri: string;
}

const PageOptionsSchema: Yup.SchemaOf<PageOptions> = Yup.object().shape({
  title: Yup.string().required(),
  uri: Yup.string().required(),
});

interface Props {
  onCancel: () => void;
  onSubmit: (item: PageOptions) => void;
  item?: PageOptions;
}

function TitleListener() {
  const formik = useFormikContext<PageOptions>();

  useEffect(() => {
    if (formik?.values?.title && !formik?.values?.uri) {
      formik.setFieldValue('uri', Slugify(formik.values.title));
    }
  }, [formik.values]);

  return null;
}

export default function AddPageForm({ item, onCancel, onSubmit }: Props) {
  return (
    <Formik
      initialValues={{ ...item }}
      onSubmit={(values) => {
        onSubmit(values as PageOptions);
      }}
      validationSchema={PageOptionsSchema}
    >
      {({ submitForm, isSubmitting, isValid }) => (
        <Form>
          <TitleListener />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Field
                component={TextField}
                name="title"
                type="text"
                label={
                  <FormattedMessage id={'title'} defaultMessage={'Title'} />
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                component={TextField}
                type="text"
                label={<FormattedMessage id={'uri'} defaultMessage={'Uri'} />}
                name="uri"
              />
            </Grid>
            {isSubmitting && <LinearProgress />}
            <Grid item xs={12}>
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Button
                  disabled={isValid}
                  variant="contained"
                  onClick={submitForm}
                >
                  <FormattedMessage id="save" defaultMessage="Save" />
                </Button>
                <Button onClick={onCancel}>
                  <FormattedMessage id="cancel" defaultMessage="Cancel" />
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}
