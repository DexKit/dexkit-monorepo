import { ChainId } from "@dexkit/core";
import { NETWORKS } from "@dexkit/core/constants/networks";
import { parseChainId } from "@dexkit/core/utils";
import {
  Avatar,
  IconButton,
  Stack,
  Tooltip,
  alpha,
  styled,
} from "@mui/material";
import { useMemo } from "react";

const CustomIconButton = styled(IconButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  p: 0.5,
  backgroundColor: theme.palette.grey[300],
}));

export interface SwapNetworkButtonsProps {
  activeChainIds: number[];
  chainId: number;
  onChangeNetwork: (chainId: ChainId) => void;
}

export default function SwapNetworkButtons({
  activeChainIds,
  chainId,
  onChangeNetwork,
}: SwapNetworkButtonsProps) {
  const networks = useMemo(
    () =>
      Object.keys(NETWORKS)
        .filter((k) => activeChainIds.includes(Number(k)))
        .filter((key) => {
          return !NETWORKS[parseChainId(key)].testnet;
        }),
    [],
  );

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{
        overflowX: "auto",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      {networks.map((key) => (
        <CustomIconButton
          onClick={() => onChangeNetwork(parseInt(key))}
          key={key}
          sx={
            chainId === parseChainId(key)
              ? {
                  border: (theme) => `1px solid ${theme.palette.primary.main}`,
                  backgroundColor: (theme) =>
                    alpha(theme.palette.primary.main, 0.1),
                }
              : undefined
          }
        >
          <Tooltip title={NETWORKS[parseChainId(key)].name}>
            <Avatar
              sx={{ height: "1rem", width: "1rem" }}
              src={
                NETWORKS[parseChainId(key)]
                  ? NETWORKS[parseChainId(key)].imageUrl
                  : undefined
              }
            />
          </Tooltip>
        </CustomIconButton>
      ))}
    </Stack>
  );
}
