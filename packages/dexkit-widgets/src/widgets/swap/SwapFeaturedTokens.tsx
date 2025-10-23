import { ChainId } from "@dexkit/core/constants/enums";
import { Avatar, Box, Chip, Grid, useTheme } from "@mui/material";
import { memo } from "react";

import { TOKEN_ICON_URL } from "@dexkit/core/constants";
import { Token } from "@dexkit/core/types";
import { isDexKitToken } from "../../constants/tokens";

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
                      height: theme.spacing(2.5),
                      width: theme.spacing(2.5),
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
                label={token.symbol.toUpperCase()}
                sx={{
                  color: 'text.primary',
                  '& .MuiChip-label': {
                    color: 'text.primary'
                  }
                }}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default memo(SwapFeaturedTokens);
