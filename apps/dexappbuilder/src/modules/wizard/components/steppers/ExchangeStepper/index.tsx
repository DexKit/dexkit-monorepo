import { generateCSSVarsTheme } from '@/modules/wizard/utils';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Step from '@mui/material/Step';
import StepContent from '@mui/material/StepContent';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import ExchangeWizardContainer from '../../containers/ExchangeWizardContainer';
import GeneralWizardContainer from '../../containers/GeneralWizardContainer';
import ThemeWizardContainer from '../../containers/ThemeWizardContainer';
import TokenWizardContainer from '../../containers/TokenWizardContainer';

const steps = [
  {
    label: 'General info',
    id: 'general',
    description: (
      <FormattedMessage
        id="swap.step.general.info"
        defaultMessage="Set general info for your swap app."
      />
    ),
  },
  {
    label: 'Set up theme',
    id: 'theme',
    description: (
      <FormattedMessage
        id=".step.theme.info"
        defaultMessage="Choose swap app theme and font."
      />
    ),
  },
  {
    label: 'Choose Tokens',
    id: 'default-tokens',
    description: 'Choose default tokens on your app.',
  },
  {
    label: 'Exchange configuration',
    id: 'exchange-configuration',
    description: 'Exchange configuration.',
  },
];

interface Props {
  onSave: (config: AppConfig) => void;
  onChange: (config: AppConfig) => void;
  config: AppConfig;
}

export default function ExchangeStepper({ config, onSave, onChange }: Props) {
  const [activeStep, setActiveStep] = React.useState(0);

  const customThemeDark = useMemo(() => {
    if (config?.customThemeDark) {
      return JSON.parse(config?.customThemeDark);
    }
    return {};
  }, [config?.customThemeDark]);

  const customThemeLight = useMemo(() => {
    if (config?.customThemeLight) {
      return JSON.parse(config?.customThemeLight);
    }
    return {};
  }, [config?.customThemeLight]);

  const selectedTheme = useMemo(() => {
    return generateCSSVarsTheme({
      selectedFont: config?.font,
      cssVarPrefix: 'theme-preview',
      customTheme: {
        colorSchemes: {
          dark: {
            ...customThemeDark,
          },
          light: {
            ...customThemeLight,
          },
        },
      },
      selectedThemeId: config?.theme || '',
    });
  }, [config?.theme, config?.font, customThemeDark, customThemeLight]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Container maxWidth="xl">
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.id}>
            <StepLabel>{step.label}</StepLabel>
            <StepContent>
              <Box>
                {step.id === 'theme' && (
                  <ThemeWizardContainer
                    config={config}
                    onSave={onChange}
                    onChange={onChange}
                    isOnStepper={true}
                    stepperButtonProps={{
                      handleNext: handleNext,
                      handleBack: handleBack,
                      isLastStep: index === steps.length - 1,
                      isFirstStep: index === 0,
                    }}
                  />
                )}
                {step.id === 'general' && (
                  <GeneralWizardContainer
                    config={config}
                    onSave={onChange}
                    onChange={onChange}
                    isOnStepper={true}
                    stepperButtonProps={{
                      handleNext: handleNext,
                      handleBack: handleBack,
                      isLastStep: index === steps.length - 1,
                      isFirstStep: index === 0,
                    }}
                  />
                )}
                {step.id === 'default-tokens' && (
                  <TokenWizardContainer
                    config={config}
                    onSave={onChange}
                    isOnStepper={true}
                    isSwap={true}
                    stepperButtonProps={{
                      handleNext: handleNext,
                      handleBack: handleBack,
                      isLastStep: index === steps.length - 1,
                      isFirstStep: index === 0,
                    }}
                  />
                )}
                {step.id === 'exchange-configuration' && (
                  <ExchangeWizardContainer
                    config={config}
                    theme={selectedTheme}
                    onSave={onChange}
                    onChange={onChange}
                    isOnStepper={true}
                    stepperButtonProps={{
                      handleNext: handleNext,
                      handleBack: handleBack,
                      isLastStep: index === steps.length - 1,
                      isFirstStep: index === 0,
                    }}
                  />
                )}
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>
            <FormattedMessage
              id="steps.completed.finished.stepper"
              defaultMessage={
                'All steps completed - you finished swap configuration'
              }
            />
          </Typography>
          <Button
            variant="contained"
            onClick={() => onSave(config)}
            sx={{ mt: 1, mr: 1 }}
          >
            <FormattedMessage id="create.app" defaultMessage="Create app" />
          </Button>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            <FormattedMessage id="reset" defaultMessage="Reset" />
          </Button>
        </Paper>
      )}
    </Container>
  );
}
