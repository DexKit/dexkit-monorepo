import { useIsMobile } from '@dexkit/core';
import MediaDialog from '@dexkit/ui/components/mediaDialog';
import { useAppWizardConfig } from '@dexkit/ui/hooks';
import { SwapVariant } from '@dexkit/ui/modules/wizard/types';
import {
  AppPageSection,
  WalletCustomSettings,
  WalletGlassSettings,
  WalletPageSection,
  WalletSettings
} from '@dexkit/ui/modules/wizard/types/section';
import { Delete as DeleteIcon, Image as ImageIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion, AccordionDetails, AccordionSummary,
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
import React, { useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { generateCSSVarsTheme } from '../../utils';

interface Props {
  section?: WalletPageSection;
  onSave: (section: AppPageSection) => void;
  onChange: (section: AppPageSection) => void;
  onCancel: () => void;
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
        <Box sx={{ mt: theme.spacing(3), display: 'flex', flexDirection: 'column', gap: theme.spacing(2) }}>
          <Grid container spacing={theme.spacing(2)}>
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
  backgroundType: "solid",
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
  hideNFTs: false,
  hideActivity: false,
  hideSwapAction: false,
  hideExchangeAction: false,
  hideSendAction: false,
});

const getDefaultCustomSettings = (theme: any): WalletCustomSettings => ({
  backgroundType: "solid",
  backgroundColor: theme.palette.background.default,
  gradientStartColor: theme.palette.background.default,
  gradientEndColor: theme.palette.background.paper,
  gradientDirection: "to bottom",
  primaryTextColor: theme.palette.text.primary,
  secondaryTextColor: theme.palette.text.secondary,
  balanceTextColor: theme.palette.text.primary,

  sendButtonConfig: {
    backgroundColor: theme.palette.primary.main,
    textColor: theme.palette.primary.contrastText,
    borderColor: theme.palette.primary.main,
    hoverBackgroundColor: theme.palette.primary.dark,
  },
  receiveButtonConfig: {
    backgroundColor: theme.palette.primary.main,
    textColor: theme.palette.primary.contrastText,
    borderColor: theme.palette.primary.main,
    hoverBackgroundColor: theme.palette.primary.dark,
  },
  scanButtonConfig: {
    backgroundColor: theme.palette.secondary.main,
    textColor: theme.palette.secondary.contrastText,
    borderColor: theme.palette.secondary.main,
    hoverBackgroundColor: theme.palette.secondary.dark,
  },
  importTokenButtonConfig: {
    backgroundColor: theme.palette.info.main,
    textColor: theme.palette.info.contrastText,
    borderColor: theme.palette.info.main,
    hoverBackgroundColor: theme.palette.info.dark,
  },
  swapButtonConfig: {
    backgroundColor: theme.palette.primary.main,
    textColor: theme.palette.primary.contrastText,
    borderColor: theme.palette.primary.main,
    hoverBackgroundColor: theme.palette.primary.dark,
  },
  backButtonConfig: {
    backgroundColor: theme.palette.primary.main,
    textColor: theme.palette.primary.contrastText,
    borderColor: theme.palette.primary.main,
    hoverBackgroundColor: theme.palette.primary.dark,
  },

  networkSelectorConfig: {
    backgroundColor: theme.palette.background.paper,
    textColor: theme.palette.text.primary,
    borderColor: theme.palette.divider,
    hoverBackgroundColor: theme.palette.action.hover,
  },

  cardConfig: {
    backgroundColor: theme.palette.background.paper,
    borderColor: theme.palette.divider,
    borderRadius: 8,
    shadowColor: theme.palette.common.black,
    shadowIntensity: 0.1,
  },

  inputConfig: {
    backgroundColor: theme.palette.background.default,
    textColor: theme.palette.text.primary,
    borderColor: theme.palette.divider,
    focusBorderColor: theme.palette.primary.main,
    placeholderColor: theme.palette.text.secondary,
    iconColor: theme.palette.primary.main,
  },
  paginationConfig: {
    textColor: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
    buttonColor: theme.palette.text.primary,
    buttonHoverColor: theme.palette.action.hover,
    selectBackgroundColor: theme.palette.background.paper,
    selectTextColor: theme.palette.text.primary,
  },
  activityTableConfig: {
    headerBackgroundColor: theme.palette.background.paper,
    headerTextColor: theme.palette.text.primary,
    rowBackgroundColor: theme.palette.background.default,
    rowTextColor: theme.palette.text.primary,
    hoverRowBackgroundColor: theme.palette.primary.main,
    borderColor: theme.palette.divider,
  },
  tokenSearchConfig: {
    backgroundColor: theme.palette.background.default,
    textColor: theme.palette.text.primary,
    borderColor: theme.palette.divider,
    focusBorderColor: theme.palette.primary.main,
    placeholderColor: theme.palette.text.secondary,
    iconColor: theme.palette.text.primary,
  },

  layout: {
    componentOrder: ["balance", "actions", "search", "tabs", "content"],
    spacing: 2,
    actionButtonsLayout: "horizontal",
    actionButtonsAlignment: "left",
  },

  visibility: {
    hideNFTs: false,
    hideActivity: false,
    hideTransactions: false,
    hideTrades: false,
    hideSearch: false,
    hideImportToken: false,
    hideSendButton: false,
    hideReceiveButton: false,
    hideScanButton: false,
    hideNetworkSelector: false,
    hideBalance: false,
    hideSwapAction: false,
    hideExchangeAction: false,
    hideSendAction: false,
  },

  swapConfig: {
    variant: SwapVariant.Classic,
  },

  exchangeConfig: {
    variant: "default" as const,
  },

  exchangeTextColors: {
    pairInfoTextColor: theme.palette.text.primary,
    pairInfoSecondaryTextColor: theme.palette.text.secondary,
    pairInfoBackgroundColor: theme.palette.background.paper,
    tradeWidgetTextColor: theme.palette.text.primary,
    tradeWidgetButtonTextColor: theme.palette.primary.contrastText,
    tradeWidgetTabTextColor: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
    tradeWidgetInputTextColor: theme.palette.text.primary,
    tradeWidgetBackgroundColor: theme.palette.background.paper,
    tradingGraphControlTextColor: theme.palette.text.primary,
    tradingGraphBackgroundColor: theme.palette.background.paper,
  },
  nftColors: {
    titleColor: theme.palette.text.primary,
    collectionColor: theme.palette.text.secondary,
    cardBackgroundColor: theme.palette.background.paper,
    cardBorderColor: theme.palette.divider,
  },

  tabsConfig: {
    backgroundColor: theme.palette.background.paper,
    activeTabColor: theme.palette.primary.main,
    inactiveTabColor: theme.palette.text.secondary,
    activeTabTextColor: theme.palette.primary.contrastText,
    inactiveTabTextColor: theme.palette.text.secondary,
    tabBarBackgroundColor: theme.palette.background.paper,
    indicatorColor: theme.palette.primary.main,
    tokensTitleColor: theme.palette.text.primary,
    nftsTitleColor: theme.palette.text.primary,
    tokensIndicatorColor: theme.palette.primary.main,
    nftsIndicatorColor: theme.palette.primary.main,
    collectedTitleColor: theme.palette.text.primary,
    favoritesTitleColor: theme.palette.text.primary,
    hiddenTitleColor: theme.palette.text.primary,
    collectedIndicatorColor: theme.palette.primary.main,
    favoritesIndicatorColor: theme.palette.primary.main,
    hiddenIndicatorColor: theme.palette.primary.main,
  },

  tokenTableConfig: {
    headerBackgroundColor: theme.palette.background.paper,
    headerTextColor: theme.palette.text.primary,
    rowBackgroundColor: theme.palette.background.default,
    rowTextColor: theme.palette.text.primary,
    hoverRowBackgroundColor: theme.palette.primary.main,
    borderColor: theme.palette.divider,
  },
});

function VariantConfigurationTab({ customTheme }: { customTheme?: any }) {
  const { values, setFieldValue } = useFormikContext<WalletSettings>();
  const theme = useTheme();
  const { formatMessage } = useIntl();

  const [expandedAccordions, setExpandedAccordions] = useState<string[]>(['background']);

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedAccordions(prev =>
      isExpanded
        ? [...prev, panel]
        : prev.filter(item => item !== panel)
    );
  };

  const getTitleColor = () => {
    return theme.palette.mode === 'dark' ? '#ffffff' : '#000000';
  };

  // Helper function for consistent spacing
  const getFormSpacing = () => theme.spacing(2);

  const getCurrentThemeGlassSettings = () => {
    if (customTheme && customTheme.colorSchemes) {
      const colorScheme = customTheme.colorSchemes.light || customTheme.colorSchemes.dark;

      if (colorScheme && colorScheme.palette) {
        const palette = colorScheme.palette;

        const settings: WalletGlassSettings = {
          backgroundType: "solid",
          backgroundColor: palette.background?.default || "#FFFFFF",
          gradientStartColor: palette.background?.default || "#FFFFFF",
          gradientEndColor: palette.background?.paper || "#FAFAFA",
          gradientDirection: "to bottom",
          textColor: palette.text?.primary || "#0E1116",
          blurIntensity: 40,
          glassOpacity: 0.10,
          disableBackground: false,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "scroll",
          hideNFTs: false,
          hideActivity: false,
        };

        return settings;
      }
    }

    const settings: WalletGlassSettings = {
      backgroundType: "solid",
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
      hideNFTs: false,
      hideActivity: false,
    };

    return settings;
  };

  const getCurrentThemeCustomSettings = () => {
    if (customTheme && customTheme.colorSchemes) {
      const colorScheme = customTheme.colorSchemes.light || customTheme.colorSchemes.dark;

      if (colorScheme && colorScheme.palette) {
        const palette = colorScheme.palette;

        return {
          backgroundType: "solid" as const,
          backgroundColor: palette.background?.default || "#FFFFFF",
          gradientStartColor: palette.background?.default || "#FFFFFF",
          gradientEndColor: palette.background?.paper || "#FAFAFA",
          gradientDirection: "to bottom" as const,
          primaryTextColor: palette.text?.primary || "#0E1116",
          secondaryTextColor: palette.text?.secondary || "#656D76",
          balanceTextColor: palette.text?.primary || "#0E1116",

          sendButtonConfig: {
            backgroundColor: palette.primary?.main || "#3B51F7",
            textColor: "#ffffff",
            borderColor: palette.primary?.main || "#3B51F7",
            hoverBackgroundColor: palette.primary?.dark || "#081EC4",
          },
          receiveButtonConfig: {
            backgroundColor: palette.primary?.main || "#3B51F7",
            textColor: "#ffffff",
            borderColor: palette.primary?.main || "#3B51F7",
            hoverBackgroundColor: palette.primary?.dark || "#081EC4",
          },
          scanButtonConfig: {
            backgroundColor: palette.secondary?.main || "#FF6B35",
            textColor: "#ffffff",
            borderColor: palette.secondary?.main || "#FF6B35",
            hoverBackgroundColor: palette.secondary?.dark || "#E55A2B",
          },
          importTokenButtonConfig: {
            backgroundColor: palette.info?.main || "#29B6F6",
            textColor: "#ffffff",
            borderColor: palette.info?.main || "#29B6F6",
            hoverBackgroundColor: palette.info?.dark || "#0288D1",
          },

          networkSelectorConfig: {
            backgroundColor: palette.background?.paper || "#FAFAFA",
            textColor: palette.text?.primary || "#0E1116",
            borderColor: palette.divider || "#E1E4E8",
            hoverBackgroundColor: palette.action?.hover || "#F6F8FA",
            dropdownBackgroundColor: palette.background?.paper || "#FAFAFA",
            dropdownTextColor: palette.text?.primary || "#0E1116",
          },

          cardConfig: {
            backgroundColor: palette.background?.paper || "#FAFAFA",
            borderColor: palette.divider || "#E1E4E8",
            borderRadius: 8,
            shadowColor: palette.common?.black || "#000000",
            shadowIntensity: 0.1,
          },

          inputConfig: {
            backgroundColor: palette.background?.default || "#FFFFFF",
            textColor: palette.text?.primary || "#0E1116",
            borderColor: palette.divider || "#E1E4E8",
            focusBorderColor: palette.primary?.main || "#3B51F7",
            placeholderColor: palette.text?.secondary || "#656D76",
            iconColor: palette.primary?.main || "#3B51F7",
          },

          paginationConfig: {
            textColor: palette.text?.primary || "#0E1116",
            backgroundColor: palette.background?.paper || "#FAFAFA",
            buttonColor: palette.text?.primary || "#0E1116",
            buttonHoverColor: palette.action?.hover || "#F6F8FA",
            selectBackgroundColor: palette.background?.paper || "#FAFAFA",
            selectTextColor: palette.text?.primary || "#0E1116",
          },

          activityTableConfig: {
            headerBackgroundColor: palette.background?.paper || "#FAFAFA",
            headerTextColor: palette.text?.primary || "#0E1116",
            rowBackgroundColor: palette.background?.default || "#FFFFFF",
            rowTextColor: palette.text?.primary || "#0E1116",
            hoverRowBackgroundColor: palette.action?.hover || "#F6F8FA",
            borderColor: palette.divider || "#E1E4E8",
          },

          tokenSearchConfig: {
            backgroundColor: palette.background?.default || "#FFFFFF",
            textColor: palette.text?.primary || "#0E1116",
            borderColor: palette.divider || "#E1E4E8",
            focusBorderColor: palette.primary?.main || "#3B51F7",
            placeholderColor: palette.text?.secondary || "#656D76",
            iconColor: palette.text?.primary || "#0E1116",
          },

          layout: {
            componentOrder: ["balance", "actions", "search", "tabs", "content"],
            spacing: 2,
            actionButtonsLayout: "horizontal" as const,
            actionButtonsAlignment: "left" as const,
          },

          visibility: {
            hideNFTs: false,
            hideActivity: false,
            hideTransactions: false,
            hideTrades: false,
            hideSearch: false,
            hideImportToken: false,
            hideSendButton: false,
            hideReceiveButton: false,
            hideScanButton: false,
            hideNetworkSelector: false,
            hideBalance: false,
          },

          tabsConfig: {
            backgroundColor: palette.background?.paper || "#FAFAFA",
            activeTabColor: palette.primary?.main || "#3B51F7",
            inactiveTabColor: palette.text?.secondary || "#656D76",
            activeTabTextColor: "#ffffff",
            inactiveTabTextColor: palette.text?.secondary || "#656D76",
            tabBarBackgroundColor: palette.background?.paper || "#FAFAFA",
            indicatorColor: palette.primary?.main || "#3B51F7",
            tokensTitleColor: palette.text?.primary || "#0E1116",
            nftsTitleColor: palette.text?.primary || "#0E1116",
            tokensIndicatorColor: palette.primary?.main || "#3B51F7",
            nftsIndicatorColor: palette.primary?.main || "#3B51F7",
            collectedTitleColor: palette.text?.primary || "#0E1116",
            favoritesTitleColor: palette.text?.primary || "#0E1116",
            hiddenTitleColor: palette.text?.primary || "#0E1116",
            collectedIndicatorColor: palette.primary?.main || "#3B51F7",
            favoritesIndicatorColor: palette.primary?.main || "#3B51F7",
            hiddenIndicatorColor: palette.primary?.main || "#3B51F7",
          },

          tokenTableConfig: {
            headerBackgroundColor: palette.background?.paper || "#FAFAFA",
            headerTextColor: palette.text?.primary || "#0E1116",
            rowBackgroundColor: palette.background?.default || "#FFFFFF",
            rowTextColor: palette.text?.primary || "#0E1116",
            hoverRowBackgroundColor: palette.primary.main,
            borderColor: palette.divider || "#E1E4E8",
          },
        } as WalletCustomSettings;
      }
    }

    return getDefaultCustomSettings(theme);
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
          <MenuItem value="custom">
            <FormattedMessage
              id="custom.variant"
              defaultMessage="Custom"
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
              value={values.glassSettings?.backgroundType || "solid"}
              onChange={(e) => {
                const newType = e.target.value as 'solid' | 'gradient' | 'image';
                setFieldValue("glassSettings.backgroundType", newType);

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
              <ColorPickerField
                label="Network Modal Text Color"
                value={values.glassSettings?.networkModalTextColor || '#fff'}
                onChange={(value: string) => setFieldValue("glassSettings.networkModalTextColor", value)}
                defaultValue="#fff"
              />
              <ColorPickerField
                label="Receive Modal Text Color"
                value={values.glassSettings?.receiveModalTextColor || '#fff'}
                onChange={(value: string) => setFieldValue("glassSettings.receiveModalTextColor", value)}
                defaultValue="#fff"
              />
              <ColorPickerField
                label="Send Modal Text Color"
                value={values.glassSettings?.sendModalTextColor || '#fff'}
                onChange={(value: string) => setFieldValue("glassSettings.sendModalTextColor", value)}
                defaultValue="#fff"
              />
              <ColorPickerField
                label="Scan Modal Text Color"
                value={values.glassSettings?.scanModalTextColor || '#fff'}
                onChange={(value: string) => setFieldValue("glassSettings.scanModalTextColor", value)}
                defaultValue="#fff"
              />
              <ColorPickerField
                label="Import Token Modal Text Color"
                value={values.glassSettings?.importTokenModalTextColor || '#fff'}
                onChange={(value: string) => setFieldValue("glassSettings.importTokenModalTextColor", value)}
                defaultValue="#fff"
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

              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={values.glassSettings?.hideNFTs || false}
                      onChange={(e) => setFieldValue("glassSettings.hideNFTs", e.target.checked)}
                    />
                  }
                  label={
                    <FormattedMessage
                      id="glass.hide.nfts"
                      defaultMessage="Hide NFTs Tab"
                    />
                  }
                />
                <Typography variant="body2" color="text.secondary">
                  <FormattedMessage
                    id="glass.hide.nfts.description"
                    defaultMessage="Hide the NFTs tab to show only ERC20 tokens in the wallet"
                  />
                </Typography>
              </Box>

              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={values.glassSettings?.hideActivity || false}
                      onChange={(e) => setFieldValue("glassSettings.hideActivity", e.target.checked)}
                    />
                  }
                  label={
                    <FormattedMessage
                      id="glass.hide.activity"
                      defaultMessage="Hide Activity Tab"
                    />
                  }
                />
                <Typography variant="body2" color="text.secondary">
                  <FormattedMessage
                    id="glass.hide.activity.description"
                    defaultMessage="Hide the activity tab to remove transaction history from the wallet"
                  />
                </Typography>
              </Box>

              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={values.glassSettings?.hideSwapAction || false}
                      onChange={(e) => setFieldValue("glassSettings.hideSwapAction", e.target.checked)}
                    />
                  }
                  label={
                    <FormattedMessage
                      id="glass.hide.swap.action"
                      defaultMessage="Hide Swap Action"
                    />
                  }
                />
                <Typography variant="body2" color="text.secondary">
                  <FormattedMessage
                    id="glass.hide.swap.action.description"
                    defaultMessage="Hide the swap action button from the token table actions column"
                  />
                </Typography>
              </Box>

              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={values.glassSettings?.hideExchangeAction || false}
                      onChange={(e) => setFieldValue("glassSettings.hideExchangeAction", e.target.checked)}
                    />
                  }
                  label={
                    <FormattedMessage
                      id="glass.hide.exchange.action"
                      defaultMessage="Hide Exchange Action"
                    />
                  }
                />
                <Typography variant="body2" color="text.secondary">
                  <FormattedMessage
                    id="glass.hide.exchange.action.description"
                    defaultMessage="Hide the exchange action button from the token table actions column"
                  />
                </Typography>
              </Box>

              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={values.glassSettings?.hideSendAction || false}
                      onChange={(e) => setFieldValue("glassSettings.hideSendAction", e.target.checked)}
                    />
                  }
                  label={
                    <FormattedMessage
                      id="glass.hide.send.action"
                      defaultMessage="Hide Send Action"
                    />
                  }
                />
                <Typography variant="body2" color="text.secondary">
                  <FormattedMessage
                    id="glass.hide.send.action.description"
                    defaultMessage="Hide the send action button from the token table actions column"
                  />
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 4, fontStyle: 'italic' }}>
                <FormattedMessage
                  id="glass.cards.inputs.note"
                  defaultMessage="Note: Cards and input fields automatically use glassmorphism effects for a cohesive visual experience. Text elements inherit the main text color for consistency."
                />
              </Typography>

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
                  <FormattedMessage
                    id="reset.styles"
                    defaultMessage="RESET STYLES"
                  />
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      )}

      {values.variant === "custom" && (
        <Paper elevation={1} sx={{ mt: 2, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            <FormattedMessage
              id="custom.variant"
              defaultMessage="Custom"
            />
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <FormattedMessage
              id="custom.description"
              defaultMessage="Completely customize all wallet elements"
            />
          </Typography>

          <Accordion
            expanded={expandedAccordions.includes('background')}
            onChange={handleAccordionChange('background')}
            sx={{ mt: 2, boxShadow: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: getTitleColor() }}>
                Background Configuration
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                Choose and customize the wallet background appearance
              </Typography>
              <RadioGroup
                value={values.customSettings?.backgroundType || "solid"}
                onChange={(e) => {
                  const newType = e.target.value as 'solid' | 'gradient' | 'image';
                  setFieldValue("customSettings.backgroundType", newType);

                  if (newType === 'solid' && !values.customSettings?.backgroundColor) {
                    setFieldValue("customSettings.backgroundColor", theme.palette.background.default);
                  } else if (newType === 'gradient') {
                    if (!values.customSettings?.gradientStartColor) {
                      setFieldValue("customSettings.gradientStartColor", theme.palette.background.default);
                    }
                    if (!values.customSettings?.gradientEndColor) {
                      setFieldValue("customSettings.gradientEndColor", theme.palette.background.paper);
                    }
                    if (!values.customSettings?.gradientDirection) {
                      setFieldValue("customSettings.gradientDirection", "to bottom");
                    }
                  } else if (newType === 'image' && !values.customSettings?.backgroundColor) {
                    setFieldValue("customSettings.backgroundColor", theme.palette.background.default);
                  }
                }}
                row
              >
                <FormControlLabel
                  value="solid"
                  control={<Radio />}
                  label={
                    <FormattedMessage
                      id="custom.background.solid"
                      defaultMessage="Solid Color"
                    />
                  }
                />
                <FormControlLabel
                  value="gradient"
                  control={<Radio />}
                  label={
                    <FormattedMessage
                      id="custom.background.gradient"
                      defaultMessage="Gradient"
                    />
                  }
                />
                <FormControlLabel
                  value="image"
                  control={<Radio />}
                  label={
                    <FormattedMessage
                      id="custom.background.image"
                      defaultMessage="Background Image"
                    />
                  }
                />
              </RadioGroup>

              {values.customSettings?.backgroundType === "solid" && (
                <Box sx={{ mt: 2 }}>
                  <ColorPickerField
                    label={formatMessage({
                      id: "custom.background.color",
                      defaultMessage: "Background Color"
                    })}
                    value={values.customSettings?.backgroundColor || theme.palette.background.default}
                    onChange={(value: string) => setFieldValue("customSettings.backgroundColor", value)}
                    defaultValue={theme.palette.background.default}
                  />
                </Box>
              )}

              {values.customSettings?.backgroundType === "gradient" && (
                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <ColorPickerField
                    label={formatMessage({
                      id: "custom.gradient.start.color",
                      defaultMessage: "Gradient Start Color"
                    })}
                    value={values.customSettings?.gradientStartColor || theme.palette.background.default}
                    onChange={(value: string) => setFieldValue("customSettings.gradientStartColor", value)}
                    defaultValue={theme.palette.background.default}
                  />
                  <ColorPickerField
                    label={formatMessage({
                      id: "custom.gradient.end.color",
                      defaultMessage: "Gradient End Color"
                    })}
                    value={values.customSettings?.gradientEndColor || theme.palette.background.paper}
                    onChange={(value: string) => setFieldValue("customSettings.gradientEndColor", value)}
                    defaultValue={theme.palette.background.paper}
                  />
                  <FormControl fullWidth>
                    <InputLabel>
                      <FormattedMessage
                        id="custom.gradient.direction"
                        defaultMessage="Gradient Direction"
                      />
                    </InputLabel>
                    <Select
                      value={values.customSettings?.gradientDirection || "to bottom"}
                      onChange={(e) => setFieldValue("customSettings.gradientDirection", e.target.value)}
                      label={formatMessage({
                        id: "custom.gradient.direction",
                        defaultMessage: "Gradient Direction"
                      })}
                    >
                      <MenuItem value="to bottom">
                        <FormattedMessage
                          id="custom.gradient.direction.bottom"
                          defaultMessage="Top to Bottom"
                        />
                      </MenuItem>
                      <MenuItem value="to top">
                        <FormattedMessage
                          id="custom.gradient.direction.top"
                          defaultMessage="Bottom to Top"
                        />
                      </MenuItem>
                      <MenuItem value="to right">
                        <FormattedMessage
                          id="custom.gradient.direction.right"
                          defaultMessage="Left to Right"
                        />
                      </MenuItem>
                      <MenuItem value="to left">
                        <FormattedMessage
                          id="custom.gradient.direction.left"
                          defaultMessage="Right to Left"
                        />
                      </MenuItem>
                      <MenuItem value="to bottom right">
                        <FormattedMessage
                          id="custom.gradient.direction.bottom.right"
                          defaultMessage="Diagonal (Top-Left to Bottom-Right)"
                        />
                      </MenuItem>
                      <MenuItem value="to bottom left">
                        <FormattedMessage
                          id="custom.gradient.direction.bottom.left"
                          defaultMessage="Diagonal (Top-Right to Bottom-Left)"
                        />
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              )}

              {values.customSettings?.backgroundType === "image" && (
                <Box sx={{ mt: 2 }}>
                  <BackgroundImageSelector
                    value={values.customSettings?.backgroundImage}
                    onChange={(url) => setFieldValue("customSettings.backgroundImage", url)}
                    sizeValue={values.customSettings?.backgroundSize}
                    onSizeChange={(size) => setFieldValue("customSettings.backgroundSize", size)}
                    positionValue={values.customSettings?.backgroundPosition}
                    onPositionChange={(position) => setFieldValue("customSettings.backgroundPosition", position)}
                    repeatValue={values.customSettings?.backgroundRepeat}
                    onRepeatChange={(repeat) => setFieldValue("customSettings.backgroundRepeat", repeat)}
                    attachmentValue={values.customSettings?.backgroundAttachment}
                    onAttachmentChange={(attachment) => setFieldValue("customSettings.backgroundAttachment", attachment)}
                  />
                </Box>
              )}
              {values.customSettings?.backgroundType === "image" && (
                <Box sx={{ mt: 2 }}>
                  <Typography gutterBottom>
                    <FormattedMessage id="custom.background.blur" defaultMessage="Background Blur" />
                  </Typography>
                  <Slider
                    value={values.customSettings?.backgroundBlur ?? 0}
                    onChange={(_, value) => setFieldValue("customSettings.backgroundBlur", value)}
                    min={0}
                    max={40}
                    step={1}
                    valueLabelDisplay="auto"
                    marks={[{ value: 0, label: '0px' }, { value: 20, label: '20px' }, { value: 40, label: '40px' }]}
                  />
                </Box>
              )}
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expandedAccordions.includes('wallet')}
            onChange={handleAccordionChange('wallet')}
            sx={{ mt: 2, boxShadow: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: getTitleColor() }}>
                Wallet Display
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                Configure wallet title and balance appearance
              </Typography>
              <Grid container spacing={getFormSpacing()}>
                <Grid item xs={12} sm={6}>
                  <ColorPickerField
                    label={formatMessage({
                      id: "custom.wallet.title.color",
                      defaultMessage: "Wallet Title Color"
                    })}
                    value={values.customSettings?.primaryTextColor || theme.palette.text.primary}
                    onChange={(value: string) => setFieldValue("customSettings.primaryTextColor", value)}
                    defaultValue={theme.palette.text.primary}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ColorPickerField
                    label={formatMessage({
                      id: "custom.balance.text.color",
                      defaultMessage: "Balance Text Color"
                    })}
                    value={values.customSettings?.balanceTextColor || theme.palette.text.primary}
                    onChange={(value: string) => setFieldValue("customSettings.balanceTextColor", value)}
                    defaultValue={theme.palette.text.primary}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ColorPickerField
                    label={formatMessage({
                      id: "custom.tokens.title.color",
                      defaultMessage: "Tokens Tab Title Color"
                    })}
                    value={values.customSettings?.tabsConfig?.tokensTitleColor || theme.palette.text.primary}
                    onChange={(value: string) => setFieldValue("customSettings.tabsConfig.tokensTitleColor", value)}
                    defaultValue={theme.palette.text.primary}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ColorPickerField
                    label={formatMessage({
                      id: "custom.nfts.title.color",
                      defaultMessage: "NFTs Tab Title Color"
                    })}
                    value={values.customSettings?.tabsConfig?.nftsTitleColor || theme.palette.text.primary}
                    onChange={(value: string) => setFieldValue("customSettings.tabsConfig.nftsTitleColor", value)}
                    defaultValue={theme.palette.text.primary}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ColorPickerField
                    label={formatMessage({
                      id: "custom.tokens.indicator.color",
                      defaultMessage: "Tokens Tab Underline Color"
                    })}
                    value={values.customSettings?.tabsConfig?.tokensIndicatorColor || theme.palette.primary.main}
                    onChange={(value: string) => setFieldValue("customSettings.tabsConfig.tokensIndicatorColor", value)}
                    defaultValue={theme.palette.primary.main}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ColorPickerField
                    label={formatMessage({
                      id: "custom.nfts.indicator.color",
                      defaultMessage: "NFTs Tab Underline Color"
                    })}
                    value={values.customSettings?.tabsConfig?.nftsIndicatorColor || theme.palette.primary.main}
                    onChange={(value: string) => setFieldValue("customSettings.tabsConfig.nftsIndicatorColor", value)}
                    defaultValue={theme.palette.primary.main}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
                    <FormattedMessage
                      id="custom.nft.subtabs.colors"
                      defaultMessage="NFT Sub-tabs Colors"
                    />
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <ColorPickerField
                    label={formatMessage({
                      id: "custom.collected.title.color",
                      defaultMessage: "Collected Title Color"
                    })}
                    value={values.customSettings?.tabsConfig?.collectedTitleColor || theme.palette.text.primary}
                    onChange={(value: string) => setFieldValue("customSettings.tabsConfig.collectedTitleColor", value)}
                    defaultValue={theme.palette.text.primary}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <ColorPickerField
                    label={formatMessage({
                      id: "custom.favorites.title.color",
                      defaultMessage: "Favorites Title Color"
                    })}
                    value={values.customSettings?.tabsConfig?.favoritesTitleColor || theme.palette.text.primary}
                    onChange={(value: string) => setFieldValue("customSettings.tabsConfig.favoritesTitleColor", value)}
                    defaultValue={theme.palette.text.primary}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <ColorPickerField
                    label={formatMessage({
                      id: "custom.hidden.title.color",
                      defaultMessage: "Hidden Title Color"
                    })}
                    value={values.customSettings?.tabsConfig?.hiddenTitleColor || theme.palette.text.primary}
                    onChange={(value: string) => setFieldValue("customSettings.tabsConfig.hiddenTitleColor", value)}
                    defaultValue={theme.palette.text.primary}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <ColorPickerField
                    label={formatMessage({
                      id: "custom.collected.indicator.color",
                      defaultMessage: "Collected Underline Color"
                    })}
                    value={values.customSettings?.tabsConfig?.collectedIndicatorColor || theme.palette.primary.main}
                    onChange={(value: string) => setFieldValue("customSettings.tabsConfig.collectedIndicatorColor", value)}
                    defaultValue={theme.palette.primary.main}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <ColorPickerField
                    label={formatMessage({
                      id: "custom.favorites.indicator.color",
                      defaultMessage: "Favorites Underline Color"
                    })}
                    value={values.customSettings?.tabsConfig?.favoritesIndicatorColor || theme.palette.primary.main}
                    onChange={(value: string) => setFieldValue("customSettings.tabsConfig.favoritesIndicatorColor", value)}
                    defaultValue={theme.palette.primary.main}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <ColorPickerField
                    label={formatMessage({
                      id: "custom.hidden.indicator.color",
                      defaultMessage: "Hidden Underline Color"
                    })}
                    value={values.customSettings?.tabsConfig?.hiddenIndicatorColor || theme.palette.primary.main}
                    onChange={(value: string) => setFieldValue("customSettings.tabsConfig.hiddenIndicatorColor", value)}
                    defaultValue={theme.palette.primary.main}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expandedAccordions.includes('buttons')}
            onChange={handleAccordionChange('buttons')}
            sx={{ mt: 2, boxShadow: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: getTitleColor() }}>
                Action Buttons
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                Customize the appearance of wallet action buttons
              </Typography>

              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom sx={{ fontWeight: 'medium' }}>
                  <FormattedMessage
                    id="custom.send.button.title"
                    defaultMessage="Send Button"
                  />
                </Typography>
                <Grid container spacing={getFormSpacing()}>
                  <Grid item xs={12} sm={3}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.button.background.color",
                        defaultMessage: "Background Color"
                      })}
                      value={values.customSettings?.sendButtonConfig?.backgroundColor || theme.palette.primary.main}
                      onChange={(value: string) => setFieldValue("customSettings.sendButtonConfig.backgroundColor", value)}
                      defaultValue={theme.palette.primary.main}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.button.text.color",
                        defaultMessage: "Text Color"
                      })}
                      value={values.customSettings?.sendButtonConfig?.textColor || theme.palette.primary.contrastText}
                      onChange={(value: string) => setFieldValue("customSettings.sendButtonConfig.textColor", value)}
                      defaultValue={theme.palette.primary.contrastText}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.button.border.color",
                        defaultMessage: "Border Color"
                      })}
                      value={values.customSettings?.sendButtonConfig?.borderColor || theme.palette.primary.main}
                      onChange={(value: string) => setFieldValue("customSettings.sendButtonConfig.borderColor", value)}
                      defaultValue={theme.palette.primary.main}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.button.hover.color",
                        defaultMessage: "Hover Color"
                      })}
                      value={values.customSettings?.sendButtonConfig?.hoverBackgroundColor || theme.palette.primary.dark}
                      onChange={(value: string) => setFieldValue("customSettings.sendButtonConfig.hoverBackgroundColor", value)}
                      defaultValue={theme.palette.primary.dark}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom sx={{ fontWeight: 'medium' }}>
                  <FormattedMessage
                    id="custom.receive.button.title"
                    defaultMessage="Receive Button"
                  />
                </Typography>
                <Grid container spacing={getFormSpacing()}>
                  <Grid item xs={12} sm={3}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.button.background.color",
                        defaultMessage: "Background Color"
                      })}
                      value={values.customSettings?.receiveButtonConfig?.backgroundColor || theme.palette.primary.main}
                      onChange={(value: string) => setFieldValue("customSettings.receiveButtonConfig.backgroundColor", value)}
                      defaultValue={theme.palette.primary.main}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.button.text.color",
                        defaultMessage: "Text Color"
                      })}
                      value={values.customSettings?.receiveButtonConfig?.textColor || theme.palette.primary.contrastText}
                      onChange={(value: string) => setFieldValue("customSettings.receiveButtonConfig.textColor", value)}
                      defaultValue={theme.palette.primary.contrastText}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.button.border.color",
                        defaultMessage: "Border Color"
                      })}
                      value={values.customSettings?.receiveButtonConfig?.borderColor || theme.palette.primary.main}
                      onChange={(value: string) => setFieldValue("customSettings.receiveButtonConfig.borderColor", value)}
                      defaultValue={theme.palette.primary.main}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.button.hover.color",
                        defaultMessage: "Hover Color"
                      })}
                      value={values.customSettings?.receiveButtonConfig?.hoverBackgroundColor || theme.palette.primary.dark}
                      onChange={(value: string) => setFieldValue("customSettings.receiveButtonConfig.hoverBackgroundColor", value)}
                      defaultValue={theme.palette.primary.dark}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom sx={{ fontWeight: 'medium' }}>
                  <FormattedMessage
                    id="custom.scan.button.title"
                    defaultMessage="Scan QR Button"
                  />
                </Typography>
                <Grid container spacing={getFormSpacing()}>
                  <Grid item xs={12} sm={3}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.button.background.color",
                        defaultMessage: "Background Color"
                      })}
                      value={values.customSettings?.scanButtonConfig?.backgroundColor || theme.palette.secondary.main}
                      onChange={(value: string) => setFieldValue("customSettings.scanButtonConfig.backgroundColor", value)}
                      defaultValue={theme.palette.secondary.main}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.button.text.color",
                        defaultMessage: "Text Color"
                      })}
                      value={values.customSettings?.scanButtonConfig?.textColor || theme.palette.secondary.contrastText}
                      onChange={(value: string) => setFieldValue("customSettings.scanButtonConfig.textColor", value)}
                      defaultValue={theme.palette.secondary.contrastText}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.button.border.color",
                        defaultMessage: "Border Color"
                      })}
                      value={values.customSettings?.scanButtonConfig?.borderColor || theme.palette.secondary.main}
                      onChange={(value: string) => setFieldValue("customSettings.scanButtonConfig.borderColor", value)}
                      defaultValue={theme.palette.secondary.main}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.button.hover.color",
                        defaultMessage: "Hover Color"
                      })}
                      value={values.customSettings?.scanButtonConfig?.hoverBackgroundColor || theme.palette.secondary.dark}
                      onChange={(value: string) => setFieldValue("customSettings.scanButtonConfig.hoverBackgroundColor", value)}
                      defaultValue={theme.palette.secondary.dark}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom sx={{ fontWeight: 'medium' }}>
                  <FormattedMessage
                    id="custom.import.token.button.title"
                    defaultMessage="Import Token Button"
                  />
                </Typography>
                <Grid container spacing={getFormSpacing()}>
                  <Grid item xs={12} sm={3}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.button.background.color",
                        defaultMessage: "Background Color"
                      })}
                      value={values.customSettings?.importTokenButtonConfig?.backgroundColor || theme.palette.info.main}
                      onChange={(value: string) => setFieldValue("customSettings.importTokenButtonConfig.backgroundColor", value)}
                      defaultValue={theme.palette.info.main}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.button.text.color",
                        defaultMessage: "Text Color"
                      })}
                      value={values.customSettings?.importTokenButtonConfig?.textColor || theme.palette.info.contrastText}
                      onChange={(value: string) => setFieldValue("customSettings.importTokenButtonConfig.textColor", value)}
                      defaultValue={theme.palette.info.contrastText}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.button.border.color",
                        defaultMessage: "Border Color"
                      })}
                      value={values.customSettings?.importTokenButtonConfig?.borderColor || theme.palette.info.main}
                      onChange={(value: string) => setFieldValue("customSettings.importTokenButtonConfig.borderColor", value)}
                      defaultValue={theme.palette.info.main}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.button.hover.color",
                        defaultMessage: "Hover Color"
                      })}
                      value={values.customSettings?.importTokenButtonConfig?.hoverBackgroundColor || theme.palette.info.dark}
                      onChange={(value: string) => setFieldValue("customSettings.importTokenButtonConfig.hoverBackgroundColor", value)}
                      defaultValue={theme.palette.info.dark}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom sx={{ fontWeight: 'medium' }}>
                  <FormattedMessage
                    id="custom.swap.button.title"
                    defaultMessage="Swap Button"
                  />
                </Typography>
                <Grid container spacing={getFormSpacing()}>
                  <Grid item xs={12} sm={3}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.button.background.color",
                        defaultMessage: "Background Color"
                      })}
                      value={values.customSettings?.swapButtonConfig?.backgroundColor || theme.palette.primary.main}
                      onChange={(value: string) => setFieldValue("customSettings.swapButtonConfig.backgroundColor", value)}
                      defaultValue={theme.palette.primary.main}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.button.text.color",
                        defaultMessage: "Text Color"
                      })}
                      value={values.customSettings?.swapButtonConfig?.textColor || theme.palette.primary.contrastText}
                      onChange={(value: string) => setFieldValue("customSettings.swapButtonConfig.textColor", value)}
                      defaultValue={theme.palette.primary.contrastText}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.button.border.color",
                        defaultMessage: "Border Color"
                      })}
                      value={values.customSettings?.swapButtonConfig?.borderColor || theme.palette.primary.main}
                      onChange={(value: string) => setFieldValue("customSettings.swapButtonConfig.borderColor", value)}
                      defaultValue={theme.palette.primary.main}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.button.hover.color",
                        defaultMessage: "Hover Color"
                      })}
                      value={values.customSettings?.swapButtonConfig?.hoverBackgroundColor || theme.palette.primary.dark}
                      onChange={(value: string) => setFieldValue("customSettings.swapButtonConfig.hoverBackgroundColor", value)}
                      defaultValue={theme.palette.primary.dark}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom sx={{ fontWeight: 'medium' }}>
                  <FormattedMessage
                    id="custom.back.button.title"
                    defaultMessage="Back Button (Swap View)"
                  />
                </Typography>
                <Grid container spacing={getFormSpacing()}>
                  <Grid item xs={12} sm={3}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.button.background.color",
                        defaultMessage: "Background Color"
                      })}
                      value={values.customSettings?.backButtonConfig?.backgroundColor || theme.palette.primary.main}
                      onChange={(value: string) => setFieldValue("customSettings.backButtonConfig.backgroundColor", value)}
                      defaultValue={theme.palette.primary.main}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.button.text.color",
                        defaultMessage: "Text Color"
                      })}
                      value={values.customSettings?.backButtonConfig?.textColor || theme.palette.primary.contrastText}
                      onChange={(value: string) => setFieldValue("customSettings.backButtonConfig.textColor", value)}
                      defaultValue={theme.palette.primary.contrastText}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.button.border.color",
                        defaultMessage: "Border Color"
                      })}
                      value={values.customSettings?.backButtonConfig?.borderColor || theme.palette.primary.main}
                      onChange={(value: string) => setFieldValue("customSettings.backButtonConfig.borderColor", value)}
                      defaultValue={theme.palette.primary.main}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.button.hover.color",
                        defaultMessage: "Hover Color"
                      })}
                      value={values.customSettings?.backButtonConfig?.hoverBackgroundColor || theme.palette.primary.dark}
                      onChange={(value: string) => setFieldValue("customSettings.backButtonConfig.hoverBackgroundColor", value)}
                      defaultValue={theme.palette.primary.dark}
                    />
                  </Grid>
                </Grid>
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expandedAccordions.includes('network')}
            onChange={handleAccordionChange('network')}
            sx={{ mt: 2, boxShadow: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: getTitleColor() }}>
                Network Selector
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                Customize the network selector button appearance
              </Typography>
              <Grid container spacing={getFormSpacing()}>
                <Grid item xs={12} sm={4}>
                  <ColorPickerField
                    label={formatMessage({
                      id: "custom.network.background.color",
                      defaultMessage: "Background Color"
                    })}
                    value={values.customSettings?.networkSelectorConfig?.backgroundColor || theme.palette.background.paper}
                    onChange={(value: string) => setFieldValue("customSettings.networkSelectorConfig.backgroundColor", value)}
                    defaultValue={theme.palette.background.paper}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <ColorPickerField
                    label={formatMessage({
                      id: "custom.network.text.color",
                      defaultMessage: "Text Color"
                    })}
                    value={values.customSettings?.networkSelectorConfig?.textColor || theme.palette.text.primary}
                    onChange={(value: string) => setFieldValue("customSettings.networkSelectorConfig.textColor", value)}
                    defaultValue={theme.palette.text.primary}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <ColorPickerField
                    label={formatMessage({
                      id: "custom.network.border.color",
                      defaultMessage: "Border Color"
                    })}
                    value={values.customSettings?.networkSelectorConfig?.borderColor || theme.palette.divider}
                    onChange={(value: string) => setFieldValue("customSettings.networkSelectorConfig.borderColor", value)}
                    defaultValue={theme.palette.divider}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expandedAccordions.includes('card')}
            onChange={handleAccordionChange('card')}
            sx={{ mt: 2, boxShadow: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: getTitleColor() }}>
                Card Styling
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                Configure card backgrounds, borders, shadows and overall styling
              </Typography>
              <Grid container spacing={getFormSpacing()}>
                <Grid item xs={12} sm={4}>
                  <ColorPickerField
                    label={formatMessage({
                      id: "custom.table.header.background.color",
                      defaultMessage: "Header Background Color"
                    })}
                    value={values.customSettings?.tokenTableConfig?.headerBackgroundColor || values.customSettings?.cardConfig?.backgroundColor || theme.palette.background.paper}
                    onChange={(value: string) => setFieldValue("customSettings.tokenTableConfig.headerBackgroundColor", value)}
                    defaultValue={theme.palette.background.paper}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <ColorPickerField
                    label={formatMessage({
                      id: "custom.card.border.color",
                      defaultMessage: "Border Color"
                    })}
                    value={values.customSettings?.cardConfig?.borderColor || theme.palette.divider}
                    onChange={(value: string) => setFieldValue("customSettings.cardConfig.borderColor", value)}
                    defaultValue={theme.palette.divider}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label={formatMessage({
                      id: "custom.card.border.radius",
                      defaultMessage: "Border Radius (px)"
                    })}
                    value={values.customSettings?.cardConfig?.borderRadius || 8}
                    onChange={(e) => setFieldValue("customSettings.cardConfig.borderRadius", parseInt(e.target.value) || 8)}
                    inputProps={{ min: 0, max: 50 }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <ColorPickerField
                    label={formatMessage({
                      id: "custom.card.shadow.color",
                      defaultMessage: "Shadow Color"
                    })}
                    value={values.customSettings?.cardConfig?.shadowColor || theme.palette.common.black}
                    onChange={(value: string) => setFieldValue("customSettings.cardConfig.shadowColor", value)}
                    defaultValue={theme.palette.common.black}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label={formatMessage({
                      id: "custom.card.shadow.intensity",
                      defaultMessage: "Shadow Intensity"
                    })}
                    value={values.customSettings?.cardConfig?.shadowIntensity || 0.1}
                    onChange={(e) => setFieldValue("customSettings.cardConfig.shadowIntensity", parseFloat(e.target.value) || 0.1)}
                    inputProps={{ min: 0, max: 1, step: 0.1 }}
                    helperText={formatMessage({
                      id: "custom.card.shadow.intensity.help",
                      defaultMessage: "Value between 0 (no shadow) and 1 (strong shadow)"
                    })}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body2" gutterBottom sx={{ fontWeight: 'medium', mt: 2 }}>
                    <FormattedMessage
                      id="custom.table.rows.title"
                      defaultMessage="Table Rows Configuration"
                    />
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <ColorPickerField
                    label={formatMessage({
                      id: "custom.table.row.background.color",
                      defaultMessage: "Row Background Color"
                    })}
                    value={values.customSettings?.tokenTableConfig?.rowBackgroundColor || theme.palette.background.default}
                    onChange={(value: string) => setFieldValue("customSettings.tokenTableConfig.rowBackgroundColor", value)}
                    defaultValue={theme.palette.background.default}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <ColorPickerField
                    label={formatMessage({
                      id: "custom.table.row.hover.color",
                      defaultMessage: "Row Hover Color"
                    })}
                    value={values.customSettings?.tokenTableConfig?.hoverRowBackgroundColor || theme.palette.primary.main}
                    onChange={(value: string) => setFieldValue("customSettings.tokenTableConfig.hoverRowBackgroundColor", value)}
                    defaultValue={theme.palette.primary.main}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <ColorPickerField
                    label={formatMessage({
                      id: "custom.table.row.text.color",
                      defaultMessage: "Row Text Color"
                    })}
                    value={values.customSettings?.tokenTableConfig?.rowTextColor || theme.palette.text.primary}
                    onChange={(value: string) => setFieldValue("customSettings.tokenTableConfig.rowTextColor", value)}
                    defaultValue={theme.palette.text.primary}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ColorPickerField
                    label={formatMessage({
                      id: "custom.table.header.text.color",
                      defaultMessage: "Header Text Color"
                    })}
                    value={values.customSettings?.tokenTableConfig?.headerTextColor || theme.palette.text.primary}
                    onChange={(value: string) => setFieldValue("customSettings.tokenTableConfig.headerTextColor", value)}
                    defaultValue={theme.palette.text.primary}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ColorPickerField
                    label={formatMessage({
                      id: "custom.table.border.color",
                      defaultMessage: "Table Border Color"
                    })}
                    value={values.customSettings?.tokenTableConfig?.borderColor || theme.palette.divider}
                    onChange={(value: string) => setFieldValue("customSettings.tokenTableConfig.borderColor", value)}
                    defaultValue={theme.palette.divider}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expandedAccordions.includes('exchange-text')}
            onChange={handleAccordionChange('exchange-text')}
            sx={{ mt: 2, boxShadow: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: getTitleColor() }}>
                Exchange Text Colors
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                Configure text colors for exchange components to override default colors
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'medium', color: theme.palette.text.primary }}>
                  <FormattedMessage
                    id="custom.exchange.pair.info"
                    defaultMessage="Pair Information Section"
                  />
                </Typography>
                <Grid container spacing={getFormSpacing()}>
                  <Grid item xs={12} sm={6}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.exchange.pair.info.text.color",
                        defaultMessage: "Text Color"
                      })}
                      value={values.customSettings?.exchangeTextColors?.pairInfoTextColor || theme.palette.text.primary}
                      onChange={(value: string) => setFieldValue("customSettings.exchangeTextColors.pairInfoTextColor", value)}
                      defaultValue={theme.palette.text.primary}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.exchange.pair.info.secondary.text.color",
                        defaultMessage: "Secondary Text Color"
                      })}
                      value={values.customSettings?.exchangeTextColors?.pairInfoSecondaryTextColor || theme.palette.text.secondary}
                      onChange={(value: string) => setFieldValue("customSettings.exchangeTextColors.pairInfoSecondaryTextColor", value)}
                      defaultValue={theme.palette.text.secondary}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'medium', color: theme.palette.text.primary }}>
                  <FormattedMessage
                    id="custom.exchange.trade.widget"
                    defaultMessage="Trading Widget"
                  />
                </Typography>
                <Grid container spacing={getFormSpacing()}>
                  <Grid item xs={12} sm={6}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.exchange.trade.widget.text.color",
                        defaultMessage: "Text Color"
                      })}
                      value={values.customSettings?.exchangeTextColors?.tradeWidgetTextColor || theme.palette.text.primary}
                      onChange={(value: string) => setFieldValue("customSettings.exchangeTextColors.tradeWidgetTextColor", value)}
                      defaultValue={theme.palette.text.primary}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.exchange.trade.widget.button.text.color",
                        defaultMessage: "Button Text Color"
                      })}
                      value={values.customSettings?.exchangeTextColors?.tradeWidgetButtonTextColor || theme.palette.primary.contrastText}
                      onChange={(value: string) => setFieldValue("customSettings.exchangeTextColors.tradeWidgetButtonTextColor", value)}
                      defaultValue={theme.palette.primary.contrastText}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.exchange.trade.widget.tab.text.color",
                        defaultMessage: "Tab Text Color"
                      })}
                      value={values.customSettings?.exchangeTextColors?.tradeWidgetTabTextColor || (theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000')}
                      onChange={(value: string) => setFieldValue("customSettings.exchangeTextColors.tradeWidgetTabTextColor", value)}
                      defaultValue={theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.exchange.trade.widget.input.text.color",
                        defaultMessage: "Input Text Color"
                      })}
                      value={values.customSettings?.exchangeTextColors?.tradeWidgetInputTextColor || theme.palette.text.primary}
                      onChange={(value: string) => setFieldValue("customSettings.exchangeTextColors.tradeWidgetInputTextColor", value)}
                      defaultValue={theme.palette.text.primary}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'medium', color: theme.palette.text.primary }}>
                  <FormattedMessage
                    id="custom.exchange.trading.graph"
                    defaultMessage="Trading Chart"
                  />
                </Typography>
                <Grid container spacing={getFormSpacing()}>
                  <Grid item xs={12} sm={6}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.exchange.trading.graph.control.text.color",
                        defaultMessage: "Show Swaps Text Color"
                      })}
                      value={values.customSettings?.exchangeTextColors?.tradingGraphControlTextColor || theme.palette.text.primary}
                      onChange={(value: string) => setFieldValue("customSettings.exchangeTextColors.tradingGraphControlTextColor", value)}
                      defaultValue={theme.palette.text.primary}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.exchange.trading.graph.background.color",
                        defaultMessage: "Chart Background Color"
                      })}
                      value={values.customSettings?.exchangeTextColors?.tradingGraphBackgroundColor || theme.palette.background.paper}
                      onChange={(value: string) => setFieldValue("customSettings.exchangeTextColors.tradingGraphBackgroundColor", value)}
                      defaultValue={theme.palette.background.paper}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'medium', color: theme.palette.text.primary }}>
                  <FormattedMessage
                    id="custom.exchange.component.backgrounds"
                    defaultMessage="Component Backgrounds"
                  />
                </Typography>
                <Grid container spacing={getFormSpacing()}>
                  <Grid item xs={12} sm={6}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.exchange.pair.info.background.color",
                        defaultMessage: "Pair Info Background"
                      })}
                      value={values.customSettings?.exchangeTextColors?.pairInfoBackgroundColor || theme.palette.background.paper}
                      onChange={(value: string) => setFieldValue("customSettings.exchangeTextColors.pairInfoBackgroundColor", value)}
                      defaultValue={theme.palette.background.paper}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.exchange.trade.widget.background.color",
                        defaultMessage: "Trade Widget Background"
                      })}
                      value={values.customSettings?.exchangeTextColors?.tradeWidgetBackgroundColor || theme.palette.background.paper}
                      onChange={(value: string) => setFieldValue("customSettings.exchangeTextColors.tradeWidgetBackgroundColor", value)}
                      defaultValue={theme.palette.background.paper}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt: 2 }}>
                <FormattedMessage
                  id="custom.exchange.text.colors.note"
                  defaultMessage="These colors will override the default text colors in the exchange interface, providing fine-grained control over text appearance."
                />
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expandedAccordions.includes('nftColors')}
            onChange={handleAccordionChange('nftColors')}
            sx={{ mt: 2, boxShadow: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: getTitleColor() }}>
                NFT Colors
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                Configure text and card colors for NFT components to override default styling
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'medium', color: theme.palette.text.primary }}>
                  NFT Text Colors
                </Typography>
                <Grid container spacing={getFormSpacing()}>
                  <Grid item xs={12} sm={6}>
                    <ColorPickerField
                      label="NFT Title Color"
                      value={values.customSettings?.nftColors?.titleColor || theme.palette.text.primary}
                      onChange={(value: string) => setFieldValue("customSettings.nftColors.titleColor", value)}
                      defaultValue={theme.palette.text.primary}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <ColorPickerField
                      label="Collection Name Color"
                      value={values.customSettings?.nftColors?.collectionColor || theme.palette.text.secondary}
                      onChange={(value: string) => setFieldValue("customSettings.nftColors.collectionColor", value)}
                      defaultValue={theme.palette.text.secondary}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'medium', color: theme.palette.text.primary }}>
                  NFT Card Colors
                </Typography>
                <Grid container spacing={getFormSpacing()}>
                  <Grid item xs={12} sm={6}>
                    <ColorPickerField
                      label="Card Background Color"
                      value={values.customSettings?.nftColors?.cardBackgroundColor || theme.palette.background.paper}
                      onChange={(value: string) => setFieldValue("customSettings.nftColors.cardBackgroundColor", value)}
                      defaultValue={theme.palette.background.paper}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <ColorPickerField
                      label="Card Border Color"
                      value={values.customSettings?.nftColors?.cardBorderColor || theme.palette.divider}
                      onChange={(value: string) => setFieldValue("customSettings.nftColors.cardBorderColor", value)}
                      defaultValue={theme.palette.divider}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                These colors will override the default text and card colors in NFT components, providing fine-grained control over the appearance of NFT titles, collection names, and card styling.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expandedAccordions.includes('visibility')}
            onChange={handleAccordionChange('visibility')}
            sx={{ mt: 2, boxShadow: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: getTitleColor() }}>
                Visibility & Layout
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                Control which elements are visible and configure layout options
              </Typography>
              <Grid container spacing={getFormSpacing()}>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values.customSettings?.visibility?.hideNFTs || false}
                        onChange={(e) => setFieldValue("customSettings.visibility.hideNFTs", e.target.checked)}
                      />
                    }
                    label={
                      <FormattedMessage
                        id="custom.hide.nfts"
                        defaultMessage="Hide NFTs Tab"
                      />
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values.customSettings?.visibility?.hideActivity || false}
                        onChange={(e) => setFieldValue("customSettings.visibility.hideActivity", e.target.checked)}
                      />
                    }
                    label={
                      <FormattedMessage
                        id="custom.hide.activity"
                        defaultMessage="Hide Activity Tab"
                      />
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values.customSettings?.visibility?.hideSearch || false}
                        onChange={(e) => setFieldValue("customSettings.visibility.hideSearch", e.target.checked)}
                      />
                    }
                    label={
                      <FormattedMessage
                        id="custom.hide.search"
                        defaultMessage="Hide Search"
                      />
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values.customSettings?.visibility?.hideSendButton || false}
                        onChange={(e) => setFieldValue("customSettings.visibility.hideSendButton", e.target.checked)}
                      />
                    }
                    label={
                      <FormattedMessage
                        id="custom.hide.send.button"
                        defaultMessage="Hide Send Button"
                      />
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values.customSettings?.visibility?.hideReceiveButton || false}
                        onChange={(e) => setFieldValue("customSettings.visibility.hideReceiveButton", e.target.checked)}
                      />
                    }
                    label={
                      <FormattedMessage
                        id="custom.hide.receive.button"
                        defaultMessage="Hide Receive Button"
                      />
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values.customSettings?.visibility?.hideScanButton || false}
                        onChange={(e) => setFieldValue("customSettings.visibility.hideScanButton", e.target.checked)}
                      />
                    }
                    label={
                      <FormattedMessage
                        id="custom.hide.scan.button"
                        defaultMessage="Hide Scan Button"
                      />
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values.customSettings?.visibility?.hideImportToken || false}
                        onChange={(e) => setFieldValue("customSettings.visibility.hideImportToken", e.target.checked)}
                      />
                    }
                    label={
                      <FormattedMessage
                        id="custom.hide.import.token"
                        defaultMessage="Hide Import Token"
                      />
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values.customSettings?.visibility?.hideNetworkSelector || false}
                        onChange={(e) => setFieldValue("customSettings.visibility.hideNetworkSelector", e.target.checked)}
                      />
                    }
                    label={
                      <FormattedMessage
                        id="custom.hide.network.selector"
                        defaultMessage="Hide Network Selector"
                      />
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values.customSettings?.visibility?.hideBalance || false}
                        onChange={(e) => setFieldValue("customSettings.visibility.hideBalance", e.target.checked)}
                      />
                    }
                    label={
                      <FormattedMessage
                        id="custom.hide.balance"
                        defaultMessage="Hide Total Balance"
                      />
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values.customSettings?.visibility?.hideSwapAction || false}
                        onChange={(e) => setFieldValue("customSettings.visibility.hideSwapAction", e.target.checked)}
                      />
                    }
                    label={
                      <FormattedMessage
                        id="custom.hide.swap.action"
                        defaultMessage="Hide Swap Action"
                      />
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values.customSettings?.visibility?.hideExchangeAction || false}
                        onChange={(e) => setFieldValue("customSettings.visibility.hideExchangeAction", e.target.checked)}
                      />
                    }
                    label={
                      <FormattedMessage
                        id="custom.hide.exchange.action"
                        defaultMessage="Hide Exchange Action"
                      />
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values.customSettings?.visibility?.hideSendAction || false}
                        onChange={(e) => setFieldValue("customSettings.visibility.hideSendAction", e.target.checked)}
                      />
                    }
                    label={
                      <FormattedMessage
                        id="custom.hide.send.action"
                        defaultMessage="Hide Send Action"
                      />
                    }
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'medium', color: theme.palette.text.primary }}>
                  <FormattedMessage
                    id="custom.swap.configuration"
                    defaultMessage="Swap Configuration"
                  />
                </Typography>
                <Grid container spacing={getFormSpacing()}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>
                        <FormattedMessage
                          id="custom.swap.variant"
                          defaultMessage="Swap Widget Variant"
                        />
                      </InputLabel>
                      <Select
                        value={values.customSettings?.swapConfig?.variant || SwapVariant.Classic}
                        onChange={(e) => setFieldValue("customSettings.swapConfig.variant", e.target.value as SwapVariant)}
                        label={formatMessage({
                          id: "custom.swap.variant",
                          defaultMessage: "Swap Widget Variant"
                        })}
                      >
                        <MenuItem value={SwapVariant.Classic}>
                          <FormattedMessage id="classic" defaultMessage="Classic - Traditional swap interface" />
                        </MenuItem>
                        <MenuItem value={SwapVariant.MatchaLike}>
                          <FormattedMessage id="pro" defaultMessage="Pro - Advanced trading interface" />
                        </MenuItem>
                        <MenuItem value={SwapVariant.UniswapLike}>
                          <FormattedMessage id="modern" defaultMessage="Modern - Clean, contemporary design" />
                        </MenuItem>
                        <MenuItem value={SwapVariant.Minimal}>
                          <FormattedMessage id="minimal" defaultMessage="Minimal - Ultra-clean interface" />
                        </MenuItem>
                        <MenuItem value={SwapVariant.Compact}>
                          <FormattedMessage id="compact" defaultMessage="Compact - Space-efficient for small areas" />
                        </MenuItem>
                        <MenuItem value={SwapVariant.Mobile}>
                          <FormattedMessage id="mobile" defaultMessage="Mobile - Touch-optimized with gestures" />
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>


                </Grid>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'medium', color: theme.palette.text.primary }}>
                  <FormattedMessage
                    id="custom.exchange.configuration"
                    defaultMessage="Exchange Configuration"
                  />
                </Typography>
                <Grid container spacing={getFormSpacing()}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>
                        <FormattedMessage
                          id="custom.exchange.variant"
                          defaultMessage="Exchange Widget Variant"
                        />
                      </InputLabel>
                      <Select
                        value={values.customSettings?.exchangeConfig?.variant || "default"}
                        onChange={(e) => setFieldValue("customSettings.exchangeConfig.variant", e.target.value as "default" | "custom")}
                        label={formatMessage({
                          id: "custom.exchange.variant",
                          defaultMessage: "Exchange Widget Variant"
                        })}
                      >
                        <MenuItem value="default">
                          <FormattedMessage id="default" defaultMessage="Default - Standard exchange interface" />
                        </MenuItem>
                        <MenuItem value="custom">
                          <FormattedMessage id="custom" defaultMessage="Custom - Configurable exchange interface" />
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expandedAccordions.includes('search')}
            onChange={handleAccordionChange('search')}
            sx={{ mt: 2, boxShadow: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: getTitleColor() }}>
                Search & Input
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                Configure the token search bar appearance and behavior
              </Typography>
              <Grid container spacing={getFormSpacing()}>
                <Grid item xs={12} sm={6}>
                  <ColorPickerField
                    label={formatMessage({
                      id: "custom.token.search.background.color",
                      defaultMessage: "Background Color"
                    })}
                    value={values.customSettings?.tokenSearchConfig?.backgroundColor || theme.palette.background.default}
                    onChange={(value: string) => setFieldValue("customSettings.tokenSearchConfig.backgroundColor", value)}
                    defaultValue={theme.palette.background.default}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ColorPickerField
                    label={formatMessage({
                      id: "custom.token.search.text.color",
                      defaultMessage: "Text Color"
                    })}
                    value={values.customSettings?.tokenSearchConfig?.textColor || theme.palette.text.primary}
                    onChange={(value: string) => setFieldValue("customSettings.tokenSearchConfig.textColor", value)}
                    defaultValue={theme.palette.text.primary}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ColorPickerField
                    label={formatMessage({
                      id: "custom.token.search.border.color",
                      defaultMessage: "Border Color"
                    })}
                    value={values.customSettings?.tokenSearchConfig?.borderColor || theme.palette.divider}
                    onChange={(value: string) => setFieldValue("customSettings.tokenSearchConfig.borderColor", value)}
                    defaultValue={theme.palette.divider}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ColorPickerField
                    label={formatMessage({
                      id: "custom.token.search.focus.border.color",
                      defaultMessage: "Focus Border Color"
                    })}
                    value={values.customSettings?.tokenSearchConfig?.focusBorderColor || theme.palette.primary.main}
                    onChange={(value: string) => setFieldValue("customSettings.tokenSearchConfig.focusBorderColor", value)}
                    defaultValue={theme.palette.primary.main}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ColorPickerField
                    label={formatMessage({
                      id: "custom.token.search.placeholder.color",
                      defaultMessage: "Placeholder Color"
                    })}
                    value={values.customSettings?.tokenSearchConfig?.placeholderColor || theme.palette.text.secondary}
                    onChange={(value: string) => setFieldValue("customSettings.tokenSearchConfig.placeholderColor", value)}
                    defaultValue={theme.palette.text.secondary}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ColorPickerField
                    label={formatMessage({
                      id: "custom.token.search.icon.color",
                      defaultMessage: "Search Icon Color"
                    })}
                    value={values.customSettings?.tokenSearchConfig?.iconColor || theme.palette.text.primary}
                    onChange={(value: string) => setFieldValue("customSettings.tokenSearchConfig.iconColor", value)}
                    defaultValue={theme.palette.text.primary}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expandedAccordions.includes('pagination')}
            onChange={handleAccordionChange('pagination')}
            sx={{ mt: 2, boxShadow: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: getTitleColor() }}>
                Pagination
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                Customize pagination controls for tables and data lists
              </Typography>
              <Grid container spacing={getFormSpacing()}>
                <Grid item xs={12} sm={6}>
                  <ColorPickerField
                    label={formatMessage({
                      id: "custom.pagination.text.color",
                      defaultMessage: "Text Color"
                    })}
                    value={values.customSettings?.paginationConfig?.textColor || theme.palette.text.primary}
                    onChange={(value: string) => setFieldValue("customSettings.paginationConfig.textColor", value)}
                    defaultValue={theme.palette.text.primary}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ColorPickerField
                    label={formatMessage({
                      id: "custom.pagination.background.color",
                      defaultMessage: "Background Color"
                    })}
                    value={values.customSettings?.paginationConfig?.backgroundColor || theme.palette.background.paper}
                    onChange={(value: string) => setFieldValue("customSettings.paginationConfig.backgroundColor", value)}
                    defaultValue={theme.palette.background.paper}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ColorPickerField
                    label={formatMessage({
                      id: "custom.pagination.button.color",
                      defaultMessage: "Button Color"
                    })}
                    value={values.customSettings?.paginationConfig?.buttonColor || theme.palette.text.primary}
                    onChange={(value: string) => setFieldValue("customSettings.paginationConfig.buttonColor", value)}
                    defaultValue={theme.palette.text.primary}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ColorPickerField
                    label={formatMessage({
                      id: "custom.pagination.button.hover.color",
                      defaultMessage: "Button Hover Color"
                    })}
                    value={values.customSettings?.paginationConfig?.buttonHoverColor || theme.palette.action.hover}
                    onChange={(value: string) => setFieldValue("customSettings.paginationConfig.buttonHoverColor", value)}
                    defaultValue={theme.palette.action.hover}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ColorPickerField
                    label={formatMessage({
                      id: "custom.pagination.select.background.color",
                      defaultMessage: "Select Background Color"
                    })}
                    value={values.customSettings?.paginationConfig?.selectBackgroundColor || theme.palette.background.paper}
                    onChange={(value: string) => setFieldValue("customSettings.paginationConfig.selectBackgroundColor", value)}
                    defaultValue={theme.palette.background.paper}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ColorPickerField
                    label={formatMessage({
                      id: "custom.pagination.select.text.color",
                      defaultMessage: "Select Text Color"
                    })}
                    value={values.customSettings?.paginationConfig?.selectTextColor || theme.palette.text.primary}
                    onChange={(value: string) => setFieldValue("customSettings.paginationConfig.selectTextColor", value)}
                    defaultValue={theme.palette.text.primary}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expandedAccordions.includes('tables')}
            onChange={handleAccordionChange('tables')}
            sx={{ mt: 2, boxShadow: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: getTitleColor() }}>
                Tables & Data
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                Configure balance and activity tables appearance
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'medium', color: theme.palette.text.primary }}>
                  Token Balance Table
                </Typography>
                <Grid container spacing={getFormSpacing()}>
                  <Grid item xs={12} sm={6}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.table.header.text.color",
                        defaultMessage: "Header Text Color"
                      })}
                      value={values.customSettings?.tokenTableConfig?.headerTextColor || theme.palette.text.primary}
                      onChange={(value: string) => setFieldValue("customSettings.tokenTableConfig.headerTextColor", value)}
                      defaultValue={theme.palette.text.primary}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.table.row.text.color",
                        defaultMessage: "Row Text Color"
                      })}
                      value={values.customSettings?.tokenTableConfig?.rowTextColor || theme.palette.text.primary}
                      onChange={(value: string) => setFieldValue("customSettings.tokenTableConfig.rowTextColor", value)}
                      defaultValue={theme.palette.text.primary}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.table.row.background.color",
                        defaultMessage: "Row Background Color"
                      })}
                      value={values.customSettings?.tokenTableConfig?.rowBackgroundColor || theme.palette.background.default}
                      onChange={(value: string) => setFieldValue("customSettings.tokenTableConfig.rowBackgroundColor", value)}
                      defaultValue={theme.palette.background.default}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.table.row.hover.color",
                        defaultMessage: "Row Hover Color"
                      })}
                      value={values.customSettings?.tokenTableConfig?.hoverRowBackgroundColor || theme.palette.primary.main}
                      onChange={(value: string) => setFieldValue("customSettings.tokenTableConfig.hoverRowBackgroundColor", value)}
                      defaultValue={theme.palette.primary.main}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'medium', color: theme.palette.text.primary }}>
                  Activity Table
                </Typography>
                <Grid container spacing={getFormSpacing()}>
                  <Grid item xs={12} sm={6}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.activity.header.background.color",
                        defaultMessage: "Header Background Color"
                      })}
                      value={values.customSettings?.activityTableConfig?.headerBackgroundColor || theme.palette.background.paper}
                      onChange={(value: string) => setFieldValue("customSettings.activityTableConfig.headerBackgroundColor", value)}
                      defaultValue={theme.palette.background.paper}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.activity.header.text.color",
                        defaultMessage: "Header Text Color"
                      })}
                      value={values.customSettings?.activityTableConfig?.headerTextColor || theme.palette.text.primary}
                      onChange={(value: string) => setFieldValue("customSettings.activityTableConfig.headerTextColor", value)}
                      defaultValue={theme.palette.text.primary}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.activity.row.background.color",
                        defaultMessage: "Row Background Color"
                      })}
                      value={values.customSettings?.activityTableConfig?.rowBackgroundColor || theme.palette.background.default}
                      onChange={(value: string) => setFieldValue("customSettings.activityTableConfig.rowBackgroundColor", value)}
                      defaultValue={theme.palette.background.default}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.activity.row.text.color",
                        defaultMessage: "Row Text Color"
                      })}
                      value={values.customSettings?.activityTableConfig?.rowTextColor || theme.palette.text.primary}
                      onChange={(value: string) => setFieldValue("customSettings.activityTableConfig.rowTextColor", value)}
                      defaultValue={theme.palette.text.primary}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.activity.hover.row.background.color",
                        defaultMessage: "Row Hover Background Color"
                      })}
                      value={values.customSettings?.activityTableConfig?.hoverRowBackgroundColor || theme.palette.primary.main}
                      onChange={(value: string) => setFieldValue("customSettings.activityTableConfig.hoverRowBackgroundColor", value)}
                      defaultValue={theme.palette.primary.main}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <ColorPickerField
                      label={formatMessage({
                        id: "custom.activity.border.color",
                        defaultMessage: "Border Color"
                      })}
                      value={values.customSettings?.activityTableConfig?.borderColor || theme.palette.divider}
                      onChange={(value: string) => setFieldValue("customSettings.activityTableConfig.borderColor", value)}
                      defaultValue={theme.palette.divider}
                    />
                  </Grid>
                </Grid>
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expandedAccordions.includes('layout')}
            onChange={handleAccordionChange('layout')}
            sx={{ mt: 2, boxShadow: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: getTitleColor() }}>
                Layout Configuration
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                Configure button layouts, alignment and spacing
              </Typography>
              <Grid container spacing={getFormSpacing()}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>
                      <FormattedMessage
                        id="custom.action.buttons.layout"
                        defaultMessage="Action Buttons Layout"
                      />
                    </InputLabel>
                    <Select
                      value={values.customSettings?.layout?.actionButtonsLayout || "horizontal"}
                      onChange={(e) => setFieldValue("customSettings.layout.actionButtonsLayout", e.target.value)}
                      label={formatMessage({
                        id: "custom.action.buttons.layout",
                        defaultMessage: "Action Buttons Layout"
                      })}
                    >
                      <MenuItem value="horizontal">
                        <FormattedMessage
                          id="custom.layout.horizontal"
                          defaultMessage="Horizontal"
                        />
                      </MenuItem>
                      <MenuItem value="vertical">
                        <FormattedMessage
                          id="custom.layout.vertical"
                          defaultMessage="Vertical"
                        />
                      </MenuItem>
                      <MenuItem value="grid">
                        <FormattedMessage
                          id="custom.layout.grid"
                          defaultMessage="Grid"
                        />
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>
                      <FormattedMessage
                        id="custom.buttons.alignment"
                        defaultMessage="Buttons Alignment"
                      />
                    </InputLabel>
                    <Select
                      value={values.customSettings?.layout?.actionButtonsAlignment || "left"}
                      onChange={(e) => setFieldValue("customSettings.layout.actionButtonsAlignment", e.target.value)}
                      label={formatMessage({
                        id: "custom.buttons.alignment",
                        defaultMessage: "Buttons Alignment"
                      })}
                    >
                      <MenuItem value="left">
                        <FormattedMessage
                          id="custom.alignment.left"
                          defaultMessage="Left"
                        />
                      </MenuItem>
                      <MenuItem value="center">
                        <FormattedMessage
                          id="custom.alignment.center"
                          defaultMessage="Center"
                        />
                      </MenuItem>
                      <MenuItem value="right">
                        <FormattedMessage
                          id="custom.alignment.right"
                          defaultMessage="Right"
                        />
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Typography gutterBottom>
                    <FormattedMessage
                      id="custom.element.spacing"
                      defaultMessage="Element Spacing"
                    />
                  </Typography>
                  <Slider
                    value={values.customSettings?.layout?.spacing || 2}
                    onChange={(_, value: number | number[]) => setFieldValue("customSettings.layout.spacing", value)}
                    min={0}
                    max={8}
                    step={1}
                    valueLabelDisplay="auto"
                    marks={[
                      { value: 0, label: '0' },
                      { value: 2, label: '2' },
                      { value: 4, label: '4' },
                      { value: 6, label: '6' },
                      { value: 8, label: '8' },
                    ]}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 4, fontStyle: 'italic' }}>
            <FormattedMessage
              id="custom.note"
              defaultMessage="The custom variant allows you to completely customize all visual and functional aspects of the wallet."
            />
          </Typography>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => {
                const currentBackgroundType = values.customSettings?.backgroundType;

                // Usar directamente la función getDefaultCustomSettings que usa el tema global
                const newSettings = getDefaultCustomSettings(theme);

                // Preservar el tipo de fondo actual
                if (currentBackgroundType) {
                  newSettings.backgroundType = currentBackgroundType;
                }

                // Los botones de swap y back heredan el color del sendButton al resetear
                newSettings.swapButtonConfig = {
                  backgroundColor: newSettings.sendButtonConfig?.backgroundColor,
                  textColor: newSettings.sendButtonConfig?.textColor,
                  borderColor: newSettings.sendButtonConfig?.borderColor,
                  hoverBackgroundColor: newSettings.sendButtonConfig?.hoverBackgroundColor,
                };
                newSettings.backButtonConfig = {
                  backgroundColor: newSettings.sendButtonConfig?.backgroundColor,
                  textColor: newSettings.sendButtonConfig?.textColor,
                  borderColor: newSettings.sendButtonConfig?.borderColor,
                  hoverBackgroundColor: newSettings.sendButtonConfig?.hoverBackgroundColor,
                };

                setFieldValue("customSettings", newSettings);
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
                id="reset.styles"
                defaultMessage="RESET STYLES"
              />
            </Button>
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
  customTheme,
}: Props) {
  const isMobile = useIsMobile();
  const theme = useTheme();
  const { wizardConfig } = useAppWizardConfig();

  const generatedCustomTheme = useMemo(() => {
    if (wizardConfig.theme === 'custom') {
      try {
        const customThemeLight = wizardConfig.customThemeLight ? JSON.parse(wizardConfig.customThemeLight) : null;
        const customThemeDark = wizardConfig.customThemeDark ? JSON.parse(wizardConfig.customThemeDark) : null;

        const themeData = {
          colorSchemes: {
            light: customThemeLight || {},
            dark: customThemeDark || {}
          }
        };

        return themeData;
      } catch (error) {
        console.error("Error parsing custom theme:", error);
        return null;
      }
    }

    if (wizardConfig.theme) {
      try {
        const customThemeDark = wizardConfig.customThemeDark ? JSON.parse(wizardConfig.customThemeDark) : {};
        const customThemeLight = wizardConfig.customThemeLight ? JSON.parse(wizardConfig.customThemeLight) : {};

        const selectedTheme = generateCSSVarsTheme({
          selectedFont: wizardConfig?.font,
          cssVarPrefix: 'theme-preview',
          customTheme: {
            colorSchemes: {
              dark: customThemeDark,
              light: customThemeLight,
            },
          },
          selectedThemeId: wizardConfig?.theme || '',
        });

        if (selectedTheme?.colorSchemes) {
          const extractedTheme = {
            colorSchemes: {
              light: { palette: selectedTheme.colorSchemes.light?.palette },
              dark: { palette: selectedTheme.colorSchemes.dark?.palette }
            }
          };
          return extractedTheme;
        }
      } catch (error) {
        console.error("Error generating theme:", error);
      }
    }

    return null;
  }, [wizardConfig.theme, wizardConfig.customThemeLight, wizardConfig.customThemeDark, wizardConfig.font]);

  const finalCustomTheme = customTheme || generatedCustomTheme;

  const initialValues = useMemo((): WalletSettings => {
    if (section?.settings) {
      return {
        variant: section.settings.variant || "default",
        glassSettings: section.settings.glassSettings || getDefaultGlassSettings(theme),
        customSettings: section.settings.customSettings || getDefaultCustomSettings(theme),
      };
    }
    return {
      variant: "default",
      glassSettings: getDefaultGlassSettings(theme),
      customSettings: getDefaultCustomSettings(theme),
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
              <VariantConfigurationTab customTheme={finalCustomTheme} />
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
