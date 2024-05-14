import { ChainId } from "@dexkit/core/constants/enums";
import { Avatar, Box, Chip, Grid } from "@mui/material";
import { memo } from "react";

import { TOKEN_ICON_URL } from "@dexkit/core/constants";
import { Token } from "@dexkit/core/types";

export interface SwapFeaturedTokensProps {
  chainId?: ChainId;
  onSelect: (token: Token) => void;
  tokens?: Token[];
}

function SwapFeaturedTokens({
  chainId,
  onSelect,
  tokens,
}: SwapFeaturedTokensProps) {
  if (tokens?.length === 0) {
    return null;
  }

  return (
    <Box px={2}>
      <Grid container spacing={1}>
        {tokens?.map((token, index) => (
          <Grid item key={index} wrap="wrap">
            <Chip
              icon={
                <Avatar
                  sx={(theme) => ({
                    height: theme.spacing(2.5),
                    width: theme.spacing(2.5),
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
              label={token.symbol.toUpperCase()}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default memo(SwapFeaturedTokens);
