import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Chip,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Slider,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  TextField as TextFieldMui,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { Field, Formik, getIn } from "formik";

import FormikDecimalInput from "@dexkit/ui/components/FormikDecimalInput";
import MediaDialog from "@dexkit/ui/components/mediaDialog";

import { ChainId, useIsMobile } from "@dexkit/core";
import { NETWORKS } from "@dexkit/core/constants/networks";
import { Token } from "@dexkit/core/types";
import {
  getChainName,
  ipfsUriToUrl,
  isAddressEqual,
  parseChainId,
} from "@dexkit/core/utils";
import { Select as FormikSelect } from "formik-mui";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { DexkitExchangeSettings, ExchangeSettingsSchema, ExchangeVariant } from "../../types";
import FormActions from "./ExchangeSettingsFormActions";

import { ZEROEX_AFFILIATE_ADDRESS } from "@dexkit/ui/modules/swap/constants";
import {
  Delete as DeleteIcon,
  DragIndicator as DragIndicatorIcon,
  Image as ImageIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  SwapHoriz as SwapHorizIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import Edit from "@mui/icons-material/Edit";
import { useFormikContext } from "formik";
import setWith from "lodash/setWith";
import { ZEROX_SUPPORTED_NETWORKS } from "../../constants";
import {
  BASE_TOKENS_SUGGESTION,
  DEFAULT_TOKENS,
  EXTENDED_QUOTE_TOKENS_SUGGESTION,
} from "../../constants/tokens";
import ExchangeQuoteTokensInput from "./ExchangeQuoteTokensInput";
import ExchangeTokenInput from "./ExchangeTokenInput";
import SelectNetworksDialog from "./SelectNetworksDialog";

function SaveOnChangeListener({
  onSave,
  onValidate,
}: {
  onSave: (settings: DexkitExchangeSettings) => void;
  onValidate?: (isValid: boolean) => void;
}) {
  const { values, isValid, errors } = useFormikContext<DexkitExchangeSettings>();

  useEffect(() => {
    onSave(values);
  }, [values, isValid]);

  useEffect(() => {
    if (onValidate) {
      onValidate(isValid);
    }

  }, [isValid, onValidate, errors, values]);

  return null;
}

export interface ExchangeSettingsFormProps {
  onCancel: () => void;
  onSave: (settings: DexkitExchangeSettings) => void;
  onChange?: (settings: DexkitExchangeSettings) => void;
  saveOnChange?: boolean;
  showSaveButton?: boolean;
  settings?: DexkitExchangeSettings;
  tokens: Token[];
  activeChainIds: number[];
  onValidate?: (isValid: boolean) => void;
  customTheme?: any;
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

  const onChangeRef = useRef(onChange);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  onChangeRef.current = onChange;

  const handleColorChange = useCallback((newValue: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onChangeRef.current(newValue);
    }, 50);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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
            onChange={(e: any) => handleColorChange(e.target.value)}
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
          onChange={(e: any) => handleColorChange(e.target.value)}
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
            <div >
              <FormControl fullWidth size="small">
                <InputLabel>
                  <FormattedMessage
                    id="glass.background.size"
                    defaultMessage="Image Size"
                  />
                </InputLabel>
                <Select
                  value={sizeValue || "cover"}
                  onChange={(e) => onSizeChange(e.target.value)}
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
            </div>

            <div >
              <FormControl fullWidth size="small">
                <InputLabel>
                  <FormattedMessage
                    id="glass.background.position"
                    defaultMessage="Image Position"
                  />
                </InputLabel>
                <Select
                  value={positionValue || "center"}
                  onChange={(e) => onPositionChange(e.target.value)}
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
            </div>

            <div >
              <FormControl fullWidth size="small">
                <InputLabel>
                  <FormattedMessage
                    id="glass.background.repeat"
                    defaultMessage="Image Repeat"
                  />
                </InputLabel>
                <Select
                  value={repeatValue || "no-repeat"}
                  onChange={(e) => onRepeatChange(e.target.value)}
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
            </div>

            <div >
              <FormControl fullWidth size="small">
                <InputLabel>
                  <FormattedMessage
                    id="glass.background.attachment"
                    defaultMessage="Image Attachment"
                  />
                </InputLabel>
                <Select
                  value={attachmentValue || "scroll"}
                  onChange={(e) => onAttachmentChange(e.target.value)}
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
            </div>
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

const getDefaultGlassSettings = (theme: any) => ({
  backgroundType: "solid" as const,
  backgroundColor: theme.palette.background.default,
  gradientStartColor: theme.palette.background.default,
  gradientEndColor: theme.palette.background.paper,
  gradientDirection: "to bottom" as const,
  textColor: theme.palette.text.primary,
  blurIntensity: 40,
  glassOpacity: 0.10,
  disableBackground: false,
  buyTabColor: theme.palette.success.main,
  sellTabColor: theme.palette.error.main,
  buyTabTextColor: theme.palette.success.contrastText,
  sellTabTextColor: theme.palette.error.contrastText,
  buyText: "",
  sellText: "",
  fillButtonBackgroundColor: theme.palette.primary.main,
  fillButtonTextColor: theme.palette.primary.contrastText,
  fillButtonHoverBackgroundColor: theme.palette.primary.dark,
  fillButtonHoverTextColor: theme.palette.primary.contrastText,
  fillButtonDisabledBackgroundColor: theme.palette.action.disabled,
  fillButtonDisabledTextColor: theme.palette.action.disabledBackground,
  backgroundSize: "cover" as const,
  backgroundPosition: "center" as const,
  backgroundRepeat: "no-repeat" as const,
  backgroundAttachment: "scroll" as const,
});

const getCustomGlassSettings = (customTheme?: any) => {

  let palette = null;

  if (customTheme?.palette) {
    palette = customTheme.palette;
  }
  else if (customTheme?.colorSchemes) {
    const lightPalette = customTheme.colorSchemes.light?.palette;
    const darkPalette = customTheme.colorSchemes.dark?.palette;
    palette = lightPalette || darkPalette;
  }

  if (palette) {
    return {
      backgroundType: "solid" as const,
      backgroundColor: palette.background?.default || "#FFFFFF",
      gradientStartColor: palette.background?.default || "#FFFFFF",
      gradientEndColor: palette.background?.paper || "#FAFAFA",
      gradientDirection: "to bottom" as const,
      textColor: palette.text?.primary || "#0E1116",
      blurIntensity: 40,
      glassOpacity: 0.10,
      disableBackground: false,
      buyTabColor: palette.success?.main || palette.primary?.main || "#36AB47",
      sellTabColor: palette.error?.main || palette.secondary?.main || "#FF1053",
      buyTabTextColor: "#ffffff",
      sellTabTextColor: "#ffffff",
      buyText: "",
      sellText: "",
      fillButtonBackgroundColor: palette.primary?.main || "#3B51F7",
      fillButtonTextColor: "#ffffff",
      fillButtonHoverBackgroundColor: palette.primary?.dark || "#081EC4",
      fillButtonHoverTextColor: "#ffffff",
      fillButtonDisabledBackgroundColor: "#666666",
      fillButtonDisabledTextColor: "#999999",
      backgroundSize: "cover" as const,
      backgroundPosition: "center" as const,
      backgroundRepeat: "no-repeat" as const,
      backgroundAttachment: "scroll" as const,
    };
  }

  return {
    backgroundType: "gradient" as const,
    backgroundColor: "#FFFFFF",
    gradientStartColor: "#FFFFFF",
    gradientEndColor: "#FAFAFA",
    gradientDirection: "to bottom" as const,
    textColor: "#0E1116",
    blurIntensity: 40,
    glassOpacity: 0.10,
    disableBackground: false,
    buyTabColor: "#36AB47",
    sellTabColor: "#FF1053",
    buyTabTextColor: "#ffffff",
    sellTabTextColor: "#ffffff",
    buyText: "",
    sellText: "",
    fillButtonBackgroundColor: "#3B51F7",
    fillButtonTextColor: "#ffffff",
    fillButtonHoverBackgroundColor: "#081EC4",
    fillButtonHoverTextColor: "#ffffff",
    fillButtonDisabledBackgroundColor: "#666666",
    fillButtonDisabledTextColor: "#999999",
    backgroundSize: "cover" as const,
    backgroundPosition: "center" as const,
    backgroundRepeat: "no-repeat" as const,
    backgroundAttachment: "scroll" as const,
  };
};

function VariantConfigurationTab({ customTheme }: { customTheme?: any }) {
  const { values, setFieldValue } = useFormikContext<DexkitExchangeSettings>();
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();

  const memoizedSetFieldValue = useCallback((field: string, value: any) => {
    setFieldValue(field, value);
  }, [setFieldValue]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getCurrentThemeGlassSettings = () => {

    if (customTheme && customTheme.colorSchemes) {
      const colorScheme = customTheme.colorSchemes.light || customTheme.colorSchemes.dark;

      if (colorScheme && colorScheme.palette) {
        const palette = colorScheme.palette;

        const settings = {
          backgroundType: "solid" as const,
          backgroundColor: palette.background?.default || "#FFFFFF",
          gradientStartColor: palette.background?.default || "#FFFFFF",
          gradientEndColor: palette.background?.paper || "#FAFAFA",
          gradientDirection: "to bottom" as const,
          textColor: palette.text?.primary || "#0E1116",
          blurIntensity: 40,
          glassOpacity: 0.10,
          disableBackground: false,
          buyTabColor: palette.success?.main || "#36AB47",
          sellTabColor: palette.error?.main || "#FF1053",
          buyTabTextColor: "#ffffff",
          sellTabTextColor: "#ffffff",
          buyText: "",
          sellText: "",
          fillButtonBackgroundColor: palette.primary?.main || "#3B51F7",
          fillButtonTextColor: "#ffffff",
          fillButtonHoverBackgroundColor: palette.primary?.dark || "#081EC4",
          fillButtonHoverTextColor: "#ffffff",
          fillButtonDisabledBackgroundColor: "#666666",
          fillButtonDisabledTextColor: "#999999",
          backgroundSize: "cover" as const,
          backgroundPosition: "center" as const,
          backgroundRepeat: "no-repeat" as const,
          backgroundAttachment: "scroll" as const,
        };

        return settings;
      }
    }

    const settings = {
      backgroundType: "solid" as const,
      backgroundColor: theme.palette.background.default,
      gradientStartColor: theme.palette.background.default,
      gradientEndColor: theme.palette.background.paper,
      gradientDirection: "to bottom" as const,
      textColor: theme.palette.text.primary,
      blurIntensity: 40,
      glassOpacity: 0.10,
      disableBackground: false,
      buyTabColor: theme.palette.success.main,
      sellTabColor: theme.palette.error.main,
      buyTabTextColor: "#ffffff",
      sellTabTextColor: "#ffffff",
      buyText: "",
      sellText: "",
      fillButtonBackgroundColor: theme.palette.primary.main,
      fillButtonTextColor: "#ffffff",
      fillButtonHoverBackgroundColor: theme.palette.primary.dark,
      fillButtonHoverTextColor: "#ffffff",
      fillButtonDisabledBackgroundColor: "#666666",
      fillButtonDisabledTextColor: "#999999",
      backgroundSize: "cover" as const,
      backgroundPosition: "center" as const,
      backgroundRepeat: "no-repeat" as const,
      backgroundAttachment: "scroll" as const,
    };

    return settings;
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: { xs: '100%', sm: '600px', md: '700px' },
        mx: 'auto'
      }}
    >
      <Typography variant="h6" gutterBottom>
        Exchange Variant Configuration
      </Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel>Variant</InputLabel>
        <Select
          value={values.variant || "default"}
          onChange={(e) => setFieldValue("variant", e.target.value)}
          label="Variant"
        >
          <MenuItem value="default">Default</MenuItem>
          <MenuItem value="custom">Custom</MenuItem>
          <MenuItem value="glass">
            <FormattedMessage
              id="glass.variant"
              defaultMessage="Glass"
            />
          </MenuItem>
        </Select>
      </FormControl>

      {values.variant === "custom" && (
        <Paper elevation={1} sx={{
          mt: 2,
          p: 2,
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <Typography variant="h6" gutterBottom>
            Custom Variant Settings
          </Typography>

          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mt: 2 }}>
            <Tab label="Layout" />
            <Tab label="Components" />
            <Tab label="Container" />
            <Tab label="Pair Info" />
            <Tab label="Trade Widget" />
            <Tab label="Chart Colors" />
          </Tabs>

          {tabValue === 0 && (
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Layout Type</InputLabel>
                <Select
                  value={values.customVariantSettings?.layout || "grid"}
                  onChange={(e) => setFieldValue("customVariantSettings.layout", e.target.value)}
                  label="Layout Type"
                >
                  <MenuItem value="grid">Grid</MenuItem>
                  <MenuItem value="horizontal">Horizontal</MenuItem>
                  <MenuItem value="vertical">Vertical</MenuItem>
                </Select>
              </FormControl>

              <Typography gutterBottom sx={{ mt: 2 }}>
                Spacing: {values.customVariantSettings?.spacing || 2}
              </Typography>
              <Slider
                value={values.customVariantSettings?.spacing || 2}
                onChange={(e: Event, value: number | number[]) => {
                  const newValue = Array.isArray(value) ? value[0] : value;
                  setFieldValue("customVariantSettings.spacing", newValue);
                }}
                min={0}
                max={8}
                step={1}
                marks
                valueLabelDisplay="auto"
              />
            </Box>
          )}

          {tabValue === 1 && (
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={values.customVariantSettings?.showPairInfo !== false}
                    onChange={(e: any) => setFieldValue("customVariantSettings.showPairInfo", e.target.checked)}
                  />
                }
                label="Show Pair Information"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={values.customVariantSettings?.showTradingGraph !== false}
                    onChange={(e: any) => setFieldValue("customVariantSettings.showTradingGraph", e.target.checked)}
                  />
                }
                label="Show Trading Graph"
                sx={{ display: "block" }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={values.customVariantSettings?.showTradeWidget !== false}
                    onChange={(e: any) => setFieldValue("customVariantSettings.showTradeWidget", e.target.checked)}
                  />
                }
                label="Show Trade Widget"
                sx={{ display: "block" }}
              />

              <Box sx={{ mt: 3 }}>
                <DragDropComponentOrder
                  value={values.customVariantSettings?.componentOrder || ['pairInfo', 'tradeWidget', 'tradingGraph']}
                  onChange={(newOrder) => setFieldValue("customVariantSettings.componentOrder", newOrder)}
                />
              </Box>
            </Box>
          )}

          {tabValue === 2 && (
            <Box sx={{ mt: 2 }}>
              <ColorPickerField
                label="Background Color"
                value={values.customVariantSettings?.backgroundColor || ""}
                onChange={(value) => memoizedSetFieldValue("customVariantSettings.backgroundColor", value)}
                defaultValue={theme.palette.background.default}
              />

              <BackgroundImageSelector
                value={values.customVariantSettings?.backgroundImage}
                onChange={(url) => setFieldValue("customVariantSettings.backgroundImage", url)}
                sizeValue={values.customVariantSettings?.backgroundSize}
                onSizeChange={(size) => setFieldValue("customVariantSettings.backgroundSize", size)}
                positionValue={values.customVariantSettings?.backgroundPosition}
                onPositionChange={(position) => setFieldValue("customVariantSettings.backgroundPosition", position)}
                repeatValue={values.customVariantSettings?.backgroundRepeat}
                onRepeatChange={(repeat) => setFieldValue("customVariantSettings.backgroundRepeat", repeat)}
                attachmentValue={values.customVariantSettings?.backgroundAttachment}
                onAttachmentChange={(attachment) => setFieldValue("customVariantSettings.backgroundAttachment", attachment)}
              />

              <Typography gutterBottom sx={{ mt: 2 }}>
                Border Radius: {values.customVariantSettings?.borderRadius || 0}px
              </Typography>
              <Slider
                value={values.customVariantSettings?.borderRadius || 0}
                onChange={(e: Event, value: number | number[]) => {
                  const newValue = Array.isArray(value) ? value[0] : value;
                  setFieldValue("customVariantSettings.borderRadius", newValue);
                }}
                min={0}
                max={50}
                step={1}
                valueLabelDisplay="auto"
              />

              <Typography gutterBottom sx={{ mt: 2 }}>
                Padding: {values.customVariantSettings?.padding || 2}
              </Typography>
              <Slider
                value={values.customVariantSettings?.padding || 2}
                onChange={(e: Event, value: number | number[]) => {
                  const newValue = Array.isArray(value) ? value[0] : value;
                  setFieldValue("customVariantSettings.padding", newValue);
                }}
                min={0}
                max={8}
                step={1}
                marks
                valueLabelDisplay="auto"
              />
            </Box>
          )}

          {tabValue === 3 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>Pair Info Colors</Typography>

              <ColorPickerField
                label="Background Color"
                value={values.customVariantSettings?.pairInfoBackgroundColor || ""}
                onChange={(value) => memoizedSetFieldValue("customVariantSettings.pairInfoBackgroundColor", value)}
                defaultValue={theme.palette.background.paper}
              />

              <ColorPickerField
                label="Text Color"
                value={values.customVariantSettings?.pairInfoTextColor || ""}
                onChange={(value) => memoizedSetFieldValue("customVariantSettings.pairInfoTextColor", value)}
                defaultValue={theme.palette.text.primary}
              />

              <ColorPickerField
                label="Border Color"
                value={values.customVariantSettings?.pairInfoBorderColor || ""}
                onChange={(value) => memoizedSetFieldValue("customVariantSettings.pairInfoBorderColor", value)}
                defaultValue={theme.palette.divider}
              />
            </Box>
          )}

          {tabValue === 4 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>Trade Widget Colors</Typography>

              <ColorPickerField
                label="Background Color"
                value={values.customVariantSettings?.tradeWidgetBackgroundColor || ""}
                onChange={(value) => memoizedSetFieldValue("customVariantSettings.tradeWidgetBackgroundColor", value)}
                defaultValue={theme.palette.background.paper}
              />

              <ColorPickerField
                label="Text Color"
                value={values.customVariantSettings?.tradeWidgetTextColor || ""}
                onChange={(value) => memoizedSetFieldValue("customVariantSettings.tradeWidgetTextColor", value)}
                defaultValue={theme.palette.text.primary}
              />

              <ColorPickerField
                label="Border Color"
                value={values.customVariantSettings?.tradeWidgetBorderColor || ""}
                onChange={(value) => memoizedSetFieldValue("customVariantSettings.tradeWidgetBorderColor", value)}
                defaultValue={theme.palette.divider}
              />

              <ColorPickerField
                label="Button Color"
                value={values.customVariantSettings?.tradeWidgetButtonColor || ""}
                onChange={(value) => memoizedSetFieldValue("customVariantSettings.tradeWidgetButtonColor", value)}
                defaultValue={theme.palette.primary.main}
              />

              <ColorPickerField
                label="Button Text Color"
                value={values.customVariantSettings?.tradeWidgetButtonTextColor || ""}
                onChange={(value) => memoizedSetFieldValue("customVariantSettings.tradeWidgetButtonTextColor", value)}
                defaultValue={theme.palette.primary.contrastText}
              />
            </Box>
          )}

          {tabValue === 5 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>Trading Graph Colors</Typography>

              <ColorPickerField
                label="Background Color"
                value={values.customVariantSettings?.tradingGraphBackgroundColor || ""}
                onChange={(value) => memoizedSetFieldValue("customVariantSettings.tradingGraphBackgroundColor", value)}
                defaultValue={theme.palette.background.paper}
              />

              <ColorPickerField
                label="Border Color"
                value={values.customVariantSettings?.tradingGraphBorderColor || ""}
                onChange={(value) => memoizedSetFieldValue("customVariantSettings.tradingGraphBorderColor", value)}
                defaultValue={theme.palette.divider}
              />
            </Box>
          )}
        </Paper>
      )}

      {values.variant === "glass" && (
        <Paper elevation={1} sx={{
          mt: 2,
          p: 2,
          width: '100%',
          boxSizing: 'border-box'
        }}>
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
              value={values.glassSettings?.backgroundType || "solid"}
              onChange={(e) => {
                const newType = e.target.value as 'solid' | 'gradient' | 'image';

                setFieldValue("glassSettings.backgroundType", newType);

                setTimeout(() => {
                  if (newType === 'solid' && !values.glassSettings?.backgroundColor) {
                    setFieldValue("glassSettings.backgroundColor", theme.palette.background.default);
                  } else if (newType === 'gradient') {
                    if (!values.glassSettings?.gradientStartColor) {
                      setFieldValue("glassSettings.gradientStartColor", theme.palette.background.default);
                    }
                    if (!values.glassSettings?.gradientEndColor) {
                      setFieldValue("glassSettings.gradientEndColor", theme.palette.background.paper);
                    }
                    if (!values.glassSettings?.gradientDirection) {
                      setFieldValue("glassSettings.gradientDirection", "to bottom");
                    }
                  }
                }, 0);
              }}
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
                  onChange={(value) => memoizedSetFieldValue("glassSettings.backgroundColor", value)}
                  defaultValue={theme.palette.background.default}
                />
              </Box>
            )}

            {values.glassSettings?.backgroundType === "gradient" && (
              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <ColorPickerField
                  label="Gradient Start Color"
                  value={values.glassSettings?.gradientStartColor || theme.palette.background.default}
                  onChange={(value) => memoizedSetFieldValue("glassSettings.gradientStartColor", value)}
                  defaultValue={theme.palette.background.default}
                />
                <ColorPickerField
                  label="Gradient End Color"
                  value={values.glassSettings?.gradientEndColor || theme.palette.background.paper}
                  onChange={(value) => memoizedSetFieldValue("glassSettings.gradientEndColor", value)}
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
                    onChange={(e) => memoizedSetFieldValue("glassSettings.gradientDirection", e.target.value)}
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
                onChange={useCallback((url) => setFieldValue("glassSettings.backgroundImage", url), [setFieldValue])}
                sizeValue={values.glassSettings?.backgroundSize}
                onSizeChange={useCallback((size) => setFieldValue("glassSettings.backgroundSize", size), [setFieldValue])}
                positionValue={values.glassSettings?.backgroundPosition}
                onPositionChange={useCallback((position) => setFieldValue("glassSettings.backgroundPosition", position), [setFieldValue])}
                repeatValue={values.glassSettings?.backgroundRepeat}
                onRepeatChange={useCallback((repeat) => setFieldValue("glassSettings.backgroundRepeat", repeat), [setFieldValue])}
                attachmentValue={values.glassSettings?.backgroundAttachment}
                onAttachmentChange={useCallback((attachment) => setFieldValue("glassSettings.backgroundAttachment", attachment), [setFieldValue])}
              />
            )}

            <Box sx={{ mt: 3 }}>
              <ColorPickerField
                label="Text Color"
                value={values.glassSettings?.textColor || theme.palette.text.primary}
                onChange={(value) => memoizedSetFieldValue("glassSettings.textColor", value)}
                defaultValue={theme.palette.text.primary}
              />
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography gutterBottom>
                <FormattedMessage
                  id="glass.blur.intensity"
                  defaultMessage="Blur Intensity"
                />
                : {values.glassSettings?.blurIntensity || 80}px
              </Typography>
              <Slider
                value={values.glassSettings?.blurIntensity || 80}
                onChange={(e: Event, value: number | number[]) => {
                  const newValue = Array.isArray(value) ? value[0] : value;
                  setFieldValue("glassSettings.blurIntensity", newValue);
                }}
                min={20}
                max={120}
                step={10}
                marks
                valueLabelDisplay="auto"
              />
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography gutterBottom>
                <FormattedMessage
                  id="glass.opacity"
                  defaultMessage="Glass Opacity"
                />
                : {((values.glassSettings?.glassOpacity || 0.10) * 100).toFixed(0)}%
              </Typography>
              <Slider
                value={values.glassSettings?.glassOpacity || 0.10}
                onChange={(e: Event, value: number | number[]) => {
                  const newValue = Array.isArray(value) ? value[0] : value;
                  setFieldValue("glassSettings.glassOpacity", newValue);
                }}
                min={0.02}
                max={0.30}
                step={0.02}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${(value * 100).toFixed(0)}%`}
              />
            </Box>

            <Box sx={{ mt: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={values.glassSettings?.disableBackground || false}
                    onChange={(e: any) => setFieldValue("glassSettings.disableBackground", e.target.checked)}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2">
                      <FormattedMessage
                        id="glass.disable.background"
                        defaultMessage="Disable Background"
                      />
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      <FormattedMessage
                        id="glass.disable.background.description"
                        defaultMessage="Remove background colors for complete transparency"
                      />
                    </Typography>
                  </Box>
                }
              />
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                <FormattedMessage
                  id="glass.tabs.customization"
                  defaultMessage="Tabs Customization"
                />
              </Typography>

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 2 }}>
                <FormattedMessage
                  id="glass.tabs.colors"
                  defaultMessage="Tab Colors"
                />
              </Typography>
              <Grid container spacing={2}>
                <div >
                  <ColorPickerField
                    label="Buy Tab Color"
                    value={values.glassSettings?.buyTabColor || theme.palette.success.main}
                    onChange={(value) => memoizedSetFieldValue("glassSettings.buyTabColor", value)}
                    defaultValue={theme.palette.success.main}
                  />
                </div>
                <div >
                  <ColorPickerField
                    label="Sell Tab Color"
                    value={values.glassSettings?.sellTabColor || theme.palette.error.main}
                    onChange={(value) => memoizedSetFieldValue("glassSettings.sellTabColor", value)}
                    defaultValue={theme.palette.error.main}
                  />
                </div>
                <div >
                  <ColorPickerField
                    label="Buy Tab Text Color"
                    value={values.glassSettings?.buyTabTextColor || theme.palette.success.contrastText}
                    onChange={(value) => memoizedSetFieldValue("glassSettings.buyTabTextColor", value)}
                    defaultValue={theme.palette.success.contrastText}
                  />
                </div>
                <div >
                  <ColorPickerField
                    label="Sell Tab Text Color"
                    value={values.glassSettings?.sellTabTextColor || theme.palette.error.contrastText}
                    onChange={(value) => memoizedSetFieldValue("glassSettings.sellTabTextColor", value)}
                    defaultValue={theme.palette.error.contrastText}
                  />
                </div>
              </Grid>

              <Typography variant="subtitle2" sx={{ mt: 3, mb: 2 }}>
                <FormattedMessage
                  id="glass.tabs.texts"
                  defaultMessage="Tab Texts"
                />
              </Typography>
              <Grid container spacing={2}>
                <div >
                  <TextField
                    fullWidth
                    label={
                      <FormattedMessage
                        id="glass.buy.text"
                        defaultMessage="Buy Text"
                      />
                    }
                    value={values.glassSettings?.buyText || ""}
                    onChange={(e: any) => setFieldValue("glassSettings.buyText", e.target.value)}
                    placeholder="BUY"
                    size="small"
                  />
                </div>
                <div >
                  <TextField
                    fullWidth
                    label={
                      <FormattedMessage
                        id="glass.sell.text"
                        defaultMessage="Sell Text"
                      />
                    }
                    value={values.glassSettings?.sellText || ""}
                    onChange={(e: any) => setFieldValue("glassSettings.sellText", e.target.value)}
                    placeholder="SELL"
                    size="small"
                  />
                </div>
              </Grid>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                <FormattedMessage
                  id="glass.fill.button.customization"
                  defaultMessage="Fill Button Customization"
                />
              </Typography>

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 2 }}>
                <FormattedMessage
                  id="glass.fill.button.colors"
                  defaultMessage="Fill Button Colors"
                />
              </Typography>
              <Grid container spacing={2}>
                <div >
                  <ColorPickerField
                    label="Background Color"
                    value={values.glassSettings?.fillButtonBackgroundColor || theme.palette.primary.main}
                    onChange={(value) => memoizedSetFieldValue("glassSettings.fillButtonBackgroundColor", value)}
                    defaultValue={theme.palette.primary.main}
                  />
                </div>
                <div >
                  <ColorPickerField
                    label="Text Color"
                    value={values.glassSettings?.fillButtonTextColor || theme.palette.primary.contrastText}
                    onChange={(value) => memoizedSetFieldValue("glassSettings.fillButtonTextColor", value)}
                    defaultValue={theme.palette.primary.contrastText}
                  />
                </div>
              </Grid>

              <Typography variant="subtitle2" sx={{ mt: 3, mb: 2 }}>
                <FormattedMessage
                  id="glass.fill.button.states"
                  defaultMessage="Button States"
                />
              </Typography>
              <Grid container spacing={2}>
                <div >
                  <ColorPickerField
                    label="Hover Background"
                    value={values.glassSettings?.fillButtonHoverBackgroundColor || theme.palette.primary.dark}
                    onChange={(value) => memoizedSetFieldValue("glassSettings.fillButtonHoverBackgroundColor", value)}
                    defaultValue={theme.palette.primary.dark}
                  />
                </div>
                <div >
                  <ColorPickerField
                    label="Hover Text"
                    value={values.glassSettings?.fillButtonHoverTextColor || theme.palette.primary.contrastText}
                    onChange={(value) => memoizedSetFieldValue("glassSettings.fillButtonHoverTextColor", value)}
                    defaultValue={theme.palette.primary.contrastText}
                  />
                </div>
                <div >
                  <ColorPickerField
                    label="Disabled Background"
                    value={values.glassSettings?.fillButtonDisabledBackgroundColor || theme.palette.action.disabled}
                    onChange={(value) => memoizedSetFieldValue("glassSettings.fillButtonDisabledBackgroundColor", value)}
                    defaultValue={theme.palette.action.disabled}
                  />
                </div>
                <div >
                  <ColorPickerField
                    label="Disabled Text"
                    value={values.glassSettings?.fillButtonDisabledTextColor || theme.palette.action.disabledBackground}
                    onChange={(value) => memoizedSetFieldValue("glassSettings.fillButtonDisabledTextColor", value)}
                    defaultValue={theme.palette.action.disabledBackground}
                  />
                </div>
              </Grid>

              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={() => {
                    const newSettings = getCurrentThemeGlassSettings();
                    setFieldValue("glassSettings", newSettings);
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
                  RESET STYLES
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  );
}

const COMPONENT_ICONS = {
  pairInfo: InfoIcon,
  tradingGraph: TrendingUpIcon,
  tradeWidget: SwapHorizIcon,
};

const COMPONENT_LABELS = {
  pairInfo: "Pair Information",
  tradingGraph: "Trading Chart",
  tradeWidget: "Trade Widget",
};

interface DragDropComponentOrderProps {
  value: string[];
  onChange: (newOrder: string[]) => void;
}

function DragDropComponentOrder({ value, onChange }: DragDropComponentOrderProps) {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newOrder = [...value];
    const draggedItem = newOrder[draggedIndex];

    newOrder.splice(draggedIndex, 1);

    newOrder.splice(dropIndex, 0, draggedItem);

    onChange(newOrder);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <Box>
      <Typography
        variant={isSmallScreen ? "body1" : "subtitle1"}
        gutterBottom
        sx={{
          fontWeight: theme.typography.fontWeightMedium,
          color: theme.palette.text.primary
        }}
      >
        Component Order (Drag to reorder)
      </Typography>
      <Typography
        variant={isSmallScreen ? "caption" : "body2"}
        color="text.secondary"
        sx={{ mb: theme.spacing(2) }}
      >
        Drag and drop to change the order. Pair Info appears as horizontal strip, widgets as boxes.
      </Typography>

      <Paper elevation={1} sx={{ borderRadius: theme.shape.borderRadius }}>
        <List sx={{ p: 0 }}>
          {value.map((componentType, index) => {
            const IconComponent = COMPONENT_ICONS[componentType as keyof typeof COMPONENT_ICONS];
            const label = COMPONENT_LABELS[componentType as keyof typeof COMPONENT_LABELS];
            const isPairInfo = componentType === 'pairInfo';

            return (
              <ListItem
                key={componentType}
                draggable
                onDragStart={(e: any) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e: any) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                sx={{
                  border: `${theme.spacing(0.125)} solid`,
                  borderColor: draggedIndex === index ? 'primary.main' : 'divider',
                  borderRadius: theme.shape.borderRadius,
                  mb: theme.spacing(1),
                  bgcolor: draggedIndex === index ? 'action.selected' : 'background.paper',
                  cursor: 'grab',
                  '&:active': {
                    cursor: 'grabbing',
                  },
                  '&:hover': {
                    bgcolor: 'action.hover',
                    borderColor: 'primary.light',
                  },
                  transition: theme.transitions.create(['all'], {
                    duration: theme.transitions.duration.short,
                  }),
                  height: {
                    xs: isPairInfo ? theme.spacing(7) : theme.spacing(9),
                    sm: isPairInfo ? theme.spacing(8) : theme.spacing(10)
                  },
                  display: 'flex',
                  alignItems: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  px: { xs: theme.spacing(1), sm: theme.spacing(2) },
                }}
              >
                <ListItemIcon sx={{ minWidth: theme.spacing(4) }}>
                  <DragIndicatorIcon
                    color="action"
                    fontSize={isSmallScreen ? "small" : "medium"}
                  />
                </ListItemIcon>

                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: theme.spacing(1), sm: theme.spacing(2) },
                  flex: 1
                }}>
                  <Paper
                    elevation={2}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: { xs: theme.spacing(4), sm: theme.spacing(5) },
                      height: { xs: theme.spacing(4), sm: theme.spacing(5) },
                      borderRadius: isPairInfo ? theme.shape.borderRadius : theme.spacing(1),
                      bgcolor: 'primary.light',
                      color: 'primary.contrastText'
                    }}
                  >
                    {IconComponent && <IconComponent fontSize={isSmallScreen ? "small" : "medium"} />}
                  </Paper>

                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant={isSmallScreen ? "body2" : "subtitle2"}
                      sx={{
                        fontWeight: theme.typography.fontWeightMedium,
                        color: theme.palette.text.primary
                      }}
                    >
                      {label}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: { xs: theme.typography.overline.fontSize, sm: theme.typography.caption.fontSize } }}
                    >
                      Position {index + 1} • {isPairInfo ? 'Horizontal Strip' : 'Box Component'}
                    </Typography>
                  </Box>

                  <Paper
                    variant="outlined"
                    sx={{
                      width: { xs: theme.spacing(12), sm: theme.spacing(15) },
                      height: { xs: theme.spacing(4), sm: theme.spacing(5) },
                      borderRadius: theme.shape.borderRadius,
                      bgcolor: theme.palette.grey[50],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}
                  >
                    {isPairInfo ? (
                      <Box sx={{
                        width: '90%',
                        height: { xs: theme.spacing(1), sm: theme.spacing(1.5) },
                        bgcolor: 'primary.main',
                        borderRadius: theme.spacing(0.25)
                      }} />
                    ) : (
                      <Box sx={{
                        width: {
                          xs: componentType === 'tradeWidget' ? theme.spacing(3.5) : theme.spacing(4.5),
                          sm: componentType === 'tradeWidget' ? theme.spacing(4.5) : theme.spacing(5.5)
                        },
                        height: { xs: theme.spacing(2.5), sm: theme.spacing(3) },
                        bgcolor: componentType === 'tradeWidget' ? 'secondary.main' : 'info.main',
                        borderRadius: theme.spacing(0.5)
                      }} />
                    )}
                  </Paper>
                </Box>
              </ListItem>
            );
          })}
        </List>
      </Paper>
    </Box>
  );
}

export default function ExchangeSettingsForm({
  onCancel,
  onSave,
  onChange,
  settings,
  tokens,
  saveOnChange,
  showSaveButton,
  onValidate,
  activeChainIds,
  customTheme,
}: ExchangeSettingsFormProps) {
  const handleSubmit = async (values: DexkitExchangeSettings) => {
    onSave(values);
  };

  const isMobile = useIsMobile();
  const theme = useTheme();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const { formatMessage } = useIntl();

  const handleValidate = async (values: DexkitExchangeSettings) => {
    let errors: any = {};

    if (values.buyTokenPercentageFee && values.buyTokenPercentageFee > 10) {
      errors["buyTokenPercentageFee"] = formatMessage({
        id: "the.max.fee.is.ten.percent",
        defaultMessage: "The max fee is 10%",
      });
    }

    for (let chainId of values.availNetworks) {
      if (
        values.defaultPairs[chainId] &&
        !values.defaultPairs[chainId].baseToken
      ) {
        let error = formatMessage(
          {
            id: "the.base.token.is.required.on.chain",
            defaultMessage: "The base token is required on {chainName}",
          },
          { chainName: getChainName(chainId) }
        );

        setWith(
          errors,
          `defaultPairs.${String(chainId)}.baseToken`,
          error,
          Object
        );
      }

      if (
        values.defaultPairs[chainId] &&
        !values.defaultPairs[chainId].quoteToken
      ) {
        let error = formatMessage(
          {
            id: "the.base.token.is.required.on.chain",
            defaultMessage: "The quote token is required on {chainName}",
          },
          { chainName: getChainName(chainId) }
        );

        setWith(
          errors,
          `defaultPairs.${String(chainId)}.quoteToken`,
          error,
          Object
        );
      }
      if (
        values?.defaultSlippage &&
        values?.defaultSlippage[chainId] &&
        values?.defaultSlippage[chainId].slippage > 50
      ) {
        let error = formatMessage({
          id: "max.slippage.is.value.percent",
          defaultMessage: "Max slippage is 50 percent",
        });

        setWith(
          errors,
          `defaultSlippage.${String(chainId)}.slippage`,
          error,
          Object
        );
      }
    }

    return errors;
  };

  const getInitialTokens = useCallback(() => {
    const allAvailableTokens = [
      ...tokens,
      ...EXTENDED_QUOTE_TOKENS_SUGGESTION,
      ...BASE_TOKENS_SUGGESTION,
    ];

    const uniqueTokens = allAvailableTokens.filter((token, index, self) =>
      index === self.findIndex(t =>
        t.chainId === token.chainId &&
        isAddressEqual(t.address, token.address)
      )
    );

    const resQuote = EXTENDED_QUOTE_TOKENS_SUGGESTION.map((t) => {
      return { chainId: t.chainId, token: t };
    }).reduce(
      (prev, curr) => {
        let obj = { ...prev };

        if (!obj[curr.chainId]) {
          obj[curr.chainId] = { baseTokens: [], quoteTokens: [] };
        }

        let index = uniqueTokens.findIndex(
          (t) =>
            curr.token.chainId === t.chainId &&
            isAddressEqual(curr.token.address, t.address)
        );

        if (index > -1) {
          obj[curr.chainId].quoteTokens.push(curr.token);
        }

        return obj;
      },
      {} as { [key: number]: { quoteTokens: Token[]; baseTokens: Token[] } }
    );

    for (let chain of Object.keys(NETWORKS)) {
      let chainId = parseChainId(chain);

      if (!ZEROX_SUPPORTED_NETWORKS.includes(chainId)) {
        continue;
      }

      if (resQuote[chainId]) {
        let chainTokens = uniqueTokens.filter((t) => t.chainId === chainId);

        for (let token of chainTokens) {
          let index = resQuote[chainId].quoteTokens.findIndex(
            (t) =>
              t.chainId === token.chainId &&
              isAddressEqual(t.address, token.address)
          );

          if (index === -1) {
            resQuote[chainId].baseTokens.push(token);
          }
        }
      } else {
        resQuote[chainId] = { baseTokens: [], quoteTokens: [] };
        let chainTokens = uniqueTokens.filter((t) => t.chainId === chainId);
        resQuote[chainId].baseTokens = chainTokens.filter(t =>
          BASE_TOKENS_SUGGESTION.some(bt =>
            bt.chainId === t.chainId && isAddressEqual(bt.address, t.address)
          )
        );
        resQuote[chainId].quoteTokens = chainTokens.filter(t =>
          EXTENDED_QUOTE_TOKENS_SUGGESTION.some(qt =>
            qt.chainId === t.chainId && isAddressEqual(qt.address, t.address)
          )
        );
      }
    }

    return resQuote;
  }, [tokens]);

  const networks = useMemo(() => {
    return Object.keys(NETWORKS)
      .filter((k) => ZEROX_SUPPORTED_NETWORKS.includes(Number(k)))
      .filter((key) => {
        let chain = parseChainId(key);
        return NETWORKS[chain].testnet !== true;
      })
      .map((key) => NETWORKS[parseChainId(key)]);
  }, []);

  const defaultNetwork = useMemo(() => {
    if (settings?.defaultNetwork && networks.some((n: any) => n.chainId === settings.defaultNetwork)) {
      return settings.defaultNetwork;
    }

    if (networks.some((n: any) => n.chainId === ChainId.Ethereum)) {
      return ChainId.Ethereum;
    }

    return networks.length > 0 ? networks[0].chainId : ChainId.Ethereum;
  }, [networks, settings?.defaultNetwork]);

  const [chainId, setChainId] = useState<ChainId>(() => {
    if (networks.some((n: any) => n.chainId === ChainId.Ethereum)) {
      return ChainId.Ethereum;
    }
    return networks.length > 0 ? networks[0].chainId : ChainId.Ethereum;
  });

  useEffect(() => {
    if (networks.length > 0 && !networks.some((n: any) => n.chainId === chainId)) {
      if (networks.some((n: any) => n.chainId === ChainId.Ethereum)) {
        setChainId(ChainId.Ethereum);
      } else {
        setChainId(networks[0].chainId);
      }
    }
  }, [networks, chainId]);

  const availableNetworksForForm = useMemo(() => {
    return networks.filter((n: any) => {
      return true;
    });
  }, [networks]);

  useEffect(() => {
    const availableChainIds = availableNetworksForForm.map((n: any) => n.chainId);
    if (availableChainIds.length > 0 && !availableChainIds.includes(chainId)) {
      if (availableChainIds.includes(ChainId.Ethereum)) {
        setChainId(ChainId.Ethereum);
      } else {
        setChainId(availableChainIds[0]);
      }
    }
  }, [availableNetworksForForm, chainId]);

  const [showSelectNetworks, setShowSelectNetworks] = useState(false);

  const handleShowSelectNetworks = () => {
    setShowSelectNetworks(true);
  };

  const handleCloseSelectNetworks = () => {
    setShowSelectNetworks(false);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 2,
        px: { xs: 2, sm: 3, md: 4 }
      }}
    >
      <Box sx={{
        overflowY: 'auto',
        maxHeight: `calc(100vh - ${theme.spacing(25)})`
      }}>
        {networks.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              <FormattedMessage
                id="no.compatible.networks.available"
                defaultMessage="No compatible networks available"
              />
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <FormattedMessage
                id="exchange.requires.0x.compatible.networks"
                defaultMessage="Exchange requires compatible networks with 0x API. Please enable at least one of the following networks: Ethereum, Optimism, BSC, Polygon, Base, Arbitrum, Avalanche, Linea, Scroll, Mantle, Blast or Mode."
              />
            </Typography>
          </Paper>
        ) : (
          <Formik
            initialValues={
              settings
                ? {
                  ...settings,
                  defaultNetwork: defaultNetwork,
                  availNetworks: settings.availNetworks.filter(network =>
                    ZEROX_SUPPORTED_NETWORKS.includes(network)
                  ),
                  glassSettings: settings.glassSettings || getDefaultGlassSettings(theme),
                }
                : {
                  defaultNetwork: defaultNetwork,
                  defaultPairs: DEFAULT_TOKENS,
                  quoteTokens: [],
                  defaultTokens: getInitialTokens(),
                  affiliateAddress: ZEROEX_AFFILIATE_ADDRESS,
                  defaultSlippage: {},
                  zrxApiKey: "",
                  buyTokenPercentageFee: 0.0,
                  availNetworks: networks.map((n: any) => n.chainId),
                  variant: "default" as ExchangeVariant,
                  glassSettings: getDefaultGlassSettings(theme),
                  customVariantSettings: {
                    showPairInfo: true,
                    showTradingGraph: true,
                    showTradeWidget: true,
                    layout: "grid",
                    spacing: 2,
                    backgroundColor: "",
                    borderRadius: 0,
                    padding: 2,
                    componentOrder: ['pairInfo', 'tradeWidget', 'tradingGraph'],
                    pairInfoBackgroundColor: "",
                    pairInfoTextColor: "",
                    pairInfoBorderColor: "",
                    tradeWidgetBackgroundColor: "",
                    tradeWidgetTextColor: "",
                    tradeWidgetBorderColor: "",
                    tradeWidgetButtonColor: "",
                    tradeWidgetButtonTextColor: "",
                    tradingGraphBackgroundColor: "",
                    tradingGraphBorderColor: "",
                  },
                }
            }
            onSubmit={handleSubmit as any}
            validationSchema={ExchangeSettingsSchema}
            validateOnChange
            validate={handleValidate as any}
          >
            {({ submitForm, values, errors, setFieldValue }: any) => (
              <>
                <SelectNetworksDialog
                  DialogProps={{
                    open: showSelectNetworks,
                    maxWidth: "sm",
                    fullWidth: true,
                    onClose: handleCloseSelectNetworks,
                  }}
                  activeChainIds={activeChainIds}
                />
                {saveOnChange && onChange && (
                  <SaveOnChangeListener onSave={onChange} onValidate={onValidate} />
                )}
                <Grid container spacing={isMobile ? 1.5 : 2}>
                  {/* <div >
                <Field
                  component={TextField}
                  label={
                    <FormattedMessage
                      id="0x.api.key"
                      defaultMessage="0x Api Key"
                    />
                  }
                  name="zrxApiKey"
                  fullWidth
                />
              </div> */}

                  <div >
                    <Paper sx={{
                      p: isMobile ? 1.5 : 2,
                      mr: { xs: 1, sm: 1.5, md: 2 }
                    }}>
                      <Stack spacing={isMobile ? 1.5 : 2}>
                        <Field
                          component={FormikSelect}
                          label={
                            <FormattedMessage
                              id="default.network"
                              defaultMessage="Default network"
                            />
                          }
                          name="defaultNetwork"
                          fullWidth
                          size={isMobile ? "small" : "medium"}
                          renderValue={(value: ChainId) => {
                            return (
                              <Stack
                                direction="row"
                                alignItems="center"
                                alignContent="center"
                                spacing={1}
                              >
                                <Avatar
                                  src={ipfsUriToUrl(NETWORKS[value].imageUrl || "")}
                                  style={{ width: "auto", height: isMobile ? "0.85rem" : "1rem" }}
                                />
                                <Typography variant={isMobile ? "body2" : "body1"}>
                                  {NETWORKS[value].name}
                                </Typography>
                              </Stack>
                            );
                          }}
                        >
                          {networks.map((n: any) => (
                            <MenuItem key={n.chainId} value={n.chainId}>
                              <ListItemIcon>
                                <Avatar
                                  src={ipfsUriToUrl(
                                    NETWORKS[n.chainId].imageUrl || ""
                                  )}
                                  style={{ width: isMobile ? "0.85rem" : "1rem", height: isMobile ? "0.85rem" : "1rem" }}
                                />
                              </ListItemIcon>
                              <ListItemText
                                primary={n.name}
                                primaryTypographyProps={{
                                  variant: isMobile ? "body2" : "body1"
                                }}
                              />
                            </MenuItem>
                          ))}
                        </Field>
                        <Stack
                          justifyContent="space-between"
                          alignItems="center"
                          direction="row"
                        >
                          <Typography variant={isMobile ? "caption" : "subtitle2"}>
                            <FormattedMessage
                              id="choose.the.networks.that.your.exchange.will.be.enabled"
                              defaultMessage="Choose the networks that your exchange will be enabled"
                            />
                          </Typography>
                          {values.availNetworks.length > 0 && (
                            <Tooltip
                              title={
                                <FormattedMessage
                                  id="edit.networks"
                                  defaultMessage="Edit Networks"
                                />
                              }
                            >
                              <IconButton
                                onClick={handleShowSelectNetworks}
                                size="small"
                              >
                                <Edit fontSize={isMobile ? "small" : "medium"} />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                        <Divider />
                        <Box>
                          <Grid container spacing={isMobile ? 1 : 2}>
                            {values.availNetworks.length > 0 ? (
                              networks
                                .filter((network: any) =>
                                  values.availNetworks.includes(network.chainId)
                                )
                                .map((n: any) => (
                                  <div key={n.chainId}>
                                    <Chip
                                      size="small"
                                      avatar={
                                        <Avatar
                                          src={ipfsUriToUrl(
                                            NETWORKS[n.chainId].imageUrl || ""
                                          )}
                                        />
                                      }
                                      label={n.name}
                                    />
                                  </div>
                                ))
                            ) : (
                              <div >
                                <Box>
                                  <Stack spacing={isMobile ? 1 : 2} alignItems="center">
                                    <Typography
                                      variant={isMobile ? "caption" : "body2"}
                                      color="text.secondary"
                                    >
                                      <FormattedMessage
                                        id="No.networks.selected"
                                        defaultMessage="No networks selected"
                                      />
                                    </Typography>
                                    <Button
                                      onClick={handleShowSelectNetworks}
                                      variant="outlined"
                                      size={isMobile ? "small" : "medium"}
                                    >
                                      <FormattedMessage
                                        id="select.networks"
                                        defaultMessage="Select networks"
                                      />
                                    </Button>
                                  </Stack>
                                </Box>
                              </div>
                            )}
                          </Grid>
                        </Box>
                      </Stack>
                    </Paper>
                  </div>
                  <div >
                    <Paper sx={{
                      p: isMobile ? 1.5 : 2,
                      mr: { xs: 1, sm: 1.5, md: 2 }
                    }}>
                      <Grid container spacing={isMobile ? 1.5 : 2}>
                        <Grid size={12}>
                          <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                            <InputLabel>
                              <FormattedMessage
                                id="network"
                                defaultMessage="Network"
                              />
                            </InputLabel>
                            <Select
                              disabled={values.availNetworks.length === 0 || networks.length === 0}
                              label={
                                <FormattedMessage
                                  id="network"
                                  defaultMessage="Network"
                                />
                              }
                              fullWidth
                              value={networks.some((n: any) => n.chainId === chainId) ? chainId : (networks.length > 0 ? networks[0].chainId : "")}
                              onChange={(e) => {
                                const newChainId = e.target.value as ChainId;
                                if (networks.some((n: any) => n.chainId === newChainId)) {
                                  setChainId(newChainId);
                                }
                              }}
                              renderValue={(value) => {
                                if (!value || !networks.some((n: any) => n.chainId === value)) {
                                  return <span>-</span>;
                                }
                                return (
                                  <Stack
                                    direction="row"
                                    alignItems="center"
                                    alignContent="center"
                                    spacing={1}
                                  >
                                    <Avatar
                                      src={ipfsUriToUrl(
                                        NETWORKS[value as ChainId].imageUrl || ""
                                      )}
                                      style={{ width: "auto", height: isMobile ? "0.85rem" : "1rem" }}
                                    />
                                    <Typography variant={isMobile ? "body2" : "body1"}>
                                      {NETWORKS[value as ChainId].name}
                                    </Typography>
                                  </Stack>
                                );
                              }}
                            >
                              {networks
                                .filter((n: any) =>
                                  values.availNetworks.includes(n.chainId)
                                )
                                .map((n: any) => (
                                  <MenuItem key={n.chainId} value={n.chainId}>
                                    <ListItemIcon>
                                      <Avatar
                                        src={ipfsUriToUrl(
                                          NETWORKS[n.chainId].imageUrl || ""
                                        )}
                                        style={{ width: isMobile ? "0.85rem" : "1rem", height: isMobile ? "0.85rem" : "1rem" }}
                                      />
                                    </ListItemIcon>
                                    <ListItemText
                                      primary={n.name}
                                      primaryTypographyProps={{
                                        variant: isMobile ? "body2" : "body1"
                                      }}
                                    />
                                  </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>
                              <Typography variant={isMobile ? "caption" : "body2"}>
                                <FormattedMessage
                                  id="define.the.tokens.and.the.default.pair.for.this.network"
                                  defaultMessage="Define the tokens and the default pair for this network"
                                />
                              </Typography>
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid size={12}>
                          <ExchangeQuoteTokensInput
                            tokens={tokens}
                            chainId={chainId}
                            label={
                              <FormattedMessage
                                id="quote.tokens"
                                defaultMessage="Quote tokens"
                              />
                            }
                          />
                        </Grid>
                        <Grid size={6}>
                          <ExchangeTokenInput
                            name={`defaultPairs[${chainId}].baseToken`}
                            tokens={
                              getIn(values, `defaultTokens.${chainId}.baseTokens`) ||
                              []
                            }
                            label={
                              <FormattedMessage
                                id="base.token"
                                defaultMessage="Base token"
                              />
                            }
                          />
                        </Grid>
                        <Grid size={6}>
                          <ExchangeTokenInput
                            name={`defaultPairs[${chainId}].quoteToken`}
                            tokens={
                              getIn(values, `defaultTokens.${chainId}.quoteTokens`) ||
                              []
                            }
                            label={
                              <FormattedMessage
                                id="quote.token"
                                defaultMessage="Quote token"
                              />
                            }
                          />
                        </Grid>
                        <Grid size={6}>
                          <TextFieldMui
                            inputProps={{
                              type: "number",
                              min: 0,
                              max: 50,
                              step: 0.01,
                            }}
                            InputLabelProps={{ shrink: true }}
                            label={
                              <FormattedMessage
                                id="default.slippage.percentage"
                                defaultMessage="Default slippage (0-50%)"
                              />
                            }
                            value={
                              getIn(values, `defaultSlippage.${chainId}.slippage`) ||
                              1
                            }
                            onChange={(event: any) => {
                              let value = event.target.value;
                              if (value < 0) {
                                value = 0;
                              }
                              if (value > 50) {
                                value = 50;
                              }
                              setFieldValue(
                                `defaultSlippage.${chainId}.slippage`,
                                value
                              );
                            }}
                            fullWidth
                            size={isMobile ? "small" : "medium"}
                          />
                        </Grid>

                      </Grid>
                    </Paper>
                  </div>

                  <div >
                    <Paper sx={{
                      p: { xs: 1.5, sm: 2, md: 3 },
                      mr: { xs: 1, sm: 1.5, md: 2 }
                    }}>
                      <Typography
                        variant="h6"
                        sx={{
                          mb: { xs: 1.5, sm: 2 },
                          fontSize: { xs: '1rem', sm: '1.25rem' }
                        }}
                      >
                        <FormattedMessage
                          id="exchange.fee.configuration"
                          defaultMessage="Exchange Fee Configuration"
                        />
                      </Typography>
                      <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                        <div >
                          <Field
                            component={TextField}
                            label={
                              <FormattedMessage
                                id="fee.recipient.address"
                                defaultMessage="Fee recipient address"
                              />
                            }
                            fullWidth
                            name="feeRecipientAddress"
                            size={isMobile ? "small" : "medium"}
                            placeholder="0xyouraddress...."
                            InputLabelProps={{ shrink: true }}
                          />
                        </div>

                        <div >
                          <FormikDecimalInput
                            name="buyTokenPercentageFee"
                            decimals={2}
                            maxDigits={3}
                            TextFieldProps={{
                              fullWidth: true,
                              label: (
                                <FormattedMessage
                                  id="fee.amount"
                                  defaultMessage="Fee amount"
                                />
                              ),
                              InputProps: {
                                endAdornment: (
                                  <InputAdornment position="end">%</InputAdornment>
                                ),
                              },
                              size: isMobile ? "small" : "medium",
                            }}
                          />
                        </div>
                      </Grid>
                    </Paper>
                  </div>

                  <div >
                    <VariantConfigurationTab customTheme={customTheme} />
                  </div>


                  {showSaveButton && (
                    <FormActions
                      onSubmit={submitForm}
                      onCancel={onCancel}
                      isSmallDevice={isSmallDevice}
                      isMobile={isMobile}
                    />
                  )}
                </Grid>
              </>
            )}
          </Formik>
        )}
      </Box>
    </Container>
  );
}
