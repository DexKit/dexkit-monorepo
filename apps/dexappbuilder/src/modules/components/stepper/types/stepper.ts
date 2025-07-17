
export interface StepAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  size?: 'small' | 'medium' | 'large';
  startIcon?: string;
  endIcon?: string;
  disabled?: boolean;
  sx?: any;
}

export interface StepItem {
  id: string;
  label: string;
  content: string;
  description?: string;
  completed?: boolean;
  optional?: boolean;
  error?: boolean;
  disabled?: boolean;
  icon?: string;
  actions?: StepAction[];
  sx?: any;
  stepProps?: any;
  stepLabelProps?: any;
  stepContentProps?: any;
  stepButtonProps?: any;
}

export interface StepperSettings {
  // Basic settings
  orientation?: 'horizontal' | 'vertical';
  variant?: 'elevation' | 'outlined';
  linear?: boolean;
  alternativeLabel?: boolean;

  // Visual settings
  connector?: string;
  elevation?: number;
  borderRadius?: number;
  square?: boolean;

  // Interaction settings
  nonLinear?: boolean;
  allowStepSkipping?: boolean;
  allowStepReset?: boolean;

  // Mobile stepper settings
  mobileStepper?: boolean;
  mobileStepperVariant?: 'text' | 'dots' | 'progress';
  mobileStepperPosition?: 'bottom' | 'top' | 'static';
  mobileStepperLinearProgress?: boolean;

  // Layout settings
  fullWidth?: boolean;
  spacing?: number;
  padding?: number;

  // Navigation settings
  showBackButton?: boolean;
  showNextButton?: boolean;
  showSkipButton?: boolean;
  showResetButton?: boolean;
  backButtonText?: string;
  nextButtonText?: string;
  skipButtonText?: string;
  resetButtonText?: string;
  finishButtonText?: string;

  // Step icon settings
  defaultStepIcon?: string;
  completedStepIcon?: string;
  errorStepIcon?: string;
  hideStepIcons?: boolean;
  customStepIcons?: Record<number, string>;

  // Step content settings
  unmountOnExit?: boolean;
  transitionDuration?: number | 'auto';
  transitionEasing?: string;

  // Validation settings
  validateOnNext?: boolean;

  // Event handlers
  onStepChange?: (activeStep: number, previousStep: number) => void;
  onStepClick?: (step: number) => void;
  onComplete?: () => void;
  onReset?: () => void;

  // Style customization
  sx?: any;
  className?: string;
  stepperProps?: any;
  stepIconProps?: any;
  stepConnectorProps?: any;
}

export interface MultiStepperConfig {
  steps: StepItem[];
  settings: StepperSettings;
  activeStep?: number;
  completedSteps?: number[];
  skippedSteps?: number[];
}

export interface StepperPageSection {
  type: "stepper";
  settings: {
    steps: Array<{
      id: string;
      label: string;
      content: string;
      description?: string;
      completed?: boolean;
      optional?: boolean;
      error?: boolean;
      disabled?: boolean;
      icon?: string;
      actions?: Array<{
        label: string;
        href?: string;
        onClick?: () => void;
        variant?: 'text' | 'outlined' | 'contained';
        color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
        size?: 'small' | 'medium' | 'large';
        startIcon?: string;
        endIcon?: string;
        disabled?: boolean;
        sx?: any;
      }>;
      sx?: any;
      stepProps?: any;
      stepLabelProps?: any;
      stepContentProps?: any;
      stepButtonProps?: any;
    }>;
    orientation?: 'horizontal' | 'vertical';
    variant?: 'elevation' | 'outlined';
    linear?: boolean;
    alternativeLabel?: boolean;
    connector?: string;
    elevation?: number;
    borderRadius?: number;
    square?: boolean;
    nonLinear?: boolean;
    allowStepSkipping?: boolean;
    allowStepReset?: boolean;
    mobileStepper?: boolean;
    mobileStepperVariant?: 'text' | 'dots' | 'progress';
    mobileStepperPosition?: 'bottom' | 'top' | 'static';
    mobileStepperLinearProgress?: boolean;
    fullWidth?: boolean;
    spacing?: number;
    padding?: number;
    showBackButton?: boolean;
    showNextButton?: boolean;
    showSkipButton?: boolean;
    showResetButton?: boolean;
    backButtonText?: string;
    nextButtonText?: string;
    skipButtonText?: string;
    resetButtonText?: string;
    finishButtonText?: string;
    defaultStepIcon?: string;
    completedStepIcon?: string;
    errorStepIcon?: string;
    hideStepIcons?: boolean;
    customStepIcons?: Record<number, string>;
    unmountOnExit?: boolean;
    transitionDuration?: number | 'auto';
    transitionEasing?: string;
    validateOnNext?: boolean;
    onStepChange?: (activeStep: number, previousStep: number) => void;
    onStepClick?: (step: number) => void;
    onComplete?: () => void;
    onReset?: () => void;
    sx?: any;
    className?: string;
    stepperProps?: any;
    stepIconProps?: any;
    stepConnectorProps?: any;
  };
}

// Default configurations
export const defaultStepItem: StepItem = {
  id: '',
  label: 'Step Label',
  content: 'Step content goes here...',
  completed: false,
  optional: false,
  error: false,
  disabled: false,
  actions: [],
};

export const defaultStepperSettings: StepperSettings = {
  orientation: 'horizontal',
  variant: 'elevation',
  linear: true,
  alternativeLabel: false,
  elevation: 1,
  borderRadius: 4,
  square: false,
  nonLinear: false,
  allowStepSkipping: false,
  allowStepReset: false,
  mobileStepper: false,
  mobileStepperVariant: 'dots',
  mobileStepperPosition: 'bottom',
  mobileStepperLinearProgress: false,
  fullWidth: true,
  spacing: 2,
  padding: 24,
  showBackButton: true,
  showNextButton: true,
  showSkipButton: false,
  showResetButton: false,
  backButtonText: 'Back',
  nextButtonText: 'Next',
  skipButtonText: 'Skip',
  resetButtonText: 'Reset',
  finishButtonText: 'Finish',
  defaultStepIcon: undefined,
  completedStepIcon: 'Check',
  errorStepIcon: 'Warning',
  hideStepIcons: false,
  customStepIcons: {},
  unmountOnExit: false,
  transitionDuration: 'auto',
  validateOnNext: false,
};

export const defaultMultiStepperConfig: MultiStepperConfig = {
  steps: [],
  settings: defaultStepperSettings,
  activeStep: 0,
  completedSteps: [],
  skippedSteps: [],
}; 