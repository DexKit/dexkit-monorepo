import { Box } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { MultiStepperConfig } from '../types/stepper';
import { Stepper } from './Stepper';

interface StepperGroupProps {
  config: MultiStepperConfig;
  onChange?: (config: MultiStepperConfig) => void;
}

export const StepperGroup: React.FC<StepperGroupProps> = ({
  config,
  onChange,
}) => {
  const { steps, settings, activeStep: controlledActiveStep, completedSteps, skippedSteps } = config;
  const {
    spacing = 2,
    fullWidth = true,
  } = settings;

  const [internalActiveStep, setInternalActiveStep] = useState(controlledActiveStep || 0);

  const isControlled = controlledActiveStep !== undefined;
  const currentActiveStep = isControlled ? controlledActiveStep : internalActiveStep;

  const handleStepChange = useCallback(
    (activeStep: number, previousStep: number) => {
      if (!isControlled) {
        setInternalActiveStep(activeStep);
      }

      if (onChange) {
        const updatedConfig = {
          ...config,
          activeStep,
        };
        onChange(updatedConfig);
      }

      if (settings.onStepChange) {
        settings.onStepChange(activeStep, previousStep);
      }
    },
    [isControlled, config, settings, onChange]
  );

  const handleStepClick = useCallback(
    (step: number) => {
      if (settings.onStepClick) {
        settings.onStepClick(step);
      }
    },
    [settings]
  );

  const handleComplete = useCallback(() => {
    if (settings.onComplete) {
      settings.onComplete();
    }
  }, [settings]);

  const handleReset = useCallback(() => {
    if (!isControlled) {
      setInternalActiveStep(0);
    }

    if (onChange) {
      const updatedConfig = {
        ...config,
        activeStep: 0,
        completedSteps: [],
        skippedSteps: [],
      };
      onChange(updatedConfig);
    }

    if (settings.onReset) {
      settings.onReset();
    }
  }, [isControlled, config, settings, onChange]);

  if (!steps.length) {
    return null;
  }

  return (
    <Box
      sx={{
        width: fullWidth ? '100%' : 'auto',
        ...settings.sx,
      }}
      className={settings.className}
    >
      <Stepper
        steps={steps}
        settings={settings}
        activeStep={currentActiveStep}
        completedSteps={completedSteps}
        skippedSteps={skippedSteps}
        onStepChange={handleStepChange}
        onStepClick={handleStepClick}
        onComplete={handleComplete}
        onReset={handleReset}
      />
    </Box>
  );
}; 