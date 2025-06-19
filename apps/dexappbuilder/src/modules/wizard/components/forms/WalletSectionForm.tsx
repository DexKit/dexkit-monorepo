import { useIsMobile } from '@dexkit/core';
import MediaDialog from '@dexkit/ui/components/mediaDialog';
import {
  AppPageSection,
  WalletGlassSettings,
  WalletPageSection,
  WalletSettings
} from '@dexkit/ui/modules/wizard/types/section';
import { Delete as DeleteIcon, Image as ImageIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  ButtonBase,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Slider,
  Stack,
  Switch,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import '@uiw/react-markdown-preview/markdown.css';
import '@uiw/react-md-editor/markdown-editor.css';
import { Formik, useFormikContext } from 'formik';
import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

interface Props {
  section?: WalletPageSection;
  onSave: (section: AppPageSection) => void;
  onChange: (section: AppPageSection) => void;
  onCancel: () => void;
}

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
  const isMobile = useIsMobile();

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
            maxWidth: { xs: '200px', sm: '240px' },
            '& .MuiInputBase-root': {
              fontSize: {
                xs: theme.typography.body2.fontSize,
                sm: theme.typography.body2.fontSize
              },
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
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
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
  const isMobile = useIsMobile();

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
          id="glass.background.image"
          defaultMessage="Background Image"
        />
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
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
            gap: 1,
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
                  id="glass.select.background.image"
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
            startIcon={<DeleteIcon />}
            onClick={handleRemoveImage}
            sx={{ minWidth: 'auto' }}
          >
            <FormattedMessage
              id="glass.remove.background.image"
              defaultMessage="Remove Background Image"
            />
          </Button>
        )}
      </Box>

      {value && (
        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>
                  <FormattedMessage
                    id="glass.background.size"
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
                      id="glass.background.size.cover"
                      defaultMessage="Cover (Fill Container)"
                    />
                  </MenuItem>
                  <MenuItem value="contain">
                    <FormattedMessage
                      id="glass.background.size.contain"
                      defaultMessage="Contain (Fit Inside)"
                    />
                  </MenuItem>
                  <MenuItem value="auto">
                    <FormattedMessage
                      id="glass.background.size.auto"
                      defaultMessage="Auto (Original Size)"
                    />
                  </MenuItem>
                  <MenuItem value="100% 100%">
                    <FormattedMessage
                      id="glass.background.size.stretch"
                      defaultMessage="Stretch (Fill Exactly)"
                    />
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>
                  <FormattedMessage
                    id="glass.background.position"
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
                      id="glass.background.position.center"
                      defaultMessage="Center"
                    />
                  </MenuItem>
                  <MenuItem value="top">
                    <FormattedMessage
                      id="glass.background.position.top"
                      defaultMessage="Top"
                    />
                  </MenuItem>
                  <MenuItem value="bottom">
                    <FormattedMessage
                      id="glass.background.position.bottom"
                      defaultMessage="Bottom"
                    />
                  </MenuItem>
                  <MenuItem value="left">
                    <FormattedMessage
                      id="glass.background.position.left"
                      defaultMessage="Left"
                    />
                  </MenuItem>
                  <MenuItem value="right">
                    <FormattedMessage
                      id="glass.background.position.right"
                      defaultMessage="Right"
                    />
                  </MenuItem>
                  <MenuItem value="top left">
                    <FormattedMessage
                      id="glass.background.position.top-left"
                      defaultMessage="Top Left"
                    />
                  </MenuItem>
                  <MenuItem value="top right">
                    <FormattedMessage
                      id="glass.background.position.top-right"
                      defaultMessage="Top Right"
                    />
                  </MenuItem>
                  <MenuItem value="bottom left">
                    <FormattedMessage
                      id="glass.background.position.bottom-left"
                      defaultMessage="Bottom Left"
                    />
                  </MenuItem>
                  <MenuItem value="bottom right">
                    <FormattedMessage
                      id="glass.background.position.bottom-right"
                      defaultMessage="Bottom Right"
                    />
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>
                  <FormattedMessage
                    id="glass.background.repeat"
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
                      id="glass.background.repeat.no-repeat"
                      defaultMessage="No Repeat"
                    />
                  </MenuItem>
                  <MenuItem value="repeat">
                    <FormattedMessage
                      id="glass.background.repeat.repeat"
                      defaultMessage="Repeat (Tile)"
                    />
                  </MenuItem>
                  <MenuItem value="repeat-x">
                    <FormattedMessage
                      id="glass.background.repeat.repeat-x"
                      defaultMessage="Repeat Horizontally"
                    />
                  </MenuItem>
                  <MenuItem value="repeat-y">
                    <FormattedMessage
                      id="glass.background.repeat.repeat-y"
                      defaultMessage="Repeat Vertically"
                    />
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>
                  <FormattedMessage
                    id="glass.background.attachment"
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
                      id="glass.background.attachment.scroll"
                      defaultMessage="Scroll (Normal)"
                    />
                  </MenuItem>
                  <MenuItem value="fixed">
                    <FormattedMessage
                      id="glass.background.attachment.fixed"
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

const getDefaultGlassSettings = (theme: any): WalletGlassSettings => ({
  backgroundType: "gradient",
  backgroundColor: theme.palette.background.default,
  gradientStartColor: theme.palette.background.default,
  gradientEndColor: theme.palette.background.paper,
  gradientDirection: "to bottom",
  textColor: theme.palette.text.primary,
  blurIntensity: 40,
  glassOpacity: 0.10,
  disableBackground: false,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundAttachment: "scroll",
});

function VariantConfigurationTab() {
  const { values, setFieldValue } = useFormikContext<WalletSettings>();
  const theme = useTheme();

  const getCurrentThemeGlassSettings = () => {
    const settings: WalletGlassSettings = {
      backgroundType: "gradient",
      backgroundColor: theme.palette.background.default,
      gradientStartColor: theme.palette.background.default,
      gradientEndColor: theme.palette.background.paper,
      gradientDirection: "to bottom",
      textColor: theme.palette.text.primary,
      blurIntensity: 40,
      glassOpacity: 0.10,
      disableBackground: false,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "scroll",
    };

    return settings;
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        px: { xs: 1, sm: 2, md: 3 }
      }}
    >
      <Typography variant="h6" gutterBottom>
        Wallet Variant Configuration
      </Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel>Variant</InputLabel>
        <Select
          value={values.variant || "default"}
          onChange={(e) => setFieldValue("variant", e.target.value)}
          label="Variant"
        >
          <MenuItem value="default">Default</MenuItem>
          <MenuItem value="glass">
            <FormattedMessage
              id="glass.variant"
              defaultMessage="Glass"
            />
          </MenuItem>
        </Select>
      </FormControl>

      {values.variant === "glass" && (
        <Paper elevation={1} sx={{ mt: 2, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            <FormattedMessage
              id="glass.variant"
              defaultMessage="Glass"
            />
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <FormattedMessage
              id="glass.description"
              defaultMessage="Modern glass effect"
            />
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
              <FormattedMessage
                id="glass.background.type"
                defaultMessage="Background Type"
              />
            </Typography>
            <RadioGroup
              value={values.glassSettings?.backgroundType || "gradient"}
              onChange={(e) => setFieldValue("glassSettings.backgroundType", e.target.value)}
              row
            >
              <FormControlLabel
                value="solid"
                control={<Radio />}
                label={
                  <FormattedMessage
                    id="glass.background.solid"
                    defaultMessage="Solid Color"
                  />
                }
              />
              <FormControlLabel
                value="gradient"
                control={<Radio />}
                label={
                  <FormattedMessage
                    id="glass.background.gradient"
                    defaultMessage="Gradient"
                  />
                }
              />
              <FormControlLabel
                value="image"
                control={<Radio />}
                label={
                  <FormattedMessage
                    id="glass.background.image"
                    defaultMessage="Background Image"
                  />
                }
              />
            </RadioGroup>

            {values.glassSettings?.backgroundType === "solid" && (
              <Box sx={{ mt: 2 }}>
                <ColorPickerField
                  label="Background Color"
                  value={values.glassSettings?.backgroundColor || theme.palette.background.default}
                  onChange={(value: string) => setFieldValue("glassSettings.backgroundColor", value)}
                  defaultValue={theme.palette.background.default}
                />
              </Box>
            )}

            {values.glassSettings?.backgroundType === "gradient" && (
              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <ColorPickerField
                  label="Gradient Start Color"
                  value={values.glassSettings?.gradientStartColor || theme.palette.background.default}
                  onChange={(value: string) => setFieldValue("glassSettings.gradientStartColor", value)}
                  defaultValue={theme.palette.background.default}
                />
                <ColorPickerField
                  label="Gradient End Color"
                  value={values.glassSettings?.gradientEndColor || theme.palette.background.paper}
                  onChange={(value: string) => setFieldValue("glassSettings.gradientEndColor", value)}
                  defaultValue={theme.palette.background.paper}
                />
                <FormControl fullWidth>
                  <InputLabel>
                    <FormattedMessage
                      id="glass.gradient.direction"
                      defaultMessage="Gradient Direction"
                    />
                  </InputLabel>
                  <Select
                    value={values.glassSettings?.gradientDirection || "to bottom"}
                    onChange={(e) => setFieldValue("glassSettings.gradientDirection", e.target.value)}
                    label="Gradient Direction"
                  >
                    <MenuItem value="to bottom">
                      <FormattedMessage
                        id="glass.gradient.direction.bottom"
                        defaultMessage="Top to Bottom"
                      />
                    </MenuItem>
                    <MenuItem value="to top">
                      <FormattedMessage
                        id="glass.gradient.direction.top"
                        defaultMessage="Bottom to Top"
                      />
                    </MenuItem>
                    <MenuItem value="to right">
                      <FormattedMessage
                        id="glass.gradient.direction.right"
                        defaultMessage="Left to Right"
                      />
                    </MenuItem>
                    <MenuItem value="to left">
                      <FormattedMessage
                        id="glass.gradient.direction.left"
                        defaultMessage="Right to Left"
                      />
                    </MenuItem>
                    <MenuItem value="to bottom right">
                      <FormattedMessage
                        id="glass.gradient.direction.bottom.right"
                        defaultMessage="Diagonal (Top-Left to Bottom-Right)"
                      />
                    </MenuItem>
                    <MenuItem value="to bottom left">
                      <FormattedMessage
                        id="glass.gradient.direction.bottom.left"
                        defaultMessage="Diagonal (Top-Right to Bottom-Left)"
                      />
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}

            {values.glassSettings?.backgroundType === "image" && (
              <BackgroundImageSelector
                value={values.glassSettings?.backgroundImage}
                onChange={(url: string | undefined) => setFieldValue("glassSettings.backgroundImage", url)}
                sizeValue={values.glassSettings?.backgroundSize}
                onSizeChange={(size: string) => setFieldValue("glassSettings.backgroundSize", size)}
                positionValue={values.glassSettings?.backgroundPosition}
                onPositionChange={(position: string) => setFieldValue("glassSettings.backgroundPosition", position)}
                repeatValue={values.glassSettings?.backgroundRepeat}
                onRepeatChange={(repeat: string) => setFieldValue("glassSettings.backgroundRepeat", repeat)}
                attachmentValue={values.glassSettings?.backgroundAttachment}
                onAttachmentChange={(attachment: string) => setFieldValue("glassSettings.backgroundAttachment", attachment)}
              />
            )}

            <Box sx={{ mt: 3 }}>
              <ColorPickerField
                label="Text Color"
                value={values.glassSettings?.textColor || theme.palette.text.primary}
                onChange={(value: string) => setFieldValue("glassSettings.textColor", value)}
                defaultValue={theme.palette.text.primary}
              />
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                <FormattedMessage
                  id="glass.glassmorphism"
                  defaultMessage="Glassmorphism Effects"
                />
              </Typography>

              <Box sx={{ mt: 2 }}>
                <Typography gutterBottom>
                  <FormattedMessage
                    id="glass.blur.intensity"
                    defaultMessage="Blur Intensity"
                  />
                </Typography>
                <Slider
                  value={values.glassSettings?.blurIntensity || 40}
                  onChange={(_, value: number | number[]) => setFieldValue("glassSettings.blurIntensity", value)}
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
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography gutterBottom>
                  <FormattedMessage
                    id="glass.opacity"
                    defaultMessage="Glass Opacity"
                  />
                </Typography>
                <Slider
                  value={values.glassSettings?.glassOpacity || 0.10}
                  onChange={(_, value: number | number[]) => setFieldValue("glassSettings.glassOpacity", value)}
                  min={0.01}
                  max={0.15}
                  step={0.01}
                  valueLabelDisplay="auto"
                  marks={[
                    { value: 0.05, label: '0.05' },
                    { value: 0.10, label: '0.10' },
                    { value: 0.15, label: '0.15' },
                  ]}
                />
              </Box>

              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={values.glassSettings?.disableBackground || false}
                      onChange={(e) => setFieldValue("glassSettings.disableBackground", e.target.checked)}
                    />
                  }
                  label={
                    <FormattedMessage
                      id="glass.disable.background"
                      defaultMessage="Disable Background"
                    />
                  }
                />
                <Typography variant="body2" color="text.secondary">
                  <FormattedMessage
                    id="glass.disable.background.description"
                    defaultMessage="Remove background colors for complete transparency"
                  />
                </Typography>
              </Box>
            </Box>



            <Typography variant="body2" color="text.secondary" sx={{ mt: 4, fontStyle: 'italic' }}>
              <FormattedMessage
                id="glass.cards.inputs.note"
                defaultMessage="Note: Cards and input fields automatically use glassmorphism effects for a cohesive visual experience. Text elements inherit the main text color for consistency."
              />
            </Typography>
          </Box>
        </Paper>
      )}
    </Container>
  );
}

export default function WalletSectionForm({
  section,
  onSave,
  onChange,
  onCancel,
}: Props) {
  const isMobile = useIsMobile();
  const theme = useTheme();

  const initialValues = useMemo((): WalletSettings => {
    if (section?.settings) {
      return {
        variant: section.settings.variant || "default",
        glassSettings: section.settings.glassSettings || getDefaultGlassSettings(theme),
      };
    }
    return {
      variant: "default",
      glassSettings: getDefaultGlassSettings(theme),
    };
  }, [section, theme]);

  const handleSubmit = (values: WalletSettings) => {
    const updatedSection: WalletPageSection = {
      ...section,
      type: 'wallet',
      settings: values,
    };
    onSave(updatedSection);
  };

  const handleValidate = (values: WalletSettings) => {
    const updatedSection: WalletPageSection = {
      ...section,
      type: 'wallet',
      settings: values,
    };
    onChange(updatedSection);
  };

  useEffect(() => {
    const updatedSection: WalletPageSection = {
      ...section,
      type: 'wallet',
      settings: initialValues,
    };
    onChange(updatedSection);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validate={handleValidate}
        enableReinitialize
      >
        {({ submitForm, values, isValid }) => (
          <Grid container spacing={isMobile ? 1.5 : 2}>
            <Grid item xs={12}>
              <VariantConfigurationTab />
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={isMobile ? 1 : 2} direction="row" justifyContent="flex-end">
                <Button onClick={onCancel} size={isMobile ? "small" : "medium"}>
                  <FormattedMessage id="cancel" defaultMessage="Cancel" />
                </Button>
                <Button
                  onClick={submitForm}
                  variant="contained"
                  color="primary"
                  size={isMobile ? "small" : "medium"}
                  disabled={!isValid}
                >
                  <FormattedMessage id="save" defaultMessage="Save" />
                </Button>
              </Stack>
            </Grid>
          </Grid>
        )}
      </Formik>
    </Container>
  );
}
