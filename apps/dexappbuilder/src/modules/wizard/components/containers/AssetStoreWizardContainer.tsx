import { AssetStoreContainer } from '@/modules/nft/components/container/AssetStoreContainer';
import { StepperButtonProps } from '@dexkit/ui/modules/wizard/types';
import { AssetStorePageSection } from '@dexkit/ui/modules/wizard/types/section';
import { Alert } from '@mui/material';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  CssVarsTheme,
  Theme,
} from '@mui/material/styles';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { AssetStoreOptions } from 'src/types/nft';

import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import AssetStoreForm from '../forms/AssetStoreForm';
import { StepperButtons } from '../steppers/StepperButtons';
interface Props {
  config: AppConfig;
  configTheme: Omit<Theme, 'palette'> & CssVarsTheme;
  onSave: (config: AppConfig) => void;
  onChange: (config: AppConfig) => void;
  isOnStepper?: boolean;
  stepperButtonProps?: StepperButtonProps;
}

export default function AssetStoreWizardContainer({
  config,
  configTheme,
  onSave,
  onChange,
  isOnStepper,
  stepperButtonProps,
}: Props) {
  const [isValid, setIsValid] = useState<boolean>(false);
  const [formData, setFormData] = useState<AssetStoreOptions | undefined>(
    (
      config.pages['home']?.sections.find(
        (s) => s.type === 'asset-store',
      ) as AssetStorePageSection
    )?.config,
  );
  const changeConfig = function (
    configToChange: AppConfig,
    data?: AssetStoreOptions,
  ) {
    const newConfig = { ...configToChange };
    const sectionPageIndex = newConfig.pages['home']?.sections.findIndex(
      (s) => s.type === 'asset-store',
    );
    let editSection: AssetStorePageSection;
    if (data) {
      if (sectionPageIndex !== -1) {
        editSection = {
          ...(newConfig.pages['home']?.sections[
            sectionPageIndex
          ] as AssetStorePageSection),
          config: data,
        };
        newConfig.pages['home'].sections[sectionPageIndex] = editSection;
      } else {
        editSection = {
          title: 'asset-store',
          type: 'asset-store',
          config: data,
        };
        newConfig.pages['home']?.sections.push(editSection);
      }
    }
    return newConfig;
  };

  const handleSave = () => {
    onSave(changeConfig(config, formData));
  };
  const handleOnChange = (form: AssetStoreOptions, isFormValid: boolean) => {
    setFormData(form);
    setIsValid(isFormValid);
    onChange(changeConfig(config, form));
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack>
          <Typography variant={'subtitle2'}>
            <FormattedMessage id="nft.store" defaultMessage="NFT store" />
          </Typography>
          <Typography variant={'body2'}>
            <FormattedMessage
              id="settings.to.configure.store"
              defaultMessage="Settings to configure your NFT Store"
            />
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={6}>
        <Stack spacing={2}>
          <Alert severity="info">
            <FormattedMessage
              id="info.quick.wizard.store.account"
              defaultMessage="Fill first your store account with the address from where you want to sell your NFTs. "
            />
          </Alert>
          <AssetStoreForm onChange={handleOnChange} item={formData} />
        </Stack>
      </Grid>
      <Grid item xs={6}>
        <CssVarsProvider theme={configTheme}>
          <AssetStoreContainer {...formData} />
        </CssVarsProvider>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        {isOnStepper ? (
          <StepperButtons
            {...stepperButtonProps}
            handleNext={() => {
              handleSave();
              if (stepperButtonProps?.handleNext) {
                stepperButtonProps.handleNext();
              }
            }}
            disableContinue={!isValid}
          />
        ) : (
          <Stack spacing={1} direction="row" justifyContent="flex-end">
            <Button variant="contained" color="primary" onClick={handleSave}>
              <FormattedMessage id="save" defaultMessage="Save" />
            </Button>
          </Stack>
        )}
      </Grid>
    </Grid>
  );
}
