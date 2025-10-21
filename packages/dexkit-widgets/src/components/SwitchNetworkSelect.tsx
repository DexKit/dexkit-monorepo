import { ChainId } from "@dexkit/core/constants/enums";
import { NETWORKS } from "@dexkit/core/constants/networks";
import {
  Avatar,
  CircularProgress,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  SelectProps,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { memo, useState } from "react";
import { FormattedMessage } from "react-intl";

// import { MagicConnector } from '../connectors/magic';

import { ExpandMore } from "@mui/icons-material";
import { parseChainId } from "../utils";

interface SwitchNetworkSelectProps {
  SelectProps?: SelectProps;
  onChangeNetwork: (chainId: ChainId) => void;
  activeChainIds: number[];
  chainId?: ChainId;
  iconOnly?: boolean;
  locked?: boolean;
}

function SwitchNetworkSelect({
  SelectProps,
  onChangeNetwork,
  activeChainIds,
  chainId,
  iconOnly,
  locked = false,
}: SwitchNetworkSelectProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = async (e: SelectChangeEvent<unknown>) => {
    if (!locked) {
      onChangeNetwork(parseInt(e.target.value as string));
    }
  };

  const selectComponent = (
    <Select
      {...SelectProps}
      disabled={isLoading || locked || SelectProps?.disabled}
      value={chainId ? String(chainId) : ""}
      onChange={handleChange}
      sx={{
        borderRadius: 2,
        border: "none",
        opacity: locked ? 0.5 : 1,
        pointerEvents: locked ? 'none' : undefined,
        cursor: locked ? 'not-allowed' : undefined,
        ...SelectProps?.sx
      }}
      IconComponent={(props) => <ExpandMore {...props} sx={{ color: 'text.primary' }} />}
      renderValue={
        chainId
          ? () => (
            <Stack
              spacing={1}
              direction="row"
              alignItems="center"
              alignContent="center"
            >
              {isLoading ? (
                <CircularProgress color="inherit" size="1rem" />
              ) : (
                <Avatar
                  sx={{ width: "1rem", height: "1rem" }}
                  src={
                    NETWORKS[chainId] ? NETWORKS[chainId].imageUrl : undefined
                  }
                />
              )}
              <Typography
                sx={iconOnly ? { width: 0, opacity: "0" } : undefined}
                component="div"
              >
                {isLoading ? (
                  <FormattedMessage
                    id="changing.network"
                    defaultMessage="Changing Network"
                  />
                ) : NETWORKS[chainId] ? (
                  NETWORKS[chainId].name
                ) : undefined}
              </Typography>
            </Stack>
          )
          : undefined
      }
    >
      {activeChainIds.map((key) => (
        <MenuItem value={parseChainId(key)} key={parseChainId(key)}>
          <ListItemIcon>
            <Avatar
              sx={{ width: "1rem", height: "1rem" }}
              src={NETWORKS[parseChainId(key)].imageUrl}
            />
          </ListItemIcon>
          <ListItemText
            primary={
              NETWORKS[parseChainId(key)]
                ? NETWORKS[parseChainId(key)].name
                : undefined
            }
          />
        </MenuItem>
      ))}
    </Select>
  );

  if (locked) {
    return (
      <Tooltip
        title={<FormattedMessage id="locked.network" defaultMessage="Locked network" />}
        arrow
      >
        <span>
          {selectComponent}
        </span>
      </Tooltip>
    );
  }

  return selectComponent;
}

export default memo(SwitchNetworkSelect);
