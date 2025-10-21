import { ChainId } from "@dexkit/core/constants";
import { NETWORKS } from "@dexkit/core/constants/networks";
import { Network } from "@dexkit/core/types";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Radio,
  Stack,
  TextField,
} from "@mui/material";
import { useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useActiveChainIds } from "../../hooks/blockchain";
import { AppDialogTitle } from "../AppDialogTitle";

interface Props {
  dialogProps: DialogProps;
  onChange: (chainId: number) => void;
  selectedChainId?: ChainId;
}

function ChooseNetworkDialog({
  dialogProps,
  onChange,
  selectedChainId,
}: Props) {
  const { onClose } = dialogProps;
  const { activeChainIds } = useActiveChainIds();
  const { formatMessage } = useIntl();

  const [chainId, setChainId] = useState<number | undefined>(selectedChainId);
  const [searchTerm, setSearchTerm] = useState("");

  const handleClose = () => onClose!({}, "backdropClick");

  const handleSwitchNetwork = async () => {
    if (chainId !== undefined) {
      onChange(chainId);
      handleClose();
    }
  };

  const handleSelectNetwork = (id: number) => {
    if (id === chainId) {
      return setChainId(undefined);
    }

    setChainId(id);
  };

  const availableNetworks = useMemo(() => {
    return Object.keys(NETWORKS)
      .filter((k) => Number(k) !== selectedChainId)
      .filter((k) => activeChainIds.includes(Number(k)))
      .filter((k) => !NETWORKS[parseInt(k)].testnet)
      .map((key) => ({ key, network: NETWORKS[parseInt(key)] as Network }));
  }, [activeChainIds, selectedChainId]);

  const filteredNetworks = useMemo(() => {
    if (!searchTerm.trim()) {
      return availableNetworks;
    }

    const lowercaseSearch = searchTerm.toLowerCase();
    return availableNetworks.filter(({ network }: { network: Network }) =>
      network.name.toLowerCase().includes(lowercaseSearch) ||
      network.symbol.toLowerCase().includes(lowercaseSearch)
    );
  }, [availableNetworks, searchTerm]);

  const showSearchBar = availableNetworks.length > 10;

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <Dialog {...dialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="select.network"
            defaultMessage="Select Network"
            description="select network dialog title"
          />
        }
        onClose={handleClose}
      />
      <DialogContent dividers sx={{ p: 0 }}>
        <Stack spacing={2}>
          {showSearchBar && (
            <Box sx={{ p: 2, pb: 0 }}>
              <TextField
                fullWidth
                size="small"
                placeholder={formatMessage({
                  id: "search.networks",
                  defaultMessage: "Search networks..."
                })}
                value={searchTerm}
                onChange={(e: any) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={handleClearSearch}
                        edge="end"
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          )}
          <List disablePadding>
            {filteredNetworks.map(({ key, network }: { key: string, network: Network }, index: number) => (
              <ListItemButton
                selected={network.chainId === chainId}
                key={index}
                onClick={() => handleSelectNetwork(network.chainId)}
              >
                <ListItemIcon>
                  <Box
                    sx={{
                      width: (theme) => theme.spacing(6),
                      display: "flex",
                      alignItems: "center",
                      alignContent: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Avatar
                      src={network.imageUrl}
                      sx={(theme) => ({
                        width: "auto",
                        height: theme.spacing(4),
                      })}
                      alt={network.name}
                    />
                  </Box>
                </ListItemIcon>

                <ListItemText
                  primary={network.name}
                  secondary={network.symbol}
                />
                <ListItemSecondaryAction>
                  <Radio
                    name="chainId"
                    checked={network.chainId === chainId}
                  />
                </ListItemSecondaryAction>
              </ListItemButton>
            ))}
          </List>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSwitchNetwork}
        >
          <FormattedMessage
            id="select"
            defaultMessage="Select"
            description="select"
          />
        </Button>
        <Button onClick={handleClose}>
          <FormattedMessage
            id="cancel"
            defaultMessage="Cancel"
            description="Cancel"
          />
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ChooseNetworkDialog;
