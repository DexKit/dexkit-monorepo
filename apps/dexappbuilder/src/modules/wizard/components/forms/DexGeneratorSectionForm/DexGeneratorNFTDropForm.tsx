import { NftDropPageSection } from '@dexkit/ui/modules/wizard/types/section';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Box, FormControl, Grid, IconButton, InputLabel, MenuItem, TextField as MuiTextField, Typography } from '@mui/material';
import { Field, FieldArray, Formik } from 'formik';
import { Select, TextField } from 'formik-mui';
import React, { useCallback, useMemo } from 'react';
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

const CompactColorField = ({ name, label, placeholder = "#000000" }: { name: string; label: React.ReactNode; placeholder?: string }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 100, maxWidth: 120 }}>
    <Typography
      variant="caption"
      sx={{
        fontSize: '0.75rem',
        textAlign: 'center',
        mb: 0.5,
        lineHeight: 1.1,
        height: '2.2rem',
        display: 'flex',
        alignItems: 'center',
        px: 0.5,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {label}
    </Typography>
    <Field
      component={TextField}
      name={name}
      placeholder={placeholder}
      type="color"
      sx={{
        width: 50,
        '& .MuiInputBase-root': {
          width: 50,
          height: 35,
          padding: 1,
        },
        '& .MuiInputBase-input': {
          width: 32,
          height: 19,
          padding: 0,
          border: 'none',
          borderRadius: 1,
          cursor: 'pointer',
          '&::-webkit-color-swatch-wrapper': {
            padding: 0,
          },
          '&::-webkit-color-swatch': {
            border: 'none',
            borderRadius: 3,
          },
        },
        '& .MuiFormLabel-root': {
          display: 'none',
        },
        '& .MuiFormHelperText-root': {
          display: 'none',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          border: '1px solid #ddd',
          borderRadius: 1,
        },
      }}
    />
  </Box>
);

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

  const allFonts = useMemo(() => Fonts.items.map((font: { family: string }) => font.family), []);

  const getFilteredFonts = useCallback((inputValue: string) => {
    if (!inputValue || inputValue.trim() === '') {
      return allFonts; // Show ALL fonts when no search
    }
    return allFonts.filter((option: any) =>
      option.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [allFonts]);

  const defaultChips: ChipConfig[] = [
    { text: 'Smart Contract Verified', emoji: '✓', color: 'success' },
    { text: 'Secure Minting', emoji: '🔒', color: 'primary' },
    { text: 'Limited Supply', emoji: '⚡', color: 'warning' },
  ];

  const handleSubmit = ({ variant, customTitle, customSubtitle, customChips, customChipsTitle, customStyles }: {
    variant?: 'simple' | 'detailed' | 'premium';
    customTitle?: string;
    customSubtitle?: string;
    customChips?: ChipConfig[];
    customChipsTitle?: string;
    customStyles?: any;
  }): void => { };

  const handleValidate = ({ variant, customTitle, customSubtitle, customChips, customChipsTitle, customStyles }: {
    variant?: 'simple' | 'detailed' | 'premium';
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
              accent: '#1976d2',
              chipsTitle: '#000000',
              balanceLabel: '#666666',
              balanceValue: '#000000',
              contractDescription: '#666666',
              quantityLabel: '#000000',
              maxPerWalletLabel: '#666666',
              currentBalanceLabel: '#666666',
              maxTotalPhaseLabel: '#666666',
              availableRemainingLabel: '#ffffff',
              totalCostLabel: '#ffffff',
              totalCostValue: '#ffffff'
            },
            statsColors: {
              maxTotalBackground: '#f5f5f5',
              maxTotalBorder: '#cccccc',
              availableRemainingBackground: '#4caf50',
              availableRemainingBorder: '#388e3c'
            },
            phaseColors: {
              currentPhaseBackground: '#ffffff',
              currentPhaseBorder: '#e0e0e0',
              currentPhaseTitle: '#666666',
              currentPhaseText: '#000000',
              phaseEndsBackground: '#fff3cd',
              phaseEndsBorder: '#ffecb3',
              phaseEndsTitle: '#ff8f00',
              phaseEndsText: '#ff8f00',
              nextPhaseBackground: '#e3f2fd',
              nextPhaseBorder: '#1976d2',
              nextPhaseTitle: '#1976d2',
              nextPhaseText: '#1976d2'
            },
            totalCostColors: {
              backgroundColor: '#1976d2',
              borderColor: '#1976d2'
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
              accent: '#1976d2',
              chipsTitle: '#000000',
              balanceLabel: '#666666',
              balanceValue: '#000000',
              contractDescription: '#666666',
              quantityLabel: '#000000',
              maxPerWalletLabel: '#666666',
              currentBalanceLabel: '#666666',
              maxTotalPhaseLabel: '#666666',
              availableRemainingLabel: '#ffffff',
              totalCostLabel: '#ffffff',
              totalCostValue: '#ffffff'
            },
            statsColors: {
              maxTotalBackground: '#f5f5f5',
              maxTotalBorder: '#cccccc',
              availableRemainingBackground: '#4caf50',
              availableRemainingBorder: '#388e3c'
            },
            phaseColors: {
              currentPhaseBackground: '#ffffff',
              currentPhaseBorder: '#e0e0e0',
              currentPhaseTitle: '#666666',
              currentPhaseText: '#000000',
              phaseEndsBackground: '#fff3cd',
              phaseEndsBorder: '#ffecb3',
              phaseEndsTitle: '#ff8f00',
              phaseEndsText: '#ff8f00',
              nextPhaseBackground: '#e3f2fd',
              nextPhaseBorder: '#1976d2',
              nextPhaseTitle: '#1976d2',
              nextPhaseText: '#1976d2'
            },
            totalCostColors: {
              backgroundColor: '#1976d2',
              borderColor: '#1976d2'
            },
            fontFamily: '',
            borderRadius: 8
          }
        }
      }
      onSubmit={handleSubmit as any}
      validate={handleValidate as any}
    >
      {({ values }: any) => (
        <Grid container spacing={2} sx={{ pt: 2 }}>
          <Grid size={12}>
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
              <Grid size={12}>
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
              <Grid size={12}>
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

              <Grid size={12}>
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
                  <Grid size={12}>
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
                  {({ push, remove }: any) => (
                    <Box>
                      {(values.customChips || []).map((chip: any, index: any) => (
                        <Grid container spacing={2} key={index} sx={{ mb: 2, alignItems: 'center' }}>
                          <Grid
                            size={{
                              xs: 12,
                              sm: 2
                            }}>
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
                          <Grid
                            size={{
                              xs: 12,
                              sm: 5
                            }}>
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
                          <Grid
                            size={{
                              xs: 12,
                              sm: 4
                            }}>
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
                          <Grid
                            size={{
                              xs: 12,
                              sm: 1
                            }}>
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

              <Grid size={12}>
                <Accordion sx={{ mt: 2 }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="advanced-customization-content"
                    id="advanced-customization-header"
                  >
                    <Typography variant="h6">
                      <FormattedMessage
                        id="advanced.customization"
                        defaultMessage="Advanced Customization"
                      />
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid size={12}>
                        <Typography variant="h6" gutterBottom>
                          <FormattedMessage
                            id="visual.customization"
                            defaultMessage="Visual Customization"
                          />
                        </Typography>
                      </Grid>

                      <Grid
                        size={{
                          xs: 12,
                          sm: 6
                        }}>
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
                        <Grid
                          size={{
                            xs: 6,
                            sm: 3
                          }}>
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
                          <Grid
                            size={{
                              xs: 6,
                              sm: 3
                            }}>
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
                          <Grid
                            size={{
                              xs: 6,
                              sm: 3
                            }}>
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
                          <Grid
                            size={{
                              xs: 12,
                              sm: 6
                            }}>
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

                      <Grid size={12}>
                        <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 1 }}>
                          <FormattedMessage
                            id="input.colors"
                            defaultMessage="Input Colors"
                          />
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.25, justifyContent: 'flex-start' }}>
                          <CompactColorField
                            name="customStyles.inputColors.backgroundColor"
                            label={<FormattedMessage id="input.background.color" defaultMessage="Background" />}
                            placeholder="#ffffff"
                          />
                          <CompactColorField
                            name="customStyles.inputColors.borderColor"
                            label={<FormattedMessage id="input.border.color" defaultMessage="Border" />}
                            placeholder="#cccccc"
                          />
                          <CompactColorField
                            name="customStyles.inputColors.textColor"
                            label={<FormattedMessage id="input.text.color" defaultMessage="Text" />}
                            placeholder="#000000"
                          />
                          <CompactColorField
                            name="customStyles.inputColors.focusBorderColor"
                            label={<FormattedMessage id="input.focus.border.color" defaultMessage="Focus Border" />}
                            placeholder="#1976d2"
                          />
                        </Box>
                      </Grid>

                      <Grid size={12}>
                        <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 1 }}>
                          <FormattedMessage
                            id="button.colors"
                            defaultMessage="Button Colors"
                          />
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.25, justifyContent: 'flex-start' }}>
                          <CompactColorField
                            name="customStyles.buttonColors.backgroundColor"
                            label={<FormattedMessage id="button.background.color" defaultMessage="Background" />}
                            placeholder="#1976d2"
                          />
                          <CompactColorField
                            name="customStyles.buttonColors.textColor"
                            label={<FormattedMessage id="button.text.color" defaultMessage="Text" />}
                            placeholder="#ffffff"
                          />
                          <CompactColorField
                            name="customStyles.buttonColors.hoverBackgroundColor"
                            label={<FormattedMessage id="button.hover.background.color" defaultMessage="Hover Background" />}
                            placeholder="#1565c0"
                          />
                          <CompactColorField
                            name="customStyles.buttonColors.borderColor"
                            label={<FormattedMessage id="button.border.color" defaultMessage="Border" />}
                            placeholder="#1976d2"
                          />
                        </Box>
                      </Grid>

                      <Grid size={12}>
                        <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 1 }}>
                          <FormattedMessage
                            id="text.colors"
                            defaultMessage="Text Colors"
                          />
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.25, justifyContent: 'flex-start' }}>
                          <CompactColorField
                            name="customStyles.textColors.primary"
                            label={<FormattedMessage id="primary.text.color" defaultMessage="Primary" />}
                            placeholder="#000000"
                          />
                          <CompactColorField
                            name="customStyles.textColors.secondary"
                            label={<FormattedMessage id="secondary.text.color" defaultMessage="Secondary" />}
                            placeholder="#666666"
                          />
                          <CompactColorField
                            name="customStyles.textColors.accent"
                            label={<FormattedMessage id="accent.text.color" defaultMessage="Accent" />}
                            placeholder="#1976d2"
                          />
                          <CompactColorField
                            name="customStyles.textColors.chipsTitle"
                            label={<FormattedMessage id="chips.title.color" defaultMessage="Chips Title" />}
                            placeholder="#000000"
                          />
                          <CompactColorField
                            name="customStyles.textColors.balanceLabel"
                            label={<FormattedMessage id="balance.label.color" defaultMessage="Balance Label" />}
                            placeholder="#666666"
                          />
                          <CompactColorField
                            name="customStyles.textColors.balanceValue"
                            label={<FormattedMessage id="balance.value.color" defaultMessage="Balance Value" />}
                            placeholder="#000000"
                          />
                          <CompactColorField
                            name="customStyles.textColors.contractDescription"
                            label={<FormattedMessage id="contract.description.color" defaultMessage="Contract Description" />}
                            placeholder="#666666"
                          />
                          <CompactColorField
                            name="customStyles.textColors.quantityLabel"
                            label={<FormattedMessage id="quantity.label.color" defaultMessage="Quantity Label" />}
                            placeholder="#000000"
                          />
                          <CompactColorField
                            name="customStyles.textColors.maxPerWalletLabel"
                            label={<FormattedMessage id="max.per.wallet.label.color" defaultMessage="Max per Wallet" />}
                            placeholder="#666666"
                          />
                          <CompactColorField
                            name="customStyles.textColors.currentBalanceLabel"
                            label={<FormattedMessage id="current.balance.label.color" defaultMessage="Current Balance" />}
                            placeholder="#666666"
                          />
                          <CompactColorField
                            name="customStyles.textColors.maxTotalPhaseLabel"
                            label={<FormattedMessage id="max.total.phase.label.color" defaultMessage="Max Total Phase" />}
                            placeholder="#666666"
                          />
                          <CompactColorField
                            name="customStyles.textColors.availableRemainingLabel"
                            label={<FormattedMessage id="available.remaining.label.color" defaultMessage="Available Remaining" />}
                            placeholder="#ffffff"
                          />
                          <CompactColorField
                            name="customStyles.textColors.totalCostLabel"
                            label={<FormattedMessage id="total.cost.label.color" defaultMessage="Total Cost Label" />}
                            placeholder="#ffffff"
                          />
                          <CompactColorField
                            name="customStyles.textColors.totalCostValue"
                            label={<FormattedMessage id="total.cost.value.color" defaultMessage="Total Cost Value" />}
                            placeholder="#ffffff"
                          />
                        </Box>
                      </Grid>

                      <Grid size={12}>
                        <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 1 }}>
                          <FormattedMessage
                            id="statistics.colors"
                            defaultMessage="Statistics Colors"
                          />
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.25, justifyContent: 'flex-start' }}>
                          <CompactColorField
                            name="customStyles.statsColors.maxTotalBackground"
                            label={<FormattedMessage id="total.supply.background.color" defaultMessage="Total Supply Background" />}
                            placeholder="#f5f5f5"
                          />
                          <CompactColorField
                            name="customStyles.statsColors.maxTotalBorder"
                            label={<FormattedMessage id="total.supply.border.color" defaultMessage="Total Supply Border" />}
                            placeholder="#cccccc"
                          />
                          <CompactColorField
                            name="customStyles.statsColors.availableRemainingBackground"
                            label={<FormattedMessage id="unclaimed.supply.background.color" defaultMessage="Unclaimed Background" />}
                            placeholder="#4caf50"
                          />
                          <CompactColorField
                            name="customStyles.statsColors.availableRemainingBorder"
                            label={<FormattedMessage id="unclaimed.supply.border.color" defaultMessage="Unclaimed Border" />}
                            placeholder="#388e3c"
                          />
                        </Box>
                      </Grid>

                      <Grid size={12}>
                        <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 1 }}>
                          <FormattedMessage
                            id="phase.colors"
                            defaultMessage="Phase Colors"
                          />
                        </Typography>

                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                          Current Phase
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.25, justifyContent: 'flex-start', mb: 2 }}>
                          <CompactColorField
                            name="customStyles.phaseColors.currentPhaseBackground"
                            label={<FormattedMessage id="current.phase.background.color" defaultMessage="Background" />}
                            placeholder="#ffffff"
                          />
                          <CompactColorField
                            name="customStyles.phaseColors.currentPhaseBorder"
                            label={<FormattedMessage id="current.phase.border.color" defaultMessage="Border" />}
                            placeholder="#e0e0e0"
                          />
                          <CompactColorField
                            name="customStyles.phaseColors.currentPhaseTitle"
                            label={<FormattedMessage id="current.phase.title.color" defaultMessage="Title" />}
                            placeholder="#666666"
                          />
                          <CompactColorField
                            name="customStyles.phaseColors.currentPhaseText"
                            label={<FormattedMessage id="current.phase.text.color" defaultMessage="Text" />}
                            placeholder="#000000"
                          />
                        </Box>

                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                          Phase Ends
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.25, justifyContent: 'flex-start', mb: 2 }}>
                          <CompactColorField
                            name="customStyles.phaseColors.phaseEndsBackground"
                            label={<FormattedMessage id="phase.ends.background.color" defaultMessage="Background" />}
                            placeholder="#fff3cd"
                          />
                          <CompactColorField
                            name="customStyles.phaseColors.phaseEndsBorder"
                            label={<FormattedMessage id="phase.ends.border.color" defaultMessage="Border" />}
                            placeholder="#ffecb3"
                          />
                          <CompactColorField
                            name="customStyles.phaseColors.phaseEndsTitle"
                            label={<FormattedMessage id="phase.ends.title.color" defaultMessage="Title" />}
                            placeholder="#ff8f00"
                          />
                          <CompactColorField
                            name="customStyles.phaseColors.phaseEndsText"
                            label={<FormattedMessage id="phase.ends.text.color" defaultMessage="Text" />}
                            placeholder="#ff8f00"
                          />
                        </Box>

                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                          Next Phase Price
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.25, justifyContent: 'flex-start' }}>
                          <CompactColorField
                            name="customStyles.phaseColors.nextPhaseBackground"
                            label={<FormattedMessage id="next.phase.background.color" defaultMessage="Background" />}
                            placeholder="#e3f2fd"
                          />
                          <CompactColorField
                            name="customStyles.phaseColors.nextPhaseBorder"
                            label={<FormattedMessage id="next.phase.border.color" defaultMessage="Border" />}
                            placeholder="#1976d2"
                          />
                          <CompactColorField
                            name="customStyles.phaseColors.nextPhaseTitle"
                            label={<FormattedMessage id="next.phase.title.color" defaultMessage="Title" />}
                            placeholder="#1976d2"
                          />
                          <CompactColorField
                            name="customStyles.phaseColors.nextPhaseText"
                            label={<FormattedMessage id="next.phase.text.color" defaultMessage="Text" />}
                            placeholder="#1976d2"
                          />
                        </Box>
                      </Grid>

                      <Grid size={12}>
                        <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 1 }}>
                          <FormattedMessage
                            id="total.cost.colors"
                            defaultMessage="Total Cost Colors"
                          />
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.25, justifyContent: 'flex-start' }}>
                          <CompactColorField
                            name="customStyles.totalCostColors.backgroundColor"
                            label={<FormattedMessage id="total.cost.background.color" defaultMessage="Background" />}
                            placeholder="#1976d2"
                          />
                          <CompactColorField
                            name="customStyles.totalCostColors.borderColor"
                            label={<FormattedMessage id="total.cost.border.color" defaultMessage="Border" />}
                            placeholder="#1976d2"
                          />
                        </Box>
                      </Grid>

                      <Grid size={12}>
                        <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 1 }}>
                          <FormattedMessage
                            id="typography.styling"
                            defaultMessage="Typography & Styling"
                          />
                        </Typography>
                      </Grid>

                      <Grid
                        size={{
                          xs: 12,
                          sm: 6
                        }}>
                        <Field name="customStyles.fontFamily">
                          {({ field, form }: any) => (
                            <Autocomplete
                              disablePortal
                              id="font-family-selection"
                              value={field.value || ''}
                              onChange={(event, newValue) => {
                                form.setFieldValue(field.name, newValue);
                              }}
                              options={getFilteredFonts(field.value || '')}
                              disableListWrap
                              {...({ disableVirtualization: false } as any)}
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
                              renderOption={(props, option: string, { index }) => (
                                <Box
                                  component="li"
                                  {...props}
                                  key={`${option}-${index}`}
                                  sx={{
                                    fontFamily: `'${option}', sans-serif`,
                                    fontSize: '16px',
                                    padding: '8px 12px',
                                    '&:hover': {
                                      backgroundColor: 'action.hover',
                                    }
                                  }}
                                  onMouseEnter={() => {
                                    preloadFont(option);
                                  }}
                                >
                                  {option}
                                </Box>
                              )}
                              ListboxProps={{
                                style: {
                                  maxHeight: '300px',
                                  overflow: 'auto',
                                },
                              }}
                              filterOptions={(options, { inputValue }) => {
                                return getFilteredFonts(inputValue);
                              }}
                            />
                          )}
                        </Field>
                      </Grid>

                      <Grid
                        size={{
                          xs: 12,
                          sm: 6
                        }}>
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
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </>
          )}
        </Grid>
      )}
    </Formik>
  );
}
