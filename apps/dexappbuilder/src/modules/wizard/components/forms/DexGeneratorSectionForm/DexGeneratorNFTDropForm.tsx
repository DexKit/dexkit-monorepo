import { NftDropPageSection } from '@dexkit/ui/modules/wizard/types/section';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Autocomplete, Box, FormControl, Grid, IconButton, InputLabel, MenuItem, TextField as MuiTextField, Typography } from '@mui/material';
import { Field, FieldArray, Formik } from 'formik';
import { Select, TextField } from 'formik-mui';
import { FormattedMessage, useIntl } from 'react-intl';
import Fonts from '../../../../../constants/fonts.json';

export interface DexGeneratorNFTDropFormProps {
  onChange: (section: NftDropPageSection) => void;
  params: { network: string; address: string };
  section?: NftDropPageSection;
}

interface ChipConfig {
  text: string;
  emoji: string;
  color: 'success' | 'primary' | 'secondary' | 'info' | 'warning' | 'error';
}

const preloadFont = (fontFamily: string) => {
  if (!fontFamily || fontFamily === 'inherit') return;

  const existingLink = document.querySelector(`link[href*="${fontFamily.replace(/\s+/g, '+')}"]`);
  if (existingLink) return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'style';
  link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@400&display=swap`;
  link.onload = () => {
    link.rel = 'stylesheet';
  };
  document.head.appendChild(link);
};

export default function DexGeneratorNFTDropForm({
  onChange,
  params,
  section,
}: DexGeneratorNFTDropFormProps) {
  const { network, address } = params;
  const { formatMessage } = useIntl();

  const defaultChips: ChipConfig[] = [
    { text: 'Smart Contract Verified', emoji: '✓', color: 'success' },
    { text: 'Secure Minting', emoji: '🔒', color: 'primary' },
    { text: 'Limited Supply', emoji: '⚡', color: 'warning' },
  ];

  const handleSubmit = ({ variant, customTitle, customSubtitle, customChips, customChipsTitle, customStyles }: {
    variant?: 'simple' | 'detailed' | 'premium' | 'custom';
    customTitle?: string;
    customSubtitle?: string;
    customChips?: ChipConfig[];
    customChipsTitle?: string;
    customStyles?: any;
  }): void => { };

  const handleValidate = ({ variant, customTitle, customSubtitle, customChips, customChipsTitle, customStyles }: {
    variant?: 'simple' | 'detailed' | 'premium' | 'custom';
    customTitle?: string;
    customSubtitle?: string;
    customChips?: ChipConfig[];
    customChipsTitle?: string;
    customStyles?: any;
  }) => {
    onChange({
      type: 'nft-drop',
      settings: {
        address,
        network,
        variant,
        customTitle,
        customSubtitle,
        customChips: customChips || defaultChips,
        customChipsTitle,
        customStyles
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
        section && section.type === 'nft-drop' ? {
          variant: section.settings.variant,
          customTitle: section.settings.customTitle || '',
          customSubtitle: section.settings.customSubtitle || '',
          customChips: section.settings.customChips || defaultChips,
          customChipsTitle: section.settings.customChipsTitle || '',
          customStyles: {
            backgroundColor: {
              type: 'solid',
              solid: '#ffffff',
              gradient: {
                from: '#ffffff',
                to: '#000000',
                direction: 'to-r'
              }
            },
            inputColors: {
              backgroundColor: '#ffffff',
              borderColor: '#cccccc',
              textColor: '#000000',
              focusBorderColor: '#1976d2'
            },
            buttonColors: {
              backgroundColor: '#1976d2',
              hoverBackgroundColor: '#1565c0',
              textColor: '#ffffff',
              borderColor: '#1976d2'
            },
            textColors: {
              primary: '#000000',
              secondary: '#666666',
              accent: '#1976d2'
            },
            statsColors: {
              maxTotalBackground: '#f5f5f5',
              maxTotalBorder: '#cccccc',
              availableRemainingBackground: '#4caf50',
              availableRemainingBorder: '#388e3c'
            },
            fontFamily: '',
            borderRadius: 8,
            ...section.settings.customStyles
          }
        } : {
          variant: 'simple',
          customTitle: '',
          customSubtitle: '',
          customChips: defaultChips,
          customChipsTitle: '',
          customStyles: {
            backgroundColor: {
              type: 'solid',
              solid: '#ffffff',
              gradient: {
                from: '#ffffff',
                to: '#000000',
                direction: 'to-r'
              }
            },
            inputColors: {
              backgroundColor: '#ffffff',
              borderColor: '#cccccc',
              textColor: '#000000',
              focusBorderColor: '#1976d2'
            },
            buttonColors: {
              backgroundColor: '#1976d2',
              hoverBackgroundColor: '#1565c0',
              textColor: '#ffffff',
              borderColor: '#1976d2'
            },
            textColors: {
              primary: '#000000',
              secondary: '#666666',
              accent: '#1976d2'
            },
            statsColors: {
              maxTotalBackground: '#f5f5f5',
              maxTotalBorder: '#cccccc',
              availableRemainingBackground: '#4caf50',
              availableRemainingBorder: '#388e3c'
            },
            fontFamily: '',
            borderRadius: 8
          }
        }
      }
      onSubmit={handleSubmit}
      validate={handleValidate}
    >
      {({ values }) => (
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
                <MenuItem value="custom">
                  <FormattedMessage id="custom" defaultMessage="Custom" />
                </MenuItem>
              </Field>
            </FormControl>
          </Grid>
          {values.variant === 'custom' && (
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
                    defaultMessage: "e.g., Mint Your NFT"
                  })}
                  fullWidth
                  helperText={
                    <FormattedMessage
                      id="custom.title.helper"
                      defaultMessage="Enter a custom title for your NFT drop page. Leave empty to use the default title."
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
                    defaultMessage: "e.g., Get your exclusive NFT from our latest collection"
                  })}
                  fullWidth
                  helperText={
                    <FormattedMessage
                      id="custom.subtitle.helper"
                      defaultMessage="Enter a custom subtitle to describe your NFT drop. Leave empty to use the contract name."
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
                    defaultMessage="Customize the feature chips displayed on your NFT drop page."
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
                        defaultMessage: "e.g., Collection Features"
                      })}
                      fullWidth
                      helperText={
                        <FormattedMessage
                          id="chips.section.title.helper"
                          defaultMessage="Enter a custom title for the chips section. Leave empty to use 'Collection Features'."
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

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  <FormattedMessage
                    id="visual.customization"
                    defaultMessage="Visual Customization"
                  />
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel shrink>
                    <FormattedMessage id="background.type" defaultMessage="Background Type" />
                  </InputLabel>
                  <Field
                    component={Select}
                    name="customStyles.backgroundColor.type"
                    label={
                      <FormattedMessage id="background.type" defaultMessage="Background Type" />
                    }
                    displayEmpty
                    fullWidth
                  >
                    <MenuItem value="solid">
                      <FormattedMessage id="solid.color" defaultMessage="Solid Color" />
                    </MenuItem>
                    <MenuItem value="gradient">
                      <FormattedMessage id="gradient" defaultMessage="Gradient" />
                    </MenuItem>
                  </Field>
                </FormControl>
              </Grid>

              {values.customStyles?.backgroundColor?.type === 'solid' && (
                <Grid item xs={12} sm={6}>
                  <Field
                    component={TextField}
                    name="customStyles.backgroundColor.solid"
                    label={
                      <FormattedMessage
                        id="background.color"
                        defaultMessage="Background Color"
                      />
                    }
                    placeholder="#ffffff"
                    fullWidth
                    type="color"
                  />
                </Grid>
              )}

              {values.customStyles?.backgroundColor?.type === 'gradient' && (
                <>
                  <Grid item xs={12} sm={3}>
                    <Field
                      component={TextField}
                      name="customStyles.backgroundColor.gradient.from"
                      label={
                        <FormattedMessage
                          id="gradient.from"
                          defaultMessage="Gradient From"
                        />
                      }
                      placeholder="#ffffff"
                      fullWidth
                      type="color"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Field
                      component={TextField}
                      name="customStyles.backgroundColor.gradient.to"
                      label={
                        <FormattedMessage
                          id="gradient.to"
                          defaultMessage="Gradient To"
                        />
                      }
                      placeholder="#000000"
                      fullWidth
                      type="color"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel shrink>
                        <FormattedMessage id="gradient.direction" defaultMessage="Gradient Direction" />
                      </InputLabel>
                      <Field
                        component={Select}
                        name="customStyles.backgroundColor.gradient.direction"
                        label={
                          <FormattedMessage
                            id="gradient.direction"
                            defaultMessage="Gradient Direction"
                          />
                        }
                        displayEmpty
                        fullWidth
                      >
                        <MenuItem value="to-r">
                          <FormattedMessage id="gradient.to.right" defaultMessage="Left to Right" />
                        </MenuItem>
                        <MenuItem value="to-l">
                          <FormattedMessage id="gradient.to.left" defaultMessage="Right to Left" />
                        </MenuItem>
                        <MenuItem value="to-b">
                          <FormattedMessage id="gradient.to.bottom" defaultMessage="Top to Bottom" />
                        </MenuItem>
                        <MenuItem value="to-t">
                          <FormattedMessage id="gradient.to.top" defaultMessage="Bottom to Top" />
                        </MenuItem>
                        <MenuItem value="to-br">
                          <FormattedMessage id="gradient.to.bottom.right" defaultMessage="Top-Left to Bottom-Right" />
                        </MenuItem>
                        <MenuItem value="to-bl">
                          <FormattedMessage id="gradient.to.bottom.left" defaultMessage="Top-Right to Bottom-Left" />
                        </MenuItem>
                        <MenuItem value="to-tr">
                          <FormattedMessage id="gradient.to.top.right" defaultMessage="Bottom-Left to Top-Right" />
                        </MenuItem>
                        <MenuItem value="to-tl">
                          <FormattedMessage id="gradient.to.top.left" defaultMessage="Bottom-Right to Top-Left" />
                        </MenuItem>
                      </Field>
                    </FormControl>
                  </Grid>
                </>
              )}

              <Grid item xs={12} sm={6}>
                <Field
                  component={TextField}
                  name="customStyles.inputColors.backgroundColor"
                  label={
                    <FormattedMessage
                      id="input.background.color"
                      defaultMessage="Input Background Color"
                    />
                  }
                  placeholder="#ffffff"
                  fullWidth
                  type="color"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  component={TextField}
                  name="customStyles.inputColors.borderColor"
                  label={
                    <FormattedMessage
                      id="input.border.color"
                      defaultMessage="Input Border Color"
                    />
                  }
                  placeholder="#cccccc"
                  fullWidth
                  type="color"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  component={TextField}
                  name="customStyles.inputColors.textColor"
                  label={
                    <FormattedMessage
                      id="input.text.color"
                      defaultMessage="Input Text Color"
                    />
                  }
                  placeholder="#000000"
                  fullWidth
                  type="color"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  component={TextField}
                  name="customStyles.inputColors.focusBorderColor"
                  label={
                    <FormattedMessage
                      id="input.focus.border.color"
                      defaultMessage="Input Focus Border Color"
                    />
                  }
                  placeholder="#1976d2"
                  fullWidth
                  type="color"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  component={TextField}
                  name="customStyles.buttonColors.backgroundColor"
                  label={
                    <FormattedMessage
                      id="button.background.color"
                      defaultMessage="Button Background Color"
                    />
                  }
                  placeholder="#1976d2"
                  fullWidth
                  type="color"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  component={TextField}
                  name="customStyles.buttonColors.textColor"
                  label={
                    <FormattedMessage
                      id="button.text.color"
                      defaultMessage="Button Text Color"
                    />
                  }
                  placeholder="#ffffff"
                  fullWidth
                  type="color"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  component={TextField}
                  name="customStyles.buttonColors.hoverBackgroundColor"
                  label={
                    <FormattedMessage
                      id="button.hover.background.color"
                      defaultMessage="Button Hover Background Color"
                    />
                  }
                  placeholder="#1565c0"
                  fullWidth
                  type="color"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  component={TextField}
                  name="customStyles.textColors.primary"
                  label={
                    <FormattedMessage
                      id="primary.text.color"
                      defaultMessage="Primary Text Color"
                    />
                  }
                  placeholder="#000000"
                  fullWidth
                  type="color"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  component={TextField}
                  name="customStyles.textColors.secondary"
                  label={
                    <FormattedMessage
                      id="secondary.text.color"
                      defaultMessage="Secondary Text Color"
                    />
                  }
                  placeholder="#666666"
                  fullWidth
                  type="color"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  component={TextField}
                  name="customStyles.textColors.accent"
                  label={
                    <FormattedMessage
                      id="accent.text.color"
                      defaultMessage="Accent Text Color"
                    />
                  }
                  placeholder="#1976d2"
                  fullWidth
                  type="color"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 1 }}>
                  <FormattedMessage
                    id="statistics.colors"
                    defaultMessage="Statistics Colors"
                  />
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  component={TextField}
                  name="customStyles.statsColors.maxTotalBackground"
                  label={
                    <FormattedMessage
                      id="total.supply.background.color"
                      defaultMessage="Total Supply Background Color"
                    />
                  }
                  placeholder="#f5f5f5"
                  fullWidth
                  type="color"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  component={TextField}
                  name="customStyles.statsColors.maxTotalBorder"
                  label={
                    <FormattedMessage
                      id="total.supply.border.color"
                      defaultMessage="Total Supply Border Color"
                    />
                  }
                  placeholder="#cccccc"
                  fullWidth
                  type="color"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  component={TextField}
                  name="customStyles.statsColors.availableRemainingBackground"
                  label={
                    <FormattedMessage
                      id="unclaimed.supply.background.color"
                      defaultMessage="Unclaimed Supply Background Color"
                    />
                  }
                  placeholder="#4caf50"
                  fullWidth
                  type="color"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  component={TextField}
                  name="customStyles.statsColors.availableRemainingBorder"
                  label={
                    <FormattedMessage
                      id="unclaimed.supply.border.color"
                      defaultMessage="Unclaimed Supply Border Color"
                    />
                  }
                  placeholder="#388e3c"
                  fullWidth
                  type="color"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field name="customStyles.fontFamily">
                  {({ field, form }: any) => (
                    <Autocomplete
                      disablePortal
                      id="font-family-selection"
                      value={field.value || ''}
                      onChange={(event, newValue) => {
                        form.setFieldValue(field.name, newValue);
                      }}
                      options={Fonts.items.map((font: { family: string }) => font.family)}
                      renderInput={(params) => (
                        <MuiTextField
                          {...params}
                          label={
                            <FormattedMessage
                              id="font.family"
                              defaultMessage="Font Family"
                            />
                          }
                          placeholder="Select a font family"
                          fullWidth
                        />
                      )}
                      renderOption={(props, option: string) => {
                        return (
                          <Box
                            component="li"
                            {...props}
                            sx={{
                              fontFamily: `'${option}', sans-serif`,
                              fontSize: '16px',
                              padding: '8px 12px',
                              '&:hover': {
                                backgroundColor: 'action.hover',
                              }
                            }}
                            onMouseEnter={() => {
                              setTimeout(() => preloadFont(option), 100);
                            }}
                          >
                            {option}
                          </Box>
                        );
                      }}
                      ListboxProps={{
                        style: {
                          maxHeight: '250px',
                        }
                      }}
                      filterOptions={(options, { inputValue }) => {
                        const filtered = options.filter((option) =>
                          option.toLowerCase().includes(inputValue.toLowerCase())
                        );
                        return filtered.slice(0, 50);
                      }}
                    />
                  )}
                </Field>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  component={TextField}
                  name="customStyles.borderRadius"
                  label={
                    <FormattedMessage
                      id="border.radius"
                      defaultMessage="Border Radius (px)"
                    />
                  }
                  placeholder="8"
                  fullWidth
                  type="number"
                />
              </Grid>
            </>
          )}
        </Grid>
      )}
    </Formik>
  );
}
