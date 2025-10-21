import { CURRENCIES, LANGUAGES } from '@dexkit/ui/constants';
import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import {
  Button,
  Divider,
  Grid,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { Field, Formik } from 'formik';
import { Select, TextField } from 'formik-mui';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import * as Yup from 'yup';

export const GeneralSchema = Yup.object().shape({
  name: Yup.string().required(),
  currency: Yup.string().required(),
  locale: Yup.string(),
});

interface GeneralSectionForm {
  name: string;
  currency: string;
  locale?: string;
}

interface Props {
  config: AppConfig;
  onSave: (config: AppConfig) => void;
  onChange: (config: AppConfig) => void;
  onHasChanges?: (changes: boolean) => void;
}

export default function GeneralWizardContainer({
  config,
  onSave,
  onChange,
  onHasChanges,
}: Props) {
  const [generalData, setGeneralData] = useState<GeneralSectionForm>({
    name: config.name,
    locale: config?.locale,
    currency: config.currency,
  });

  const handleSubmitGeneral = (form: GeneralSectionForm) => {
    setGeneralData(form);
    if (form) {
      const newConfig = {
        ...config,
        name: form.name,
        currency: form.currency,
        locale: form.locale,
      };
      onSave(newConfig);
    }
  };

  const onChangeGeneral = (form: GeneralSectionForm) => {
    if (form) {
      const newConfig = {
        ...config,
        name: form.name,
        currency: form.currency,
        locale: form.locale,
      };
      onChange(newConfig);
    }
  };

  useEffect(() => {
    if (config) {
      setGeneralData({
        currency: config.currency,
        locale: config.locale || '',
        name: config.name,
      });
    }
  }, []);

  return (
    <>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Stack>
            <Typography variant={'h6'}>
              <FormattedMessage id="general" defaultMessage="General" />
            </Typography>
            <Typography variant={'body2'}>
              <FormattedMessage
                id="general.information.description.widget"
                defaultMessage="Input your widget's general details"
              />
            </Typography>
          </Stack>
        </Grid>
        <Grid size={12}>
          <Divider />
        </Grid>
        <Grid size={12}>
          <Formik
            initialValues={generalData}
            onSubmit={handleSubmitGeneral}
            validationSchema={GeneralSchema}
            enableReinitialize={true}
          >
            {(props: any) => (
              <>
                {' '}
                <Grid container spacing={2}>
                  <Grid size={12}>
                    <Field
                      component={TextField}
                      sx={{ maxWidth: '500px' }}
                      fullWidth
                      name={`name`}
                      label={
                        <FormattedMessage id="name" defaultMessage="Name" />
                      }
                    />
                  </Grid>
                  <Grid size={12}>
                    <Field
                      component={Select}
                      id="currency"
                      name="currency"
                      labelId="currency-label-id"
                      label={
                        <FormattedMessage
                          id="default.currency"
                          defaultMessage="Default currency"
                        />
                      }
                    >
                      {CURRENCIES.map((curr, index) => (
                        <MenuItem key={index} value={curr.symbol}>
                          {curr.name} ({curr.symbol.toUpperCase()})
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>
                  <Grid size={12}>
                    <Field
                      component={Select}
                      id="locale"
                      sx={{ minWidth: '200px' }}
                      name="locale"
                      labelId="locale-label-id"
                      label={
                        <FormattedMessage
                          id="language"
                          defaultMessage="Language"
                        />
                      }
                    >
                      {LANGUAGES.map((lang, index) => (
                        <MenuItem key={index} value={lang.locale}>
                          {lang.name}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>
                  <Grid size={12}>
                    <Divider></Divider>
                  </Grid>
                  <Grid size={12}>
                    <Stack
                      spacing={1}
                      direction="row"
                      justifyContent="flex-end"
                    >
                      <Button
                        onClick={() => {
                          props.resetForm();
                        }}
                      >
                        <FormattedMessage id="cancel" defaultMessage="Cancel" />
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          props.submitForm();
                        }}
                        disabled={!props.dirty}
                      >
                        <FormattedMessage id="save" defaultMessage="Save" />
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </>
            )}
          </Formik>
        </Grid>
      </Grid>
    </>
  );
}
