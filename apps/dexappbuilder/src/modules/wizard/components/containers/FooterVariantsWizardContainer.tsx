import {
  AppConfig,
  SiteResponse,
} from '@dexkit/ui/modules/wizard/types/config';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ImageIcon from '@mui/icons-material/Image';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  ButtonBase,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slider,
  Stack,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import * as Yup from 'yup';

import MediaDialog from '@dexkit/ui/components/mediaDialog';
import {
  CUSTOM_DOMAINS_AND_SIGNATURE_FEAT,
  WIDGET_SIGNATURE_FEAT,
} from '@dexkit/ui/constants/featPayments';
import { useActiveFeatUsage } from '@dexkit/ui/hooks/payments';

function convertToHex(color: string): string {
  if (/^#[0-9A-F]{6}$/i.test(color)) {
    return color;
  }

  if (/^#[0-9A-F]{3}$/i.test(color)) {
    return color.replace(/^#([0-9A-F])([0-9A-F])([0-9A-F])$/i, '#$1$1$2$2$3$3');
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return '#000000';

  ctx.fillStyle = color;
  const computedColor = ctx.fillStyle;

  if (/^#[0-9A-F]{6}$/i.test(computedColor)) {
    return computedColor;
  }

  return '#000000';
}

function getAllPositions(): Array<{ value: string; labelId: string; defaultMessage: string }> {
  return [
    { value: 'left', labelId: 'footer.position.left', defaultMessage: 'Left' },
    { value: 'center', labelId: 'footer.position.center', defaultMessage: 'Center' },
    { value: 'right', labelId: 'footer.position.right', defaultMessage: 'Right' }
  ];
}

function validateUniquePositions(
  signaturePosition: string,
  menuPosition: string,
  socialMediaPosition: string
): boolean {
  const positions = [signaturePosition, menuPosition, socialMediaPosition];
  const uniquePositions = new Set(positions);
  return uniquePositions.size === positions.length;
}

function ColorPickerField({
  label,
  value,
  onChange,
  defaultValue = "#ffffff"
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

interface FooterConfig {
  variant?: 'default' | 'glassmorphic' | 'minimal' | 'invisible';
  glassConfig?: {
    blurIntensity?: number;
    glassOpacity?: number;
    backgroundColor?: string;
    textColor?: string;
    backgroundImage?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    backgroundRepeat?: string;
    backgroundAttachment?: string;
  };
  minimalConfig?: {
    backgroundColor?: string;
    textColor?: string;
    dividerColor?: string;
    fontSize?: number;
    showDividers?: boolean;
    spacing?: number;
  };
  invisibleConfig?: {
    textColor?: string;
    fontSize?: number;
    spacing?: number;
    alignment?: 'left' | 'center' | 'right';
    showOnlySignature?: boolean;
  };
  customSignature?: {
    enabled?: boolean;
    text?: string;
    link?: string;
    showAppName?: boolean;
    showLoveBy?: boolean;
  };
  layout?: {
    signaturePosition?: 'left' | 'center' | 'right';
    menuPosition?: 'left' | 'center' | 'right';
    socialMediaPosition?: 'left' | 'center' | 'right';
    borderRadius?: number;
  };
}

interface Props {
  site?: SiteResponse | null;
  isWidget?: boolean;
  config: AppConfig & { footerConfig?: FooterConfig };
  onSave: (config: AppConfig & { footerConfig?: FooterConfig }) => void;
  onHasChanges: (hasChanges: boolean) => void;
}

const FooterConfigSchema = Yup.object().shape({
  variant: Yup.string().oneOf(['default', 'glassmorphic', 'minimal', 'invisible']),
  glassConfig: Yup.object().shape({
    blurIntensity: Yup.number().min(10).max(60),
    glassOpacity: Yup.number().min(0.05).max(0.5),
    backgroundColor: Yup.string(),
    textColor: Yup.string(),
    backgroundImage: Yup.string(),
    backgroundSize: Yup.string(),
    backgroundPosition: Yup.string(),
    backgroundRepeat: Yup.string(),
    backgroundAttachment: Yup.string(),
  }),
  minimalConfig: Yup.object().shape({
    backgroundColor: Yup.string(),
    textColor: Yup.string(),
    dividerColor: Yup.string(),
    fontSize: Yup.number().min(10).max(24),
    showDividers: Yup.boolean(),
    spacing: Yup.number().min(0.5).max(4),
  }),
  invisibleConfig: Yup.object().shape({
    textColor: Yup.string(),
    fontSize: Yup.number().min(8).max(16),
    spacing: Yup.number().min(0).max(2),
    alignment: Yup.string().oneOf(['left', 'center', 'right']),
    showOnlySignature: Yup.boolean(),
  }),
  customSignature: Yup.object().shape({
    enabled: Yup.boolean(),
    text: Yup.string(),
    link: Yup.string().url(),
    showAppName: Yup.boolean(),
    showLoveBy: Yup.boolean(),
  }),
  layout: Yup.object().shape({
    signaturePosition: Yup.string().oneOf(['left', 'center', 'right']),
    menuPosition: Yup.string().oneOf(['left', 'center', 'right']),
    socialMediaPosition: Yup.string().oneOf(['left', 'center', 'right']),
    borderRadius: Yup.number().min(0).max(50),
  }).test('unique-positions', 'All positions must be unique', function (value) {
    if (!value) return true;
    return validateUniquePositions(
      value.signaturePosition || 'left',
      value.menuPosition || 'center',
      value.socialMediaPosition || 'right'
    );
  }),
});

function BackgroundImageSelector({
  value,
  onChange,
  sizeValue,
  onSizeChange,
  positionValue,
  onPositionChange,
  repeatValue,
  onRepeatChange,
  attachmentValue,
  onAttachmentChange,
}: {
  value?: string;
  onChange: (url: string | undefined) => void;
  sizeValue?: string;
  onSizeChange: (size: string) => void;
  positionValue?: string;
  onPositionChange: (position: string) => void;
  repeatValue?: string;
  onRepeatChange: (repeat: string) => void;
  attachmentValue?: string;
  onAttachmentChange: (attachment: string) => void;
}) {
  const [showMediaDialog, setShowMediaDialog] = useState(false);
  const theme = useTheme();

  const handleSelectImage = (file: { url: string }) => {
    onChange(file.url);
    setShowMediaDialog(false);
  };

  const handleRemoveImage = () => {
    onChange(undefined);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body2" gutterBottom sx={{ fontWeight: theme.typography.fontWeightMedium }}>
        <FormattedMessage
          id="footer.background.image"
          defaultMessage="Background Image"
        />
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(2), flexWrap: 'wrap' }}>
        <ButtonBase
          onClick={() => setShowMediaDialog(true)}
          sx={{
            width: { xs: theme.spacing(15), sm: theme.spacing(20) },
            height: { xs: theme.spacing(10), sm: theme.spacing(12) },
            border: `2px dashed ${theme.palette.divider}`,
            borderRadius: theme.shape.borderRadius,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: theme.spacing(1),
            transition: theme.transitions.create(['border-color', 'background-color']),
            '&:hover': {
              borderColor: theme.palette.primary.main,
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          {value ? (
            <img
              src={value}
              alt="Background"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: theme.shape.borderRadius,
              }}
            />
          ) : (
            <>
              <ImageIcon sx={{ fontSize: theme.spacing(4), color: theme.palette.text.secondary }} />
              <Typography variant="caption" color="text.secondary" textAlign="center">
                <FormattedMessage
                  id="footer.select.background.image"
                  defaultMessage="Select Background Image"
                />
              </Typography>
            </>
          )}
        </ButtonBase>

        {value && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={handleRemoveImage}
          >
            <FormattedMessage
              id="remove.image"
              defaultMessage="Remove Image"
            />
          </Button>
        )}
      </Box>

      {value && (
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>
                  <FormattedMessage
                    id="footer.background.size"
                    defaultMessage="Image Size"
                  />
                </InputLabel>
                <Select
                  value={sizeValue || "cover"}
                  onChange={(e) => onSizeChange(e.target.value as string)}
                  label="Image Size"
                >
                  <MenuItem value="cover">
                    <FormattedMessage
                      id="footer.background.size.cover"
                      defaultMessage="Cover (Fill container)"
                    />
                  </MenuItem>
                  <MenuItem value="contain">
                    <FormattedMessage
                      id="footer.background.size.contain"
                      defaultMessage="Contain (Fit inside)"
                    />
                  </MenuItem>
                  <MenuItem value="auto">
                    <FormattedMessage
                      id="footer.background.size.auto"
                      defaultMessage="Auto (Original size)"
                    />
                  </MenuItem>
                  <MenuItem value="100% 100%">
                    <FormattedMessage
                      id="footer.background.size.stretch"
                      defaultMessage="Stretch (Fill exactly)"
                    />
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>
                  <FormattedMessage
                    id="footer.background.position"
                    defaultMessage="Image Position"
                  />
                </InputLabel>
                <Select
                  value={positionValue || "center"}
                  onChange={(e) => onPositionChange(e.target.value as string)}
                  label="Image Position"
                >
                  <MenuItem value="center">
                    <FormattedMessage
                      id="footer.background.position.center"
                      defaultMessage="Center"
                    />
                  </MenuItem>
                  <MenuItem value="top">
                    <FormattedMessage
                      id="footer.background.position.top"
                      defaultMessage="Top"
                    />
                  </MenuItem>
                  <MenuItem value="bottom">
                    <FormattedMessage
                      id="footer.background.position.bottom"
                      defaultMessage="Bottom"
                    />
                  </MenuItem>
                  <MenuItem value="left">
                    <FormattedMessage
                      id="footer.background.position.left"
                      defaultMessage="Left"
                    />
                  </MenuItem>
                  <MenuItem value="right">
                    <FormattedMessage
                      id="footer.background.position.right"
                      defaultMessage="Right"
                    />
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>
                  <FormattedMessage
                    id="footer.background.repeat"
                    defaultMessage="Image Repeat"
                  />
                </InputLabel>
                <Select
                  value={repeatValue || "no-repeat"}
                  onChange={(e) => onRepeatChange(e.target.value as string)}
                  label="Image Repeat"
                >
                  <MenuItem value="no-repeat">
                    <FormattedMessage
                      id="footer.background.repeat.no"
                      defaultMessage="No repeat"
                    />
                  </MenuItem>
                  <MenuItem value="repeat">
                    <FormattedMessage
                      id="footer.background.repeat.yes"
                      defaultMessage="Repeat"
                    />
                  </MenuItem>
                  <MenuItem value="repeat-x">
                    <FormattedMessage
                      id="footer.background.repeat.x"
                      defaultMessage="Repeat horizontally"
                    />
                  </MenuItem>
                  <MenuItem value="repeat-y">
                    <FormattedMessage
                      id="footer.background.repeat.y"
                      defaultMessage="Repeat vertically"
                    />
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>
                  <FormattedMessage
                    id="footer.background.attachment"
                    defaultMessage="Image Attachment"
                  />
                </InputLabel>
                <Select
                  value={attachmentValue || "scroll"}
                  onChange={(e) => onAttachmentChange(e.target.value as string)}
                  label="Image Attachment"
                >
                  <MenuItem value="scroll">
                    <FormattedMessage
                      id="footer.background.attachment.scroll"
                      defaultMessage="Scroll (Normal)"
                    />
                  </MenuItem>
                  <MenuItem value="fixed">
                    <FormattedMessage
                      id="footer.background.attachment.fixed"
                      defaultMessage="Fixed (Parallax)"
                    />
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      )}

      <MediaDialog
        dialogProps={{
          open: showMediaDialog,
          maxWidth: 'lg',
          fullWidth: true,
          onClose: () => setShowMediaDialog(false),
        }}
        onConfirmSelectFile={handleSelectImage}
      />
    </Box>
  );
}

export default function FooterVariantsWizardContainer({
  config,
  onSave,
  isWidget,
  onHasChanges,
  site,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { formatMessage } = useIntl();

  const activeFeatUsageQuery = useActiveFeatUsage({
    slug: isWidget ? WIDGET_SIGNATURE_FEAT : CUSTOM_DOMAINS_AND_SIGNATURE_FEAT,
  });

  const isPaid = activeFeatUsageQuery.data
    ? activeFeatUsageQuery?.data?.active
    : undefined;

  const initialValues = {
    variant: config.footerConfig?.variant || 'default',
    glassConfig: {
      blurIntensity: config.footerConfig?.glassConfig?.blurIntensity || 40,
      glassOpacity: config.footerConfig?.glassConfig?.glassOpacity || 0.10,
      backgroundColor: config.footerConfig?.glassConfig?.backgroundColor || '',
      textColor: config.footerConfig?.glassConfig?.textColor || theme.palette.text.primary,
      backgroundImage: config.footerConfig?.glassConfig?.backgroundImage || '',
      backgroundSize: config.footerConfig?.glassConfig?.backgroundSize || 'cover',
      backgroundPosition: config.footerConfig?.glassConfig?.backgroundPosition || 'center',
      backgroundRepeat: config.footerConfig?.glassConfig?.backgroundRepeat || 'no-repeat',
      backgroundAttachment: config.footerConfig?.glassConfig?.backgroundAttachment || 'scroll',
    },
    minimalConfig: {
      backgroundColor: config.footerConfig?.minimalConfig?.backgroundColor || '',
      textColor: config.footerConfig?.minimalConfig?.textColor || theme.palette.text.secondary,
      dividerColor: config.footerConfig?.minimalConfig?.dividerColor || theme.palette.divider,
      fontSize: config.footerConfig?.minimalConfig?.fontSize || 14,
      showDividers: config.footerConfig?.minimalConfig?.showDividers ?? true,
      spacing: config.footerConfig?.minimalConfig?.spacing || 1,
    },
    invisibleConfig: {
      textColor: config.footerConfig?.invisibleConfig?.textColor || theme.palette.text.disabled,
      fontSize: config.footerConfig?.invisibleConfig?.fontSize || 12,
      spacing: config.footerConfig?.invisibleConfig?.spacing || 0.5,
      alignment: config.footerConfig?.invisibleConfig?.alignment || 'center',
      showOnlySignature: config.footerConfig?.invisibleConfig?.showOnlySignature || false,
    },
    customSignature: {
      enabled: config.footerConfig?.customSignature?.enabled || false,
      text: config.footerConfig?.customSignature?.text || 'DexKit',
      link: config.footerConfig?.customSignature?.link || 'https://www.dexkit.com',
      showAppName: config.footerConfig?.customSignature?.showAppName ?? true,
      showLoveBy: config.footerConfig?.customSignature?.showLoveBy ?? true,
    },
    layout: {
      signaturePosition: config.footerConfig?.layout?.signaturePosition || 'left',
      menuPosition: config.footerConfig?.layout?.menuPosition || 'center',
      socialMediaPosition: config.footerConfig?.layout?.socialMediaPosition || 'right',
      borderRadius: config.footerConfig?.layout?.borderRadius || 0,
    },
  };

  const [hasChanged, setHasChanged] = useState(false);
  const [formValues, setFormValues] = useState(initialValues);

  useEffect(() => {
    const currentConfig = {
      variant: formValues.variant,
      glassConfig: formValues.glassConfig,
      minimalConfig: formValues.minimalConfig,
      invisibleConfig: formValues.invisibleConfig,
      customSignature: formValues.customSignature,
      layout: formValues.layout,
    };

    const originalConfig = {
      variant: config.footerConfig?.variant || 'default',
      glassConfig: config.footerConfig?.glassConfig || initialValues.glassConfig,
      minimalConfig: config.footerConfig?.minimalConfig || initialValues.minimalConfig,
      invisibleConfig: config.footerConfig?.invisibleConfig || initialValues.invisibleConfig,
      customSignature: config.footerConfig?.customSignature || initialValues.customSignature,
      layout: config.footerConfig?.layout || initialValues.layout,
    };

    setHasChanged(JSON.stringify(currentConfig) !== JSON.stringify(originalConfig));
  }, [formValues, config.footerConfig, initialValues]);

  useEffect(() => {
    if (onHasChanges) {
      onHasChanges(hasChanged);
    }
  }, [onHasChanges, hasChanged]);

  return (
    <Grid container spacing={isMobile ? 1.5 : 3}>
      <Grid item xs={12}>
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={FooterConfigSchema}
          onSubmit={(values) => {
            const newConfig = {
              ...config,
              footerConfig: {
                variant: values.variant as 'default' | 'glassmorphic' | 'minimal' | 'invisible',
                glassConfig: values.glassConfig,
                minimalConfig: values.minimalConfig,
                invisibleConfig: values.invisibleConfig,
                customSignature: values.customSignature,
                layout: values.layout,
              },
            };
            onSave(newConfig);
            setHasChanged(false);
          }}
        >
          {({ values, setFieldValue, submitForm }) => {
            if (!values.invisibleConfig) {
              setFieldValue('invisibleConfig', initialValues.invisibleConfig);
            }
            if (!values.minimalConfig) {
              setFieldValue('minimalConfig', initialValues.minimalConfig);
            }
            if (!values.glassConfig) {
              setFieldValue('glassConfig', initialValues.glassConfig);
            }

            if (JSON.stringify(values) !== JSON.stringify(formValues)) {
              setFormValues(values);
            }

            return (
              <Form>
                <Grid container spacing={isMobile ? 1.5 : 3}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>
                        <FormattedMessage
                          id="footer.variant.select"
                          defaultMessage="Footer Variant"
                        />
                      </InputLabel>
                      <Select
                        value={values.variant}
                        onChange={(e) => setFieldValue('variant', e.target.value)}
                        label="Footer Variant"
                      >
                        <MenuItem value="default">
                          <FormattedMessage
                            id="footer.variant.default"
                            defaultMessage="Default - Classic footer style"
                          />
                        </MenuItem>
                        <MenuItem value="glassmorphic">
                          <FormattedMessage
                            id="footer.variant.glassmorphic"
                            defaultMessage="Glassmorphic - Modern glass effect"
                          />
                        </MenuItem>
                        <MenuItem value="minimal">
                          <FormattedMessage
                            id="footer.variant.minimal"
                            defaultMessage="Minimal - Clean and simple"
                          />
                        </MenuItem>
                        <MenuItem value="invisible">
                          <FormattedMessage
                            id="footer.variant.invisible"
                            defaultMessage="Invisible - Text only, no styling"
                          />
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {values.variant === 'glassmorphic' && (
                    <Grid item xs={12}>
                      <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="h6">
                            <FormattedMessage
                              id="footer.glassmorphic.settings"
                              defaultMessage="Glassmorphic Settings"
                            />
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Typography gutterBottom>
                                <FormattedMessage
                                  id="footer.blur.intensity"
                                  defaultMessage="Blur Intensity"
                                />
                              </Typography>
                              <Slider
                                value={values.glassConfig.blurIntensity || 40}
                                onChange={(_, value) => {
                                  const numericValue = Array.isArray(value) ? value[0] : value;
                                  console.log('Blur intensity changed:', numericValue);
                                  setFieldValue('glassConfig.blurIntensity', numericValue);
                                }}
                                min={10}
                                max={60}
                                step={5}
                                valueLabelDisplay="auto"
                                marks={[
                                  { value: 10, label: '10' },
                                  { value: 30, label: '30' },
                                  { value: 50, label: '50' },
                                ]}
                              />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <Typography gutterBottom>
                                <FormattedMessage
                                  id="footer.glass.opacity"
                                  defaultMessage="Glass Opacity"
                                />
                              </Typography>
                              <Slider
                                value={values.glassConfig.glassOpacity || 0.1}
                                onChange={(_, value) => {
                                  const numericValue = Array.isArray(value) ? value[0] : value;
                                  console.log('Glass opacity changed:', numericValue);
                                  setFieldValue('glassConfig.glassOpacity', numericValue);
                                }}
                                min={0.05}
                                max={0.5}
                                step={0.05}
                                valueLabelDisplay="auto"
                                marks={[
                                  { value: 0.05, label: '0.05' },
                                  { value: 0.25, label: '0.25' },
                                  { value: 0.5, label: '0.5' },
                                ]}
                              />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <ColorPickerField
                                label={formatMessage({
                                  id: "footer.background.color",
                                  defaultMessage: "Background Color"
                                })}
                                value={values.glassConfig.backgroundColor}
                                onChange={(value) => setFieldValue('glassConfig.backgroundColor', value)}
                                defaultValue="rgba(255, 255, 255, 0.1)"
                              />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <ColorPickerField
                                label={formatMessage({
                                  id: "footer.text.color",
                                  defaultMessage: "Text Color"
                                })}
                                value={values.glassConfig.textColor}
                                onChange={(value) => setFieldValue('glassConfig.textColor', value)}
                                defaultValue={theme.palette.text.primary}
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <BackgroundImageSelector
                                value={values.glassConfig.backgroundImage}
                                onChange={(url) => setFieldValue('glassConfig.backgroundImage', url)}
                                sizeValue={values.glassConfig.backgroundSize}
                                onSizeChange={(size) => setFieldValue('glassConfig.backgroundSize', size)}
                                positionValue={values.glassConfig.backgroundPosition}
                                onPositionChange={(position) => setFieldValue('glassConfig.backgroundPosition', position)}
                                repeatValue={values.glassConfig.backgroundRepeat}
                                onRepeatChange={(repeat) => setFieldValue('glassConfig.backgroundRepeat', repeat)}
                                attachmentValue={values.glassConfig.backgroundAttachment}
                                onAttachmentChange={(attachment) => setFieldValue('glassConfig.backgroundAttachment', attachment)}
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                                <Button
                                  variant="outlined"
                                  startIcon={<RefreshIcon />}
                                  onClick={() => {
                                    setFieldValue('glassConfig', initialValues.glassConfig);
                                  }}
                                  sx={{
                                    borderColor: '#ff6b35',
                                    color: '#ff6b35',
                                    backgroundColor: 'transparent',
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    px: 3,
                                    py: 1,
                                    '&:hover': {
                                      borderColor: '#ff6b35',
                                      backgroundColor: 'rgba(255, 107, 53, 0.04)',
                                    },
                                  }}
                                >
                                  <FormattedMessage
                                    id="reset.glassmorphic.settings"
                                    defaultMessage="Reset Glassmorphic Settings"
                                  />
                                </Button>
                              </Box>
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                  )}

                  {values.variant === 'minimal' && (
                    <Grid item xs={12}>
                      <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="h6">
                            <FormattedMessage
                              id="footer.minimal.settings"
                              defaultMessage="Minimal Settings"
                            />
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <ColorPickerField
                                label={formatMessage({
                                  id: "footer.background.color",
                                  defaultMessage: "Background Color"
                                })}
                                value={values.minimalConfig.backgroundColor}
                                onChange={(value) => setFieldValue('minimalConfig.backgroundColor', value)}
                                defaultValue="transparent"
                              />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <ColorPickerField
                                label={formatMessage({
                                  id: "footer.text.color",
                                  defaultMessage: "Text Color"
                                })}
                                value={values.minimalConfig.textColor}
                                onChange={(value) => setFieldValue('minimalConfig.textColor', value)}
                                defaultValue={theme.palette.text.secondary}
                              />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <ColorPickerField
                                label={formatMessage({
                                  id: "footer.divider.color",
                                  defaultMessage: "Divider Color"
                                })}
                                value={values.minimalConfig.dividerColor}
                                onChange={(value) => setFieldValue('minimalConfig.dividerColor', value)}
                                defaultValue={theme.palette.divider}
                              />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <Typography gutterBottom>
                                <FormattedMessage
                                  id="footer.font.size"
                                  defaultMessage="Font Size"
                                />
                              </Typography>
                              <Slider
                                value={values.minimalConfig.fontSize || 14}
                                onChange={(_, value) => {
                                  const numericValue = Array.isArray(value) ? value[0] : value;
                                  setFieldValue('minimalConfig.fontSize', numericValue);
                                }}
                                min={10}
                                max={24}
                                step={1}
                                valueLabelDisplay="auto"
                                marks={[
                                  { value: 10, label: '10px' },
                                  { value: 14, label: '14px' },
                                  { value: 18, label: '18px' },
                                  { value: 24, label: '24px' },
                                ]}
                              />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <Typography gutterBottom>
                                <FormattedMessage
                                  id="footer.spacing"
                                  defaultMessage="Spacing"
                                />
                              </Typography>
                              <Slider
                                value={values.minimalConfig.spacing || 1}
                                onChange={(_, value) => {
                                  const numericValue = Array.isArray(value) ? value[0] : value;
                                  setFieldValue('minimalConfig.spacing', numericValue);
                                }}
                                min={0.5}
                                max={4}
                                step={0.5}
                                valueLabelDisplay="auto"
                                marks={[
                                  { value: 0.5, label: '0.5' },
                                  { value: 1, label: '1' },
                                  { value: 2, label: '2' },
                                  { value: 4, label: '4' },
                                ]}
                              />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={values.minimalConfig.showDividers}
                                    onChange={(e) => setFieldValue('minimalConfig.showDividers', e.target.checked)}
                                  />
                                }
                                label={
                                  <FormattedMessage
                                    id="footer.show.dividers"
                                    defaultMessage="Show Dividers"
                                  />
                                }
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                                <Button
                                  variant="outlined"
                                  startIcon={<RefreshIcon />}
                                  onClick={() => {
                                    setFieldValue('minimalConfig', initialValues.minimalConfig);
                                  }}
                                  sx={{
                                    borderColor: '#ff6b35',
                                    color: '#ff6b35',
                                    backgroundColor: 'transparent',
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    px: 3,
                                    py: 1,
                                    '&:hover': {
                                      borderColor: '#ff6b35',
                                      backgroundColor: 'rgba(255, 107, 53, 0.04)',
                                    },
                                  }}
                                >
                                  <FormattedMessage
                                    id="reset.minimal.settings"
                                    defaultMessage="Reset Minimal Settings"
                                  />
                                </Button>
                              </Box>
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                  )}

                  {values.variant === 'invisible' && (
                    <Grid item xs={12}>
                      <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="h6">
                            <FormattedMessage
                              id="footer.invisible.settings"
                              defaultMessage="Invisible Settings"
                            />
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <ColorPickerField
                                label={formatMessage({
                                  id: "footer.text.color",
                                  defaultMessage: "Text Color"
                                })}
                                value={values.invisibleConfig?.textColor || theme.palette.text.disabled}
                                onChange={(value) => setFieldValue('invisibleConfig.textColor', value)}
                                defaultValue={theme.palette.text.disabled}
                              />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <FormControl fullWidth>
                                <InputLabel>
                                  <FormattedMessage
                                    id="footer.text.alignment"
                                    defaultMessage="Text Alignment"
                                  />
                                </InputLabel>
                                <Select
                                  value={values.invisibleConfig?.alignment || 'center'}
                                  onChange={(e) => setFieldValue('invisibleConfig.alignment', e.target.value)}
                                  label="Text Alignment"
                                >
                                  <MenuItem value="left">
                                    <FormattedMessage
                                      id="footer.alignment.left"
                                      defaultMessage="Left"
                                    />
                                  </MenuItem>
                                  <MenuItem value="center">
                                    <FormattedMessage
                                      id="footer.alignment.center"
                                      defaultMessage="Center"
                                    />
                                  </MenuItem>
                                  <MenuItem value="right">
                                    <FormattedMessage
                                      id="footer.alignment.right"
                                      defaultMessage="Right"
                                    />
                                  </MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <Typography gutterBottom>
                                <FormattedMessage
                                  id="footer.font.size"
                                  defaultMessage="Font Size"
                                />
                              </Typography>
                              <Slider
                                value={values.invisibleConfig?.fontSize || 12}
                                onChange={(_, value) => {
                                  const numericValue = Array.isArray(value) ? value[0] : value;
                                  setFieldValue('invisibleConfig.fontSize', numericValue);
                                }}
                                min={8}
                                max={16}
                                step={1}
                                valueLabelDisplay="auto"
                                marks={[
                                  { value: 8, label: '8px' },
                                  { value: 10, label: '10px' },
                                  { value: 12, label: '12px' },
                                  { value: 14, label: '14px' },
                                  { value: 16, label: '16px' },
                                ]}
                              />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <Typography gutterBottom>
                                <FormattedMessage
                                  id="footer.spacing"
                                  defaultMessage="Spacing"
                                />
                              </Typography>
                              <Slider
                                value={values.invisibleConfig?.spacing || 0.5}
                                onChange={(_, value) => {
                                  const numericValue = Array.isArray(value) ? value[0] : value;
                                  setFieldValue('invisibleConfig.spacing', numericValue);
                                }}
                                min={0}
                                max={2}
                                step={0.25}
                                valueLabelDisplay="auto"
                                marks={[
                                  { value: 0, label: '0' },
                                  { value: 0.5, label: '0.5' },
                                  { value: 1, label: '1' },
                                  { value: 2, label: '2' },
                                ]}
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={values.invisibleConfig?.showOnlySignature || false}
                                    onChange={(e) => setFieldValue('invisibleConfig.showOnlySignature', e.target.checked)}
                                  />
                                }
                                label={
                                  <FormattedMessage
                                    id="footer.show.only.signature"
                                    defaultMessage="Show Only Signature (hide menu and social media)"
                                  />
                                }
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                                <Button
                                  variant="outlined"
                                  startIcon={<RefreshIcon />}
                                  onClick={() => {
                                    setFieldValue('invisibleConfig', initialValues.invisibleConfig);
                                  }}
                                  sx={{
                                    borderColor: '#ff6b35',
                                    color: '#ff6b35',
                                    backgroundColor: 'transparent',
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    px: 3,
                                    py: 1,
                                    '&:hover': {
                                      borderColor: '#ff6b35',
                                      backgroundColor: 'rgba(255, 107, 53, 0.04)',
                                    },
                                  }}
                                >
                                  <FormattedMessage
                                    id="reset.invisible.settings"
                                    defaultMessage="Reset Invisible Settings"
                                  />
                                </Button>
                              </Box>
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                  )}

                  {values.variant === 'glassmorphic' && (
                    <Grid item xs={12}>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="h6">
                            <FormattedMessage
                              id="footer.layout.positioning"
                              defaultMessage="Layout & Positioning"
                            />
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Typography gutterBottom>
                                <FormattedMessage
                                  id="footer.border.radius"
                                  defaultMessage="Border Radius"
                                />
                              </Typography>
                              <Slider
                                value={values.layout.borderRadius}
                                onChange={(_, value) => {
                                  const numericValue = Array.isArray(value) ? value[0] : value;
                                  setFieldValue('layout.borderRadius', numericValue);
                                }}
                                min={0}
                                max={50}
                                step={1}
                                valueLabelDisplay="auto"
                                marks={[
                                  { value: 0, label: '0' },
                                  { value: 15, label: '15' },
                                  { value: 30, label: '30' },
                                  { value: 50, label: '50' },
                                ]}
                              />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                              <FormControl fullWidth>
                                <InputLabel>
                                  <FormattedMessage
                                    id="footer.signature.position"
                                    defaultMessage="Signature Position"
                                  />
                                </InputLabel>
                                <Select
                                  value={values.layout.signaturePosition}
                                  onChange={(e) => setFieldValue('layout.signaturePosition', e.target.value)}
                                  label="Signature Position"
                                  error={!validateUniquePositions(
                                    values.layout.signaturePosition,
                                    values.layout.menuPosition,
                                    values.layout.socialMediaPosition
                                  )}
                                >
                                  {getAllPositions().map((option: { value: string; labelId: string; defaultMessage: string }) => (
                                    <MenuItem key={option.value} value={option.value}>
                                      <FormattedMessage
                                        id={option.labelId}
                                        defaultMessage={option.defaultMessage}
                                      />
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                              <FormControl fullWidth>
                                <InputLabel>
                                  <FormattedMessage
                                    id="footer.menu.position"
                                    defaultMessage="Menu Position"
                                  />
                                </InputLabel>
                                <Select
                                  value={values.layout.menuPosition}
                                  onChange={(e) => setFieldValue('layout.menuPosition', e.target.value)}
                                  label="Menu Position"
                                  error={!validateUniquePositions(
                                    values.layout.signaturePosition,
                                    values.layout.menuPosition,
                                    values.layout.socialMediaPosition
                                  )}
                                >
                                  {getAllPositions().map((option: { value: string; labelId: string; defaultMessage: string }) => (
                                    <MenuItem key={option.value} value={option.value}>
                                      <FormattedMessage
                                        id={option.labelId}
                                        defaultMessage={option.defaultMessage}
                                      />
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                              <FormControl fullWidth>
                                <InputLabel>
                                  <FormattedMessage
                                    id="footer.social.media.position"
                                    defaultMessage="Social Media Position"
                                  />
                                </InputLabel>
                                <Select
                                  value={values.layout.socialMediaPosition}
                                  onChange={(e) => setFieldValue('layout.socialMediaPosition', e.target.value)}
                                  label="Social Media Position"
                                  error={!validateUniquePositions(
                                    values.layout.signaturePosition,
                                    values.layout.menuPosition,
                                    values.layout.socialMediaPosition
                                  )}
                                >
                                  {getAllPositions().map((option: { value: string; labelId: string; defaultMessage: string }) => (
                                    <MenuItem key={option.value} value={option.value}>
                                      <FormattedMessage
                                        id={option.labelId}
                                        defaultMessage={option.defaultMessage}
                                      />
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>

                            {!validateUniquePositions(
                              values.layout.signaturePosition,
                              values.layout.menuPosition,
                              values.layout.socialMediaPosition
                            ) && (
                                <Grid item xs={12}>
                                  <Typography variant="body2" color="error" sx={{ textAlign: 'center' }}>
                                    <FormattedMessage
                                      id="footer.positions.error"
                                      defaultMessage="Each position (left, center, right) can only be used once. Please select unique positions for signature, menu, and social media."
                                    />
                                  </Typography>
                                </Grid>
                              )}

                            <Grid item xs={12}>
                              <Typography variant="body2" gutterBottom sx={{ fontWeight: 'medium' }}>
                                <FormattedMessage
                                  id="footer.layout.preview"
                                  defaultMessage="Layout Preview"
                                />
                              </Typography>
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  p: 2,
                                  border: `1px solid ${theme.palette.divider}`,
                                  borderRadius: `${values.layout.borderRadius}px`,
                                  backgroundColor: theme.palette.background.paper,
                                  minHeight: '60px',
                                }}
                              >
                                <Box sx={{ flex: 1, textAlign: 'left' }}>
                                  {values.layout.signaturePosition === 'left' && (
                                    <Typography variant="caption" color="primary">
                                      <FormattedMessage id="footer.signature" defaultMessage="Signature" />
                                    </Typography>
                                  )}
                                  {values.layout.menuPosition === 'left' && (
                                    <Typography variant="caption" color="secondary">
                                      <FormattedMessage id="footer.menu" defaultMessage="Menu" />
                                    </Typography>
                                  )}
                                  {values.layout.socialMediaPosition === 'left' && (
                                    <Typography variant="caption" color="info.main">
                                      <FormattedMessage id="footer.social.media" defaultMessage="Social Media" />
                                    </Typography>
                                  )}
                                </Box>

                                <Box sx={{ flex: 1, textAlign: 'center' }}>
                                  {values.layout.signaturePosition === 'center' && (
                                    <Typography variant="caption" color="primary">
                                      <FormattedMessage id="footer.signature" defaultMessage="Signature" />
                                    </Typography>
                                  )}
                                  {values.layout.menuPosition === 'center' && (
                                    <Typography variant="caption" color="secondary">
                                      <FormattedMessage id="footer.menu" defaultMessage="Menu" />
                                    </Typography>
                                  )}
                                  {values.layout.socialMediaPosition === 'center' && (
                                    <Typography variant="caption" color="info.main">
                                      <FormattedMessage id="footer.social.media" defaultMessage="Social Media" />
                                    </Typography>
                                  )}
                                </Box>

                                <Box sx={{ flex: 1, textAlign: 'right' }}>
                                  {values.layout.signaturePosition === 'right' && (
                                    <Typography variant="caption" color="primary">
                                      <FormattedMessage id="footer.signature" defaultMessage="Signature" />
                                    </Typography>
                                  )}
                                  {values.layout.menuPosition === 'right' && (
                                    <Typography variant="caption" color="secondary">
                                      <FormattedMessage id="footer.menu" defaultMessage="Menu" />
                                    </Typography>
                                  )}
                                  {values.layout.socialMediaPosition === 'right' && (
                                    <Typography variant="caption" color="info.main">
                                      <FormattedMessage id="footer.social.media" defaultMessage="Social Media" />
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                  )}

                  {values.variant === 'glassmorphic' && (
                    <Grid item xs={12}>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="h6">
                            <FormattedMessage
                              id="footer.custom.signature"
                              defaultMessage="Custom Signature"
                            />
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={values.customSignature.enabled && isPaid}
                                    onChange={(e) => setFieldValue('customSignature.enabled', e.target.checked)}
                                    disabled={!isPaid}
                                  />
                                }
                                label={
                                  <FormattedMessage
                                    id="footer.enable.custom.signature"
                                    defaultMessage="Enable Custom Signature"
                                  />
                                }
                              />
                              {!isPaid && (
                                <Typography variant="caption" color="warning.main" display="block">
                                  <FormattedMessage
                                    id="footer.custom.signature.premium"
                                    defaultMessage="Requires $50 monthly credits to customize signature"
                                  />
                                </Typography>
                              )}
                            </Grid>

                            {values.customSignature.enabled && isPaid && (
                              <>
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    fullWidth
                                    label={formatMessage({
                                      id: "footer.signature.text",
                                      defaultMessage: "Signature Text"
                                    })}
                                    value={values.customSignature.text}
                                    onChange={(e) => setFieldValue('customSignature.text', e.target.value)}
                                    placeholder="DexKit"
                                  />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    fullWidth
                                    label={formatMessage({
                                      id: "footer.signature.link",
                                      defaultMessage: "Signature Link"
                                    })}
                                    value={values.customSignature.link}
                                    onChange={(e) => setFieldValue('customSignature.link', e.target.value)}
                                    placeholder="https://www.dexkit.com"
                                  />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                  <FormControlLabel
                                    control={
                                      <Switch
                                        checked={values.customSignature.showAppName}
                                        onChange={(e) => setFieldValue('customSignature.showAppName', e.target.checked)}
                                      />
                                    }
                                    label={
                                      <FormattedMessage
                                        id="footer.show.app.name"
                                        defaultMessage="Show App Name"
                                      />
                                    }
                                  />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                  <FormControlLabel
                                    control={
                                      <Switch
                                        checked={values.customSignature.showLoveBy}
                                        onChange={(e) => setFieldValue('customSignature.showLoveBy', e.target.checked)}
                                      />
                                    }
                                    label={
                                      <FormattedMessage
                                        id="footer.show.love.by"
                                        defaultMessage="Show 'made with ❤️ by'"
                                      />
                                    }
                                  />
                                </Grid>

                                <Grid item xs={12}>
                                  <Typography variant="caption" color="text.secondary">
                                    <FormattedMessage
                                      id="footer.signature.preview"
                                      defaultMessage="Preview: {preview}"
                                      values={{
                                        preview: `${values.customSignature.showAppName ? `${config.name} ` : ''}${values.customSignature.showLoveBy ? 'made with ❤️ by ' : ''
                                          }${values.customSignature.text}`
                                      }}
                                    />
                                  </Typography>
                                </Grid>
                              </>
                            )}
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  <Grid item xs={12}>
                    <Stack spacing={1} direction="row" justifyContent="flex-end">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={submitForm}
                        disabled={
                          !hasChanged ||
                          (values.variant === 'glassmorphic' && !validateUniquePositions(
                            values.layout.signaturePosition,
                            values.layout.menuPosition,
                            values.layout.socialMediaPosition
                          ))
                        }
                        size={isMobile ? 'small' : 'medium'}
                        sx={{
                          fontSize: isMobile ? '0.875rem' : undefined,
                          py: isMobile ? 0.75 : undefined,
                          px: isMobile ? 2 : undefined,
                        }}
                      >
                        <FormattedMessage id="save" defaultMessage="Save" />
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </Grid>
    </Grid>
  );
} 