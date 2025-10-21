import type { TokenBalances } from "@indexed-finance/multicall";
import {
  Avatar,
  Badge,
  Box,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { BigNumber, constants } from "ethers";
import { memo } from "react";

import { TOKEN_ICON_URL } from "@dexkit/core/constants";
import { Token } from "@dexkit/core/types";
import { formatBigNumber } from "@dexkit/core/utils";
import Warning from "@mui/icons-material/Warning";
import { FormattedMessage } from "react-intl";
import { isDexKitToken } from "../../../constants/tokens";

export interface SelectCoinListMatchaItemProps {
  token: Token;
  onSelect: (token: Token, isExtern?: boolean) => void;
  tokenBalances?: TokenBalances | null;
  isLoading: boolean;
  isExtern?: boolean;
  showDash: boolean;
}

function SelectCoinListMatchaItem({
  token,
  onSelect,
  tokenBalances,
  isLoading,
  isExtern,
  showDash,
}: SelectCoinListMatchaItemProps) {
  const theme = useTheme();

  const getTokenBalance = () => {
    if (!tokenBalances || !token) {
      return BigNumber.from(0);
    }

    const addresses = [
      token.address,
      token.address.toLowerCase(),
      constants.AddressZero,
    ];

    for (const address of addresses) {
      const balance = tokenBalances[address];
      if (balance && !balance.isZero()) {
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
              height: "1.5rem",
              width: "1.5rem",
              ...(isKitToken && theme.palette.mode === 'dark' && {
                filter: 'invert(1)',
              })
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
          height: "1.5rem",
          width: "1.5rem",
          ...(isKitToken && theme.palette.mode === 'dark' && {
            filter: 'invert(1)',
          })
        }}
      />
    );
  };

  return (
    <ListItemButton onClick={() => onSelect(token, isExtern)}>
      <ListItemAvatar>
        <Stack alignItems="center" justifyContent="center">
          {renderAvatar()}
        </Stack>
      </ListItemAvatar>
      <ListItemText
        primary={token.symbol.toUpperCase()}
        secondary={token.name}
        primaryTypographyProps={{ variant: "body2" }}
        secondaryTypographyProps={{ variant: "caption" }}
      />

      <Box sx={{ mr: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {isLoading ? (
            <Skeleton>--</Skeleton>
          ) : balance && !balance.isZero() ? (
            formatBigNumber(balance, token.decimals)
          ) : showDash ? (
            "-.-"
          ) : (
            "0.0"
          )}
        </Typography>
      </Box>
    </ListItemButton>
  );
}

export default memo(SelectCoinListMatchaItem);
