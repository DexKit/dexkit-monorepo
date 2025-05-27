import { CURRENCIES, LANGUAGES } from '@dexkit/ui/constants';
import { WidgetConfig } from '@dexkit/ui/modules/wizard/types/widget';
import { Divider, Grid, MenuItem, Stack, Typography } from '@mui/material';
import { Field, Formik } from 'formik';
import { Select, TextField } from 'formik-mui';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import * as Yup from 'yup';

export const GeneralSchema = Yup.object().shape({
  name: Yup.string().required(),
  currency: Yup.string().required(),
  locale: Yup.string().required(),
});

interface GeneralSectionForm {
  name: string;
  currency: string;
  locale: string;
}

interface Props {
  config: WidgetConfig;
  onSave: (config: WidgetConfig) => void;
  onChange: (config: WidgetConfig) => void;
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
    locale: config.locale,
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
    <Grid container spacing={2}>
      <Grid item xs={12}>
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
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Formik
          initialValues={generalData}
          onSubmit={handleSubmitGeneral}
          validationSchema={GeneralSchema}
        >
          <Field
            component={TextField}
            sx={{ maxWidth: '500px' }}
            fullWidth
            name={`name`}
            label={<FormattedMessage id="name" defaultMessage="Name" />}
          />
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
          <Field
            component={Select}
            id="locale"
            name="locale"
            labelId="locale-label-id"
            label={<FormattedMessage id="language" defaultMessage="Language" />}
          >
            {LANGUAGES.map((lang, index) => (
              <MenuItem key={index} value={lang.locale}>
                {lang.name}
              </MenuItem>
            ))}
          </Field>
        </Formik>
      </Grid>
    </Grid>
  );
}
