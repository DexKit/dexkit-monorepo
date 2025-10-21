import { useIsMobile } from "@dexkit/core/hooks";
import ExpandMore from "@mui/icons-material/ExpandMore";
import LockIcon from "@mui/icons-material/Lock";
import Search from "@mui/icons-material/Search";

import {
  Avatar,
  Button,
  ButtonBase,
  Chip,
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  Grid,
  InputAdornment,
  ListSubheader,
  Paper,
  Stack,
  Tooltip,
  useMediaQuery,
  useTheme
} from "@mui/material";
import type { providers } from "ethers";
import { FormattedMessage, useIntl } from "react-intl";

import { TOKEN_ICON_URL } from "@dexkit/core/constants";
import { NETWORKS } from "@dexkit/core/constants/networks";
import { Token } from "@dexkit/core/types";
import { AppDialogTitle } from "@dexkit/ui/components/AppDialogTitle";
import LazyTextField from "@dexkit/ui/components/LazyTextField";
import TokenIcon from "@mui/icons-material/Token";
import { useMultiTokenBalance } from "../../../hooks";
import { useSelectImport } from "../hooks";
import SelectCoinListGlass from "./SelectCoinListGlass";

export interface SwapSelectCoinGlassDialogProps {
  DialogProps: DialogProps;
  onQueryChange: (value: string) => void;
  onSelect: (token: Token, isExtern?: boolean) => void;
  onClearRecentTokens: () => void;
  tokens: Token[];
  chainId?: number;
  isLoadingSearch: boolean;
  recentTokens?: Token[];
  account?: string;
  provider?: providers.BaseProvider;
  featuredTokens?: Token[];
  enableImportExterTokens?: boolean;
  filteredChainIds?: number[];
  onToggleChangeNetwork?: () => void;
  onChangeNetwork?: (chainId: number) => void;
  isProviderReady?: boolean;
  disableNetworkChange?: boolean;
  disableNetworkSelector?: boolean;
  blurIntensity?: number;
  glassOpacity?: number;
  disableBackground?: boolean;
  textColor?: string;
  backgroundType?: "solid" | "gradient" | "image";
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: "cover" | "contain" | "auto" | "100% 100%";
  backgroundPosition?: string;
  gradientStartColor?: string;
  gradientEndColor?: string;
  gradientDirection?: string;
}

export default function SwapSelectCoinGlassDialog({
  DialogProps,
  tokens,
  chainId,
  featuredTokens,
  recentTokens,
  account,
  provider,
  isLoadingSearch,
  onSelect,
  onQueryChange,
  onClearRecentTokens,
  enableImportExterTokens,
  filteredChainIds,
  onToggleChangeNetwork,
  onChangeNetwork,
  isProviderReady,
  disableNetworkChange = false,
  disableNetworkSelector = false,
  blurIntensity = 30,
  glassOpacity = 0.10,
  disableBackground = false,
  textColor,
  backgroundType,
  backgroundColor,
  backgroundImage,
  backgroundSize,
  backgroundPosition,
  gradientStartColor,
  gradientEndColor,
  gradientDirection,
}: SwapSelectCoinGlassDialogProps) {
  const { onClose } = DialogProps;
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const isMobile = useIsMobile();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

  const finalTextColor = textColor || theme.palette.text.primary;

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  const {
    fetchTokenData,
    handleChangeQuery,
    handleSelect,
    importedTokens,
    isOnList,
  } = useSelectImport({
    chainId,
    onQueryChange,
    onSelect,
    tokens,
    enableImportExterTokens,
  });

  const tokenBalances = useMultiTokenBalance({
    tokens: [...importedTokens.tokens, ...tokens],
    account,
    provider,
  });

  const getBackgroundStyles = () => {
    return {
      background: 'transparent',
    };
  };

  return (
    <Dialog
      {...DialogProps}
      fullScreen={isMobile}
      maxWidth="md"
      fullWidth
      BackdropProps={{
        sx: {
          backdropFilter: 'blur(8px) saturate(120%)',
          WebkitBackdropFilter: 'blur(8px) saturate(120%)',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
        },
      }}
      PaperProps={{
        sx: {
          background: 'transparent',
          backdropFilter: `blur(${blurIntensity}px) saturate(180%) brightness(1.1)`,
          WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(180%) brightness(1.1)`,
          border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.3)})`,
          boxShadow: `${theme.shadows[16]}, 0 2px 0 rgba(255, 255, 255, ${Math.min(glassOpacity * 1.5, 0.2)}) inset`,
          borderRadius: theme.shape.borderRadius,
          ...(isMobile && {
            height: '95vh',
            margin: theme.spacing(1),
          }),
          ...(!isMobile && {
            maxHeight: '80vh',
            minWidth: {
              sm: theme.spacing(60),
              md: theme.spacing(70),
              lg: theme.spacing(80),
            },
          }),
        },
      }}
    >
      <AppDialogTitle
        title={
          <FormattedMessage id="select.token" defaultMessage="Select token" />
        }
        onClose={handleClose}
        sx={{
          px: {
            xs: theme.spacing(2),
            sm: theme.spacing(3),
            md: theme.spacing(4),
          },
          py: {
            xs: theme.spacing(1.5),
            sm: theme.spacing(2),
          },
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px) saturate(150%)',
          WebkitBackdropFilter: 'blur(20px) saturate(150%)',
          borderBottom: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.25)})`,
          color: finalTextColor,
          '& .MuiTypography-root': {
            color: finalTextColor,
            fontWeight: theme.typography.fontWeightBold,
            fontSize: {
              xs: theme.typography.h6.fontSize,
              sm: theme.typography.h5.fontSize,
            },
            textShadow: finalTextColor.includes('255, 255, 255')
              ? '0 1px 3px rgba(0, 0, 0, 0.4)'
              : '0 1px 3px rgba(255, 255, 255, 0.4)',
          },
          '& .MuiIconButton-root': {
            color: finalTextColor,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: `1px solid rgba(255, 255, 255, 0.2)`,
            borderRadius: theme.shape.borderRadius,
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.2)',
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
          },
        }}
      />
      <Divider sx={{ borderColor: `rgba(255, 255, 255, ${Math.min(glassOpacity, 0.15)})` }} />

      {isProviderReady && chainId && filteredChainIds && filteredChainIds.length > 1 && (
        <>
          <Paper
            elevation={0}
            sx={{
              p: {
                xs: theme.spacing(1.5),
                sm: theme.spacing(2),
              },
              background: disableBackground
                ? `rgba(128, 128, 128, ${Math.min(glassOpacity * 0.6, 0.06)})`
                : 'rgba(128, 128, 128, 0.09)',
              backdropFilter: 'blur(20px) saturate(140%)',
              WebkitBackdropFilter: 'blur(20px) saturate(140%)',
              borderBottom: `1px solid rgba(255, 255, 255, ${glassOpacity * 0.5})`,
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
              {isMobile ? (
                <Tooltip
                  title={disableNetworkChange || disableNetworkSelector ? <FormattedMessage id="locked.network" defaultMessage="Locked network" /> : ""}
                  arrow
                  disableHoverListener={!(disableNetworkChange || disableNetworkSelector)}
                  disableFocusListener={!(disableNetworkChange || disableNetworkSelector)}
                >
                  <span>
                    <ButtonBase
                      onClick={disableNetworkChange || disableNetworkSelector ? undefined : onToggleChangeNetwork}
                      disabled={disableNetworkChange || disableNetworkSelector}
                      tabIndex={disableNetworkChange || disableNetworkSelector ? -1 : undefined}
                      aria-disabled={disableNetworkChange || disableNetworkSelector}
                      sx={{
                        color: finalTextColor,
                        borderRadius: (theme.shape.borderRadius as any) / 2,
                        border: `1px solid ${theme.palette.divider}`,
                        background: theme.palette.mode === 'dark'
                          ? `rgba(255, 255, 255, ${glassOpacity * 0.1})`
                          : `rgba(255, 255, 255, ${glassOpacity * 0.3})`,
                        backdropFilter: `blur(${blurIntensity * 0.4}px)`,
                        WebkitBackdropFilter: `blur(${blurIntensity * 0.4}px)`,
                        px: theme.spacing(1.5),
                        py: theme.spacing(1),
                        opacity: disableNetworkChange || disableNetworkSelector ? 0.5 : 1,
                        pointerEvents: disableNetworkChange || disableNetworkSelector ? 'none' : undefined,
                        cursor: disableNetworkChange || disableNetworkSelector ? 'not-allowed' : 'pointer',
                        '&:hover': {
                          background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.4)})`,
                          borderColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.5)})`,
                        },
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        {NETWORKS[chainId] && (
                          <Avatar
                            sx={{ width: "1rem", height: "1rem" }}
                            src={NETWORKS[chainId].imageUrl}
                          />
                        )}
                        <ExpandMore />
                        {(disableNetworkChange || disableNetworkSelector) && (
                          <LockIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                        )}
                      </Stack>
                    </ButtonBase>
                  </span>
                </Tooltip>
              ) : (
                <Tooltip
                  title={disableNetworkChange || disableNetworkSelector ? <FormattedMessage id="locked.network" defaultMessage="Locked network" /> : ""}
                  arrow
                  disableHoverListener={!(disableNetworkChange || disableNetworkSelector)}
                  disableFocusListener={!(disableNetworkChange || disableNetworkSelector)}
                >
                  <span>
                    <Button
                      onClick={disableNetworkChange || disableNetworkSelector ? undefined : onToggleChangeNetwork}
                      disabled={disableNetworkChange || disableNetworkSelector}
                      tabIndex={disableNetworkChange || disableNetworkSelector ? -1 : undefined}
                      aria-disabled={disableNetworkChange || disableNetworkSelector}
                      startIcon={
                        NETWORKS[chainId] && (
                          <Avatar
                            sx={{ width: "1.5rem", height: "1.5rem" }}
                            src={NETWORKS[chainId].imageUrl}
                          />
                        )
                      }
                      endIcon={
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <ExpandMore />
                          {(disableNetworkChange || disableNetworkSelector) && (
                            <LockIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                          )}
                        </Stack>
                      }
                      variant="outlined"
                      size="small"
                      sx={{
                        color: finalTextColor,
                        borderColor: theme.palette.divider,
                        background: theme.palette.mode === 'dark'
                          ? `rgba(255, 255, 255, ${glassOpacity * 0.1})`
                          : `rgba(255, 255, 255, ${glassOpacity * 0.3})`,
                        backdropFilter: `blur(${blurIntensity * 0.4}px)`,
                        WebkitBackdropFilter: `blur(${blurIntensity * 0.4}px)`,
                        px: theme.spacing(2),
                        py: theme.spacing(0.5),
                        opacity: disableNetworkChange || disableNetworkSelector ? 0.5 : 1,
                        pointerEvents: disableNetworkChange || disableNetworkSelector ? 'none' : undefined,
                        cursor: disableNetworkChange || disableNetworkSelector ? 'not-allowed' : 'pointer',
                        '&:hover': {
                          background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.4)})`,
                          borderColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.5)})`,
                        },
                      }}
                    >
                      {NETWORKS[chainId] ? NETWORKS[chainId].name : ""}
                    </Button>
                  </span>
                </Tooltip>
              )}
            </Stack>
          </Paper>
          <Divider sx={{ borderColor: `rgba(255, 255, 255, ${Math.min(glassOpacity, 0.15)})` }} />
        </>
      )}

      <Paper
        elevation={0}
        sx={{
          p: {
            xs: theme.spacing(2),
            sm: theme.spacing(3),
            md: theme.spacing(4),
          },
          background: disableBackground
            ? `rgba(128, 128, 128, ${Math.min(glassOpacity * 0.6, 0.06)})`
            : 'rgba(128, 128, 128, 0.09)',
          backdropFilter: 'blur(25px) saturate(150%)',
          WebkitBackdropFilter: 'blur(25px) saturate(150%)',
          borderBottom: `1px solid rgba(255, 255, 255, ${glassOpacity * 0.8})`,
          ...(isMobile && {
            position: 'sticky',
            top: 0,
            zIndex: theme.zIndex.modal + 1,
            boxShadow: disableBackground
              ? `0 ${theme.spacing(0.25)} ${theme.spacing(1)} rgba(0, 0, 0, 0.03)`
              : theme.shadows[2],
          }),
        }}
      >
        <Grid container spacing={3}>
          <Grid size={12}>
            <LazyTextField
              value=""
              onChange={handleChangeQuery}
              TextFieldProps={{
                placeholder: formatMessage({
                  id: "search.for.a.coin.by.name.symbol.and.address",
                  defaultMessage: "Search for a coin by name, symbol and address",
                }),
                fullWidth: true,
                size: isSmallScreen ? "small" : "medium",
                InputProps: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search
                        sx={{
                          color: finalTextColor,
                          opacity: 0.8,
                          fontSize: {
                            xs: theme.spacing(2.5),
                            sm: theme.spacing(3),
                          },
                        }}
                      />
                    </InputAdornment>
                  ),
                },
                sx: {
                  '& .MuiInputBase-root': {
                    background: `rgba(255, 255, 255, ${glassOpacity * 0.3})`,
                    backdropFilter: `blur(${blurIntensity * 0.5}px)`,
                    WebkitBackdropFilter: `blur(${blurIntensity * 0.5}px)`,
                    border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.3)})`,
                    borderRadius: theme.shape.borderRadius,
                    fontSize: {
                      xs: theme.typography.body2.fontSize,
                      sm: theme.typography.body1.fontSize
                    },
                    color: finalTextColor,
                    '& input::placeholder': {
                      color: `${finalTextColor}B3`,
                      opacity: 1,
                    },
                    '& .MuiInputBase-input': {
                      color: finalTextColor,
                      padding: theme.spacing(1.5, 2),
                    },
                    '&:hover': {
                      background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.05, 0.35)})`,
                      borderColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.15, 0.4)})`,
                    },
                    '&.Mui-focused': {
                      background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.05, 0.35)})`,
                      borderColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.3, 0.6)})`,
                      boxShadow: `0 0 0 2px rgba(255, 255, 255, 0.2)`,
                    },
                  },
                },
              }}
            />
          </Grid>

          {featuredTokens && featuredTokens.length > 0 && (
            <Grid size={12}>
              <Grid container spacing={1}>
                {featuredTokens.map((token, index) => (
                  <Grid key={index} size="auto">
                    <Chip
                      label={token.symbol.toUpperCase()}
                      clickable
                      size={isSmallScreen ? "small" : "medium"}
                      icon={
                        <Avatar
                          sx={{
                            width: {
                              xs: theme.spacing(2),
                              sm: theme.spacing(2.5),
                            },
                            height: {
                              xs: theme.spacing(2),
                              sm: theme.spacing(2.5),
                            },
                          }}
                          src={
                            token.logoURI
                              ? token.logoURI
                              : TOKEN_ICON_URL(token.address, token.chainId)
                          }
                        >
                          <TokenIcon fontSize={isSmallScreen ? "small" : "medium"} />
                        </Avatar>
                      }
                      onClick={() => onSelect(token)}
                      sx={{
                        background: theme.palette.mode === 'dark'
                          ? `rgba(255, 255, 255, ${glassOpacity * 0.1})`
                          : `rgba(255, 255, 255, ${glassOpacity * 0.4})`,
                        backdropFilter: `blur(${blurIntensity * 0.3}px)`,
                        WebkitBackdropFilter: `blur(${blurIntensity * 0.3}px)`,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: theme.shape.borderRadius,
                        color: finalTextColor,
                        height: {
                          xs: theme.spacing(4),
                          sm: theme.spacing(4.5),
                        },
                        fontSize: {
                          xs: theme.typography.caption.fontSize,
                          sm: theme.typography.body2.fontSize,
                        },
                        px: {
                          xs: theme.spacing(1),
                          sm: theme.spacing(1.5),
                        },
                        transition: theme.transitions.create(['background-color', 'border-color', 'transform'], {
                          duration: theme.transitions.duration.short,
                        }),
                        '& .MuiChip-label': {
                          color: finalTextColor,
                          fontWeight: theme.typography.fontWeightMedium,
                        },
                        '&:hover': {
                          background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.6)})`,
                          borderColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.3, 0.7)})`,
                          transform: 'scale(1.05)',
                          boxShadow: theme.shadows[4],
                          '& .MuiChip-label': {
                            color: finalTextColor,
                          },
                        },
                        '&.MuiChip-colorPrimary': {
                          background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.3, 0.7)})`,
                          borderColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.4, 0.8)})`,
                          '& .MuiChip-label': {
                            color: finalTextColor,
                            fontWeight: theme.typography.fontWeightBold,
                          },
                        },
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}
        </Grid>
      </Paper>

      <DialogContent
        sx={{
          p: 0,
          background: 'transparent',
          '&.MuiDialogContent-root': {
            paddingTop: 0,
            background: 'transparent',
          },
        }}
        dividers={false}
      >
        <Stack>
          {recentTokens && recentTokens?.length > 0 && (
            <>
              <SelectCoinListGlass
                subHeader={
                  <Paper
                    elevation={0}
                    sx={{
                      px: {
                        xs: theme.spacing(2),
                        sm: theme.spacing(3),
                      },
                      py: theme.spacing(2),
                      background: 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(15px) saturate(150%)',
                      WebkitBackdropFilter: 'blur(15px) saturate(150%)',
                      borderBottom: `1px solid rgba(255, 255, 255, ${glassOpacity * 0.3})`,
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                    }}
                  >
                    <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
                      <Grid size="auto">
                        <ListSubheader
                          sx={{
                            p: 0,
                            m: 0,
                            color: finalTextColor,
                            backgroundColor: 'transparent',
                            fontSize: {
                              xs: theme.typography.body2.fontSize,
                              sm: theme.typography.subtitle2.fontSize,
                            },
                            fontWeight: theme.typography.fontWeightBold,
                            textShadow: finalTextColor.includes('255, 255, 255')
                              ? '0 1px 2px rgba(0, 0, 0, 0.3)'
                              : '0 1px 2px rgba(255, 255, 255, 0.3)',
                          }}
                          component="div"
                          disableSticky
                        >
                          <FormattedMessage id="recent" defaultMessage="Recent" />
                        </ListSubheader>
                      </Grid>

                      <Grid size="auto">
                        <Button
                          onClick={onClearRecentTokens}
                          size="small"
                          sx={{
                            color: finalTextColor,
                            opacity: 0.8,
                            fontSize: {
                              xs: theme.typography.body2.fontSize,
                              sm: theme.typography.body1.fontSize
                            },
                            fontWeight: theme.typography.fontWeightMedium,
                            background: `rgba(255, 255, 255, ${glassOpacity * 0.3})`,
                            backdropFilter: `blur(${blurIntensity * 0.3}px)`,
                            WebkitBackdropFilter: `blur(${blurIntensity * 0.3}px)`,
                            border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.3)})`,
                            borderRadius: theme.shape.borderRadius,
                            minWidth: theme.spacing(8),
                            px: theme.spacing(2),
                            py: theme.spacing(0.75),
                            '&:hover': {
                              background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.4)})`,
                              opacity: 1,
                              transform: 'scale(1.02)',
                            },
                            transition: theme.transitions.create(['background-color', 'opacity', 'transform'], {
                              duration: theme.transitions.duration.short,
                            }),
                          }}
                        >
                          <FormattedMessage id="clear" defaultMessage="Clear" />
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                }
                tokens={recentTokens}
                tokenBalances={tokenBalances.data}
                onSelect={handleSelect}
                isLoading={account ? tokenBalances.isLoading : false}
                showDash={!account}
                blurIntensity={blurIntensity}
                glassOpacity={glassOpacity}
                disableBackground={true}
                textColor={finalTextColor}
                backgroundType={backgroundType}
                backgroundColor={backgroundColor}
                backgroundImage={backgroundImage}
                backgroundSize={backgroundSize}
                backgroundPosition={backgroundPosition}
                gradientStartColor={gradientStartColor}
                gradientEndColor={gradientEndColor}
                gradientDirection={gradientDirection}
              />
              <Divider sx={{ borderColor: `rgba(255, 255, 255, ${Math.min(glassOpacity, 0.1)})` }} />
            </>
          )}
          <SelectCoinListGlass
            tokens={[...importedTokens.tokens, ...tokens]}
            onSelect={handleSelect}
            externToken={
              !isOnList && fetchTokenData.data ? fetchTokenData.data : undefined
            }
            tokenBalances={tokenBalances.data}
            showDash={!account}
            isLoading={
              account
                ? tokenBalances.isLoading ||
                fetchTokenData.isLoading ||
                isLoadingSearch
                : false
            }
            blurIntensity={blurIntensity}
            glassOpacity={glassOpacity}
            disableBackground={true}
            textColor={finalTextColor}
            backgroundType={backgroundType}
            backgroundColor={backgroundColor}
            backgroundImage={backgroundImage}
            backgroundSize={backgroundSize}
            backgroundPosition={backgroundPosition}
            gradientStartColor={gradientStartColor}
            gradientEndColor={gradientEndColor}
            gradientDirection={gradientDirection}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
} 