import { AppDialogTitle } from '@dexkit/ui';

import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Skeleton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { GET_EVM_CHAIN_IMAGE } from '@dexkit/core/constants/evmChainImages';

import { EVM_CHAINS } from '@dexkit/evm-chains/constants';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

interface SearchNetworksDialogProps {
  DialogProps: DialogProps;
  onSelect: (ids: number[]) => void;
  excludeChainIds: number[];
}

const PAGE_SIZE = 5;

const NETWORK_ICONS: Record<number, string> = {
  592: '/assets/images/icons/astar.png',
  25: '/assets/images/icons/cronos.png',
  100: '/assets/images/icons/gnosis.png',
  13371: '/assets/images/icons/immutable-zkevm.png',
  2222: '/assets/images/icons/kava.png',
  59144: '/assets/images/icons/linea.png',
  5000: '/assets/images/icons/mantle.png',
  1284: '/assets/images/icons/moonbeam.png',
  1101: '/assets/images/icons/polygon-zkevm.png',
  534352: '/assets/images/icons/scroll.png',
  1329: '/assets/images/icons/sei.png',
  146: '/assets/images/icons/sonic.png',
  1923: '/assets/images/icons/swell.png',
  324: '/assets/images/icons/zksync.png',
  314: '/assets/images/icons/filecoin.png',
  33139: '/assets/images/icons/apechain.png',
  33111: '/assets/images/icons/apechain.png',
  14: '/assets/images/icons/flare.png',
  80094: '/assets/images/icons/berachain.png',
  130: '/assets/images/icons/unichain.png'
};

export default function SearchNetworksDialog({
  DialogProps,
  onSelect,
  excludeChainIds,
}: SearchNetworksDialogProps) {
  const { onClose } = DialogProps;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [queryText, setQueryText] = useState('');

  const [selectedNetworks, setSelectedNetworks] = useState<any[]>([]);

  const networks = useMemo(() => {
    if (queryText) {
      return EVM_CHAINS.filter(
        (c) => !excludeChainIds.includes(c.chainId),
      ).filter((c) => {
        return c.name.toLowerCase().includes(queryText.toLowerCase());
      });
    }

    return EVM_CHAINS.filter((c) => !excludeChainIds.includes(c.chainId));
  }, [excludeChainIds]);

  const handleToggleNetwork = (network: any) => {
    return () => {
      if (selectedNetworks.find((n: any) => n.chainId === network.chainId)) {
        setSelectedNetworks(
          selectedNetworks.filter((n: any) => n.chainId !== network.chainId),
        );
      } else {
        setSelectedNetworks(selectedNetworks.concat(network));
      }
    };
  };

  const isSelected = useCallback(
    (network: any) => {
      return selectedNetworks.find((n: any) => n.chainId === network.chainId);
    },
    [selectedNetworks],
  );

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'escapeKeyDown');
      setSelectedNetworks([]);
    }
  };

  const handleConfirm = () => {
    onSelect(selectedNetworks.map((n: any) => n.chainId) as number[]);
    setSelectedNetworks([]);
  };

  const getNetworkIcon = (chainId: number) => {
    const customIcon = NETWORK_ICONS[chainId];
    if (customIcon) {
      return customIcon;
    }
    return GET_EVM_CHAIN_IMAGE({ chainId });
  };

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage id="add.networks" defaultMessage="Add Networks" />
        }
        onClose={handleClose}
      />
      <DialogContent dividers sx={{ p: 0 }}>
        <Stack>
          <Box sx={{ p: isMobile ? theme.spacing(1.5) : theme.spacing(2) }}>
            <TextField
              label="Search"
              value={queryText}
              onChange={(e: any) => setQueryText(e.target.value)}
              fullWidth
              size={isMobile ? "small" : "medium"}
              InputProps={{
                style: {
                  fontSize: isMobile ? theme.typography.body2.fontSize : undefined
                }
              }}
              InputLabelProps={{
                style: {
                  fontSize: isMobile ? theme.typography.body2.fontSize : undefined
                }
              }}
            />
          </Box>
          <Divider />
          {networks && networks.length === 0 && (
            <Stack sx={{ p: isMobile ? theme.spacing(1.5) : theme.spacing(2) }}>
              <Box>
                <Typography textAlign="center" variant={isMobile ? "h6" : "h5"}>
                  <FormattedMessage
                    id="no.networks"
                    defaultMessage="No networks"
                  />
                </Typography>
                <Typography
                  textAlign="center"
                  variant={isMobile ? "body2" : "body1"}
                  color="text.secondary"
                >
                  <FormattedMessage
                    id="no.networks.are.available"
                    defaultMessage="No networks are available"
                  />
                </Typography>
              </Box>
            </Stack>
          )}
          {false && (
            <List>
              {new Array(4).fill(null).map((_, key) => (
                <ListItem key={key}>
                  <ListItemText primary={<Skeleton />} />
                </ListItem>
              ))}
            </List>
          )}

          <List disablePadding>
            {EVM_CHAINS.filter((c) => !excludeChainIds.includes(c.chainId)).map(
              (network, id) => (
                <ListItem key={id} sx={{ px: isMobile ? theme.spacing(1) : theme.spacing(2), py: isMobile ? theme.spacing(0.75) : theme.spacing(1) }}>
                  <Stack direction="row" alignItems={'center'} spacing={isMobile ? theme.spacing(1) : theme.spacing(2)}>
                    <ListItemIcon sx={{ minWidth: isMobile ? theme.spacing(5) : theme.spacing(7) }}>
                      <Avatar
                        alt={network.name}
                        src={getNetworkIcon(network.chainId)}
                        sx={{
                          width: isMobile ? theme.spacing(4) : theme.spacing(5),
                          height: isMobile ? theme.spacing(4) : theme.spacing(5),
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={network.name}
                      primaryTypographyProps={{
                        fontSize: isMobile ? theme.typography.body2.fontSize : undefined,
                        fontWeight: 500
                      }}
                    />
                    {network?.testnet && (
                      <ListItemIcon sx={{ pl: isMobile ? theme.spacing(0.5) : theme.spacing(1), minWidth: 'auto' }}>
                        <Chip
                          label={'testnet'}
                          size="small"
                          sx={{
                            height: isMobile ? theme.spacing(2.5) : theme.spacing(3),
                            '& .MuiChip-label': {
                              px: theme.spacing(0.75),
                              fontSize: isMobile ? theme.typography.caption.fontSize : theme.typography.body2.fontSize
                            }
                          }}
                        />
                      </ListItemIcon>
                    )}
                  </Stack>
                  <ListItemSecondaryAction>
                    <Checkbox
                      onClick={handleToggleNetwork(network)}
                      checked={isSelected(network)}
                      value={isSelected(network)}
                      size={isMobile ? "small" : "medium"}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ),
            )}
          </List>
          <Divider />
          {false && (
            <Stack
              justifyContent="space-between"
              direction="row"
              spacing={2}
              sx={{ p: theme.spacing(2) }}
            >
              <IconButton disabled={true} onClick={() => { }}>
                <KeyboardArrowLeftIcon />
              </IconButton>
              <IconButton disabled={true} onClick={() => { }}>
                <KeyboardArrowRightIcon />
              </IconButton>
            </Stack>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: isMobile ? theme.spacing(2) : theme.spacing(3), py: isMobile ? theme.spacing(1.5) : theme.spacing(2) }}>
        <Button
          onClick={handleConfirm}
          variant="contained"
          size={isMobile ? "small" : "medium"}
          sx={{
            fontSize: isMobile ? theme.typography.body2.fontSize : undefined,
            py: isMobile ? theme.spacing(0.75) : undefined
          }}
        >
          <FormattedMessage id="save" defaultMessage="Save" />
        </Button>
        <Button
          onClick={handleClose}
          size={isMobile ? "small" : "medium"}
          sx={{
            fontSize: isMobile ? theme.typography.body2.fontSize : undefined
          }}
        >
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
