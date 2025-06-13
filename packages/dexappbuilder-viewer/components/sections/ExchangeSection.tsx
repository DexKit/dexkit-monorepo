import TradingGraph from "@dexkit/exchange/components/TradingGraph";
import { GET_GECKOTERMINAL_NETWORK } from "@dexkit/exchange/constants";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { Avatar, Box, ButtonBase, Container, Grid, Typography } from "@mui/material";
import { usePreviewPlatform } from "../SectionsRenderer";

import {
  useExchangeContext,
  useExchangeContextState,
  useGeckoTerminalTopPools,
} from "@dexkit/exchange/hooks";
import { useEffect, useMemo, useState } from "react";

import { TOKEN_ICON_URL } from "@dexkit/core/constants";
import { Token } from "@dexkit/core/types";
import { isAddressEqual } from "@dexkit/core/utils";
import SelectPairDialog from "@dexkit/exchange/components/dialogs/SelectPairDialog";
import PairInfo from "@dexkit/exchange/components/PairInfo";
import TradeWidget from "@dexkit/exchange/components/TradeWidget";
import { DexkitExchangeContext } from "@dexkit/exchange/contexts";
import { ExchangePageSection } from "@dexkit/ui/modules/wizard/types/section";

function ExchangeSection() {
  const exchangeState = useExchangeContext();
  const previewContext = usePreviewPlatform();

  const { chainId, account, signer } = exchangeState;

  const { isActive } = useWeb3React();

  const [open, setOpen] = useState(false);

  const getContrastColor = (backgroundColor: string): string => {
    if (!backgroundColor) return '#000000';

    const hex = backgroundColor.replace('#', '');

    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? '#000000' : '#ffffff';
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenSelectPair = () => {
    setOpen(true);
  };

  const handleSelectPair = (baseToken: Token, quoteToken: Token) => {
    exchangeState.setPair(baseToken, quoteToken);
    handleClose();
  };

  const network = useMemo(() => {
    return GET_GECKOTERMINAL_NETWORK(chainId);
  }, [chainId]);

  const [selectedAddress, setSelectedAddress] = useState<string>();

  const geckoTerminalTopPoolsQuery = useGeckoTerminalTopPools({
    address: exchangeState.baseToken?.address,
    network,
  });
  const isLoadingPool = geckoTerminalTopPoolsQuery.isLoading;

  const pools = useMemo(() => {
    if (
      geckoTerminalTopPoolsQuery.data &&
      geckoTerminalTopPoolsQuery.data.length > 0
    ) {
      return geckoTerminalTopPoolsQuery.data;
    }

    return [];
  }, [geckoTerminalTopPoolsQuery.data]);

  const selectedPool = useMemo(() => {
    return pools.find((pool) =>
      isAddressEqual(pool.attributes.address, selectedAddress)
    );
  }, [selectedAddress, pools]);

  const handleChangePool = (value: string) => {
    setSelectedAddress(value);
  };

  useEffect(() => {
    if (pools.length > 0) {
      let bestPool = pools[0];

      if (exchangeState.baseToken && exchangeState.quoteToken) {
        const baseSymbol = exchangeState.baseToken.symbol.toUpperCase();
        const quoteSymbol = exchangeState.quoteToken.symbol.toUpperCase();

        const exactMatch = pools.find(pool => {
          const poolName = pool.attributes.name.toUpperCase();
          return poolName.includes(baseSymbol) && poolName.includes(quoteSymbol);
        });

        if (exactMatch) {
          bestPool = exactMatch;
        } else {
          bestPool = pools[0];
        }
      }

      setSelectedAddress(bestPool.attributes.address);
    }
  }, [pools, exchangeState.baseToken, exchangeState.quoteToken]);

  const [showSwaps, setShowSwaps] = useState(false);

  const handleChangeShowSwap = (value: boolean) => {
    setShowSwaps(value);
  };

  const renderDefaultVariant = () => {
    if (exchangeState.container) {
      return (
        <Container maxWidth="xl">
          <Grid container spacing={2}>
            {exchangeState.quoteToken && exchangeState.baseToken && (
              <Grid item xs={12}>
                <PairInfo
                  quoteToken={exchangeState.quoteToken}
                  baseToken={exchangeState.baseToken}
                  onSelectPair={handleOpenSelectPair}
                  isLoading={isLoadingPool}
                  marketCap={
                    selectedPool?.attributes.market_cap_usd
                      ? selectedPool.attributes.market_cap_usd
                      : undefined
                  }
                  volume={selectedPool?.attributes.volume_usd.h24}
                  priceChangeH24={
                    selectedPool?.attributes.price_change_percentage.h24
                  }
                  lastPrice={selectedPool?.attributes.base_token_price_usd}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={4}>
              <TradeWidget isActive={true} />
            </Grid>
            <Grid item xs={12} sm={8}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TradingGraph
                    key={selectedAddress}
                    isLoading={isLoadingPool}
                    onChange={handleChangePool}
                    onChangeShowSwaps={handleChangeShowSwap}
                    selectedPool={selectedAddress}
                    network={network}
                    pools={pools.map((pool) => ({
                      name: pool.attributes.name,
                      address: pool.attributes.address,
                    }))}
                    showSwaps={showSwaps}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      );
    }

    return (
      <Grid container spacing={2}>
        {exchangeState.quoteToken && exchangeState.baseToken && (
          <Grid item xs={12}>
            <PairInfo
              quoteToken={exchangeState.quoteToken}
              baseToken={exchangeState.baseToken}
              onSelectPair={handleOpenSelectPair}
              isLoading={isLoadingPool}
              marketCap={
                selectedPool?.attributes.market_cap_usd
                  ? selectedPool.attributes.market_cap_usd
                  : undefined
              }
              volume={selectedPool?.attributes.volume_usd.h24}
              priceChangeH24={
                selectedPool?.attributes.price_change_percentage.h24
              }
              lastPrice={selectedPool?.attributes.base_token_price_usd}
            />
          </Grid>
        )}
        <Grid item xs={12} sm={4}>
          <TradeWidget isActive={true} />
        </Grid>
        <Grid item xs={12} sm={8}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TradingGraph
                key={selectedAddress}
                isLoading={isLoadingPool}
                onChange={handleChangePool}
                onChangeShowSwaps={handleChangeShowSwap}
                selectedPool={selectedAddress}
                network={network}
                pools={pools.map((pool) => ({
                  name: pool.attributes.name,
                  address: pool.attributes.address,
                }))}
                showSwaps={showSwaps}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const renderCustomVariant = (customSettings: any) => {
    const {
      showPairInfo = true,
      showTradingGraph = true,
      showTradeWidget = true,
      layout = "grid",
      spacing = 2,
      backgroundColor,
      borderRadius = 0,
      padding = 2,
      componentOrder = ['pairInfo', 'tradeWidget', 'tradingGraph'],
      pairInfoBackgroundColor,
      pairInfoTextColor,
      pairInfoBorderColor,
      tradeWidgetBackgroundColor,
      tradeWidgetTextColor,
      tradeWidgetBorderColor,
      tradeWidgetButtonColor,
      tradeWidgetButtonTextColor,
      tradingGraphBackgroundColor,
      tradingGraphBorderColor,
    } = customSettings || {};

    const containerStyle = {
      backgroundColor,
      borderRadius: borderRadius ? `${borderRadius}px` : undefined,
      padding: padding ? `${padding * 8}px` : undefined,
    };

    const pairInfoStyle = {
      ...(pairInfoBackgroundColor && {
        backgroundColor: `${pairInfoBackgroundColor} !important`,
        '& > *': { backgroundColor: `${pairInfoBackgroundColor} !important` },
        '& .MuiPaper-root': { backgroundColor: `${pairInfoBackgroundColor} !important` },
        '& .MuiCard-root': { backgroundColor: `${pairInfoBackgroundColor} !important` },
        '& .MuiBox-root': { backgroundColor: `${pairInfoBackgroundColor} !important` },
      }),
      ...(pairInfoTextColor && {
        color: `${pairInfoTextColor} !important`,
        '& *:not(.MuiButton-root)': { color: `${pairInfoTextColor} !important` }
      }),
      ...(pairInfoBorderColor && {
        border: `2px solid ${pairInfoBorderColor} !important`,
        boxSizing: 'border-box'
      }),
      ...(borderRadius && {
        borderRadius: `${borderRadius}px !important`
      }),
      padding: '16px',
      '& .MuiTypography-root': {
        color: pairInfoTextColor ? `${pairInfoTextColor} !important` : undefined,
      },
      '& .MuiButtonBase-root': {
        ...(pairInfoBackgroundColor && {
          backgroundColor: `${getContrastColor(pairInfoBackgroundColor)}20 !important`,
          color: `${getContrastColor(pairInfoBackgroundColor)} !important`,
        }),
        ...(pairInfoBorderColor && {
          borderColor: `${pairInfoBorderColor} !important`,
        }),
        '&:hover': {
          ...(pairInfoBackgroundColor && {
            backgroundColor: `${getContrastColor(pairInfoBackgroundColor)}30 !important`,
          }),
        },
        '& .MuiTypography-root': {
          ...(pairInfoBackgroundColor && {
            color: `${getContrastColor(pairInfoBackgroundColor)} !important`,
          }),
        },
        '& .MuiSvgIcon-root': {
          ...(pairInfoBorderColor && {
            color: `${pairInfoBorderColor} !important`,
          }),
        },
      },
      ...(pairInfoBorderColor && {
        '& .MuiPaper-root': {
          borderColor: `${pairInfoBorderColor} !important`,
        },
        '& .MuiPaper-outlined': {
          borderColor: `${pairInfoBorderColor} !important`,
        },
        '& .MuiDivider-root': {
          borderColor: `${pairInfoBorderColor} !important`,
          backgroundColor: `${pairInfoBorderColor} !important`,
        },
        '& *[style*="border"]': {
          borderColor: `${pairInfoBorderColor} !important`,
        },
      }),
    };

    const tradeWidgetStyle = {
      ...(tradeWidgetBackgroundColor && {
        backgroundColor: `${tradeWidgetBackgroundColor} !important`,
        '& > *': { backgroundColor: `${tradeWidgetBackgroundColor} !important` },
        '& .MuiPaper-root': { backgroundColor: `${tradeWidgetBackgroundColor} !important` },
        '& .MuiCard-root': { backgroundColor: `${tradeWidgetBackgroundColor} !important` },
        '& .MuiBox-root': { backgroundColor: `${tradeWidgetBackgroundColor} !important` },
      }),
      ...(tradeWidgetTextColor && {
        color: `${tradeWidgetTextColor} !important`,
        '& *:not(.MuiButton-root)': { color: `${tradeWidgetTextColor} !important` }
      }),
      padding: '8px',
      '& .MuiTypography-root': {
        color: tradeWidgetTextColor ? `${tradeWidgetTextColor} !important` : undefined,
      },
      '& .MuiButton-root': {
        ...(tradeWidgetButtonColor && {
          backgroundColor: `${tradeWidgetButtonColor} !important`,
        }),
        ...(tradeWidgetButtonTextColor && {
          color: `${tradeWidgetButtonTextColor} !important`
        }),
        '&:hover': {
          ...(tradeWidgetButtonColor && {
            backgroundColor: `${tradeWidgetButtonColor}cc !important`,
          }),
        },
      },
      '& .MuiTextField-root': {
        '& .MuiInputBase-root': {
          color: tradeWidgetTextColor ? `${tradeWidgetTextColor} !important` : undefined,
          backgroundColor: 'transparent !important',
        },
        '& .MuiInputLabel-root': {
          color: tradeWidgetTextColor ? `${tradeWidgetTextColor} !important` : undefined,
        },
      },
      ...(tradeWidgetBorderColor && {
        '& .MuiCardContent-root .MuiPaper-root': {
          borderColor: `${tradeWidgetBorderColor} !important`,
        },
        '& .MuiPaper-outlined': {
          borderColor: `${tradeWidgetBorderColor} !important`,
        }
      }),
      '& .MuiCard-root': {
        '& .MuiCardContent-root': {
          padding: '12px !important',
          '&:last-child': {
            paddingBottom: '12px !important',
          },
        },
      },
    };

    const tradingGraphStyle = {
      ...(tradingGraphBackgroundColor && {
        backgroundColor: `${tradingGraphBackgroundColor} !important`,
        '& > *': { backgroundColor: `${tradingGraphBackgroundColor} !important` },
        '& iframe': {
          backgroundColor: `${tradingGraphBackgroundColor} !important`,
          border: 'none !important',
        },
      }),
      ...(tradingGraphBorderColor && {
        border: `2px solid ${tradingGraphBorderColor} !important`,
        boxSizing: 'border-box'
      }),
      ...(borderRadius && { borderRadius: `${borderRadius}px` }),
      overflow: 'hidden',
      '& .tradingview-widget-container': {
        backgroundColor: `${tradingGraphBackgroundColor} !important`,
      },
      '& .tradingview-widget-container__widget': {
        backgroundColor: `${tradingGraphBackgroundColor} !important`,
      },
    };

    const renderPairInfoComponent = (skipGridWrapper = false) => {
      if (!showPairInfo || !exchangeState.quoteToken || !exchangeState.baseToken) return null;

      const content = (
        <>
          <Box sx={{ display: previewContext?.isMobile ? 'block' : 'none' }}>
            <Box sx={{
              ...pairInfoStyle,
              backgroundColor: pairInfoStyle?.backgroundColor || 'rgba(255,255,255,0.1)',
              border: pairInfoStyle?.border || '1px solid rgba(255,255,255,0.2)',
              borderRadius: pairInfoStyle?.borderRadius ? `${pairInfoStyle.borderRadius}px` : '8px',
              padding: '10px',
              color: pairInfoStyle?.color || '#fff',
              backdropFilter: 'blur(10px)',
            }}>
              <ButtonBase
                onClick={handleOpenSelectPair}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  mb: 1.5,
                  pb: 1,
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  width: '100%',
                  justifyContent: 'flex-start',
                  borderRadius: '4px',
                  px: 1,
                  py: 0.5,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  },
                  transition: 'background-color 0.2s ease'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Avatar
                    src={
                      exchangeState.baseToken.logoURI
                        ? exchangeState.baseToken.logoURI
                        : TOKEN_ICON_URL(exchangeState.baseToken.address, exchangeState.baseToken.chainId)
                    }
                    sx={{
                      width: '16px',
                      height: '16px',
                      fontSize: '8px',
                      fontWeight: 'bold'
                    }}
                  >
                    {exchangeState.baseToken.symbol.charAt(0)}
                  </Avatar>
                  <Avatar
                    src={
                      exchangeState.quoteToken.logoURI
                        ? exchangeState.quoteToken.logoURI
                        : TOKEN_ICON_URL(exchangeState.quoteToken.address, exchangeState.quoteToken.chainId)
                    }
                    sx={{
                      width: '16px',
                      height: '16px',
                      fontSize: '8px',
                      fontWeight: 'bold',
                      marginLeft: '-6px'
                    }}
                  >
                    {exchangeState.quoteToken.symbol.charAt(0)}
                  </Avatar>
                </Box>
                <Typography sx={{
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: 'inherit'
                }}>
                  {exchangeState.baseToken.symbol} / {exchangeState.quoteToken.symbol}
                </Typography>
                <Box sx={{
                  ml: 1,
                  fontSize: '12px',
                  opacity: 0.7,
                  color: 'inherit'
                }}>
                  ▼
                </Box>
              </ButtonBase>

              <Box sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gridTemplateRows: '1fr 1fr',
                gap: '8px',
                '& .stat-cell': {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  padding: '6px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: '4px',
                  border: '1px solid rgba(255,255,255,0.1)'
                },
                '& .stat-label': {
                  fontSize: '0.65rem',
                  opacity: 0.8,
                  fontWeight: '400',
                  color: 'inherit',
                  lineHeight: 1.2
                },
                '& .stat-value': {
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  color: 'inherit',
                  lineHeight: 1.2,
                  marginTop: '1px'
                }
              }}>
                <Box className="stat-cell">
                  <Typography className="stat-label">Last price:</Typography>
                  <Typography className="stat-value">
                    ${selectedPool?.attributes.base_token_price_usd ?
                      new Intl.NumberFormat('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      }).format(parseFloat(selectedPool.attributes.base_token_price_usd))
                      : '--'}
                  </Typography>
                </Box>

                <Box className="stat-cell">
                  <Typography className="stat-label">Market Cap:</Typography>
                  <Typography className="stat-value">
                    {selectedPool?.attributes.market_cap_usd ?
                      `$${new Intl.NumberFormat('en-US', {
                        notation: 'compact',
                        maximumFractionDigits: 1
                      }).format(parseFloat(selectedPool.attributes.market_cap_usd))}`
                      : '--'}
                  </Typography>
                </Box>

                <Box className="stat-cell">
                  <Typography className="stat-label">Price change:</Typography>
                  <Typography className="stat-value" sx={{
                    color: selectedPool?.attributes.price_change_percentage.h24 &&
                      parseFloat(selectedPool.attributes.price_change_percentage.h24) >= 0 ?
                      '#4caf50' : '#f44336'
                  }}>
                    {selectedPool?.attributes.price_change_percentage.h24 ?
                      `${parseFloat(selectedPool.attributes.price_change_percentage.h24) >= 0 ? '+' : ''}${parseFloat(selectedPool.attributes.price_change_percentage.h24).toFixed(1)}%`
                      : '--'}
                  </Typography>
                </Box>

                <Box className="stat-cell">
                  <Typography className="stat-label">24h volume:</Typography>
                  <Typography className="stat-value">
                    {selectedPool?.attributes.volume_usd.h24 ?
                      `$${new Intl.NumberFormat('en-US', {
                        notation: 'compact',
                        maximumFractionDigits: 1
                      }).format(parseFloat(selectedPool.attributes.volume_usd.h24))}`
                      : '--'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: previewContext?.isMobile ? 'none' : 'block' }}>
            <Box sx={{
              ...pairInfoStyle,
              mx: { xs: -0.5, sm: 0 },
            }}>
              <PairInfo
                quoteToken={exchangeState.quoteToken}
                baseToken={exchangeState.baseToken}
                onSelectPair={handleOpenSelectPair}
                isLoading={isLoadingPool}
                marketCap={
                  selectedPool?.attributes.market_cap_usd
                    ? selectedPool.attributes.market_cap_usd
                    : undefined
                }
                volume={selectedPool?.attributes.volume_usd.h24}
                priceChangeH24={
                  selectedPool?.attributes.price_change_percentage.h24
                }
                lastPrice={selectedPool?.attributes.base_token_price_usd}
              />
            </Box>
          </Box>
        </>
      );

      if (skipGridWrapper) {
        return content;
      }

      return (
        <Grid item xs={12} key="pairInfo">
          {content}
        </Grid>
      );
    };

    const renderTradeWidgetComponent = (skipGridWrapper = false) => {
      if (!showTradeWidget) return null;

      const content = (
        <Box sx={{
          ...tradeWidgetStyle,
          height: 'fit-content',
          maxHeight: { xs: '450px', sm: 'none' },
          ...(tradeWidgetBorderColor && {
            border: `2px solid ${tradeWidgetBorderColor} !important`,
            borderRadius: borderRadius ? `${borderRadius}px` : '8px',
            boxSizing: 'border-box',
          }),
          overflow: 'hidden',
          '& .MuiButton-root': {
            ...tradeWidgetStyle['& .MuiButton-root'],
            fontSize: { xs: '0.875rem', sm: '1rem' },
            py: { xs: 1, sm: 1.5 }
          },
          '& .MuiTextField-root': {
            ...tradeWidgetStyle['& .MuiTextField-root'],
            '& .MuiInputBase-input': {
              fontSize: { xs: '0.875rem', sm: '1rem' },
              py: { xs: 1, sm: 1.5 }
            }
          },
          '& .MuiCard-root': {
            ...(tradeWidgetBorderColor && {
              borderColor: `${tradeWidgetBorderColor} !important`,
            }),
            boxShadow: 'none !important'
          },
          '& > div': {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          },
          '& .MuiBox-root': {
            '&:last-child': {
              paddingBottom: '0 !important',
              marginBottom: '0 !important',
            },
          },
          '& .trade-widget-container': {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
          },
          padding: '0 !important',
          margin: '0 !important',
        }}>
          <TradeWidget isActive={true} />
        </Box>
      );

      if (skipGridWrapper) {
        return content;
      }

      return (
        <Grid item xs={12} md={showTradingGraph ? 6 : 12} lg={showTradingGraph ? 5 : 12} key="tradeWidget">
          {content}
        </Grid>
      );
    };

    const renderTradingGraphComponent = (skipGridWrapper = false) => {
      if (!showTradingGraph) return null;

      const content = (
        <Box sx={{
          ...tradingGraphStyle,
          minHeight: { xs: '300px', sm: '400px', md: '500px', lg: '600px' },
          maxHeight: { xs: '400px', sm: 'none' },
          '& iframe': {
            ...tradingGraphStyle['& iframe'],
            width: '100% !important',
            height: '100% !important',
            minHeight: 'inherit !important'
          },
          overflow: 'hidden',
          position: 'relative'
        }}>
          <TradingGraph
            key={selectedAddress}
            isLoading={isLoadingPool}
            onChange={handleChangePool}
            onChangeShowSwaps={handleChangeShowSwap}
            selectedPool={selectedAddress}
            network={network}
            pools={pools.map((pool) => ({
              name: pool.attributes.name,
              address: pool.attributes.address,
            }))}
            showSwaps={showSwaps}
          />
        </Box>
      );

      if (skipGridWrapper) {
        return content;
      }

      return (
        <Grid item xs={12} md={showTradeWidget ? 6 : 12} lg={showTradeWidget ? 7 : 12} key="tradingGraph">
          {content}
        </Grid>
      );
    };

    const renderComponentByType = (componentType: string, skipGridWrapper = false) => {
      switch (componentType) {
        case 'pairInfo':
          return renderPairInfoComponent(skipGridWrapper);
        case 'tradeWidget':
          return renderTradeWidgetComponent(skipGridWrapper);
        case 'tradingGraph':
          return renderTradingGraphComponent(skipGridWrapper);
        default:
          return null;
      }
    };

    if (layout === "horizontal") {
      return (
        <Box sx={{
          ...containerStyle,
          overflow: 'hidden'
        }}>
          {componentOrder.map((componentType: string) => {
            if (componentType === 'pairInfo') {
              return (
                <Box key={componentType} sx={{
                  width: '100%',
                  mb: { xs: 2, sm: 3, md: spacing }
                }}>
                  {renderComponentByType(componentType, true)}
                </Box>
              );
            } else {
              return (
                <Box key={componentType} sx={{
                  display: 'inline-block',
                  width: componentType === 'tradeWidget'
                    ? { xs: '100%', lg: '380px', xl: '420px' }
                    : { xs: '100%', lg: 'calc(100% - 400px)', xl: 'calc(100% - 440px)' },
                  verticalAlign: 'top',
                  mr: componentType === 'tradeWidget' ? { xs: 0, lg: spacing } : 0,
                  mb: { xs: 2, lg: 0 }
                }}>
                  {renderComponentByType(componentType, true)}
                </Box>
              );
            }
          })}
        </Box>
      );
    }

    if (layout === "vertical") {
      return (
        <Box sx={{
          ...containerStyle,
        }}>
          <Grid container spacing={{ xs: 1.5, sm: 2, md: 3, lg: spacing }} direction="column">
            {componentOrder.map((componentType: string) => renderComponentByType(componentType))}
          </Grid>
        </Box>
      );
    }

    return (
      <Box sx={{
        ...containerStyle,
      }}>
        <Grid container spacing={{ xs: 1.5, sm: 2, md: 3, lg: spacing }}>
          {componentOrder.map((componentType: string) => {
            if (componentType === 'pairInfo') {
              return (
                <Grid item xs={12} key={componentType}>
                  {renderComponentByType(componentType, true)}
                </Grid>
              );
            } else {
              return renderComponentByType(componentType);
            }
          })}
        </Grid>
      </Box>
    );
  };

  const renderContent = () => {
    const { variant, customVariantSettings } = exchangeState as any;

    switch (variant) {
      case "custom":
        return renderCustomVariant(customVariantSettings);
      default:
        return renderDefaultVariant();
    }
  };

  const renderSelectPairDialog = () => {
    const { variant, customVariantSettings } = exchangeState as any;

    if (variant === "custom" && customVariantSettings) {
      const {
        pairInfoBackgroundColor,
        pairInfoBorderColor,
        borderRadius = 0,
      } = customVariantSettings;

      return (
        open && (
          <SelectPairDialog
            DialogProps={{
              open,
              maxWidth: "sm",
              fullWidth: true,
              onClose: handleClose,
              sx: {
                '& .MuiDialog-paper': {
                  ...(pairInfoBackgroundColor && {
                    backgroundColor: `${pairInfoBackgroundColor} !important`,
                    color: `${getContrastColor(pairInfoBackgroundColor)} !important`,
                  }),
                  ...(pairInfoBorderColor && {
                    border: `2px solid ${pairInfoBorderColor} !important`,
                  }),
                  ...(borderRadius && {
                    borderRadius: `${borderRadius}px !important`,
                  }),
                  '@media (max-width: 600px)': {
                    margin: '8px !important',
                    height: '90vh !important',
                    maxHeight: '90vh !important',
                    borderRadius: '16px !important',
                  },
                },
                '& .MuiDialogTitle-root': {
                  ...(pairInfoBackgroundColor && {
                    backgroundColor: `${pairInfoBackgroundColor} !important`,
                    color: `${getContrastColor(pairInfoBackgroundColor)} !important`,
                  }),
                },
                '& .MuiDialogContent-root': {
                  ...(pairInfoBackgroundColor && {
                    backgroundColor: `${pairInfoBackgroundColor} !important`,
                    color: `${getContrastColor(pairInfoBackgroundColor)} !important`,
                  }),
                },
                '& .MuiDialogActions-root': {
                  ...(pairInfoBackgroundColor && {
                    backgroundColor: `${pairInfoBackgroundColor} !important`,
                    color: `${getContrastColor(pairInfoBackgroundColor)} !important`,
                  }),
                },
                '& .MuiChip-root': {
                  ...(pairInfoBackgroundColor && {
                    backgroundColor: 'transparent !important',
                    color: `${getContrastColor(pairInfoBackgroundColor)} !important`,
                    border: `1px solid ${pairInfoBorderColor || getContrastColor(pairInfoBackgroundColor)} !important`,
                  }),
                  '&.MuiChip-colorPrimary': {
                    ...(pairInfoBorderColor && {
                      backgroundColor: `${pairInfoBorderColor} !important`,
                      color: `${getContrastColor(pairInfoBorderColor)} !important`,
                      border: `1px solid ${pairInfoBorderColor} !important`,
                    }),
                  },
                },
                '& .MuiListItemButton-root': {
                  ...(pairInfoBackgroundColor && {
                    color: `${getContrastColor(pairInfoBackgroundColor)} !important`,
                  }),
                  '&:hover': {
                    ...(pairInfoBackgroundColor && {
                      backgroundColor: `${getContrastColor(pairInfoBackgroundColor)}10 !important`,
                    }),
                  },
                  '&.Mui-selected': {
                    ...(pairInfoBorderColor && {
                      backgroundColor: `${pairInfoBorderColor}20 !important`,
                    }),
                  },
                },
                '& .MuiTextField-root': {
                  '& .MuiInputBase-root': {
                    ...(pairInfoBackgroundColor && {
                      backgroundColor: `${getContrastColor(pairInfoBackgroundColor)}10 !important`,
                      color: `${getContrastColor(pairInfoBackgroundColor)} !important`,
                    }),
                    ...(pairInfoBorderColor && {
                      borderColor: `${pairInfoBorderColor} !important`,
                    }),
                  },
                  '& .MuiInputLabel-root': {
                    ...(pairInfoBackgroundColor && {
                      color: `${getContrastColor(pairInfoBackgroundColor)}80 !important`,
                    }),
                  },
                },
                '& .MuiButton-root': {
                  ...(pairInfoBackgroundColor && {
                    color: `${getContrastColor(pairInfoBackgroundColor)} !important`,
                  }),
                  '&.MuiButton-contained': {
                    ...(pairInfoBorderColor && {
                      backgroundColor: `${pairInfoBorderColor} !important`,
                      color: `${getContrastColor(pairInfoBorderColor)} !important`,
                    }),
                  },
                },
              },
            }}
            baseToken={exchangeState.baseToken}
            quoteToken={exchangeState.quoteToken}
            baseTokens={exchangeState.baseTokens}
            quoteTokens={exchangeState.quoteTokens}
            onSelectPair={handleSelectPair}
            availNetworks={exchangeState.availNetworks}
            onSwitchNetwork={exchangeState.onSwitchNetwork}
            chainId={exchangeState.chainId}
          />
        )
      );
    }

    return (
      open && (
        <SelectPairDialog
          DialogProps={{
            open,
            maxWidth: "sm",
            fullWidth: true,
            onClose: handleClose,
            sx: {
              '& .MuiDialog-paper': {
                '@media (max-width: 600px)': {
                  margin: '8px !important',
                  height: '90vh !important',
                  maxHeight: '90vh !important',
                  borderRadius: '16px !important',
                },
              },
            },
          }}
          baseToken={exchangeState.baseToken}
          quoteToken={exchangeState.quoteToken}
          baseTokens={exchangeState.baseTokens}
          quoteTokens={exchangeState.quoteTokens}
          onSelectPair={handleSelectPair}
          availNetworks={exchangeState.availNetworks}
          onSwitchNetwork={exchangeState.onSwitchNetwork}
          chainId={exchangeState.chainId}
        />
      )
    );
  };

  return (
    <>
      {renderSelectPairDialog()}

      <Box py={2}>{renderContent()}</Box>
    </>
  );
}

export interface ExchangeSectionProps {
  section: ExchangePageSection;
}

function ExchangeSectionWrapper({ section }: ExchangeSectionProps) {
  const { chainId } = useWeb3React();
  const { settings } = section;

  const exchangeState = useExchangeContextState({
    settings: {
      ...settings,
      defaultNetwork: chainId ? chainId : settings?.defaultNetwork,
    },
  });

  return (
    <DexkitExchangeContext.Provider value={exchangeState}>
      <ExchangeSection />
    </DexkitExchangeContext.Provider>
  );
}

export default ExchangeSectionWrapper;
