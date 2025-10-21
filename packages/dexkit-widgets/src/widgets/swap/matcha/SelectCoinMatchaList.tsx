import type { TokenBalances } from "@indexed-finance/multicall";
import TipsAndUpdates from "@mui/icons-material/TipsAndUpdates";

import { Box, List, Stack, Typography } from "@mui/material";

import { memo } from "react";
import { FormattedMessage } from "react-intl";

import { Token } from "@dexkit/core/types";
import SwapSelectCoinListSkeleton from "../SwapSelectCoinListSkeleton";
import SelectCoinListMatchaItem from "./SelectCoinListMatchaItem";

export interface SelectCoinListProps {
  tokens: Token[];
  externToken?: Token;
  onSelect: (token: Token, isExtern?: boolean) => void;
  tokenBalances?: TokenBalances | null;
  subHeader?: React.ReactNode;
  isLoading: boolean;
  showDash: boolean;
}

function SelectCoinList({
  tokens,
  onSelect,
  tokenBalances,
  isLoading,
  subHeader,
  externToken,
  showDash,
}: SelectCoinListProps) {
  if (isLoading) {
    return <SwapSelectCoinListSkeleton />;
  }

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

  if (externToken) {
    return (
      <SelectCoinListMatchaItem
        token={externToken}
        isLoading={isLoading}
        onSelect={onSelect}
        tokenBalances={tokenBalances}
        isExtern
        showDash={showDash}
      />
    );
  }

  return (
    <List disablePadding subheader={subHeader}>
      {tokens.map((token: Token, index: number) => (
        <SelectCoinListMatchaItem
          key={`item-${index}`}
          token={token}
          isLoading={isLoading}
          onSelect={onSelect}
          tokenBalances={tokenBalances}
          showDash={showDash}
        />
      ))}
    </List>
  );
}

export default memo(SelectCoinList);
