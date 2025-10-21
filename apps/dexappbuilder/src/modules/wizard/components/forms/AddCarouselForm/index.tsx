import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Paper,
  Slider,
  Stack,
  Switch,
  Typography,
  useTheme
} from '@mui/material';
import { Field, FieldArray, Formik } from 'formik';
import { FormattedMessage } from 'react-intl';

import { useIsMobile } from '@dexkit/core';
import { DexkitApiProvider } from '@dexkit/core/providers';
import {
  CarouselFormType,
  CarouselSlide,
} from '@dexkit/ui/modules/wizard/types/section';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { myAppsApi } from 'src/services/whitelabel';
import SlideItem from './SlideItem';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';

import { TextField } from 'formik-mui';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';

const MediaDialog = dynamic(() => import('@dexkit/ui/components/mediaDialog'), {
  ssr: false,
});

const createDefaultValues = (data?: CarouselFormType) => {
  const defaults = {
    interval: 5000,
    slides: [] as CarouselSlide[],
    height: { desktop: 500, mobile: 250 },
    paddingTop: 0,
    paddingBottom: 0,
    pagination: {
      position: 'bottom' as const,
      alignment: 'center' as const,
      size: 'medium' as const,
      spacing: 2,
      activeColor: '#1976d2',
      inactiveColor: '#757575',
      activeSize: 8,
      inactiveSize: 6,
      activeOpacity: 1,
      inactiveOpacity: 0.5,
      customStyle: 'dots' as const,
      animation: 'fade' as const,
    },
    navigation: {
      show: true,
      position: 'inside' as const,
      size: 'medium' as const,
      color: '#ffffff',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      hoverColor: '#ffffff',
      hoverBackgroundColor: 'rgba(0, 0, 0, 0.7)',
      borderRadius: 50,
      opacity: 0.8,
      hoverOpacity: 1,
      showOnHover: false,
      arrowStyle: 'chevron' as const,
    },
  };

  if (data) {
    const result = {
      ...defaults,
      ...data,
      interval: data.interval || defaults.interval,
      slides: data.slides || defaults.slides,
      height: data.height || defaults.height,
      paddingTop: data.paddingTop || defaults.paddingTop,
      paddingBottom: data.paddingBottom || defaults.paddingBottom,
      pagination: {
        ...defaults.pagination,
        ...data.pagination,
      },
      navigation: {
        ...defaults.navigation,
        ...data.navigation,
        show: data.navigation?.show !== undefined ? data.navigation.show : defaults.navigation.show,
      },
    };
    return result;
  }

  return defaults;
};

const SlideActionLink = z.object({
  type: z.literal('link'),
  caption: z.string().optional(),
  url: z.string().url().optional(),
});

const SlideActionPage = z.object({
  type: z.literal('page'),
  caption: z.string().optional(),
  page: z.string().optional(),
});

const SlideAction = z.union([SlideActionLink, SlideActionPage]);

const FormSchema = z.object({
  interval: z.number().min(1).max(10000),
  textColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color')
    .optional(),
  height: z
    .object({
      mobile: z.number().min(100).max(250).optional(),
      desktop: z.number().min(250).max(500).optional(),
    })
    .optional(),
  paddingTop: z.number().min(0).max(8).optional(),
  paddingBottom: z.number().min(0).max(8).optional(),
  pagination: z.any().optional(),
  navigation: z.any().optional(),
  slides: z
    .array(
      z.object({
        title: z.string().optional(),
        overlayColor: z.string().optional(),
        overlayPercentage: z.number().optional(),
        imageUrl: z.string().min(1),
        subtitle: z.string().optional(),
        action: SlideAction.optional(),
        imageScaling: z.enum(['cover', 'contain', 'fill', 'center', 'mosaic', 'expanded']).optional(),
        imagePosition: z.enum(['center', 'top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right']).optional(),
        visualEffect: z.enum(['none', 'pulse', 'float', 'zoom', 'slide', 'rotate', 'shake', 'glow']).optional(),
        effectIntensity: z.enum(['low', 'medium', 'high']).optional(),
        effectSpeed: z.enum(['slow', 'normal', 'fast']).optional(),
        effectDirection: z.enum(['horizontal', 'vertical', 'diagonal', 'radial']).optional(),
      }),
    )
    .optional(),
});

export interface AddCarouselFormProps {
  data?: CarouselFormType;
  onChange: (data: CarouselFormType) => void;
  onCancel?: () => void;
  onSave: (data: CarouselFormType) => void;
  saveOnChange?: boolean;
  disableButtons?: boolean;
}

export default function AddCarouselForm({
  data,
  onChange,
  onCancel,
  onSave,
  saveOnChange,
  disableButtons,
}: AddCarouselFormProps) {
  const handleSubmit = (values: CarouselFormType) => {
    onSave(values);
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [index, setIndex] = useState(-1);
  const isMobile = useIsMobile();
  const theme = useTheme();

  const handleSelectImage = (index: number) => {
    return () => {
      setIndex(index);
      setOpenDialog(true);
    };
  };

  const handleClose = () => {
    setIndex(-1);
    setOpenDialog(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <>
        <Formik
          initialValues={createDefaultValues(data)}
          onSubmit={handleSubmit}
          validationSchema={toFormikValidationSchema(FormSchema)}
          validate={(values: CarouselFormType) => {
            if (saveOnChange) {
              onChange(values);
            }
          }}
          validateOnChange
        >
          {({
            submitForm,
            isValid,
            values,
            isSubmitting,
            setFieldValue,
            errors,
          }: any) => (
            <>
              <DexkitApiProvider.Provider value={{ instance: myAppsApi }}>
                <MediaDialog
                  dialogProps={{
                    open: openDialog,
                    maxWidth: 'lg',
                    fullWidth: true,
                    onClose: handleClose,
                  }}
                  onConfirmSelectFile={(file: any) =>
                    setFieldValue(`slides[${index}].imageUrl`, file.url)
                  }
                />
              </DexkitApiProvider.Provider>
              <Box sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid size={12}>
                    <Accordion defaultExpanded sx={{
                      '& .MuiAccordionSummary-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      },
                      '& .MuiAccordionDetails-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      }
                    }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">
                          <FormattedMessage id="basic.configuration" defaultMessage="Basic Configuration" />
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={2}>
                          <Grid
                            size={{
                              xs: 12,
                              md: 6
                            }}>
                            <Field
                              component={TextField}
                              fullWidth
                              name="interval"
                              type="number"
                              label={
                                <FormattedMessage
                                  id="interval"
                                  defaultMessage="Interval (ms)"
                                />
                              }
                              size="medium"
                              inputProps={{ min: 1000, max: 10000, step: 500 }}
                              sx={{
                                '& .MuiInputBase-root': {
                                  height: 56,
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'rgba(255, 255, 255, 0.23)',
                                },
                              }}
                            />
                          </Grid>
                          <Grid
                            size={{
                              xs: 12,
                              md: 6
                            }}>
                            <Field
                              component={TextField}
                              fullWidth
                              name="height.desktop"
                              type="number"
                              label={
                                <FormattedMessage
                                  id="height.desktop"
                                  defaultMessage="Desktop Height"
                                />
                              }
                              size="medium"
                              inputProps={{ min: 250, max: 500 }}
                              sx={{
                                '& .MuiInputBase-root': {
                                  height: 56,
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'rgba(255, 255, 255, 0.23)',
                                },
                              }}
                            />
                          </Grid>
                          <Grid
                            size={{
                              xs: 12,
                              md: 6
                            }}>
                            <Field
                              component={TextField}
                              fullWidth
                              name="height.mobile"
                              type="number"
                              label={
                                <FormattedMessage
                                  id="height.mobile"
                                  defaultMessage="Mobile Height"
                                />
                              }
                              size="medium"
                              inputProps={{ min: 100, max: 250 }}
                              sx={{
                                '& .MuiInputBase-root': {
                                  height: 56,
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'rgba(255, 255, 255, 0.23)',
                                },
                              }}
                            />
                          </Grid>
                          <Grid
                            size={{
                              xs: 12,
                              md: 6
                            }}>
                            <Field
                              component={TextField}
                              fullWidth
                              name="paddingTop"
                              type="number"
                              label={
                                <FormattedMessage
                                  id="padding.top"
                                  defaultMessage="Padding top"
                                />
                              }
                              size="medium"
                              inputProps={{ min: 0, max: 8 }}
                              sx={{
                                '& .MuiInputBase-root': {
                                  height: 56,
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'rgba(255, 255, 255, 0.23)',
                                },
                              }}
                            />
                          </Grid>
                          <Grid
                            size={{
                              xs: 12,
                              md: 6
                            }}>
                            <Field
                              component={TextField}
                              fullWidth
                              name="paddingBottom"
                              type="number"
                              label={
                                <FormattedMessage
                                  id="padding.bottom"
                                  defaultMessage="Padding bottom"
                                />
                              }
                              size="medium"
                              inputProps={{ min: 0, max: 8 }}
                              sx={{
                                '& .MuiInputBase-root': {
                                  height: 56,
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'rgba(255, 255, 255, 0.23)',
                                },
                              }}
                            />
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  </Grid>

                  <Grid size={12}>
                    <Accordion sx={{
                      '& .MuiAccordionSummary-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      },
                      '& .MuiAccordionDetails-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      }
                    }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">
                          <FormattedMessage id="pagination.configuration" defaultMessage="Pagination Configuration" />
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={2}>
                          <Grid
                            size={{
                              xs: 12,
                              md: 6
                            }}>
                            <Field
                              component={TextField}
                              fullWidth
                              name="pagination.position"
                              label={
                                <FormattedMessage
                                  id="pagination.position"
                                  defaultMessage="Position"
                                />
                              }
                              size="medium"
                              select
                              sx={{
                                '& .MuiInputBase-root': {
                                  height: 56,
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'rgba(255, 255, 255, 0.23)',
                                },
                              }}
                            >
                              <MenuItem value="top">
                                <FormattedMessage id="position.top" defaultMessage="Top" />
                              </MenuItem>
                              <MenuItem value="bottom">
                                <FormattedMessage id="position.bottom" defaultMessage="Bottom" />
                              </MenuItem>
                              <MenuItem value="left">
                                <FormattedMessage id="position.left" defaultMessage="Left" />
                              </MenuItem>
                              <MenuItem value="right">
                                <FormattedMessage id="position.right" defaultMessage="Right" />
                              </MenuItem>
                            </Field>
                          </Grid>
                          <Grid
                            size={{
                              xs: 12,
                              md: 6
                            }}>
                            <Field
                              component={TextField}
                              fullWidth
                              name="pagination.alignment"
                              label={
                                <FormattedMessage
                                  id="pagination.alignment"
                                  defaultMessage="Alignment"
                                />
                              }
                              size="medium"
                              select
                              sx={{
                                '& .MuiInputBase-root': {
                                  height: 56,
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'rgba(255, 255, 255, 0.23)',
                                },
                              }}
                            >
                              <MenuItem value="start">
                                <FormattedMessage id="alignment.start" defaultMessage="Start" />
                              </MenuItem>
                              <MenuItem value="center">
                                <FormattedMessage id="alignment.center" defaultMessage="Center" />
                              </MenuItem>
                              <MenuItem value="end">
                                <FormattedMessage id="alignment.end" defaultMessage="End" />
                              </MenuItem>
                            </Field>
                          </Grid>
                          <Grid
                            size={{
                              xs: 12,
                              md: 6
                            }}>
                            <Field
                              component={TextField}
                              fullWidth
                              name="pagination.customStyle"
                              label={
                                <FormattedMessage
                                  id="pagination.style"
                                  defaultMessage="Style"
                                />
                              }
                              size="medium"
                              select
                              sx={{
                                '& .MuiInputBase-root': {
                                  height: 56,
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'rgba(255, 255, 255, 0.23)',
                                },
                              }}
                            >
                              <MenuItem value="dots">
                                <FormattedMessage id="style.dots" defaultMessage="Dots" />
                              </MenuItem>
                              <MenuItem value="bars">
                                <FormattedMessage id="style.bars" defaultMessage="Bars" />
                              </MenuItem>
                              <MenuItem value="lines">
                                <FormattedMessage id="style.lines" defaultMessage="Lines" />
                              </MenuItem>
                            </Field>
                          </Grid>
                          <Grid
                            size={{
                              xs: 12,
                              md: 6
                            }}>
                            <Field
                              component={TextField}
                              fullWidth
                              name="pagination.animation"
                              label={
                                <FormattedMessage
                                  id="pagination.animation"
                                  defaultMessage="Animation"
                                />
                              }
                              size="medium"
                              select
                              sx={{
                                '& .MuiInputBase-root': {
                                  height: 56,
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'rgba(255, 255, 255, 0.23)',
                                },
                              }}
                            >
                              <MenuItem value="none">
                                <FormattedMessage id="animation.none" defaultMessage="None" />
                              </MenuItem>
                              <MenuItem value="fade">
                                <FormattedMessage id="animation.fade" defaultMessage="Fade" />
                              </MenuItem>
                              <MenuItem value="scale">
                                <FormattedMessage id="animation.scale" defaultMessage="Scale" />
                              </MenuItem>
                              <MenuItem value="slide">
                                <FormattedMessage id="animation.slide" defaultMessage="Slide" />
                              </MenuItem>
                              <MenuItem value="bounce">
                                <FormattedMessage id="animation.bounce" defaultMessage="Bounce" />
                              </MenuItem>
                            </Field>
                          </Grid>
                          <Grid
                            size={{
                              xs: 12,
                              md: 6
                            }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Field
                                component={TextField}
                                fullWidth
                                name="pagination.activeColor"
                                label={
                                  <FormattedMessage
                                    id="active.color"
                                    defaultMessage="Active Color"
                                  />
                                }
                                size="medium"
                                placeholder="#1976d2"
                                sx={{
                                  '& .MuiInputBase-root': {
                                    height: 56,
                                  },
                                  '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(255, 255, 255, 0.23)',
                                  },
                                }}
                              />
                              <Field
                                component="input"
                                type="color"
                                name="pagination.activeColor"
                                sx={{
                                  width: 56,
                                  height: 56,
                                  border: '2px solid rgba(255, 255, 255, 0.23)',
                                  borderRadius: 1,
                                  cursor: 'pointer',
                                  '&::-webkit-color-swatch-wrapper': {
                                    padding: 0,
                                  },
                                  '&::-webkit-color-swatch': {
                                    border: 'none',
                                    borderRadius: 0.5,
                                  },
                                }}
                              />
                            </Box>
                          </Grid>
                          <Grid
                            size={{
                              xs: 12,
                              md: 6
                            }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Field
                                component={TextField}
                                fullWidth
                                name="pagination.inactiveColor"
                                label={
                                  <FormattedMessage
                                    id="inactive.color"
                                    defaultMessage="Inactive Color"
                                  />
                                }
                                size="medium"
                                placeholder="#757575"
                                sx={{
                                  '& .MuiInputBase-root': {
                                    height: 56,
                                  },
                                  '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(255, 255, 255, 0.23)',
                                  },
                                }}
                              />
                              <Field
                                component="input"
                                type="color"
                                name="pagination.inactiveColor"
                                sx={{
                                  width: 56,
                                  height: 56,
                                  border: '2px solid rgba(255, 255, 255, 0.23)',
                                  borderRadius: 1,
                                  cursor: 'pointer',
                                  '&::-webkit-color-swatch-wrapper': {
                                    padding: 0,
                                  },
                                  '&::-webkit-color-swatch': {
                                    border: 'none',
                                    borderRadius: 0.5,
                                  },
                                }}
                              />
                            </Box>
                          </Grid>
                          <Grid
                            size={{
                              xs: 12,
                              md: 6
                            }}>
                            <Field
                              component={TextField}
                              fullWidth
                              name="pagination.activeSize"
                              type="number"
                              label={
                                <FormattedMessage
                                  id="active.size"
                                  defaultMessage="Active Size"
                                />
                              }
                              size="medium"
                              inputProps={{ min: 4, max: 20 }}
                              sx={{
                                '& .MuiInputBase-root': {
                                  height: 56,
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'rgba(255, 255, 255, 0.23)',
                                },
                              }}
                            />
                          </Grid>
                          <Grid
                            size={{
                              xs: 12,
                              md: 6
                            }}>
                            <Field
                              component={TextField}
                              fullWidth
                              name="pagination.inactiveSize"
                              type="number"
                              label={
                                <FormattedMessage
                                  id="inactive.size"
                                  defaultMessage="Inactive Size"
                                />
                              }
                              size="medium"
                              inputProps={{ min: 4, max: 20 }}
                              sx={{
                                '& .MuiInputBase-root': {
                                  height: 56,
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'rgba(255, 255, 255, 0.23)',
                                },
                              }}
                            />
                          </Grid>
                          <Grid
                            size={{
                              xs: 12,
                              md: 6
                            }}>
                            <Field
                              component={TextField}
                              fullWidth
                              name="pagination.spacing"
                              type="number"
                              label={
                                <FormattedMessage
                                  id="pagination.spacing"
                                  defaultMessage="Spacing"
                                />
                              }
                              size="medium"
                              inputProps={{ min: 0, max: 10 }}
                              sx={{
                                '& .MuiInputBase-root': {
                                  height: 56,
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'rgba(255, 255, 255, 0.23)',
                                },
                              }}
                            />
                          </Grid>
                          <Grid
                            size={{
                              xs: 12,
                              md: 6
                            }}>
                            <Field
                              component={TextField}
                              fullWidth
                              name="pagination.size"
                              label={
                                <FormattedMessage
                                  id="pagination.size"
                                  defaultMessage="Size"
                                />
                              }
                              size="medium"
                              select
                              sx={{
                                '& .MuiInputBase-root': {
                                  height: 56,
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'rgba(255, 255, 255, 0.23)',
                                },
                              }}
                            >
                              <MenuItem value="small">
                                <FormattedMessage id="size.small" defaultMessage="Small" />
                              </MenuItem>
                              <MenuItem value="medium">
                                <FormattedMessage id="size.medium" defaultMessage="Medium" />
                              </MenuItem>
                              <MenuItem value="large">
                                <FormattedMessage id="size.large" defaultMessage="Large" />
                              </MenuItem>
                            </Field>
                          </Grid>
                          <Grid
                            size={{
                              xs: 12,
                              md: 6
                            }}>
                            <Box sx={{ px: 2 }}>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                <FormattedMessage
                                  id="active.opacity"
                                  defaultMessage="Active Opacity"
                                />
                              </Typography>
                              <Slider
                                value={values.pagination?.activeOpacity || 1}
                                onChange={(_, newValue) => setFieldValue('pagination.activeOpacity', newValue)}
                                min={0}
                                max={1}
                                step={0.1}
                                marks={[
                                  { value: 0, label: '0' },
                                  { value: 0.5, label: '0.5' },
                                  { value: 1, label: '1' }
                                ]}
                                valueLabelDisplay="auto"
                                sx={{
                                  '& .MuiSlider-track': {
                                    backgroundColor: theme.palette.primary.main,
                                  },
                                  '& .MuiSlider-thumb': {
                                    backgroundColor: theme.palette.primary.main,
                                  },
                                }}
                              />
                            </Box>
                          </Grid>
                          <Grid
                            size={{
                              xs: 12,
                              md: 6
                            }}>
                            <Box sx={{ px: 2 }}>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                <FormattedMessage
                                  id="inactive.opacity"
                                  defaultMessage="Inactive Opacity"
                                />
                              </Typography>
                              <Slider
                                value={values.pagination?.inactiveOpacity || 0.5}
                                onChange={(_, newValue) => setFieldValue('pagination.inactiveOpacity', newValue)}
                                min={0}
                                max={1}
                                step={0.1}
                                marks={[
                                  { value: 0, label: '0' },
                                  { value: 0.5, label: '0.5' },
                                  { value: 1, label: '1' }
                                ]}
                                valueLabelDisplay="auto"
                                sx={{
                                  '& .MuiSlider-track': {
                                    backgroundColor: theme.palette.primary.main,
                                  },
                                  '& .MuiSlider-thumb': {
                                    backgroundColor: theme.palette.primary.main,
                                  },
                                }}
                              />
                            </Box>
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  </Grid>

                  <Grid size={12}>
                    <Accordion sx={{
                      '& .MuiAccordionSummary-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      },
                      '& .MuiAccordionDetails-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      }
                    }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">
                          <FormattedMessage id="navigation.configuration" defaultMessage="Navigation Configuration" />
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={2}>
                          <Grid
                            size={{
                              xs: 12,
                              md: 6
                            }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                <FormattedMessage
                                  id="show.navigation"
                                  defaultMessage="Show Navigation"
                                />
                              </Typography>
                              <Switch
                                checked={values.navigation?.show || false}
                                onChange={(e: any) => setFieldValue('navigation.show', e.target.checked)}
                                sx={{
                                  '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: theme.palette.primary.main,
                                  },
                                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: theme.palette.primary.main,
                                  },
                                }}
                              />
                            </Box>
                          </Grid>
                          <Grid
                            size={{
                              xs: 12,
                              md: 6
                            }}>
                            <Field
                              component={TextField}
                              fullWidth
                              name="navigation.position"
                              label={
                                <FormattedMessage
                                  id="navigation.position"
                                  defaultMessage="Position"
                                />
                              }
                              size="medium"
                              select
                              sx={{
                                '& .MuiInputBase-root': {
                                  height: 56,
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'rgba(255, 255, 255, 0.23)',
                                },
                              }}
                            >
                              <MenuItem value="inside">
                                <FormattedMessage id="position.inside" defaultMessage="Inside" />
                              </MenuItem>
                              <MenuItem value="outside">
                                <FormattedMessage id="position.outside" defaultMessage="Outside" />
                              </MenuItem>
                            </Field>
                          </Grid>
                          <Grid
                            size={{
                              xs: 12,
                              md: 6
                            }}>
                            <Field
                              component={TextField}
                              fullWidth
                              name="navigation.size"
                              label={
                                <FormattedMessage
                                  id="navigation.size"
                                  defaultMessage="Size"
                                />
                              }
                              size="medium"
                              select
                              sx={{
                                '& .MuiInputBase-root': {
                                  height: 56,
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'rgba(255, 255, 255, 0.23)',
                                },
                              }}
                            >
                              <MenuItem value="small">
                                <FormattedMessage id="size.small" defaultMessage="Small" />
                              </MenuItem>
                              <MenuItem value="medium">
                                <FormattedMessage id="size.medium" defaultMessage="Medium" />
                              </MenuItem>
                              <MenuItem value="large">
                                <FormattedMessage id="size.large" defaultMessage="Large" />
                              </MenuItem>
                            </Field>
                          </Grid>
                          <Grid
                            size={{
                              xs: 12,
                              md: 6
                            }}>
                            <Field
                              component={TextField}
                              fullWidth
                              name="navigation.arrowStyle"
                              label={
                                <FormattedMessage
                                  id="arrow.style"
                                  defaultMessage="Arrow Style"
                                />
                              }
                              size="medium"
                              select
                              sx={{
                                '& .MuiInputBase-root': {
                                  height: 56,
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'rgba(255, 255, 255, 0.23)',
                                },
                              }}
                            >
                              <MenuItem value="chevron">
                                <FormattedMessage id="style.chevron" defaultMessage="Chevron" />
                              </MenuItem>
                              <MenuItem value="triangle">
                                <FormattedMessage id="style.triangle" defaultMessage="Triangle" />
                              </MenuItem>
                              <MenuItem value="circle">
                                <FormattedMessage id="style.circle" defaultMessage="Circle" />
                              </MenuItem>
                              <MenuItem value="square">
                                <FormattedMessage id="style.square" defaultMessage="Square" />
                              </MenuItem>
                            </Field>
                          </Grid>
                          <Grid
                            size={{
                              xs: 12,
                              md: 6
                            }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Field
                                component={TextField}
                                fullWidth
                                name="navigation.color"
                                label={
                                  <FormattedMessage
                                    id="arrow.color"
                                    defaultMessage="Arrow Color"
                                  />
                                }
                                size="medium"
                                placeholder="#ffffff"
                                sx={{
                                  '& .MuiInputBase-root': {
                                    height: 56,
                                  },
                                  '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(255, 255, 255, 0.23)',
                                  },
                                }}
                              />
                              <Field
                                component="input"
                                type="color"
                                name="navigation.color"
                                sx={{
                                  width: 56,
                                  height: 56,
                                  border: '2px solid rgba(255, 255, 255, 0.23)',
                                  borderRadius: 1,
                                  cursor: 'pointer',
                                  '&::-webkit-color-swatch-wrapper': {
                                    padding: 0,
                                  },
                                  '&::-webkit-color-swatch': {
                                    border: 'none',
                                    borderRadius: 0.5,
                                  },
                                }}
                              />
                            </Box>
                          </Grid>
                          <Grid
                            size={{
                              xs: 12,
                              md: 6
                            }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Field
                                component={TextField}
                                fullWidth
                                name="navigation.backgroundColor"
                                label={
                                  <FormattedMessage
                                    id="arrow.background"
                                    defaultMessage="Background Color"
                                  />
                                }
                                size="medium"
                                placeholder="rgba(0,0,0,0.5)"
                                sx={{
                                  '& .MuiInputBase-root': {
                                    height: 56,
                                  },
                                  '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(255, 255, 255, 0.23)',
                                  },
                                }}
                              />
                              <Field
                                component="input"
                                type="color"
                                name="navigation.backgroundColor"
                                sx={{
                                  width: 56,
                                  height: 56,
                                  border: '2px solid rgba(255, 255, 255, 0.23)',
                                  borderRadius: 1,
                                  cursor: 'pointer',
                                  '&::-webkit-color-swatch-wrapper': {
                                    padding: 0,
                                  },
                                  '&::-webkit-color-swatch': {
                                    border: 'none',
                                    borderRadius: 0.5,
                                  },
                                }}
                              />
                            </Box>
                          </Grid>
                          <Grid
                            size={{
                              xs: 12,
                              md: 6
                            }}>
                            <Box sx={{ px: 2 }}>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                <FormattedMessage
                                  id="arrow.opacity"
                                  defaultMessage="Opacity"
                                />
                              </Typography>
                              <Slider
                                value={values.navigation?.opacity || 0.8}
                                onChange={(_, newValue) => setFieldValue('navigation.opacity', newValue)}
                                min={0}
                                max={1}
                                step={0.1}
                                marks={[
                                  { value: 0, label: '0' },
                                  { value: 0.5, label: '0.5' },
                                  { value: 1, label: '1' }
                                ]}
                                valueLabelDisplay="auto"
                                sx={{
                                  '& .MuiSlider-track': {
                                    backgroundColor: theme.palette.primary.main,
                                  },
                                  '& .MuiSlider-thumb': {
                                    backgroundColor: theme.palette.primary.main,
                                  },
                                }}
                              />
                            </Box>
                          </Grid>
                          <Grid
                            size={{
                              xs: 12,
                              md: 6
                            }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                <FormattedMessage
                                  id="show.onHover"
                                  defaultMessage="Show on Hover"
                                />
                              </Typography>
                              <Switch
                                checked={values.navigation?.showOnHover || false}
                                onChange={(e: any) => setFieldValue('navigation.showOnHover', e.target.checked)}
                                sx={{
                                  '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: theme.palette.primary.main,
                                  },
                                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: theme.palette.primary.main,
                                  },
                                }}
                              />
                            </Box>
                          </Grid>
                          <Grid
                            size={{
                              xs: 12,
                              md: 6
                            }}>
                            <Box sx={{ px: 2 }}>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                <FormattedMessage
                                  id="arrow.hoverOpacity"
                                  defaultMessage="Hover Opacity"
                                />
                              </Typography>
                              <Slider
                                value={values.navigation?.hoverOpacity || 1}
                                onChange={(_, newValue) => setFieldValue('navigation.hoverOpacity', newValue)}
                                min={0}
                                max={1}
                                step={0.1}
                                marks={[
                                  { value: 0, label: '0' },
                                  { value: 0.5, label: '0.5' },
                                  { value: 1, label: '1' }
                                ]}
                                valueLabelDisplay="auto"
                                sx={{
                                  '& .MuiSlider-track': {
                                    backgroundColor: theme.palette.primary.main,
                                  },
                                  '& .MuiSlider-thumb': {
                                    backgroundColor: theme.palette.primary.main,
                                  },
                                }}
                              />
                            </Box>
                          </Grid>
                          <Grid
                            size={{
                              xs: 12,
                              md: 6
                            }}>
                            <Box sx={{ px: 2 }}>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                <FormattedMessage
                                  id="arrow.borderRadius"
                                  defaultMessage="Border Radius"
                                />
                              </Typography>
                              <Slider
                                value={values.navigation?.borderRadius || 5}
                                onChange={(_, newValue) => setFieldValue('navigation.borderRadius', newValue)}
                                min={0}
                                max={10}
                                step={0.5}
                                marks={[
                                  { value: 0, label: '0' },
                                  { value: 2, label: '2' },
                                  { value: 4, label: '4' },
                                  { value: 6, label: '6' },
                                  { value: 8, label: '8' },
                                  { value: 10, label: '10' }
                                ]}
                                valueLabelDisplay="auto"
                                sx={{
                                  '& .MuiSlider-track': {
                                    backgroundColor: theme.palette.primary.main,
                                  },
                                  '& .MuiSlider-thumb': {
                                    backgroundColor: theme.palette.primary.main,
                                  },
                                }}
                              />
                            </Box>
                          </Grid>
                          <Grid
                            size={{
                              xs: 12,
                              md: 6
                            }}>
                            <Box sx={{ px: 2 }}>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                <FormattedMessage
                                  id="arrow.hoverBackgroundColor"
                                  defaultMessage="Hover Background Color"
                                />
                              </Typography>
                              <Field
                                component="input"
                                type="color"
                                name="navigation.hoverBackgroundColor"
                                sx={{
                                  width: 56,
                                  height: 56,
                                  border: '2px solid rgba(255, 255, 255, 0.23)',
                                  borderRadius: 1,
                                  cursor: 'pointer',
                                  '&::-webkit-color-swatch-wrapper': {
                                    padding: 0,
                                  },
                                  '&::-webkit-color-swatch': {
                                    border: 'none',
                                    borderRadius: 0.5,
                                  },
                                }}
                              />
                            </Box>
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  </Grid>

                  <Grid size={12}>
                    <Accordion sx={{
                      '& .MuiAccordionSummary-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      },
                      '& .MuiAccordionDetails-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      }
                    }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">
                          <FormattedMessage id="slides.configuration" defaultMessage="Slides Configuration" />
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {values.slides.length === 0 && (
                          <Grid size={12}>
                            <Paper
                              sx={{
                                p: isMobile ? theme.spacing(0.5) : theme.spacing(2),
                              }}
                            >
                              <Stack
                                sx={{
                                  p: isMobile ? theme.spacing(0.5) : theme.spacing(2),
                                }}
                                alignItems="center"
                                justifyContent="center"
                                spacing={
                                  isMobile ? theme.spacing(0.5) : theme.spacing(1)
                                }
                              >
                                <ViewCarouselIcon fontSize={isMobile ? "medium" : "large"} />
                                <Box>
                                  <Typography align="center" variant={isMobile ? "body1" : "h5"}>
                                    <FormattedMessage
                                      id="add.slides"
                                      defaultMessage="Add slides"
                                    />
                                  </Typography>
                                  <Typography
                                    color="text.secondary"
                                    align="center"
                                    variant={isMobile ? "caption" : "body1"}
                                    sx={
                                      isMobile
                                        ? {
                                          fontSize:
                                            theme.typography.caption.fontSize,
                                        }
                                        : {}
                                    }
                                  >
                                    <FormattedMessage
                                      id="section.addSlidesPrompt"
                                      defaultMessage="Please add slides to the carousel below."
                                    />
                                  </Typography>
                                </Box>
                                <FieldArray
                                  name="slides"
                                  render={(arrayHelpers: any) => (
                                    <Button
                                      onClick={arrayHelpers.handlePush({
                                        title: "",
                                        subtitle: "",
                                        imageUrl: "",
                                        buttonText: "",
                                        buttonUrl: "",
                                        imageScaling: "cover",
                                        imagePosition: "center",
                                        visualEffect: "none",
                                        effectIntensity: "medium",
                                        effectSpeed: "normal",
                                        effectDirection: "horizontal",
                                      } as CarouselSlide)}
                                      variant="outlined"
                                      size={isMobile ? "small" : "medium"}
                                      sx={isMobile ? { py: theme.spacing(0.5) } : {}}
                                    >
                                      <FormattedMessage
                                        id="add.slide"
                                        defaultMessage="Add slide"
                                      />
                                    </Button>
                                  )}
                                />
                              </Stack>
                            </Paper>
                          </Grid>
                        )}

                        <Grid size={12}>
                          <FieldArray
                            name="slides"
                            render={(arrayHelpers: any) => (
                              <Grid
                                container
                                spacing={
                                  isMobile ? theme.spacing(0.5) : theme.spacing(2)
                                }
                              >
                                {values.slides.map((_: any, index: any, arr: any) => (
                                  <Grid key={index} size={12}>
                                    <SlideItem
                                      index={index}
                                      onUp={arrayHelpers.handleSwap(index, index - 1)}
                                      onDown={arrayHelpers.handleSwap(
                                        index,
                                        index + 1,
                                      )}
                                      onRemove={arrayHelpers.handleRemove(index)}
                                      disableDown={index === arr.length - 1}
                                      disableUp={index === 0}
                                      onSelectImage={handleSelectImage(index)}
                                      isMobile={isMobile}
                                    />
                                  </Grid>
                                ))}
                                {values.slides.length > 0 && (
                                  <Grid size={12}>
                                    <Button
                                      onClick={arrayHelpers.handlePush({
                                        title: "",
                                        subtitle: "",
                                        imageUrl: "",
                                        buttonText: "",
                                        buttonUrl: "",
                                        imageScaling: "cover",
                                        imagePosition: "center",
                                        visualEffect: "none",
                                        effectIntensity: "medium",
                                        effectSpeed: "normal",
                                        effectDirection: "horizontal",
                                      } as CarouselSlide)}
                                      variant="outlined"
                                      size={isMobile ? "small" : "medium"}
                                      sx={
                                        isMobile
                                          ? {
                                            mt: theme.spacing(0.5),
                                            py: theme.spacing(0.5),
                                          }
                                          : {}
                                      }
                                    >
                                      <FormattedMessage
                                        id="add"
                                        defaultMessage="Add"
                                      />
                                    </Button>
                                  </Grid>
                                )}
                              </Grid>
                            )}
                          />
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  </Grid>

                  {!disableButtons && (
                    <Grid size={12}>
                      <Stack direction="row" spacing={theme.spacing(1)} justifyContent="flex-end" sx={{ mt: theme.spacing(0.5) }}>
                        {onCancel && (
                          <Button onClick={onCancel} size={isMobile ? "small" : "medium"} sx={isMobile ? { py: theme.spacing(0.5) } : {}}>
                            <FormattedMessage id="cancel" defaultMessage="Cancel" />
                          </Button>
                        )}

                        <Button
                          disabled={!isValid || isSubmitting}
                          variant="contained"
                          onClick={submitForm}
                          size={isMobile ? "small" : "medium"}
                          sx={isMobile ? { py: theme.spacing(0.5) } : {}}
                        >
                          <FormattedMessage id="save" defaultMessage="Save" />
                        </Button>
                      </Stack>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </>
          )}
        </Formik>
      </>
    </Container>
  );
}
