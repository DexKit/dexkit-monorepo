import { NETWORKS } from '@dexkit/core/constants/networks';
import { TokenBalance } from '@dexkit/ui/modules/wallet/types';
import { WalletCustomSettings } from '@dexkit/ui/modules/wizard/types/section';
import { ArrowBack } from '@mui/icons-material';
import {
  Box,
  Container,
  IconButton,
  Stack,
  Typography,
  useTheme
} from '@mui/material';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import ExchangeWidget from '../../page-editor/components/ExchangeWidget';

interface Props {
  selectedCoin: TokenBalance;
  onBack: () => void;
  customSettings?: WalletCustomSettings;
}

export default function ExchangeContainer({ selectedCoin, onBack, customSettings }: Props) {
  const theme = useTheme();

  const getWalletBackgroundColor = () => {
    if (!customSettings) return theme.palette.background.default;

    if (customSettings.backgroundType === 'gradient') {
      return customSettings?.gradientStartColor || theme.palette.background.default;
    } else {
      return customSettings.backgroundColor || theme.palette.background.default;
    }
  };

  const walletBackgroundColor = getWalletBackgroundColor();
  const walletTextColor = customSettings?.primaryTextColor || theme.palette.text.primary;

  React.useEffect(() => {
    const styleId = 'exchange-global-styles';
    let existingStyle = document.getElementById(styleId);

    if (!existingStyle) {
      const style = document.createElement('style');
      style.id = styleId;
      document.head.appendChild(style);
      existingStyle = style;
    }

    const tokenInfoPrimaryColor = customSettings?.exchangeConfig?.tokenInfoBarPrimaryTextColor;
    const tradeWidgetPrimaryColor = customSettings?.exchangeConfig?.tradeWidgetPrimaryTextColor;

    let cssContent = '';

    if (tokenInfoPrimaryColor) {
      cssContent += `
        /* Force pair selector tickers to use Token Info Bar Primary Text color */
        .MuiDialog-root .MuiListItemButton-root .MuiTypography-root {
          color: ${tokenInfoPrimaryColor} !important;
        }
        .MuiDialog-root .MuiListItemText-primary {
          color: ${tokenInfoPrimaryColor} !important;
        }
        .MuiDialog-root .MuiList-root .MuiTypography-body1,
        .MuiDialog-root .MuiList-root .MuiTypography-body2 {
          color: ${tokenInfoPrimaryColor} !important;
        }
        /* Override any inline color styles in the pair list */
        .MuiDialog-root .MuiListItemButton-root [style*="color"] {
          color: ${tokenInfoPrimaryColor} !important;
        }
      `;
    }

    if (tradeWidgetPrimaryColor) {
      cssContent += `
        /* Force Show Swaps text to use Trade Widget Primary Text color */
        .MuiFormControlLabel-root .MuiTypography-root {
          color: ${tradeWidgetPrimaryColor} !important;
        }
        .MuiFormControlLabel-root span {
          color: ${tradeWidgetPrimaryColor} !important;
        }
        /* Target specifically FormControlLabel with show swaps text */
        .MuiFormControlLabel-root:has(.MuiCheckbox-root) .MuiTypography-root {
          color: ${tradeWidgetPrimaryColor} !important;
        }
      `;
    }

    existingStyle.textContent = cssContent;

    return () => {
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [customSettings?.exchangeConfig?.tokenInfoBarPrimaryTextColor, customSettings?.exchangeConfig?.tradeWidgetPrimaryTextColor]);

  const exchangeConfig = React.useMemo(() => {
    const { token } = selectedCoin;

    const nativeTokenAddress = "0x0000000000000000000000000000000000000000";

    const quoteToken = {
      address: nativeTokenAddress,
      chainId: token.chainId,
      decimals: 18,
      symbol: NETWORKS[token.chainId]?.coinSymbol || NETWORKS[token.chainId]?.symbol || 'ETH',
      name: NETWORKS[token.chainId]?.coinName || NETWORKS[token.chainId]?.name || 'Ethereum',
      logoURI: NETWORKS[token.chainId]?.coinImageUrl || NETWORKS[token.chainId]?.imageUrl || '',
    };

    const baseConfig = {
      defaultNetwork: token.chainId,
      defaultPairs: {
        [token.chainId]: {
          baseToken: token,
          quoteToken: quoteToken,
        },
      },
      defaultTokens: {
        [token.chainId]: {
          baseTokens: [token],
          quoteTokens: [quoteToken],
        },
      },
      availNetworks: [token.chainId],
      lockedBaseToken: token,
      lockedQuoteToken: quoteToken,
    };

    const hasExchangeConfig = customSettings?.exchangeConfig && (
      customSettings.exchangeConfig.tradeWidgetPrimaryTextColor ||
      customSettings.exchangeConfig.tradeWidgetButtonTextColor ||
      customSettings.exchangeConfig.tradeWidgetInputTextColor ||
      customSettings.exchangeConfig.tradeWidgetTabTextColor ||
      customSettings.exchangeConfig.fillAmountButtonActiveColor ||
      customSettings.exchangeConfig.fillAmountButtonInactiveColor ||
      customSettings.exchangeConfig.fillAmountButtonActiveTextColor ||
      customSettings.exchangeConfig.fillAmountButtonInactiveTextColor ||
      customSettings.exchangeConfig.tokenInfoBarBackgroundColor ||
      customSettings.exchangeConfig.tokenInfoBarPrimaryTextColor
    );

    if (hasExchangeConfig) {
      return {
        ...baseConfig,
        variant: "custom" as const,
        glassSettings: {
          fillButtonBackgroundColor: customSettings.exchangeConfig?.fillAmountButtonActiveColor,
          fillButtonTextColor: customSettings.exchangeConfig?.fillAmountButtonActiveTextColor,
          fillButtonHoverBackgroundColor: customSettings.exchangeConfig?.fillAmountButtonActiveColor,
          fillButtonHoverTextColor: customSettings.exchangeConfig?.fillAmountButtonActiveTextColor,
          fillButtonDisabledBackgroundColor: customSettings.exchangeConfig?.fillAmountButtonInactiveColor,
          fillButtonDisabledTextColor: customSettings.exchangeConfig?.fillAmountButtonInactiveTextColor,
        },
        customVariantSettings: {
          showPairInfo: true,
          showTradingGraph: true,
          showTradeWidget: true,
          layout: "grid" as const,
          spacing: 3,
          backgroundColor: walletBackgroundColor,
          borderRadius: customSettings?.cardConfig?.borderRadius || 8,
          padding: 2,
          componentOrder: ['pairInfo', 'tradeWidget', 'tradingGraph'],
          pairInfoBackgroundColor: customSettings.exchangeConfig?.tokenInfoBarBackgroundColor,
          pairInfoTextColor: customSettings.exchangeConfig?.tokenInfoBarPrimaryTextColor,
          pairInfoSecondaryTextColor: customSettings.exchangeConfig?.tokenInfoBarPrimaryTextColor,
          tradeWidgetBackgroundColor: walletBackgroundColor,
          tradeWidgetTextColor: customSettings.exchangeConfig?.tradeWidgetPrimaryTextColor,
          tradeWidgetButtonColor: customSettings.swapButtonConfig?.backgroundColor,
          tradeWidgetButtonTextColor: customSettings.exchangeConfig?.tradeWidgetButtonTextColor,
          tradeWidgetInputTextColor: customSettings.exchangeConfig?.tradeWidgetInputTextColor,
          tradeWidgetTabTextColor: customSettings.exchangeConfig?.tradeWidgetTabTextColor,
          fillButtonBackgroundColor: customSettings.exchangeConfig?.fillAmountButtonActiveColor,
          fillButtonTextColor: customSettings.exchangeConfig?.fillAmountButtonActiveTextColor,
          fillButtonHoverBackgroundColor: customSettings.exchangeConfig?.fillAmountButtonActiveColor,
          fillButtonHoverTextColor: customSettings.exchangeConfig?.fillAmountButtonActiveTextColor,
          fillButtonDisabledBackgroundColor: customSettings.exchangeConfig?.fillAmountButtonInactiveColor,
          fillButtonDisabledTextColor: customSettings.exchangeConfig?.fillAmountButtonInactiveTextColor,
          tradingGraphBackgroundColor: walletBackgroundColor,
          tradingGraphControlTextColor: customSettings.exchangeConfig?.tradeWidgetPrimaryTextColor,
        },
      };
    }

    return {
      ...baseConfig,
      variant: "default" as const,
    };
  }, [selectedCoin.token.chainId, selectedCoin.token.address, customSettings, walletBackgroundColor]);

  const exchangeWidgetKey = React.useMemo(() => {
    return `exchange-${selectedCoin.token.chainId}-${selectedCoin.token.address}`;
  }, [selectedCoin.token.chainId, selectedCoin.token.address]);

  return (
    <Box sx={{
      position: 'relative',
      minHeight: '100vh',
      overflow: 'hidden',
      backgroundColor: walletBackgroundColor,

      '@media (max-width: 899px)': {
        minHeight: 'auto',

        '& .MuiContainer-root': {
          paddingLeft: '8px !important',
          paddingRight: '8px !important',
          maxWidth: '100% !important',
        },

        '& [data-testid*="trading-chart"], & [class*="trading-chart"]': {
          minHeight: '200px !important',
        },
      },

      ...(customSettings?.exchangeConfig && {
        ...(customSettings.exchangeConfig.tradeWidgetButtonTextColor && {
          '& [class*="trade"] .MuiButton-root': {
            color: `${customSettings.exchangeConfig.tradeWidgetButtonTextColor} !important`,
            '& .MuiTypography-root': {
              color: `${customSettings.exchangeConfig.tradeWidgetButtonTextColor} !important`,
            },
            '& span': {
              color: `${customSettings.exchangeConfig.tradeWidgetButtonTextColor} !important`,
            },
          },
          '& [data-testid*="trade"] .MuiButton-root': {
            color: `${customSettings.exchangeConfig.tradeWidgetButtonTextColor} !important`,
            '& .MuiTypography-root': {
              color: `${customSettings.exchangeConfig.tradeWidgetButtonTextColor} !important`,
            },
            '& span': {
              color: `${customSettings.exchangeConfig.tradeWidgetButtonTextColor} !important`,
            },
          },
          '& .MuiButton-contained': {
            color: `${customSettings.exchangeConfig.tradeWidgetButtonTextColor} !important`,
            '& .MuiTypography-root': {
              color: `${customSettings.exchangeConfig.tradeWidgetButtonTextColor} !important`,
            },
            '& span': {
              color: `${customSettings.exchangeConfig.tradeWidgetButtonTextColor} !important`,
            },
          },
        }),

        ...(customSettings.exchangeConfig.tradeWidgetInputTextColor && {
          '& .MuiTextField-root .MuiInputBase-root': {
            color: `${customSettings.exchangeConfig.tradeWidgetInputTextColor} !important`,
          },
          '& .MuiTextField-root .MuiInputBase-input': {
            color: `${customSettings.exchangeConfig.tradeWidgetInputTextColor} !important`,
          },
          '& .MuiInputBase-root': {
            color: `${customSettings.exchangeConfig.tradeWidgetInputTextColor} !important`,
          },
          '& input': {
            color: `${customSettings.exchangeConfig.tradeWidgetInputTextColor} !important`,
          },
        }),

        ...(customSettings.exchangeConfig.tradeWidgetTabTextColor && {
          '& .MuiTab-root': {
            color: `${customSettings.exchangeConfig.tradeWidgetTabTextColor} !important`,
          },
          '& .MuiTabs-root .MuiTab-root': {
            color: `${customSettings.exchangeConfig.tradeWidgetTabTextColor} !important`,
          },
          '& .MuiButtonBase-root[role="tab"]': {
            color: `${customSettings.exchangeConfig.tradeWidgetTabTextColor} !important`,
          },
        }),
      }),
    }}>
      <Container
        maxWidth="xl"
        sx={{
          py: 4,
          px: 3,
        }}
      >
        <Stack spacing={3}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton
              onClick={onBack}
              sx={{
                bgcolor: walletBackgroundColor,
                color: walletTextColor,
                '&:hover': {
                  bgcolor: theme.palette.action.hover,
                },
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: theme.shape.borderRadius,
              }}
            >
              <ArrowBack />
            </IconButton>
            <Typography
              variant="h5"
              sx={{
                color: walletTextColor,
                fontWeight: 'bold',
              }}
            >
              <FormattedMessage
                id="exchange.token"
                defaultMessage="Exchange {symbol}"
                values={{ symbol: selectedCoin.token.symbol.toUpperCase() }}
              />
            </Typography>
          </Stack>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              width: '100%',
              maxWidth: '1400px',
              margin: '0 auto',
            }}
          >
            <ExchangeWidget
              key={exchangeWidgetKey}
              formData={exchangeConfig}
              isEditMode={false}
            />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}