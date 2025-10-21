import { DKMDEditorInput } from '@dexkit/ui/components';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { FieldArray, Form, Formik } from 'formik';
import React, { useCallback, useEffect } from 'react';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { tabsFormValuesSchema } from '../schemas/tabs';
import type { TabConfig, TabsFormValues } from '../types/tabs';

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
            onChange={(e: any) => onChange(e.target.value)}
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
          onChange={(e: any) => onChange(e.target.value)}
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

interface TabsFormProps {
  initialValues: TabsFormValues;
  onSubmit: (values: TabsFormValues) => void;
  onChange?: (values: TabsFormValues) => void;
  onCancel?: () => void;
}

const getFormikError = (errors: any, field: string): string | undefined => {
  if (!errors || typeof errors !== 'object') return undefined;
  return typeof errors[field] === 'string' ? errors[field] : undefined;
};

const TabsForm = ({ initialValues, onSubmit, onChange, onCancel }: TabsFormProps) => {
  const validationSchema = toFormikValidationSchema(tabsFormValuesSchema);

  const createNewTab = useCallback((): Omit<TabConfig, 'id'> & { tempId: string } => ({
    tempId: crypto.randomUUID(),
    label: 'New Tab',
    content: 'Tab content goes here...',
    icon: '',
    iconPosition: 'top',
    disabled: false,
    wrapped: false,
  }), []);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values, errors, touched, setFieldValue, handleSubmit, handleChange }: any) => {
        // Move this outside the callback
        return <TabsFormContent
          values={values}
          errors={errors}
          touched={touched}
          setFieldValue={setFieldValue}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          createNewTab={createNewTab}
          onChange={onChange}
          onCancel={onCancel}
        />;
      }}
    </Formik>
  );
};

interface TabsFormContentProps {
  values: TabsFormValues;
  errors: any;
  touched: any;
  setFieldValue: (field: string, value: any) => void;
  handleSubmit: () => void;
  handleChange: (e: any) => void;
  createNewTab: () => Omit<TabConfig, 'id'> & { tempId: string };
  onChange?: (values: TabsFormValues) => void;
  onCancel?: () => void;
}

const TabsFormContent = ({
  values,
  errors,
  touched,
  setFieldValue,
  handleSubmit,
  handleChange,
  createNewTab,
  onChange,
  onCancel
}: TabsFormContentProps) => {
  useEffect(() => {
    if (onChange) {
      onChange(values);
    }
  }, [values, onChange]);

  return (
    <Form onSubmit={handleSubmit}>
      <Box sx={{ p: 3 }}>
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Basic Configuration
          </Typography>

          <Grid container spacing={3}>
            <Grid
              size={{
                xs: 12,
                md: 6
              }}>
              <TextField
                select
                name="orientation"
                label="Orientation"
                fullWidth
                value={values.orientation || 'horizontal'}
                onChange={handleChange}
                error={touched.orientation && !!errors.orientation}
                helperText={touched.orientation && errors.orientation}
              >
                <MenuItem value="horizontal">Horizontal</MenuItem>
                <MenuItem value="vertical">Vertical</MenuItem>
              </TextField>
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 6
              }}>
              <TextField
                select
                name="variant"
                label="Variant"
                fullWidth
                value={values.variant || 'standard'}
                onChange={handleChange}
                error={touched.variant && !!errors.variant}
                helperText={touched.variant && errors.variant}
              >
                <MenuItem value="standard">Standard</MenuItem>
                <MenuItem value="scrollable">Scrollable</MenuItem>
              </TextField>
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 6
              }}>
              <ColorPickerField
                label="Indicator Color"
                value={values.indicatorCustomColor || ''}
                onChange={(color) => setFieldValue('indicatorCustomColor', color)}
                defaultValue="#1976d2"
              />
            </Grid>


          </Grid>

          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4
                }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={values.centered || false}
                      onChange={(e: any) => setFieldValue('centered', e.target.checked)}
                    />
                  }
                  label="Centered"
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4
                }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={values.fullWidth || false}
                      onChange={(e: any) => setFieldValue('fullWidth', e.target.checked)}
                    />
                  }
                  label="Full Width"
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4
                }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={values.allowScrollButtonsMobile || false}
                      onChange={(e: any) => setFieldValue('allowScrollButtonsMobile', e.target.checked)}
                    />
                  }
                  label="Mobile Scroll Buttons"
                />
              </Grid>
            </Grid>
          </Box>

          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            Typography
          </Typography>
          <Grid container spacing={2}>
            <Grid
              size={{
                xs: 12,
                sm: 6
              }}>
              <TextField
                name="tabFontSize"
                label="Tab Font Size (px)"
                type="number"
                fullWidth
                value={values.tabFontSize || 14}
                onChange={handleChange}
                inputProps={{ min: 8, max: 24, step: 1 }}
                helperText="Font size for tab labels"
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 6
              }}>
              <TextField
                name="contentFontSize"
                label="Content Font Size (px)"
                type="number"
                fullWidth
                value={values.contentFontSize || 16}
                onChange={handleChange}
                inputProps={{ min: 10, max: 32, step: 1 }}
                helperText="Font size for tab content"
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 6
              }}>
              <ColorPickerField
                label="Tab Font Color"
                value={values.tabFontColor || ''}
                onChange={(color) => setFieldValue('tabFontColor', color)}
                defaultValue="#000000"
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 6
              }}>
              <ColorPickerField
                label="Content Font Color"
                value={values.contentFontColor || ''}
                onChange={(color) => setFieldValue('contentFontColor', color)}
                defaultValue="#000000"
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Tabs ({values.tabs.length})
            </Typography>
            <FieldArray
              name="tabs"
              render={(arrayHelpers: any) => (
                <IconButton
                  onClick={() => arrayHelpers.push(createNewTab())}
                  color="primary"
                  size="small"
                >
                  <AddIcon />
                </IconButton>
              )}
            />
          </Box>

          <FieldArray
            name="tabs"
            render={(arrayHelpers: any) => (
              <Box>
                {values.tabs.map((tab: any, index: any) => (
                  <Accordion key={tab.tempId || index} sx={{ mb: 2 }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`tab-${index}-content`}
                      id={`tab-${index}-header`}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ flex: 1 }}>
                          {tab.label || `Tab ${index + 1}`}
                        </Typography>
                        <IconButton
                          onClick={(e: any) => {
                            e.stopPropagation();
                            arrayHelpers.remove(index);
                          }}
                          size="small"
                          color="error"
                          disabled={values.tabs.length <= 1}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </AccordionSummary>

                    <AccordionDetails>
                      <Grid container spacing={3}>
                        <Grid
                          size={{
                            xs: 12,
                            md: 6
                          }}>
                          <TextField
                            name={`tabs.${index}.label`}
                            label="Tab Label"
                            fullWidth
                            value={tab.label}
                            onChange={handleChange}
                            error={!!(errors.tabs?.[index] as any)?.label && (touched.tabs?.[index] as any)?.label}
                            helperText={getFormikError((errors.tabs?.[index] as any), 'label')}
                          />
                        </Grid>

                        <Grid
                          size={{
                            xs: 12,
                            md: 6
                          }}>
                          <TextField
                            select
                            name={`tabs.${index}.iconPosition`}
                            label="Icon Position"
                            fullWidth
                            value={tab.iconPosition || 'top'}
                            onChange={handleChange}
                          >
                            <MenuItem value="top">Top</MenuItem>
                            <MenuItem value="start">Start</MenuItem>
                            <MenuItem value="end">End</MenuItem>
                            <MenuItem value="bottom">Bottom</MenuItem>
                          </TextField>
                        </Grid>

                        <Grid size={12}>
                          <DKMDEditorInput
                            label="Tab Content"
                            value={tab.content || ''}
                            onChange={(value: string) => setFieldValue(`tabs.${index}.content`, value)}
                            error={!!(errors.tabs?.[index] as any)?.content && (touched.tabs?.[index] as any)?.content}
                            errorText={getFormikError((errors.tabs?.[index] as any), 'content')}
                            helperText="Use markdown formatting and AI assistance for rich content"
                            height={200}
                          />
                        </Grid>

                        <Grid
                          size={{
                            xs: 12,
                            sm: 6
                          }}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={tab.disabled || false}
                                onChange={(e: any) => setFieldValue(`tabs.${index}.disabled`, e.target.checked)}
                              />
                            }
                            label="Disabled"
                          />
                        </Grid>

                        <Grid
                          size={{
                            xs: 12,
                            sm: 6
                          }}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={tab.wrapped || false}
                                onChange={(e: any) => setFieldValue(`tabs.${index}.wrapped`, e.target.checked)}
                              />
                            }
                            label="Wrapped Label"
                          />
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            )}
          />
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          {onCancel && (
            <Button onClick={onCancel} variant="outlined">
              Cancel
            </Button>
          )}
          <Button type="submit" variant="contained">
            Save
          </Button>
        </Box>
      </Box>
    </Form>
  );
};

export default TabsForm; 