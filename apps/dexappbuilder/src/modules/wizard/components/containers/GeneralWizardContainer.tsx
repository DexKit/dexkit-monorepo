import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import { Divider, Grid, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { StepperButtonProps } from '../../types';
import GeneralSection, { GeneralSectionForm } from '../sections/GeneralSection';

interface Props {
  config: AppConfig;
  onSave: (config: AppConfig) => void;
  onChange: (config: AppConfig) => void;
  onHasChanges?: (changes: boolean) => void;
  isOnStepper?: boolean;
  stepperButtonProps?: StepperButtonProps;
}

export default function GeneralWizardContainer({
  config,
  onSave,
  onChange,
  isOnStepper,
  onHasChanges,
  stepperButtonProps,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [generalData, setGeneralData] = useState<GeneralSectionForm>();

  const handleSubmitGeneral = (form: GeneralSectionForm) => {
    setGeneralData(form);
    if (form) {
      const newConfig = {
        ...config,
        name: form.name,
        email: form.email,
        favicon_url: form.faviconUrl,
        currency: form.currency,
        logo: {
          url: form.logoUrl,
          width: form.logoWidth || 48,
          height: form.logoHeight || 48,
          widthMobile: form.logoWidthMobile || 48,
          heightMobile: form.logoHeightMobile || 48,
        },
        logoDark: {
          url: form?.logoDarkUrl,
          width: form.logoWidth || 48,
          height: form.logoHeight || 48,
          widthMobile: form.logoWidthMobile || 48,
          heightMobile: form.logoHeightMobile || 48,
        },
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
        email: form.email,
        favicon_url: form.faviconUrl,
        currency: form.currency,
        logo: {
          url: form.logoUrl,
          width: form?.logoWidth || 48,
          height: form?.logoHeight || 48,
          widthMobile: form?.logoWidthMobile || 48,
          heightMobile: form?.logoHeightMobile || 48,
        },
        logoDark: {
          url: form?.logoDarkUrl,
          width: form?.logoWidth || 48,
          height: form?.logoHeight || 48,
          widthMobile: form?.logoWidthMobile || 48,
          heightMobile: form?.logoHeightMobile || 48,
        },
        locale: form.locale,
      };
      onChange(newConfig);
    }
  };

  useEffect(() => {
    if (config) {
      setGeneralData({
        currency: config.currency,
        email: config.email,
        faviconUrl: config.favicon_url || '',
        locale: config.locale || '',
        logoUrl: config.logo?.url || '',
        logoDarkUrl: config.logoDark?.url || '',
        logoHeight: Number(config.logo?.height || 48),
        logoWidth: Number(config.logo?.width || 48),
        logoHeightMobile: Number(config.logo?.heightMobile || 48),
        logoWidthMobile: Number(config.logo?.widthMobile || 48),
        name: config.name,
      });
    }
  }, []);

  return (
    <Grid container spacing={isMobile ? 1.5 : 3}>
      <Grid size={12}>
        <Stack spacing={isMobile ? 0.5 : 1} sx={{ mb: isMobile ? 1.5 : 2 }}>
          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            sx={{
              fontWeight: 600,
              fontSize: isMobile ? '1.15rem' : '1.5rem',
              mb: 0.5
            }}
          >
            <FormattedMessage id="general" defaultMessage="General" />
          </Typography>
          <Typography
            variant={isMobile ? 'body2' : 'body1'}
            color="text.secondary"
            sx={{
              fontSize: isMobile ? '0.85rem' : 'inherit',
            }}
          >
            <FormattedMessage
              id="general.information.description"
              defaultMessage="Input your app's general details"
            />
          </Typography>
        </Stack>
      </Grid>
      <Grid size={12}>
        <Divider />
      </Grid>
      <Grid size={12}>
        <GeneralSection
          initialValues={generalData}
          onChange={onChangeGeneral}
          onHasChanges={onHasChanges}
          onSubmit={handleSubmitGeneral}
          isOnStepper={isOnStepper}
          stepperButtonProps={stepperButtonProps}
        />
      </Grid>
    </Grid>
  );
}
