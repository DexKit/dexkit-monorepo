import { useCallback, useState } from 'react';
import { MultiStepperConfig, StepItem, defaultStepItem, defaultStepperSettings } from '../types/stepper';

export interface UseStepperConfigProps {
  initialConfig?: Partial<MultiStepperConfig>;
  onChange?: (config: MultiStepperConfig) => void;
}

export interface UseStepperConfigReturn {
  config: MultiStepperConfig;

  addStep: () => void;
  removeStep: (stepId: string) => void;
  updateStep: (stepId: string, updates: Partial<StepItem>) => void;
  duplicateStep: (stepId: string) => void;
  moveStep: (fromIndex: number, toIndex: number) => void;
  setActiveStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  markStepCompleted: (stepIndex: number) => void;
  markStepIncomplete: (stepIndex: number) => void;
  markStepSkipped: (stepIndex: number) => void;
  markStepUnskipped: (stepIndex: number) => void;
  updateSettings: (updates: Partial<MultiStepperConfig['settings']>) => void;
  resetConfig: () => void;
  isStepValid: (stepIndex: number) => boolean;
  canProceedToNext: () => boolean;
  canGoBack: () => boolean;
  isLastStep: () => boolean;
  isFirstStep: () => boolean;
  getTotalSteps: () => number;
  getCompletedStepsCount: () => number;
  getProgress: () => number;
  createStep: (overrides?: Partial<StepItem>) => StepItem;
  getStepById: (stepId: string) => StepItem | undefined;
  getStepIndex: (stepId: string) => number;
}

export function useStepperConfig({
  initialConfig = {},
  onChange,
}: UseStepperConfigProps = {}): UseStepperConfigReturn {

  const createDefaultConfig = (): MultiStepperConfig => ({
    steps: initialConfig.steps || [],
    settings: { ...defaultStepperSettings, ...initialConfig.settings },
    activeStep: initialConfig.activeStep || 0,
    completedSteps: initialConfig.completedSteps || [],
    skippedSteps: initialConfig.skippedSteps || [],
  });

  const [config, setConfig] = useState<MultiStepperConfig>(createDefaultConfig);

  const updateConfig = useCallback((updates: Partial<MultiStepperConfig>) => {
    setConfig(prev => {
      const newConfig = { ...prev, ...updates };
      onChange?.(newConfig);
      return newConfig;
    });
  }, [onChange]);

  const createStep = useCallback((overrides: Partial<StepItem> = {}): StepItem => {
    const stepCount = config.steps.length;
    return {
      ...defaultStepItem,
      id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      label: `Step ${stepCount + 1}`,
      content: 'Enter your step content here...',
      ...overrides,
    };
  }, [config.steps.length]);

  const addStep = useCallback(() => {
    const newStep = createStep();
    updateConfig({
      steps: [...config.steps, newStep],
    });
  }, [config.steps, createStep, updateConfig]);

  const removeStep = useCallback((stepId: string) => {
    const stepIndex = config.steps.findIndex(step => step.id === stepId);
    if (stepIndex === -1) return;

    const updatedSteps = config.steps.filter(step => step.id !== stepId);

    let newActiveStep = config.activeStep || 0;
    if (newActiveStep >= updatedSteps.length) {
      newActiveStep = Math.max(0, updatedSteps.length - 1);
    } else if (newActiveStep > stepIndex) {
      newActiveStep = newActiveStep - 1;
    }

    const updatedCompletedSteps = (config.completedSteps || []).filter(index => {
      return index < updatedSteps.length && index !== stepIndex;
    }).map(index => index > stepIndex ? index - 1 : index);

    const updatedSkippedSteps = (config.skippedSteps || []).filter(index => {
      return index < updatedSteps.length && index !== stepIndex;
    }).map(index => index > stepIndex ? index - 1 : index);

    updateConfig({
      steps: updatedSteps,
      activeStep: newActiveStep,
      completedSteps: updatedCompletedSteps,
      skippedSteps: updatedSkippedSteps,
    });
  }, [config, updateConfig]);

  const updateStep = useCallback((stepId: string, updates: Partial<StepItem>) => {
    const stepIndex = config.steps.findIndex(step => step.id === stepId);
    if (stepIndex === -1) return;

    const updatedSteps = [...config.steps];
    updatedSteps[stepIndex] = { ...updatedSteps[stepIndex], ...updates };

    updateConfig({ steps: updatedSteps });
  }, [config.steps, updateConfig]);

  const duplicateStep = useCallback((stepId: string) => {
    const stepIndex = config.steps.findIndex(step => step.id === stepId);
    if (stepIndex === -1) return;

    const originalStep = config.steps[stepIndex];
    const duplicatedStep = createStep({
      ...originalStep,
      label: `${originalStep.label} (Copy)`,
    });

    const updatedSteps = [...config.steps];
    updatedSteps.splice(stepIndex + 1, 0, duplicatedStep);

    updateConfig({ steps: updatedSteps });
  }, [config.steps, createStep, updateConfig]);

  const moveStep = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    if (fromIndex < 0 || fromIndex >= config.steps.length) return;
    if (toIndex < 0 || toIndex >= config.steps.length) return;

    const updatedSteps = [...config.steps];
    const [movedStep] = updatedSteps.splice(fromIndex, 1);
    updatedSteps.splice(toIndex, 0, movedStep);

    let newActiveStep = config.activeStep || 0;
    if (newActiveStep === fromIndex) {
      newActiveStep = toIndex;
    } else if (fromIndex < newActiveStep && toIndex >= newActiveStep) {
      newActiveStep = newActiveStep - 1;
    } else if (fromIndex > newActiveStep && toIndex <= newActiveStep) {
      newActiveStep = newActiveStep + 1;
    }

    updateConfig({
      steps: updatedSteps,
      activeStep: newActiveStep,
    });
  }, [config.steps, config.activeStep, updateConfig]);

  const setActiveStep = useCallback((step: number) => {
    if (step >= 0 && step < config.steps.length) {
      updateConfig({ activeStep: step });
    }
  }, [config.steps.length, updateConfig]);

  const nextStep = useCallback(() => {
    const currentStep = config.activeStep || 0;
    if (currentStep < config.steps.length - 1) {
      setActiveStep(currentStep + 1);
    }
  }, [config.activeStep, config.steps.length, setActiveStep]);

  const previousStep = useCallback(() => {
    const currentStep = config.activeStep || 0;
    if (currentStep > 0) {
      setActiveStep(currentStep - 1);
    }
  }, [config.activeStep, setActiveStep]);

  const goToStep = useCallback((step: number) => {
    if (config.settings.nonLinear || config.settings.linear === false) {
      setActiveStep(step);
    }
  }, [config.settings.nonLinear, config.settings.linear, setActiveStep]);

  const markStepCompleted = useCallback((stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= config.steps.length) return;

    const completedSteps = new Set(config.completedSteps || []);
    completedSteps.add(stepIndex);

    const skippedSteps = new Set(config.skippedSteps || []);
    skippedSteps.delete(stepIndex);

    updateConfig({
      completedSteps: Array.from(completedSteps),
      skippedSteps: Array.from(skippedSteps),
    });
  }, [config.steps.length, config.completedSteps, config.skippedSteps, updateConfig]);

  const markStepIncomplete = useCallback((stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= config.steps.length) return;

    const completedSteps = new Set(config.completedSteps || []);
    completedSteps.delete(stepIndex);

    updateConfig({
      completedSteps: Array.from(completedSteps),
    });
  }, [config.steps.length, config.completedSteps, updateConfig]);

  const markStepSkipped = useCallback((stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= config.steps.length) return;
    if (!config.steps[stepIndex]?.optional) return;

    const skippedSteps = new Set(config.skippedSteps || []);
    skippedSteps.add(stepIndex);

    const completedSteps = new Set(config.completedSteps || []);
    completedSteps.delete(stepIndex);

    updateConfig({
      completedSteps: Array.from(completedSteps),
      skippedSteps: Array.from(skippedSteps),
    });
  }, [config.steps, config.completedSteps, config.skippedSteps, updateConfig]);

  const markStepUnskipped = useCallback((stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= config.steps.length) return;

    const skippedSteps = new Set(config.skippedSteps || []);
    skippedSteps.delete(stepIndex);

    updateConfig({
      skippedSteps: Array.from(skippedSteps),
    });
  }, [config.steps.length, config.skippedSteps, updateConfig]);

  const updateSettings = useCallback((updates: Partial<MultiStepperConfig['settings']>) => {
    updateConfig({
      settings: { ...config.settings, ...updates },
    });
  }, [config.settings, updateConfig]);

  const resetConfig = useCallback(() => {
    const defaultConfig = createDefaultConfig();
    setConfig(defaultConfig);
    onChange?.(defaultConfig);
  }, [onChange]);

  const isStepValid = useCallback((stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= config.steps.length) return false;
    const step = config.steps[stepIndex];
    return !step.error && step.label.trim() !== '' && step.content.trim() !== '';
  }, [config.steps]);

  const canProceedToNext = useCallback(() => {
    const currentStep = config.activeStep || 0;
    if (currentStep >= config.steps.length - 1) return false;

    if (config.settings.validateOnNext) {
      return isStepValid(currentStep);
    }

    return true;
  }, [config.activeStep, config.steps.length, config.settings.validateOnNext, isStepValid]);

  const canGoBack = useCallback(() => {
    const currentStep = config.activeStep || 0;
    return currentStep > 0;
  }, [config.activeStep]);

  const isLastStep = useCallback(() => {
    const currentStep = config.activeStep || 0;
    return currentStep === config.steps.length - 1;
  }, [config.activeStep, config.steps.length]);

  const isFirstStep = useCallback(() => {
    const currentStep = config.activeStep || 0;
    return currentStep === 0;
  }, [config.activeStep]);

  const getTotalSteps = useCallback(() => {
    return config.steps.length;
  }, [config.steps.length]);

  const getCompletedStepsCount = useCallback(() => {
    return (config.completedSteps || []).length;
  }, [config.completedSteps]);

  const getProgress = useCallback(() => {
    const total = getTotalSteps();
    if (total === 0) return 0;

    const completed = getCompletedStepsCount();
    return (completed / total) * 100;
  }, [getTotalSteps, getCompletedStepsCount]);

  const getStepById = useCallback((stepId: string) => {
    return config.steps.find(step => step.id === stepId);
  }, [config.steps]);

  const getStepIndex = useCallback((stepId: string) => {
    return config.steps.findIndex(step => step.id === stepId);
  }, [config.steps]);

  return {
    config,
    addStep,
    removeStep,
    updateStep,
    duplicateStep,
    moveStep,
    setActiveStep,
    nextStep,
    previousStep,
    goToStep,
    markStepCompleted,
    markStepIncomplete,
    markStepSkipped,
    markStepUnskipped,
    updateSettings,
    resetConfig,
    isStepValid,
    canProceedToNext,
    canGoBack,
    isLastStep,
    isFirstStep,
    getTotalSteps,
    getCompletedStepsCount,
    getProgress,
    createStep,
    getStepById,
    getStepIndex,
  };
} 