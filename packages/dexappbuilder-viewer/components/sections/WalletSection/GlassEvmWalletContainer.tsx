import { QrCodeScanner, Search } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  NoSsr,
  Pagination,
  Skeleton,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import Grid from "@mui/material/Grid";

import React, { Suspense, useCallback, useEffect, useMemo, useState } from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FormattedMessage, useIntl } from "react-intl";


import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { useAtom } from "jotai";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { copyToClipboard, truncateAddress } from "@dexkit/core/utils";
import CopyIconButton from "@dexkit/ui/components/CopyIconButton";
import FileCopy from "@mui/icons-material/FileCopy";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import dynamic from "next/dynamic";

const TransakWidget = dynamic(() => import("@dexkit/ui/components/Transak"));
const GlassImportAssetDialog = dynamic(() => import("./GlassImportAssetDialog"));

import { useIsMobile } from "@dexkit/core";
import { NETWORKS } from "@dexkit/core/constants/networks";
import { DexkitApiProvider } from "@dexkit/core/providers";
import { Asset } from "@dexkit/core/types/nft";
import { convertTokenToEvmCoin } from "@dexkit/core/utils";
import {
  getChainLogoImage,
  getChainName,
  getNetworkSlugFromChainId
} from "@dexkit/core/utils/blockchain";
import { AppErrorBoundary } from "@dexkit/ui/components/AppErrorBoundary";
import Link from "@dexkit/ui/components/AppLink";
import { ConnectButton } from "@dexkit/ui/components/ConnectButton";
import FavoriteAssetsSection from "@dexkit/ui/components/FavoriteAssetsSection";
import CloseCircle from "@dexkit/ui/components/icons/CloseCircle";
import Funnel from "@dexkit/ui/components/icons/Filter";
import LoginAppButton from "@dexkit/ui/components/LoginAppButton";
import { myAppsApi } from "@dexkit/ui/constants/api";
import { useAppConfig, useAuth, useEvmCoins } from "@dexkit/ui/hooks";
import { useActiveChainIds } from "@dexkit/ui/hooks/blockchain";
import { useCurrency } from "@dexkit/ui/hooks/currency";
import { useSimpleCoinPricesQuery } from "@dexkit/ui/hooks/currency/useSimpleCoinPricesCurrency";
import { useForceThemeMode } from "@dexkit/ui/hooks/theme/useForceThemeMode";
import { useWalletConnect } from "@dexkit/ui/hooks/wallet";
import { AssetMedia } from "@dexkit/ui/modules/nft/components/AssetMedia";
import { useAccountAssetsBalance, useHiddenAssets } from "@dexkit/ui/modules/nft/hooks";
import { truncateErc1155TokenId } from "@dexkit/ui/modules/nft/utils";
import {
  TransactionsTable,
  TransactionsTableFilter,
} from "@dexkit/ui/modules/wallet/components/TransactionsTable";
import UserActivityTable from "@dexkit/ui/modules/wallet/components/UserActivityTable";
import WalletTableRow from "@dexkit/ui/modules/wallet/components/WalletTableRow";
import { WalletTotalBalanceCointainer } from "@dexkit/ui/modules/wallet/components/WalletTotalBalanceContainer";
import { useERC20BalancesQuery } from "@dexkit/ui/modules/wallet/hooks";
import { isBalancesVisibleAtom } from "@dexkit/ui/modules/wallet/state";
import { TokenBalance } from '@dexkit/ui/modules/wallet/types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FilterListIcon from "@mui/icons-material/FilterList";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Send from "@mui/icons-material/Send";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Select,
} from "@mui/material";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { useRouter } from "next/router";
import GlassEvmReceiveDialog from "./GlassEvmReceiveDialog";
import GlassEvmSendDialog from "./GlassEvmSendDialog";
import GlassExchangeContainer from './GlassExchangeContainer';
import GlassImportTokenDialog from "./GlassImportTokenDialog";
import { GlassNetworkSelectButton } from "./GlassNetworkSelectButton";
import GlassNFTSkeleton from "./GlassNFTSkeleton";
import GlassScanWalletQrCodeDialog from "./GlassScanWalletQrCodeDialog";
import GlassTradeContainer from './GlassTradeContainer';

const EvmTransferCoinDialog = dynamic(
  () => import("@dexkit/ui/modules/evm-transfer-coin/components/dialogs/EvmSendDialog")
);

enum WalletTabs {
  Transactions,
  Trades,
  Activity,
}

enum AssetTabs {
  Tokens,
  NFTs,
}

enum NFTTabs {
  Collected,
  Favorites,
  Hidden,
}

interface Props {
  blurIntensity?: number;
  glassOpacity?: number;
  textColor?: string;
  hideNFTs?: boolean;
  hideActivity?: boolean;
  hideSwapAction?: boolean;
  hideExchangeAction?: boolean;
  hideSendAction?: boolean;
  customSettings?: any;
  onClickTradeCoin?: (tokenBalance: any) => void;
  onClickExchangeCoin?: (tokenBalance: any) => void;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  backgroundType?: string;
  gradientStartColor?: string;
  gradientEndColor?: string;
  gradientDirection?: string;
  swapVariant?: import('@dexkit/ui/modules/wizard/types').SwapVariant;
  networkModalTextColor?: string;
  receiveModalTextColor?: string;
  sendModalTextColor?: string;
  scanModalTextColor?: string;
  importTokenModalTextColor?: string;
}

const GlassAssetCard = ({ asset, showControls, onHide, isHidden, onTransfer, blurIntensity = 40, glassOpacity = 0.10, textColor = '#ffffff', customSettings }: any) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const assetDetails = (
    <>
      {asset ? (
        <AssetMedia asset={asset} />
      ) : (
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            paddingTop: { xs: "60%", sm: "100%" },
          }}
        >
          <Skeleton
            variant="rectangular"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              display: "block",
              width: "100%",
              height: "100%",
              borderRadius: "inherit"
            }}
          />
        </Box>
      )}
      <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
        <Typography
          variant="caption"
          style={{ color: customSettings?.nftColors?.collectionColor || textColor }}
          sx={{
            color: `${customSettings?.nftColors?.collectionColor || textColor} !important`,
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            lineHeight: 1.2,
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            mb: 0.5
          }}
        >
          {asset === undefined ? <Skeleton width="80%" /> : asset?.collectionName}
        </Typography>
        <Typography
          variant="body2"
          style={{ fontWeight: 600, color: customSettings?.nftColors?.titleColor || textColor }}
          sx={{
            fontWeight: 600,
            color: `${customSettings?.nftColors?.titleColor || textColor} !important`,
            fontSize: { xs: '0.875rem', sm: '1rem' },
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {asset === undefined ? (
            <Skeleton width="90%" />
          ) : asset?.metadata?.name ? (
            asset?.metadata?.name
          ) : (
            `${asset?.collectionName} #${truncateErc1155TokenId(asset?.id)}`
          )}
        </Typography>
      </CardContent>
    </>
  );

  return (
    <Box sx={{ position: 'relative' }}>
      <Card
        sx={{
          position: "relative",
          height: "100%",
          borderRadius: "16px",
          background: customSettings?.nftColors?.cardBackgroundColor || `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.05, 0.25)})`,
          backdropFilter: `blur(${Math.min(blurIntensity - 10, 30)}px)`,
          border: `1px solid ${customSettings?.nftColors?.cardBorderColor || `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.15, 0.35)})`}`,
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            inset 0 -1px 0 rgba(0, 0, 0, 0.1)
          `,
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px) scale(1.02)',
            boxShadow: `
              0 12px 40px rgba(0, 0, 0, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.3),
              inset 0 -1px 0 rgba(0, 0, 0, 0.1)
            `,
          }
        }}
      >
        <CardActionArea
          LinkComponent={Link}
          href={`/asset/${getNetworkSlugFromChainId(asset?.chainId)}/${asset?.contractAddress}/${asset?.id}`}
          sx={{ height: '100%' }}
        >
          {assetDetails}
        </CardActionArea>

        {showControls && (
          <IconButton
            aria-controls={open ? "asset-menu-action" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            sx={(theme) => ({
              top: theme.spacing(1),
              right: theme.spacing(1),
              position: "absolute",
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(8px)',
              boxShadow: theme.shadows[2],
              zIndex: 2,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
              }
            })}
            onClick={handleClick}
          >
            <MoreVertIcon />
          </IconButton>
        )}

        {asset?.chainId && (
          <Tooltip title={getChainName(asset.chainId) || ""}>
            <Avatar
              src={getChainLogoImage(asset.chainId)}
              sx={(theme) => ({
                top: theme.spacing(1),
                left: theme.spacing(1),
                position: "absolute",
                width: theme.spacing(3),
                height: theme.spacing(3),
                zIndex: 2,
              })}
              alt={getChainName(asset.chainId) || ""}
            />
          </Tooltip>
        )}

        <Menu
          id="asset-menu-action"
          aria-labelledby="asset-menu-action"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              background: `rgba(0, 0, 0, 0.85)`,
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              '& .MuiMenuItem-root': {
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {onHide && (
            <MenuItem onClick={() => { onHide(asset); handleClose(); }}>
              <Stack spacing={2} direction="row">
                {isHidden ? <VisibilityIcon /> : <VisibilityOffIcon />}
                <Typography>
                  <FormattedMessage
                    id={isHidden ? "show" : "hide"}
                    defaultMessage={isHidden ? "Show" : "Hide"}
                  />
                </Typography>
              </Stack>
            </MenuItem>
          )}
          {onTransfer && (
            <MenuItem onClick={() => { onTransfer(asset); handleClose(); }}>
              <Stack spacing={2} direction="row">
                <Send />
                <Typography>
                  <FormattedMessage id="transfer" defaultMessage="Transfer" />
                </Typography>
              </Stack>
            </MenuItem>
          )}
        </Menu>
      </Card>
    </Box>
  );
};

const GlassWalletBalances = ({
  blurIntensity = 40,
  glassOpacity = 0.10,
  textColor = '#ffffff',
  isBalancesVisible,
  chainId,
  filter,
  onClickTradeCoin,
  onClickExchangeCoin,
  onClickSendCoin,
  swapButtonConfig,
  hideSwapAction = false,
  hideExchangeAction = false,
  hideSendAction = false,
  ...props
}: any) => {
  const theme = useTheme();
  const [isHydrated, setIsHydrated] = useState(false);
  const themeModeObj = useForceThemeMode();
  const themeMode = themeModeObj.mode;
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const isDark = themeMode === 'dark' || theme.palette.mode === 'dark';
  const effectiveTextColor = isDark ? textColor : theme.palette.text.primary;
  const effectiveGlassOpacity = isDark ? glassOpacity : 0.05;
  const effectiveBlurIntensity = isDark ? blurIntensity : 0;

  const tokenBalancesQuery = useERC20BalancesQuery(undefined, chainId, false);
  const coinPricesQuery = useSimpleCoinPricesQuery({
    includeNative: true,
    chainId,
  });

  const prices = coinPricesQuery.data;
  const currency = useCurrency();

  const tokenBalancesWithPrices = useMemo(() => {
    return tokenBalancesQuery?.data?.map((tb: any) => {
      return {
        ...tb,
        price:
          prices && prices[tb.token.address.toLowerCase()]
            ? prices[tb.token.address.toLowerCase()][currency.currency]
            : undefined,
      };
    });
  }, [prices, tokenBalancesQuery.data, currency]);

  const tokenBalancesWithPricesFiltered = useMemo(() => {
    if (filter) {
      const lowercasedFilter = filter.toLowerCase();
      return tokenBalancesWithPrices?.filter(
        (t: any) =>
          t?.token?.name?.toLowerCase().search(lowercasedFilter) !== -1 ||
          t?.token?.symbol?.toLowerCase().search(lowercasedFilter) !== -1 ||
          t?.token?.address?.toLowerCase().search(lowercasedFilter) !== -1
      );
    }
    return tokenBalancesWithPrices;
  }, [tokenBalancesWithPrices, filter]);

  const handleClickTradeCoin = useCallback((tokenBalance: any) => {
    if (onClickTradeCoin) {
      onClickTradeCoin(tokenBalance);
    }
  }, [onClickTradeCoin]);

  const handleClickSendCoin = useCallback((tokenBalance: any) => {
    if (onClickSendCoin) {
      onClickSendCoin(tokenBalance);
    }
  }, [onClickSendCoin]);

  return (
    <Box
      sx={{
        background: !isHydrated ? theme.palette.background.paper : (isDark ? `rgba(255, 255, 255, ${effectiveGlassOpacity})` : theme.palette.background.paper),
        backdropFilter: !isHydrated ? 'none' : (isDark ? `blur(${effectiveBlurIntensity}px)` : 'none'),
        WebkitBackdropFilter: !isHydrated ? 'none' : (isDark ? `blur(${effectiveBlurIntensity}px)` : 'none'),
        border: !isHydrated ? `1px solid ${theme.palette.divider}` : (isDark ? `1px solid rgba(255, 255, 255, ${Math.min(effectiveGlassOpacity + 0.1, 0.3)})` : `1px solid ${theme.palette.divider}`),
        borderRadius: '16px',
        padding: 2,
        minHeight: props.isTableVisible ? '400px' : '64px',
        maxHeight: props.isTableVisible ? '600px' : '120px',
        boxShadow: !isHydrated ? theme.shadows[1] : (isDark ? `
        0 8px 32px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.2),
        inset 0 -1px 0 rgba(0, 0, 0, 0.1)
      ` : theme.shadows[1]),
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        '&::before': !isHydrated ? {} : (isDark ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%, rgba(255, 255, 255, 0.05) 100%)',
          borderRadius: 'inherit',
          pointerEvents: 'none',
          zIndex: 1,
        } : {}),
        '& > *': {
          position: 'relative',
          zIndex: 2,
        },
        '& .MuiTypography-root': {
          color: !isHydrated ? theme.palette.text.primary : (isDark ? effectiveTextColor : theme.palette.text.primary),
        },
        '& .MuiTableCell-root': {
          color: !isHydrated ? theme.palette.text.primary : (isDark ? effectiveTextColor + ' !important' : theme.palette.text.primary + ' !important'),
          borderBottomColor: !isHydrated ? theme.palette.divider : (isDark ? `rgba(255, 255, 255, ${Math.min(effectiveGlassOpacity + 0.1, 0.2)})` : theme.palette.divider),
        },
        '& .MuiTableHead-root .MuiTableCell-root': {
          color: !isHydrated ? theme.palette.text.secondary : (isDark ? effectiveTextColor + 'CC !important' : theme.palette.text.secondary + ' !important'),
          fontWeight: 600,
        },
        '& .MuiIconButton-root': {
          color: !isHydrated ? theme.palette.text.primary : (isDark ? effectiveTextColor + ' !important' : theme.palette.text.primary + ' !important'),
          '&:hover': {
            backgroundColor: !isHydrated ? theme.palette.action.hover : (isDark ? `rgba(255, 255, 255, ${Math.min(effectiveGlassOpacity + 0.2, 0.3)})` : theme.palette.action.hover),
          },
        },
      }}
    >
      {props.isTableVisible && (
        <Box sx={{ flex: 1, minHeight: 0, maxHeight: '480px', overflowY: 'auto', mb: 1 }}>
          {isMobile ? (
            <Box sx={{ px: 1 }}>
              {tokenBalancesWithPricesFiltered?.map((token: any, index: number) => (
                <WalletTableRow
                  key={index}
                  isLoadingCurrency={coinPricesQuery.isLoading}
                  tokenBalance={token}
                  price={token.price}
                  isBalancesVisible={isBalancesVisible}
                  currency={currency.currency}
                  onClickTradeCoin={hideSwapAction ? undefined : handleClickTradeCoin}
                  onClickExchangeCoin={hideExchangeAction ? undefined : onClickExchangeCoin}
                  onClickSendCoin={hideSendAction ? undefined : handleClickSendCoin}
                  swapButtonConfig={{
                    backgroundColor: isDark ? `rgba(255, 255, 255, ${effectiveGlassOpacity})` : theme.palette.background.paper,
                    textColor: effectiveTextColor,
                    borderColor: isDark ? `rgba(255, 255, 255, ${Math.min(effectiveGlassOpacity + 0.1, 0.3)})` : theme.palette.divider,
                    hoverBackgroundColor: isDark ? `rgba(255, 255, 255, ${Math.min(effectiveGlassOpacity + 0.2, 0.3)})` : theme.palette.action.hover,
                  }}
                />
              ))}
              {tokenBalancesQuery.isLoading &&
                new Array(4).fill(null).map((_, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Card
                      sx={{
                        bgcolor: isDark ? 'transparent' : theme.palette.background.paper,
                        border: isDark ? `1px solid rgba(255, 255, 255, ${Math.min(effectiveGlassOpacity + 0.1, 0.3)})` : `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                        boxShadow: isDark ? 'none' : theme.shadows[1],
                      }}
                    >
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Stack spacing={2}>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Skeleton
                              variant="circular"
                              width={40}
                              height={40}
                              sx={{ backgroundColor: isDark ? `${effectiveTextColor}33` : theme.palette.action.hover }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Skeleton
                                variant="text"
                                width="60%"
                                sx={{ backgroundColor: isDark ? `${effectiveTextColor}33` : theme.palette.action.hover }}
                              />
                              <Skeleton
                                variant="text"
                                width="40%"
                                sx={{ backgroundColor: isDark ? `${effectiveTextColor}33` : theme.palette.action.hover }}
                              />
                            </Box>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Skeleton
                              variant="text"
                              width="30%"
                              sx={{ backgroundColor: isDark ? `${effectiveTextColor}33` : theme.palette.action.hover }}
                            />
                            <Skeleton
                              variant="text"
                              width="30%"
                              sx={{ backgroundColor: isDark ? `${effectiveTextColor}33` : theme.palette.action.hover }}
                            />
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: '40%' }}>
                      <FormattedMessage id="token" defaultMessage="Token" />
                    </TableCell>
                    <TableCell sx={{ width: '25%' }}>
                      <FormattedMessage id="total" defaultMessage="Total" />
                    </TableCell>
                    <TableCell sx={{ width: '25%' }}>
                      <FormattedMessage id="balance" defaultMessage="Balance" />
                    </TableCell>
                    {!(hideSwapAction && hideExchangeAction && hideSendAction) && (
                      <TableCell sx={{ width: '10%' }}>
                        <FormattedMessage id="actions" defaultMessage="Actions" />
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tokenBalancesWithPricesFiltered?.map((token: any, index: number) => (
                    <WalletTableRow
                      key={index}
                      isLoadingCurrency={coinPricesQuery.isLoading}
                      tokenBalance={token}
                      price={token.price}
                      isBalancesVisible={isBalancesVisible}
                      currency={currency.currency}
                      onClickTradeCoin={hideSwapAction ? undefined : handleClickTradeCoin}
                      onClickExchangeCoin={hideExchangeAction ? undefined : onClickExchangeCoin}
                      onClickSendCoin={hideSendAction ? undefined : handleClickSendCoin}
                      swapButtonConfig={{
                        backgroundColor: isDark ? `rgba(255, 255, 255, ${effectiveGlassOpacity})` : theme.palette.background.paper,
                        textColor: effectiveTextColor,
                        hoverBackgroundColor: isDark ? `rgba(255, 255, 255, ${Math.min(effectiveGlassOpacity + 0.2, 0.3)})` : theme.palette.action.hover,
                      }}
                      hideActionsColumn={hideSwapAction && hideExchangeAction && hideSendAction}
                    />
                  ))}
                  {tokenBalancesQuery.isLoading &&
                    new Array(4).fill(null).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton sx={{ backgroundColor: isDark ? `${effectiveTextColor}33` : theme.palette.action.hover }} />
                        </TableCell>
                        <TableCell>
                          <Skeleton sx={{ backgroundColor: isDark ? `${effectiveTextColor}33` : theme.palette.action.hover }} />
                        </TableCell>
                        <TableCell>
                          <Skeleton sx={{ backgroundColor: isDark ? `${effectiveTextColor}33` : theme.palette.action.hover }} />
                        </TableCell>
                        {!(hideSwapAction && hideExchangeAction && hideSendAction) && (
                          <TableCell>
                            <Skeleton sx={{ backgroundColor: isDark ? `${effectiveTextColor}33` : theme.palette.action.hover }} />
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 1, cursor: 'pointer', width: '100%' }} onClick={props.handleToggleTable}>
        {props.isTableVisible ? <KeyboardArrowUpIcon sx={{ mr: 1, color: (props.customSettings?.sendButtonConfig?.backgroundColor || effectiveTextColor) }} /> : <KeyboardArrowDownIcon sx={{ mr: 1, color: (props.customSettings?.sendButtonConfig?.backgroundColor || effectiveTextColor) }} />}
        <Typography variant="body1" sx={{ fontWeight: 'bold', letterSpacing: 1, color: (props.customSettings?.sendButtonConfig?.backgroundColor || effectiveTextColor) }}>
          {props.isTableVisible ? 'CLOSE' : 'OPEN'}
        </Typography>
      </Box>
    </Box>
  );
};

const GlassEvmWalletContainer = ({
  blurIntensity = 40,
  glassOpacity = 0.10,
  textColor = '#ffffff',
  hideNFTs = false,
  hideActivity = false,
  hideSwapAction = false,
  hideExchangeAction = false,
  hideSendAction = false,
  customSettings,
  onClickTradeCoin,
  onClickExchangeCoin,
  backgroundColor,
  backgroundImage,
  backgroundSize,
  backgroundPosition,
  backgroundRepeat,
  backgroundType,
  gradientStartColor,
  gradientEndColor,
  gradientDirection,
  swapVariant,
  networkModalTextColor,
  receiveModalTextColor,
  sendModalTextColor,
  scanModalTextColor,
  importTokenModalTextColor,
}: Props) => {
  const appConfig = useAppConfig();
  const theme = useTheme();
  const [isHydrated, setIsHydrated] = useState(false);
  const themeModeObj = useForceThemeMode();
  const themeMode = themeModeObj.mode;

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const isDark = themeMode === 'dark' || theme.palette.mode === 'dark';
  const effectiveTextColor = isDark ? textColor : theme.palette.text.primary;
  const effectiveGlassOpacity = isDark ? glassOpacity : 0.05;
  const effectiveBlurIntensity = isDark ? blurIntensity : 0;

  const [isBalancesVisible, setIsBalancesVisible] = useAtom(isBalancesVisibleAtom);
  const [isTableVisible, setIsTableVisible] = useState(true);
  const [chainId, setChainId] = useState<number | undefined>();
  const [search, setSearch] = useState("");
  const [selectedTab, setSelectedTab] = useState(WalletTabs.Activity);
  const [selectedNFTTab, setSelectedNFTTab] = useState(NFTTabs.Collected);
  const [isQrCodeDialogOpen, setIsQrCodeDialogOpen] = useState(false);
  const [selectedCoinForTrade, setSelectedCoinForTrade] = useState<TokenBalance | null>(null);
  const [selectedCoinForExchange, setSelectedCoinForExchange] = useState<TokenBalance | null>(null);
  const [selectedCoinForSend, setSelectedCoinForSend] = useState<TokenBalance | null>(null);
  const { account, isActive, chainId: walletChainId, ENSName } = useWeb3React();
  const intl = useIntl();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleTradeCoin = (tokenBalance: TokenBalance) => {
    setSelectedCoinForTrade(tokenBalance);
  };

  const handleExchangeCoin = (tokenBalance: TokenBalance) => {
    setSelectedCoinForExchange(tokenBalance);
  };

  const handleBackFromTrade = () => {
    setSelectedCoinForTrade(null);
  };

  const handleBackFromExchange = () => {
    setSelectedCoinForExchange(null);
  };

  const { formatMessage } = useIntl();
  const evmCoins = useEvmCoins({ defaultChainId: chainId });

  const { connectWallet } = useWalletConnect();
  const handleConnectWallet = () => {
    connectWallet();
  };
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  const [isReceiveOpen, setIsReceiveOpen] = useState(false);
  const [isSendOpen, setIsSendOpen] = useState(false);

  const { isLoggedIn } = useAuth();

  const [selectedAssetTab, setSelectedAssetTab] = useState(AssetTabs.Tokens);

  const [filters, setFilters] = useState({
    myNfts: false,
    chainId: chainId,
    networks: [] as string[],
    account: '' as string,
  });
  const [showImportAsset, setShowImportAsset] = useState(false);

  const handleChangeTab = (
    event: React.SyntheticEvent<Element, Event>,
    value: WalletTabs
  ) => {
    setSelectedTab(value);
  };

  const handleChangeAssetTab = (
    event: React.SyntheticEvent<Element, Event>,
    value: AssetTabs
  ) => {
    setSelectedAssetTab(value);
  };

  const handleChangeNFTTab = (
    event: React.SyntheticEvent<Element, Event>,
    value: NFTTabs
  ) => {
    setSelectedNFTTab(value);
  };

  const handleToggleVisibility = () => {
    setIsBalancesVisible((value) => !value);
  };

  const handleToggleTable = () => {
    setIsTableVisible((value: any) => !value);
  };

  const handleOpenReceive = () => {
    setIsReceiveOpen(true);
  };

  const handleCloseReceive = () => {
    setIsReceiveOpen(false);
  };

  const handleOpenSend = () => {
    setIsSendOpen(true);
  };

  const handleCloseSend = () => {
    setIsSendOpen(false);
  };

  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  const handleCloseImportTokenDialog = () => {
    setIsImportDialogOpen(false);
  };

  const handleOpenImportTokenDialog = () => {
    setIsImportDialogOpen(true);
  };

  const handleToggleImportAsset = () => setShowImportAsset((value: any) => !value);

  const handleCopy = () => {
    if (account) {
      if (ENSName) {
        copyToClipboard(ENSName);
      } else {
        copyToClipboard(account);
      }
    }
  };

  useEffect(() => {
    if (walletChainId) {
      setChainId(walletChainId);
    }
  }, [walletChainId]);

  useEffect(() => {
    if (hideNFTs && selectedAssetTab === AssetTabs.NFTs) {
      setSelectedAssetTab(AssetTabs.Tokens);
    }
  }, [hideNFTs, selectedAssetTab]);

  useEffect(() => {
    if (hideActivity) {
      setSelectedAssetTab(AssetTabs.Tokens);
    }
  }, [hideActivity]);

  const [showQrCode, setShowQrCode] = useState(false);

  const handleOpenQrCodeScannerClose = () => {
    setShowQrCode(false);
  };

  const router = useRouter();

  const handleAddressResult = (result: string) => {
    try {
      if (isMobile) {
        router.push(`/wallet/send/${encodeURIComponent(result)}`);
      } else {
        window.open(`/wallet/send/${encodeURIComponent(result)}`, "_blank");
      }
      handleOpenQrCodeScannerClose();
    } catch (err) { }
  };

  const handleOpenQrCode = () => setShowQrCode(true);

  const isMobile = useIsMobile();

  const getContainerBackground = () => {
    if (!isHydrated) {
      return theme.palette.background.default;
    }

    if (backgroundType === 'image' && backgroundImage) {
      return backgroundColor
        ? `${backgroundColor}, url(${backgroundImage})`
        : `url(${backgroundImage})`;
    } else if (backgroundType === 'solid') {
      return backgroundColor || (isDark ? theme.palette.background.default : theme.palette.background.paper);
    } else if (backgroundType === 'gradient') {
      const from = gradientStartColor || (isDark ? theme.palette.background.default : theme.palette.background.paper);
      const to = gradientEndColor || (isDark ? theme.palette.background.paper : theme.palette.background.default);
      const direction = gradientDirection || 'to bottom';

      const directionMap: Record<string, string> = {
        'to bottom': '180deg',
        'to top': '0deg',
        'to right': '90deg',
        'to left': '270deg',
        'to bottom right': '135deg',
        'to bottom left': '225deg',
      };
      const gradientDirectionValue = directionMap[direction] || '180deg';
      return `linear-gradient(${gradientDirectionValue}, ${from}, ${to})`;
    }
    return isDark ? theme.palette.background.default : theme.palette.background.paper;
  };

  const handleSendCoin = (tokenBalance: TokenBalance) => {
    setSelectedCoinForSend(tokenBalance);
  };

  const handleBackFromSend = () => {
    setSelectedCoinForSend(null);
  };

  if (selectedCoinForTrade) {
    return (
      <GlassTradeContainer
        selectedCoin={selectedCoinForTrade}
        onBack={handleBackFromTrade}
        blurIntensity={blurIntensity}
        glassOpacity={glassOpacity}
        textColor={textColor}
        backgroundColor={getContainerBackground()}
        backgroundSize={backgroundSize}
        backgroundPosition={backgroundPosition}
        backgroundRepeat={backgroundRepeat}
        swapVariant={swapVariant}
      />
    );
  }

  if (selectedCoinForExchange) {
    return (
      <GlassExchangeContainer
        selectedCoin={selectedCoinForExchange}
        onBack={handleBackFromExchange}
        blurIntensity={effectiveBlurIntensity}
        glassOpacity={effectiveGlassOpacity}
        textColor={effectiveTextColor}
        backgroundColor={getContainerBackground()}
        backgroundSize={backgroundSize}
        backgroundPosition={backgroundPosition}
        backgroundRepeat={backgroundRepeat}
      />
    );
  }

  return (
    <>
      {showQrCode && (
        <GlassScanWalletQrCodeDialog
          DialogProps={{
            open: showQrCode,
            maxWidth: "sm",
            fullWidth: true,
            fullScreen: isMobile,
            onClose: handleOpenQrCodeScannerClose,
          }}
          onResult={handleAddressResult}
          blurIntensity={effectiveBlurIntensity}
          glassOpacity={effectiveGlassOpacity}
          textColor={scanModalTextColor || effectiveTextColor}
        />
      )}

      <GlassEvmReceiveDialog
        dialogProps={{
          open: isReceiveOpen,
          onClose: handleCloseReceive,
          maxWidth: "sm",
          fullWidth: true,
          fullScreen: isMobile,
        }}
        receiver={account}
        chainId={chainId}
        coins={evmCoins}
        blurIntensity={effectiveBlurIntensity}
        glassOpacity={effectiveGlassOpacity}
        textColor={receiveModalTextColor || effectiveTextColor}
      />

      <GlassEvmSendDialog
        dialogProps={{
          open: isSendOpen,
          onClose: handleCloseSend,
          maxWidth: "sm",
          fullWidth: true,
          fullScreen: isMobile,
        }}
        params={{
          account,
          ENSName,
          chainId,
          coins: evmCoins,
          onConnectWallet: handleConnectWallet,
        }}
        blurIntensity={effectiveBlurIntensity}
        glassOpacity={effectiveGlassOpacity}
        textColor={sendModalTextColor || effectiveTextColor}
      />

      <GlassImportTokenDialog
        dialogProps={{
          open: isImportDialogOpen,
          onClose: handleCloseImportTokenDialog,
          maxWidth: "xs",
          fullWidth: true,
          fullScreen: isMobile,
        }}
        blurIntensity={effectiveBlurIntensity}
        glassOpacity={effectiveGlassOpacity}
        textColor={importTokenModalTextColor || effectiveTextColor}
      />

      {showImportAsset && (
        <GlassImportAssetDialog
          dialogProps={{
            open: showImportAsset,
            fullWidth: true,
            maxWidth: 'xs',
            onClose: handleToggleImportAsset,
          }}
          blurIntensity={effectiveBlurIntensity}
          glassOpacity={effectiveGlassOpacity}
          textColor={importTokenModalTextColor || effectiveTextColor}
        />
      )}

      {selectedCoinForSend && selectedCoinForSend.token && (
        <GlassEvmSendDialog
          dialogProps={{
            open: true,
            onClose: handleBackFromSend,
            fullWidth: true,
            maxWidth: "sm",
          }}
          params={{
            ENSName,
            account: account,
            chainId: chainId,
            coins: [convertTokenToEvmCoin(selectedCoinForSend.token)],
            defaultCoin: convertTokenToEvmCoin(selectedCoinForSend.token),
            onConnectWallet: handleConnectWallet,
          }}
          blurIntensity={effectiveBlurIntensity}
          glassOpacity={effectiveGlassOpacity}
          textColor={sendModalTextColor || effectiveTextColor}
        />
      )}

      <Grid container spacing={2}>
        {isActive && account && (
          <Grid size={12}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >
              <Box>
                <Stack
                  direction="row"
                  alignItems="center"
                  alignContent="center"
                  spacing={1}
                >
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      color: !isHydrated ? theme.palette.text.secondary : effectiveTextColor
                    }}
                  >
                    {ENSName ? ENSName : truncateAddress(account)}
                  </Typography>
                  <CopyIconButton
                    iconButtonProps={{
                      onClick: handleCopy,
                      size: "small",
                      sx: {
                        background: !isHydrated ? theme.palette.background.paper : (isDark ? `rgba(255, 255, 255, ${effectiveGlassOpacity})` : theme.palette.background.paper),
                        backdropFilter: !isHydrated ? 'none' : (isDark ? `blur(${effectiveBlurIntensity}px) saturate(180%) brightness(110%)` : 'none'),
                        WebkitBackdropFilter: !isHydrated ? 'none' : (isDark ? `blur(${effectiveBlurIntensity}px) saturate(180%) brightness(110%)` : 'none'),
                        border: !isHydrated ? `1px solid ${theme.palette.divider}` : (isDark ? `1px solid rgba(255, 255, 255, ${Math.min(effectiveGlassOpacity + 0.1, 0.8)})` : `1px solid ${theme.palette.divider}`),
                        borderRadius: 2,
                        color: !isHydrated ? theme.palette.text.primary : effectiveTextColor,
                        boxShadow: !isHydrated ? theme.shadows[1] : (isDark ? `
                          0 8px 32px rgba(0, 0, 0, 0.1),
                          inset 0 1px 0 rgba(255, 255, 255, 0.2),
                          inset 0 -1px 0 rgba(0, 0, 0, 0.1)
                        ` : theme.shadows[1]),
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': !isHydrated ? {} : (isDark ? {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%, rgba(255, 255, 255, 0.05) 100%)',
                          borderRadius: 'inherit',
                          pointerEvents: 'none',
                        } : {}),
                        '&:hover': {
                          transform: !isHydrated ? 'none' : (isDark ? 'translateY(-2px) scale(1.05)' : 'none'),
                          background: !isHydrated ? theme.palette.action.hover : (isDark ? `rgba(255, 255, 255, ${Math.min(effectiveGlassOpacity + 0.1, 0.9)})` : theme.palette.action.hover),
                          boxShadow: !isHydrated ? theme.shadows[2] : (isDark ? `
                            0 12px 40px rgba(0, 0, 0, 0.15),
                            inset 0 1px 0 rgba(255, 255, 255, 0.3),
                            inset 0 -1px 0 rgba(0, 0, 0, 0.1)
                          ` : theme.shadows[2]),
                          border: !isHydrated ? `1px solid ${theme.palette.divider}` : (isDark ? `1px solid rgba(255, 255, 255, ${Math.min(effectiveGlassOpacity + 0.2, 1)})` : `1px solid ${theme.palette.divider}`),
                        },
                        '&:active': {
                          transform: !isHydrated ? 'none' : (isDark ? 'translateY(-1px) scale(1.02)' : 'none'),
                        }
                      }
                    }}
                    tooltip={ENSName ? ENSName : account}
                  >
                    <FileCopy fontSize="small" sx={{ color: !isHydrated ? theme.palette.text.primary : effectiveTextColor }} />
                  </CopyIconButton>
                </Stack>

                <Stack
                  direction="row"
                  alignItems="center"
                  alignContent="center"
                  spacing={1}
                >
                  <Typography variant="h5">
                    <NoSsr>
                      <WalletTotalBalanceCointainer chainId={chainId} />
                    </NoSsr>
                  </Typography>
                  <IconButton
                    onClick={handleToggleVisibility}
                    sx={{
                      color: !isHydrated ? theme.palette.text.primary : effectiveTextColor,
                    }}
                  >
                    {isBalancesVisible ? (
                      <VisibilityIcon />
                    ) : (
                      <VisibilityOffIcon />
                    )}
                  </IconButton>
                </Stack>
              </Box>
              <GlassNetworkSelectButton
                chainId={chainId}
                onChange={(newChainId: number) => setChainId(newChainId)}
                blurIntensity={blurIntensity}
                glassOpacity={glassOpacity}
                textColor={textColor}
                networkModalTextColor={networkModalTextColor}
              />
            </Stack>
          </Grid>
        )}
        <Grid size={12}>
          <Grid container spacing={2} alignItems="center">
            {/* TODO: As a workaround for https://github.com/DexKit/dexkit-monorepo/issues/462#event-17351363710 buy button is hidden */}
            {/* {appConfig.transak?.enabled && ( */}
            {false && (
              <Grid>
                <TransakWidget />
              </Grid>
            )}

            <Grid>
              <Button
                onClick={handleOpenReceive}
                variant="outlined"
                startIcon={<VerticalAlignBottomIcon />}
                disabled={!isActive}
                color="primary"
              >
                <FormattedMessage
                  id="receive"
                  defaultMessage="Receive"
                />
              </Button>
            </Grid>
            <Grid>
              <Button
                onClick={handleOpenSend}
                startIcon={<Send />}
                variant="outlined"
                color="primary"
                disabled={!isActive}
              >
                <FormattedMessage id="send" defaultMessage="Send" />
              </Button>
            </Grid>
            <Grid>
              <Button
                onClick={handleOpenQrCode}
                startIcon={<QrCodeScanner />}
                variant="outlined"
              >
                <FormattedMessage id="scan" defaultMessage="Scan" />
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid size={12}>
          <Divider />
        </Grid>

        <Grid size={12}>
          <Grid container spacing={2} alignItems="center">
            <Grid
              size={isDesktop ? undefined : 12}
            >
              <TextField
                size="small"
                type="search"
                onChange={(ev: any) => setSearch(ev.currentTarget.value)}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Search color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={isDesktop ? undefined : 12}>
              <Button
                onClick={selectedAssetTab === AssetTabs.Tokens || hideNFTs ? handleOpenImportTokenDialog : handleToggleImportAsset}
                variant="outlined"
                disabled={!isActive}
                startIcon={<ImportExportIcon />}
                fullWidth
              >
                <FormattedMessage
                  id={selectedAssetTab === AssetTabs.Tokens || hideNFTs ? "import.token" : "import.nft"}
                  defaultMessage={selectedAssetTab === AssetTabs.Tokens || hideNFTs ? "Import token" : "Import NFT"}
                />
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {isActive && (
          <Grid size={12}>
            <Tabs value={selectedAssetTab} onChange={handleChangeAssetTab}>
              <Tab
                value={AssetTabs.Tokens}
                label={
                  <FormattedMessage
                    id="tokens"
                    defaultMessage="Tokens"
                  />
                }
              />
              {!hideNFTs && (
                <Tab
                  value={AssetTabs.NFTs}
                  label={
                    <FormattedMessage
                      id="nfts"
                      defaultMessage="NFTs"
                    />
                  }
                />
              )}
            </Tabs>
          </Grid>
        )}

        {isActive && selectedAssetTab === AssetTabs.Tokens && (
          <Grid size={12}>
            <NoSsr>
              <GlassWalletBalances
                blurIntensity={effectiveBlurIntensity}
                glassOpacity={effectiveGlassOpacity}
                textColor={effectiveTextColor}
                isBalancesVisible={isBalancesVisible}
                chainId={chainId}
                filter={search}
                onClickTradeCoin={handleTradeCoin}
                onClickExchangeCoin={handleExchangeCoin}
                onClickSendCoin={handleSendCoin}
                hideSwapAction={hideSwapAction}
                hideExchangeAction={hideExchangeAction}
                hideSendAction={hideSendAction}
                swapButtonConfig={{
                  backgroundColor: isDark ? `rgba(255, 255, 255, ${effectiveGlassOpacity})` : theme.palette.background.paper,
                  textColor: effectiveTextColor,
                  hoverBackgroundColor: isDark ? `rgba(255, 255, 255, ${Math.min(effectiveGlassOpacity + 0.2, 0.3)})` : theme.palette.action.hover,
                }}
                handleToggleTable={handleToggleTable}
                isTableVisible={isTableVisible}
                customSettings={customSettings}
              />
            </NoSsr>
          </Grid>
        )}

        {isActive && selectedAssetTab === AssetTabs.NFTs && (
          <Grid size={12}>
            <Tabs value={selectedNFTTab} onChange={handleChangeNFTTab}>
              <Tab
                value={NFTTabs.Collected}
                label={
                  <FormattedMessage
                    id="collected"
                    defaultMessage="Collected"
                  />
                }
              />
              <Tab
                value={NFTTabs.Favorites}
                label={
                  <FormattedMessage
                    id="favorites"
                    defaultMessage="Favorites"
                  />
                }
              />
              <Tab
                value={NFTTabs.Hidden}
                label={
                  <FormattedMessage
                    id="hidden"
                    defaultMessage="Hidden"
                  />
                }
              />
            </Tabs>
          </Grid>
        )}

        {isActive && selectedAssetTab === AssetTabs.NFTs && (
          <Grid size={12}>
            {selectedNFTTab === NFTTabs.Collected && (
              <QueryErrorResetBoundary>
                {({ reset }: any) => (
                  <div>
                    <Suspense fallback={<GlassNFTSkeleton count={6} blurIntensity={effectiveBlurIntensity} glassOpacity={effectiveGlassOpacity} textColor={effectiveTextColor} />}>
                      <GlassWalletAssetsSection
                        blurIntensity={effectiveBlurIntensity}
                        glassOpacity={effectiveGlassOpacity}
                        textColor={effectiveTextColor}
                        customSettings={customSettings}
                        filters={{ ...filters, account: account }}
                        onOpenFilters={() => { }}
                        onImport={handleToggleImportAsset}
                        setFilters={setFilters}
                      />
                    </Suspense>
                  </div>
                )}
              </QueryErrorResetBoundary>
            )}

            {selectedNFTTab === NFTTabs.Favorites && (
              <GlassFavoriteAssetsSection
                blurIntensity={blurIntensity}
                glassOpacity={glassOpacity}
                textColor={textColor}
                customSettings={customSettings}
                filters={filters}
                onOpenFilters={() => { }}
                onImport={handleToggleImportAsset}
              />
            )}

            {selectedNFTTab === NFTTabs.Hidden && (
              <QueryErrorResetBoundary>
                {({ reset }: any) => (
                  <div>
                    <Suspense fallback={<GlassNFTSkeleton count={6} blurIntensity={effectiveBlurIntensity} glassOpacity={effectiveGlassOpacity} textColor={effectiveTextColor} />}>
                      <GlassHiddenAssetsSection
                        blurIntensity={effectiveBlurIntensity}
                        glassOpacity={effectiveGlassOpacity}
                        textColor={effectiveTextColor}
                        customSettings={customSettings}
                        filters={filters}
                        onOpenFilters={() => { }}
                      />
                    </Suspense>
                  </div>
                )}
              </QueryErrorResetBoundary>
            )}
          </Grid>
        )}

        <Grid size={12}>
          {!isActive && (
            <Stack
              justifyContent="center"
              alignItems="center"
              alignContent="center"
              spacing={2}
            >
              <CloseCircle color="error" />
              <Box>
                <Typography
                  align="center"
                  variant="subtitle1"
                  sx={{ fontWeight: 600 }}
                >
                  <FormattedMessage
                    id="wallet.is.not.connected"
                    defaultMessage="Wallet is not connected"
                  />
                </Typography>
                <Typography
                  align="center"
                  variant="body1"
                  color="textSecondary"
                >
                  <FormattedMessage
                    id="please.connect.your.wallet.to.see.balance"
                    defaultMessage="Please, connect your wallet to see your balance"
                  />
                </Typography>
              </Box>
              <ConnectButton variant="contained" />
            </Stack>
          )}
        </Grid>




        {isActive && selectedAssetTab === AssetTabs.Tokens && !hideActivity && (
          <Grid size={12}>
            <Tabs value={selectedTab} onChange={handleChangeTab}>
              <Tab
                value={WalletTabs.Activity}
                label={
                  <FormattedMessage
                    id="activity"
                    defaultMessage="Activity"
                  />
                }
              />
            </Tabs>
          </Grid>
        )}

        {isActive && selectedAssetTab === AssetTabs.Tokens && !hideActivity && (
          <Grid size={12}>
            <NoSsr>
              {selectedTab === WalletTabs.Activity ? (
                <DexkitApiProvider.Provider value={{ instance: myAppsApi }}>
                  <AppErrorBoundary
                    fallbackRender={({ error }) => (
                      <Card>
                        <CardContent>
                          <Stack
                            alignItems="center"
                            direction="row"
                            justifyContent="center"
                          >
                            <Stack spacing={1} alignItems="center">
                              <Typography align="center">
                                <FormattedMessage
                                  id="error.while.loading.activity"
                                  defaultMessage="Error while Loading activity"
                                />
                              </Typography>
                              <Button variant="outlined">
                                <FormattedMessage
                                  id="try.again"
                                  defaultMessage="try again"
                                />
                              </Button>
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
                    )}
                  >
                    {isLoggedIn ? (
                      <UserActivityTable />
                    ) : (
                      <Stack justifyContent="center">
                        <Box>
                          <LoginAppButton />
                        </Box>
                      </Stack>
                    )}
                  </AppErrorBoundary>
                </DexkitApiProvider.Provider>
              ) : (
                <TransactionsTable
                  filter={
                    selectedTab === WalletTabs.Transactions
                      ? TransactionsTableFilter.Transactions
                      : TransactionsTableFilter.Trades
                  }
                />
              )}
            </NoSsr>
          </Grid>
        )}

        {!isLoggedIn && isActive && selectedTab !== WalletTabs.Activity && (
          <Grid size={12}>
            <LoginAppButton />
          </Grid>
        )}
      </Grid>
    </>
  );
};

const GlassWalletAssetsSection = ({ blurIntensity = 40, glassOpacity = 0.10, textColor = '#ffffff', ...props }: any) => {
  const { account, chainId, signer } = useWeb3React();
  const [openFilter, setOpenFilter] = useState(false);
  const [assetTransfer, setAssetTransfer] = useState<any>();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const theme = useTheme();
  const [isHydrated, setIsHydrated] = useState(false);
  const themeModeObj = useForceThemeMode();
  const themeMode = themeModeObj.mode;

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const isDark = themeMode === 'dark' || theme.palette.mode === 'dark';
  const effectiveTextColor = isDark ? textColor : theme.palette.text.primary;
  const effectiveGlassOpacity = isDark ? glassOpacity : 0.05;
  const effectiveBlurIntensity = isDark ? blurIntensity : 0;

  const { accountAssets, accountAssetsQuery } = useAccountAssetsBalance(
    props.filters?.account ? [props.filters?.account] : [],
    false
  );

  const { isHidden, toggleHidden, assets: hiddenAssets } = useHiddenAssets();
  const [search, setSearch] = useState("");

  const assets = useMemo(() => {
    if (accountAssets?.data) {
      return (
        (accountAssets?.data
          .map((a: any) => a.assets)
          .flat()
          .filter((a: any) => a) as any[]) || []
      );
    }
    return [];
  }, [accountAssets?.data]);

  const filteredAssetList = useMemo(() => {
    return assets
      .filter((asset: any) => !isHidden(asset))
      .filter((asset: any) => {
        return (
          asset.collectionName?.toLowerCase().search(search.toLowerCase()) >
          -1 ||
          (asset.metadata !== undefined &&
            asset.metadata?.name !== undefined &&
            asset.metadata?.name.toLowerCase().search(search.toLowerCase()) >
            -1)
        );
      })
      .filter((asset: any) => {
        if (props.filters?.myNfts) {
          return asset.owner === props.filters?.account;
        }
        if (props.filters?.networks && props.filters?.networks.length) {
          return props.filters.networks.includes(
            asset.chainId?.toString() || ""
          );
        }
        return true;
      });
  }, [assets, props.filters, search, hiddenAssets]);

  const totalPages = Math.ceil(filteredAssetList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAssets = filteredAssetList.slice(startIndex, endIndex);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filteredAssetList.length]);

  const { formatMessage } = useIntl();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  const handleChange = (e: any) => {
    setSearch(e.target.value);
  };

  const onTransfer = (asset: any) => {
    setAssetTransfer(asset);
  };

  const renderAssets = () => {
    if (filteredAssetList.length === 0) {
      return (
        <Grid size={12}>
          <Box sx={{ py: 4 }}>
            <Stack
              justifyContent="center"
              alignItems="center"
              alignContent="center"
              spacing={2}
            >
              <CloseCircle sx={{ color: effectiveTextColor }} />
              <Typography variant="body1" sx={{ color: effectiveTextColor }}>
                <FormattedMessage
                  id="no.nfts.found"
                  defaultMessage="No NFTs Found"
                />
              </Typography>
              <Typography align="center" variant="body1" sx={{ color: effectiveTextColor + 'CC' }}>
                <FormattedMessage
                  id="import.or.favorite.nfts"
                  defaultMessage="Import or favorite NFTs"
                />
              </Typography>
            </Stack>
          </Box>
        </Grid>
      );
    }

    return paginatedAssets.map((asset: any, index: any) => (
      <GlassAssetCard
        asset={asset}
        key={index}
        showControls={true}
        onHide={toggleHidden}
        isHidden={isHidden(asset)}
        onTransfer={onTransfer}
        blurIntensity={effectiveBlurIntensity}
        glassOpacity={effectiveGlassOpacity}
        textColor={effectiveTextColor}
        customSettings={props.customSettings}
      />
    ));
  };

  return (
    <Box
      sx={{
        background: !isHydrated ? theme.palette.background.paper : (isDark ? `rgba(255, 255, 255, ${effectiveGlassOpacity})` : theme.palette.background.paper),
        backdropFilter: !isHydrated ? 'none' : (isDark ? `blur(${effectiveBlurIntensity}px)` : 'none'),
        WebkitBackdropFilter: !isHydrated ? 'none' : (isDark ? `blur(${effectiveBlurIntensity}px)` : 'none'),
        border: !isHydrated ? `1px solid ${theme.palette.divider}` : (isDark ? `1px solid rgba(255, 255, 255, ${Math.min(effectiveGlassOpacity + 0.1, 0.3)})` : `1px solid ${theme.palette.divider}`),
        borderRadius: '16px',
        padding: 2,
        minHeight: '700px',
        maxHeight: '900px',
        overflowY: 'auto',
        boxShadow: `
          0 8px 32px rgba(0, 0, 0, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.2),
          inset 0 -1px 0 rgba(0, 0, 0, 0.1)
        `,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%, rgba(255, 255, 255, 0.05) 100%)',
          borderRadius: 'inherit',
          pointerEvents: 'none',
          zIndex: 1,
        },
        '& > *': {
          position: 'relative',
          zIndex: 2,
        },
        '& .MuiTypography-root': {
          color: textColor,
        },
        '& .MuiChip-root': {
          backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.3)})`,
          color: textColor,
          border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.4)})`,
        },
        '& .MuiTextField-root .MuiOutlinedInput-root': {
          backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.05, 0.2)})`,
          '& fieldset': {
            borderColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.4)})`,
          },
          '&:hover fieldset': {
            borderColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.3, 0.5)})`,
          },
          '& input': {
            color: textColor + ' !important',
          },
          '& input::placeholder': {
            color: textColor + '80 !important',
            opacity: 1,
          },
        },
        '& .MuiCard-root': {
          background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.05, 0.25)})`,
          backdropFilter: `blur(${Math.min(blurIntensity - 10, 30)}px)`,
          border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.15, 0.35)})`,
          '& .MuiTypography-root': {
            color: textColor + ' !important',
          },
          '& .MuiCardContent-root .MuiTypography-body1': {
            color: textColor + 'CC !important',
          },
          '& .MuiCardContent-root .MuiTypography-body2': {
            color: textColor + ' !important',
            fontWeight: 600,
          },
        },
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.4)})`,
          borderRadius: '4px',
          '&:hover': {
            background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.3, 0.5)})`,
          },
        },
      }}
    >
      <Grid container spacing={2}>
        <Grid size={12}>
          <Stack
            direction="row"
            justifyContent="start"
            alignItems="center"
            alignContent="center"
            spacing={2}
          >
            <IconButton
              onClick={() => setOpenFilter(!openFilter)}
              sx={{ color: textColor }}
            >
              <FilterListIcon />
            </IconButton>

            <TextField
              type="search"
              size="small"
              value={search}
              onChange={handleChange}
              placeholder={formatMessage({
                id: "search.for.a.nft",
                defaultMessage: "Search for a NFT",
              })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Search sx={{ color: textColor }} />
                  </InputAdornment>
                ),
              }}
            />
            <Chip
              label={
                <>
                  {filteredAssetList.length}{" "}
                  <FormattedMessage id="nfts" defaultMessage="NFTs" />
                </>
              }
              sx={{
                backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.3)})`,
                color: textColor,
                border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.4)})`,
              }}
            />
          </Stack>
        </Grid>
        {openFilter && (
          <Grid size={3}>
            <GlassWalletAssetsFilter
              blurIntensity={blurIntensity}
              glassOpacity={glassOpacity}
              textColor={textColor}
              setFilters={props.setFilters}
              filters={props.filters}
              accounts={props.accounts}
              onClose={() => setOpenFilter(false)}
            />
          </Grid>
        )}

        <Grid container size={openFilter ? 9 : 12} sx={{
          display: 'grid !important',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gridAutoRows: 'minmax(300px, auto)',
          gap: 2
        }}>
          {accountAssetsQuery.isLoading && (
            <GlassNFTSkeleton
              count={6}
              blurIntensity={blurIntensity}
              glassOpacity={glassOpacity}
              textColor={textColor}
            />
          )}
          {!accountAssetsQuery.isLoading && renderAssets()}
        </Grid>

        {!accountAssetsQuery.isLoading && filteredAssetList.length > itemsPerPage && (
          <Grid size={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
              <Stack spacing={2} alignItems="center">
                <Typography variant="body2" sx={{ color: textColor + 'CC' }}>
                  <FormattedMessage
                    id="showing.nfts"
                    defaultMessage="Showing {start}-{end} of {total} NFTs"
                    values={{
                      start: startIndex + 1,
                      end: Math.min(endIndex, filteredAssetList.length),
                      total: filteredAssetList.length
                    }}
                  />
                </Typography>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: textColor,
                      '&.Mui-selected': {
                        backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.4)})`,
                        color: textColor,
                      },
                      '&:hover': {
                        backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.3)})`,
                      },
                    },
                  }}
                />
              </Stack>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

const GlassFavoriteAssetsSection = ({ blurIntensity = 40, glassOpacity = 0.10, textColor = '#ffffff', ...props }: any) => {
  return (
    <Box
      sx={{
        background: `rgba(255, 255, 255, ${glassOpacity})`,
        backdropFilter: `blur(${blurIntensity}px)`,
        border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.3)})`,
        borderRadius: '16px',
        padding: 2,
        minHeight: '400px',
        maxHeight: '600px',
        overflowY: 'auto',
        boxShadow: `
          0 8px 32px rgba(0, 0, 0, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.2),
          inset 0 -1px 0 rgba(0, 0, 0, 0.1)
        `,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%, rgba(255, 255, 255, 0.05) 100%)',
          borderRadius: 'inherit',
          pointerEvents: 'none',
          zIndex: 1,
        },
        '& > *': {
          position: 'relative',
          zIndex: 2,
        },
        '& .MuiTypography-root': {
          color: textColor,
        },
        '& .MuiChip-root': {
          backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.3)})`,
          color: textColor,
          border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.4)})`,
        },
        '& .MuiTextField-root .MuiOutlinedInput-root': {
          backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.05, 0.2)})`,
          '& fieldset': {
            borderColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.4)})`,
          },
          '&:hover fieldset': {
            borderColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.3, 0.5)})`,
          },
          '& input': {
            color: textColor + ' !important',
          },
          '& input::placeholder': {
            color: textColor + '80 !important',
            opacity: 1,
          },
        },
        '& .MuiCard-root': {
          background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.05, 0.25)})`,
          backdropFilter: `blur(${Math.min(blurIntensity - 10, 30)}px)`,
          border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.15, 0.35)})`,
          '& .MuiTypography-root': {
            color: textColor + ' !important',
          },
          '& .MuiCardContent-root .MuiTypography-body1': {
            color: textColor + 'CC !important',
          },
          '& .MuiCardContent-root .MuiTypography-body2': {
            color: textColor + ' !important',
            fontWeight: 600,
          },
        },
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.4)})`,
          borderRadius: '4px',
          '&:hover': {
            background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.3, 0.5)})`,
          },
        },
      }}
    >
      <FavoriteAssetsSection {...props} />
    </Box>
  );
};

const GlassHiddenAssetsSection = ({ blurIntensity = 40, glassOpacity = 0.10, textColor = '#ffffff', ...props }: any) => {
  const { account } = useWeb3React();
  const [search, setSearch] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const { accountAssets } = useAccountAssetsBalance(account ? [account] : []);
  const { formatMessage } = useIntl();
  const { isHidden, toggleHidden, assets: hiddenAssets } = useHiddenAssets();

  const handleChange = (e: any) => {
    setSearch(e.target.value);
  };

  const onTransfer = (asset: any) => {
  };

  const assetList = useMemo(() => {
    if (accountAssets?.data && accountAssets?.data.length) {
      return (
        (accountAssets?.data
          .map((a) => a.assets)
          .flat()
          .filter((a) => a) as Asset[]) || []
      );
    }
    return [];
  }, [accountAssets?.data]);

  const filteredAssetList = useMemo(() => {
    return assetList
      .filter(isHidden)
      .filter((asset: any) => {
        return (
          asset?.collectionName?.toLowerCase().search(search.toLowerCase()) >
          -1 ||
          (asset?.metadata !== undefined &&
            asset?.metadata?.name?.toLowerCase().search(search.toLowerCase()) >
            -1)
        );
      })
      .filter((asset: any) => {
        if (props.filters?.networks && props.filters?.networks.length) {
          return props.filters.networks.includes(
            getNetworkSlugFromChainId(asset?.chainId) || ""
          );
        }
        return true;
      });
  }, [assetList, props.filters, search, hiddenAssets]);

  const totalPages = Math.ceil(filteredAssetList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAssets = filteredAssetList.slice(startIndex, endIndex);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filteredAssetList.length]);

  const renderAssets = () => {
    if (filteredAssetList.length === 0) {
      return (
        <Grid size={12}>
          <Box sx={{ py: 4 }}>
            <Stack
              justifyContent="center"
              alignItems="center"
              alignContent="center"
              spacing={2}
            >
              <CloseCircle sx={{ color: textColor }} />
              <Typography variant="body1" sx={{ color: textColor }}>
                <FormattedMessage
                  id="no.hidden.nfts.found"
                  defaultMessage="No hidden NFTs Found"
                />
              </Typography>
              <Typography align="center" variant="body1" sx={{ color: textColor + 'CC' }}>
                <FormattedMessage
                  id="hide.nfts.hint"
                  defaultMessage="Go to Collected tab and use the eye icon on any NFT to hide it from your main collection"
                />
              </Typography>
            </Stack>
          </Box>
        </Grid>
      );
    }

    return paginatedAssets.map((asset: any, index: any) => (
      <GlassAssetCard
        asset={asset}
        key={index}
        showControls={true}
        onHide={toggleHidden}
        isHidden={true}
        onTransfer={onTransfer}
        blurIntensity={blurIntensity}
        glassOpacity={glassOpacity}
        textColor={textColor}
        customSettings={props.customSettings}
      />
    ));
  };

  return (
    <Box
      sx={{
        background: `rgba(255, 255, 255, ${glassOpacity})`,
        backdropFilter: `blur(${blurIntensity}px)`,
        WebkitBackdropFilter: `blur(${blurIntensity}px)`,
        border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.3)})`,
        borderRadius: '16px',
        padding: 2,
        minHeight: '700px',
        maxHeight: '900px',
        overflowY: 'auto',
        boxShadow: `
          0 8px 32px rgba(0, 0, 0, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.2),
          inset 0 -1px 0 rgba(0, 0, 0, 0.1)
        `,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%, rgba(255, 255, 255, 0.05) 100%)',
          borderRadius: 'inherit',
          pointerEvents: 'none',
          zIndex: 1,
        },
        '& > *': {
          position: 'relative',
          zIndex: 2,
        },
        '& .MuiTypography-root': {
          color: textColor,
        },
        '& .MuiChip-root': {
          backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.3)})`,
          color: textColor,
          border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.4)})`,
        },
        '& .MuiTextField-root .MuiOutlinedInput-root': {
          backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.05, 0.2)})`,
          '& fieldset': {
            borderColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.4)})`,
          },
          '&:hover fieldset': {
            borderColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.3, 0.5)})`,
          },
          '& input': {
            color: textColor + ' !important',
          },
          '& input::placeholder': {
            color: textColor + '80 !important',
            opacity: 1,
          },
        },
        '& .MuiCard-root': {
          background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.05, 0.25)})`,
          backdropFilter: `blur(${Math.min(blurIntensity - 10, 30)}px)`,
          border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.15, 0.35)})`,
          '& .MuiTypography-root': {
            color: textColor + ' !important',
          },
          '& .MuiCardContent-root .MuiTypography-body1': {
            color: textColor + 'CC !important',
          },
          '& .MuiCardContent-root .MuiTypography-body2': {
            color: textColor + ' !important',
            fontWeight: 600,
          },
        },
        // Scrollbar styling
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.4)})`,
          borderRadius: '4px',
          '&:hover': {
            background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.3, 0.5)})`,
          },
        },
      }}
    >
      <Grid container spacing={2}>
        <Grid size={12}>
          <Stack
            direction="row"
            justifyContent="start"
            alignItems="center"
            alignContent="center"
            spacing={2}
          >
            <IconButton
              onClick={() => setOpenFilter(!openFilter)}
              sx={{ color: textColor }}
            >
              <FilterListIcon />
            </IconButton>

            <TextField
              type="search"
              size="small"
              value={search}
              onChange={handleChange}
              placeholder={formatMessage({
                id: "search.for.a.nft",
                defaultMessage: "Search for a NFT",
              })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Search sx={{ color: textColor }} />
                  </InputAdornment>
                ),
              }}
            />
            <Chip
              label={
                <>
                  {filteredAssetList.length}{" "}
                  <FormattedMessage id="nfts" defaultMessage="NFTs" />
                </>
              }
              sx={{
                backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.3)})`,
                color: textColor,
                border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.4)})`,
              }}
            />
          </Stack>
        </Grid>
        {openFilter && (
          <Grid size={3}>
            <GlassWalletAssetsFilter
              blurIntensity={blurIntensity}
              glassOpacity={glassOpacity}
              textColor={textColor}
              setFilters={props.setFilters}
              filters={props.filters}
              accounts={props.accounts}
              onClose={() => setOpenFilter(false)}
            />
          </Grid>
        )}

        <Grid container size={openFilter ? 9 : 12} sx={{
          display: 'grid !important',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gridAutoRows: 'minmax(300px, auto)',
          gap: 2
        }}>
          {renderAssets()}
        </Grid>

        {filteredAssetList.length > itemsPerPage && (
          <Grid size={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
              <Stack spacing={2} alignItems="center">
                <Typography variant="body2" sx={{ color: textColor + 'CC' }}>
                  <FormattedMessage
                    id="showing.nfts"
                    defaultMessage="Showing {start}-{end} of {total} NFTs"
                    values={{
                      start: startIndex + 1,
                      end: Math.min(endIndex, filteredAssetList.length),
                      total: filteredAssetList.length
                    }}
                  />
                </Typography>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: textColor,
                      '&.Mui-selected': {
                        backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.4)})`,
                        color: textColor,
                      },
                      '&:hover': {
                        backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.3)})`,
                      },
                    },
                  }}
                />
              </Stack>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};



const GlassWalletAssetsFilter = ({
  blurIntensity = 40,
  glassOpacity = 0.10,
  textColor = '#ffffff',
  filters,
  setFilters,
  onClose,
  accounts
}: any) => {
  const { activeChainIds } = useActiveChainIds();
  const theme = useTheme();
  const [isHydrated, setIsHydrated] = useState(false);
  const themeModeObj = useForceThemeMode();
  const themeMode = themeModeObj.mode;

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const isDark = themeMode === 'dark' || theme.palette.mode === 'dark';
  const effectiveTextColor = isDark ? textColor : theme.palette.text.primary;
  const effectiveGlassOpacity = isDark ? glassOpacity : 0.05;
  const effectiveBlurIntensity = isDark ? blurIntensity : 0;

  const onFilterNetworkChanged = (net: string) => {
    setFilters((value: any) => {
      const newFilterNetwork = [...value.networks] as string[];
      if (newFilterNetwork.includes(net)) {
        const index = newFilterNetwork.findIndex((n) => n === net);
        newFilterNetwork.splice(index, 1);
      } else {
        newFilterNetwork.push(net);
      }
      return {
        ...value,
        networks: newFilterNetwork,
      };
    });
  };

  const onFilterAccountChanged = (account: string) => {
    setFilters((value: any) => {
      return {
        ...value,
        account: account,
      };
    });
  };

  return (
    <Box
      sx={{
        background: !isHydrated ? theme.palette.background.paper : (isDark ? `rgba(255, 255, 255, ${effectiveGlassOpacity})` : theme.palette.background.paper),
        backdropFilter: !isHydrated ? 'none' : (isDark ? `blur(${effectiveBlurIntensity}px)` : 'none'),
        WebkitBackdropFilter: !isHydrated ? 'none' : (isDark ? `blur(${effectiveBlurIntensity}px)` : 'none'),
        border: !isHydrated ? `1px solid ${theme.palette.divider}` : (isDark ? `1px solid rgba(255, 255, 255, ${Math.min(effectiveGlassOpacity + 0.1, 0.3)})` : `1px solid ${theme.palette.divider}`),
        borderRadius: '16px',
        height: '100%',
        boxShadow: !isHydrated ? theme.shadows[1] : (isDark ? `
          0 8px 32px rgba(0, 0, 0, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.2),
          inset 0 -1px 0 rgba(0, 0, 0, 0.1)
        ` : theme.shadows[1]),
        position: 'relative',
        overflow: 'hidden',
        '&::before': !isHydrated ? {} : (isDark ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%, rgba(255, 255, 255, 0.05) 100%)',
          borderRadius: 'inherit',
          pointerEvents: 'none',
          zIndex: 1,
        } : {}),
        '& > *': {
          position: 'relative',
          zIndex: 2,
        },
        '& .MuiTypography-root': {
          color: !isHydrated ? theme.palette.text.primary : (isDark ? effectiveTextColor + ' !important' : theme.palette.text.primary + ' !important'),
        },
        '& .MuiIconButton-root': {
          color: !isHydrated ? theme.palette.text.primary : (isDark ? effectiveTextColor + ' !important' : theme.palette.text.primary + ' !important'),
        },
        '& .MuiDivider-root': {
          borderColor: !isHydrated ? theme.palette.divider : (isDark ? `rgba(255, 255, 255, ${Math.min(effectiveGlassOpacity + 0.2, 0.3)})` : theme.palette.divider),
        },
        '& .MuiAccordion-root': {
          background: !isHydrated ? theme.palette.background.paper : (isDark ? `rgba(255, 255, 255, ${Math.min(effectiveGlassOpacity + 0.05, 0.15)})` : theme.palette.background.paper),
          border: !isHydrated ? `1px solid ${theme.palette.divider}` : (isDark ? `1px solid rgba(255, 255, 255, ${Math.min(effectiveGlassOpacity + 0.1, 0.2)})` : `1px solid ${theme.palette.divider}`),
          borderRadius: '8px !important',
          '&:before': {
            display: 'none',
          },
        },
        '& .MuiAccordionSummary-root': {
          '& .MuiTypography-root': {
            color: !isHydrated ? theme.palette.text.primary : (isDark ? effectiveTextColor + ' !important' : theme.palette.text.primary + ' !important'),
          },
          '& .MuiSvgIcon-root': {
            color: !isHydrated ? theme.palette.text.primary : (isDark ? effectiveTextColor + ' !important' : theme.palette.text.primary + ' !important'),
          },
        },
        '& .MuiFormControl-root': {
          '& .MuiInputLabel-root': {
            color: !isHydrated ? theme.palette.text.secondary : (isDark ? effectiveTextColor + 'CC !important' : theme.palette.text.secondary + ' !important'),
          },
          '& .MuiOutlinedInput-root': {
            background: !isHydrated ? theme.palette.background.paper : (isDark ? `rgba(255, 255, 255, ${Math.min(effectiveGlassOpacity + 0.05, 0.15)})` : theme.palette.background.paper),
            '& fieldset': {
              borderColor: !isHydrated ? theme.palette.divider : (isDark ? `rgba(255, 255, 255, ${Math.min(effectiveGlassOpacity + 0.2, 0.3)})` : theme.palette.divider),
            },
            '&:hover fieldset': {
              borderColor: !isHydrated ? theme.palette.action.hover : (isDark ? `rgba(255, 255, 255, ${Math.min(effectiveGlassOpacity + 0.3, 0.4)})` : theme.palette.action.hover),
            },
            '&.Mui-focused fieldset': {
              borderColor: !isHydrated ? theme.palette.primary.main : (isDark ? `rgba(255, 255, 255, ${Math.min(effectiveGlassOpacity + 0.4, 0.5)})` : theme.palette.primary.main),
            },
          },
          '& .MuiSelect-select': {
            color: !isHydrated ? theme.palette.text.primary : (isDark ? effectiveTextColor + ' !important' : theme.palette.text.primary + ' !important'),
          },
          '& .MuiSvgIcon-root': {
            color: !isHydrated ? theme.palette.text.primary : (isDark ? effectiveTextColor + ' !important' : theme.palette.text.primary + ' !important'),
          },
        },
        '& .MuiListItemText-root': {
          '& .MuiTypography-root': {
            color: !isHydrated ? theme.palette.text.primary : (isDark ? effectiveTextColor + ' !important' : theme.palette.text.primary + ' !important'),
          },
        },
        '& .MuiCheckbox-root': {
          color: !isHydrated ? theme.palette.text.primary : (isDark ? effectiveTextColor + ' !important' : theme.palette.text.primary + ' !important'),
          '&.Mui-checked': {
            color: !isHydrated ? theme.palette.primary.main : (isDark ? effectiveTextColor + ' !important' : theme.palette.primary.main + ' !important'),
          },
        },
        '& .MuiMenuItem-root': {
          color: !isHydrated ? theme.palette.text.primary : (isDark ? effectiveTextColor + ' !important' : theme.palette.text.primary + ' !important'),
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Stack
          direction="row"
          alignItems="center"
          alignContent="center"
          justifyContent="space-between"
        >
          <Stack direction="row" alignItems="center" alignContent="center">
            <Funnel sx={{ color: textColor, mr: 1 }} />
            <Typography sx={{ fontWeight: 600 }} variant="subtitle1">
              <FormattedMessage id="filters" defaultMessage="Filters" />
            </Typography>
          </Stack>
          {onClose && (
            <IconButton onClick={onClose}>
              <ArrowBackIcon />
            </IconButton>
          )}
        </Stack>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Stack spacing={2}>
          {accounts && accounts.length > 1 && (
            <FormControl fullWidth>
              <InputLabel id="account-filter-label">
                <FormattedMessage id="accounts" defaultMessage="Accounts" />
              </InputLabel>
              <Select
                labelId="account-filter-label"
                id="demo-simple-select"
                value={filters?.account}
                label={
                  <FormattedMessage id="account" defaultMessage="Account" />
                }
                onChange={(ev) => onFilterAccountChanged(ev.target.value)}
              >
                {accounts.map((a: string, k: number) => (
                  <MenuItem value={a} key={k}>
                    {truncateAddress(a)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <Stack spacing={2} sx={{ pt: 2 }}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="networks"
                id="networks-display"
              >
                <Typography>
                  <FormattedMessage id={"networks"} defaultMessage={"Networks"} />
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List sx={{ maxHeight: "400px", overflow: "auto" }}>
                  {Object.values(NETWORKS)
                    .filter((n) => activeChainIds.includes(Number(n.chainId)))
                    .filter((n) => !n.testnet)
                    .map((net, key) => (
                      <ListItem
                        key={key}
                        secondaryAction={
                          <FormControlLabel
                            value="start"
                            control={<Checkbox />}
                            onClick={() => {
                              if (net?.slug) {
                                onFilterNetworkChanged(net?.slug);
                              }
                            }}
                            label={""}
                          />
                        }
                      >
                        <ListItemText primary={net.name} />
                      </ListItem>
                    ))}
                </List>
              </AccordionDetails>
            </Accordion>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default GlassEvmWalletContainer; 