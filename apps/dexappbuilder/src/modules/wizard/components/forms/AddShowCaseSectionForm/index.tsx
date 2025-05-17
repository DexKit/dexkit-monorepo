import {
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Stack,
  Typography,
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

import ViewStreamIcon from '@mui/icons-material/ViewStream';

import { Select, TextField } from 'formik-mui';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';

const MediaDialog = dynamic(() => import('@dexkit/ui/components/mediaDialog'), {
  ssr: false,
});

// Define the schema for ShowCaseItemAsset
const ShowCaseItemAssetSchema = z.object({
  type: z.literal('asset'),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  chainId: z.number().int().positive().min(1), // Assuming positive integer values are required
  contractAddress: z
    .string({ required_error: 'contract address is required' })
    .min(1, { message: 'contract address is required' }),
  tokenId: z.string({ required_error: 'required' }).min(1),
});

const ShowCaseItemCollectionSchema = z.object({
  type: z.literal('collection'),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  chainId: z.number().int().positive().min(1), // Assuming positive integer values are required
  contractAddress: z
    .string({ required_error: 'contract address is required' })
    .min(1, { message: 'contract address is required' }),
});

// Define the schema for ShowCaseItemImage
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
});

// Define the combined schema using zod.union
const ShowCaseItemSchema = z.union([
  ShowCaseItemAssetSchema,
  ShowCaseItemImageSchema,
  ShowCaseItemCollectionSchema,
]);

// Schema for the items array
const FormSchema = z.object({
  alignItems: z.enum(['center', 'left', 'right']),
  itemsSpacing: z.number().min(1).max(8),
  paddingTop: z.number().min(0).max(8),
  paddingBottom: z.number().min(0).max(8),
  items: z.array(ShowCaseItemSchema).min(1),
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
              items: data.items || [],
              alignItems: data.alignItems || 'left',
              itemsSpacing: data.itemsSpacing || 2,
              paddingTop: data.paddingTop || 0,
              paddingBottom: data.paddingBottom || 0,
            }
            : {
              alignItems: 'left',
              itemsSpacing: 2,
              paddingTop: 0,
              paddingBottom: 0,
              items: [],
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
                  setFieldValue(`items[${index}].imageUrl`, file.url)
                }
              />
            </DexkitApiProvider.Provider>
            <Grid container spacing={isMobile ? 0.5 : 2}>
              <Grid item xs={12} md={6}>
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
                    size={isMobile ? "small" : "medium"}
                    sx={isMobile ? {
                      '& .MuiInputBase-root': {
                        height: '35px',
                        fontSize: '0.85rem'
                      },
                      '& .MuiSelect-select': {
                        padding: '6px 8px'
                      },
                      '& .MuiFormLabel-root': {
                        fontSize: '0.85rem'
                      }
                    } : {}}
                  >
                    <MenuItem value="left">
                      <FormattedMessage id="left" defaultMessage="Left" />
                    </MenuItem>
                    <MenuItem value="center">
                      <FormattedMessage id="center" defaultMessage="Center" />
                    </MenuItem>
                    <MenuItem value="right">
                      <FormattedMessage id="right" defaultMessage="Right" />
                    </MenuItem>
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
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
                  size={isMobile ? "small" : "medium"}
                  margin={isMobile ? "dense" : "normal"}
                  inputProps={{
                    style: isMobile ? {
                      fontSize: '0.85rem',
                      padding: '8px 6px'
                    } : {}
                  }}
                  InputLabelProps={{
                    style: isMobile ? {
                      fontSize: '0.85rem'
                    } : {}
                  }}
                  sx={isMobile ? {
                    '& .MuiInputBase-root': {
                      height: '35px',
                      padding: '0 8px'
                    }
                  } : {}}
                />
              </Grid>
              <Grid item xs={6}>
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
                  size={isMobile ? "small" : "medium"}
                  margin={isMobile ? "dense" : "normal"}
                  inputProps={{
                    style: isMobile ? {
                      fontSize: '0.85rem',
                      padding: '8px 6px'
                    } : {}
                  }}
                  InputLabelProps={{
                    style: isMobile ? {
                      fontSize: '0.85rem'
                    } : {}
                  }}
                  sx={isMobile ? {
                    '& .MuiInputBase-root': {
                      height: '35px',
                      padding: '0 8px'
                    }
                  } : {}}
                />
              </Grid>
              <Grid item xs={6}>
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
                  size={isMobile ? "small" : "medium"}
                  margin={isMobile ? "dense" : "normal"}
                  inputProps={{
                    style: isMobile ? {
                      fontSize: '0.85rem',
                      padding: '8px 6px'
                    } : {}
                  }}
                  InputLabelProps={{
                    style: isMobile ? {
                      fontSize: '0.85rem'
                    } : {}
                  }}
                  sx={isMobile ? {
                    '& .MuiInputBase-root': {
                      height: '35px',
                      padding: '0 8px'
                    }
                  } : {}}
                />
              </Grid>
              {values.items.length === 0 && (
                <Grid item xs={12}>
                  <Paper sx={{ p: isMobile ? 0.5 : 2 }}>
                    <Stack
                      sx={{ p: isMobile ? 0.5 : 2 }}
                      alignItems="center"
                      justifyContent="center"
                      spacing={isMobile ? 0.5 : 2}
                    >
                      <ViewStreamIcon fontSize={isMobile ? "medium" : "large"} />
                      <Box>
                        <Typography align="center" variant={isMobile ? "body1" : "h5"}>
                          <FormattedMessage
                            id="add.items"
                            defaultMessage="Add items"
                          />
                        </Typography>
                        <Typography
                          color="text.secondary"
                          align="center"
                          variant={isMobile ? "caption" : "body1"}
                          sx={isMobile ? { fontSize: '0.75rem' } : {}}
                        >
                          <FormattedMessage
                            id="section.addItemsPrompt"
                            defaultMessage="Please add items to the section below."
                          />
                        </Typography>
                      </Box>
                      <FieldArray
                        name="items"
                        render={(arrayHelpers) => (
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
                            size={isMobile ? "small" : "medium"}
                            sx={isMobile ? { py: 0.5 } : {}}
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
                  name="items"
                  render={(arrayHelpers) => (
                    <Grid container spacing={isMobile ? 0.5 : 2}>
                      {values.items.map((_, index, arr) => (
                        <Grid item xs={12} key={index}>
                          <ShowCaseFormItem
                            index={index}
                            onUp={arrayHelpers.handleSwap(index, index - 1)}
                            onDown={arrayHelpers.handleSwap(index, index + 1)}
                            onRemove={arrayHelpers.handleRemove(index)}
                            disableDown={index === arr.length - 1}
                            disableUp={index === 0}
                            onSelectImage={handleSelectImage(index)}
                            isMobile={isMobile}
                          />
                        </Grid>
                      ))}
                      {values.items.length > 0 && (
                        <Grid item xs={12}>
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
                            size={isMobile ? "small" : "medium"}
                            sx={isMobile ? { mt: 0.5, py: 0.5 } : {}}
                          >
                            <FormattedMessage id="add" defaultMessage="Add" />
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  )}
                />
              </Grid>
              {!disableButtons && (
                <Grid item xs={12}>
                  <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 0.5 }}>
                    {onCancel && (
                      <Button
                        onClick={onCancel}
                        size={isMobile ? "small" : "medium"}
                        sx={isMobile ? { py: 0.5 } : {}}
                      >
                        <FormattedMessage id="cancel" defaultMessage="Cancel" />
                      </Button>
                    )}

                    <Button
                      disabled={!isValid || isSubmitting}
                      variant="contained"
                      onClick={submitForm}
                      size={isMobile ? "small" : "medium"}
                      sx={isMobile ? { py: 0.5 } : {}}
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
