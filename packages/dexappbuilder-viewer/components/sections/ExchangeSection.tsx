import TradingGraph from "@dexkit/exchange/components/TradingGraph";
import { GET_GECKOTERMINAL_NETWORK } from "@dexkit/exchange/constants";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import {
  Avatar,
  Box,
  ButtonBase,
  Container,
  Grid,
  Typography,
  useColorScheme,
  useMediaQuery,
  useTheme
} from "@mui/material";
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
  const theme = useTheme();
  const { mode } = useColorScheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const exchangeState = useExchangeContext();
  const previewContext = usePreviewPlatform();
  const { chainId } = exchangeState;
  const [open, setOpen] = useState(false);

  const pairInfoStyles = useMemo(() => ({
    backgroundColor: 'background.paper',
    border: '1px solid',
    borderColor: 'divider',
    color: 'text.primary',
    '&:hover': {
      backgroundColor: 'action.hover',
    },
  }), [mode]);

  const statCellStyles = useMemo(() => ({
    backgroundColor: 'background.paper',
    border: 1,
    borderColor: 'divider',
    '& .stat-label': {
      color: 'text.secondary',
    },
    '& .stat-value': {
      color: 'text.primary',
    },
  }), [mode]);

  const getContrastColor = (backgroundColor: string): string => {
    if (!backgroundColor) return theme.palette.text.primary;

    const hex = backgroundColor.replace("#", "");

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? theme.palette.text.primary : theme.palette.common.white;
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

        const exactMatch = pools.find((pool) => {
          const poolName = pool.attributes.name.toUpperCase();
          return (
            poolName.includes(baseSymbol) && poolName.includes(quoteSymbol)
          );
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
              <Grid size={12}>
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
            <Grid size={{ xs: 12, sm: 4 }}>
              <TradeWidget isActive={true} />
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <Grid container spacing={2}>
                <Grid size={12}>
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
          <Grid size={12}>
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
        <Grid size={{ xs: 12, sm: 4 }}>
          <TradeWidget isActive={true} />
        </Grid>
        <Grid size={{ xs: 12, sm: 8 }}>
          <Grid container spacing={2}>
            <Grid size={12}>
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
      componentOrder = ["pairInfo", "tradeWidget", "tradingGraph"],
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
      backgroundColor: customSettings?.backgroundImage
        ? undefined
        : backgroundColor,
      background: customSettings?.backgroundImage
        ? `url(${customSettings.backgroundImage})`
        : backgroundColor,
      backgroundSize: customSettings?.backgroundImage
        ? customSettings?.backgroundSize || "cover"
        : "auto",
      backgroundPosition: customSettings?.backgroundImage
        ? customSettings?.backgroundPosition || "center"
        : "initial",
      backgroundRepeat: customSettings?.backgroundImage
        ? customSettings?.backgroundRepeat || "no-repeat"
        : "initial",
      backgroundAttachment: customSettings?.backgroundImage
        ? customSettings?.backgroundAttachment || "scroll"
        : "initial",
      borderRadius: borderRadius ? `${borderRadius}px` : undefined,
      padding: padding ? `${padding * 8}px` : undefined,
    };

    const pairInfoStyle = {
      ...(pairInfoBackgroundColor && {
        backgroundColor: pairInfoBackgroundColor,
        "& > *": { backgroundColor: `${pairInfoBackgroundColor}` },
        "& .MuiPaper-root": {
          backgroundColor: pairInfoBackgroundColor,
        },
        "& .MuiCard-root": {
          backgroundColor: pairInfoBackgroundColor,
        },
        "& .MuiBox-root": {
          backgroundColor: pairInfoBackgroundColor,
        },
      }),
      ...(pairInfoTextColor && {
        color: pairInfoTextColor,
        "& *:not(.MuiButton-root)": {
          color: pairInfoTextColor,
        },
      }),
      ...(!pairInfoTextColor && {
        color: 'text.primary',
        "& *:not(.MuiButton-root)": {
          color: 'text.primary',
        },
      }),
      ...(pairInfoBorderColor && {
        border: `2px solid ${pairInfoBorderColor}`,
        boxSizing: "border-box",
      }),
      ...(borderRadius && {
        borderRadius: `${borderRadius}px`,
      }),
      padding: "16px",
      "& .MuiTypography-root": {
        color: pairInfoTextColor
          ? pairInfoTextColor
          : 'text.primary',
      },
      "& .MuiButtonBase-root": {
        ...(pairInfoBackgroundColor && {
          backgroundColor: `${getContrastColor(pairInfoBackgroundColor)}20`,
          color: getContrastColor(pairInfoBackgroundColor),
        }),
        ...(pairInfoBorderColor && {
          borderColor: pairInfoBorderColor,
        }),
        "&:hover": {
          ...(pairInfoBackgroundColor && {
            backgroundColor: `${getContrastColor(pairInfoBackgroundColor)}30`,
          }),
        },
        "& .MuiTypography-root": {
          ...(pairInfoBackgroundColor && {
            color: getContrastColor(pairInfoBackgroundColor),
          }),
          ...(!pairInfoBackgroundColor && {
            color: 'text.primary',
          }),
        },
        "& .MuiSvgIcon-root": {
          ...(pairInfoBorderColor && {
            color: `${pairInfoBorderColor}`,
          }),
        },
      },
      ...(pairInfoBorderColor && {
        "& .MuiPaper-root": {
          borderColor: pairInfoBorderColor,
        },
        "& .MuiPaper-outlined": {
          borderColor: pairInfoBorderColor,
        },
        "& .MuiDivider-root": {
          borderColor: pairInfoBorderColor,
          backgroundColor: `${pairInfoBorderColor}`,
        },
        '& *[style*="border"]': {
          borderColor: pairInfoBorderColor,
        },
      }),
    };

    const tradeWidgetStyle = {
      ...(tradeWidgetBackgroundColor && {
        backgroundColor: tradeWidgetBackgroundColor,
        "& > *": {
          backgroundColor: tradeWidgetBackgroundColor,
        },
        "& .MuiPaper-root": {
          backgroundColor: tradeWidgetBackgroundColor,
        },
        "& .MuiCard-root": {
          backgroundColor: tradeWidgetBackgroundColor,
        },
        "& .MuiBox-root": {
          backgroundColor: tradeWidgetBackgroundColor,
        },
      }),
      ...(tradeWidgetTextColor && {
        color: tradeWidgetTextColor,
        "& *:not(.MuiButton-root)": {
          color: tradeWidgetTextColor,
        },
      }),
      padding: "8px",
      "& .MuiTypography-root": {
        color: tradeWidgetTextColor
          ? tradeWidgetTextColor
          : undefined,
      },
      "& .MuiButton-root": {
        ...(tradeWidgetButtonColor && {
          backgroundColor: tradeWidgetButtonColor,
        }),
        ...(tradeWidgetButtonTextColor && {
          color: tradeWidgetButtonTextColor,
        }),
        "&:hover": {
          ...(tradeWidgetButtonColor && {
            backgroundColor: `${tradeWidgetButtonColor}cc`,
          }),
        },
      },
      "& .MuiTextField-root": {
        "& .MuiInputBase-root": {
          color: tradeWidgetTextColor
            ? tradeWidgetTextColor
            : undefined,
          backgroundColor: "transparent",
        },
        "& .MuiInputLabel-root": {
          color: tradeWidgetTextColor
            ? tradeWidgetTextColor
            : undefined,
        },
      },
      ...(tradeWidgetBorderColor && {
        "& .MuiCardContent-root .MuiPaper-root": {
          borderColor: tradeWidgetBorderColor,
        },
        "& .MuiPaper-outlined": {
          borderColor: tradeWidgetBorderColor,
        },
      }),
      "& .MuiCard-root": {
        "& .MuiCardContent-root": {
          padding: "12px",
          "&:last-child": {
            paddingBottom: "12px",
          },
        },
      },
    };

    const tradingGraphStyle = {
      ...(tradingGraphBackgroundColor && {
        backgroundColor: tradingGraphBackgroundColor,
        "& > *": {
          backgroundColor: tradingGraphBackgroundColor,
        },
        "& iframe": {
          backgroundColor: tradingGraphBackgroundColor,
          border: "none",
        },
      }),
      ...(tradingGraphBorderColor && {
        border: `2px solid ${tradingGraphBorderColor}`,
        boxSizing: "border-box",
      }),
      ...(borderRadius && { borderRadius: `${borderRadius}px` }),
      overflow: "hidden",
      "& .tradingview-widget-container": {
        backgroundColor: tradingGraphBackgroundColor,
      },
      "& .tradingview-widget-container__widget": {
        backgroundColor: tradingGraphBackgroundColor,
      },
    };

    const renderPairInfoComponent = (skipGridWrapper = false) => {
      if (
        !showPairInfo ||
        !exchangeState.quoteToken ||
        !exchangeState.baseToken
      )
        return null;

      const content = (
        <>
          <Box sx={{ display: previewContext?.isMobile ? "block" : "none" }}>
            <Box
              sx={{
                ...pairInfoStyle,
                ...pairInfoStyles,
                borderRadius: pairInfoStyle?.borderRadius
                  ? `${pairInfoStyle.borderRadius}px`
                  : "8px",
                padding: "10px",
                backdropFilter: "blur(10px)",
              }}
            >
              <ButtonBase
                onClick={handleOpenSelectPair}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  mb: 1.5,
                  pb: 1,
                  borderBottom: 1,
                  borderColor: 'divider',
                  width: "100%",
                  justifyContent: "flex-start",
                  borderRadius: "4px",
                  px: 1,
                  py: 0.5,
                  "&:hover": {
                    backgroundColor: 'action.hover',
                  },
                  transition: "background-color 0.2s ease",
                  color: 'text.primary',
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Avatar
                    src={
                      exchangeState.baseToken.logoURI
                        ? exchangeState.baseToken.logoURI
                        : TOKEN_ICON_URL(
                          exchangeState.baseToken.address,
                          exchangeState.baseToken.chainId
                        )
                    }
                    sx={{
                      width: "16px",
                      height: "16px",
                      fontSize: "8px",
                      fontWeight: "bold",
                    }}
                  >
                    {exchangeState.baseToken.symbol.charAt(0)}
                  </Avatar>
                  <Avatar
                    src={
                      exchangeState.quoteToken.logoURI
                        ? exchangeState.quoteToken.logoURI
                        : TOKEN_ICON_URL(
                          exchangeState.quoteToken.address,
                          exchangeState.quoteToken.chainId
                        )
                    }
                    sx={{
                      width: "16px",
                      height: "16px",
                      fontSize: "8px",
                      fontWeight: "bold",
                      marginLeft: "-6px",
                    }}
                  >
                    {exchangeState.quoteToken.symbol.charAt(0)}
                  </Avatar>
                </Box>
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    fontWeight: "600",
                    color: 'text.primary',
                  }}
                >
                  {exchangeState.baseToken.symbol} /{" "}
                  {exchangeState.quoteToken.symbol}
                </Typography>
                <Box
                  sx={{
                    ml: 1,
                    fontSize: "12px",
                    opacity: 0.7,
                    color: 'text.primary',
                  }}
                >
                  ▼
                </Box>
              </ButtonBase>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gridTemplateRows: "1fr 1fr",
                  gap: "8px",
                  "& .stat-cell": {
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                    padding: "6px",
                    ...statCellStyles,
                    borderRadius: "4px",
                  },
                  "& .stat-label": {
                    fontSize: "0.65rem",
                    opacity: 0.8,
                    fontWeight: "400",
                    color: 'text.secondary',
                    lineHeight: 1.2,
                  },
                  "& .stat-value": {
                    fontSize: "0.7rem",
                    fontWeight: "600",
                    color: 'text.primary',
                    lineHeight: 1.2,
                    marginTop: "1px",
                  },
                }}
              >
                <Box className="stat-cell">
                  <Typography className="stat-label">Last price:</Typography>
                  <Typography className="stat-value">
                    $
                    {selectedPool?.attributes.base_token_price_usd
                      ? new Intl.NumberFormat("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(
                        parseFloat(
                          selectedPool.attributes.base_token_price_usd
                        )
                      )
                      : "--"}
                  </Typography>
                </Box>

                <Box className="stat-cell">
                  <Typography className="stat-label">Market Cap:</Typography>
                  <Typography className="stat-value">
                    {selectedPool?.attributes.market_cap_usd
                      ? `$${new Intl.NumberFormat("en-US", {
                        notation: "compact",
                        maximumFractionDigits: 1,
                      }).format(
                        parseFloat(selectedPool.attributes.market_cap_usd)
                      )}`
                      : "--"}
                  </Typography>
                </Box>

                <Box className="stat-cell">
                  <Typography className="stat-label">Price change:</Typography>
                  <Typography
                    className="stat-value"
                    sx={{
                      color:
                        selectedPool?.attributes.price_change_percentage.h24 &&
                          parseFloat(
                            selectedPool.attributes.price_change_percentage.h24
                          ) >= 0
                          ? 'success.main'
                          : 'error.main',
                    }}
                  >
                    {selectedPool?.attributes.price_change_percentage.h24
                      ? `${parseFloat(selectedPool.attributes.price_change_percentage.h24) >= 0 ? "+" : ""}${parseFloat(selectedPool.attributes.price_change_percentage.h24).toFixed(1)}%`
                      : "--"}
                  </Typography>
                </Box>

                <Box className="stat-cell">
                  <Typography className="stat-label">24h volume:</Typography>
                  <Typography className="stat-value">
                    {selectedPool?.attributes.volume_usd.h24
                      ? `$${new Intl.NumberFormat("en-US", {
                        notation: "compact",
                        maximumFractionDigits: 1,
                      }).format(
                        parseFloat(selectedPool.attributes.volume_usd.h24)
                      )}`
                      : "--"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: previewContext?.isMobile ? "none" : "block" }}>
            <Box
              sx={{
                ...pairInfoStyle,
                mx: { xs: -0.5, sm: 0 },
              }}
            >
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
                customVariantSettings={customSettings}
              />
            </Box>
          </Box>
        </>
      );

      if (skipGridWrapper) {
        return content;
      }

      return (
        <Grid size={12} key="pairInfo">
          {content}
        </Grid>
      );
    };

    const renderTradeWidgetComponent = (skipGridWrapper = false) => {
      if (!showTradeWidget) return null;

      const content = (
        <Box
          sx={{
            ...tradeWidgetStyle,
            height: "fit-content",
            maxHeight: { xs: "450px", sm: "none" },
            ...(tradeWidgetBorderColor && {
              border: `2px solid ${tradeWidgetBorderColor}`,
              borderRadius: borderRadius ? `${borderRadius}px` : "8px",
              boxSizing: "border-box",
            }),
            overflow: "hidden",
            "& .MuiButton-root": {
              ...tradeWidgetStyle["& .MuiButton-root"],
              fontSize: { xs: "0.875rem", sm: "1rem" },
              py: { xs: 1, sm: 1.5 },
            },
            "& .MuiTextField-root": {
              ...tradeWidgetStyle["& .MuiTextField-root"],
              "& .MuiInputBase-input": {
                fontSize: { xs: "0.875rem", sm: "1rem" },
                py: { xs: 1, sm: 1.5 },
              },
            },
            "& .MuiCard-root": {
              ...(tradeWidgetBorderColor && {
                borderColor: tradeWidgetBorderColor,
              }),
              boxShadow: "none",
            },
            "& > div": {
              height: "100%",
              display: "flex",
              flexDirection: "column",
            },
            "& .MuiBox-root": {
              "&:last-child": {
                paddingBottom: "0",
                marginBottom: "0",
              },
            },
            "& .trade-widget-container": {
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
            },
            padding: "0",
            margin: "0",
          }}
        >
          <TradeWidget isActive={true} customVariantSettings={customSettings} />
        </Box>
      );

      if (skipGridWrapper) {
        return content;
      }

      return (
        <Grid
          size={{ xs: 12, md: showTradingGraph ? 6 : 12, lg: showTradingGraph ? 5 : 12 }}
          key="tradeWidget"
        >
          {content}
        </Grid>
      );
    };

    const renderTradingGraphComponent = (skipGridWrapper = false) => {
      if (!showTradingGraph) return null;

      const content = (
        <Box
          sx={{
            ...tradingGraphStyle,
            minHeight: { xs: "300px", sm: "400px", md: "500px", lg: "600px" },
            maxHeight: { xs: "400px", sm: "none" },
            "& iframe": {
              ...tradingGraphStyle["& iframe"],
              width: "100%",
              height: "100%",
              minHeight: "inherit",
            },
            overflow: "hidden",
            position: "relative",
          }}
        >
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
            customVariantSettings={customSettings}
          />
        </Box>
      );

      if (skipGridWrapper) {
        return content;
      }

      return (
        <Grid
          size={{ xs: 12, md: showTradeWidget ? 6 : 12, lg: showTradeWidget ? 7 : 12 }}
          key="tradingGraph"
        >
          {content}
        </Grid>
      );
    };

    const renderComponentByType = (
      componentType: string,
      skipGridWrapper = false
    ) => {
      switch (componentType) {
        case "pairInfo":
          return renderPairInfoComponent(skipGridWrapper);
        case "tradeWidget":
          return renderTradeWidgetComponent(skipGridWrapper);
        case "tradingGraph":
          return renderTradingGraphComponent(skipGridWrapper);
        default:
          return null;
      }
    };

    if (layout === "horizontal") {
      return (
        <Box
          sx={{
            ...containerStyle,
            overflow: "hidden",
          }}
        >
          {componentOrder.map((componentType: string) => {
            if (componentType === "pairInfo") {
              return (
                <Box
                  key={componentType}
                  sx={{
                    width: "100%",
                    mb: {
                      xs: Math.max(spacing * 0.5, 1),
                      sm: Math.max(spacing * 0.75, 1.5),
                      md: spacing,
                    },
                  }}
                >
                  {renderComponentByType(componentType, true)}
                </Box>
              );
            } else {
              return (
                <Box
                  key={componentType}
                  sx={{
                    display: "inline-block",
                    width:
                      componentType === "tradeWidget"
                        ? { xs: "100%", lg: "380px", xl: "420px" }
                        : {
                          xs: "100%",
                          lg: "calc(100% - 400px)",
                          xl: "calc(100% - 440px)",
                        },
                    verticalAlign: "top",
                    mr:
                      componentType === "tradeWidget"
                        ? { xs: 0, lg: spacing }
                        : 0,
                    mb: { xs: Math.max(spacing * 0.5, 1), lg: 0 },
                  }}
                >
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
        <Box
          sx={{
            ...containerStyle,
          }}
        >
          <Grid
            container
            spacing={{
              xs: Math.max(spacing * 0.5, 1),
              sm: Math.max(spacing * 0.75, 1.5),
              md: Math.max(spacing * 0.85, 2),
              lg: spacing,
            }}
            direction="column"
          >
            {componentOrder.map((componentType: string) =>
              renderComponentByType(componentType)
            )}
          </Grid>
        </Box>
      );
    }

    return (
      <Box
        sx={{
          ...containerStyle,
        }}
      >
        <Grid
          container
          spacing={{
            xs: Math.max(spacing * 0.5, 1),
            sm: Math.max(spacing * 0.75, 1.5),
            md: Math.max(spacing * 0.85, 2),
            lg: spacing,
          }}
        >
          {componentOrder.map((componentType: string) => {
            if (componentType === "pairInfo") {
              return (
                <Grid size={12} key={componentType}>
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

  const renderGlassVariant = (glassSettings: any) => {
    const blurIntensity = glassSettings?.blurIntensity || 40;
    const glassOpacity = glassSettings?.glassOpacity || 0.1;
    const textColor = glassSettings?.textColor || theme.palette.text.primary;

    const getContainerBackground = () => {
      if (glassSettings?.disableBackground) {
        return "transparent";
      }

      if (
        glassSettings?.backgroundType === "image" &&
        glassSettings?.backgroundImage
      ) {
        return `url(${glassSettings.backgroundImage})`;
      } else if (glassSettings?.backgroundType === "solid") {
        return (
          glassSettings.backgroundColor || theme.palette.background.default
        );
      } else {
        const from =
          glassSettings?.gradientStartColor || theme.palette.background.default;
        const to =
          glassSettings?.gradientEndColor || theme.palette.background.paper;
        const direction = glassSettings?.gradientDirection || "to bottom";

        const directionMap: Record<string, string> = {
          "to bottom": "180deg",
          "to top": "0deg",
          "to right": "90deg",
          "to left": "270deg",
          "to bottom right": "135deg",
          "to bottom left": "225deg",
        };
        const gradientDirection = directionMap[direction] || "180deg";
        return `linear-gradient(${gradientDirection}, ${from}, ${to})`;
      }
    };

    const glassmorphismBase = {
      backgroundColor: `rgba(255, 255, 255, ${glassOpacity})`,
      backdropFilter: `blur(${blurIntensity}px) saturate(180%) brightness(1.05)`,
      WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(180%) brightness(1.05)`,
      border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.4)})`,
      borderRadius: {
        xs: "16px",
        sm: "18px",
        md: "20px",
      },
      boxShadow: {
        xs: `
          0 4px 16px rgba(0, 0, 0, 0.08),
          0 1px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 3, 0.5)}) inset
        `,
        sm: `
          0 6px 24px rgba(0, 0, 0, 0.09),
          0 1px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 3, 0.5)}) inset
        `,
        md: `
          0 8px 32px rgba(0, 0, 0, 0.1),
          0 1px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 3, 0.5)}) inset
        `,
      },
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      position: "relative",
      overflow: "hidden",
      isolation: "isolate",
      "&:hover": {
        backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.05, 0.4)})`,
        backdropFilter: `blur(${blurIntensity + 10}px) saturate(200%) brightness(1.08)`,
        WebkitBackdropFilter: `blur(${blurIntensity + 10}px) saturate(200%) brightness(1.08)`,
        boxShadow: {
          xs: `
            0 6px 20px rgba(0, 0, 0, 0.12),
            0 2px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 4, 0.6)}) inset
          `,
          sm: `
            0 8px 28px rgba(0, 0, 0, 0.13),
            0 2px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 4, 0.6)}) inset
          `,
          md: `
            0 12px 40px rgba(0, 0, 0, 0.15),
            0 2px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 4, 0.6)}) inset
          `,
        },
      },
    };

    const pairInfoStyles = {
      ...glassmorphismBase,
      padding: { xs: "12px 16px", sm: "16px 20px", md: "20px 28px" },
      borderRadius: {
        xs: "12px",
        sm: "16px",
        md: "20px",
      },
      margin: { xs: "4px", sm: "8px", md: "0" },
      backdropFilter: `blur(${blurIntensity}px) saturate(180%) brightness(1.05)`,
      WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(180%) brightness(1.05)`,
      "& .MuiPaper-root": {
        backgroundColor: "transparent",
        boxShadow: "none",
      },
      "& .MuiTypography-root": {
        color: `${textColor}`,
        fontWeight: "500",
        fontSize: { xs: "13px", sm: "14px", md: "15px" },
        lineHeight: { xs: 1.4, sm: 1.5, md: 1.6 },
        textShadow: textColor.includes("255, 255, 255")
          ? "0 1px 2px rgba(0, 0, 0, 0.3)"
          : "0 1px 2px rgba(255, 255, 255, 0.3)",
        position: "relative",
        zIndex: 2,
      },
      "& .MuiButtonBase-root": {
        backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity * 0.8, 0.2)})`,
        backdropFilter: `blur(${blurIntensity}px) saturate(150%) brightness(1.02)`,
        WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(150%) brightness(1.02)`,
        borderRadius: {
          xs: "12px",
          sm: "14px",
          md: "16px",
        },
        border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.3)})`,
        color: `${textColor}`,
        fontSize: { xs: "13px", sm: "14px", md: "15px" },
        minHeight: { xs: "40px", sm: "44px", md: "48px" },
        boxShadow: `0 4px 12px rgba(0, 0, 0, 0.05), 0 1px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.3)}) inset`,
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        isolation: "isolate",
        position: "relative",
        zIndex: 2,
        "&:hover": {
          backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.05, 0.3)})`,
          backdropFilter: `blur(${blurIntensity + 5}px) saturate(170%) brightness(1.05)`,
          WebkitBackdropFilter: `blur(${blurIntensity + 5}px) saturate(170%) brightness(1.05)`,
          boxShadow: `0 6px 16px rgba(0, 0, 0, 0.08), 0 2px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 3, 0.4)}) inset`,
        },
      },
    };

    const tradeWidgetStyles = {
      ...glassmorphismBase,
      borderRadius: {
        xs: "12px",
        sm: "16px",
        md: "20px",
      },
      backdropFilter: `blur(${blurIntensity}px) saturate(180%) brightness(1.05)`,
      WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(180%) brightness(1.05)`,
      padding: { xs: "8px", sm: "12px", md: "16px" },
      margin: { xs: "4px", sm: "8px", md: "0" },
      "& .MuiCard-root": {
        backgroundColor: "transparent",
        boxShadow: "none",
        borderRadius: {
          xs: "14px",
          sm: "16px",
          md: "16px",
        },
      },
      "& .MuiCardContent-root": {
        padding: {
          xs: "16px",
          sm: "18px",
          md: "20px",
        },
        position: "relative",
        zIndex: 2,
      },
      "& .MuiTabs-root": {
        position: "relative",
        zIndex: 2,
        minHeight: { xs: "40px", sm: "44px", md: "48px" },
        "& .MuiTab-root": {
          color: `${textColor.replace("0.95", "0.7")}`,
          fontWeight: "600",
          fontSize: { xs: "13px", sm: "14px", md: "15px" },
          minHeight: { xs: "40px", sm: "44px", md: "48px" },
          padding: { xs: "8px 12px", sm: "10px 16px", md: "12px 20px" },
          position: "relative",
          zIndex: 2,
          "&.Mui-selected": {
            color: `${textColor}`,
          },
        },
        "& .MuiTabs-indicator": {
          backgroundColor: "rgba(0, 122, 255, 0.8)",
          height: { xs: "2px", sm: "2.5px", md: "3px" },
          borderRadius: { xs: "1px", sm: "1.5px", md: "2px" },
        },
      },
      "& .MuiTextField-root": {
        position: "relative",
        zIndex: 2,
        "& .MuiInputBase-root": {
          backgroundColor: `rgba(255, 255, 255, ${glassOpacity})`,
          backdropFilter: `blur(${blurIntensity}px) saturate(150%) brightness(1.02)`,
          WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(150%) brightness(1.02)`,
          borderRadius: {
            xs: "12px",
            sm: "14px",
            md: "16px",
          },
          border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.3)})`,
          color: `${textColor}`,
          fontSize: { xs: "14px", sm: "15px", md: "16px" },
          boxShadow: `0 4px 12px rgba(0, 0, 0, 0.05), 0 1px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.3)}) inset`,
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          isolation: "isolate",
          position: "relative",
          zIndex: 2,
          "&:hover": {
            backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.05, 0.25)})`,
            backdropFilter: `blur(${blurIntensity + 5}px) saturate(170%) brightness(1.05)`,
            WebkitBackdropFilter: `blur(${blurIntensity + 5}px) saturate(170%) brightness(1.05)`,
            borderColor: `rgba(255, 255, 255, ${Math.min(glassOpacity * 3, 0.4)})`,
          },
          "&.Mui-focused": {
            backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.05, 0.25)})`,
            backdropFilter: `blur(${blurIntensity + 10}px) saturate(180%) brightness(1.08)`,
            WebkitBackdropFilter: `blur(${blurIntensity + 10}px) saturate(180%) brightness(1.08)`,
            borderColor: "rgba(0, 122, 255, 0.4)",
            boxShadow: `0 6px 16px rgba(0, 122, 255, 0.1), 0 2px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 3, 0.4)}) inset`,
            transform: "scale(1.02)",
          },
        },
        "& .MuiInputLabel-root": {
          color: `${textColor.replace("0.95", "0.8")}`,
          textShadow: textColor.includes("255, 255, 255")
            ? "0 1px 2px rgba(0, 0, 0, 0.3)"
            : "0 1px 2px rgba(255, 255, 255, 0.3)",
          position: "relative",
          zIndex: 2,
        },
      },
      "& .MuiButton-root": {
        backgroundColor: "rgba(0, 122, 255, 0.75)",
        backdropFilter: `blur(${blurIntensity}px) saturate(150%)`,
        WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(150%)`,
        borderRadius: "16px",
        color: "white",
        fontWeight: "600",
        textTransform: "none",
        boxShadow: `
          0 4px 16px rgba(0, 122, 255, 0.25),
          0 1px 0 rgba(255, 255, 255, 0.2) inset
        `,
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        zIndex: 2,
        isolation: "isolate",
        "&:hover": {
          backgroundColor: "rgba(0, 122, 255, 0.85)",
          backdropFilter: `blur(${blurIntensity + 5}px) saturate(170%)`,
          WebkitBackdropFilter: `blur(${blurIntensity + 5}px) saturate(170%)`,
          transform: "translateY(-2px) scale(1.02)",
          boxShadow: `
            0 8px 24px rgba(0, 122, 255, 0.35),
            0 2px 0 rgba(255, 255, 255, 0.3) inset
          `,
        },
        "&:active": {
          transform: "translateY(-1px) scale(0.98)",
        },
        "&:disabled": {
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          backdropFilter: `blur(${Math.max(blurIntensity - 10, 5)}px)`,
          WebkitBackdropFilter: `blur(${Math.max(blurIntensity - 10, 5)}px)`,
          color: 'text.disabled',
          boxShadow: "none",
        },
      },
      "& .MuiDivider-root": {
        backgroundColor: "rgba(255, 255, 255, 0.3)",
      },
    };

    const tradingGraphStyles = {
      ...glassmorphismBase,
      overflow: "hidden",
      borderRadius: {
        xs: "12px",
        sm: "16px",
        md: "20px",
      },
      minHeight: { xs: "280px", sm: "350px", md: "500px" },
      backdropFilter: `blur(${blurIntensity}px) saturate(180%) brightness(1.05)`,
      WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(180%) brightness(1.05)`,
      margin: { xs: "4px", sm: "8px", md: "0" },
      "& .MuiCard-root": {
        backgroundColor: "transparent",
        boxShadow: "none",
        borderRadius: "20px",
      },
      "& .MuiCardContent-root": {
        padding: {
          xs: "12px",
          sm: "16px",
          md: "20px",
        },
        backgroundColor: "transparent",
        position: "relative",
        zIndex: 2,
        borderRadius: { xs: "12px", sm: "14px", md: "16px" },
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      },
      "& .MuiFormControlLabel-root": {
        position: "relative",
        zIndex: 2,
        "& .MuiTypography-root": {
          color: `${textColor.replace("0.95", "0.9")}`,
          fontWeight: "500",
          textShadow: textColor.includes("255, 255, 255")
            ? "0 1px 2px rgba(0, 0, 0, 0.3)"
            : "0 1px 2px rgba(255, 255, 255, 0.3)",
          position: "relative",
          zIndex: 2,
        },
        "& .MuiCheckbox-root": {
          color: 'primary.main',
          filter: "drop-shadow(0 2px 4px rgba(0, 122, 255, 0.2))",
          transition: "all 0.2s ease-in-out",
          position: "relative",
          zIndex: 2,
          "&:hover": {
            filter: "drop-shadow(0 4px 8px rgba(0, 122, 255, 0.3))",
          },
        },
      },
      "& .MuiSelect-root": {
        backgroundColor: `rgba(255, 255, 255, ${glassOpacity})`,
        backdropFilter: `blur(${blurIntensity}px) saturate(150%) brightness(1.02)`,
        WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(150%) brightness(1.02)`,
        borderRadius: "16px",
        border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.3)})`,
        color: `${textColor}`,
        boxShadow: `0 4px 12px rgba(0, 0, 0, 0.05), 0 1px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 2, 0.3)}) inset`,
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        zIndex: 2,
        isolation: "isolate",
        "&:hover": {
          backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.05, 0.25)})`,
          backdropFilter: `blur(${blurIntensity + 5}px) saturate(170%) brightness(1.05)`,
          WebkitBackdropFilter: `blur(${blurIntensity + 5}px) saturate(170%) brightness(1.05)`,
          boxShadow: `0 6px 16px rgba(0, 0, 0, 0.08), 0 2px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 3, 0.4)}) inset`,
        },
      },
      "& iframe": {
        borderRadius: "16px",
        border: "1px solid rgba(255, 255, 255, 0.25)",
        backdropFilter: `blur(${Math.max(blurIntensity - 20, 5)}px)`,
        WebkitBackdropFilter: `blur(${Math.max(blurIntensity - 20, 5)}px)`,
        boxShadow:
          "0 4px 16px rgba(0, 0, 0, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset",
        transition: "all 0.3s ease-in-out",
        position: "relative",
        zIndex: 2,
        "&:hover": {
          transform: "scale(1.002)",
          boxShadow:
            "0 6px 20px rgba(0, 0, 0, 0.08), 0 2px 0 rgba(255, 255, 255, 0.15) inset",
          backdropFilter: `blur(${Math.max(blurIntensity - 15, 8)}px)`,
          WebkitBackdropFilter: `blur(${Math.max(blurIntensity - 15, 8)}px)`,
        },
      },
      "& canvas, & svg": {
        backdropFilter: `blur(${Math.max(blurIntensity - 25, 3)}px)`,
        WebkitBackdropFilter: `blur(${Math.max(blurIntensity - 25, 3)}px)`,
        borderRadius: "12px",
        filter: "drop-shadow(0 4px 12px rgba(0, 0, 0, 0.06)) saturate(110%)",
        transition: "filter 0.3s ease-in-out",
        position: "relative",
        zIndex: 2,
      },
      "& .recharts-surface": {
        filter: "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.04)) brightness(1.02)",
        position: "relative",
        zIndex: 2,
      },
    };

    const containerStyles = {
      background: getContainerBackground(),
      backgroundSize:
        glassSettings?.backgroundType === "image"
          ? glassSettings?.backgroundSize || "cover"
          : "auto",
      backgroundPosition:
        glassSettings?.backgroundType === "image"
          ? glassSettings?.backgroundPosition || "center"
          : "initial",
      backgroundRepeat:
        glassSettings?.backgroundType === "image"
          ? glassSettings?.backgroundRepeat || "no-repeat"
          : "initial",
      backgroundAttachment:
        glassSettings?.backgroundType === "image"
          ? glassSettings?.backgroundAttachment || "scroll"
          : "initial",
      minHeight: isMobile ? "auto" : "100vh",
      p: { xs: theme.spacing(1), sm: theme.spacing(2), md: theme.spacing(4) },
      position: "relative",
    };

    return (
      <Box sx={containerStyles}>
        <Container
          maxWidth={isMobile ? false : "lg"}
          disableGutters={isMobile}
          sx={{
            position: "relative",
            zIndex: 1,
            px: { xs: 0.5, sm: 1, md: 3 },
          }}
        >
          <Grid container spacing={{ xs: 1, sm: 2, md: 4 }}>
            {exchangeState.quoteToken && exchangeState.baseToken && (
              <Grid size={12}>
                <Box sx={pairInfoStyles} id="glass-pair-info-unique">
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
                    volume={selectedPool?.attributes.volume_usd?.h24}
                    priceChangeH24={
                      selectedPool?.attributes.price_change_percentage?.h24
                    }
                    lastPrice={selectedPool?.attributes.base_token_price_usd}
                  />
                </Box>
              </Grid>
            )}
            <Grid size={{ xs: 12, md: 5 }} order={{ xs: 1, md: 1 }}>
              <Box sx={tradeWidgetStyles}>
                <TradeWidget isActive={true} />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 7 }} order={{ xs: 2, md: 2 }}>
              <Box sx={tradingGraphStyles}>
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
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  };

  const renderContent = () => {
    const { variant, customVariantSettings, glassSettings } =
      exchangeState as any;

    switch (variant) {
      case "custom":
        return renderCustomVariant(customVariantSettings);
      case "glass":
        return renderGlassVariant(glassSettings);
      default:
        return renderDefaultVariant();
    }
  };

  const renderSelectPairDialog = () => {
    const { variant, customVariantSettings } =
      exchangeState as any;

    if (variant === "glass") {
      const glassmorphismDialogStyles = {
        "& .MuiDialog-paper": {
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(30px) saturate(200%) brightness(1.1)",
          border: "1px solid rgba(255, 255, 255, 0.25)",
          borderRadius: "24px",
          boxShadow: `
            0 20px 50px rgba(0, 0, 0, 0.1),
            0 2px 0 rgba(255, 255, 255, 0.4) inset,
            0 -2px 0 rgba(255, 255, 255, 0.2) inset
          `,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)",
            pointerEvents: "none",
            borderRadius: "inherit",
          },
          "@media (max-width: 600px)": {
            margin: "16px",
            height: "calc(100vh - 32px)",
            maxHeight: "calc(100vh - 32px)",
            borderRadius: "20px",
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            backdropFilter:
              "blur(30px) saturate(200%) brightness(1.1)",
            WebkitBackdropFilter:
              "blur(30px) saturate(200%) brightness(1.1)",
            border: "1px solid rgba(255, 255, 255, 0.25)",
            boxShadow: `
              0 20px 50px rgba(0, 0, 0, 0.1),
              0 2px 0 rgba(255, 255, 255, 0.4) inset,
              0 -2px 0 rgba(255, 255, 255, 0.2) inset
            `,
          },
        },
        "& .MuiDialogTitle-root": {
          backgroundColor: "transparent",
          color: 'text.primary',
          fontWeight: "600",
          textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)",
        },
        "& .MuiDialogContent-root": {
          backgroundColor: "transparent",
          color: 'text.primary',
          position: "relative",
          zIndex: 1,
        },
        "& .MuiDialogActions-root": {
          backgroundColor: "transparent",
          borderTop: "1px solid rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)",
        },
        "& .MuiChip-root": {
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(15px) saturate(150%)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          color: 'text.primary',
          borderRadius: "16px",
          fontWeight: "500",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            backdropFilter: "blur(20px) saturate(170%)",
            transform: "scale(1.02)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          },
          "&.MuiChip-colorPrimary": {
            backgroundColor: "rgba(0, 122, 255, 0.75)",
            backdropFilter: "blur(15px) saturate(160%)",
            color: "white",
            border: "1px solid rgba(0, 122, 255, 0.5)",
            boxShadow:
              "0 4px 16px rgba(0, 122, 255, 0.25), 0 1px 0 rgba(255, 255, 255, 0.2) inset",
            "&:hover": {
              backgroundColor: "rgba(0, 122, 255, 0.85)",
              transform: "scale(1.05)",
            },
          },
        },
        "& .MuiListItemButton-root": {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          margin: "4px 8px",
          borderRadius: "12px",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          color: 'text.primary',
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(15px) saturate(150%)",
            transform: "translateX(4px) scale(1.01)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          },
          "&.Mui-selected": {
            backgroundColor: "rgba(0, 122, 255, 0.2)",
            backdropFilter: "blur(15px) saturate(170%)",
            border: "1px solid rgba(0, 122, 255, 0.4)",
            color: 'primary.main',
            "&:hover": {
              backgroundColor: "rgba(0, 122, 255, 0.25)",
            },
          },
        },
        "& .MuiTextField-root": {
          "& .MuiInputBase-root": {
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(20px) saturate(160%) brightness(1.05)",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            color: 'text.primary',
            boxShadow:
              "0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 0 rgba(255, 255, 255, 0.2) inset",
            transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.25)",
              backdropFilter: "blur(25px) saturate(180%) brightness(1.08)",
              borderColor: "rgba(255, 255, 255, 0.4)",
            },
            "&.Mui-focused": {
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              backdropFilter: "blur(30px) saturate(200%) brightness(1.1)",
              borderColor: "rgba(0, 122, 255, 0.5)",
              boxShadow:
                "0 4px 12px rgba(0, 122, 255, 0.15), 0 2px 0 rgba(255, 255, 255, 0.3) inset",
            },
          },
          "& .MuiInputLabel-root": {
            color: 'text.secondary',
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
          },
        },
        "& .MuiButton-root": {
          borderRadius: "16px",
          textTransform: "none",
          fontWeight: "600",
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          "&.MuiButton-contained": {
            backgroundColor: "rgba(0, 122, 255, 0.8)",
            backdropFilter: "blur(15px) saturate(150%)",
            color: "white",
            border: "1px solid rgba(0, 122, 255, 0.5)",
            boxShadow: `
              0 4px 16px rgba(0, 122, 255, 0.25),
              0 1px 0 rgba(255, 255, 255, 0.2) inset
            `,
            "&:hover": {
              backgroundColor: "rgba(0, 122, 255, 0.9)",
              backdropFilter: "blur(20px) saturate(170%)",
              transform: "translateY(-1px) scale(1.02)",
              boxShadow: `
                0 6px 20px rgba(0, 122, 255, 0.35),
                0 2px 0 rgba(255, 255, 255, 0.3) inset
              `,
            },
          },
          "&.MuiButton-text": {
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(10px)",
            color: 'text.secondary',
            border: "1px solid rgba(255, 255, 255, 0.2)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.25)",
              backdropFilter: "blur(15px) saturate(150%)",
              transform: "scale(1.02)",
            },
          },
        },
        '& .MuiBox-root[style*="position: sticky"]': {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter:
            "blur(25px) saturate(200%) brightness(1.08)",
          WebkitBackdropFilter:
            "blur(25px) saturate(200%) brightness(1.08)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.25)",
          boxShadow:
            "0 4px 12px rgba(0, 0, 0, 0.05), 0 1px 0 rgba(255, 255, 255, 0.2) inset",
        },
        '& .MuiBox-root[style*="z-index"]': {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter:
            "blur(25px) saturate(200%) brightness(1.08)",
          WebkitBackdropFilter:
            "blur(25px) saturate(200%) brightness(1.08)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.25)",
          boxShadow:
            "0 4px 12px rgba(0, 0, 0, 0.05), 0 1px 0 rgba(255, 255, 255, 0.2) inset",
        },
        "@media (max-width: 600px)": {
          "& .MuiDialog-paper .MuiBox-root": {
            '&[style*="position: sticky"], &[style*="z-index"], &[style*="background-color"]':
            {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              backdropFilter:
                "blur(25px) saturate(200%) brightness(1.08)",
              WebkitBackdropFilter:
                "blur(25px) saturate(200%) brightness(1.08)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.25)",
              boxShadow:
                "0 4px 12px rgba(0, 0, 0, 0.05), 0 1px 0 rgba(255, 255, 255, 0.2) inset",
            },
          },
        },
      };

      return (
        open && (
          <SelectPairDialog
            DialogProps={{
              open,
              maxWidth: "sm",
              fullWidth: true,
              onClose: handleClose,
              sx: glassmorphismDialogStyles,
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
                "& .MuiDialog-paper": {
                  ...(pairInfoBackgroundColor && {
                    backgroundColor: pairInfoBackgroundColor,
                    color: getContrastColor(pairInfoBackgroundColor),
                  }),
                  ...(pairInfoBorderColor && {
                    border: `2px solid ${pairInfoBorderColor}`,
                  }),
                  ...(borderRadius && {
                    borderRadius: `${borderRadius}px`,
                  }),
                  "@media (max-width: 600px)": {
                    margin: "8px",
                    height: "90vh",
                    maxHeight: "90vh",
                  },
                },
                "& .MuiDialogTitle-root": {
                  ...(pairInfoBackgroundColor && {
                    backgroundColor: pairInfoBackgroundColor,
                    color: getContrastColor(pairInfoBackgroundColor),
                  }),
                },
                "& .MuiDialogContent-root": {
                  ...(pairInfoBackgroundColor && {
                    backgroundColor: pairInfoBackgroundColor,
                    color: getContrastColor(pairInfoBackgroundColor),
                  }),
                },
                "& .MuiDialogActions-root": {
                  ...(pairInfoBackgroundColor && {
                    backgroundColor: pairInfoBackgroundColor,
                    color: getContrastColor(pairInfoBackgroundColor),
                  }),
                },
                "& .MuiChip-root": {
                  ...(pairInfoBackgroundColor && {
                    backgroundColor: "transparent",
                    color: getContrastColor(pairInfoBackgroundColor),
                    border: `1px solid ${pairInfoBorderColor || getContrastColor(pairInfoBackgroundColor)}`,
                  }),
                  "&.MuiChip-colorPrimary": {
                    ...(pairInfoBorderColor && {
                      backgroundColor: `${pairInfoBorderColor}`,
                      color: `${getContrastColor(pairInfoBorderColor)}`,
                      border: `1px solid ${pairInfoBorderColor}`,
                    }),
                  },
                },
                "& .MuiListItemButton-root": {
                  ...(pairInfoBackgroundColor && {
                    color: getContrastColor(pairInfoBackgroundColor),
                  }),
                  "&:hover": {
                    ...(pairInfoBackgroundColor && {
                      backgroundColor: `${getContrastColor(pairInfoBackgroundColor)}10`,
                    }),
                  },
                  "&.Mui-selected": {
                    ...(pairInfoBorderColor && {
                      backgroundColor: `${pairInfoBorderColor}20`,
                    }),
                  },
                },
                "& .MuiTextField-root": {
                  "& .MuiInputBase-root": {
                    ...(pairInfoBackgroundColor && {
                      backgroundColor: `${getContrastColor(pairInfoBackgroundColor)}10`,
                      color: getContrastColor(pairInfoBackgroundColor),
                    }),
                    ...(pairInfoBorderColor && {
                      borderColor: pairInfoBorderColor,
                    }),
                  },
                  "& .MuiInputLabel-root": {
                    ...(pairInfoBackgroundColor && {
                      color: `${getContrastColor(pairInfoBackgroundColor)}80`,
                    }),
                  },
                },
                "& .MuiButton-root": {
                  ...(pairInfoBackgroundColor && {
                    color: getContrastColor(pairInfoBackgroundColor),
                  }),
                  "&.MuiButton-contained": {
                    ...(pairInfoBorderColor && {
                      backgroundColor: `${pairInfoBorderColor}`,
                      color: `${getContrastColor(pairInfoBorderColor)}`,
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
              "& .MuiDialog-paper": {
                "@media (max-width: 600px)": {
                  margin: "8px",
                  height: "90vh",
                  maxHeight: "90vh",
                  borderRadius: "16px",
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