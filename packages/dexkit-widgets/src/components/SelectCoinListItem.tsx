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
  Tooltip
} from "@mui/material";
import { BigNumber, constants } from "ethers";
import { memo } from "react";

import { TOKEN_ICON_URL } from "@dexkit/core/constants";
import { Token } from "@dexkit/core/types";
import Warning from "@mui/icons-material/Warning";
import { FormattedMessage } from "react-intl";
import { formatBigNumber } from "../utils";

export interface SelectCoinListItemProps {
  token: Token;
  onSelect: (token: Token, isExtern?: boolean) => void;
  tokenBalances?: TokenBalances | null;
  isLoading: boolean;
  isExtern?: boolean;
}

function SelectCoinListItem({
  token,
  onSelect,
  tokenBalances,
  isLoading,
  isExtern,
}: SelectCoinListItemProps) {
  const getTokenBalance = () => {
    if (!tokenBalances || !token) {
      return BigNumber.from(0);
    }

    const isNativeToken = token.address.toLowerCase() === ZEROEX_NATIVE_TOKEN_ADDRESS?.toLowerCase();

    const addresses = [
      token.address,
      token.address.toLowerCase(),
    ];

    if (isNativeToken) {
      addresses.push(constants.AddressZero);
    }

    for (const address of addresses) {
      const balance = tokenBalances[address];
      if (balance && !balance.isZero()) {
        return balance;
      }
    }

    return BigNumber.from(0);
  };

  const balance = getTokenBalance();

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
      />
    );
  };

  return (
    <ListItemButton onClick={() => onSelect(token, isExtern)}>
      <ListItemAvatar>{renderAvatar()}</ListItemAvatar>
      <ListItemText
        primary={token.symbol.toUpperCase()}
        secondary={token.name}
      />

      <Box sx={{ mr: 2 }}>
        {isLoading ? (
          <Skeleton>--</Skeleton>
        ) : balance && !balance.isZero() ? (
          formatBigNumber(balance, token.decimals)
        ) : (
          "0.0"
        )}
      </Box>
    </ListItemButton>
  );
}

export default memo(SelectCoinListItem);
