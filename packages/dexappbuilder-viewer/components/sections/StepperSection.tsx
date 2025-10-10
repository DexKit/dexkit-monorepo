import { MarkdownRenderer } from '@dexkit/ui/components';
import { StepperPageSection } from '@dexkit/ui/modules/wizard/types/section';
import * as Icons from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  MobileStepper,
  Stepper as MuiStepper,
  Paper,
  Stack,
  Step,
  StepButton,
  StepConnector,
  StepContent,
  StepLabel,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useCallback, useState } from 'react';

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

interface Props {
  section: StepperPageSection;
}

function getIconComponent(iconName?: string): React.ReactElement | null {
  if (!iconName) return null;

  const variations = [
    iconName,
    iconName.charAt(0).toUpperCase() + iconName.slice(1),
    iconName.replace(/_/g, ''),
    iconName.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(''),
    iconName.replace(/([a-z])([A-Z])/g, '$1$2'),
  ];

  let IconComponent = null;
  let foundVariation = '';

  for (const variation of variations) {
    IconComponent = (Icons as any)[variation];
    if (IconComponent) {
      foundVariation = variation;
      break;
    }
  }

  if (!IconComponent) {
    console.warn('❌ Icon not found for any variation of:', iconName, variations);
    return null;
  }

  return <IconComponent />;
}

export default function StepperSection({ section }: Props) {
  const { steps, ...settings } = section.settings;

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

  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [skippedSteps, setSkippedSteps] = useState<Set<number>>(new Set());

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
        ? steps.findIndex((step, i) => !completedSteps.has(i))
        : activeStep + 1;

    setActiveStep(newActiveStep);

    const newCompletedSteps = new Set(completedSteps);
    newCompletedSteps.add(activeStep);
    setCompletedSteps(newCompletedSteps);

    if (settings.onStepChange) {
      settings.onStepChange(newActiveStep, activeStep);
    }

    if (isLastStep() && allStepsCompleted() && settings.onComplete) {
      settings.onComplete();
    }
  }, [activeStep, steps, completedSteps, isLastStep, allStepsCompleted, validateOnNext, settings]);

  const handleBack = useCallback(() => {
    const newActiveStep = activeStep - 1;
    setActiveStep(newActiveStep);

    if (settings.onStepChange) {
      settings.onStepChange(newActiveStep, activeStep);
    }
  }, [activeStep, settings]);

  const handleStep = useCallback((step: number) => () => {
    if (!nonLinear) return;

    setActiveStep(step);

    if (settings.onStepClick) {
      settings.onStepClick(step);
    }
    if (settings.onStepChange) {
      settings.onStepChange(step, activeStep);
    }
  }, [activeStep, nonLinear, settings]);

  const handleSkip = useCallback(() => {
    if (!allowStepSkipping || !isStepOptional(activeStep)) {
      return;
    }

    const newActiveStep = activeStep + 1;
    setActiveStep(newActiveStep);

    const newSkippedSteps = new Set(skippedSteps);
    newSkippedSteps.add(activeStep);
    setSkippedSteps(newSkippedSteps);

    if (settings.onStepChange) {
      settings.onStepChange(newActiveStep, activeStep);
    }
  }, [activeStep, allowStepSkipping, isStepOptional, skippedSteps, settings]);

  const handleReset = useCallback(() => {
    setActiveStep(0);
    setCompletedSteps(new Set());
    setSkippedSteps(new Set());

    if (settings.onReset) {
      settings.onReset();
    }
    if (settings.onStepChange) {
      settings.onStepChange(0, activeStep);
    }
  }, [activeStep, settings]);

  const renderActions = (step: typeof steps[0], placement: 'content' | 'buttons') => {
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
      if (StepIconComponent) {
        return React.cloneElement(StepIconComponent, {
          style: {
            color: step.iconColor || 'inherit',
            fontSize: 'inherit'
          }
        } as any);
      }
      return <span>{props.icon}</span>;
    }

    if (customStepIcons && customStepIcons[stepIndex]) {
      const CustomIconComponent = getIconComponent(customStepIcons[stepIndex]);
      if (CustomIconComponent) {
        return React.cloneElement(CustomIconComponent, {
          style: {
            color: step?.iconColor || 'inherit',
            fontSize: 'inherit'
          }
        } as any);
      }
      return <span>{props.icon}</span>;
    }

    if (error && errorStepIcon) {
      const ErrorIconComponent = getIconComponent(errorStepIcon);
      if (ErrorIconComponent) {
        return React.cloneElement(ErrorIconComponent, {
          style: {
            color: step?.iconColor || 'inherit',
            fontSize: 'inherit'
          }
        } as any);
      }
      return <span>{props.icon}</span>;
    }

    if (completed && completedStepIcon) {
      const CompletedIconComponent = getIconComponent(completedStepIcon);
      if (CompletedIconComponent) {
        return React.cloneElement(CompletedIconComponent, {
          style: {
            color: step?.iconColor || 'inherit',
            fontSize: 'inherit'
          }
        } as any);
      }
      return <span>{props.icon}</span>;
    }

    if (defaultStepIcon) {
      const DefaultIconComponent = getIconComponent(defaultStepIcon);
      if (DefaultIconComponent) {
        return React.cloneElement(DefaultIconComponent, {
          style: {
            color: step?.iconColor || 'inherit',
            fontSize: 'inherit'
          }
        } as any);
      }
      return <span>{props.icon}</span>;
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

  if (!steps.length) {
    return null;
  }

  if (mobileStepper) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ width: fullWidth ? '100%' : 'auto', ...sx }} className={className}>
          <Paper square elevation={variant === 'outlined' ? 0 : elevation} variant={variant}>
            <Box sx={{ p: padding / 8 }}>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  mb: 2,
                }}
              >
                {steps[activeStep]?.label}
              </Typography>
              {steps[activeStep]?.description && (
                <Typography
                  variant="body2"
                  sx={{
                    mb: 2,
                  }}
                >
                  {steps[activeStep].description}
                </Typography>
              )}
              <MarkdownRenderer
                content={steps[activeStep]?.content}
                variant="body1"
                sx={{
                  mb: 2,
                }}
              />
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
      </Container>
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
                  sx={{
                    ...step.stepLabelProps?.sx
                  }}
                >
                  {step.label}
                  {step.description && orientation === 'horizontal' && (
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{
                      }}
                    >
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
                <MarkdownRenderer
                  content={step.content}
                  variant="body1"
                  sx={{
                    mb: 2,
                  }}
                />
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
      <Container maxWidth="lg" sx={{ py: 4 }}>
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
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      mb: 2,
                    }}
                  >
                    {steps[activeStep]?.label}
                  </Typography>
                  {steps[activeStep]?.description && (
                    <Typography
                      variant="body2"
                      sx={{
                      }}
                    >
                      {steps[activeStep].description}
                    </Typography>
                  )}
                  <MarkdownRenderer
                    content={steps[activeStep]?.content}
                    variant="body1"
                    sx={{
                      mb: 2,
                    }}
                  />
                  {renderActions(steps[activeStep], 'content')}
                  {renderNavigationButtons()}
                </React.Fragment>
              )}
            </Box>
          )}
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
                <MarkdownRenderer
                  content={steps[activeStep]?.content}
                  variant="body1"
                  sx={{ mb: 2 }}
                />
                {renderActions(steps[activeStep], 'content')}
                {renderNavigationButtons()}
              </React.Fragment>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
} 