import { DKMDEditorInput } from '@dexkit/ui/components';
import {
  Add as AddIcon,
  ContentCopy as CopyIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  ExpandMore as ExpandMoreIcon,
  Settings as SettingsIcon,
  ViewModule as ViewModuleIcon,
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slider,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useFormik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { IconPickerField } from '../../../../components/IconPickerField';
import { MultiStepperConfigSchema } from '../schemas/stepper';
import { defaultStepItem, defaultStepperSettings, MultiStepperConfig, StepItem } from '../types/stepper';

function convertToHex(color: string): string {
  if (color.startsWith('#')) {
    return color;
  }

  if (color.startsWith('rgb')) {
    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);
      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }
  }

  return color;
}

function ColorPickerField({
  label,
  value,
  onChange,
  defaultValue = "#000000"
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  defaultValue?: string;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const hexDefaultValue = convertToHex(defaultValue);
  const hexValue = value ? convertToHex(value) : hexDefaultValue;

  return (
    <Box sx={{ mb: theme.spacing(1.5) }}>
      <Typography
        variant={isMobile ? "caption" : "body2"}
        gutterBottom
        sx={{
          fontWeight: theme.typography.fontWeightMedium,
          color: theme.palette.text.primary,
          mb: theme.spacing(1)
        }}
      >
        {label}
      </Typography>
      <Stack
        direction="row"
        spacing={theme.spacing(1.5)}
        alignItems="center"
        sx={{
          flexWrap: 'nowrap',
          width: '100%'
        }}
      >
        <Paper
          elevation={1}
          sx={{
            p: theme.spacing(0.125),
            borderRadius: theme.shape.borderRadius,
            border: `${theme.spacing(0.125)} solid ${theme.palette.divider}`,
            width: { xs: theme.spacing(4), sm: theme.spacing(4.5) },
            height: { xs: theme.spacing(4), sm: theme.spacing(4.5) },
            minWidth: { xs: theme.spacing(4), sm: theme.spacing(4.5) },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            transition: theme.transitions.create(['box-shadow', 'border-color']),
            '&:hover': {
              boxShadow: theme.shadows[2],
              borderColor: theme.palette.primary.main,
            },
          }}
        >
          <input
            type="color"
            value={hexValue}
            onChange={(e) => onChange(e.target.value)}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: theme.shape.borderRadius,
              cursor: 'pointer',
              backgroundColor: 'transparent',
            }}
          />
        </Paper>
        <TextField
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={hexDefaultValue}
          size="small"
          sx={{
            flex: 1,
            maxWidth: { xs: theme.spacing(25), sm: theme.spacing(30) },
            '& .MuiInputBase-root': {
              fontSize: theme.typography.body2.fontSize,
              height: { xs: theme.spacing(4), sm: theme.spacing(4.5) }
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: { xs: theme.typography.caption.fontSize, sm: theme.typography.body2.fontSize }
                  }}
                >
                  #
                </Typography>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
    </Box>
  );
}

interface StepperFormProps {
  initialValues: MultiStepperConfig;
  onSubmit: (values: MultiStepperConfig) => void;
  onChange?: (values: MultiStepperConfig) => void;
}

function validate(values: MultiStepperConfig) {
  try {
    MultiStepperConfigSchema.parse(values);
    return {};
  } catch (error: any) {
    const errors: Record<string, string> = {};
    if (error.errors) {
      error.errors.forEach((err: any) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
    }
    return errors;
  }
}

export const StepperForm: React.FC<StepperFormProps> = ({
  initialValues,
  onSubmit,
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [expandedStep, setExpandedStep] = useState<string | false>(false);

  const formik = useFormik<MultiStepperConfig>({
    initialValues: {
      steps: initialValues.steps.length > 0 ? initialValues.steps : [createNewStep()],
      settings: { ...defaultStepperSettings, ...initialValues.settings },
      activeStep: initialValues.activeStep || 0,
      completedSteps: initialValues.completedSteps || [],
      skippedSteps: initialValues.skippedSteps || [],
    },
    validate,
    onSubmit: (values) => {
      onSubmit(values);
    },
    enableReinitialize: true,
  });

  function createNewStep(): StepItem {
    const stepCount = formik.values.steps.length;
    return {
      ...defaultStepItem,
      id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      label: `Step ${stepCount + 1}`,
      content: 'Enter your step content here...',
    };
  }

  const addStep = useCallback(() => {
    const newStep = createNewStep();
    formik.setFieldValue('steps', [...formik.values.steps, newStep]);
  }, [formik]);

  const removeStep = useCallback((stepId: string) => {
    const updatedSteps = formik.values.steps.filter(step => step.id !== stepId);
    formik.setFieldValue('steps', updatedSteps);

    const currentActiveStep = formik.values.activeStep || 0;
    const removedStepIndex = formik.values.steps.findIndex(step => step.id === stepId);

    if (removedStepIndex !== -1) {
      if (currentActiveStep >= updatedSteps.length) {
        formik.setFieldValue('activeStep', Math.max(0, updatedSteps.length - 1));
      } else if (currentActiveStep > removedStepIndex) {
        formik.setFieldValue('activeStep', currentActiveStep - 1);
      }
    }

    const updatedCompletedSteps = (formik.values.completedSteps || []).filter(index => {
      return index < updatedSteps.length && index !== removedStepIndex;
    }).map(index => index > removedStepIndex ? index - 1 : index);

    const updatedSkippedSteps = (formik.values.skippedSteps || []).filter(index => {
      return index < updatedSteps.length && index !== removedStepIndex;
    }).map(index => index > removedStepIndex ? index - 1 : index);

    formik.setFieldValue('completedSteps', updatedCompletedSteps);
    formik.setFieldValue('skippedSteps', updatedSkippedSteps);
  }, [formik]);

  const duplicateStep = useCallback((stepId: string) => {
    const stepIndex = formik.values.steps.findIndex(step => step.id === stepId);
    if (stepIndex === -1) return;

    const originalStep = formik.values.steps[stepIndex];
    const duplicatedStep: StepItem = {
      ...originalStep,
      id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      label: `${originalStep.label} (Copy)`,
    };

    const updatedSteps = [...formik.values.steps];
    updatedSteps.splice(stepIndex + 1, 0, duplicatedStep);
    formik.setFieldValue('steps', updatedSteps);
  }, [formik]);

  const updateStep = useCallback((stepId: string, field: string, value: any) => {
    const stepIndex = formik.values.steps.findIndex(step => step.id === stepId);
    if (stepIndex === -1) return;

    formik.setFieldValue(`steps.${stepIndex}.${field}`, value);
  }, [formik]);

  useEffect(() => {
    if (onChange) {
      onChange(formik.values);
    }
  }, [formik.values, onChange]);

  const getFieldError = (fieldPath: string): string | undefined => {
    return (formik.errors as any)[fieldPath];
  };

  const renderStepsList = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          <FormattedMessage id="stepper.steps.title" defaultMessage="Steps Configuration" />
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={addStep}
          size="small"
        >
          <FormattedMessage id="stepper.steps.add" defaultMessage="Add Step" />
        </Button>
      </Box>

      {formik.values.steps.map((step, index) => (
        <Accordion
          key={step.id}
          expanded={expandedStep === step.id}
          onChange={(_, isExpanded) => setExpandedStep(isExpanded ? step.id : false)}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <DragIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography sx={{ flexGrow: 1 }}>
                {step.label || `Step ${index + 1}`}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicateStep(step.id);
                  }}
                >
                  <CopyIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeStep(step.id);
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </AccordionSummary>

          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={<FormattedMessage id="stepper.step.label" defaultMessage="Step Label" />}
                  value={step.label}
                  onChange={(e) => updateStep(step.id, 'label', e.target.value)}
                  error={Boolean(getFieldError(`steps.${index}.label`))}
                  helperText={getFieldError(`steps.${index}.label`)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={<FormattedMessage id="stepper.step.description" defaultMessage="Description (Optional)" />}
                  value={step.description || ''}
                  onChange={(e) => updateStep(step.id, 'description', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <IconPickerField
                  label={<FormattedMessage id="stepper.step.icon" defaultMessage="Custom Icon (Optional)" />}
                  value={step.icon || ''}
                  onChange={(iconName: string) => updateStep(step.id, 'icon', iconName)}
                  placeholder="Select an icon..."
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <ColorPickerField
                  label="Icon Color"
                  value={step.iconColor || ''}
                  onChange={(color) => updateStep(step.id, 'iconColor', color)}
                  defaultValue="#1976d2"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <DKMDEditorInput
                  label={<FormattedMessage id="stepper.step.content" defaultMessage="Step Content" />}
                  value={step.content || ''}
                  onChange={(value: string) => updateStep(step.id, 'content', value)}
                  error={Boolean(getFieldError(`steps.${index}.content`))}
                  errorText={getFieldError(`steps.${index}.content`)}
                  helperText={<FormattedMessage id="stepper.step.content.helper" defaultMessage="Use markdown formatting and AI assistance for rich content" />}
                  height={200}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={step.optional || false}
                          onChange={(e) => updateStep(step.id, 'optional', e.target.checked)}
                        />
                      }
                      label={<FormattedMessage id="stepper.step.optional" defaultMessage="Optional" />}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={step.disabled || false}
                          onChange={(e) => updateStep(step.id, 'disabled', e.target.checked)}
                        />
                      }
                      label={<FormattedMessage id="stepper.step.disabled" defaultMessage="Disabled" />}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={step.error || false}
                          onChange={(e) => updateStep(step.id, 'error', e.target.checked)}
                        />
                      }
                      label={<FormattedMessage id="stepper.step.error" defaultMessage="Error State" />}
                    />
                  </Box>
                </FormControl>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );

  const renderSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          <FormattedMessage id="stepper.settings.basic" defaultMessage="Basic Settings" />
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>
            <FormattedMessage id="stepper.settings.orientation" defaultMessage="Orientation" />
          </InputLabel>
          <Select
            value={formik.values.settings.orientation || 'horizontal'}
            onChange={(e) => formik.setFieldValue('settings.orientation', e.target.value)}
            label="Orientation"
          >
            <MenuItem value="horizontal">
              <FormattedMessage id="stepper.settings.orientation.horizontal" defaultMessage="Horizontal" />
            </MenuItem>
            <MenuItem value="vertical">
              <FormattedMessage id="stepper.settings.orientation.vertical" defaultMessage="Vertical" />
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>
            <FormattedMessage id="stepper.settings.variant" defaultMessage="Variant" />
          </InputLabel>
          <Select
            value={formik.values.settings.variant || 'elevation'}
            onChange={(e) => formik.setFieldValue('settings.variant', e.target.value)}
            label="Variant"
          >
            <MenuItem value="elevation">
              <FormattedMessage id="stepper.settings.variant.elevation" defaultMessage="Elevation" />
            </MenuItem>
            <MenuItem value="outlined">
              <FormattedMessage id="stepper.settings.variant.outlined" defaultMessage="Outlined" />
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Switch
              checked={formik.values.settings.linear !== false}
              onChange={(e) => formik.setFieldValue('settings.linear', e.target.checked)}
            />
          }
          label={<FormattedMessage id="stepper.settings.linear" defaultMessage="Linear Mode" />}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Switch
              checked={formik.values.settings.alternativeLabel || false}
              onChange={(e) => formik.setFieldValue('settings.alternativeLabel', e.target.checked)}
            />
          }
          label={<FormattedMessage id="stepper.settings.alternativeLabel" defaultMessage="Alternative Label" />}
        />
      </Grid>

      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" sx={{ mb: 2 }}>
          <FormattedMessage id="stepper.settings.visual" defaultMessage="Visual Settings" />
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <Typography gutterBottom>
          <FormattedMessage id="stepper.settings.elevation" defaultMessage="Elevation" />
        </Typography>
        <Slider
          value={formik.values.settings.elevation || 1}
          onChange={(_, value) => formik.setFieldValue('settings.elevation', value)}
          min={0}
          max={24}
          step={1}
          marks
          valueLabelDisplay="auto"
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="number"
          label={<FormattedMessage id="stepper.settings.borderRadius" defaultMessage="Border Radius (px)" />}
          value={formik.values.settings.borderRadius || 4}
          onChange={(e) => formik.setFieldValue('settings.borderRadius', parseInt(e.target.value) || 0)}
          inputProps={{ min: 0 }}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="number"
          label={<FormattedMessage id="stepper.settings.padding" defaultMessage="Padding (px)" />}
          value={formik.values.settings.padding || 24}
          onChange={(e) => formik.setFieldValue('settings.padding', parseInt(e.target.value) || 0)}
          inputProps={{ min: 0 }}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <Typography gutterBottom>
          <FormattedMessage id="stepper.settings.spacing" defaultMessage="Spacing" />
        </Typography>
        <Slider
          value={formik.values.settings.spacing || 2}
          onChange={(_, value) => formik.setFieldValue('settings.spacing', value)}
          min={0}
          max={10}
          step={1}
          marks
          valueLabelDisplay="auto"
        />
      </Grid>

      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" sx={{ mb: 2 }}>
          <FormattedMessage id="stepper.settings.mobile" defaultMessage="Mobile Stepper" />
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Switch
              checked={formik.values.settings.mobileStepper || false}
              onChange={(e) => formik.setFieldValue('settings.mobileStepper', e.target.checked)}
            />
          }
          label={<FormattedMessage id="stepper.settings.mobileStepper" defaultMessage="Enable Mobile Stepper" />}
        />
      </Grid>

      {formik.values.settings.mobileStepper && (
        <>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>
                <FormattedMessage id="stepper.settings.mobileVariant" defaultMessage="Mobile Variant" />
              </InputLabel>
              <Select
                value={formik.values.settings.mobileStepperVariant || 'dots'}
                onChange={(e) => formik.setFieldValue('settings.mobileStepperVariant', e.target.value)}
                label="Mobile Variant"
              >
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="dots">Dots</MenuItem>
                <MenuItem value="progress">Progress</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>
                <FormattedMessage id="stepper.settings.mobilePosition" defaultMessage="Mobile Position" />
              </InputLabel>
              <Select
                value={formik.values.settings.mobileStepperPosition || 'bottom'}
                onChange={(e) => formik.setFieldValue('settings.mobileStepperPosition', e.target.value)}
                label="Mobile Position"
              >
                <MenuItem value="bottom">Bottom</MenuItem>
                <MenuItem value="top">Top</MenuItem>
                <MenuItem value="static">Static</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </>
      )}

      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" sx={{ mb: 2 }}>
          <FormattedMessage id="stepper.settings.navigation" defaultMessage="Navigation Settings" />
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Switch
              checked={formik.values.settings.showBackButton !== false}
              onChange={(e) => formik.setFieldValue('settings.showBackButton', e.target.checked)}
            />
          }
          label={<FormattedMessage id="stepper.settings.showBackButton" defaultMessage="Show Back Button" />}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Switch
              checked={formik.values.settings.showNextButton !== false}
              onChange={(e) => formik.setFieldValue('settings.showNextButton', e.target.checked)}
            />
          }
          label={<FormattedMessage id="stepper.settings.showNextButton" defaultMessage="Show Next Button" />}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label={<FormattedMessage id="stepper.settings.backButtonText" defaultMessage="Back Button Text" />}
          value={formik.values.settings.backButtonText || 'Back'}
          onChange={(e) => formik.setFieldValue('settings.backButtonText', e.target.value)}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label={<FormattedMessage id="stepper.settings.nextButtonText" defaultMessage="Next Button Text" />}
          value={formik.values.settings.nextButtonText || 'Next'}
          onChange={(e) => formik.setFieldValue('settings.nextButtonText', e.target.value)}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label={<FormattedMessage id="stepper.settings.finishButtonText" defaultMessage="Finish Button Text" />}
          value={formik.values.settings.finishButtonText || 'Finish'}
          onChange={(e) => formik.setFieldValue('settings.finishButtonText', e.target.value)}
        />
      </Grid>

      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" sx={{ mb: 2 }}>
          <FormattedMessage id="stepper.settings.advanced" defaultMessage="Advanced Settings" />
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Switch
              checked={formik.values.settings.nonLinear || false}
              onChange={(e) => formik.setFieldValue('settings.nonLinear', e.target.checked)}
            />
          }
          label={<FormattedMessage id="stepper.settings.nonLinear" defaultMessage="Non-Linear Navigation" />}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Switch
              checked={formik.values.settings.allowStepSkipping || false}
              onChange={(e) => formik.setFieldValue('settings.allowStepSkipping', e.target.checked)}
            />
          }
          label={<FormattedMessage id="stepper.settings.allowStepSkipping" defaultMessage="Allow Step Skipping" />}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Switch
              checked={formik.values.settings.hideStepIcons || false}
              onChange={(e) => formik.setFieldValue('settings.hideStepIcons', e.target.checked)}
            />
          }
          label={<FormattedMessage id="stepper.settings.hideStepIcons" defaultMessage="Hide Step Icons" />}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Switch
              checked={formik.values.settings.unmountOnExit || false}
              onChange={(e) => formik.setFieldValue('settings.unmountOnExit', e.target.checked)}
            />
          }
          label={<FormattedMessage id="stepper.settings.unmountOnExit" defaultMessage="Unmount on Exit" />}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <IconPickerField
          label={<FormattedMessage id="stepper.settings.completedStepIcon" defaultMessage="Completed Step Icon" />}
          value={formik.values.settings.completedStepIcon || 'Check'}
          onChange={(iconName: string) => formik.setFieldValue('settings.completedStepIcon', iconName)}
          placeholder="Select completed icon..."
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <IconPickerField
          label={<FormattedMessage id="stepper.settings.errorStepIcon" defaultMessage="Error Step Icon" />}
          value={formik.values.settings.errorStepIcon || 'Warning'}
          onChange={(iconName: string) => formik.setFieldValue('settings.errorStepIcon', iconName)}
          placeholder="Select error icon..."
        />
      </Grid>
    </Grid>
  );

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Paper elevation={2} sx={{ p: 2 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 2 }}>
          <Tab icon={<ViewModuleIcon />} label={<FormattedMessage id="stepper.tab.steps" defaultMessage="Steps" />} />
          <Tab icon={<SettingsIcon />} label={<FormattedMessage id="stepper.tab.settings" defaultMessage="Settings" />} />
        </Tabs>

        {activeTab === 0 && renderStepsList()}
        {activeTab === 1 && renderSettings()}
      </Paper>

      <Button
        type="submit"
        variant="contained"
        size="large"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        disabled={formik.isSubmitting || !formik.isValid}
      >
        <FormattedMessage id="stepper.save" defaultMessage="Save Configuration" />
      </Button>
    </Box>
  );
}; 