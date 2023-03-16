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
  Typography,
} from "@mui/material";
import { memo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ChainId } from "../constants/enum";
// import { MagicConnector } from '../connectors/magic';
import { NETWORKS } from "../constants/networks";
import { parseChainId } from "../utils";

interface SwitchNetworkSelectProps {
  SelectProps?: SelectProps;
  onChangeNetwork: (chainId: ChainId) => void;
  chainId?: ChainId;
}

function SwitchNetworkSelect({
  SelectProps,
  onChangeNetwork,
  chainId,
}: SwitchNetworkSelectProps) {
  const [isLoading, setIsLoading] = useState(false);

  // const { enqueueSnackbar } = useSnackbar();

  const handleChange = async (e: SelectChangeEvent<unknown>) => {
    onChangeNetwork(parseInt(e.target.value as string));
  };

  return (
    <Select
      {...SelectProps}
      disabled={isLoading}
      value={chainId ? String(chainId) : ""}
      onChange={handleChange}
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
                <Typography component="span">
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
      {Object.keys(NETWORKS)
        .filter((key) => {
          return !NETWORKS[parseChainId(key)].testnet;
        })
        .map((key) => (
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
}

export default memo(SwitchNetworkSelect);
