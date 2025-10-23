import { ChainId } from "@dexkit/core/constants";
import { NETWORKS } from "@dexkit/core/constants/networks";
import { Network } from "@dexkit/core/types";
import { parseChainId } from "@dexkit/core/utils";
import { FormControl, InputLabel } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React, { useMemo } from "react";

interface Props {
  chainId?: ChainId;
  labelId?: string;
  onChange: (chainId: ChainId) => void;
  enableTestnet?: boolean;
  label?: React.ReactNode;
}

export function NetworkSelectDropdown({
  chainId,
  onChange,
  labelId,
  enableTestnet,
  label,
}: Props) {
  const networks = useMemo(() => {
    return Object.keys(NETWORKS)
      .filter((key) => (enableTestnet ? true : !NETWORKS[Number(key)].testnet))
      .sort((a, b) =>
        NETWORKS[parseChainId(a)].name.localeCompare(
          NETWORKS[parseChainId(b)].name
        )
      );
  }, [enableTestnet]);

  return (
    <FormControl fullWidth>
      <InputLabel shrink>{label}</InputLabel>
      <Select
        labelId={labelId}
        label={label}
        fullWidth
        value={chainId}
        notched
        onChange={(ev) => onChange(Number(ev.target.value) as ChainId)}
        name="chainId"
        renderValue={(value) => {
          return (
            <Stack
              direction="row"
              alignItems="center"
              alignContent="center"
              spacing={1}
            >
              <Avatar
                src={NETWORKS[value].imageUrl || ""}
                style={{ width: "auto", height: "1rem" }}
              />
              <Typography variant="body1" color="text.primary">{NETWORKS[value].name}</Typography>
            </Stack>
          );
        }}
      >
        {networks.map((key: any, index: number) => (
          <MenuItem key={index} value={key}>
            <ListItemIcon>
              <Box
                sx={{
                  width: (theme) => theme.spacing(4),
                  display: "flex",
                  alignItems: "center",
                  alignContent: "center",
                  justifyContent: "center",
                }}
              >
                <Avatar
                  src={(NETWORKS[key] as Network)?.imageUrl || ""}
                  sx={{
                    width: "auto",
                    height: "1rem",
                  }}
                />
              </Box>
            </ListItemIcon>
            <ListItemText
              primary={NETWORKS[key].name}
              primaryTypographyProps={{ color: "text.primary" }}
            />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
