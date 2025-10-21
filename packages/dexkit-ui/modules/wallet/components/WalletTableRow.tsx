import { TOKEN_ICON_URL } from "@dexkit/core/constants";
import { ipfsUriToUrl } from "@dexkit/core/utils";
import { formatUnits } from "@dexkit/core/utils/ethers/formatUnits";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { CurrencyExchange, MoreVert, Send, SwapHoriz } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { FormattedMessage, FormattedNumber } from "react-intl";
import { TokenBalance } from "../types";

interface Props {
  isBalancesVisible: boolean;
  isLoadingCurrency?: boolean;
  tokenBalance: TokenBalance;
  currency: string;
  price?: number;
  onClickTradeCoin?: (tokenBalance: TokenBalance) => void;
  onClickExchangeCoin?: (tokenBalance: TokenBalance) => void;
  onClickSendCoin?: (tokenBalance: TokenBalance) => void;
  swapButtonConfig?: {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    hoverBackgroundColor?: string;
  };
  hideActionsColumn?: boolean;
}

function WalletTableRow({
  tokenBalance,
  isBalancesVisible,
  isLoadingCurrency,
  price,
  currency,
  onClickTradeCoin,
  onClickExchangeCoin,
  onClickSendCoin,
  swapButtonConfig,
  hideActionsColumn = false,
}: Props) {
  const { chainId } = useWeb3React();
  const { token, balance } = tokenBalance;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const balanceUnits = formatUnits(balance || "0", token.decimals);

  const totalInCurrency = (
    <FormattedNumber
      value={(price || 0) * Number(balanceUnits)}
      style={"currency"}
      currency={currency}
    />
  );

  const handleSwapClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClickTradeCoin) {
      onClickTradeCoin(tokenBalance);
    }
    handleCloseMenu();
  };

  const handleExchangeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClickExchangeCoin) {
      onClickExchangeCoin(tokenBalance);
    }
    handleCloseMenu();
  };

  const handleSendClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClickSendCoin) {
      onClickSendCoin(tokenBalance);
    }
    handleCloseMenu();
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const actionButtonStyle = {
    p: 0.5,
    bgcolor: swapButtonConfig?.backgroundColor || 'action.hover',
    color: swapButtonConfig?.textColor || 'text.primary',
    border: swapButtonConfig?.borderColor ? `1px solid ${swapButtonConfig.borderColor}` : 'none',
    '&:hover': {
      bgcolor: swapButtonConfig?.hoverBackgroundColor || 'primary.main',
      color: swapButtonConfig?.textColor || 'primary.contrastText',
    },
    transition: 'all 0.2s ease',
  };

  const menuButtonStyle = {
    p: 0.5,
    bgcolor: swapButtonConfig?.backgroundColor || 'action.hover',
    color: swapButtonConfig?.textColor || 'text.primary',
    border: swapButtonConfig?.borderColor ? `1px solid ${swapButtonConfig.borderColor}` : 'none',
    '&:hover': {
      bgcolor: swapButtonConfig?.hoverBackgroundColor || 'primary.main',
      color: swapButtonConfig?.textColor || 'primary.contrastText',
    },
    transition: 'all 0.2s ease',
    minWidth: '32px',
    height: '32px',
  };

  const renderDesktopActions = () => (
    <Stack direction="row" spacing={1} justifyContent="flex-end">
      {onClickTradeCoin && (
        <Tooltip title={<FormattedMessage id="swap" defaultMessage="Swap" />}>
          <IconButton
            size="small"
            onClick={handleSwapClick}
            sx={actionButtonStyle}
          >
            <SwapHoriz fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {onClickExchangeCoin && (
        <Tooltip title={<FormattedMessage id="exchange" defaultMessage="Exchange" />}>
          <IconButton
            size="small"
            onClick={handleExchangeClick}
            sx={actionButtonStyle}
          >
            <CurrencyExchange fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {onClickSendCoin && (
        <Tooltip title={<FormattedMessage id="send" defaultMessage="Send" />}>
          <IconButton
            size="small"
            onClick={handleSendClick}
            sx={actionButtonStyle}
          >
            <Send fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );

  const renderMobileActions = () => (
    <>
      <IconButton
        size="small"
        onClick={handleMenuClick}
        sx={menuButtonStyle}
        aria-controls={open ? 'token-actions-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <MoreVert fontSize="small" />
      </IconButton>
      <Menu
        id="token-actions-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        MenuListProps={{
          'aria-labelledby': 'token-actions-button',
        }}
        PaperProps={{
          sx: {
            bgcolor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            minWidth: 120,
            boxShadow: theme.shadows[16],
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            background: `linear-gradient(135deg, 
              ${theme.palette.background.paper}f0 0%, 
              ${theme.palette.background.paper}e0 100%)`,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: theme.palette.background.paper,
              opacity: 0.95,
              borderRadius: 'inherit',
              zIndex: -1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {onClickTradeCoin && (
          <MenuItem
            onClick={handleSwapClick}
            sx={{
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
              py: 1.5,
              px: 2,
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
              <SwapHoriz fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={<FormattedMessage id="swap" defaultMessage="Swap" />}
              sx={{
                '& .MuiTypography-root': {
                  fontWeight: 500,
                  fontSize: '0.9rem',
                }
              }}
            />
          </MenuItem>
        )}
        {onClickExchangeCoin && (
          <MenuItem
            onClick={handleExchangeClick}
            sx={{
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
              py: 1.5,
              px: 2,
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
              <CurrencyExchange fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={<FormattedMessage id="exchange" defaultMessage="Exchange" />}
              sx={{
                '& .MuiTypography-root': {
                  fontWeight: 500,
                  fontSize: '0.9rem',
                }
              }}
            />
          </MenuItem>
        )}
        {onClickSendCoin && (
          <MenuItem
            onClick={handleSendClick}
            sx={{
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
              py: 1.5,
              px: 2,
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
              <Send fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={<FormattedMessage id="send" defaultMessage="Send" />}
              sx={{
                '& .MuiTypography-root': {
                  fontWeight: 500,
                  fontSize: '0.9rem',
                }
              }}
            />
          </MenuItem>
        )}
      </Menu>
    </>
  );

  if (isMobile) {
    return (
      <Box sx={{ mb: 2 }}>
        <Card
          sx={{
            bgcolor: 'transparent',
            border: swapButtonConfig?.borderColor ? `1px solid ${swapButtonConfig.borderColor}` : `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            boxShadow: 'none',
          }}
        >
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={2} sx={{ flex: 1, minWidth: 0 }}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      filter: !isBalancesVisible ? 'blur(8px)' : 'none',
                      transition: 'filter 0.3s ease'
                    }}
                    src={
                      token.logoURI
                        ? ipfsUriToUrl(token.logoURI || "")
                        : TOKEN_ICON_URL(token.address, chainId)
                    }
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }} noWrap>
                      {isBalancesVisible ? token.name : "**********"}
                    </Typography>
                    <Typography variant="body2" color="text.primary" noWrap>
                      {isBalancesVisible ? token.symbol : "*****"}
                    </Typography>
                  </Box>
                </Stack>

                {isBalancesVisible && (onClickTradeCoin || onClickExchangeCoin || onClickSendCoin) && (
                  <Box sx={{ flexShrink: 0 }}>
                    {renderMobileActions()}
                  </Box>
                )}
              </Stack>

              <Divider sx={{ borderColor: swapButtonConfig?.borderColor || theme.palette.divider }} />

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" color="text.primary" sx={{ display: 'block' }}>
                    <FormattedMessage id="balance" defaultMessage="Balance" />
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {isBalancesVisible ? (
                      <>
                        <FormattedNumber value={Number(balanceUnits)} /> {token.symbol}
                      </>
                    ) : (
                      "*****"
                    )}
                  </Typography>
                </Box>

                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" color="text.primary" sx={{ display: 'block' }}>
                    <FormattedMessage id="total" defaultMessage="Total" />
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {isLoadingCurrency ? (
                      <Skeleton width={60}>*****</Skeleton>
                    ) : isBalancesVisible ? (
                      totalInCurrency
                    ) : (
                      "*****"
                    )}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <TableRow>
      <TableCell sx={{ width: '45%', minWidth: '200px' }}>
        <Stack
          direction="row"
          alignItems="center"
          alignContent="center"
          spacing={2}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              flexShrink: 0,
              filter: !isBalancesVisible ? 'blur(8px)' : 'none',
              transition: 'filter 0.3s ease'
            }}
            src={
              token.logoURI
                ? ipfsUriToUrl(token.logoURI || "")
                : TOKEN_ICON_URL(token.address, chainId)
            }
          />

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }} noWrap>
              {isBalancesVisible ? token.name : "**********"}
            </Typography>
            <Typography variant="body2" color="text.primary" noWrap>
              {isBalancesVisible ? token.symbol : "*****"}
            </Typography>
          </Box>
        </Stack>
      </TableCell>
      <TableCell sx={{ width: '25%', textAlign: 'right', minWidth: '100px' }}>
        {isLoadingCurrency ? (
          <Skeleton width={80}>*****</Skeleton>
        ) : isBalancesVisible ? (
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {totalInCurrency}
          </Typography>
        ) : (
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            *****
          </Typography>
        )}
      </TableCell>
      <TableCell sx={{ width: '25%', textAlign: 'right', minWidth: '100px' }}>
        {isBalancesVisible ? (
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            <FormattedNumber value={Number(balanceUnits)} /> {token.symbol}
          </Typography>
        ) : (
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            *****
          </Typography>
        )}
      </TableCell>
      {!hideActionsColumn && (
        <TableCell sx={{ width: '5%', textAlign: 'center', minWidth: '80px' }}>
          {isBalancesVisible && (onClickTradeCoin || onClickExchangeCoin || onClickSendCoin) && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              {renderDesktopActions()}
            </Box>
          )}
        </TableCell>
      )}
    </TableRow>
  );
}

export default WalletTableRow;
