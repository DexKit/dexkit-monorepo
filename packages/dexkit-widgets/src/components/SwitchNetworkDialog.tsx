import { ChainId } from "@dexkit/core/constants/enums";
import { NETWORKS } from "@dexkit/core/constants/networks";
import { useIsMobile } from "@dexkit/core/hooks";
import { AppDialogTitle } from "@dexkit/ui/components";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  DialogProps,
  IconButton,
  InputAdornment,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  ListProps,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { memo, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { parseChainId } from "../utils";

interface SwitchNetworkDialogProps {
  ListProps?: ListProps;
  DialogProps: DialogProps;
  activeChainIds: number[];
  onChangeNetwork: (chainId: ChainId) => void;
  chainId?: ChainId;
}

function SwitchNetworkDialog({
  ListProps,
  DialogProps,
  activeChainIds,
  onChangeNetwork,
  chainId,
}: SwitchNetworkDialogProps) {
  const { onClose } = DialogProps;
  const isMobile = useIsMobile();
  const theme = useTheme();
  const intl = useIntl();

  const [searchQuery, setSearchQuery] = useState("");

  const filteredNetworks = useMemo(() => {
    const availableNetworks = activeChainIds
      .map((key) => ({
        chainId: parseChainId(key),
        network: NETWORKS[parseChainId(key)],
      }))
      .filter(({ network }) => network);

    if (!searchQuery.trim()) {
      return availableNetworks;
    }

    return availableNetworks.filter(({ network }) =>
      network.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      network.symbol?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeChainIds, searchQuery]);

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  const handleChange = async (value: ChainId) => {
    onChangeNetwork(value);
    handleClose();
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <Dialog
      {...DialogProps}
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          ...(isMobile && {
            margin: 0,
            borderRadius: 0,
            maxHeight: '100%',
            height: '100%',
          }),
          ...(!isMobile && {
            minHeight: '60vh',
            maxHeight: '80vh',
            borderRadius: theme.spacing(2),
          }),
        },
      }}
    >
      <AppDialogTitle
        title={
          <FormattedMessage
            id="switch.network"
            defaultMessage="Switch Network"
          />
        }
        onClose={handleClose}
      />

      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: theme.zIndex.appBar,
          backgroundColor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
          px: isMobile ? theme.spacing(2) : theme.spacing(3),
          py: isMobile ? theme.spacing(1.5) : theme.spacing(2),
        }}
      >
        <TextField
          fullWidth
          size={isMobile ? "medium" : "small"}
          placeholder={intl.formatMessage({
            id: "search.network.placeholder",
            defaultMessage: "Search networks by name...",
          })}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: isMobile ? theme.typography.h5.fontSize : theme.typography.body1.fontSize,
                  }}
                />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={handleClearSearch}
                  sx={{
                    color: theme.palette.text.secondary,
                    p: isMobile ? theme.spacing(1) : theme.spacing(0.5),
                  }}
                >
                  <ClearIcon fontSize={isMobile ? "medium" : "small"} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: isMobile ? theme.spacing(1.5) : theme.spacing(1),
            },
          }}
        />

        {searchQuery && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              mt: 1,
              display: 'block',
            }}
          >
            <FormattedMessage
              id="networks.found.count"
              defaultMessage="{count} {count, plural, one {network} other {networks}} found"
              values={{ count: filteredNetworks.length }}
            />
          </Typography>
        )}
      </Box>

      <DialogContent
        sx={{
          p: 0,
          flex: 1,
          overflow: 'auto',
        }}
      >
        {filteredNetworks.length === 0 ? (
          <Box
            sx={{
              py: isMobile ? theme.spacing(4) : theme.spacing(6),
              px: isMobile ? theme.spacing(2) : theme.spacing(3),
              textAlign: 'center',
            }}
          >
            <Typography
              variant="body1"
              color="text.secondary"
            >
              <FormattedMessage
                id="no.networks.found.search"
                defaultMessage="No networks found matching your search"
              />
            </Typography>
          </Box>
        ) : (
          <List
            {...ListProps}
            sx={{
              '& .MuiListItemButton-root': {
                py: isMobile ? theme.spacing(2) : theme.spacing(1.5),
                px: isMobile ? theme.spacing(2) : theme.spacing(3),
                minHeight: isMobile ? theme.spacing(9) : theme.spacing(8),
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
                '&.Mui-selected': {
                  backgroundColor: theme.palette.action.selected,
                  '&:hover': {
                    backgroundColor: theme.palette.action.selected,
                  },
                  borderLeft: `4px solid ${theme.palette.primary.main}`,
                },
              },
            }}
          >
            {filteredNetworks.map(({ chainId: networkChainId, network }, index) => (
              <ListItemButton
                onClick={() => handleChange(networkChainId)}
                selected={networkChainId === chainId}
                key={networkChainId}
                divider={index < filteredNetworks.length - 1}
              >
                <ListItemAvatar
                  sx={{
                    minWidth: isMobile ? theme.spacing(7) : theme.spacing(6),
                  }}
                >
                  <Avatar
                    src={network.imageUrl}
                    sx={{
                      width: isMobile ? theme.spacing(5) : theme.spacing(4),
                      height: isMobile ? theme.spacing(5) : theme.spacing(4),
                    }}
                    alt={network.name}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      variant={isMobile ? "body1" : "body2"}
                      sx={{
                        fontWeight: networkChainId === chainId ? theme.typography.fontWeightBold : theme.typography.fontWeightMedium,
                      }}
                    >
                      {network.name}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant={isMobile ? "body2" : "caption"}
                      color="text.secondary"
                    >
                      {network.symbol}
                    </Typography>
                  }
                />
                {networkChainId === chainId && (
                  <Box
                    sx={{
                      width: theme.spacing(1),
                      height: theme.spacing(1),
                      borderRadius: '50%',
                      backgroundColor: theme.palette.primary.main,
                      mr: 1,
                    }}
                  />
                )}
              </ListItemButton>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default memo(SwitchNetworkDialog);
