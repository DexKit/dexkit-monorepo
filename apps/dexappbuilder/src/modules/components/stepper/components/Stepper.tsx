import * as Icons from '@mui/icons-material';
import {
  Box,
  Button,
  MobileStepper,
  Stepper as MuiStepper,
  Paper,
  Stack,
  Step,
  StepButton,
  StepConnector,
  StepContent,
  StepLabel,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useCallback, useState } from 'react';
import { StepItem, StepperSettings } from '../types/stepper';

interface StyledStepperProps {
  customBorderRadius?: number;
  customElevation?: number;
  customPadding?: number;
}

const StyledStepper = styled(MuiStepper, {
  shouldForwardProp: (prop) =>
    prop !== 'customBorderRadius' &&
    prop !== 'customElevation' &&
    prop !== 'customPadding',
})<StyledStepperProps>(({ theme, customBorderRadius, customElevation, customPadding }) => ({
  ...(customPadding !== undefined && {
    padding: `${customPadding}px`,
  }),
  ...(customBorderRadius !== undefined && {
    borderRadius: `${customBorderRadius}px !important`,
  }),
  ...(customElevation !== undefined && {
    boxShadow: theme.shadows[Math.min(Math.max(customElevation, 0), 24) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24],
  }),
}));

interface StepperProps {
  steps: StepItem[];
  settings: StepperSettings;
  activeStep?: number;
  completedSteps?: number[];
  skippedSteps?: number[];
  onStepChange?: (activeStep: number, previousStep: number) => void;
  onStepClick?: (step: number) => void;
  onComplete?: () => void;
  onReset?: () => void;
}

function getIconComponent(iconName?: string): React.ReactElement | null {
  if (!iconName) return null;

  const IconComponent = (Icons as any)[iconName];
  if (!IconComponent) return null;

  return <IconComponent />;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  settings,
  activeStep: controlledActiveStep,
  completedSteps: controlledCompletedSteps,
  skippedSteps: controlledSkippedSteps,
  onStepChange,
  onStepClick,
  onComplete,
  onReset,
}) => {
  const {
    orientation = 'horizontal',
    variant = 'elevation',
    linear = true,
    alternativeLabel = false,
    connector,
    elevation = 1,
    borderRadius,
    square = false,
    nonLinear = false,
    allowStepSkipping = false,
    allowStepReset = false,
    mobileStepper = false,
    mobileStepperVariant = 'dots',
    mobileStepperPosition = 'bottom',
    mobileStepperLinearProgress = false,
    fullWidth = true,
    spacing = 2,
    padding = 24,
    showBackButton = true,
    showNextButton = true,
    showSkipButton = false,
    showResetButton = false,
    backButtonText = 'Back',
    nextButtonText = 'Next',
    skipButtonText = 'Skip',
    resetButtonText = 'Reset',
    finishButtonText = 'Finish',
    defaultStepIcon,
    completedStepIcon = 'Check',
    errorStepIcon = 'Warning',
    hideStepIcons = false,
    customStepIcons = {},
    unmountOnExit = false,
    transitionDuration = 'auto',
    validateOnNext = false,
    sx,
    className,
    stepperProps,
    stepIconProps,
    stepConnectorProps,
  } = settings;

  const [internalActiveStep, setInternalActiveStep] = useState(0);
  const [internalCompletedSteps, setInternalCompletedSteps] = useState<Set<number>>(new Set());
  const [internalSkippedSteps, setInternalSkippedSteps] = useState<Set<number>>(new Set());

  const activeStep = controlledActiveStep !== undefined ? controlledActiveStep : internalActiveStep;
  const completedSteps = controlledCompletedSteps ? new Set(controlledCompletedSteps) : internalCompletedSteps;
  const skippedSteps = controlledSkippedSteps ? new Set(controlledSkippedSteps) : internalSkippedSteps;

  const isControlled = controlledActiveStep !== undefined;

  const isStepOptional = (step: number) => {
    return Boolean(steps[step]?.optional);
  };

  const isStepSkipped = (step: number) => {
    return skippedSteps.has(step);
  };

  const isStepComplete = (step: number) => {
    return completedSteps.has(step);
  };

  const isStepFailed = (step: number) => {
    return Boolean(steps[step]?.error);
  };

  const totalSteps = () => {
    return steps.length;
  };

  const completedStepsCount = () => {
    return completedSteps.size;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedStepsCount() === totalSteps();
  };

  const handleNext = useCallback(() => {
    if (validateOnNext && steps[activeStep]?.error) {
      return;
    }

    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ?
        steps.findIndex((step, i) => !completedSteps.has(i))
        : activeStep + 1;

    const previousStep = activeStep;

    if (!isControlled) {
      setInternalActiveStep(newActiveStep);

      const newCompletedSteps = new Set(completedSteps);
      newCompletedSteps.add(activeStep);
      setInternalCompletedSteps(newCompletedSteps);
    }

    onStepChange?.(newActiveStep, previousStep);

    if (isLastStep() && allStepsCompleted()) {
      onComplete?.();
    }
  }, [activeStep, steps, completedSteps, isControlled, isLastStep, allStepsCompleted, validateOnNext, onStepChange, onComplete]);

  const handleBack = useCallback(() => {
    const newActiveStep = activeStep - 1;
    const previousStep = activeStep;

    if (!isControlled) {
      setInternalActiveStep(newActiveStep);
    }

    onStepChange?.(newActiveStep, previousStep);
  }, [activeStep, isControlled, onStepChange]);

  const handleStep = useCallback((step: number) => () => {
    if (!nonLinear) return;

    const previousStep = activeStep;

    if (!isControlled) {
      setInternalActiveStep(step);
    }

    onStepClick?.(step);
    onStepChange?.(step, previousStep);
  }, [activeStep, nonLinear, isControlled, onStepClick, onStepChange]);

  const handleSkip = useCallback(() => {
    if (!allowStepSkipping || !isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    const newActiveStep = activeStep + 1;
    const previousStep = activeStep;

    if (!isControlled) {
      setInternalActiveStep(newActiveStep);

      const newSkippedSteps = new Set(skippedSteps);
      newSkippedSteps.add(activeStep);
      setInternalSkippedSteps(newSkippedSteps);
    }

    onStepChange?.(newActiveStep, previousStep);
  }, [activeStep, allowStepSkipping, isStepOptional, skippedSteps, isControlled, onStepChange]);

  const handleReset = useCallback(() => {
    const previousStep = activeStep;

    if (!isControlled) {
      setInternalActiveStep(0);
      setInternalCompletedSteps(new Set());
      setInternalSkippedSteps(new Set());
    }

    onReset?.();
    onStepChange?.(0, previousStep);
  }, [activeStep, isControlled, onReset, onStepChange]);

  const renderActions = (step: StepItem, placement: 'content' | 'buttons') => {
    if (!step.actions?.length) return null;

    const stepActions = step.actions.filter(action =>
      placement === 'content' || !placement
    );

    if (!stepActions.length) return null;

    return (
      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        {stepActions.map((action, index) => {
          const startIconComponent = getIconComponent(action.startIcon);
          const endIconComponent = getIconComponent(action.endIcon);

          if (action.href) {
            return (
              <Button
                key={index}
                component="a"
                href={action.href}
                variant={action.variant || 'text'}
                color={action.color || 'primary'}
                size={action.size || 'medium'}
                disabled={action.disabled}
                startIcon={startIconComponent}
                endIcon={endIconComponent}
                sx={action.sx}
              >
                {action.label}
              </Button>
            );
          }

          return (
            <Button
              key={index}
              onClick={action.onClick}
              variant={action.variant || 'text'}
              color={action.color || 'primary'}
              size={action.size || 'medium'}
              disabled={action.disabled}
              startIcon={startIconComponent}
              endIcon={endIconComponent}
              sx={action.sx}
            >
              {action.label}
            </Button>
          );
        })}
      </Stack>
    );
  };

  const renderStepIcon = (props: any) => {
    const { active, completed, error, icon } = props;
    const stepIndex = parseInt(props.icon) - 1;
    const step = steps[stepIndex];

    if (hideStepIcons) {
      return null;
    }

    if (step?.icon) {
      const StepIconComponent = getIconComponent(step.icon);
      return StepIconComponent || <span>{props.icon}</span>;
    }

    if (customStepIcons[stepIndex]) {
      const CustomIconComponent = getIconComponent(customStepIcons[stepIndex]);
      return CustomIconComponent || <span>{props.icon}</span>;
    }

    if (error && errorStepIcon) {
      const ErrorIconComponent = getIconComponent(errorStepIcon);
      return ErrorIconComponent || <span>{props.icon}</span>;
    }

    if (completed && completedStepIcon) {
      const CompletedIconComponent = getIconComponent(completedStepIcon);
      return CompletedIconComponent || <span>{props.icon}</span>;
    }

    if (defaultStepIcon) {
      const DefaultIconComponent = getIconComponent(defaultStepIcon);
      return DefaultIconComponent || <span>{props.icon}</span>;
    }

    return <span>{props.icon}</span>;
  };

  const renderConnector = () => {
    if (!connector) return undefined;

    const ConnectorComponent = getIconComponent(connector);
    return ConnectorComponent ? <StepConnector {...stepConnectorProps}>{ConnectorComponent}</StepConnector> : undefined;
  };

  const renderNavigationButtons = () => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Button
          color="inherit"
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
          style={{ display: showBackButton ? 'inline-flex' : 'none' }}
        >
          {backButtonText}
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        {isStepOptional(activeStep) && allowStepSkipping && showSkipButton && (
          <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
            {skipButtonText}
          </Button>
        )}
        {showResetButton && allowStepReset && (
          <Button color="inherit" onClick={handleReset} sx={{ mr: 1 }}>
            {resetButtonText}
          </Button>
        )}
        <Button
          onClick={handleNext}
          style={{ display: showNextButton ? 'inline-flex' : 'none' }}
        >
          {isLastStep() ? finishButtonText : nextButtonText}
        </Button>
      </Box>
    );
  };

  if (mobileStepper) {
    return (
      <Box sx={{ width: fullWidth ? '100%' : 'auto', ...sx }} className={className}>
        <Paper square elevation={variant === 'outlined' ? 0 : elevation} variant={variant}>
          <Box sx={{ p: padding / 8 }}>
            <Typography variant="h6" component="div" sx={{ mb: 2 }}>
              {steps[activeStep]?.label}
            </Typography>
            {steps[activeStep]?.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {steps[activeStep].description}
              </Typography>
            )}
            <Typography variant="body1" component="div" sx={{ mb: 2 }}>
              {steps[activeStep]?.content}
            </Typography>
            {renderActions(steps[activeStep], 'content')}
          </Box>
        </Paper>

        <MobileStepper
          variant={mobileStepperVariant}
          steps={totalSteps()}
          position={mobileStepperPosition}
          activeStep={activeStep}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === totalSteps() - 1}
              style={{ display: showNextButton ? 'inline-flex' : 'none' }}
            >
              {nextButtonText}
              <Icons.KeyboardArrowRight />
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0}
              style={{ display: showBackButton ? 'inline-flex' : 'none' }}
            >
              <Icons.KeyboardArrowLeft />
              {backButtonText}
            </Button>
          }
          LinearProgressProps={mobileStepperLinearProgress ? {} : undefined}
          {...stepperProps}
        />
      </Box>
    );
  }

  const stepperWrapperProps = variant === 'outlined'
    ? { elevation: 0, variant: 'outlined' as const, square }
    : {};

  const commonProps = {
    sx: {
      width: fullWidth ? '100%' : 'auto',
      ...(variant !== 'outlined' && { boxShadow: 'none' }),
      ...sx
    },
    className
  };

  const stepperContent = (
    <StyledStepper
      activeStep={activeStep}
      orientation={orientation}
      alternativeLabel={alternativeLabel}
      connector={renderConnector()}
      customBorderRadius={borderRadius}
      customElevation={variant === 'elevation' ? elevation : 0}
      customPadding={padding}
      nonLinear={nonLinear}
      {...stepperProps}
    >
      {steps.map((step, index) => {
        const stepProps: { completed?: boolean } = {};
        if (isStepComplete(index)) {
          stepProps.completed = true;
        }
        if (isStepSkipped(index)) {
          stepProps.completed = false;
        }

        return (
          <Step key={step.id} {...stepProps} disabled={step.disabled} sx={step.sx} {...step.stepProps}>
            {nonLinear ? (
              <StepButton
                color="inherit"
                onClick={handleStep(index)}
                optional={
                  step.optional ? (
                    <Typography variant="caption">Optional</Typography>
                  ) : null
                }
                {...step.stepButtonProps}
              >
                <StepLabel
                  error={step.error}
                  StepIconComponent={renderStepIcon}
                  StepIconProps={stepIconProps}
                  {...step.stepLabelProps}
                >
                  {step.label}
                  {step.description && orientation === 'horizontal' && (
                    <Typography variant="caption" display="block" color="text.secondary">
                      {step.description}
                    </Typography>
                  )}
                </StepLabel>
              </StepButton>
            ) : (
              <StepLabel
                optional={
                  step.optional ? (
                    <Typography variant="caption">Optional</Typography>
                  ) : null
                }
                error={step.error}
                StepIconComponent={renderStepIcon}
                StepIconProps={stepIconProps}
                {...step.stepLabelProps}
              >
                {step.label}
                {step.description && orientation === 'horizontal' && (
                  <Typography variant="caption" display="block" color="text.secondary">
                    {step.description}
                  </Typography>
                )}
              </StepLabel>
            )}

            {orientation === 'vertical' && (
              <StepContent
                TransitionProps={{
                  unmountOnExit,
                  ...(typeof transitionDuration === 'number' && { timeout: transitionDuration }),
                }}
                {...step.stepContentProps}
              >
                <Typography variant="body1" component="div" sx={{ mb: 2 }}>
                  {step.content}
                </Typography>
                {renderActions(step, 'content')}
                {index === activeStep && renderNavigationButtons()}
              </StepContent>
            )}
          </Step>
        );
      })}
    </StyledStepper>
  );

  if (variant === 'outlined') {
    return (
      <Paper {...stepperWrapperProps} {...commonProps}>
        {stepperContent}
        {orientation === 'horizontal' && (
          <Box sx={{ p: 2 }}>
            {allStepsCompleted() ? (
              <React.Fragment>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  All steps completed - you&apos;re finished
                </Typography>
                {allowStepReset && showResetButton && (
                  <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button onClick={handleReset}>{resetButtonText}</Button>
                  </Box>
                )}
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                  {steps[activeStep]?.label}
                </Typography>
                {steps[activeStep]?.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {steps[activeStep].description}
                  </Typography>
                )}
                <Typography variant="body1" component="div" sx={{ mb: 2 }}>
                  {steps[activeStep]?.content}
                </Typography>
                {renderActions(steps[activeStep], 'content')}
                {renderNavigationButtons()}
              </React.Fragment>
            )}
          </Box>
        )}
      </Paper>
    );
  }

  return (
    <Box {...commonProps}>
      {stepperContent}
      {orientation === 'horizontal' && (
        <Box sx={{ p: 2 }}>
          {allStepsCompleted() ? (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you&apos;re finished
              </Typography>
              {allowStepReset && showResetButton && (
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                  <Box sx={{ flex: '1 1 auto' }} />
                  <Button onClick={handleReset}>{resetButtonText}</Button>
                </Box>
              )}
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                {steps[activeStep]?.label}
              </Typography>
              {steps[activeStep]?.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {steps[activeStep].description}
                </Typography>
              )}
              <Typography variant="body1" component="div" sx={{ mb: 2 }}>
                {steps[activeStep]?.content}
              </Typography>
              {renderActions(steps[activeStep], 'content')}
              {renderNavigationButtons()}
            </React.Fragment>
          )}
        </Box>
      )}
    </Box>
  );
}; 