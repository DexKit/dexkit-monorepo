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
  Typography
} from '@mui/material';
import { useFormik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { IconPickerField } from 'src/components/IconPickerField';
import { MultiAccordionConfigSchema } from '../schemas/accordion';
import { AccordionItem, defaultAccordionItem, defaultAccordionSettings, MultiAccordionConfig } from '../types/accordion';

interface AccordionFormProps {
  initialValues: MultiAccordionConfig;
  onSubmit: (values: MultiAccordionConfig) => void;
  onChange?: (values: MultiAccordionConfig) => void;
}

const validate = (values: MultiAccordionConfig) => {
  try {
    MultiAccordionConfigSchema.parse(values);
    return {};
  } catch (error: any) {
    const errors: any = {};
    if (error.errors) {
      error.errors.forEach((err: any) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
    }
    return errors;
  }
};

export const AccordionForm: React.FC<AccordionFormProps> = ({
  initialValues,
  onSubmit,
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(false);

  const formik = useFormik<MultiAccordionConfig>({
    initialValues: {
      accordions: initialValues.accordions.length > 0 ? initialValues.accordions : [createNewAccordion()],
      settings: { ...defaultAccordionSettings, ...initialValues.settings },
    },
    validate,
    onSubmit: (values) => {
      onSubmit(values);
    },
    enableReinitialize: true,
  });

  function createNewAccordion(): AccordionItem {
    const accordionCount = formik.values.accordions.length;
    return {
      ...defaultAccordionItem,
      id: `accordion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: `Accordion ${accordionCount + 1}`,
      content: 'Enter your content here...',
    };
  }

  const addAccordion = useCallback(() => {
    const newAccordion = createNewAccordion();
    formik.setFieldValue('accordions', [...formik.values.accordions, newAccordion]);
  }, [formik]);

  const removeAccordion = useCallback((accordionId: string) => {
    const updatedAccordions = formik.values.accordions.filter(acc => acc.id !== accordionId);
    formik.setFieldValue('accordions', updatedAccordions);

    const updatedDefaultExpanded = formik.values.settings.defaultExpanded?.filter(id => id !== accordionId) || [];
    const updatedExpandedIds = formik.values.settings.expandedIds?.filter(id => id !== accordionId) || [];

    formik.setFieldValue('settings.defaultExpanded', updatedDefaultExpanded);
    formik.setFieldValue('settings.expandedIds', updatedExpandedIds);
  }, [formik]);

  const duplicateAccordion = useCallback((accordionId: string) => {
    const accordion = formik.values.accordions.find(acc => acc.id === accordionId);
    if (accordion) {
      const duplicatedAccordion: AccordionItem = {
        ...accordion,
        id: `accordion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: `${accordion.title} (Copy)`,
      };
      formik.setFieldValue('accordions', [...formik.values.accordions, duplicatedAccordion]);
    }
  }, [formik]);

  const updateAccordion = useCallback((accordionId: string, field: string, value: any) => {
    const accordionIndex = formik.values.accordions.findIndex(acc => acc.id === accordionId);
    if (accordionIndex !== -1) {
      formik.setFieldValue(`accordions.${accordionIndex}.${field}`, value);
    }
  }, [formik]);

  const handleAccordionActionChange = useCallback((accordionId: string, actionIndex: number, field: string, value: any) => {
    const accordionIndex = formik.values.accordions.findIndex(acc => acc.id === accordionId);
    if (accordionIndex !== -1) {
      formik.setFieldValue(`accordions.${accordionIndex}.actions.${actionIndex}.${field}`, value);
    }
  }, [formik]);

  const addAccordionAction = useCallback((accordionId: string) => {
    const accordionIndex = formik.values.accordions.findIndex(acc => acc.id === accordionId);
    if (accordionIndex !== -1) {
      const currentActions = formik.values.accordions[accordionIndex].actions || [];
      const newAction = { label: '', href: '', variant: 'text' as const };
      formik.setFieldValue(`accordions.${accordionIndex}.actions`, [...currentActions, newAction]);
    }
  }, [formik]);

  const removeAccordionAction = useCallback((accordionId: string, actionIndex: number) => {
    const accordionIndex = formik.values.accordions.findIndex(acc => acc.id === accordionId);
    if (accordionIndex !== -1) {
      const currentActions = formik.values.accordions[accordionIndex].actions || [];
      const updatedActions = currentActions.filter((_, index) => index !== actionIndex);
      formik.setFieldValue(`accordions.${accordionIndex}.actions`, updatedActions);
    }
  }, [formik]);

  useEffect(() => {
    if (onChange) {
      onChange(formik.values);
    }
  }, [formik.values, onChange]);

  const renderAccordionsList = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          <FormattedMessage id="accordion.manage.title" defaultMessage="Manage Accordions" />
        </Typography>
        <Button
          onClick={addAccordion}
          variant="contained"
          startIcon={<AddIcon />}
          size="small"
        >
          <FormattedMessage id="accordion.add" defaultMessage="Add Accordion" />
        </Button>
      </Box>

      {formik.values.accordions.map((accordion, index) => (
        <Accordion
          key={accordion.id}
          expanded={expandedAccordion === accordion.id}
          onChange={(_, isExpanded) => setExpandedAccordion(isExpanded ? accordion.id : false)}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <DragIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography sx={{ flexGrow: 1 }}>
                {accordion.title || `Accordion ${index + 1}`}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicateAccordion(accordion.id);
                  }}
                >
                  <CopyIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeAccordion(accordion.id);
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
                  label={<FormattedMessage id="accordion.title" defaultMessage="Title" />}
                  value={accordion.title}
                  onChange={(e) => updateAccordion(accordion.id, 'title', e.target.value)}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={<FormattedMessage id="accordion.summary" defaultMessage="Summary" />}
                  value={accordion.summary || ''}
                  onChange={(e) => updateAccordion(accordion.id, 'summary', e.target.value)}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <DKMDEditorInput
                  label={<FormattedMessage id="accordion.content" defaultMessage="Content" />}
                  value={accordion.content || ''}
                  onChange={(value: string) => updateAccordion(accordion.id, 'content', value)}
                  helperText={<FormattedMessage id="accordion.content.helper" defaultMessage="Use markdown formatting and AI assistance for rich content" />}
                  height={200}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>
                    <FormattedMessage id="accordion.title.variant" defaultMessage="Title Variant" />
                  </InputLabel>
                  <Select
                    value={accordion.titleVariant || 'h6'}
                    onChange={(e) => updateAccordion(accordion.id, 'titleVariant', e.target.value)}
                    label="Title Variant"
                  >
                    {['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2', 'body1', 'body2'].map((variant) => (
                      <MenuItem key={variant} value={variant}>{variant}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>
                    <FormattedMessage id="accordion.content.variant" defaultMessage="Content Variant" />
                  </InputLabel>
                  <Select
                    value={accordion.contentVariant || 'body1'}
                    onChange={(e) => updateAccordion(accordion.id, 'contentVariant', e.target.value)}
                    label="Content Variant"
                  >
                    {['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2', 'body1', 'body2'].map((variant) => (
                      <MenuItem key={variant} value={variant}>{variant}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={accordion.disabled || false}
                      onChange={(e) => updateAccordion(accordion.id, 'disabled', e.target.checked)}
                    />
                  }
                  label={<FormattedMessage id="accordion.disabled" defaultMessage="Disabled" />}
                />
              </Grid>

              {/* Actions Section */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2">
                    <FormattedMessage id="accordion.actions" defaultMessage="Actions" />
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => addAccordionAction(accordion.id)}
                    startIcon={<AddIcon />}
                  >
                    <FormattedMessage id="accordion.add.action" defaultMessage="Add Action" />
                  </Button>
                </Box>
                {accordion.actions?.map((action, actionIndex) => (
                  <Box key={actionIndex} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2, mb: 1 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          size="small"
                          label={<FormattedMessage id="accordion.action.label" defaultMessage="Label" />}
                          value={action.label}
                          onChange={(e) => handleAccordionActionChange(accordion.id, actionIndex, 'label', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          size="small"
                          label={<FormattedMessage id="accordion.action.href" defaultMessage="URL" />}
                          value={action.href || ''}
                          onChange={(e) => handleAccordionActionChange(accordion.id, actionIndex, 'href', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>
                            <FormattedMessage id="accordion.action.variant" defaultMessage="Variant" />
                          </InputLabel>
                          <Select
                            value={action.variant || 'text'}
                            onChange={(e) => handleAccordionActionChange(accordion.id, actionIndex, 'variant', e.target.value)}
                            label="Variant"
                          >
                            <MenuItem value="text">Text</MenuItem>
                            <MenuItem value="outlined">Outlined</MenuItem>
                            <MenuItem value="contained">Contained</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={1}>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => removeAccordionAction(accordion.id, actionIndex)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );

  const renderSettings = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        <FormattedMessage id="accordion.settings.title" defaultMessage="Accordion Settings" />
      </Typography>

      <Grid container spacing={3}>
        {/* Basic Settings */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            <FormattedMessage id="accordion.settings.basic" defaultMessage="Basic Settings" />
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>
              <FormattedMessage id="accordion.settings.variant" defaultMessage="Variant" />
            </InputLabel>
            <Select
              value={formik.values.settings.variant || 'elevation'}
              onChange={(e) => formik.setFieldValue('settings.variant', e.target.value)}
              label="Variant"
            >
              <MenuItem value="elevation">Elevation</MenuItem>
              <MenuItem value="outlined">Outlined</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>
              <FormattedMessage id="accordion.settings.heading" defaultMessage="Heading Component" />
            </InputLabel>
            <Select
              value={formik.values.settings.headingComponent || 'h3'}
              onChange={(e) => formik.setFieldValue('settings.headingComponent', e.target.value)}
              label="Heading Component"
            >
              {['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div'].map((heading) => (
                <MenuItem key={heading} value={heading}>{heading}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.settings.allowMultiple || false}
                  onChange={(e) => formik.setFieldValue('settings.allowMultiple', e.target.checked)}
                />
              }
              label={<FormattedMessage id="accordion.settings.allow.multiple" defaultMessage="Allow Multiple Expanded" />}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.settings.square || false}
                  onChange={(e) => formik.setFieldValue('settings.square', e.target.checked)}
                />
              }
              label={<FormattedMessage id="accordion.settings.square" defaultMessage="Square Corners" />}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.settings.disableGutters || false}
                  onChange={(e) => formik.setFieldValue('settings.disableGutters', e.target.checked)}
                />
              }
              label={<FormattedMessage id="accordion.settings.disable.gutters" defaultMessage="Disable Gutters" />}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.settings.unmountOnExit || false}
                  onChange={(e) => formik.setFieldValue('settings.unmountOnExit', e.target.checked)}
                />
              }
              label={<FormattedMessage id="accordion.settings.unmount.on.exit" defaultMessage="Unmount on Exit" />}
            />
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            <FormattedMessage id="accordion.settings.appearance" defaultMessage="Appearance" />
          </Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography gutterBottom>
            <FormattedMessage id="accordion.settings.spacing" defaultMessage="Spacing" />
          </Typography>
          <Slider
            value={formik.values.settings.spacing || 1}
            onChange={(_, value) => formik.setFieldValue('settings.spacing', value)}
            min={0}
            max={5}
            step={0.5}
            marks
            valueLabelDisplay="auto"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography gutterBottom>
            <FormattedMessage id="accordion.settings.elevation" defaultMessage="Elevation" />
          </Typography>
          <Slider
            value={formik.values.settings.elevation || 1}
            onChange={(_, value) => formik.setFieldValue('settings.elevation', value)}
            min={0}
            max={24}
            marks
            valueLabelDisplay="auto"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            type="number"
            label={<FormattedMessage id="accordion.settings.border.radius" defaultMessage="Border Radius (px)" />}
            value={formik.values.settings.borderRadius || 4}
            onChange={(e) => formik.setFieldValue('settings.borderRadius', parseInt(e.target.value) || 0)}
            inputProps={{ min: 0 }}
          />
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            <FormattedMessage id="accordion.settings.icons" defaultMessage="Icon Settings" />
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>
              <FormattedMessage id="accordion.settings.icon.position" defaultMessage="Icon Position" />
            </InputLabel>
            <Select
              value={formik.values.settings.iconPosition || 'end'}
              onChange={(e) => formik.setFieldValue('settings.iconPosition', e.target.value)}
              label="Icon Position"
            >
              <MenuItem value="start">Start</MenuItem>
              <MenuItem value="end">End</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <IconPickerField
            label={<FormattedMessage id="accordion.settings.expand.icon" defaultMessage="Expand Icon" />}
            value={formik.values.settings.defaultExpandIcon || 'ExpandMore'}
            onChange={(iconName: string) => formik.setFieldValue('settings.defaultExpandIcon', iconName)}
            placeholder="Select expand icon..."
            helperText={<FormattedMessage id="accordion.icon.helper" defaultMessage="Choose from Material UI icons" />}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={formik.values.settings.hideExpandIcon || false}
                onChange={(e) => formik.setFieldValue('settings.hideExpandIcon', e.target.checked)}
              />
            }
            label={<FormattedMessage id="accordion.settings.hide.expand.icon" defaultMessage="Hide Expand Icon" />}
          />
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            <FormattedMessage id="accordion.settings.actions" defaultMessage="Actions Settings" />
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>
              <FormattedMessage id="accordion.settings.actions.placement" defaultMessage="Actions Placement" />
            </InputLabel>
            <Select
              value={formik.values.settings.actionsPlacement || 'details'}
              onChange={(e) => formik.setFieldValue('settings.actionsPlacement', e.target.value)}
              label="Actions Placement"
            >
              <MenuItem value="summary">Summary</MenuItem>
              <MenuItem value="details">Details</MenuItem>
              <MenuItem value="both">Both</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>
              <FormattedMessage id="accordion.settings.actions.alignment" defaultMessage="Actions Alignment" />
            </InputLabel>
            <Select
              value={formik.values.settings.actionsAlignment || 'left'}
              onChange={(e) => formik.setFieldValue('settings.actionsAlignment', e.target.value)}
              label="Actions Alignment"
            >
              <MenuItem value="left">Left</MenuItem>
              <MenuItem value="center">Center</MenuItem>
              <MenuItem value="right">Right</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Paper elevation={2} sx={{ p: 2 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 2 }}>
          <Tab icon={<ViewModuleIcon />} label={<FormattedMessage id="accordion.tab.accordions" defaultMessage="Accordions" />} />
          <Tab icon={<SettingsIcon />} label={<FormattedMessage id="accordion.tab.settings" defaultMessage="Settings" />} />
        </Tabs>

        {activeTab === 0 && renderAccordionsList()}
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
        <FormattedMessage id="accordion.save" defaultMessage="Save Configuration" />
      </Button>
    </Box>
  );
}; 