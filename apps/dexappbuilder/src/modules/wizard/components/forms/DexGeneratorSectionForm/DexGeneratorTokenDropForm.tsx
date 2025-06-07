import { TokenDropPageSection } from '@dexkit/ui/modules/wizard/types/section';
import { FormControl, Grid, InputLabel, MenuItem } from '@mui/material';
import { Field, Formik } from 'formik';
import { Select, TextField } from 'formik-mui';
import { FormattedMessage } from 'react-intl';

export interface DexGeneratorTokenDropFormProps {
  onChange: (section: TokenDropPageSection) => void;
  params: { network: string; address: string };
  section?: TokenDropPageSection;
}

export default function DexGeneratorTokenDropForm({
  onChange,
  params,
  section,
}: DexGeneratorTokenDropFormProps) {
  const { network, address } = params;

  const handleSubmit = ({ variant, customTitle, customSubtitle }: {
    variant?: 'simple' | 'detailed' | 'premium';
    customTitle?: string;
    customSubtitle?: string;
  }) => { };

  const handleValidate = ({ variant, customTitle, customSubtitle }: {
    variant?: 'simple' | 'detailed' | 'premium';
    customTitle?: string;
    customSubtitle?: string;
  }) => {
    onChange({ type: 'token-drop', settings: { address, network, variant, customTitle, customSubtitle } });
  };

  return (
    <Formik
      initialValues={
        section ? {
          variant: section.settings.variant,
          customTitle: section.settings.customTitle || '',
          customSubtitle: section.settings.customSubtitle || ''
        } : {
          variant: 'simple',
          customTitle: '',
          customSubtitle: ''
        }
      }
      onSubmit={handleSubmit}
      validate={handleValidate}
    >
      {({ submitForm, isValid, isSubmitting, values }) => (
        <Grid container spacing={2} sx={{ pt: 2 }}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink>
                <FormattedMessage id="variant" defaultMessage="Variant" />
              </InputLabel>
              <Field
                label={
                  <FormattedMessage id="variant" defaultMessage="Variant" />
                }
                component={Select}
                name="variant"
                fullWidth
              >
                <MenuItem value="simple">
                  <FormattedMessage id="simple" defaultMessage="Simple" />
                </MenuItem>
                <MenuItem value="detailed">
                  <FormattedMessage id="detailed" defaultMessage="Detailed" />
                </MenuItem>
                <MenuItem value="premium">
                  <FormattedMessage id="premium" defaultMessage="Premium" />
                </MenuItem>
              </Field>
            </FormControl>
          </Grid>
          {values.variant === 'premium' && (
            <>
              <Grid item xs={12}>
                <Field
                  component={TextField}
                  name="customTitle"
                  label={
                    <FormattedMessage
                      id="custom.title"
                      defaultMessage="Custom Title"
                    />
                  }
                  placeholder={
                    <FormattedMessage
                      id="claim.tokens"
                      defaultMessage="Claim Tokens"
                    />
                  }
                  fullWidth
                  helperText={
                    <FormattedMessage
                      id="custom.title.helper"
                      defaultMessage="Leave empty to use default title"
                    />
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  component={TextField}
                  name="customSubtitle"
                  label={
                    <FormattedMessage
                      id="custom.subtitle"
                      defaultMessage="Custom Subtitle"
                    />
                  }
                  placeholder={
                    <FormattedMessage
                      id="claim.tokens.from.contractName"
                      defaultMessage="Claim Tokens from {contractName}"
                      values={{ contractName: "Contract" }}
                    />
                  }
                  fullWidth
                  helperText={
                    <FormattedMessage
                      id="custom.subtitle.helper"
                      defaultMessage="Leave empty to use contract name"
                    />
                  }
                />
              </Grid>
            </>
          )}
        </Grid>
      )}
    </Formik>
  );
}
