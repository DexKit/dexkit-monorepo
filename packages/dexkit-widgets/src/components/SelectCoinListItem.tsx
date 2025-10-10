import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "@dexkit/ui/modules/swap/constants";
import type { TokenBalances } from "@indexed-finance/multicall";
import {
  Avatar,
  Badge,
  Box,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Skeleton,
  Tooltip,
  useTheme,
} from "@mui/material";
import { BigNumber, constants } from "ethers";
import { memo } from "react";

import { TOKEN_ICON_URL } from "@dexkit/core/constants";
import { Token } from "@dexkit/core/types";
import Warning from "@mui/icons-material/Warning";
import { FormattedMessage } from "react-intl";
import { isDexKitToken } from "../constants/tokens";
import { formatBigNumber } from "../utils";

export interface SelectCoinListItemProps {
  token: Token;
  onSelect: (token: Token, isExtern?: boolean) => void;
  tokenBalances?: TokenBalances | null;
  isLoading: boolean;
  showDash: boolean;
  isExtern?: boolean;
}

function SelectCoinListItem({
  token,
  onSelect,
  tokenBalances,
  isLoading,
  isExtern,
  showDash,
}: SelectCoinListItemProps) {
  const theme = useTheme();

  const getTokenBalance = () => {
    if (!tokenBalances || !token) {
      return BigNumber.from(0);
    }

    const isNativeToken =
      token.address.toLowerCase() ===
      ZEROEX_NATIVE_TOKEN_ADDRESS?.toLowerCase();

    let balance = tokenBalances[token.address];
    if (balance) {
      return balance;
    }

    balance = tokenBalances[token.address.toLowerCase()];
    if (balance) {
      return balance;
    }

    if (isNativeToken) {
      balance = tokenBalances[constants.AddressZero];
      if (balance) {
        return balance;
      }
    }

    return BigNumber.from(0);
  };

  const balance = getTokenBalance();
  const isKitToken = isDexKitToken(token);

  const renderAvatar = () => {
    if (isExtern) {
      return (
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          badgeContent={
            <Tooltip
              title={
                <FormattedMessage
                  id="this.token.is.not.whitelisted.by.this.app"
                  defaultMessage="This token is not whitelisted by this app"
                />
              }
            >
              <Warning />
            </Tooltip>
          }
        >
          <Avatar
            src={
              token.logoURI
                ? token.logoURI
                : TOKEN_ICON_URL(token.address, token.chainId)
            }
            imgProps={{ sx: { objectFit: "fill" } }}
            sx={{
              ...(isKitToken &&
                theme.palette.mode === "dark" && {
                filter: "invert(1)",
              }),
            }}
          />
        </Badge>
      );
    }

    return (
      <Avatar
        src={
          token.logoURI
            ? token.logoURI
            : TOKEN_ICON_URL(token.address, token.chainId)
        }
        imgProps={{ sx: { objectFit: "fill" } }}
        sx={{
          ...(isKitToken &&
            theme.palette.mode === "dark" && {
            filter: "invert(1)",
          }),
        }}
      />
    );
  };

  return (
    <ListItemButton onClick={() => onSelect(token, isExtern)}>
      <ListItemAvatar>{renderAvatar()}</ListItemAvatar>
      <ListItemText
        primary={token.symbol.toUpperCase()}
        secondary={token.name}
        slotProps={{
          secondary: { color: 'text.primary' }
        }}
      />

      <Box sx={{ mr: 2 }}>
        {isLoading ? (
          <Skeleton>--</Skeleton>
        ) : balance && !balance.isZero() ? (
          formatBigNumber(balance, token.decimals)
        ) : showDash ? (
          "-.-"
        ) : (
          "0.0"
        )}
      </Box>
    </ListItemButton>
  );
}

export default memo(SelectCoinListItem);
