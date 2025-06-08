import { TokenDropPageSection } from '@dexkit/ui/modules/wizard/types/section';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, FormControl, Grid, IconButton, InputLabel, MenuItem, Typography } from '@mui/material';
import { Field, FieldArray, Formik } from 'formik';
import { Select, TextField } from 'formik-mui';
import { FormattedMessage, useIntl } from 'react-intl';

export interface DexGeneratorTokenDropFormProps {
  onChange: (section: TokenDropPageSection) => void;
  params: { network: string; address: string };
  section?: TokenDropPageSection;
}

interface ChipConfig {
  text: string;
  emoji: string;
  color: 'success' | 'primary' | 'secondary' | 'info' | 'warning' | 'error';
}

export default function DexGeneratorTokenDropForm({
  onChange,
  params,
  section,
}: DexGeneratorTokenDropFormProps) {
  const { network, address } = params;
  const { formatMessage } = useIntl();

  const defaultChips: ChipConfig[] = [
    { text: 'Smart Contract Verified', emoji: '✓', color: 'success' },
    { text: 'Secure Minting', emoji: '✓', color: 'success' },
    { text: 'DexKit Powered', emoji: '✓', color: 'success' },
  ];

  const handleSubmit = ({ variant, customTitle, customSubtitle, customChips, customChipsTitle }: {
    variant?: 'simple' | 'detailed' | 'premium';
    customTitle?: string;
    customSubtitle?: string;
    customChips?: ChipConfig[];
    customChipsTitle?: string;
  }): void => { };

  const handleValidate = ({ variant, customTitle, customSubtitle, customChips, customChipsTitle }: {
    variant?: 'simple' | 'detailed' | 'premium';
    customTitle?: string;
    customSubtitle?: string;
    customChips?: ChipConfig[];
    customChipsTitle?: string;
  }) => {
    onChange({
      type: 'token-drop',
      settings: {
        address,
        network,
        variant,
        customTitle,
        customSubtitle,
        customChips: customChips || defaultChips,
        customChipsTitle
      }
    });
  };

  const colorOptions = [
    { value: 'success', label: 'Green' },
    { value: 'primary', label: 'Primary' },
    { value: 'secondary', label: 'Secondary' },
    { value: 'info', label: 'Blue' },
    { value: 'warning', label: 'Orange' },
    { value: 'error', label: 'Red' },
  ];

  return (
    <Formik
      initialValues={
        section ? {
          variant: section.settings.variant,
          customTitle: section.settings.customTitle || '',
          customSubtitle: section.settings.customSubtitle || '',
          customChips: section.settings.customChips || defaultChips,
          customChipsTitle: section.settings.customChipsTitle || ''
        } : {
          variant: 'simple',
          customTitle: '',
          customSubtitle: '',
          customChips: defaultChips,
          customChipsTitle: ''
        }
      }
      onSubmit={handleSubmit}
      validate={handleValidate}
    >
      {({ submitForm, isValid, isSubmitting, values }) => (
        <Grid container spacing={2} sx={{ pt: 2 }}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink>
                <FormattedMessage id="variant" defaultMessage="Variant" />
              </InputLabel>
              <Field
                label={
                  <FormattedMessage id="variant" defaultMessage="Variant" />
                }
                component={Select}
                name="variant"
                fullWidth
              >
                <MenuItem value="simple">
                  <FormattedMessage id="simple" defaultMessage="Simple" />
                </MenuItem>
                <MenuItem value="detailed">
                  <FormattedMessage id="detailed" defaultMessage="Detailed" />
                </MenuItem>
                <MenuItem value="premium">
                  <FormattedMessage id="premium" defaultMessage="Premium" />
                </MenuItem>
              </Field>
            </FormControl>
          </Grid>
          {values.variant === 'premium' && (
            <>
              <Grid item xs={12}>
                <Field
                  component={TextField}
                  name="customTitle"
                  label={
                    <FormattedMessage
                      id="custom.title"
                      defaultMessage="Custom Title"
                    />
                  }
                  placeholder={formatMessage({
                    id: "custom.title.placeholder",
                    defaultMessage: "e.g., Claim Your Rewards"
                  })}
                  fullWidth
                  helperText={
                    <FormattedMessage
                      id="custom.title.helper"
                      defaultMessage="Enter a custom title for your token claim page. Leave empty to use the default title."
                    />
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  component={TextField}
                  name="customSubtitle"
                  label={
                    <FormattedMessage
                      id="custom.subtitle"
                      defaultMessage="Custom Subtitle"
                    />
                  }
                  placeholder={formatMessage({
                    id: "custom.subtitle.placeholder",
                    defaultMessage: "e.g., Get your exclusive tokens from our latest drop"
                  })}
                  fullWidth
                  helperText={
                    <FormattedMessage
                      id="custom.subtitle.helper"
                      defaultMessage="Enter a custom subtitle to describe your token drop. Leave empty to use the contract name."
                    />
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  <FormattedMessage
                    id="custom.chips"
                    defaultMessage="Custom Chips"
                  />
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <FormattedMessage
                    id="custom.chips.helper"
                    defaultMessage="Customize the feature chips displayed on your token drop page."
                  />
                </Typography>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12}>
                    <Field
                      component={TextField}
                      name="customChipsTitle"
                      label={
                        <FormattedMessage
                          id="chips.section.title"
                          defaultMessage="Chips Section Title"
                        />
                      }
                      placeholder={formatMessage({
                        id: "chips.section.title.placeholder",
                        defaultMessage: "e.g., Security Features"
                      })}
                      fullWidth
                      helperText={
                        <FormattedMessage
                          id="chips.section.title.helper"
                          defaultMessage="Enter a custom title for the chips section. Leave empty to use 'Security Features'."
                        />
                      }
                    />
                  </Grid>
                </Grid>

                <FieldArray name="customChips">
                  {({ push, remove }) => (
                    <Box>
                      {(values.customChips || []).map((chip, index) => (
                        <Grid container spacing={2} key={index} sx={{ mb: 2, alignItems: 'center' }}>
                          <Grid item xs={12} sm={2}>
                            <Field
                              component={TextField}
                              name={`customChips.${index}.emoji`}
                              label={
                                <FormattedMessage
                                  id="emoji"
                                  defaultMessage="Emoji"
                                />
                              }
                              placeholder="✓"
                              fullWidth
                              inputProps={{ maxLength: 2 }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={5}>
                            <Field
                              component={TextField}
                              name={`customChips.${index}.text`}
                              label={
                                <FormattedMessage
                                  id="chip.text"
                                  defaultMessage="Chip Text"
                                />
                              }
                              placeholder={formatMessage({
                                id: "chip.text.placeholder",
                                defaultMessage: "e.g., Smart Contract Verified"
                              })}
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Field name={`customChips.${index}.color`}>
                              {({ field }: { field: any }) => (
                                <FormControl fullWidth>
                                  <InputLabel shrink={!!field.value}>
                                    <FormattedMessage id="color" defaultMessage="Color" />
                                  </InputLabel>
                                  <Field
                                    component={Select}
                                    {...field}
                                    label={
                                      <FormattedMessage id="color" defaultMessage="Color" />
                                    }
                                    displayEmpty
                                    fullWidth
                                    renderValue={(value: string) => {
                                      const option = colorOptions.find(opt => opt.value === value);
                                      return option ? option.label : '';
                                    }}
                                  >
                                    {colorOptions.map((option) => (
                                      <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                      </MenuItem>
                                    ))}
                                  </Field>
                                </FormControl>
                              )}
                            </Field>
                          </Grid>
                          <Grid item xs={12} sm={1}>
                            <IconButton
                              onClick={() => remove(index)}
                              color="error"
                              disabled={(values.customChips || []).length <= 1}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      ))}

                      <Box sx={{ mt: 2 }}>
                        <IconButton
                          onClick={() => push({ text: '', emoji: '✓', color: 'success' })}
                          color="primary"
                          disabled={(values.customChips || []).length >= 6}
                        >
                          <AddIcon />
                        </IconButton>
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                          <FormattedMessage
                            id="add.chip"
                            defaultMessage="Add Chip (max 6)"
                          />
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </FieldArray>
              </Grid>
            </>
          )}
        </Grid>
      )}
    </Formik>
  );
}
