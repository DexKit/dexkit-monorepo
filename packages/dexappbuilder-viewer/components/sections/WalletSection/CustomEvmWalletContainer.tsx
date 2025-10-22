import { QrCodeScanner, Search } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  NoSsr,
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
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import Grid from "@mui/material/Grid";

import { Suspense, useEffect, useMemo, useState } from "react";

import { FormattedMessage, useIntl } from "react-intl";

import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { useAtom } from "jotai";

import Send from "@mui/icons-material/Send";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { copyToClipboard } from "@dexkit/core/utils";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import dynamic from "next/dynamic";

import { NetworkSelectButton } from "@dexkit/ui/components/NetworkSelectButton";

import ImportTokenDialog from "@dexkit/ui/components/dialogs/ImportTokenDialog";
import { useAppConfig, useAuth, useEvmCoins, useSwitchNetworkMutation } from "@dexkit/ui/hooks";
import { useCurrency } from "@dexkit/ui/hooks/currency";
import { useSimpleCoinPricesQuery } from "@dexkit/ui/hooks/currency/useSimpleCoinPricesCurrency";
import UserActivityTable from "@dexkit/ui/modules/wallet/components/UserActivityTable";
import WalletTableRow from "@dexkit/ui/modules/wallet/components/WalletTableRow";
import { WalletTotalBalanceCointainer } from "@dexkit/ui/modules/wallet/components/WalletTotalBalanceContainer";
import { useERC20BalancesQuery, useIsBalanceVisible } from "@dexkit/ui/modules/wallet/hooks";
import { isBalancesVisibleAtom } from "@dexkit/ui/modules/wallet/state";

import { useRouter } from "next/router";

import { ChainId, useIsMobile } from "@dexkit/core";
import { NETWORKS } from "@dexkit/core/constants/networks";
import { convertTokenToEvmCoin, truncateAddress } from "@dexkit/core/utils";
import {
  getChainLogoImage,
  getChainName,
  getNetworkSlugFromChainId
} from "@dexkit/core/utils/blockchain";
import Link from "@dexkit/ui/components/AppLink";
import CloseCircle from "@dexkit/ui/components/icons/CloseCircle";
import Funnel from "@dexkit/ui/components/icons/Filter";
import { useActiveChainIds, useTokenList } from "@dexkit/ui/hooks/blockchain";
import { useWalletConnect } from "@dexkit/ui/hooks/wallet";
import { AssetMedia } from "@dexkit/ui/modules/nft/components/AssetMedia";
import TableSkeleton from "@dexkit/ui/modules/nft/components/tables/TableSkeleton";
import { useAccountAssetsBalance, useHiddenAssets } from "@dexkit/ui/modules/nft/hooks";
import { truncateErc1155TokenId } from "@dexkit/ui/modules/nft/utils";
import { WalletCustomSettings } from "@dexkit/ui/modules/wizard/types/section";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterListIcon from "@mui/icons-material/FilterList";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Card,
  CardActionArea,
  CardContent,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import { QueryErrorResetBoundary } from "@tanstack/react-query";

const EvmReceiveDialog = dynamic(
  () => import("@dexkit/ui/components/dialogs/EvmReceiveDialog")
);

const ScanWalletQrCodeDialog = dynamic(
  async () => import("@dexkit/ui/components/dialogs/ScanWalletQrCodeDialog")
);

const EvmTransferCoinDialog = dynamic(
  () => import("@dexkit/ui/modules/evm-transfer-coin/components/dialogs/EvmSendDialog")
);

const FavoriteAssetsSection = dynamic(
  () => import("@dexkit/ui/components/FavoriteAssetsSection")
);

const ImportAssetDialog = dynamic(
  () => import("@dexkit/ui/components/dialogs/ImportAssetDialog")
);

const TradeContainer = dynamic(
  () => import("./TradeContainer")
);

const ExchangeContainer = dynamic(
  () => import("./ExchangeContainer")
);

enum WalletTabs {
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
  customSettings?: WalletCustomSettings;
  removePadding?: boolean;
}

const CustomTransferCoinButton = ({ customSettings, buttonConfig, fullWidth }: { customSettings?: WalletCustomSettings, buttonConfig?: any, fullWidth?: boolean }) => {
  const [open, setOpen] = useState<boolean>(false);
  const { account, chainId, provider, ENSName } = useWeb3React();
  const tokens = useTokenList({ chainId, includeNative: true });
  const theme = useTheme();

  const buttonStyles = {
    backgroundColor: buttonConfig?.backgroundColor || theme.palette.primary.main,
    color: buttonConfig?.textColor || theme.palette.primary.contrastText,
    borderColor: buttonConfig?.borderColor || theme.palette.primary.main,
    '&:hover': {
      backgroundColor: buttonConfig?.hoverBackgroundColor || theme.palette.primary.dark,
    },
  };

  return (
    <>
      {open && (
        <EvmTransferCoinDialog
          dialogProps={{
            open,
            onClose: () => {
              setOpen(false);
            },
            fullWidth: true,
            maxWidth: "sm",
          }}
          params={{
            ENSName,
            account: account,
            chainId: chainId,
            coins: tokens.map(convertTokenToEvmCoin),
          }}
        />
      )}

      <Button
        onClick={() => setOpen(true)}
        startIcon={<Send />}
        variant="outlined"
        disabled={!account}
        fullWidth={fullWidth}
        sx={buttonStyles}
      >
        <FormattedMessage id="send" defaultMessage="send" />
      </Button>
    </>
  );
};

const CustomWalletTotalBalance = ({ customSettings, chainId, onToggleVisibility, isBalancesVisible }: {
  customSettings?: WalletCustomSettings,
  chainId?: any,
  onToggleVisibility?: () => void,
  isBalancesVisible?: boolean
}) => {
  const theme = useTheme();

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Typography
        variant="h4"
        sx={{
          color: customSettings?.balanceTextColor || theme.palette.text.primary,
          fontSize: { xs: theme.typography.h5.fontSize, sm: theme.typography.h4.fontSize, md: theme.typography.h3.fontSize },
          fontWeight: theme.typography.fontWeightBold,
        }}
      >
        <WalletTotalBalanceCointainer chainId={chainId} />
      </Typography>
      {onToggleVisibility && (
        <IconButton
          onClick={onToggleVisibility}
          sx={{
            color: customSettings?.primaryTextColor || theme.palette.text.primary,
          }}
        >
          {isBalancesVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
        </IconButton>
      )}
    </Stack>
  );
};

const CustomNetworkSelectButton = ({ customSettings, chainId, onChange }: {
  customSettings?: WalletCustomSettings,
  chainId?: any,
  onChange: (chainId: number) => void
}) => {
  const theme = useTheme();

  const networkStyles = {
    '& .MuiButton-root': {
      backgroundColor: `${customSettings?.networkSelectorConfig?.backgroundColor || theme.palette.background.paper} !important`,
      color: `${customSettings?.networkSelectorConfig?.textColor || theme.palette.text.primary} !important`,
      border: `1px solid ${customSettings?.networkSelectorConfig?.borderColor || theme.palette.divider} !important`,
      '&:hover': {
        backgroundColor: `${customSettings?.networkSelectorConfig?.hoverBackgroundColor || theme.palette.action.hover} !important`,
        borderColor: `${customSettings?.networkSelectorConfig?.borderColor || theme.palette.divider} !important`,
      },
      '&:focus': {
        borderColor: `${customSettings?.networkSelectorConfig?.borderColor || theme.palette.divider} !important`,
      },
      '& .MuiTypography-root': {
        color: `${customSettings?.networkSelectorConfig?.textColor || theme.palette.text.primary} !important`,
      },
      '& .MuiSvgIcon-root': {
        color: `${customSettings?.networkSelectorConfig?.textColor || theme.palette.text.primary} !important`,
      },
    },
  };

  return (
    <Box sx={networkStyles}>
      <NetworkSelectButton
        chainId={chainId}
        onChange={onChange}
      />
    </Box>
  );
};

const CustomWalletBalances = ({ customSettings, filter, onClickTradeCoin, onClickExchangeCoin, onClickSendCoin, isTableVisible, handleToggleTable }: {
  customSettings?: WalletCustomSettings,
  filter?: string,
  onClickTradeCoin?: (tokenBalance: any) => void,
  onClickExchangeCoin?: (tokenBalance: any) => void,
  onClickSendCoin?: (tokenBalance: any) => void,
  isTableVisible: boolean,
  handleToggleTable: () => void
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isBalancesVisible = useIsBalanceVisible();
  const tokenBalancesQuery = useERC20BalancesQuery(undefined, ChainId.Base, false);
  const coinPricesQuery = useSimpleCoinPricesQuery({
    includeNative: true,
    chainId: ChainId.Base,
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

  const tableStyles = {
    backgroundColor: 'transparent',
    borderRadius: customSettings?.cardConfig?.borderRadius ? theme.spacing(customSettings.cardConfig.borderRadius / 8) : theme.shape.borderRadius,
    p: theme.spacing(2),
    border: 'none',
    boxShadow: 'none',
  };

  const headerCellStyles = {
    color: customSettings?.tokenTableConfig?.headerTextColor || theme.palette.text.primary,
    fontWeight: 'bold',
    backgroundColor: customSettings?.tokenTableConfig?.headerBackgroundColor || customSettings?.cardConfig?.backgroundColor || theme.palette.background.paper,
  };

  const headerRowStyles = {
    backgroundColor: customSettings?.tokenTableConfig?.headerBackgroundColor || customSettings?.cardConfig?.backgroundColor || theme.palette.background.paper,
    '& .MuiTableCell-root': {
      backgroundColor: customSettings?.tokenTableConfig?.headerBackgroundColor || customSettings?.cardConfig?.backgroundColor || theme.palette.background.paper,
      color: `${customSettings?.tokenTableConfig?.headerTextColor || theme.palette.text.primary} !important`,
      fontWeight: 'bold',
      borderBottom: `2px solid ${customSettings?.tokenTableConfig?.borderColor || theme.palette.divider}`,
    },
  };

  return (
    <Box sx={tableStyles}>
      {isTableVisible && (
        <>
          {isMobile ? (
            <Stack spacing={2} sx={{ mb: 2 }}>
              {tokenBalancesWithPricesFiltered?.map((token: any, index: number) => (
                <Table key={index} sx={{
                  backgroundColor: customSettings?.tokenTableConfig?.rowBackgroundColor || customSettings?.cardConfig?.backgroundColor || theme.palette.background.paper,
                  borderRadius: customSettings?.cardConfig?.borderRadius ? theme.spacing(customSettings.cardConfig.borderRadius / 8) : theme.shape.borderRadius,
                  '& .MuiTableCell-root': {
                    backgroundColor: customSettings?.tokenTableConfig?.rowBackgroundColor || customSettings?.tokenTableConfig?.headerBackgroundColor || customSettings?.cardConfig?.backgroundColor || theme.palette.background.paper,
                    color: `${customSettings?.tokenTableConfig?.rowTextColor || customSettings?.tokenTableConfig?.headerTextColor || theme.palette.text.primary} !important`,
                    borderBottom: `1px solid ${customSettings?.tokenTableConfig?.borderColor || theme.palette.divider}`,
                  },
                }}>
                  <TableBody>
                    <WalletTableRow
                      isLoadingCurrency={coinPricesQuery.isLoading}
                      tokenBalance={token}
                      price={token.price}
                      isBalancesVisible={isBalancesVisible}
                      currency={currency.currency}
                      onClickTradeCoin={customSettings?.visibility?.hideSwapAction ? undefined : onClickTradeCoin}
                      onClickExchangeCoin={customSettings?.visibility?.hideExchangeAction ? undefined : onClickExchangeCoin}
                      onClickSendCoin={customSettings?.visibility?.hideSendAction ? undefined : onClickSendCoin}
                      swapButtonConfig={{
                        backgroundColor: customSettings?.swapButtonConfig?.backgroundColor || theme.palette.action.hover,
                        textColor: customSettings?.swapButtonConfig?.textColor || theme.palette.text.primary,
                        borderColor: customSettings?.swapButtonConfig?.borderColor,
                        hoverBackgroundColor: customSettings?.swapButtonConfig?.hoverBackgroundColor || theme.palette.primary.main,
                      }}
                      hideActionsColumn={customSettings?.visibility?.hideSwapAction && customSettings?.visibility?.hideExchangeAction && customSettings?.visibility?.hideSendAction}
                    />
                  </TableBody>
                </Table>
              ))}
              {coinPricesQuery.isLoading &&
                new Array(4).fill(null).map((_, index) => (
                  <Card key={index} sx={{
                    backgroundColor: customSettings?.tokenTableConfig?.rowBackgroundColor || customSettings?.cardConfig?.backgroundColor || theme.palette.background.paper,
                    border: `1px solid ${customSettings?.cardConfig?.borderColor || customSettings?.tokenTableConfig?.borderColor || theme.palette.divider}`,
                    borderRadius: customSettings?.cardConfig?.borderRadius ? theme.spacing(customSettings.cardConfig.borderRadius / 8) : theme.shape.borderRadius,
                  }}>
                    <CardContent>
                      <Skeleton height={60} sx={{ backgroundColor: `${customSettings?.tokenTableConfig?.rowTextColor || theme.palette.text.secondary}33` }} />
                    </CardContent>
                  </Card>
                ))}
            </Stack>
          ) : (
            <TableContainer sx={{
              borderRadius: customSettings?.cardConfig?.borderRadius ? theme.spacing(customSettings.cardConfig.borderRadius / 8) : theme.shape.borderRadius,
              overflow: 'hidden',
            }}>
              <Table sx={{
                borderRadius: customSettings?.cardConfig?.borderRadius ? theme.spacing(customSettings.cardConfig.borderRadius / 8) : theme.shape.borderRadius,
              }}>
                <TableHead
                  sx={{
                    backgroundColor: customSettings?.tokenTableConfig?.headerBackgroundColor || customSettings?.cardConfig?.backgroundColor || theme.palette.background.paper,
                    borderRadius: customSettings?.cardConfig?.borderRadius ? theme.spacing(customSettings.cardConfig.borderRadius / 8) : theme.shape.borderRadius,
                    '& .MuiTableRow-root:first-of-type .MuiTableCell-root:first-of-type': {
                      borderTopLeftRadius: customSettings?.cardConfig?.borderRadius ? theme.spacing(customSettings.cardConfig.borderRadius / 8) : theme.shape.borderRadius,
                    },
                    '& .MuiTableRow-root:first-of-type .MuiTableCell-root:last-of-type': {
                      borderTopRightRadius: customSettings?.cardConfig?.borderRadius ? theme.spacing(customSettings.cardConfig.borderRadius / 8) : theme.shape.borderRadius,
                    },
                  }}
                >
                  <TableRow sx={headerRowStyles}>
                    <TableCell sx={headerCellStyles}>
                      <FormattedMessage id="token" defaultMessage="Token" />
                    </TableCell>
                    <TableCell sx={headerCellStyles}>
                      <FormattedMessage id="total" defaultMessage="Total" />
                    </TableCell>
                    <TableCell sx={headerCellStyles}>
                      <FormattedMessage id="balance" defaultMessage="Balance" />
                    </TableCell>
                    {!(customSettings?.visibility?.hideSwapAction && customSettings?.visibility?.hideExchangeAction && customSettings?.visibility?.hideSendAction) && (
                      <TableCell sx={headerCellStyles}>
                        <FormattedMessage id="actions" defaultMessage="Actions" />
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody
                  sx={{
                    '& .MuiTableRow-root': {
                      backgroundColor: customSettings?.tokenTableConfig?.rowBackgroundColor || theme.palette.background.default,
                      '&:hover': {
                        backgroundColor: customSettings?.tokenTableConfig?.hoverRowBackgroundColor || theme.palette.action.hover,
                      },
                      '&:last-of-type .MuiTableCell-root:first-of-type': {
                        borderBottomLeftRadius: customSettings?.cardConfig?.borderRadius ? theme.spacing(customSettings.cardConfig.borderRadius / 8) : theme.shape.borderRadius,
                      },
                      '&:last-of-type .MuiTableCell-root:last-of-type': {
                        borderBottomRightRadius: customSettings?.cardConfig?.borderRadius ? theme.spacing(customSettings.cardConfig.borderRadius / 8) : theme.shape.borderRadius,
                      },
                      '& .MuiTableCell-root': {
                        borderColor: customSettings?.tokenTableConfig?.borderColor || theme.palette.divider,
                        '&:first-of-type': {
                          '& .MuiTypography-body1': {
                            color: `${customSettings?.tokenTableConfig?.rowTextColor || theme.palette.text.primary} !important`,
                          },
                          '& .MuiTypography-body2': {
                            color: `${customSettings?.tokenTableConfig?.rowTextColor || theme.palette.text.secondary} !important`,
                          },
                        },
                        '&:nth-of-type(2)': {
                          color: `${customSettings?.tokenTableConfig?.rowTextColor || theme.palette.text.secondary} !important`,
                          '& *': {
                            color: `${customSettings?.tokenTableConfig?.rowTextColor || theme.palette.text.secondary} !important`,
                          },
                        },
                        '&:nth-of-type(3)': {
                          color: `${customSettings?.tokenTableConfig?.rowTextColor || theme.palette.text.secondary} !important`,
                          '& *': {
                            color: `${customSettings?.tokenTableConfig?.rowTextColor || theme.palette.text.secondary} !important`,
                          },
                        },
                        '& .MuiTypography-root': {
                          color: `${customSettings?.tokenTableConfig?.rowTextColor || theme.palette.text.primary} !important`,
                        },
                        '& .MuiSkeleton-root': {
                          backgroundColor: `${customSettings?.tokenTableConfig?.rowTextColor || theme.palette.text.secondary}33`,
                        },
                      },
                    },
                  }}
                >
                  {tokenBalancesWithPricesFiltered?.map((token: any, index: number) => (
                    <WalletTableRow
                      key={index}
                      isLoadingCurrency={coinPricesQuery.isLoading}
                      tokenBalance={token}
                      price={token.price}
                      isBalancesVisible={isBalancesVisible}
                      currency={currency.currency}
                      onClickTradeCoin={customSettings?.visibility?.hideSwapAction ? undefined : onClickTradeCoin}
                      onClickExchangeCoin={customSettings?.visibility?.hideExchangeAction ? undefined : onClickExchangeCoin}
                      onClickSendCoin={customSettings?.visibility?.hideSendAction ? undefined : onClickSendCoin}
                      swapButtonConfig={{
                        backgroundColor: customSettings?.swapButtonConfig?.backgroundColor || theme.palette.action.hover,
                        textColor: customSettings?.swapButtonConfig?.textColor || theme.palette.text.primary,
                        borderColor: customSettings?.swapButtonConfig?.borderColor,
                        hoverBackgroundColor: customSettings?.swapButtonConfig?.hoverBackgroundColor || theme.palette.primary.main,
                      }}
                      hideActionsColumn={customSettings?.visibility?.hideSwapAction && customSettings?.visibility?.hideExchangeAction && customSettings?.visibility?.hideSendAction}
                    />
                  ))}
                  {coinPricesQuery.isLoading &&
                    new Array(4).fill(null).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton sx={{ backgroundColor: `${theme.palette.text.secondary}33` }} />
                        </TableCell>
                        <TableCell>
                          <Skeleton sx={{ backgroundColor: `${theme.palette.text.secondary}33` }} />
                        </TableCell>
                        <TableCell>
                          <Skeleton sx={{ backgroundColor: `${theme.palette.text.secondary}33` }} />
                        </TableCell>
                        {!(customSettings?.visibility?.hideSwapAction && customSettings?.visibility?.hideExchangeAction && customSettings?.visibility?.hideSendAction) && (
                          <TableCell>
                            <Skeleton sx={{ backgroundColor: `${theme.palette.text.secondary}33` }} />
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 0.125,
        cursor: 'pointer',
        width: '100%'
      }} onClick={handleToggleTable}>
        {isTableVisible ? <KeyboardArrowUpIcon sx={{ mr: 1, color: customSettings?.filterConfig?.closeArrowColor || customSettings?.primaryTextColor || theme.palette.text.primary }} /> : <KeyboardArrowDownIcon sx={{ mr: 1, color: customSettings?.filterConfig?.closeArrowColor || customSettings?.primaryTextColor || theme.palette.text.primary }} />}
        <Typography variant="body2" sx={{ fontWeight: 'bold', letterSpacing: 1, color: customSettings?.filterConfig?.closeArrowColor || customSettings?.primaryTextColor || theme.palette.text.primary }}>
          {isTableVisible ? 'CLOSE' : 'OPEN'}
        </Typography>
      </Box>
    </Box>
  );
};

const CustomAssetCard = ({ asset, showControls, onHide, isHidden, onTransfer, customSettings }: any) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const collectionTextColor = customSettings?.nftColors?.collectionColor || customSettings?.cardConfig?.titleTextColor || theme.palette.text.secondary;
  const titleTextColor = customSettings?.nftColors?.titleColor || customSettings?.cardConfig?.subtitleTextColor || theme.palette.text.primary;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const cardStyles = {
    position: "relative",
    height: "100%",
    borderRadius: customSettings?.cardConfig?.borderRadius ? theme.spacing(customSettings.cardConfig.borderRadius / 8) : theme.shape.borderRadius,
    backgroundColor: customSettings?.nftColors?.cardBackgroundColor || customSettings?.cardConfig?.backgroundColor || theme.palette.background.paper,
    border: `1px solid ${customSettings?.nftColors?.cardBorderColor || customSettings?.cardConfig?.borderColor || theme.palette.divider}`,
    boxShadow: customSettings?.cardConfig?.enableShadow ? theme.shadows[2] : 'none',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: customSettings?.cardConfig?.enableHoverEffect ? 'translateY(-2px) scale(1.02)' : 'none',
      boxShadow: customSettings?.cardConfig?.enableShadow ? theme.shadows[4] : 'none',
    }
  };

  const assetDetails = (
    <>
      {asset ? (
        <Box
          sx={{
            position: "relative",
            width: "100%",
            paddingTop: "100%",
            overflow: "hidden",
            borderRadius: customSettings?.cardConfig?.borderRadius ? theme.spacing(customSettings.cardConfig.borderRadius / 8) : theme.shape.borderRadius,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          >
            <AssetMedia asset={asset} />
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            paddingTop: { xs: "60%", sm: "100%" },
            borderRadius: customSettings?.cardConfig?.borderRadius ? theme.spacing(customSettings.cardConfig.borderRadius / 8) : theme.shape.borderRadius,
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
            }}
          />
        </Box>
      )}
      <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
        <Typography
          variant="caption"
          style={{
            color: collectionTextColor
          }}
          sx={{
            color: `${collectionTextColor} !important`,
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            lineHeight: 1.2,
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {asset === undefined ? <Skeleton /> : asset?.collectionName}
        </Typography>
        <Typography
          variant="body2"
          style={{
            fontWeight: 600,
            color: titleTextColor
          }}
          sx={{
            fontWeight: 600,
            color: `${titleTextColor} !important`,
            fontSize: { xs: '0.875rem', sm: '1rem' },
            lineHeight: 1.3,
            mt: 0.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
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
      <Card sx={cardStyles}>
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
              backgroundColor: customSettings?.cardConfig?.controlsBackgroundColor || theme.palette.background.paper,
              boxShadow: theme.shadows[2],
              zIndex: 2,
              '&:hover': {
                backgroundColor: customSettings?.cardConfig?.controlsHoverBackgroundColor || theme.palette.action.hover,
              }
            })}
            onClick={handleClick}
          >
            <MoreVertIcon sx={{ color: customSettings?.cardConfig?.controlsTextColor || theme.palette.text.primary }} />
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
              background: customSettings?.cardConfig?.menuBackgroundColor || theme.palette.background.paper,
              border: `1px solid ${customSettings?.cardConfig?.borderColor || theme.palette.divider}`,
              borderRadius: '8px',
              '& .MuiMenuItem-root': {
                color: customSettings?.cardConfig?.menuTextColor || theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: customSettings?.cardConfig?.menuHoverBackgroundColor || theme.palette.action.hover,
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

const CustomUserActivityTable = ({ customSettings }: { customSettings?: WalletCustomSettings }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const activityStyles = {
    backgroundColor: 'transparent',
    borderRadius: customSettings?.cardConfig?.borderRadius ? theme.spacing(customSettings.cardConfig.borderRadius / 8) : theme.shape.borderRadius,
    p: theme.spacing(2),
    border: 'none',
    boxShadow: 'none',
    '& .MuiTableHead-root .MuiTableCell-root': {
      color: `${customSettings?.activityTableConfig?.headerTextColor || theme.palette.text.primary} !important`,
      fontWeight: 'bold',
      backgroundColor: `${customSettings?.activityTableConfig?.headerBackgroundColor || customSettings?.cardConfig?.backgroundColor || theme.palette.background.paper} !important`,
      borderBottom: `2px solid ${customSettings?.activityTableConfig?.borderColor || theme.palette.divider}`,
    },
    '& .MuiTableBody-root': {
      '& .MuiTableRow-root': {
        backgroundColor: `${customSettings?.activityTableConfig?.rowBackgroundColor || theme.palette.background.default} !important`,
        '&:hover': {
          backgroundColor: `${customSettings?.activityTableConfig?.hoverRowBackgroundColor || theme.palette.action.hover} !important`,
        },
        '& .MuiTableCell-root': {
          color: `${customSettings?.activityTableConfig?.rowTextColor || theme.palette.text.primary} !important`,
          borderColor: `${customSettings?.activityTableConfig?.borderColor || theme.palette.divider} !important`,
          '& .MuiTypography-root': {
            color: `${customSettings?.activityTableConfig?.rowTextColor || theme.palette.text.primary} !important`,
          },
          '& .MuiLink-root': {
            color: `${customSettings?.activityTableConfig?.rowTextColor || theme.palette.text.primary} !important`,
          },
          '& *': {
            color: `${customSettings?.activityTableConfig?.rowTextColor || theme.palette.text.primary} !important`,
          },
        },
      },
    },
    '& .MuiTableFooter-root': {
      backgroundColor: customSettings?.paginationConfig?.backgroundColor || theme.palette.background.paper,
    },
    '& .MuiTablePagination-root': {
      backgroundColor: customSettings?.paginationConfig?.backgroundColor || theme.palette.background.paper,
      color: `${customSettings?.paginationConfig?.textColor || theme.palette.text.primary} !important`,
      borderTop: `1px solid ${customSettings?.activityTableConfig?.borderColor || theme.palette.divider}`,
      '& .MuiTablePagination-toolbar': {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: isMobile ? 'wrap' : 'nowrap',
        minHeight: 52,
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
      },
      '& .MuiTablePagination-spacer': {
        flex: isMobile ? 'none' : '1 1 100%',
      },
      '& .MuiTablePagination-selectLabel': {
        color: `${customSettings?.paginationConfig?.textColor || theme.palette.text.primary} !important`,
        fontSize: theme.typography.body2.fontSize,
        margin: 0,
        flexShrink: 0,
      },
      '& .MuiTablePagination-displayedRows': {
        color: `${customSettings?.paginationConfig?.textColor || theme.palette.text.primary} !important`,
        fontSize: theme.typography.body2.fontSize,
        margin: 0,
        flexShrink: 0,
      },
      '& .MuiTablePagination-select': {
        backgroundColor: `${customSettings?.paginationConfig?.selectBackgroundColor || theme.palette.background.paper} !important`,
        color: `${customSettings?.paginationConfig?.selectTextColor || theme.palette.text.primary} !important`,
        fontSize: theme.typography.body2.fontSize,
        borderRadius: theme.shape.borderRadius,
        border: `1px solid ${customSettings?.activityTableConfig?.borderColor || theme.palette.divider}`,
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(2),
        minWidth: 'auto',
        '&:focus': {
          backgroundColor: `${customSettings?.paginationConfig?.selectBackgroundColor || theme.palette.background.paper} !important`,
        },
        '&:hover': {
          backgroundColor: `${customSettings?.paginationConfig?.buttonHoverColor || theme.palette.action.hover} !important`,
        },
      },
      '& .MuiTablePagination-actions': {
        marginLeft: theme.spacing(1),
        flexShrink: 0,
      },
      '& .MuiIconButton-root': {
        color: `${customSettings?.paginationConfig?.buttonColor || theme.palette.text.primary} !important`,
        padding: theme.spacing(1),
        '&:hover': {
          backgroundColor: `${customSettings?.paginationConfig?.buttonHoverColor || theme.palette.action.hover} !important`,
        },
        '&.Mui-disabled': {
          color: `${theme.palette.text.disabled} !important`,
        },
      },
      '& .MuiSelect-icon': {
        color: `${customSettings?.paginationConfig?.selectTextColor || theme.palette.text.primary} !important`,
      },
      '& .MuiInputBase-root': {
        backgroundColor: `${customSettings?.paginationConfig?.selectBackgroundColor || theme.palette.background.paper} !important`,
      },
      [theme.breakpoints.down('sm')]: {
        '& .MuiTablePagination-toolbar': {
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: theme.spacing(1),
          padding: theme.spacing(1),
        },
        '& .MuiTablePagination-spacer': {
          display: 'none',
        },
        '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
          fontSize: theme.typography.caption.fontSize,
          textAlign: 'center',
        },
        '& .MuiTablePagination-select': {
          margin: '0 auto',
        },
        '& .MuiTablePagination-actions': {
          margin: '0 auto',
        },
      },
    },
  };

  return (
    <Box sx={activityStyles}>
      <UserActivityTable />
    </Box>
  );
};

const CustomWalletAssetsSection = ({ customSettings, filters, setFilters, ...props }: any) => {
  const { account, chainId, signer } = useWeb3React();
  const [openFilter, setOpenFilter] = useState(false);
  const [assetTransfer, setAssetTransfer] = useState<any>();
  const theme = useTheme();

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
      .filter((asset: any) => {
        return props.hiddenOnly ? isHidden(asset) : !isHidden(asset);
      })
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
  }, [assets, props.filters, props.hiddenOnly, search, hiddenAssets]);

  const { formatMessage } = useIntl();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  const handleChange = (e: any) => {
    setSearch(e.target.value);
  };

  const onTransfer = (asset: any) => {
    setAssetTransfer(asset);
  };

  const containerStyles = {
    padding: theme.spacing(2),
    minHeight: '700px',
    maxHeight: '900px',
    overflowY: 'auto',
    '& .MuiTypography-root': {
      color: customSettings?.primaryTextColor || theme.palette.text.primary,
    },
    '& .MuiChip-root': {
      backgroundColor: customSettings?.chipConfig?.backgroundColor || theme.palette.background.default,
      color: customSettings?.chipConfig?.textColor || theme.palette.text.primary,
      border: `1px solid ${customSettings?.chipConfig?.borderColor || theme.palette.divider}`,
    },
    '& .MuiTextField-root .MuiOutlinedInput-root': {
      backgroundColor: customSettings?.tokenSearchConfig?.backgroundColor || theme.palette.background.default,
      '& fieldset': {
        borderColor: customSettings?.tokenSearchConfig?.borderColor || theme.palette.divider,
      },
      '&:hover fieldset': {
        borderColor: customSettings?.tokenSearchConfig?.focusBorderColor || theme.palette.primary.main,
      },
      '& input': {
        color: `${customSettings?.tokenSearchConfig?.textColor || theme.palette.text.primary} !important`,
      },
      '& input::placeholder': {
        color: `${customSettings?.tokenSearchConfig?.placeholderColor || theme.palette.text.secondary} !important`,
        opacity: 1,
      },
    },
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
              <CloseCircle sx={{ color: customSettings?.primaryTextColor || theme.palette.text.primary }} />
              <Typography variant="body1" sx={{ color: customSettings?.primaryTextColor || theme.palette.text.primary }}>
                <FormattedMessage
                  id="no.nfts.found"
                  defaultMessage="No NFTs Found"
                />
              </Typography>
              <Typography align="center" variant="body1" sx={{ color: customSettings?.secondaryTextColor || theme.palette.text.secondary }}>
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

    return filteredAssetList.map((asset: any, index: any) => (
      <Grid size={{ xs: 6, sm: 4, md: 3 }} key={index}>
        <CustomAssetCard
          asset={asset}
          key={index}
          showControls={true}
          onHide={toggleHidden}
          isHidden={isHidden(asset)}
          onTransfer={onTransfer}
          customSettings={customSettings}
        />
      </Grid>
    ));
  };

  return (
    <Box sx={containerStyles}>
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
              sx={{ color: customSettings?.filterConfig?.closeArrowColor || customSettings?.primaryTextColor || theme.palette.text.primary }}
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
                    <Search sx={{ color: customSettings?.tokenSearchConfig?.iconColor || theme.palette.text.primary }} />
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
            />
          </Stack>
        </Grid>
        {openFilter && (
          <Grid size={3}>
            <CustomWalletAssetsFilter
              customSettings={customSettings}
              setFilters={props.setFilters}
              filters={props.filters}
              accounts={props.accounts}
              onClose={() => setOpenFilter(false)}
            />
          </Grid>
        )}

        <Grid container size={openFilter ? 9 : 12}>
          {accountAssetsQuery.isLoading && <TableSkeleton rows={4} />}
          {!accountAssetsQuery.isLoading && renderAssets()}
        </Grid>
      </Grid>
    </Box>
  );
};

const CustomWalletAssetsFilter = ({
  customSettings,
  filters,
  setFilters,
  onClose,
  accounts
}: any) => {
  const { activeChainIds } = useActiveChainIds();
  const theme = useTheme();

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

  const filterStyles = {
    backgroundColor: customSettings?.cardConfig?.backgroundColor || theme.palette.background.paper,
    borderRadius: customSettings?.cardConfig?.borderRadius ? theme.spacing(customSettings.cardConfig.borderRadius / 8) : theme.shape.borderRadius,
    height: '100%',
    boxShadow: customSettings?.cardConfig?.enableShadow ? theme.shadows[1] : 'none',
    border: `1px solid ${customSettings?.cardConfig?.borderColor || theme.palette.divider}`,
    overflow: 'hidden',
    '& .MuiTypography-root': {
      color: `${customSettings?.primaryTextColor || theme.palette.text.primary} !important`,
    },
    '& .MuiIconButton-root': {
      color: `${customSettings?.primaryTextColor || theme.palette.text.primary} !important`,
    },
    '& .MuiDivider-root': {
      borderColor: customSettings?.cardConfig?.borderColor || theme.palette.divider,
    },
    '& .MuiAccordion-root': {
      backgroundColor: customSettings?.cardConfig?.backgroundColor || theme.palette.background.paper,
      border: `1px solid ${customSettings?.cardConfig?.borderColor || theme.palette.divider}`,
      borderRadius: '8px !important',
      '&:before': {
        display: 'none',
      },
    },
    '& .MuiAccordionSummary-root': {
      '& .MuiTypography-root': {
        color: `${customSettings?.primaryTextColor || theme.palette.text.primary} !important`,
      },
      '& .MuiSvgIcon-root': {
        color: `${customSettings?.primaryTextColor || theme.palette.text.primary} !important`,
      },
    },
    '& .MuiFormControl-root': {
      '& .MuiInputLabel-root': {
        color: `${customSettings?.secondaryTextColor || theme.palette.text.secondary} !important`,
      },
      '& .MuiOutlinedInput-root': {
        backgroundColor: customSettings?.tokenSearchConfig?.backgroundColor || theme.palette.background.default,
        '& fieldset': {
          borderColor: customSettings?.tokenSearchConfig?.borderColor || theme.palette.divider,
        },
        '&:hover fieldset': {
          borderColor: customSettings?.tokenSearchConfig?.focusBorderColor || theme.palette.primary.main,
        },
        '&.Mui-focused fieldset': {
          borderColor: customSettings?.tokenSearchConfig?.focusBorderColor || theme.palette.primary.main,
        },
      },
      '& .MuiSelect-select': {
        color: `${customSettings?.primaryTextColor || theme.palette.text.primary} !important`,
      },
      '& .MuiSvgIcon-root': {
        color: `${customSettings?.primaryTextColor || theme.palette.text.primary} !important`,
      },
    },
    '& .MuiListItemText-root': {
      '& .MuiTypography-root': {
        color: `${customSettings?.primaryTextColor || theme.palette.text.primary} !important`,
      },
    },
    '& .MuiCheckbox-root': {
      color: `${customSettings?.primaryTextColor || theme.palette.text.primary} !important`,
      '&.Mui-checked': {
        color: `${customSettings?.primaryTextColor || theme.palette.text.primary} !important`,
      },
    },
    '& .MuiMenuItem-root': {
      color: `${customSettings?.primaryTextColor || theme.palette.text.primary} !important`,
    },
  };

  return (
    <Box sx={filterStyles}>
      <Box sx={{ p: 2 }}>
        <Stack
          direction="row"
          alignItems="center"
          alignContent="center"
          justifyContent="space-between"
        >
          <Stack direction="row" alignItems="center" alignContent="center">
            <Funnel sx={{
              color: customSettings?.filterConfig?.closeArrowColor || customSettings?.primaryTextColor || theme.palette.text.primary,
              mr: 1
            }} />
            <Typography sx={{
              fontWeight: 600,
              color: customSettings?.filterConfig?.closeArrowColor || customSettings?.primaryTextColor || theme.palette.text.primary
            }} variant="subtitle1">
              <FormattedMessage id="filters" defaultMessage="Filters" />
            </Typography>
          </Stack>
          {onClose && (
            <IconButton onClick={onClose}>
              <ArrowBackIcon sx={{
                color: customSettings?.filterConfig?.closeArrowColor || customSettings?.primaryTextColor || theme.palette.text.primary
              }} />
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

const CustomEvmWalletContainer = ({ customSettings, removePadding }: Props) => {
  const appConfig = useAppConfig();
  const { account, isActive, chainId: walletChainId, ENSName } = useWeb3React();
  const [chainId, setChainId] = useState(walletChainId);
  const { formatMessage } = useIntl();
  const evmCoins = useEvmCoins({ defaultChainId: chainId });
  const theme = useTheme();
  const { connectWallet } = useWalletConnect();
  const switchNetworkMutation = useSwitchNetworkMutation();
  const handleConnectWallet = () => {
    connectWallet();
  };
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);
  const { isLoggedIn } = useAuth()
  const [search, setSearch] = useState("");
  const [isBalancesVisible, setIsBalancesVisible] = useAtom(isBalancesVisibleAtom);
  const [isTableVisible, setIsTableVisible] = useState(true);
  const [selectedAssetTab, setSelectedAssetTab] = useState(AssetTabs.Tokens);
  const [selectedNFTTab, setSelectedNFTTab] = useState(NFTTabs.Collected);
  const [selectedCoinForTrade, setSelectedCoinForTrade] = useState<any>(null);
  const [selectedCoinForExchange, setSelectedCoinForExchange] = useState<any>(null);
  const [selectedCoinForSend, setSelectedCoinForSend] = useState<any>(null);

  const [filters, setFilters] = useState({
    myNfts: false,
    chainId: chainId,
    networks: [] as string[],
    account: '' as string,
  });
  const [showImportAsset, setShowImportAsset] = useState(false);

  const handleToggleVisibility = () => {
    setIsBalancesVisible((value) => !value);
  };

  const handleToggleTable = () => {
    setIsTableVisible((value: any) => !value);
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

  const handleOpenReceive = () => {
    setIsReceiveOpen(true);
  };

  const handleCloseReceive = () => {
    setIsReceiveOpen(false);
  };

  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  const handleCloseImportTokenDialog = () => {
    setIsImportDialogOpen(false);
  };

  const handleOpenImportTokenDialog = () => {
    setIsImportDialogOpen(true);
  };

  const handleToggleImportAsset = () => setShowImportAsset((value: any) => !value);

  const handleClickTradeCoin = (tokenBalance: any) => {
    setSelectedCoinForTrade(tokenBalance);
  };

  const handleClickExchangeCoin = (tokenBalance: any) => {
    setSelectedCoinForExchange(tokenBalance);
  };

  const handleClickSendCoin = (tokenBalance: any) => {
    setSelectedCoinForSend(tokenBalance);
  };

  const handleBackFromTrade = () => {
    setSelectedCoinForTrade(null);
  };

  const handleBackFromExchange = () => {
    setSelectedCoinForExchange(null);
  };

  const handleBackFromSend = () => {
    setSelectedCoinForSend(null);
  };

  const handleChangeNetwork = async (newChainId: number) => {
    setChainId(newChainId);

    if (isActive && walletChainId !== newChainId) {
      try {
        await switchNetworkMutation.mutateAsync({ chainId: newChainId });
      } catch (error) {
        console.error('Error switching network:', error);
        setChainId(walletChainId || newChainId);
      }
    }
  };

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
    setFilters((prev: any) => ({ ...prev, chainId: chainId }));
  }, [chainId]);

  useEffect(() => {
    if (shouldHideElement('nfts') && selectedAssetTab === AssetTabs.NFTs) {
      setSelectedAssetTab(AssetTabs.Tokens);
    }
  }, [customSettings?.visibility?.hideNFTs, selectedAssetTab]);

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
    if (customSettings?.backgroundType === 'image') {
      const color = customSettings.backgroundColor || theme.palette.background.default;
      if (customSettings?.backgroundImage) {
        return `${color} url(${customSettings.backgroundImage})`;
      }
      return color;
    } else if (customSettings?.backgroundType === 'solid') {
      return customSettings.backgroundColor || theme.palette.background.default;
    } else if (customSettings?.backgroundType === 'gradient') {
      const from = customSettings?.gradientStartColor || theme.palette.background.default;
      const to = customSettings?.gradientEndColor || theme.palette.background.paper;
      const direction = customSettings?.gradientDirection || 'to bottom';

      const directionMap: Record<string, string> = {
        'to bottom': '180deg',
        'to top': '0deg',
        'to right': '90deg',
        'to left': '270deg',
        'to bottom right': '135deg',
        'to bottom left': '225deg',
      };
      const gradientDirection = directionMap[direction] || '180deg';
      return `linear-gradient(${gradientDirection}, ${from}, ${to})`;
    }
    return theme.palette.background.default;
  };


  const getButtonStyles = (buttonConfig: any) => ({
    backgroundColor: buttonConfig?.backgroundColor || theme.palette.primary.main,
    color: buttonConfig?.textColor || theme.palette.primary.contrastText,
    borderColor: buttonConfig?.borderColor || theme.palette.primary.main,
    '&:hover': {
      backgroundColor: buttonConfig?.hoverBackgroundColor || theme.palette.primary.dark,
    },
  });

  const shouldHideElement = (element: string) => {
    const elementMap: { [key: string]: string } = {
      'nfts': 'NFTs',
      'nft': 'NFTs'
    };

    const configKey = elementMap[element.toLowerCase()] || element.charAt(0).toUpperCase() + element.slice(1);
    return customSettings?.visibility?.[`hide${configKey}` as keyof typeof customSettings.visibility] || false;
  };

  const getLayoutSpacing = () => customSettings?.layout?.spacing || 2;

  const getActionButtonsJustifyContent = () => {
    const alignment = customSettings?.layout?.actionButtonsAlignment || 'left';
    return alignment === 'center' ? 'center' : alignment === 'right' ? 'flex-end' : 'flex-start';
  };

  const getActionButtonsDirection = () => {
    const layout = customSettings?.layout?.actionButtonsLayout || 'horizontal';
    return layout === 'vertical' ? 'column' : 'row';
  };

  const getMainTabIndicatorColor = () => {
    if (selectedAssetTab === AssetTabs.Tokens) {
      return customSettings?.tabsConfig?.tokensIndicatorColor || customSettings?.primaryTextColor || theme.palette.primary.main;
    } else if (selectedAssetTab === AssetTabs.NFTs) {
      return customSettings?.tabsConfig?.nftsIndicatorColor || customSettings?.primaryTextColor || theme.palette.primary.main;
    }
    return customSettings?.primaryTextColor || theme.palette.primary.main;
  };

  const getNFTSubTabIndicatorColor = () => {
    if (selectedNFTTab === NFTTabs.Collected) {
      return customSettings?.tabsConfig?.collectedIndicatorColor || customSettings?.primaryTextColor || theme.palette.primary.main;
    } else if (selectedNFTTab === NFTTabs.Favorites) {
      return customSettings?.tabsConfig?.favoritesIndicatorColor || customSettings?.primaryTextColor || theme.palette.primary.main;
    } else if (selectedNFTTab === NFTTabs.Hidden) {
      return customSettings?.tabsConfig?.hiddenIndicatorColor || customSettings?.primaryTextColor || theme.palette.primary.main;
    }
    return customSettings?.primaryTextColor || theme.palette.primary.main;
  };

  if (selectedCoinForTrade) {
    return (
      <TradeContainer
        selectedCoin={selectedCoinForTrade}
        onBack={handleBackFromTrade}
        customSettings={customSettings}
      />
    );
  }

  if (selectedCoinForExchange) {
    return (
      <ExchangeContainer
        selectedCoin={selectedCoinForExchange}
        onBack={handleBackFromExchange}
        customSettings={customSettings}
      />
    );
  }

  return (
    <Box sx={{
      position: 'relative',
      minHeight: isTableVisible ? '100vh' : 'auto',
      overflow: 'hidden'
    }}>
      <Box
        sx={{
          position: 'absolute',
          zIndex: 0,
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: getContainerBackground(),
          backgroundSize: customSettings?.backgroundSize || 'cover',
          backgroundPosition: customSettings?.backgroundPosition || 'center',
          backgroundRepeat: customSettings?.backgroundRepeat || 'no-repeat',
          backgroundAttachment: customSettings?.backgroundAttachment || 'scroll',
          filter: typeof customSettings?.backgroundBlur === 'number' && customSettings.backgroundBlur > 0 ? `blur(${customSettings.backgroundBlur}px)` : 'none',
          WebkitFilter: typeof customSettings?.backgroundBlur === 'number' && customSettings.backgroundBlur > 0 ? `blur(${customSettings.backgroundBlur}px)` : 'none',
          pointerEvents: 'none',
        }}
      />
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{
          width: '100%',
          overflow: 'hidden',
          ...(removePadding && {
            '& .MuiTableContainer-root': {
              overflowX: 'auto',
              '& .MuiTable-root': {
                minWidth: 'unset',
                width: '100%'
              }
            },
            '& .MuiTextField-root': {
              minWidth: 'unset'
            }
          })
        }}>
          <Container
            maxWidth={removePadding ? false : "md"}
            disableGutters={removePadding}
            sx={{
              pt: removePadding ? (customSettings?.customPadding?.top ?? 2) : 4,
              pb: removePadding ? (customSettings?.customPadding?.bottom ?? 2) : 4,
              pl: removePadding ? 0 : undefined,
              pr: removePadding ? 0 : undefined,
              maxWidth: removePadding ? '100%' : undefined,
              margin: removePadding ? 0 : undefined,
              width: removePadding ? '100%' : undefined,
              overflow: 'hidden'
            }}
          >
            {showQrCode && (
              <ScanWalletQrCodeDialog
                DialogProps={{
                  open: showQrCode,
                  maxWidth: "sm",
                  fullWidth: true,
                  fullScreen: isMobile,
                  onClose: handleOpenQrCodeScannerClose,
                }}
                onResult={handleAddressResult}
              />
            )}

            <EvmReceiveDialog
              dialogProps={{
                open: isReceiveOpen,
                onClose: handleCloseReceive,
                maxWidth: "sm",
                fullWidth: true,
              }}
              receiver={account}
              chainId={chainId}
              coins={evmCoins}
            />

            <ImportTokenDialog
              dialogProps={{
                open: isImportDialogOpen,
                onClose: handleCloseImportTokenDialog,
                maxWidth: "xs",
                fullWidth: true,
              }}
            />

            {showImportAsset && (
              <ImportAssetDialog
                dialogProps={{
                  open: showImportAsset,
                  fullWidth: true,
                  maxWidth: 'xs',
                  onClose: handleToggleImportAsset,
                }}
              />
            )}

            {selectedCoinForSend && selectedCoinForSend.token && (
              <EvmTransferCoinDialog
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
              />
            )}

            <Box sx={removePadding ? {
              pl: customSettings?.customPadding?.left ?? 0,
              pr: customSettings?.customPadding?.right ?? 0,
            } : {}}>
              <Grid container spacing={getLayoutSpacing()}>
                <Grid size={12}>
                  <Grid container spacing={1} sx={{ mb: 2 }} alignItems="center">
                    <Grid size="auto">
                      <Typography
                        variant="h5"
                        sx={{
                          color: customSettings?.primaryTextColor || theme.palette.text.primary,
                          fontWeight: 'bold',
                        }}
                      >
                        <FormattedMessage
                          id="wallet"
                          defaultMessage="Wallet"
                        />
                      </Typography>
                    </Grid>
                    <Grid size="auto" sx={{ ml: "auto" }}>
                      {!shouldHideElement('networkSelector') && (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <CustomNetworkSelectButton
                            customSettings={customSettings}
                            chainId={chainId}
                            onChange={handleChangeNetwork}
                          />
                        </Box>
                      )}
                    </Grid>
                  </Grid>
                </Grid>

                {!shouldHideElement('balance') && (
                  <Grid size={12}>
                    <CustomWalletTotalBalance
                      customSettings={customSettings}
                      chainId={chainId}
                      onToggleVisibility={handleToggleVisibility}
                      isBalancesVisible={isBalancesVisible}
                    />
                  </Grid>
                )}

                <Grid size={12}>
                  <Grid
                    container
                    spacing={getLayoutSpacing()}
                    direction={getActionButtonsDirection() as 'row' | 'column'}
                    justifyContent={getActionButtonsJustifyContent()}
                    alignItems={customSettings?.layout?.actionButtonsLayout === 'vertical' ? (customSettings?.layout?.actionButtonsAlignment === 'center' ? 'center' : customSettings?.layout?.actionButtonsAlignment === 'right' ? 'flex-end' : 'flex-start') : 'center'}
                  >
                    {!shouldHideElement('receiveButton') && (
                      <Grid size={{ xs: customSettings?.layout?.actionButtonsLayout === 'grid' ? 12 : undefined, sm: customSettings?.layout?.actionButtonsLayout === 'grid' ? 4 : undefined }}>
                        <Button
                          onClick={handleOpenReceive}
                          variant="outlined"
                          startIcon={<VerticalAlignBottomIcon />}
                          disabled={!isActive}
                          fullWidth={customSettings?.layout?.actionButtonsLayout === 'vertical' || customSettings?.layout?.actionButtonsLayout === 'grid'}
                          sx={getButtonStyles(customSettings?.receiveButtonConfig)}
                        >
                          <FormattedMessage
                            id="receive"
                            defaultMessage="Receive"
                          />
                        </Button>
                      </Grid>
                    )}
                    {!shouldHideElement('sendButton') && (
                      <Grid size={{ xs: customSettings?.layout?.actionButtonsLayout === 'grid' ? 12 : undefined, sm: customSettings?.layout?.actionButtonsLayout === 'grid' ? 4 : undefined }}>
                        <CustomTransferCoinButton
                          customSettings={customSettings}
                          buttonConfig={customSettings?.sendButtonConfig}
                          fullWidth={customSettings?.layout?.actionButtonsLayout === 'vertical' || customSettings?.layout?.actionButtonsLayout === 'grid'}
                        />
                      </Grid>
                    )}
                    {!shouldHideElement('scanButton') && (
                      <Grid size={{ xs: customSettings?.layout?.actionButtonsLayout === 'grid' ? 12 : undefined, sm: customSettings?.layout?.actionButtonsLayout === 'grid' ? 4 : undefined }}>
                        <Button
                          onClick={handleOpenQrCode}
                          startIcon={<QrCodeScanner />}
                          variant="outlined"
                          fullWidth={customSettings?.layout?.actionButtonsLayout === 'vertical' || customSettings?.layout?.actionButtonsLayout === 'grid'}
                          sx={getButtonStyles(customSettings?.scanButtonConfig)}
                        >
                          <FormattedMessage id="scan" defaultMessage="Scan" />
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </Grid>

                <Grid size={12}>
                  <Divider />
                </Grid>

                {!shouldHideElement('search') && (
                  <Grid size={12}>
                    <Grid container spacing={getLayoutSpacing()} alignItems="center">
                      <Grid
                        size={{ xs: isDesktop ? undefined : 12, sm: isDesktop ? undefined : undefined }}
                      >
                        <TextField
                          size="small"
                          type="search"
                          placeholder="Search tokens..."
                          onChange={(ev: any) => setSearch(ev.currentTarget.value)}
                          fullWidth
                          sx={{
                            backgroundColor: customSettings?.tokenSearchConfig?.backgroundColor || theme.palette.background.default,
                            borderRadius: theme.shape.borderRadius,
                            '& .MuiInputBase-root': {
                              color: `${customSettings?.tokenSearchConfig?.textColor || theme.palette.text.primary} !important`,
                              backgroundColor: `${customSettings?.tokenSearchConfig?.backgroundColor || theme.palette.background.default} !important`,
                            },
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: `${customSettings?.tokenSearchConfig?.borderColor || theme.palette.divider} !important`,
                              },
                              '&:hover fieldset': {
                                borderColor: `${customSettings?.tokenSearchConfig?.focusBorderColor || theme.palette.primary.main} !important`,
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: `${customSettings?.tokenSearchConfig?.focusBorderColor || theme.palette.primary.main} !important`,
                              },
                            },
                            '& .MuiInputBase-input': {
                              color: `${customSettings?.tokenSearchConfig?.textColor || theme.palette.text.primary} !important`,
                              '&::placeholder': {
                                color: `${customSettings?.tokenSearchConfig?.placeholderColor || theme.palette.text.secondary} !important`,
                                opacity: 1,
                              },
                            },
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <Search sx={{
                                  color: `${customSettings?.tokenSearchConfig?.iconColor || customSettings?.tokenSearchConfig?.textColor || theme.palette.text.primary} !important`
                                }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                )}

                {!shouldHideElement('importToken') && (
                  <Grid size={12}>
                    <Grid container spacing={getLayoutSpacing()} justifyContent="flex-end">
                      <Grid size={isDesktop ? "auto" : 12}>
                        <Button
                          onClick={selectedAssetTab === AssetTabs.Tokens ? handleOpenImportTokenDialog : handleToggleImportAsset}
                          variant="outlined"
                          disabled={!isActive}
                          startIcon={<ImportExportIcon />}
                          fullWidth={!isDesktop}
                          sx={getButtonStyles(customSettings?.importTokenButtonConfig)}
                        >
                          <FormattedMessage
                            id={selectedAssetTab === AssetTabs.Tokens ? "import.token" : "import.nft"}
                            defaultMessage={selectedAssetTab === AssetTabs.Tokens ? "Import token" : "Import NFT"}
                          />
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                )}

                {isActive && (
                  <Grid size={12}>
                    <Tabs
                      value={selectedAssetTab}
                      onChange={handleChangeAssetTab}
                      sx={{
                        '& .MuiTabs-indicator': {
                          backgroundColor: getMainTabIndicatorColor(),
                        },
                      }}
                    >
                      <Tab
                        value={AssetTabs.Tokens}
                        label={
                          <FormattedMessage
                            id="tokens"
                            defaultMessage="Tokens"
                          />
                        }
                        sx={{
                          color: selectedAssetTab === AssetTabs.Tokens
                            ? (customSettings?.tabsConfig?.tokensTitleColor || customSettings?.primaryTextColor || theme.palette.primary.main)
                            : (customSettings?.primaryTextColor || theme.palette.text.primary),
                          '&.Mui-selected': {
                            color: customSettings?.tabsConfig?.tokensTitleColor || customSettings?.primaryTextColor || theme.palette.primary.main,
                          },
                        }}
                      />
                      {!shouldHideElement('nfts') && (
                        <Tab
                          value={AssetTabs.NFTs}
                          label={
                            <FormattedMessage
                              id="nfts"
                              defaultMessage="NFTs"
                            />
                          }
                          sx={{
                            color: selectedAssetTab === AssetTabs.NFTs
                              ? (customSettings?.tabsConfig?.nftsTitleColor || customSettings?.primaryTextColor || theme.palette.primary.main)
                              : (customSettings?.primaryTextColor || theme.palette.text.primary),
                            '&.Mui-selected': {
                              color: customSettings?.tabsConfig?.nftsTitleColor || customSettings?.primaryTextColor || theme.palette.primary.main,
                            },
                          }}
                        />
                      )}
                    </Tabs>
                  </Grid>
                )}

                {isActive && selectedAssetTab === AssetTabs.Tokens && (
                  <Grid size={12} sx={{ mb: isTableVisible ? 2 : -1 }}>
                    <CustomWalletBalances
                      customSettings={customSettings}
                      filter={search}
                      onClickTradeCoin={handleClickTradeCoin}
                      onClickExchangeCoin={handleClickExchangeCoin}
                      onClickSendCoin={handleClickSendCoin}
                      isTableVisible={isTableVisible}
                      handleToggleTable={handleToggleTable}
                    />
                  </Grid>
                )}

                {isActive && selectedAssetTab === AssetTabs.NFTs && (
                  <Grid size={12}>
                    <Tabs
                      value={selectedNFTTab}
                      onChange={handleChangeNFTTab}
                      sx={{
                        '& .MuiTabs-indicator': {
                          backgroundColor: getNFTSubTabIndicatorColor(),
                        },
                      }}
                    >
                      <Tab
                        value={NFTTabs.Collected}
                        label={
                          <FormattedMessage
                            id="collected"
                            defaultMessage="Collected"
                          />
                        }
                        sx={{
                          color: selectedNFTTab === NFTTabs.Collected
                            ? (customSettings?.tabsConfig?.collectedTitleColor || customSettings?.primaryTextColor || theme.palette.primary.main)
                            : (customSettings?.primaryTextColor || theme.palette.text.primary),
                          '&.Mui-selected': {
                            color: customSettings?.tabsConfig?.collectedTitleColor || customSettings?.primaryTextColor || theme.palette.primary.main,
                          },
                        }}
                      />
                      <Tab
                        value={NFTTabs.Favorites}
                        label={
                          <FormattedMessage
                            id="favorites"
                            defaultMessage="Favorites"
                          />
                        }
                        sx={{
                          color: selectedNFTTab === NFTTabs.Favorites
                            ? (customSettings?.tabsConfig?.favoritesTitleColor || customSettings?.primaryTextColor || theme.palette.primary.main)
                            : (customSettings?.primaryTextColor || theme.palette.text.primary),
                          '&.Mui-selected': {
                            color: customSettings?.tabsConfig?.favoritesTitleColor || customSettings?.primaryTextColor || theme.palette.primary.main,
                          },
                        }}
                      />
                      <Tab
                        value={NFTTabs.Hidden}
                        label={
                          <FormattedMessage
                            id="hidden"
                            defaultMessage="Hidden"
                          />
                        }
                        sx={{
                          color: selectedNFTTab === NFTTabs.Hidden
                            ? (customSettings?.tabsConfig?.hiddenTitleColor || customSettings?.primaryTextColor || theme.palette.primary.main)
                            : (customSettings?.primaryTextColor || theme.palette.text.primary),
                          '&.Mui-selected': {
                            color: customSettings?.tabsConfig?.hiddenTitleColor || customSettings?.primaryTextColor || theme.palette.primary.main,
                          },
                        }}
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
                            <Suspense fallback={<TableSkeleton rows={4} />}>
                              <CustomWalletAssetsSection
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
                      <FavoriteAssetsSection
                        filters={filters}
                        onOpenFilters={() => { }}
                        onImport={handleToggleImportAsset}
                      />
                    )}

                    {selectedNFTTab === NFTTabs.Hidden && (
                      <QueryErrorResetBoundary>
                        {({ reset }: any) => (
                          <div>
                            <Suspense fallback={<TableSkeleton rows={4} />}>
                              <CustomWalletAssetsSection
                                customSettings={customSettings}
                                filters={filters}
                                onOpenFilters={() => { }}
                                hiddenOnly={true}
                              />
                            </Suspense>
                          </div>
                        )}
                      </QueryErrorResetBoundary>
                    )}
                  </Grid>
                )}

                {isActive && selectedAssetTab === AssetTabs.Tokens && !shouldHideElement('activity') && (
                  <Grid size={12}>
                    <Typography
                      variant={isMobile ? "h6" : "h5"}
                      sx={{
                        color: customSettings?.primaryTextColor || theme.palette.text.primary,
                        fontWeight: 'bold',
                        mb: 2,
                        borderBottom: `2px solid ${customSettings?.primaryTextColor || theme.palette.primary.main}`,
                        pb: 1,
                        display: 'inline-block',
                      }}
                    >
                      <FormattedMessage
                        id="activity"
                        defaultMessage="Activity"
                      />
                    </Typography>
                  </Grid>
                )}

                {isActive && selectedAssetTab === AssetTabs.Tokens && !shouldHideElement('activity') && (
                  <Grid size={12}>
                    <NoSsr>
                      <CustomUserActivityTable customSettings={customSettings} />
                    </NoSsr>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default CustomEvmWalletContainer;