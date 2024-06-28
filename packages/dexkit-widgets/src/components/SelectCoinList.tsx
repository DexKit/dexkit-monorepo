import type { TokenBalances } from "@indexed-finance/multicall";
import TipsAndUpdates from "@mui/icons-material/TipsAndUpdates";

import { Box, List, Stack, Typography } from "@mui/material";

import { memo } from "react";
import { FormattedMessage } from "react-intl";

import { Token } from "@dexkit/core/types";
import SwapSelectCoinListSkeleton from "../widgets/swap/SwapSelectCoinListSkeleton";
import SelectCoinListItem from "./SelectCoinListItem";

export interface SelectCoinListProps {
  tokens: Token[];
  externToken?: Token;
  onSelect: (token: Token) => void;
  tokenBalances?: TokenBalances | null;
  subHeader?: React.ReactNode;
  isLoading: boolean;
}

function SelectCoinList({
  tokens,
  onSelect,
  tokenBalances,
  isLoading,
  subHeader,
  externToken,
}: SelectCoinListProps) {
  if (tokens.length === 0 && !externToken) {
    return (
      <Box py={2}>
        <Stack spacing={2} alignItems="center" justifyContent="center">
          <TipsAndUpdates fontSize="large" />
          <Box>
            <Typography align="center" variant="h5">
              <FormattedMessage id="no.coins" defaultMessage="No coins" />
            </Typography>
            <Typography color="text.secondary" align="center" variant="body1">
              <FormattedMessage
                id="no.coins.found"
                defaultMessage="No coins found"
              />
            </Typography>
          </Box>
        </Stack>
      </Box>
    );
  }

  if (isLoading) {
    return <SwapSelectCoinListSkeleton />;
  }

  if (externToken) {
    return (
      <SelectCoinListItem
        token={externToken}
        isLoading={isLoading}
        onSelect={onSelect}
        tokenBalances={tokenBalances}
        isExtern
      />
    );
  }

  return (
    <List disablePadding subheader={subHeader}>
      {tokens.map((token: Token, index: number) => (
        <SelectCoinListItem
          key={`item-${index}`}
          token={token}
          isLoading={isLoading}
          onSelect={onSelect}
          tokenBalances={tokenBalances}
        />
      ))}
    </List>
  );
}

export default memo(SelectCoinList);
