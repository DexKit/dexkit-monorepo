import { ChainId } from "@dexkit/core/constants/enums";
import { Avatar, Box, Chip, Grid, useTheme } from "@mui/material";
import { memo } from "react";

import { TOKEN_ICON_URL } from "@dexkit/core/constants";
import { Token } from "@dexkit/core/types";
import { isDexKitToken } from "../../../constants/tokens";

export interface SwapFeaturedUniswapTokensProps {
  chainId?: ChainId;
  onSelect: (token: Token) => void;
  tokens?: Token[];
}

function SwapFeaturedUniswapTokens({
  chainId,
  onSelect,
  tokens,
}: SwapFeaturedUniswapTokensProps) {
  const theme = useTheme();

  if (tokens?.length === 0) {
    return null;
  }

  return (
    <Box px={2}>
      <Grid container spacing={1}>
        {tokens?.map((token, index) => {
          const isKitToken = isDexKitToken(token);

          return (
            <Grid key={index} size="auto">
              <Chip
                icon={
                  <Avatar
                    sx={(theme) => ({
                      height: theme.spacing(2.0),
                      width: theme.spacing(2.0),
                      // Apply invert filter for DexKit token in dark mode
                      ...(isKitToken && theme.palette.mode === 'dark' && {
                        filter: 'invert(1)',
                      })
                    })}
                    src={
                      token.logoURI
                        ? token.logoURI
                        : TOKEN_ICON_URL(token.address, token.chainId)
                    }
                    imgProps={{ sx: { objectFit: "fill" } }}
                  />
                }
                onClick={() => onSelect(token)}
                clickable
                size="small"
                label={token.symbol.toUpperCase()}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default memo(SwapFeaturedUniswapTokens);
