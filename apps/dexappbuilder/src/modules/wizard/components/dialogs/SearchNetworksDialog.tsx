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

export default function SearchNetworksDialog({
  DialogProps,
  onSelect,
  excludeChainIds,
}: SearchNetworksDialogProps) {
  const { onClose } = DialogProps;
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
      if (selectedNetworks.find((n) => n.chainId === network.chainId)) {
        setSelectedNetworks(
          selectedNetworks.filter((n) => n.chainId !== network.chainId),
        );
      } else {
        setSelectedNetworks(selectedNetworks.concat(network));
      }
    };
  };

  const isSelected = useCallback(
    (network: any) => {
      return selectedNetworks.find((n) => n.chainId === network.chainId);
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
          <Box sx={{ p: 2 }}>
            <TextField
              label="Search"
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              fullWidth
            />
          </Box>
          <Divider />
          {networks && networks.length === 0 && (
            <Stack sx={{ p: 2 }}>
              <Box>
                <Typography textAlign="center" variant="h5">
                  <FormattedMessage
                    id="no.networks"
                    defaultMessage="No networks"
                  />
                </Typography>
                <Typography
                  textAlign="center"
                  variant="body1"
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
                <ListItem key={id}>
                  <Stack direction="row" alignItems={'center'}>
                    <ListItemIcon>
                      <Avatar
                        alt={network.name}
                        src={GET_EVM_CHAIN_IMAGE({ chainId: network.chainId })}
                      />
                    </ListItemIcon>
                    <ListItemText primary={network.name} />
                    {network?.testnet && (
                      <ListItemIcon sx={{ pl: 1 }}>
                        <Chip label={'testnet'} size="small" />
                      </ListItemIcon>
                    )}
                  </Stack>
                  <ListItemSecondaryAction>
                    <Checkbox
                      onClick={handleToggleNetwork(network)}
                      checked={isSelected(network)}
                      value={isSelected(network)}
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
              sx={{ p: 2 }}
            >
              <IconButton disabled={true} onClick={() => {}}>
                <KeyboardArrowLeftIcon />
              </IconButton>
              <IconButton disabled={true} onClick={() => {}}>
                <KeyboardArrowRightIcon />
              </IconButton>
            </Stack>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirm} variant="contained">
          <FormattedMessage id="save" defaultMessage="Save" />
        </Button>
        <Button onClick={handleClose}>
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
