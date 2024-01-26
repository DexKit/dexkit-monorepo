import { ChainId } from "@dexkit/core/constants/enums";

import { parseChainId } from "@dexkit/core/utils";
import { MagicConnector } from "@dexkit/wallet-connectors/connectors/magic";
import { switchNetwork } from "@dexkit/wallet-connectors/utils";
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
import { useWeb3React } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import { useSnackbar } from "notistack";
import { memo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useNetworkMetadata } from "../hooks/app";

interface Props {
  SelectProps?: SelectProps;
}

function MagicNetworkSelect({ SelectProps }: Props) {
  const { connector, chainId } = useWeb3React();
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const { NETWORKS } = useNetworkMetadata();

  const handleChange = async (e: SelectChangeEvent<unknown>) => {
    if (connector instanceof MagicConnector) {
      setIsLoading(true);
      try {
        await connector.changeNetwork(
          parseChainId(e.target.value as string),
          NETWORKS
        );
      } catch (err) {
        enqueueSnackbar(String(err), { variant: "error" });
      }
      setIsLoading(false);
    } else if (connector instanceof MetaMask) {
      setIsLoading(true);
      await switchNetwork(connector, parseChainId(e.target.value as string));
      setIsLoading(false);
    }
  };

  return (
    <Select
      {...SelectProps}
      disabled={isLoading}
      value={chainId || ChainId.Ethereum}
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
                    src={NETWORKS[chainId].imageUrl}
                  />
                )}
                <Typography component="span">
                  {isLoading ? (
                    <FormattedMessage
                      id="changing.network"
                      defaultMessage="Changing Network"
                    />
                  ) : (
                    NETWORKS[chainId].name
                  )}
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
            <ListItemText primary={NETWORKS[parseChainId(key)].name} />
          </MenuItem>
        ))}{" "}
      || <></>
    </Select>
  );
}

export default memo(MagicNetworkSelect);
