import { GET_EVM_CHAIN_IMAGE } from '@dexkit/core/constants/evmChainImages';
import CheckIcon from '@mui/icons-material/Check';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Info from '@mui/icons-material/Info';

import {
  Avatar,
  Checkbox,
  Chip,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
} from '@mui/material';

export interface NetworksContainerListProps {
  networks: any[];
  onChange: (active: number[]) => void;
  isEditing?: boolean;
  activeChainIds: number[];
  excludeEdit: number[];
  onShowInfo: (network: {
    name: string;
    symbol: string;
    chainId: number;
    decimals: number;
  }) => void;
}

export default function NetworksContainerList({
  networks,
  isEditing,
  activeChainIds,
  excludeEdit,
  onChange,
  onShowInfo,
}: NetworksContainerListProps) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <List disablePadding>
          {networks
            .filter((c) => activeChainIds.includes(c.chainId))
            .map((network: any, index: number) => (
              <ListItem divider key={index}>
                <Stack direction="row" alignItems="center">
                  <ListItemIcon>
                    <Avatar
                      alt={network.name}
                      src={GET_EVM_CHAIN_IMAGE({ chainId: network.chainId })}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{ marginTop: 0 }}
                    primary={network.name}
                  />
                  {network?.testnet && (
                    <ListItemIcon sx={{ pl: 2 }}>
                      <Chip label={'testnet'} size="small" />
                    </ListItemIcon>
                  )}
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    display={'none'}
                  >
                    <Chip
                      icon={
                        <CheckIcon
                          sx={{
                            bgcolor: (theme) => theme.palette.action.selected,
                            borderRadius: '50%',
                          }}
                          color="success"
                        />
                      }
                      label="Swap"
                      size="small"
                    />
                    <Chip
                      icon={
                        <CloseRoundedIcon
                          sx={{
                            bgcolor: (theme) => theme.palette.action.selected,
                            borderRadius: '50%',
                          }}
                          color="error"
                        />
                      }
                      label="Exchange"
                      size="small"
                    />
                  </Stack>
                </Stack>
                <ListItemSecondaryAction>
                  {isEditing ? (
                    <Checkbox
                      checked={excludeEdit.includes(network.chainId)}
                      onClick={() => {
                        if (excludeEdit.includes(network.chainId)) {
                          onChange(
                            excludeEdit.filter((n) => n !== network.chainId),
                          );
                        } else {
                          onChange([...excludeEdit, network.chainId]);
                        }
                      }}
                    />
                  ) : (
                    <IconButton
                      onClick={() =>
                        onShowInfo({
                          name: network.name,
                          symbol: network.shortName,
                          chainId: network.chainId,
                          decimals: network.nativeCurrency.decimals,
                        })
                      }
                    >
                      <Info />
                    </IconButton>
                  )}
                </ListItemSecondaryAction>
              </ListItem>
            ))}
        </List>
      </Grid>
    </Grid>
  );
}
