import { TOKEN_ICON_URL } from "@dexkit/core";
import { Token } from "@dexkit/core/types";
import { getChainName, getNormalizedUrl } from "@dexkit/core/utils";
import {
  Avatar,
  Checkbox,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
} from "@mui/material";
import { useCallback } from "react";
import { isTokenEqual } from "../../utils";

export interface ExchangeTokenListInputProps {
  selectedTokens: {
    [key: string]: Token;
  };
  tokens: Token[];
  onSelect: (token: Token) => void;
}

export default function SelectTokenList({
  selectedTokens,
  tokens,
  onSelect,
}: ExchangeTokenListInputProps) {
  const handleSelect = useCallback(
    (token: Token) => {
      return () => {
        onSelect(token);
      };
    },
    [onSelect],
  );

  return (
    <List disablePadding>
      {tokens.map((token, key) => (
        <ListItemButton divider onClick={handleSelect(token)} key={key}>
          <ListItemAvatar>
            <Avatar
              src={
                token.logoURI
                  ? getNormalizedUrl(token.logoURI)
                  : TOKEN_ICON_URL(token.address, token.chainId)
              }
            />
          </ListItemAvatar>
          <ListItemText
            primary={token.symbol.toUpperCase()}
            secondary={getChainName(token.chainId)}
          />
          <ListItemSecondaryAction>
            <Checkbox
              checked={isTokenEqual(
                selectedTokens[
                  `${token.chainId}-${token.address.toLowerCase()}`
                ],
                token,
              )}
            />
          </ListItemSecondaryAction>
        </ListItemButton>
      ))}
    </List>
  );
}
