import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
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
  Typography,
  useTheme,
  useColorScheme,
} from "@mui/material";
import { useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useIsMobile } from "@dexkit/core";
import { NETWORKS } from "@dexkit/core/constants/networks";
import { Network } from "@dexkit/core/types";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { useActiveChainIds, useSwitchNetworkMutation } from "../../hooks";
import { AppDialogTitle } from "../AppDialogTitle";

interface Props {
  dialogProps: DialogProps;
}

function SwitchNetworkDialog({ dialogProps }: Props) {
  const isMobile = useIsMobile();
  const theme = useTheme();
  const intl = useIntl();
  const { mode } = useColorScheme();

  const getBackgroundColor = (isDark: boolean) => {
    if (isDark) {
      return '#1a1a1a';
    }
    return theme.palette.background.paper || '#FAFAFA';
  };

  const getInputBackgroundColor = (isDark: boolean) => {
    if (isDark) {
      return '#2d2d30';
    }
    return theme.palette.background.paper || '#FFFFFF';
  };

  const getButtonBackgroundColor = (isDark: boolean) => {
    if (isDark) {
      return '#2d2d30';
    }
    return theme.palette.primary.main;
  };

  const getButtonTextColor = (isDark: boolean) => {
    if (isDark) {
      return '#ffffff';
    }
    return theme.palette.primary.contrastText || '#ffffff';
  };

  const getCancelButtonColor = (isDark: boolean) => {
    if (isDark) {
      return '#17CB95';
    }
    return theme.palette.primary.main;
  };

  const isDarkMode = mode === 'dark';

  const { onClose } = dialogProps;
  const { activeChainIds } = useActiveChainIds();
  const { chainId: connectedChainId } = useWeb3React();

  const [chainId, setChainId] = useState<number>();
  const [searchQuery, setSearchQuery] = useState("");

  const switchNetworkMutation = useSwitchNetworkMutation();

  const filteredNetworks = useMemo(() => {
    const availableNetworks = Object.keys(NETWORKS)
      .filter((k) => activeChainIds && activeChainIds?.includes(Number(k)))
      .filter((k) => Number(k) !== connectedChainId)
      .filter((k) => !NETWORKS[parseInt(k)].testnet)
      .map((key) => NETWORKS[parseInt(key)] as Network);

    if (!searchQuery.trim()) {
      return availableNetworks;
    }

    return availableNetworks.filter((network) =>
      network.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      network.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeChainIds, connectedChainId, searchQuery]);

  const handleClose = () => onClose!({}, "backdropClick");

  const handleDialogClose = (event: any, reason: string) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      onClose!(event, reason);
    }
  };

  const handleSwitchNetwork = async () => {
    if (chainId !== undefined) {
      await switchNetworkMutation.mutateAsync({ chainId });
      handleClose();
    }
  };

  const handleSelectNetwork = (id: number) => {
    if (id === chainId) {
      return setChainId(undefined);
    }
    setChainId(id);
  };

  const handleReset = () => {
    switchNetworkMutation.reset();
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <Dialog
      {...dialogProps}
      onClose={handleDialogClose}
      fullScreen={isMobile}
      sx={{
        zIndex: 10001,
        '& .MuiDialog-paper': {
          zIndex: 10001,
        },
        '& .MuiBackdrop-root': {
          zIndex: 10000,
        }
      }}
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
            description="Switch network dialog title"
          />
        }
        onClose={handleClose}
        sx={{
          zIndex: 10002,
        }}
      />

      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10002,
          backgroundColor: getBackgroundColor(isDarkMode),
          borderBottom: `1px solid ${theme.palette.divider}`,
          px: isMobile ? theme.spacing(2) : theme.spacing(3),
          py: isMobile ? theme.spacing(1.5) : theme.spacing(2),
          ...(isDarkMode && {
            backgroundColor: '#212529 !important',
          }),
        }}
      >
        <TextField
          fullWidth
          size={isMobile ? "medium" : "small"}
          placeholder={intl.formatMessage({
            id: "search.network",
            defaultMessage: "Search networks by name...",
          })}
          value={searchQuery}
          onChange={(e: any) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  sx={{
                    color: isDarkMode ? '#ffffff' : theme.palette.text.secondary,
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
                    color: isDarkMode ? '#ffffff' : theme.palette.text.secondary,
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
              backgroundColor: getInputBackgroundColor(isDarkMode),
              '& fieldset': {
                borderColor: isDarkMode ? '#404040' : theme.palette.divider,
              },
              '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
              },
              '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
              },
              ...(isDarkMode && {
                backgroundColor: '#2d2d30 !important',
                '& fieldset': {
                  borderColor: '#404040 !important',
                },
              }),
            },
            '& .MuiInputBase-input': {
              color: isDarkMode ? '#ffffff' : theme.palette.text.primary,
              '&::placeholder': {
                color: isDarkMode ? '#ffffff' : theme.palette.text.secondary,
                opacity: 1,
              },
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
              color: isDarkMode ? '#ffffff' : theme.palette.text.secondary,
            }}
          >
            <FormattedMessage
              id="networks.found"
              defaultMessage="{count} {count, plural, one {network} other {networks}} found"
              values={{ count: filteredNetworks.length }}
            />
          </Typography>
        )}
      </Box>

      <DialogContent
        dividers={false}
        sx={{
          p: 0,
          flex: 1,
          overflow: 'auto',
          zIndex: 10002,
        }}
      >
        <Stack spacing={isMobile ? 0 : 1}>
          {switchNetworkMutation.isError && (
            <Box sx={{ p: isMobile ? 2 : 3 }}>
              <Alert severity="error" onClose={handleReset}>
                {switchNetworkMutation.error?.message}
              </Alert>
            </Box>
          )}

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
                  id="no.networks.found"
                  defaultMessage="No networks found matching your search"
                />
              </Typography>
            </Box>
          ) : (
            <List
              disablePadding
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
                  },
                },
              }}
            >
              {filteredNetworks.map((network: any, index: number) => (
                <ListItemButton
                  disabled={switchNetworkMutation.isLoading}
                  selected={network.chainId === chainId}
                  key={network.chainId}
                  onClick={() => handleSelectNetwork(network.chainId)}
                  divider={index < filteredNetworks.length - 1}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: isMobile ? theme.spacing(7) : theme.spacing(6),
                    }}
                  >
                    <Box
                      sx={{
                        width: isMobile ? theme.spacing(6) : theme.spacing(5),
                        display: "flex",
                        alignItems: "center",
                        alignContent: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Avatar
                        src={network.imageUrl}
                        sx={{
                          width: "auto",
                          height: isMobile ? theme.spacing(5) : theme.spacing(4),
                        }}
                        alt={network.name}
                      />
                    </Box>
                  </ListItemIcon>

                  <ListItemText
                    primary={
                      <Typography
                        variant={isMobile ? "body1" : "body2"}
                        sx={{
                          fontWeight: theme.typography.fontWeightMedium,
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
                  <ListItemSecondaryAction>
                    <Radio
                      name="chainId"
                      checked={network.chainId === chainId}
                      size={isMobile ? "medium" : "small"}
                      sx={{
                        color: theme.palette.primary.main,
                        '&.Mui-checked': {
                          color: theme.palette.primary.main,
                        },
                      }}
                    />
                  </ListItemSecondaryAction>
                </ListItemButton>
              ))}
            </List>
          )}
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: isMobile ? theme.spacing(2) : theme.spacing(3),
          py: isMobile ? theme.spacing(2) : theme.spacing(1.5),
          gap: isMobile ? theme.spacing(1) : theme.spacing(0.5),
          backgroundColor: getBackgroundColor(isDarkMode),
          borderTop: `1px solid ${theme.palette.divider}`,
          zIndex: 10002,
          ...(isDarkMode && {
            backgroundColor: '#212529 !important',
          }),
        }}
      >
        <Button
          variant="contained"
          color="primary"
          disabled={switchNetworkMutation.isLoading || chainId === undefined}
          startIcon={
            switchNetworkMutation.isLoading ? (
              <CircularProgress color="inherit" size="1rem" />
            ) : undefined
          }
          onClick={handleSwitchNetwork}
          size={isMobile ? "large" : "medium"}
          sx={{
            flex: isMobile ? 1 : 'none',
            minHeight: isMobile ? theme.spacing(6) : theme.spacing(4.5),
            borderRadius: isMobile ? theme.spacing(1.5) : theme.spacing(1),
            backgroundColor: getButtonBackgroundColor(isDarkMode),
            color: getButtonTextColor(isDarkMode),
            '&:hover': {
              backgroundColor: isDarkMode ? '#404040' : theme.palette.primary.dark,
            },
            '&:disabled': {
              backgroundColor: isDarkMode ? '#212529' : theme.palette.action.disabledBackground,
              color: isDarkMode ? '#9B9B9B' : theme.palette.action.disabled,
            },
            ...(isDarkMode && {
              backgroundColor: '#1976d2 !important',
              color: '#ffffff !important',
              '&:hover': {
                backgroundColor: '#1565c0 !important',
              },
              '&:disabled': {
                backgroundColor: '#212529 !important',
                color: '#9B9B9B !important',
              },
            }),
          }}
        >
          <FormattedMessage
            id="switch"
            defaultMessage="Switch"
            description="switch"
          />
        </Button>
        <Button
          disabled={switchNetworkMutation.isLoading}
          onClick={handleClose}
          size={isMobile ? "large" : "medium"}
          sx={{
            flex: isMobile ? 1 : 'none',
            minHeight: isMobile ? theme.spacing(6) : theme.spacing(4.5),
            borderRadius: isMobile ? theme.spacing(1.5) : theme.spacing(1),
            backgroundColor: isDarkMode ? '#2d2d30' : 'transparent',
            color: getCancelButtonColor(isDarkMode),
            border: isDarkMode ? '1px solid #404040' : `1px solid ${theme.palette.primary.main}`,
            '&:hover': {
              backgroundColor: isDarkMode ? '#404040' : theme.palette.action.hover,
            },
            '&:disabled': {
              backgroundColor: isDarkMode ? '#1a1a1a' : 'transparent',
              color: isDarkMode ? '#9B9B9B' : theme.palette.action.disabled,
              borderColor: isDarkMode ? '#1a1a1a' : theme.palette.action.disabled,
            },
            ...(isDarkMode && {
              backgroundColor: 'transparent !important',
              color: '#1976d2 !important',
              border: 'none !important',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.1) !important',
              },
              '&:disabled': {
                backgroundColor: 'transparent !important',
                color: '#9B9B9B !important',
                borderColor: 'transparent !important',
              },
            }),
          }}
        >
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

export default SwitchNetworkDialog;
