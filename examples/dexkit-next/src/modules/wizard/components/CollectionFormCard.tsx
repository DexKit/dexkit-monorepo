import { Box, Button, Card, CardContent, Grid, Stack } from '@mui/material';
import { Field, Form, useFormikContext } from 'formik';
import { TextField } from 'formik-mui';
import { FormattedMessage } from 'react-intl';
import { CollectionForm } from '../types';
import ImageUploadButton from './ImageUploadButton';

export default function CollectionFormCard() {
  const { setFieldValue, values, submitForm, errors, isValid } =
    useFormikContext<CollectionForm>();

  return (
    <Card>
      <CardContent>
        <Form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box>
                <Stack direction="row" justifyContent="center">
                  <ImageUploadButton
                    onChange={(file: File | null) => {
                      setFieldValue('file', file);
                    }}
                    file={values.file}
                    error={Boolean(errors.file)}
                  />
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Field
                name="name"
                component={TextField}
                fullWidth
                label={<FormattedMessage id="name" defaultMessage="Name" />}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                name="symbol"
                component={TextField}
                fullWidth
                label={<FormattedMessage id="symbol" defaultMessage="Symbol" />}
              />
            </Grid>

            <Grid item xs={12}>
              <Field
                name="url"
                component={TextField}
                fullWidth
                label={<FormattedMessage id="URL" defaultMessage="URL" />}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                name="description"
                component={TextField}
                fullWidth
                label={
                  <FormattedMessage
                    id="description"
                    defaultMessage="Description"
                  />
                }
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                disabled={!isValid}
                onClick={submitForm}
                variant="contained"
                color="primary"
              >
                <FormattedMessage id="next" defaultMessage="Next" />
              </Button>
            </Grid>
          </Grid>
        </Form>
      </CardContent>
    </Card>
  );
}
