import { useLocale } from "@dexkit/ui/hooks";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
  Stack,
  useColorScheme,
  useMediaQuery,
  useTheme
} from "@mui/material";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { DexkitExchangeContext } from "../../contexts";
import { ExchangeCustomVariantSettings } from "../../types";

const usePreviewPlatform = () => {
  try {
    const { usePreviewPlatform } = require("@dexkit/dexappbuilder-viewer/components/SectionsRenderer");
    return usePreviewPlatform();
  } catch {
    return null;
  }
};

export interface TradingGraph {
  showSwaps?: boolean;
  showInfo?: boolean;
  network?: string;
  isLoading?: boolean;
  pools: { name: string; address: string }[];
  selectedPool?: string;
  onChange: (value: string) => void;
  onChangeShowSwaps: (value: boolean) => void;
  customVariantSettings?: ExchangeCustomVariantSettings;
}

export default function TradingGraph({
  network,
  showInfo,
  showSwaps,
  isLoading,
  onChangeShowSwaps,
  pools,
  onChange,
  selectedPool,
  customVariantSettings,
}: TradingGraph) {
  const theme = useTheme();
  const { mode } = useColorScheme();
  const isMobileDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const previewContext = usePreviewPlatform();
  const isMobile = previewContext ? previewContext.isMobile : isMobileDevice;
  const exchangeContext = useContext(DexkitExchangeContext);
  const variant = exchangeContext?.variant;
  const glassSettings = exchangeContext?.glassSettings;
  const [isHydrated, setIsHydrated] = useState(false);
  const isDark = isHydrated ? (mode === 'dark' || theme.palette.mode === 'dark') : false;

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleChange = async (
    event: SelectChangeEvent<string>,
    child: React.ReactNode
  ) => {
    onChange(event.target.value);
  };

  const { locale } = useLocale();

  const language = useMemo(() => {
    const result = locale.split("-");
    if (result.length >= 1) {
      return result[0];
    }
    return "en";
  }, [locale]);

  const handleChangeSwap = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    onChangeShowSwaps(checked);
  };

  const isGlassVariant = variant === "glass";
  const textColor = glassSettings?.textColor || (isDark ? 'rgba(255, 255, 255, 0.95)' : theme.palette.text.primary);
  const controlTextColor = customVariantSettings?.tradingGraphControlTextColor || textColor;
  const customBackgroundColor = customVariantSettings?.tradingGraphBackgroundColor;
  const blurIntensity = glassSettings?.blurIntensity || 20;
  const glassOpacity = glassSettings?.glassOpacity || 0.1;

  const cardStyles = useMemo(() => {
    const baseStyles = {
      ...(customBackgroundColor && {
        backgroundColor: `${customBackgroundColor} !important`,
      }),
    };

    if (!isGlassVariant) return baseStyles;

    return {
      ...baseStyles,
      backgroundColor: 'transparent !important',
      boxShadow: 'none !important',
      border: 'none !important',
      '& .MuiCard-root': {
        backgroundColor: 'transparent !important',
        boxShadow: 'none !important',
        border: 'none !important',
      },
      '& .MuiCardContent-root': {
        backgroundColor: 'transparent !important',
      },
    };
  }, [isGlassVariant, customBackgroundColor, theme]);

  const getControlsStyles = useMemo(() => {
    if (!isGlassVariant) return undefined;

    return {
      '& .MuiFormControlLabel-root': {
        '& .MuiTypography-root': {
          color: `${controlTextColor} !important`,
          fontWeight: theme.typography.fontWeightMedium,
          textShadow: controlTextColor.includes('255, 255, 255')
            ? '0 1px 2px rgba(0, 0, 0, 0.3)'
            : '0 1px 2px rgba(255, 255, 255, 0.3)',
        },
        '& .MuiCheckbox-root': {
          color: `${theme.palette.primary.main}85 !important`,
          filter: `drop-shadow(0 2px 4px ${theme.palette.primary.main}20)`,
          transition: theme.transitions.create(['filter', 'transform'], {
            duration: theme.transitions.duration.short,
          }),
          '&:hover': {
            filter: `drop-shadow(0 4px 8px ${theme.palette.primary.main}30)`,
            transform: 'scale(1.05)',
          },
          '&.Mui-checked': {
            color: `${theme.palette.primary.main} !important`,
          },
        },
      },
      '& .MuiFormControl-root': {
        minWidth: { xs: theme.spacing(15), sm: theme.spacing(20) },
        '& .MuiOutlinedInput-root': {
          backgroundColor: `rgba(255, 255, 255, ${glassOpacity}) !important`,
          backdropFilter: `blur(${blurIntensity}px) saturate(150%) brightness(1.02) !important`,
          WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(150%) brightness(1.02) !important`,
          borderRadius: `${Number(theme.shape.borderRadius) * 2}px !important`,
          border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.4)}) !important`,
          overflow: 'hidden',
          '& .MuiSelect-select': {
            color: `${controlTextColor} !important`,
            fontWeight: theme.typography.fontWeightMedium,
            textShadow: controlTextColor.includes('255, 255, 255')
              ? '0 1px 2px rgba(0, 0, 0, 0.3)'
              : '0 1px 2px rgba(255, 255, 255, 0.3)',
            paddingRight: `${theme.spacing(4)} !important`,
          },
          '& .MuiSelect-icon': {
            color: `${controlTextColor} !important`,
            filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))',
            right: theme.spacing(1),
          },
          '&:hover': {
            backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.05, 0.25)}) !important`,
            backdropFilter: `blur(${blurIntensity + 5}px) saturate(170%) brightness(1.05) !important`,
            WebkitBackdropFilter: `blur(${blurIntensity + 5}px) saturate(170%) brightness(1.05) !important`,
            transform: 'scale(1.01)',
          },
          '&.Mui-focused': {
            backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.05, 0.25)}) !important`,
            backdropFilter: `blur(${blurIntensity + 10}px) saturate(180%) brightness(1.08) !important`,
            WebkitBackdropFilter: `blur(${blurIntensity + 10}px) saturate(180%) brightness(1.08) !important`,
            borderColor: `${theme.palette.primary.main}40 !important`,
            transform: 'scale(1.02)',
          },
        },
      },
    };
  }, [isGlassVariant, textColor, blurIntensity, glassOpacity, theme]);

  const menuProps = useMemo(() => {
    if (!isGlassVariant) return undefined;

    return {
      PaperProps: {
        sx: {
          backgroundColor: `rgba(255, 255, 255, ${glassOpacity}) !important`,
          backdropFilter: `blur(${blurIntensity + 10}px) saturate(180%) brightness(1.1) !important`,
          WebkitBackdropFilter: `blur(${blurIntensity + 10}px) saturate(180%) brightness(1.1) !important`,
          border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.3)}) !important`,
          borderRadius: `${Number(theme.shape.borderRadius) * 2}px !important`,
          boxShadow: `0 ${theme.spacing(1)} ${theme.spacing(4)} rgba(0, 0, 0, 0.1), 0 2px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.25)}) inset !important`,
          '& .MuiMenuItem-root': {
            backgroundColor: 'transparent !important',
            color: `${textColor} !important`,
            fontWeight: theme.typography.fontWeightMedium,
            transition: theme.transitions.create(['background-color'], {
              duration: theme.transitions.duration.short,
            }),
            '&:hover': {
              backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity, 0.15)}) !important`,
              backdropFilter: `blur(${Math.max(blurIntensity - 10, 10)}px) saturate(170%) !important`,
              WebkitBackdropFilter: `blur(${Math.max(blurIntensity - 10, 10)}px) saturate(170%) !important`,
            },
            '&.Mui-selected': {
              backgroundColor: `${theme.palette.primary.main}${Math.round(glassOpacity * 255).toString(16).padStart(2, '0')} !important`,
              '&:hover': {
                backgroundColor: `${theme.palette.primary.main}${Math.round(Math.min(glassOpacity * 3, 0.35) * 255).toString(16).padStart(2, '0')} !important`,
              },
            },
          },
        },
      },
    };
  }, [isGlassVariant, glassOpacity, blurIntensity, textColor, theme]);

  const chartHeight = useMemo(() => {
    if (isMobile) {
      return isGlassVariant
        ? (showSwaps ? 500 : 350)
        : (showSwaps ? 600 : 400);
    }
    if (isSmallScreen) return showSwaps ? 700 : 450;
    return showSwaps ? 800 : 500;
  }, [isMobile, isSmallScreen, showSwaps, isGlassVariant]);

  return (
    <Box sx={cardStyles}>
      <Stack
        direction={{ xs: "row", sm: "row" }}
        justifyContent={{ xs: "space-between", sm: "flex-end" }}
        spacing={{ xs: theme.spacing(1), sm: theme.spacing(3) }}
        sx={{
          mb: theme.spacing(2),
          ...(isMobile && {
            alignItems: 'center',
            gap: theme.spacing(1),
            flexWrap: 'nowrap',
          })
        }}
      >
        <Box sx={getControlsStyles}>
          <FormControlLabel
            control={
              <Checkbox
                checked={showSwaps}
                onChange={handleChangeSwap}
                size={isMobile ? "small" : "medium"}
              />
            }
            label={
              <FormattedMessage id="show.swaps" defaultMessage="Show Swaps" />
            }
            sx={{
              margin: 0,
              flex: '1 1 auto',
              '& .MuiFormControlLabel-label': {
                fontSize: { xs: theme.typography.caption.fontSize, sm: theme.typography.body1.fontSize },
                fontWeight: { xs: 600, sm: 400 },
              },
              ...(isMobile && isGlassVariant && {
                justifyContent: 'flex-start',
                backgroundColor: `rgba(255, 255, 255, 0.25)`,
                borderRadius: theme.shape.borderRadius,
                padding: `${theme.spacing(0.75)} ${theme.spacing(1)}`,
                backdropFilter: `blur(${blurIntensity}px) saturate(150%)`,
                WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(150%)`,
                border: `1px solid rgba(255, 255, 255, 0.4)`,
                minHeight: theme.spacing(4.5),
                alignItems: 'center',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }),
              ...(isMobile && !isGlassVariant && {
                backgroundColor: theme.palette.background.paper,
                borderRadius: theme.shape.borderRadius,
                padding: `${theme.spacing(0.75)} ${theme.spacing(1)}`,
                border: `1px solid ${theme.palette.divider}`,
                minHeight: theme.spacing(4.5),
                alignItems: 'center',
                boxShadow: theme.shadows[1],
              }),
            }}
          />
        </Box>

        <Box sx={getControlsStyles}>
          <FormControl
            size={isMobile ? "small" : "medium"}
            sx={{
              ...(isMobile && {
                flex: '0 1 auto',
                minWidth: theme.spacing(12),
                maxWidth: theme.spacing(20),
              }),
            }}
          >
            <Select
              displayEmpty
              value={selectedPool || ""}
              onChange={handleChange}
              MenuProps={menuProps}
              sx={{
                minWidth: { xs: theme.spacing(12), sm: theme.spacing(25) },
                '& .MuiSelect-select': {
                  fontSize: { xs: theme.typography.body2.fontSize, sm: theme.typography.body1.fontSize },
                },
                ...(isMobile && {
                  minWidth: theme.spacing(12),
                  maxWidth: theme.spacing(20),
                  width: 'auto',
                  flex: '0 1 auto',
                  '& .MuiSelect-select': {
                    padding: `${theme.spacing(0.75)} ${theme.spacing(1)}`,
                    textAlign: 'left',
                    fontSize: theme.typography.caption.fontSize,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  },
                }),
              }}
            >
              <MenuItem value="">
                <FormattedMessage
                  id="selecte.a.pair"
                  defaultMessage="Select a pair"
                />
              </MenuItem>
              {pools.map((pool, key) => (
                <MenuItem value={pool.address} key={key}>
                  {pool.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Stack>

      <Box
        sx={{
          height: chartHeight,
          borderRadius: theme.shape.borderRadius,
          overflow: 'hidden',
          border: isGlassVariant
            ? `1px solid rgba(255, 255, 255, ${glassOpacity * 2})`
            : `1px solid ${theme.palette.divider}`,
          backgroundColor: isGlassVariant
            ? 'transparent'
            : theme.palette.background.paper,
        }}
      >
        {isLoading ? (
          <Box
            sx={{
              p: { xs: theme.spacing(2), sm: theme.spacing(3), md: theme.spacing(4) },
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing(2),
            }}
          >
            {[...Array(4)].map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                width="100%"
                height={theme.spacing(12)}
                sx={{ borderRadius: theme.shape.borderRadius }}
              />
            ))}
          </Box>
        ) : (
          selectedPool && (
            <iframe
              height="100%"
              width="100%"
              id="geckoterminal-embed"
              title="GeckoTerminal Embed"
              src={`https://www.geckoterminal.com/${language}/${network}/pools/${selectedPool}?embed=1&info=${showInfo ? "1" : "0"}&swaps=${showSwaps ? "1" : "0"}`}
              frameBorder="0"
              allow="clipboard-write"
              allowFullScreen
              style={{
                border: 'none',
                borderRadius: theme.shape.borderRadius,
              }}
            />
          )
        )}
      </Box>
    </Box>
  );
}
