import {
  Box,
  Button,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import * as Yup from 'yup';

import { ImageFormUpload } from '@/modules/contract-wizard/components/ImageFormUpload';
import CompletationProvider from '@dexkit/ui/components/CompletationProvider';
import { FormattedMessage } from 'react-intl';
import ChangeListener from '../ChangeListener';

interface AssetStoreOptions {
  name?: string;
  title?: string;
  profileImageURL?: string;
  backgroundImageURL?: string;
  description?: string;
  storeAccount?: string;
}

const AssetStoreOptionsSchema: Yup.SchemaOf<AssetStoreOptions> =
  Yup.object().shape({
    title: Yup.string(),
    name: Yup.string(),
    profileImageURL: Yup.string(),
    backgroundImageURL: Yup.string(),
    description: Yup.string(),
    storeAccount: Yup.string().matches(new RegExp('^0x[a-fA-F0-9]{40}$')),
  });

interface Props {
  onCancel?: () => void;
  onSubmit?: (item: AssetStoreOptions) => void;
  onChange?: (item: AssetStoreOptions, isValid: boolean) => void;
  item?: AssetStoreOptions;
}

export default function AssetStoreForm({
  item,
  onCancel,
  onSubmit,
  onChange,
}: Props) {
  return (
    <Formik
      initialValues={{ ...item }}
      onSubmit={(values) => {
        if (onSubmit) {
          onSubmit(values as AssetStoreOptions);
        }
      }}
      validationSchema={AssetStoreOptionsSchema}
    >
      {({
        submitForm,
        isSubmitting,
        isValid,
        values,
        setFieldValue,
        errors,
      }) => (
        <Form>
          <ChangeListener
            values={values}
            isValid={isValid}
            onChange={onChange}
          />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Field
                component={TextField}
                type="text"
                fullWidth
                label={
                  <FormattedMessage
                    id="store.account"
                    defaultMessage="Store account"
                  />
                }
                name="storeAccount"
              />
            </Grid>
            <Grid item xs={12}>
              <CompletationProvider
                onCompletation={(output: string) => {
                  setFieldValue('name', output);
                }}
                initialPrompt={values.name}
              >
                {({ inputAdornment, ref }) => (
                  <Field
                    component={TextField}
                    type="text"
                    fullWidth
                    label={<FormattedMessage id="name" defaultMessage="Name" />}
                    name="name"
                    inputRef={ref}
                    InputProps={{ endAdornment: inputAdornment('end') }}
                  />
                )}
              </CompletationProvider>
            </Grid>

            <Grid item xs={12}>
              <CompletationProvider
                onCompletation={(output: string) => {
                  setFieldValue('title', output);
                }}
                initialPrompt={values.title}
              >
                {({ inputAdornment, ref }) => (
                  <Field
                    component={TextField}
                    name="title"
                    type="text"
                    fullWidth
                    label={
                      <FormattedMessage id="title" defaultMessage="Title" />
                    }
                    inputRef={ref}
                    InputProps={{ endAdornment: inputAdornment('end') }}
                  />
                )}
              </CompletationProvider>
            </Grid>

            <Grid item xs={12}>
              <CompletationProvider
                onCompletation={(output: string) => {
                  setFieldValue('description', output);
                }}
                initialPrompt={values.description}
              >
                {({ inputAdornment, ref }) => (
                  <Field
                    component={TextField}
                    type="text"
                    fullWidth
                    label={
                      <FormattedMessage
                        id="description"
                        defaultMessage="Description"
                      />
                    }
                    name="description"
                    inputRef={ref}
                    InputProps={{ endAdornment: inputAdornment('end') }}
                  />
                )}
              </CompletationProvider>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={2}>
                <Box pl={2}>
                  <Typography variant="caption">
                    <FormattedMessage
                      id="profile.image"
                      defaultMessage="Profile Image"
                    />
                  </Typography>
                </Box>
                <ImageFormUpload
                  value={values?.profileImageURL || ''}
                  onSelectFile={(file) =>
                    setFieldValue(`profileImageURL`, file)
                  }
                  error={Boolean(errors && (errors as any)?.profileImageURL)}
                />
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={2}>
                <Box pl={2}>
                  <Typography variant="caption">
                    <FormattedMessage
                      id="background.image"
                      defaultMessage="Background image"
                    />
                  </Typography>
                </Box>
                <ImageFormUpload
                  value={values?.backgroundImageURL || ''}
                  onSelectFile={(file) =>
                    setFieldValue(`backgroundImageURL`, file)
                  }
                  error={Boolean(errors && (errors as any)?.backgroundImageURL)}
                />
              </Stack>
            </Grid>
            {isSubmitting && <LinearProgress />}
            {onSubmit && (
              <Grid item xs={12}>
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  {onCancel && (
                    <Button onClick={onCancel}>
                      <FormattedMessage id="cancel" defaultMessage="Cancel" />
                    </Button>
                  )}
                  <Button
                    disabled={!isValid}
                    variant="contained"
                    onClick={submitForm}
                  >
                    <FormattedMessage id="save" defaultMessage="Save" />
                  </Button>
                </Stack>
              </Grid>
            )}
          </Grid>
        </Form>
      )}
    </Formik>
  );
}
