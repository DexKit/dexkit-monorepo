import ViewStreamIcon from '@mui/icons-material/ViewStream';
import { Box, Button, Grid, Paper, Stack, Typography } from '@mui/material';
import { Field, FieldArray, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { FormattedMessage } from 'react-intl';
import SlideItem from './SlideItem';

import { DexkitApiProvider } from '@dexkit/core/providers';
import {
  CarouselFormType,
  CarouselSlide,
} from '@dexkit/ui/modules/wizard/types/section';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { myAppsApi } from 'src/services/whitelabel';
import z from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
const MediaDialog = dynamic(() => import('@dexkit/ui/components/mediaDialog'), {
  ssr: false,
});

// Define the SlideActionLink type
const SlideActionLink = z.object({
  type: z.literal('link'),
  caption: z.string().optional(),
  url: z.string().url().optional(),
});

// Define the SlideActionPage type
const SlideActionPage = z.object({
  type: z.literal('page'),
  caption: z.string().optional(),
  page: z.string().optional(),
});

// Define the union of SlideActionLink and SlideActionPage
const SlideAction = z.union([SlideActionLink, SlideActionPage]);

// Define the main schema
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
  slides: z
    .array(
      z.object({
        title: z.string().optional(),
        overlayColor: z.string().optional(),
        overlayPercentage: z.number().optional(),
        imageUrl: z.string().min(1),
        subtitle: z.string().optional(),
        action: SlideAction.optional(), // Use the SlideAction union here
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
    <>
      <Formik
        initialValues={
          data
            ? {
                ...data,
                interval: data.interval || 5000,
                slides: data.slides || [],
                height: data.height
                  ? data.height
                  : { desktop: 500, mobile: 250 },
              }
            : {
                interval: 5000,
                slides: [],
                height: { desktop: 500, mobile: 250 },
              }
        }
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
        }) => (
          <>
            <DexkitApiProvider.Provider value={{ instance: myAppsApi }}>
              <MediaDialog
                dialogProps={{
                  open: openDialog,
                  maxWidth: 'lg',
                  fullWidth: true,
                  onClose: handleClose,
                }}
                onConfirmSelectFile={(file) =>
                  setFieldValue(`slides[${index}].imageUrl`, file.url)
                }
              />
            </DexkitApiProvider.Provider>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Field
                  label={
                    <FormattedMessage id="interval" defaultMessage="Interval" />
                  }
                  fullWidth
                  component={TextField}
                  type="number"
                  name="interval"
                  helperText={
                    <FormattedMessage
                      id="in.milliseconds"
                      defaultMessage="In milliseconds"
                    />
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Field
                      label={
                        <FormattedMessage
                          id="height.for.mobile"
                          defaultMessage="Height for mobile"
                        />
                      }
                      fullWidth
                      component={TextField}
                      type="number"
                      name="height.mobile"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      label={
                        <FormattedMessage
                          id="height.for.desktop"
                          defaultMessage="Height for desktop"
                        />
                      }
                      fullWidth
                      component={TextField}
                      type="number"
                      name="height.desktop"
                    />
                  </Grid>
                </Grid>
              </Grid>
              {values.slides.length === 0 && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 2 }}>
                    <Stack
                      sx={{ p: 2 }}
                      alignItems="center"
                      justifyContent="center"
                      spacing={2}
                    >
                      <ViewStreamIcon fontSize="large" />
                      <Box>
                        <Typography align="center" variant="h5">
                          <FormattedMessage
                            id="add.items"
                            defaultMessage="Add items"
                          />
                        </Typography>
                        <Typography
                          color="text.secondary"
                          align="center"
                          variant="body1"
                        >
                          <FormattedMessage
                            id="section.addItemsPrompt"
                            defaultMessage="Please add items to the section below."
                          />
                        </Typography>
                      </Box>
                      <FieldArray
                        name="slides"
                        render={(arrayHelpers) => (
                          <Button
                            onClick={arrayHelpers.handlePush({
                              type: 'link',
                              title: '',
                              imageUrl: '',
                              overlayColor: 'rgba(0, 0, 0, 0.5)',
                              overlayPercentage: 30,
                              textColor: 'rgba(255, 255, 255, 1)',
                              action: {
                                type: 'link',
                              },
                            } as CarouselSlide)}
                            variant="outlined"
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
              <Grid item xs={12}>
                <FieldArray
                  name="slides"
                  render={(arrayHelpers) => (
                    <Grid container spacing={2}>
                      {values.slides.map((_, index, arr) => (
                        <Grid item xs={12} key={index}>
                          <Paper sx={{ p: 2 }}>
                            <SlideItem
                              index={index}
                              onRemove={arrayHelpers.handleRemove(index)}
                              onSelectImage={handleSelectImage(index)}
                              onUp={arrayHelpers.handleSwap(index, index - 1)}
                              onDown={arrayHelpers.handleSwap(index, index + 1)}
                              disableUp={index === 0}
                              disableDown={index === arr.length - 1}
                            />
                          </Paper>
                        </Grid>
                      ))}
                      <Grid item xs={12}>
                        <Button
                          onClick={arrayHelpers.handlePush({
                            type: 'link',
                            title: '',
                            imageUrl: '',
                            overlayColor: 'rgba(0, 0, 0, 0.5)',
                            overlayPercentage: 30,
                            textColor: 'rgba(255, 255, 255, 1)',
                            action: {
                              type: 'link',
                            },
                          } as CarouselSlide)}
                          variant="outlined"
                        >
                          <FormattedMessage id="add" defaultMessage="Add" />
                        </Button>
                      </Grid>
                    </Grid>
                  )}
                />
              </Grid>
              {!disableButtons && (
                <Grid item xs={12}>
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    {onCancel && (
                      <Button onClick={onCancel}>
                        <FormattedMessage id="cancel" defaultMessage="Cancel" />
                      </Button>
                    )}

                    <Button
                      disabled={!isValid || isSubmitting}
                      variant="contained"
                      onClick={submitForm}
                    >
                      <FormattedMessage id="save" defaultMessage="Save" />
                    </Button>
                  </Stack>
                </Grid>
              )}
            </Grid>
          </>
        )}
      </Formik>
    </>
  );
}
