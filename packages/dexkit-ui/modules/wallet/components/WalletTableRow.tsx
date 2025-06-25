import { TOKEN_ICON_URL } from "@dexkit/core/constants";
import { ipfsUriToUrl } from "@dexkit/core/utils";
import { formatUnits } from "@dexkit/core/utils/ethers/formatUnits";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { CurrencyExchange, SwapHoriz } from "@mui/icons-material";
import {
  Avatar,
  Box,
  IconButton,
  Skeleton,
  Stack,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { FormattedMessage, FormattedNumber } from "react-intl";
import { TokenBalance } from "../types";

interface Props {
  isBalancesVisible: boolean;
  isLoadingCurrency?: boolean;
  tokenBalance: TokenBalance;
  currency: string;
  price?: number;
  onClickTradeCoin?: (tokenBalance: TokenBalance) => void;
  swapButtonConfig?: {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    hoverBackgroundColor?: string;
  };
}

function WalletTableRow({
  tokenBalance,
  isBalancesVisible,
  isLoadingCurrency,
  price,
  currency,
  onClickTradeCoin,
  swapButtonConfig,
}: Props) {
  const { chainId } = useWeb3React();
  const { token, balance } = tokenBalance;

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
  };

  const handleExchangeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement exchange logic
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

  return (
    <TableRow>
      <TableCell sx={{ width: '40%' }}>
        <Stack
          direction="row"
          alignItems="center"
          alignContent="center"
          spacing={2}
        >
          <Avatar
            sx={{
              width: "auto",
              height: "2rem",
              filter: !isBalancesVisible ? 'blur(8px)' : 'none',
              transition: 'filter 0.3s ease'
            }}
            src={
              token.logoURI
                ? ipfsUriToUrl(token.logoURI || "")
                : TOKEN_ICON_URL(token.address, chainId)
            }
          />

          <Box sx={{ flex: 1 }}>
            <Typography variant="body1">
              {isBalancesVisible ? token.name : "**********"}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {isBalancesVisible ? token.symbol : "*****"}
            </Typography>
          </Box>
        </Stack>
      </TableCell>
      <TableCell sx={{ width: '25%' }}>
        {isLoadingCurrency ? (
          <Skeleton>*****</Skeleton>
        ) : isBalancesVisible ? (
          totalInCurrency
        ) : (
          "*****"
        )}
      </TableCell>
      <TableCell sx={{ width: '25%' }}>
        {isBalancesVisible ? (
          <>
            {<FormattedNumber value={Number(balanceUnits)} />} {token.symbol}
          </>
        ) : (
          "*****"
        )}
      </TableCell>
      <TableCell sx={{ width: '10%' }}>
        {isBalancesVisible && onClickTradeCoin && (
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Tooltip title={<FormattedMessage id="swap" defaultMessage="Swap" />}>
              <IconButton
                size="small"
                onClick={handleSwapClick}
                sx={actionButtonStyle}
              >
                <SwapHoriz fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={<FormattedMessage id="exchange" defaultMessage="Exchange" />}>
              <IconButton
                size="small"
                onClick={handleExchangeClick}
                sx={actionButtonStyle}
              >
                <CurrencyExchange fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      </TableCell>
    </TableRow>
  );
}

export default WalletTableRow;
