import { useIsMobile } from '@dexkit/core';
import { useActiveChainIds } from '@dexkit/ui/hooks';
import { SwapConfig, SwapVariant } from '@dexkit/ui/modules/wizard/types';
import { SUPPORTED_SWAP_CHAIN_IDS } from '@dexkit/widgets/src/widgets/swap/constants/supportedChainIds';
import { ChainConfig } from '@dexkit/widgets/src/widgets/swap/types';
import { Delete as DeleteIcon, Image as ImageIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  ButtonBase,
  Card,
  CardContent,
  Container,
  Divider,
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
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import MediaDialog from '@dexkit/ui/components/mediaDialog';
import { NetworkSelectDropdown } from 'src/components/NetworkSelectDropdown';
import { Token } from 'src/types/blockchain';
import { SearchTokenAutocomplete } from '../pageEditor/components/SearchTokenAutocomplete';

interface Props {
  data?: SwapConfig;
  onChange?: (data: SwapConfig) => void;
  featuredTokens?: Token[];
}

export function SwapConfigForm({ onChange, data, featuredTokens }: Props) {
  const { activeChainIds } = useActiveChainIds();
  const [formData, setFormData] = useState<SwapConfig | undefined>(data);
  const [showMediaDialog, setShowMediaDialog] = useState(false);
  const isMobile = useIsMobile();
  const theme = useTheme();

  const themeDefaults = useMemo(() => ({
    backgroundColor: theme.palette.background.default,
    backgroundPaper: theme.palette.background.paper,
    textColor: theme.palette.text.primary,
  }), [theme.palette.background.default, theme.palette.background.paper, theme.palette.text.primary]);

  const [selectedChainId, setSelectedChainId] = useState<number | undefined>(
    data?.defaultChainId,
  );

  const sellToken = useMemo(() => {
    if (selectedChainId && formData?.configByChain) {
      const sellToken = formData.configByChain[selectedChainId]?.sellToken;
      //@dev Remove this on future
      //@ts-ignore
      if (sellToken && sellToken?.contractAddress) {
        //@ts-ignore
        sellToken.address = sellToken?.contractAddress;
      }
      return sellToken;
    }
  }, [selectedChainId, formData]);

  const buyToken = useMemo(() => {
    if (selectedChainId && formData?.configByChain) {
      const buyToken = formData.configByChain[selectedChainId]?.buyToken;
      //@dev Remove this on future
      //@ts-ignore
      if (buyToken && buyToken?.contractAddress) {
        //@ts-ignore
        buyToken.address = buyToken?.contractAddress;
      }
      return buyToken;
    }
  }, [selectedChainId, formData]);

  const slippage = useMemo(() => {
    if (selectedChainId && formData?.configByChain) {
      return formData.configByChain[selectedChainId]?.slippage;
    }

    return 0;
  }, [selectedChainId, formData]);

  useEffect(() => {
    if (onChange && formData) {
      onChange(formData);
    }
  }, [formData, onChange]);

  useEffect(() => {
    if (formData?.variant === SwapVariant.Glass) {
      const glassSettings = formData.glassSettings;
      const backgroundType = glassSettings?.backgroundType || 'solid';

      const needsInitialization =
        !glassSettings ||
        (backgroundType === 'solid' && !glassSettings.backgroundColor) ||
        (backgroundType === 'gradient' && (!glassSettings.gradientStartColor || !glassSettings.gradientEndColor));

      if (needsInitialization) {
        setFormData((prevData) => {
          const newGlassSettings = {
            ...prevData?.glassSettings,
            backgroundType: backgroundType,
            blurIntensity: prevData?.glassSettings?.blurIntensity || 40,
            glassOpacity: prevData?.glassSettings?.glassOpacity || 0.10,
            disableBackground: prevData?.glassSettings?.disableBackground || false,
            textColor: prevData?.glassSettings?.textColor || themeDefaults.textColor,
          };

          if (backgroundType === 'solid') {
            newGlassSettings.backgroundColor = prevData?.glassSettings?.backgroundColor || themeDefaults.backgroundColor;
          } else if (backgroundType === 'gradient') {
            newGlassSettings.gradientStartColor = prevData?.glassSettings?.gradientStartColor || themeDefaults.backgroundColor;
            newGlassSettings.gradientEndColor = prevData?.glassSettings?.gradientEndColor || themeDefaults.backgroundPaper;
            newGlassSettings.gradientDirection = prevData?.glassSettings?.gradientDirection || "to bottom";
          }

          return {
            ...prevData,
            glassSettings: newGlassSettings,
          };
        });
      }
    }
  }, [formData?.variant, themeDefaults]);

  const handleSelectImage = (file: { url: string }) => {
    setFormData((formData) => ({
      ...formData,
      glassSettings: {
        ...formData?.glassSettings,
        backgroundImage: file.url,
      },
    }));
    setShowMediaDialog(false);
  };

  const handleRemoveImage = () => {
    setFormData((formData) => ({
      ...formData,
      glassSettings: {
        ...formData?.glassSettings,
        backgroundImage: undefined,
      },
    }));
  };

  function convertToHex(color: string): string {
    if (color.startsWith('#')) {
      return color;
    }

    if (color.startsWith('rgb')) {
      const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (rgbMatch) {
        const r = parseInt(rgbMatch[1]);
        const g = parseInt(rgbMatch[2]);
        const b = parseInt(rgbMatch[3]);
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      }
    }

    return color;
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
    onOpenMediaDialog,
    onRemoveImage,
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
    onOpenMediaDialog: () => void;
    onRemoveImage: () => void;
  }) {
    const theme = useTheme();
    const isMobile = useIsMobile();

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
            onClick={onOpenMediaDialog}
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
              onClick={onRemoveImage}
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
                    <MenuItem value="cover">Cover</MenuItem>
                    <MenuItem value="contain">Contain</MenuItem>
                    <MenuItem value="auto">Auto</MenuItem>
                    <MenuItem value="100% 100%">Stretch</MenuItem>
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
                    <MenuItem value="center">Center</MenuItem>
                    <MenuItem value="top">Top</MenuItem>
                    <MenuItem value="bottom">Bottom</MenuItem>
                    <MenuItem value="left">Left</MenuItem>
                    <MenuItem value="right">Right</MenuItem>
                    <MenuItem value="top-left">Top Left</MenuItem>
                    <MenuItem value="top-right">Top Right</MenuItem>
                    <MenuItem value="bottom-left">Bottom Left</MenuItem>
                    <MenuItem value="bottom-right">Bottom Right</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Container sx={{ pt: isMobile ? 1 : 2, px: isMobile ? 1 : 2 }}>
      <Grid container spacing={isMobile ? 2 : 2}>
        <Grid item xs={12}>
          <Alert severity="info" sx={{ py: isMobile ? 0.5 : 1 }}>
            <Typography variant={isMobile ? "body2" : "body1"}>
              <FormattedMessage
                id="default.network.info.swap.form"
                defaultMessage="Default network when wallet is not connected"
              />
            </Typography>
          </Alert>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth size={isMobile ? "small" : "medium"}>
            <InputLabel shrink>
              <FormattedMessage id="variant" defaultMessage="Variant" />
            </InputLabel>
            <Select
              fullWidth
              label={<FormattedMessage id="variant" defaultMessage="Variant" />}
              value={formData?.variant === undefined ? '' : formData?.variant}
              displayEmpty
              notched
              onChange={(e) => {
                setFormData((form) => ({
                  ...form,
                  variant:
                    e.target.value !== ''
                      ? (e.target.value as SwapVariant)
                      : undefined,
                }));
              }}
            >
              <MenuItem value="">
                <FormattedMessage id="classic" defaultMessage="Classic" />
              </MenuItem>
              <MenuItem value={SwapVariant.MatchaLike}>
                <FormattedMessage id="pro" defaultMessage="Pro" />
              </MenuItem>
              <MenuItem value={SwapVariant.UniswapLike}>
                <FormattedMessage id="modern" defaultMessage="Modern" />
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
              <MenuItem value={SwapVariant.Glass}>
                <FormattedMessage id="glass" defaultMessage="Glass - Modern glassmorphic design" />
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <Typography variant={isMobile ? "caption" : "body2"} sx={{ mb: 0.5 }}>
              <FormattedMessage
                id="default.network"
                defaultMessage="Default network"
              />
            </Typography>
            <NetworkSelectDropdown
              activeChainIds={activeChainIds}
              chainId={formData?.defaultChainId}
              onChange={(chainId) => {
                setFormData((formData) => ({
                  ...formData,
                  defaultChainId: chainId,
                }));
              }}
              labelId="default-network"
              size={isMobile ? "small" : "medium"}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Alert severity="info" sx={{ py: isMobile ? 0.5 : 1 }}>
            <Typography variant={isMobile ? "body2" : "body1"}>
              <FormattedMessage
                id="network.swap.options.info"
                defaultMessage="Choose the default tokens and slippage for each network."
              />
            </Typography>
          </Alert>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <Typography variant={isMobile ? "caption" : "body2"} sx={{ mb: 0.5 }}>
              <FormattedMessage id="network" defaultMessage="Network" />
            </Typography>
            <NetworkSelectDropdown
              onChange={(chainId) => {
                setSelectedChainId(chainId);
                setFormData((formData) => ({
                  ...formData,
                  defaultEditChainId: chainId,
                }));
              }}
              activeChainIds={
                activeChainIds.filter((ch) =>
                  SUPPORTED_SWAP_CHAIN_IDS.includes(ch),
                ) || []
              }
              labelId={'config-per-network'}
              chainId={selectedChainId}
              size={isMobile ? "small" : "medium"}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <SearchTokenAutocomplete
            label={
              <FormattedMessage
                id="search.default.input.token"
                defaultMessage="Search default input token"
              />
            }
            featuredTokens={featuredTokens}
            disabled={selectedChainId === undefined}
            data={sellToken}
            chainId={selectedChainId}
            onChange={(tk: any) => {
              if (selectedChainId) {
                let oldFormData: ChainConfig = {
                  slippage: 0,
                };

                if (
                  formData?.configByChain &&
                  formData?.configByChain[selectedChainId]
                ) {
                  oldFormData = formData?.configByChain[selectedChainId];
                }

                setFormData((formData) => ({
                  ...formData,
                  configByChain: {
                    ...formData?.configByChain,
                    [selectedChainId]: {
                      ...oldFormData,
                      sellToken: tk
                        ? {
                          chainId: tk.chainId as number,
                          address: tk.address,
                          decimals: tk.decimals,
                          name: tk.name,
                          symbol: tk.symbol,
                          logoURI: tk.logoURI,
                        }
                        : undefined,
                    },
                  },
                }));
              }
            }}
            size={isMobile ? "small" : "medium"}
          />
        </Grid>

        <Grid item xs={12}>
          <SearchTokenAutocomplete
            chainId={selectedChainId}
            disabled={selectedChainId === undefined}
            label={
              <FormattedMessage
                id="search.default.output.token"
                defaultMessage="Search default output token"
              />
            }
            featuredTokens={featuredTokens}
            data={buyToken}
            size={isMobile ? "small" : "medium"}
            onChange={(tk: any) => {
              if (selectedChainId) {
                let oldFormData: ChainConfig = { slippage: 0 };

                if (
                  formData?.configByChain &&
                  formData?.configByChain[selectedChainId]
                ) {
                  oldFormData = formData?.configByChain[selectedChainId];
                }

                setFormData((formData) => ({
                  ...formData,
                  configByChain: {
                    ...formData?.configByChain,
                    [selectedChainId]: {
                      ...oldFormData,
                      buyToken: tk
                        ? {
                          chainId: tk.chainId as number,
                          address: tk.address,
                          decimals: tk.decimals,
                          name: tk.name,
                          symbol: tk.symbol,
                          logoURI: tk.logoURI,
                        }
                        : undefined,
                    },
                  },
                }));
              }
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            inputProps={{ type: 'number', min: 0, max: 50, step: 0.01 }}
            InputLabelProps={{ shrink: true }}
            label={
              <FormattedMessage
                id="default.slippage.percentage"
                defaultMessage="Default slippage (0-50%)"
              />
            }
            value={slippage}
            size={isMobile ? "small" : "medium"}
            onChange={(event: any) => {
              if (event.target.value !== undefined && selectedChainId) {
                let value = event.target.value;
                if (value < 0) {
                  value = 0;
                }
                if (value > 50) {
                  value = 50;
                }

                let oldFormData: ChainConfig = {
                  slippage: 0,
                };

                if (
                  formData?.configByChain &&
                  formData?.configByChain[selectedChainId]
                ) {
                  oldFormData = formData?.configByChain[selectedChainId];
                }

                setFormData((formData) => ({
                  ...formData,
                  configByChain: {
                    ...formData?.configByChain,
                    [selectedChainId]: {
                      ...oldFormData,
                      slippage: parseFloat(value),
                    },
                  },
                }));
              }
            }}
            fullWidth
          />
        </Grid>

        {formData?.variant === SwapVariant.Glass && (
          <>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
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
                      value={formData?.glassSettings?.blurIntensity || 40}
                      onChange={(_, value: number | number[]) => {
                        setFormData((formData) => ({
                          ...formData,
                          glassSettings: {
                            ...formData?.glassSettings,
                            blurIntensity: value as number,
                          },
                        }));
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
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Typography gutterBottom>
                      <FormattedMessage
                        id="glass.opacity"
                        defaultMessage="Glass Opacity"
                      />
                    </Typography>
                    <Slider
                      value={formData?.glassSettings?.glassOpacity || 0.10}
                      onChange={(_, value: number | number[]) => {
                        setFormData((formData) => ({
                          ...formData,
                          glassSettings: {
                            ...formData?.glassSettings,
                            glassOpacity: value as number,
                          },
                        }));
                      }}
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
                          checked={formData?.glassSettings?.disableBackground || false}
                          onChange={(e) => {
                            setFormData((formData) => ({
                              ...formData,
                              glassSettings: {
                                ...formData?.glassSettings,
                                disableBackground: e.target.checked,
                              },
                            }));
                          }}
                        />
                      }
                      label={
                        <FormattedMessage
                          id="glass.disable.background"
                          defaultMessage="Disable Background"
                        />
                      }
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      <FormattedMessage
                        id="glass.disable.background.description"
                        defaultMessage="Remove background colors for complete transparency. Text color remains customizable."
                      />
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 3 }}>
                    <ColorPickerField
                      label="Text Color"
                      value={formData?.glassSettings?.textColor || theme.palette.text.primary}
                      onChange={(value) => {
                        setFormData((formData) => ({
                          ...formData,
                          glassSettings: {
                            ...formData?.glassSettings,
                            textColor: value,
                          },
                        }));
                      }}
                      defaultValue={theme.palette.text.primary}
                    />
                  </Box>

                  {!formData?.glassSettings?.disableBackground && (
                    <>
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                          <FormattedMessage
                            id="glass.background.type"
                            defaultMessage="Background Type"
                          />
                        </Typography>
                        <RadioGroup
                          value={formData?.glassSettings?.backgroundType || "solid"}
                          onChange={(e) => {
                            const newType = e.target.value as 'solid' | 'gradient' | 'image';
                            setFormData((formData) => {
                              const newGlassSettings = {
                                ...formData?.glassSettings,
                                backgroundType: newType,
                              };

                              if (newType === 'solid' && !formData?.glassSettings?.backgroundColor) {
                                newGlassSettings.backgroundColor = themeDefaults.backgroundColor;
                              } else if (newType === 'gradient') {
                                if (!formData?.glassSettings?.gradientStartColor) {
                                  newGlassSettings.gradientStartColor = themeDefaults.backgroundColor;
                                }
                                if (!formData?.glassSettings?.gradientEndColor) {
                                  newGlassSettings.gradientEndColor = themeDefaults.backgroundPaper;
                                }
                                if (!formData?.glassSettings?.gradientDirection) {
                                  newGlassSettings.gradientDirection = "to bottom";
                                }
                              }

                              return {
                                ...formData,
                                glassSettings: newGlassSettings,
                              };
                            });
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

                        {formData?.glassSettings?.backgroundType === "solid" && (
                          <Box sx={{ mt: 2 }}>
                            <ColorPickerField
                              label="Background Color"
                              value={formData?.glassSettings?.backgroundColor || theme.palette.background.default}
                              onChange={(value) => {
                                setFormData((formData) => ({
                                  ...formData,
                                  glassSettings: {
                                    ...formData?.glassSettings,
                                    backgroundColor: value,
                                  },
                                }));
                              }}
                              defaultValue={theme.palette.background.default}
                            />
                          </Box>
                        )}

                        {formData?.glassSettings?.backgroundType === "gradient" && (
                          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <ColorPickerField
                              label="Gradient Start Color"
                              value={formData?.glassSettings?.gradientStartColor || theme.palette.background.default}
                              onChange={(value) => {
                                setFormData((formData) => ({
                                  ...formData,
                                  glassSettings: {
                                    ...formData?.glassSettings,
                                    gradientStartColor: value,
                                  },
                                }));
                              }}
                              defaultValue={theme.palette.background.default}
                            />
                            <ColorPickerField
                              label="Gradient End Color"
                              value={formData?.glassSettings?.gradientEndColor || theme.palette.background.paper}
                              onChange={(value) => {
                                setFormData((formData) => ({
                                  ...formData,
                                  glassSettings: {
                                    ...formData?.glassSettings,
                                    gradientEndColor: value,
                                  },
                                }));
                              }}
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
                                value={formData?.glassSettings?.gradientDirection || "to bottom"}
                                onChange={(e) => {
                                  setFormData((formData) => ({
                                    ...formData,
                                    glassSettings: {
                                      ...formData?.glassSettings,
                                      gradientDirection: e.target.value,
                                    },
                                  }));
                                }}
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

                        {formData?.glassSettings?.backgroundType === "image" && (
                          <BackgroundImageSelector
                            value={formData?.glassSettings?.backgroundImage}
                            onChange={(url) => {
                              setFormData((formData) => ({
                                ...formData,
                                glassSettings: {
                                  ...formData?.glassSettings,
                                  backgroundImage: url,
                                },
                              }));
                            }}
                            sizeValue={formData?.glassSettings?.backgroundSize}
                            onSizeChange={(size) => {
                              setFormData((formData) => ({
                                ...formData,
                                glassSettings: {
                                  ...formData?.glassSettings,
                                  backgroundSize: size as 'cover' | 'contain' | 'auto' | '100% 100%',
                                },
                              }));
                            }}
                            positionValue={formData?.glassSettings?.backgroundPosition}
                            onPositionChange={(position) => {
                              setFormData((formData) => ({
                                ...formData,
                                glassSettings: {
                                  ...formData?.glassSettings,
                                  backgroundPosition: position as 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right',
                                },
                              }));
                            }}
                            repeatValue={formData?.glassSettings?.backgroundRepeat}
                            onRepeatChange={(repeat) => {
                              setFormData((formData) => ({
                                ...formData,
                                glassSettings: {
                                  ...formData?.glassSettings,
                                  backgroundRepeat: repeat as 'repeat' | 'no-repeat' | 'repeat-x' | 'repeat-y',
                                },
                              }));
                            }}
                            attachmentValue={formData?.glassSettings?.backgroundAttachment}
                            onAttachmentChange={(attachment) => {
                              setFormData((formData) => ({
                                ...formData,
                                glassSettings: {
                                  ...formData?.glassSettings,
                                  backgroundAttachment: attachment as 'fixed' | 'scroll',
                                },
                              }));
                            }}
                            onOpenMediaDialog={() => setShowMediaDialog(true)}
                            onRemoveImage={handleRemoveImage}
                          />
                        )}
                      </Box>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </>
        )}

        <Grid item xs={12}>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 4, fontStyle: 'italic' }}>
            <FormattedMessage
              id="glass.cards.inputs.note"
              defaultMessage="Note: Cards and input fields automatically use glassmorphism effects for a cohesive visual experience. Text color is fully customizable and applies to all text elements regardless of background settings."
            />
          </Typography>
        </Grid>
      </Grid>

      <MediaDialog
        dialogProps={{
          open: showMediaDialog,
          maxWidth: 'lg',
          fullWidth: true,
          onClose: () => setShowMediaDialog(false),
        }}
        onConfirmSelectFile={handleSelectImage}
      />
    </Container>
  );
}
