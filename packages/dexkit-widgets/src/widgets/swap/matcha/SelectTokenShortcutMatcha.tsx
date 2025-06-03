import type { ChainId } from "@dexkit/core/constants/enums";
import { Token } from "@dexkit/core/types";
import { Avatar, ButtonBase, Stack, useTheme } from "@mui/material";
import { useMemo } from "react";
import { isDexKitToken } from "../../../constants/tokens";
import { useRecentTokens } from "../../../hooks";

export interface SelectTokenShortcutMatchaProps {
  selectedChainId?: ChainId;
  onSelectToken: (token: Token) => void;
  featuredTokensByChain: Token[];
}

export default function SelectTokenShortcutMatcha({
  selectedChainId,
  onSelectToken,
  featuredTokensByChain,
}: SelectTokenShortcutMatchaProps) {
  const theme = useTheme();
  const recentTokens = useRecentTokens();

  const filteredRecentTokens = useMemo(() => {
    if (selectedChainId) {
      return recentTokens.tokens.filter((t) => t.chainId === selectedChainId);
    }
    return [];
  }, [selectedChainId, recentTokens.tokens]);

  const tokens = useMemo(() => {
    if (filteredRecentTokens.length >= 3) {
      return filteredRecentTokens.slice(0, 3);
    }

    if (featuredTokensByChain.length >= 3) {
      return featuredTokensByChain.slice(0, 3);
    }

    return [];
  }, [featuredTokensByChain, filteredRecentTokens]);

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      {tokens.map((t, key) => {
        const isKitToken = isDexKitToken(t);

        return (
          <ButtonBase
            key={key}
            onClick={() => onSelectToken(t)}
            sx={(theme) => ({
              background:
                theme.palette.mode === "dark"
                  ? theme.palette.background.default
                  : theme.palette.grey[300],
              height: theme.spacing(4),
              width: theme.spacing(4),
              borderRadius: "50%",
              p: 1,
            })}
          >
            <Avatar
              src={t.logoURI}
              imgProps={{ sx: { objectFit: "fill" } }}
              sx={(theme) => ({
                height: theme.spacing(3),
                width: theme.spacing(3),
                ...(isKitToken && theme.palette.mode === 'dark' && {
                  filter: 'invert(1)',
                })
              })}
            />
          </ButtonBase>
        );
      })}
    </Stack>
  );
}
