import { QrCodeScanner, Search } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  NoSsr,
  Paper,
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
import CloseCircle from "@dexkit/ui/components/icons/CloseCircle";
import Funnel from "@dexkit/ui/components/icons/Filter";
import LoginAppButton from "@dexkit/ui/components/LoginAppButton";
import { myAppsApi } from "@dexkit/ui/constants/api";
import { useAppConfig, useAuth, useEvmCoins } from "@dexkit/ui/hooks";
import { useActiveChainIds } from "@dexkit/ui/hooks/blockchain";
import { useCurrency } from "@dexkit/ui/hooks/currency";
import { useSimpleCoinPricesQuery } from "@dexkit/ui/hooks/currency/useSimpleCoinPricesCurrency";
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
import { ErrorBoundary } from "react-error-boundary";
import FavoriteAssetsSection from "../../../../../apps/dexappbuilder/src/modules/favorites/components/FavoriteAssetsSection";
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
            paddingTop: "80%",
          }}
        >
          <Skeleton
            variant="rectangular"
            sx={{
              position: "absolute",
              display: "block",
              width: "100%",
              height: "100%",
            }}
          />
        </Box>
      )}
      <CardContent>
        <Typography
          variant="body1"
          style={{ color: customSettings?.nftColors?.collectionColor || textColor }}
          sx={{ color: `${customSettings?.nftColors?.collectionColor || textColor} !important` }}
        >
          {asset === undefined ? <Skeleton /> : asset?.collectionName}
        </Typography>
        <Typography
          variant="body1"
          style={{ fontWeight: 600, color: customSettings?.nftColors?.titleColor || textColor }}
          sx={{ fontWeight: 600, color: `${customSettings?.nftColors?.titleColor || textColor} !important` }}
        >
          {asset === undefined ? (
            <Skeleton />
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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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
        background: `rgba(255, 255, 255, ${glassOpacity})`,
        backdropFilter: `blur(${blurIntensity}px)`,
        WebkitBackdropFilter: `blur(${blurIntensity}px)`,
        border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.3)})`,
        borderRadius: '16px',
        padding: 2,
        minHeight: props.isTableVisible ? '400px' : '64px',
        maxHeight: props.isTableVisible ? '600px' : '120px',
        boxShadow: `
        0 8px 32px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.2),
        inset 0 -1px 0 rgba(0, 0, 0, 0.1)
      `,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
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
        '& .MuiTableCell-root': {
          color: textColor + ' !important',
          borderBottomColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.2)})`,
        },
        '& .MuiTableHead-root .MuiTableCell-root': {
          color: textColor + 'CC !important',
          fontWeight: 600,
        },
        '& .MuiIconButton-root': {
          color: textColor + ' !important',
          '&:hover': {
            backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.3)})`,
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
                    backgroundColor: `rgba(255, 255, 255, ${glassOpacity})`,
                    textColor: textColor,
                    borderColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.3)})`,
                    hoverBackgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.3)})`,
                  }}
                />
              ))}
              {tokenBalancesQuery.isLoading &&
                new Array(4).fill(null).map((_, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Card
                      sx={{
                        bgcolor: 'transparent',
                        border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.3)})`,
                        borderRadius: 2,
                        boxShadow: 'none',
                      }}
                    >
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Stack spacing={2}>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Skeleton
                              variant="circular"
                              width={40}
                              height={40}
                              sx={{ backgroundColor: `${textColor}33` }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Skeleton
                                variant="text"
                                width="60%"
                                sx={{ backgroundColor: `${textColor}33` }}
                              />
                              <Skeleton
                                variant="text"
                                width="40%"
                                sx={{ backgroundColor: `${textColor}33` }}
                              />
                            </Box>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Skeleton
                              variant="text"
                              width="30%"
                              sx={{ backgroundColor: `${textColor}33` }}
                            />
                            <Skeleton
                              variant="text"
                              width="30%"
                              sx={{ backgroundColor: `${textColor}33` }}
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
                        backgroundColor: `rgba(255, 255, 255, ${glassOpacity})`,
                        textColor: textColor,
                        hoverBackgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.3)})`,
                      }}
                      hideActionsColumn={hideSwapAction && hideExchangeAction && hideSendAction}
                    />
                  ))}
                  {tokenBalancesQuery.isLoading &&
                    new Array(4).fill(null).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton sx={{ backgroundColor: `${textColor}33` }} />
                        </TableCell>
                        <TableCell>
                          <Skeleton sx={{ backgroundColor: `${textColor}33` }} />
                        </TableCell>
                        <TableCell>
                          <Skeleton sx={{ backgroundColor: `${textColor}33` }} />
                        </TableCell>
                        {!(hideSwapAction && hideExchangeAction && hideSendAction) && (
                          <TableCell>
                            <Skeleton sx={{ backgroundColor: `${textColor}33` }} />
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
        {props.isTableVisible ? <KeyboardArrowUpIcon sx={{ mr: 1, color: (props.customSettings?.sendButtonConfig?.backgroundColor || textColor) }} /> : <KeyboardArrowDownIcon sx={{ mr: 1, color: (props.customSettings?.sendButtonConfig?.backgroundColor || textColor) }} />}
        <Typography variant="body1" sx={{ fontWeight: 'bold', letterSpacing: 1, color: (props.customSettings?.sendButtonConfig?.backgroundColor || textColor) }}>
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
    setIsTableVisible((value) => !value);
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

  const handleToggleImportAsset = () => setShowImportAsset((value) => !value);

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
    if (backgroundType === 'image' && backgroundImage) {
      return backgroundColor
        ? `${backgroundColor}, url(${backgroundImage})`
        : `url(${backgroundImage})`;
    } else if (backgroundType === 'solid') {
      return backgroundColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    } else if (backgroundType === 'gradient') {
      const from = gradientStartColor || '#667eea';
      const to = gradientEndColor || '#764ba2';
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
    return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
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
        blurIntensity={blurIntensity}
        glassOpacity={glassOpacity}
        textColor={textColor}
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
          blurIntensity={blurIntensity}
          glassOpacity={glassOpacity}
          textColor={scanModalTextColor || textColor}
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
        blurIntensity={blurIntensity}
        glassOpacity={glassOpacity}
        textColor={receiveModalTextColor || textColor}
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
        blurIntensity={blurIntensity}
        glassOpacity={glassOpacity}
        textColor={sendModalTextColor || textColor}
      />

      <GlassImportTokenDialog
        dialogProps={{
          open: isImportDialogOpen,
          onClose: handleCloseImportTokenDialog,
          maxWidth: "xs",
          fullWidth: true,
          fullScreen: isMobile,
        }}
        blurIntensity={blurIntensity}
        glassOpacity={glassOpacity}
        textColor={importTokenModalTextColor || textColor}
      />

      {showImportAsset && (
        <GlassImportAssetDialog
          dialogProps={{
            open: showImportAsset,
            fullWidth: true,
            maxWidth: 'xs',
            onClose: handleToggleImportAsset,
          }}
          blurIntensity={blurIntensity}
          glassOpacity={glassOpacity}
          textColor={importTokenModalTextColor || textColor}
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
          blurIntensity={blurIntensity}
          glassOpacity={glassOpacity}
          textColor={sendModalTextColor || textColor}
        />
      )}

      <Grid container spacing={2}>
        {isActive && account && (
          <Grid item xs={12}>
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
                  >
                    {ENSName ? ENSName : truncateAddress(account)}
                  </Typography>
                  <CopyIconButton
                    iconButtonProps={{
                      onClick: handleCopy,
                      size: "small",
                      sx: {
                        background: `rgba(255, 255, 255, ${glassOpacity})`,
                        backdropFilter: `blur(${blurIntensity}px) saturate(180%) brightness(110%)`,
                        WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(180%) brightness(110%)`,
                        border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.8)})`,
                        borderRadius: 2,
                        color: textColor,
                        boxShadow: `
                          0 8px 32px rgba(0, 0, 0, 0.1),
                          inset 0 1px 0 rgba(255, 255, 255, 0.2),
                          inset 0 -1px 0 rgba(0, 0, 0, 0.1)
                        `,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden',
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
                        },
                        '&:hover': {
                          transform: 'translateY(-2px) scale(1.05)',
                          background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.9)})`,
                          boxShadow: `
                            0 12px 40px rgba(0, 0, 0, 0.15),
                            inset 0 1px 0 rgba(255, 255, 255, 0.3),
                            inset 0 -1px 0 rgba(0, 0, 0, 0.1)
                          `,
                          border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 1)})`,
                        },
                        '&:active': {
                          transform: 'translateY(-1px) scale(1.02)',
                        }
                      }
                    }}
                    tooltip={ENSName ? ENSName : account}
                  >
                    <FileCopy fontSize="small" sx={{ color: textColor }} />
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
                      color: textColor,
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
        <Grid item xs={12}>
          <Grid container spacing={2} alignItems="center">
            {/* TODO: As a workaround for https://github.com/DexKit/dexkit-monorepo/issues/462#event-17351363710 buy button is hidden */}
            {/* {appConfig.transak?.enabled && ( */}
            {false && (
              <Grid item>
                <TransakWidget />
              </Grid>
            )}

            <Grid item>
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
            <Grid item>
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
            <Grid item>
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

        <Grid item xs={12}>
          <Divider />
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2} alignItems="center">
            <Grid
              item
              xs={isDesktop ? undefined : 12}
              sm={isDesktop ? true : undefined}
            >
              <TextField
                size="small"
                type="search"
                onChange={(ev) => setSearch(ev.currentTarget.value)}
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
            <Grid item xs={isDesktop ? undefined : 12}>
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
          <Grid item xs={12}>
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
          <Grid item xs={12}>
            <NoSsr>
              <GlassWalletBalances
                blurIntensity={blurIntensity}
                glassOpacity={glassOpacity}
                textColor={textColor}
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
                  backgroundColor: `rgba(255, 255, 255, ${glassOpacity})`,
                  textColor: textColor,
                  hoverBackgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.3)})`,
                }}
                handleToggleTable={handleToggleTable}
                isTableVisible={isTableVisible}
                customSettings={customSettings}
              />
            </NoSsr>
          </Grid>
        )}

        {isActive && selectedAssetTab === AssetTabs.NFTs && (
          <Grid item xs={12}>
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
          <Grid item xs={12}>
            {selectedNFTTab === NFTTabs.Collected && (
              <QueryErrorResetBoundary>
                {({ reset }) => (
                  <ErrorBoundary
                    onReset={reset}
                    fallbackRender={({ resetErrorBoundary, error }) => (
                      <Paper sx={{ p: 1 }}>
                        <Stack justifyContent="center" alignItems="center">
                          <Typography variant="h1">
                            <FormattedMessage
                              id="something.went.wrong"
                              defaultMessage="Oops, something went wrong"
                              description="Something went wrong error message"
                            />
                          </Typography>
                          <Typography variant="body1" color="textSecondary">
                            {String(error)}
                          </Typography>
                          <Button
                            color="primary"
                            onClick={resetErrorBoundary}
                          >
                            <FormattedMessage
                              id="try.again"
                              defaultMessage="Try again"
                              description="Try again"
                            />
                          </Button>
                        </Stack>
                      </Paper>
                    )}
                  >
                    <Suspense fallback={<GlassNFTSkeleton count={6} blurIntensity={blurIntensity} glassOpacity={glassOpacity} textColor={textColor} />}>
                      <GlassWalletAssetsSection
                        blurIntensity={blurIntensity}
                        glassOpacity={glassOpacity}
                        textColor={textColor}
                        customSettings={customSettings}
                        filters={{ ...filters, account: account }}
                        onOpenFilters={() => { }}
                        onImport={handleToggleImportAsset}
                        setFilters={setFilters}
                      />
                    </Suspense>
                  </ErrorBoundary>
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
                {({ reset }) => (
                  <ErrorBoundary
                    onReset={reset}
                    fallbackRender={({ resetErrorBoundary, error }) => (
                      <Paper sx={{ p: 1 }}>
                        <Stack justifyContent="center" alignItems="center">
                          <Typography variant="h1">
                            <FormattedMessage
                              id="something.went.wrong"
                              defaultMessage="Oops, something went wrong"
                              description="Something went wrong error message"
                            />
                          </Typography>
                          <Typography variant="body1" color="textSecondary">
                            {String(error)}
                          </Typography>
                          <Button
                            color="primary"
                            onClick={resetErrorBoundary}
                          >
                            <FormattedMessage
                              id="try.again"
                              defaultMessage="Try again"
                              description="Try again"
                            />
                          </Button>
                        </Stack>
                      </Paper>
                    )}
                  >
                    <Suspense fallback={<GlassNFTSkeleton count={6} blurIntensity={blurIntensity} glassOpacity={glassOpacity} textColor={textColor} />}>
                      <GlassHiddenAssetsSection
                        blurIntensity={blurIntensity}
                        glassOpacity={glassOpacity}
                        textColor={textColor}
                        customSettings={customSettings}
                        filters={filters}
                        onOpenFilters={() => { }}
                      />
                    </Suspense>
                  </ErrorBoundary>
                )}
              </QueryErrorResetBoundary>
            )}
          </Grid>
        )}

        <Grid item xs={12}>
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
          <Grid item xs={12}>
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
          <Grid item xs={12}>
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
          <Grid item xs={12}>
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
      .filter((asset) => !isHidden(asset))
      .filter((asset) => {
        return (
          asset.collectionName?.toLowerCase().search(search.toLowerCase()) >
          -1 ||
          (asset.metadata !== undefined &&
            asset.metadata?.name !== undefined &&
            asset.metadata?.name.toLowerCase().search(search.toLowerCase()) >
            -1)
        );
      })
      .filter((asset) => {
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

  const { formatMessage } = useIntl();
  const theme = useTheme();
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
        <Grid item xs={12}>
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
                  id="no.nfts.found"
                  defaultMessage="No NFTs Found"
                />
              </Typography>
              <Typography align="center" variant="body1" sx={{ color: textColor + 'CC' }}>
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

    return filteredAssetList.map((asset, index) => (
      <GlassAssetCard
        asset={asset}
        key={index}
        showControls={true}
        onHide={toggleHidden}
        isHidden={isHidden(asset)}
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
        <Grid item xs={12}>
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
          <Grid item xs={3}>
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

        <Grid container item xs={openFilter ? 9 : 12} sx={{
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
      .filter((asset) => {
        return (
          asset?.collectionName?.toLowerCase().search(search.toLowerCase()) >
          -1 ||
          (asset?.metadata !== undefined &&
            asset?.metadata?.name?.toLowerCase().search(search.toLowerCase()) >
            -1)
        );
      })
      .filter((asset) => {
        if (props.filters?.networks && props.filters?.networks.length) {
          return props.filters.networks.includes(
            getNetworkSlugFromChainId(asset?.chainId) || ""
          );
        }
        return true;
      });
  }, [assetList, props.filters, search, hiddenAssets]);

  const renderAssets = () => {
    if (filteredAssetList.length === 0) {
      return (
        <Grid item xs={12}>
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

    return filteredAssetList.map((asset, index) => (
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
        <Grid item xs={12}>
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
          <Grid item xs={3}>
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

        <Grid container item xs={openFilter ? 9 : 12} sx={{
          display: 'grid !important',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gridAutoRows: 'minmax(300px, auto)',
          gap: 2
        }}>
          {renderAssets()}
        </Grid>
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
        background: `rgba(255, 255, 255, ${glassOpacity})`,
        backdropFilter: `blur(${blurIntensity}px)`,
        border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.3)})`,
        borderRadius: '16px',
        height: '100%',
        boxShadow: `
          0 8px 32px rgba(0, 0, 0, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.2),
          inset 0 -1px 0 rgba(0, 0, 0, 0.1)
        `,
        position: 'relative',
        overflow: 'hidden',
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
          color: textColor + ' !important',
        },
        '& .MuiIconButton-root': {
          color: textColor + ' !important',
        },
        '& .MuiDivider-root': {
          borderColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.3)})`,
        },
        '& .MuiAccordion-root': {
          background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.05, 0.15)})`,
          border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.2)})`,
          borderRadius: '8px !important',
          '&:before': {
            display: 'none',
          },
        },
        '& .MuiAccordionSummary-root': {
          '& .MuiTypography-root': {
            color: textColor + ' !important',
          },
          '& .MuiSvgIcon-root': {
            color: textColor + ' !important',
          },
        },
        '& .MuiFormControl-root': {
          '& .MuiInputLabel-root': {
            color: textColor + 'CC !important',
          },
          '& .MuiOutlinedInput-root': {
            background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.05, 0.15)})`,
            '& fieldset': {
              borderColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.3)})`,
            },
            '&:hover fieldset': {
              borderColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.3, 0.4)})`,
            },
            '&.Mui-focused fieldset': {
              borderColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.4, 0.5)})`,
            },
          },
          '& .MuiSelect-select': {
            color: textColor + ' !important',
          },
          '& .MuiSvgIcon-root': {
            color: textColor + ' !important',
          },
        },
        '& .MuiListItemText-root': {
          '& .MuiTypography-root': {
            color: textColor + ' !important',
          },
        },
        '& .MuiCheckbox-root': {
          color: textColor + ' !important',
          '&.Mui-checked': {
            color: textColor + ' !important',
          },
        },
        '& .MuiMenuItem-root': {
          color: textColor + ' !important',
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