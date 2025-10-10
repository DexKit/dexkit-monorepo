import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  MenuItem,
  Paper,
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
  ShowCaseItem,
  ShowCaseParams,
} from '@dexkit/ui/modules/wizard/types/section';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { myAppsApi } from 'src/services/whitelabel';
import ShowCaseFormItem from './ShowCaseFormItem';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ViewStreamIcon from '@mui/icons-material/ViewStream';

import { Slider } from '@mui/material';
import { Select, TextField } from 'formik-mui';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';

const MediaDialog = dynamic(() => import('@dexkit/ui/components/mediaDialog'), {
  ssr: false,
});

const ShowCaseItemAssetSchema = z.object({
  type: z.literal('asset'),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  chainId: z.number().int().positive().min(1),
  contractAddress: z
    .string({ required_error: 'contract address is required' })
    .min(1, { message: 'contract address is required' }),
  tokenId: z.string({ required_error: 'required' }).min(1),
});

const ShowCaseItemCollectionSchema = z.object({
  type: z.literal('collection'),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  chainId: z.number().int().positive().min(1),
  contractAddress: z
    .string({ required_error: 'contract address is required' })
    .min(1, { message: 'contract address is required' }),
});

const ShowCaseItemImageSchema = z.object({
  type: z.literal('image'),
  title: z.string().optional(),
  imageUrl: z
    .string({ required_error: 'imageUrl' })
    .min(1)
    .url({ message: 'invalid' }),
  subtitle: z.string().optional(),
  actionType: z.string(),
  page: z.string().optional(),
  url: z
    .string({ required_error: 'Required' })
    .url({ message: 'invalid' })
    .optional(),
  customImageScaling: z.enum(['cover', 'contain', 'fill', 'center', 'mosaic', 'expanded']).optional(),
  customImagePosition: z.enum(['center', 'top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right']).optional(),
  customHoverEffect: z.enum(['none', 'zoom', 'lift', 'glow', 'fade', 'slide', 'rotate', 'scale']).optional(),
  customCardStyle: z.enum(['default', 'minimal', 'elevated', 'bordered', 'glassmorphism']).optional(),
  customBorderRadius: z.number().min(0).max(50).optional(),
  customShadowIntensity: z.enum(['none', 'low', 'medium', 'high']).optional(),
  customOverlayColor: z.string().optional(),
  customOverlayOpacity: z.number().min(0).max(1).optional(),
  priority: z.enum(['low', 'normal', 'high']).optional(),
});

const ShowCaseItemSchema = z.union([
  ShowCaseItemAssetSchema,
  ShowCaseItemImageSchema,
  ShowCaseItemCollectionSchema,
]);

const FormSchema = z.object({
  alignItems: z.enum(['center', 'left', 'right']),
  itemsSpacing: z.number().min(1).max(8),
  paddingTop: z.number().min(0).max(8),
  paddingBottom: z.number().min(0).max(8),
  items: z.array(ShowCaseItemSchema).min(1),
  layout: z.enum(['grid', 'masonry', 'carousel', 'list']).optional(),
  columns: z.object({
    desktop: z.number().min(1).max(6),
    tablet: z.number().min(1).max(4),
    mobile: z.number().min(1).max(3),
  }).optional(),
  showOverlay: z.boolean().optional(),
  textOverlay: z.boolean().optional(),
  textOverlayPosition: z.enum(['top', 'center', 'bottom', 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'left', 'right']).optional(),
  textOverlayBackground: z.enum(['none', 'solid', 'gradient', 'blur']).optional(),
  textOverlayBackgroundColor: z.string().optional(),
  textOverlayTextColor: z.string().optional(),
  textOverlayBorderRadius: z.number().min(0).max(10).optional(),
});

export interface AddShowCaseSectionFormProps {
  data?: ShowCaseParams;
  onCancel?: () => void;
  onChange: (data: ShowCaseParams) => void;
  onSave: (data: ShowCaseParams) => void;
  saveOnChange?: boolean;
  disableButtons?: boolean;
}

export default function AddShowCaseSectionForm({
  data,
  onChange,
  onSave,
  onCancel,
  saveOnChange,
  disableButtons,
}: AddShowCaseSectionFormProps) {
  const handleSubmit = (values: ShowCaseParams) => {
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
      <Box sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
        <Formik
          initialValues={
            data
              ? {
                ...data,
                items: data.items || [],
                alignItems: data.alignItems || 'left',
                itemsSpacing: data.itemsSpacing || 2,
                paddingTop: data.paddingTop || 0,
                paddingBottom: data.paddingBottom || 0,
                layout: data.layout || 'grid',
                columns: data.columns || { desktop: 4, tablet: 3, mobile: 2 },
                showOverlay: data.showOverlay || false,
                textOverlay: data.textOverlay || false,
                textOverlayPosition: data.textOverlayPosition || 'bottom',
                textOverlayBackground: data.textOverlayBackground || 'none',
                textOverlayBackgroundColor: data.textOverlayBackgroundColor || '#000000',
                textOverlayTextColor: data.textOverlayTextColor || '#ffffff',
                textOverlayBorderRadius: data.textOverlayBorderRadius || 2,
              }
              : {
                alignItems: 'left',
                itemsSpacing: 2,
                paddingTop: 0,
                paddingBottom: 0,
                items: [],
                layout: 'grid',
                columns: { desktop: 4, tablet: 3, mobile: 2 },
                showOverlay: false,
                textOverlay: false,
                textOverlayPosition: 'bottom',
                textOverlayBackground: 'none',
                textOverlayBackgroundColor: '#000000',
                textOverlayTextColor: '#ffffff',
                textOverlayBorderRadius: 2,
              }
          }
          onSubmit={handleSubmit}
          validate={(values: ShowCaseParams) => {
            if (saveOnChange) {
              onChange(values);
            }
          }}
          validateOnBlur
          validateOnChange
          validationSchema={toFormikValidationSchema(FormSchema)}
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
                    setFieldValue(`items[${index}].imageUrl`, file.url)
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
                            <FormControl fullWidth>
                              <Field
                                component={Select}
                                name="alignItems"
                                fullWidth
                                label={
                                  <FormattedMessage
                                    id="align.items"
                                    defaultMessage="Align Items"
                                  />
                                }
                                size="medium"
                                sx={{
                                  '& .MuiInputBase-root': {
                                    height: 56,
                                  },
                                  '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(255, 255, 255, 0.23)',
                                  },
                                }}
                              >
                                <MenuItem value="left">
                                  <FormattedMessage id="left" defaultMessage="Left" />
                                </MenuItem>
                                <MenuItem value="center">
                                  <FormattedMessage
                                    id="center"
                                    defaultMessage="Center"
                                  />
                                </MenuItem>
                                <MenuItem value="right">
                                  <FormattedMessage id="right" defaultMessage="Right" />
                                </MenuItem>
                              </Field>
                            </FormControl>
                          </Grid>
                          <Grid
                            size={{
                              xs: 12,
                              md: 6
                            }}>
                            <Field
                              component={TextField}
                              fullWidth
                              name="itemsSpacing"
                              type="number"
                              label={
                                <FormattedMessage
                                  id="items.spacing"
                                  defaultMessage="Items spacing"
                                />
                              }
                              size="medium"
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
                          <FormattedMessage id="layout.configuration" defaultMessage="Layout Configuration" />
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={2}>
                          <Grid
                            size={{
                              xs: 12,
                              md: 6
                            }}>
                            <FormControl fullWidth>
                              <Field
                                component={Select}
                                name="layout"
                                fullWidth
                                label={
                                  <FormattedMessage
                                    id="layout.type"
                                    defaultMessage="Layout Type"
                                  />
                                }
                                size="medium"
                                sx={{
                                  '& .MuiInputBase-root': {
                                    height: 56,
                                  },
                                  '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(255, 255, 255, 0.23)',
                                  },
                                }}
                              >
                                <MenuItem value="grid">
                                  <FormattedMessage id="layout.grid" defaultMessage="Grid" />
                                </MenuItem>
                                <MenuItem value="masonry">
                                  <FormattedMessage id="layout.masonry" defaultMessage="Masonry" />
                                </MenuItem>
                                <MenuItem value="carousel">
                                  <FormattedMessage id="layout.carousel" defaultMessage="Carousel" />
                                </MenuItem>
                                <MenuItem value="list">
                                  <FormattedMessage id="layout.list" defaultMessage="List" />
                                </MenuItem>
                              </Field>
                            </FormControl>
                          </Grid>

                          <Grid
                            size={{
                              xs: 12,
                              md: 6
                            }}>
                            <Field
                              component={TextField}
                              fullWidth
                              name="columns.desktop"
                              type="number"
                              label={
                                <FormattedMessage
                                  id="columns.desktop"
                                  defaultMessage="Desktop Columns"
                                />
                              }
                              size="medium"
                              inputProps={{ min: 1, max: 6 }}
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
                              name="columns.tablet"
                              type="number"
                              label={
                                <FormattedMessage
                                  id="columns.tablet"
                                  defaultMessage="Tablet Columns"
                                />
                              }
                              size="medium"
                              inputProps={{ min: 1, max: 4 }}
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
                              name="columns.mobile"
                              type="number"
                              label={
                                <FormattedMessage
                                  id="columns.mobile"
                                  defaultMessage="Mobile Columns"
                                />
                              }
                              size="medium"
                              inputProps={{ min: 1, max: 3 }}
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
                          <FormattedMessage id="overlay.configuration" defaultMessage="Overlay Configuration" />
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={2}>
                          <Grid
                            size={{
                              xs: 12,
                              md: 6
                            }}>
                            <FormControl fullWidth>
                              <Field
                                component={Switch}
                                name="showOverlay"
                                checked={values.showOverlay || false}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                  setFieldValue('showOverlay', event.target.checked);
                                }}
                                sx={{
                                  '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: theme.palette.primary.main,
                                  },
                                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: theme.palette.primary.main,
                                  },
                                }}
                              />
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                <FormattedMessage
                                  id="show.overlay"
                                  defaultMessage="Show Overlay"
                                />
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Current value: {String(values.showOverlay)}
                              </Typography>
                            </FormControl>
                          </Grid>

                          <Grid
                            size={{
                              xs: 12,
                              md: 6
                            }}>
                            <FormControl fullWidth>
                              <Field
                                component={Switch}
                                name="textOverlay"
                                checked={values.textOverlay || false}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                  setFieldValue('textOverlay', event.target.checked);
                                }}
                                sx={{
                                  '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: theme.palette.primary.main,
                                  },
                                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: theme.palette.primary.main,
                                  },
                                }}
                              />
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                <FormattedMessage
                                  id="text.overlay"
                                  defaultMessage="Text Overlay"
                                />
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Current value: {String(values.textOverlay)}
                              </Typography>
                            </FormControl>
                          </Grid>

                          <Grid
                            size={{
                              xs: 12,
                              md: 6
                            }}>
                            <FormControl fullWidth>
                              <Field
                                component={Select}
                                name="textOverlayPosition"
                                fullWidth
                                label={
                                  <FormattedMessage
                                    id="text.overlay.position"
                                    defaultMessage="Text Overlay Position"
                                  />
                                }
                                size="medium"
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
                                <MenuItem value="center">
                                  <FormattedMessage id="position.center" defaultMessage="Center" />
                                </MenuItem>
                                <MenuItem value="bottom">
                                  <FormattedMessage id="position.bottom" defaultMessage="Bottom" />
                                </MenuItem>
                                <MenuItem value="top-left">
                                  <FormattedMessage id="position.top.left" defaultMessage="Top Left" />
                                </MenuItem>
                                <MenuItem value="top-right">
                                  <FormattedMessage id="position.top.right" defaultMessage="Top Right" />
                                </MenuItem>
                                <MenuItem value="bottom-left">
                                  <FormattedMessage id="position.bottom.left" defaultMessage="Bottom Left" />
                                </MenuItem>
                                <MenuItem value="bottom-right">
                                  <FormattedMessage id="position.bottom.right" defaultMessage="Bottom Right" />
                                </MenuItem>
                                <MenuItem value="left">
                                  <FormattedMessage id="position.left" defaultMessage="Left" />
                                </MenuItem>
                                <MenuItem value="right">
                                  <FormattedMessage id="position.right" defaultMessage="Right" />
                                </MenuItem>
                              </Field>
                            </FormControl>
                          </Grid>

                          <Grid
                            size={{
                              xs: 12,
                              md: 6
                            }}>
                            <FormControl fullWidth>
                              <Field
                                component={Select}
                                name="textOverlayBackground"
                                fullWidth
                                label={
                                  <FormattedMessage
                                    id="text.overlay.background"
                                    defaultMessage="Text Overlay Background"
                                  />
                                }
                                size="medium"
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
                                  <FormattedMessage id="background.none" defaultMessage="None" />
                                </MenuItem>
                                <MenuItem value="solid">
                                  <FormattedMessage id="background.solid" defaultMessage="Solid" />
                                </MenuItem>
                                <MenuItem value="gradient">
                                  <FormattedMessage id="background.gradient" defaultMessage="Gradient" />
                                </MenuItem>
                                <MenuItem value="blur">
                                  <FormattedMessage id="background.blur" defaultMessage="Blur" />
                                </MenuItem>
                              </Field>
                            </FormControl>
                          </Grid>

                          <Grid
                            size={{
                              xs: 12,
                              md: 6
                            }}>
                            <Box sx={{ px: 2 }}>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                <FormattedMessage
                                  id="text.overlay.background.color"
                                  defaultMessage="Text Overlay Background Color"
                                />
                              </Typography>
                              <Field
                                component="input"
                                type="color"
                                name="textOverlayBackgroundColor"
                                sx={{
                                  width: 56,
                                  height: 56,
                                  border: '2px solid rgba(255, 255, 255, 0.23)',
                                  borderRadius: 1,
                                  cursor: 'pointer',
                                  '&::-webkit-color-swatch-wrapper': { padding: 0 },
                                  '&::-webkit-color-swatch': { border: 'none', borderRadius: 0.5 },
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
                                  id="text.overlay.text.color"
                                  defaultMessage="Text Overlay Text Color"
                                />
                              </Typography>
                              <Field
                                component="input"
                                type="color"
                                name="textOverlayTextColor"
                                sx={{
                                  width: 56,
                                  height: 56,
                                  border: '2px solid rgba(255, 255, 255, 0.23)',
                                  borderRadius: 1,
                                  cursor: 'pointer',
                                  '&::-webkit-color-swatch-wrapper': { padding: 0 },
                                  '&::-webkit-color-swatch': { border: 'none', borderRadius: 0.5 },
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
                                  id="text.overlay.border.radius"
                                  defaultMessage="Text Overlay Border Radius"
                                />
                              </Typography>
                              <Field
                                component={Slider}
                                name="textOverlayBorderRadius"
                                value={values.textOverlayBorderRadius || 2}
                                onChange={(_: Event, newValue: number | number[]) => {
                                  setFieldValue('textOverlayBorderRadius', newValue as number);
                                }}
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
                          <FormattedMessage id="items.configuration" defaultMessage="Items Configuration" />
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {values.items.length === 0 && (
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
                                  isMobile ? theme.spacing(0.5) : theme.spacing(2)
                                }
                              >
                                <ViewStreamIcon
                                  fontSize={isMobile ? 'medium' : 'large'}
                                />
                                <Box>
                                  <Typography
                                    align="center"
                                    variant={isMobile ? 'body1' : 'h5'}
                                  >
                                    <FormattedMessage
                                      id="add.items"
                                      defaultMessage="Add items"
                                    />
                                  </Typography>
                                  <Typography
                                    color="text.secondary"
                                    align="center"
                                    variant={isMobile ? 'caption' : 'body1'}
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
                                      id="section.addItemsPrompt"
                                      defaultMessage="Please add items to the section below."
                                    />
                                  </Typography>
                                </Box>
                                <FieldArray
                                  name="items"
                                  render={(arrayHelpers: any) => (
                                    <Button
                                      onClick={arrayHelpers.handlePush({
                                        type: 'image',
                                        url: '',
                                        imageUrl: '',
                                        title: '',
                                        actionType: 'link',
                                        page: '',
                                      } as ShowCaseItem)}
                                      variant="outlined"
                                      size={isMobile ? 'small' : 'medium'}
                                      sx={isMobile ? { py: theme.spacing(0.5) } : {}}
                                    >
                                      <FormattedMessage
                                        id="add.item"
                                        defaultMessage="Add item"
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
                            name="items"
                            render={(arrayHelpers: any) => (
                              <Grid
                                container
                                spacing={
                                  isMobile ? theme.spacing(0.5) : theme.spacing(2)
                                }
                              >
                                {values.items.map((_: any, index: any, arr: any) => (
                                  <Grid key={index} size={12}>
                                    <ShowCaseFormItem
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
                                {values.items.length > 0 && (
                                  <Grid size={12}>
                                    <Button
                                      onClick={arrayHelpers.handlePush({
                                        type: 'image',
                                        url: '',
                                        imageUrl: '',
                                        title: '',
                                        actionType: 'link',
                                        page: '',
                                      } as ShowCaseItem)}
                                      variant="outlined"
                                      size={isMobile ? 'small' : 'medium'}
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
                      <Stack
                        direction="row"
                        spacing={theme.spacing(1)}
                        justifyContent="flex-end"
                        sx={{ mt: theme.spacing(0.5) }}
                      >
                        {onCancel && (
                          <Button
                            onClick={onCancel}
                            size={isMobile ? 'small' : 'medium'}
                            sx={isMobile ? { py: theme.spacing(0.5) } : {}}
                          >
                            <FormattedMessage
                              id="cancel"
                              defaultMessage="Cancel"
                            />
                          </Button>
                        )}

                        <Button
                          disabled={!isValid || isSubmitting}
                          variant="contained"
                          onClick={submitForm}
                          size={isMobile ? 'small' : 'medium'}
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
      </Box>
    </Container>
  );
}
