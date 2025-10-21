import { useIsMobile } from "@dexkit/core";
import { Token } from "@dexkit/core/types";
import { useCurrency, useForceThemeMode } from "@dexkit/ui/hooks";
import {
  Box,
  Chip,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Typography,
  useColorScheme,
  useMediaQuery,
  useTheme
} from "@mui/material";
import React, { useMemo } from "react";
import { FormattedMessage, FormattedNumber } from "react-intl";
import { ExchangeCustomVariantSettings } from "../../types";
import PairButton from "../PairButton";

const usePreviewPlatform = () => {
  try {
    const { usePreviewPlatform: usePreviewPlatformHook } = require("@dexkit/dexappbuilder-viewer/components/SectionsRenderer");
    return usePreviewPlatformHook();
  } catch {
    return null;
  }
};

export interface PairInfoProps {
  quoteToken: Token;
  baseToken: Token;
  isLoading: boolean;
  onSelectPair?: () => void;
  volume?: string;
  marketCap?: string;
  priceChangeH24?: string;
  lastPrice?: string;
  customVariantSettings?: ExchangeCustomVariantSettings;
}

export default function PairInfo({
  quoteToken,
  baseToken,
  isLoading,
  onSelectPair,
  volume,
  marketCap,
  priceChangeH24,
  lastPrice,
  customVariantSettings,
}: PairInfoProps) {

  const theme = useTheme();
  const { mode } = useColorScheme();
  const themeModeObj = useForceThemeMode();
  const themeMode = themeModeObj.mode;
  const isMobileDevice = useIsMobile();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
  const previewContext = usePreviewPlatform();
  const isMobile = previewContext ? previewContext.isMobile : (isMobileDevice || isSmallScreen);
  const isDark = themeMode === 'dark' || theme.palette.mode === 'dark';
  const primaryTextColor = customVariantSettings?.pairInfoTextColor || (isDark ? '#ffffff' : theme.palette.text.primary);
  const secondaryTextColor = customVariantSettings?.pairInfoSecondaryTextColor || (isDark ? 'rgba(255, 255, 255, 0.7)' : theme.palette.text.secondary);


  const [priceChange, priceChangeColor] = useMemo(() => {
    if (priceChangeH24) {
      let value = parseFloat(priceChangeH24);
      let color = value >= 0 ? "success.main" : "error.main";
      let formatted = value >= 0 ? `+${value.toFixed(2)}%` : `${value.toFixed(2)}%`;
      return [formatted, color];
    }
    return ["0.00%", "text.secondary"];
  }, [priceChangeH24]);

  const formattedVolume = useMemo(() => {
    if (volume) {
      return parseFloat(volume);
    }
    return null;
  }, [volume]);

  const formattedLastPrice = useMemo(() => {
    if (lastPrice) {
      return parseFloat(lastPrice);
    }
    return null;
  }, [lastPrice]);

  const formattedMarketCap = useMemo(() => {
    if (marketCap) {
      return parseFloat(marketCap);
    }
    return null;
  }, [marketCap]);

  const { currency } = useCurrency();

  const renderMobilMetric = (
    label: React.ReactNode,
    value: any,
    isPrice: boolean = false,
    color: string = 'text.primary',
    isChip: boolean = false
  ) => {
    const content = isLoading ? (
      <Skeleton
        variant="text"
        width={theme.spacing(3)}
        height={theme.spacing(1.25)}
        sx={{ borderRadius: Number(theme.shape.borderRadius) * 0.5 }}
      />
    ) : value !== null && value !== undefined ? (
      isPrice && typeof value === 'number' ? (
        <FormattedNumber
          value={value}
          currency={currency}
          currencyDisplay="narrowSymbol"
          style="currency"
          minimumFractionDigits={2}
          maximumFractionDigits={2}
        />
      ) : (
        value
      )
    ) : (
      "--"
    );

    return (
      <Box sx={{ textAlign: 'left', minHeight: theme.spacing(2.5) }}>
        <Typography
          variant="body1"
          sx={{
            color: secondaryTextColor,
            fontSize: theme.typography.overline.fontSize,
            fontWeight: theme.typography.fontWeightMedium,
            textTransform: 'uppercase',
            letterSpacing: 0.2,
            display: 'block',
            mb: theme.spacing(0.1),
            lineHeight: 1,
            opacity: 0.8,
          }}
        >
          {label}
        </Typography>

        {isChip ? (
          <Chip
            label={content}
            size="small"
            sx={{
              backgroundColor: color === 'success.main'
                ? theme.palette.success.light
                : theme.palette.error.light,
              color: color === 'success.main'
                ? theme.palette.success.contrastText
                : theme.palette.error.contrastText,
              fontWeight: theme.typography.fontWeightMedium,
              fontSize: theme.typography.overline.fontSize,
              height: theme.spacing(1.5),
              minWidth: 'auto',
              '& .MuiChip-label': {
                px: theme.spacing(0.375),
                py: 0,
                lineHeight: 1,
              },
            }}
          />
        ) : (
          <Typography
            variant="body1"
            sx={{
              color: color === 'text.primary' ? primaryTextColor : (color === 'success.main' ? theme.palette.success.main : color === 'error.main' ? theme.palette.error.main : primaryTextColor),
              fontWeight: theme.typography.fontWeightMedium,
              fontSize: theme.typography.body1.fontSize,
              lineHeight: 1,
            }}
          >
            {content}
          </Typography>
        )}
      </Box>
    );
  };

  const renderMetric = (
    label: React.ReactNode,
    value: any,
    isPrice: boolean = false,
    color: string = 'text.primary',
    isChip: boolean = false
  ) => {
    const content = isLoading ? (
      <Skeleton
        variant="text"
        width={theme.spacing(6)}
        height={theme.spacing(2)}
        sx={{ borderRadius: theme.shape.borderRadius }}
      />
    ) : value !== null && value !== undefined ? (
      isPrice && typeof value === 'number' ? (
        <FormattedNumber
          value={value}
          currency={currency}
          currencyDisplay="narrowSymbol"
          style="currency"
          minimumFractionDigits={2}
          maximumFractionDigits={2}
        />
      ) : (
        value
      )
    ) : (
      "--"
    );

    return (
      <Box sx={{ textAlign: { xs: 'left', sm: 'center' } }}>
        <Typography
          variant="body1"
          sx={{
            color: secondaryTextColor,
            fontSize: { xs: theme.typography.overline.fontSize, sm: theme.typography.body1.fontSize },
            fontWeight: theme.typography.fontWeightMedium,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            display: 'block',
            mb: theme.spacing(0.25),
          }}
        >
          {label}
        </Typography>

        {isChip ? (
          <Chip
            label={content}
            size="small"
            sx={{
              backgroundColor: color === 'success.main'
                ? theme.palette.success.light
                : theme.palette.error.light,
              color: color === 'success.main'
                ? theme.palette.success.contrastText
                : theme.palette.error.contrastText,
              fontWeight: theme.typography.fontWeightBold,
              fontSize: { xs: theme.typography.overline.fontSize, sm: theme.typography.body1.fontSize },
              height: { xs: theme.spacing(2.25), sm: theme.spacing(2.5) },
              '& .MuiChip-label': {
                px: theme.spacing(0.75),
              },
            }}
          />
        ) : (
          <Typography
            variant="body1"
            sx={{
              color: color === 'text.primary' ? primaryTextColor : (color === 'success.main' ? theme.palette.success.main : color === 'error.main' ? theme.palette.error.main : primaryTextColor),
              fontWeight: theme.typography.fontWeightMedium,
              fontSize: { xs: theme.typography.body1.fontSize, sm: theme.typography.body1.fontSize },
              lineHeight: 1.2,
            }}
          >
            {content}
          </Typography>
        )}
      </Box>
    );
  };

  const renderMobileLayout = () => (
    <Stack spacing={theme.spacing(0.5)}>
      <Box sx={{ mb: theme.spacing(0.25) }}>
        <PairButton
          quoteToken={quoteToken}
          baseToken={baseToken}
          onClick={onSelectPair}
        />
      </Box>

      <Grid container spacing={theme.spacing(0.25)} sx={{ mt: 0 }}>
        <Grid size={6} sx={{ pr: theme.spacing(0.25) }}>
          {renderMobilMetric(
            <FormattedMessage id="last.price" defaultMessage="Price" />,
            formattedLastPrice,
            true
          )}
        </Grid>
        <Grid size={6} sx={{ pl: theme.spacing(0.25) }}>
          {renderMobilMetric(
            <FormattedMessage id="price.change.24h" defaultMessage="24h" />,
            priceChange,
            false,
            priceChangeColor,
            true
          )}
        </Grid>
        <Grid size={6} sx={{ pr: theme.spacing(0.25) }}>
          {renderMobilMetric(
            <FormattedMessage id="24h.volume" defaultMessage="Volume" />,
            formattedVolume,
            true
          )}
        </Grid>
        <Grid size={6} sx={{ pl: theme.spacing(0.25) }}>
          {renderMobilMetric(
            <FormattedMessage id="market.cap" defaultMessage="MCap" />,
            formattedMarketCap,
            true
          )}
        </Grid>
      </Grid>
    </Stack>
  );

  const renderDesktopLayout = () => (
    <Stack
      direction="row"
      spacing={theme.spacing(3)}
      alignItems="center"
      justifyContent="space-between"
    >
      <Box sx={{ minWidth: 'fit-content' }}>
        <PairButton
          quoteToken={quoteToken}
          baseToken={baseToken}
          onClick={onSelectPair}
        />
      </Box>

      <Stack
        direction="row"
        spacing={{ sm: theme.spacing(2.5), md: theme.spacing(4) }}
        alignItems="center"
        divider={
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              height: theme.spacing(3),
              backgroundColor: theme.palette.divider,
              opacity: 0.6,
            }}
          />
        }
        sx={{ flex: 1, justifyContent: 'space-around' }}
      >
        {renderMetric(
          <FormattedMessage id="last.price" defaultMessage="Last price" />,
          formattedLastPrice,
          true
        )}

        {renderMetric(
          <FormattedMessage id="price.change.24h" defaultMessage="24h Change" />,
          priceChange,
          false,
          priceChangeColor,
          true
        )}

        {renderMetric(
          <FormattedMessage id="24h.volume" defaultMessage="24h Volume" />,
          formattedVolume,
          true
        )}

        {renderMetric(
          <FormattedMessage id="market.cap" defaultMessage="Market Cap" />,
          formattedMarketCap,
          true
        )}
      </Stack>
    </Stack>
  );

  return (
    <Box
      sx={{
        p: {
          xs: theme.spacing(0.5),
          sm: theme.spacing(1.75),
          md: theme.spacing(2.25)
        },
      }}
    >
      {isMobile ? renderMobileLayout() : renderDesktopLayout()}
    </Box>
  );
}
