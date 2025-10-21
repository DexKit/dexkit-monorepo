import { GET_EVM_CHAIN_IMAGE } from '@dexkit/core/constants/evmChainImages';
import CheckIcon from '@mui/icons-material/Check';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Info from '@mui/icons-material/Info';
import { useMediaQuery, useTheme } from '@mui/material';

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
  isMobile?: boolean;
}

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

export default function NetworksContainerList({
  networks,
  isEditing,
  activeChainIds,
  excludeEdit,
  onChange,
  onShowInfo,
  isMobile,
}: NetworksContainerListProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMobileView = Boolean(isMobile) || isSmallScreen;

  const getNetworkIcon = (chainId: number) => {
    const customIcon = NETWORK_ICONS[chainId];
    if (customIcon) {
      return customIcon;
    }
    return GET_EVM_CHAIN_IMAGE({ chainId });
  };

  return (
    <Grid container spacing={isMobileView ? 1 : 2}>
      <Grid size={12}>
        <List disablePadding>
          {networks
            .filter((c) => activeChainIds.includes(c.chainId))
            .map((network: any, index: number) => (
              <ListItem
                divider
                key={index}
                sx={{
                  py: isMobileView ? 0.75 : 1,
                  px: isMobileView ? 1 : 2
                }}
              >
                <Stack direction="row" alignItems="center" spacing={isMobileView ? 1 : 2}>
                  <ListItemIcon sx={{ minWidth: isMobileView ? theme.spacing(5) : theme.spacing(7) }}>
                    <Avatar
                      alt={network.name}
                      src={getNetworkIcon(network.chainId)}
                      sx={{
                        width: isMobileView ? theme.spacing(4) : theme.spacing(5),
                        height: isMobileView ? theme.spacing(4) : theme.spacing(5),
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      marginTop: 0,
                      fontSize: isMobileView ? theme.typography.body2.fontSize : undefined,
                      fontWeight: 500
                    }}
                    primary={network.name}
                  />
                  {network?.testnet && (
                    <ListItemIcon sx={{ pl: isMobileView ? 1 : 2 }}>
                      <Chip
                        label={'testnet'}
                        size="small"
                        sx={{
                          height: isMobileView ? theme.spacing(2.5) : theme.spacing(3),
                          '& .MuiChip-label': {
                            px: 0.75,
                            fontSize: isMobileView ? theme.typography.caption.fontSize : theme.typography.body2.fontSize
                          }
                        }}
                      />
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
                      size={isMobileView ? "small" : "medium"}
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
                      size={isMobileView ? "small" : "medium"}
                    >
                      <Info fontSize={isMobileView ? "small" : "medium"} />
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
