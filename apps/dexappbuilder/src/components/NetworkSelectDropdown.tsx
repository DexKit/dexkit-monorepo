import { useIsMobile } from '@dexkit/core';
import { ChainId } from '@dexkit/core/constants';
import { Network } from '@dexkit/core/types';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectProps } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { NETWORKS } from '../constants/chain';

interface Props {
  chainId?: ChainId;
  activeChainIds: number[];
  labelId?: string;
  onChange: (chainId: ChainId) => void;
  size?: SelectProps['size'];
}

export function NetworkSelectDropdown(props: Props) {
  const { chainId, onChange, labelId, activeChainIds, size: propSize } = props;
  const isMobile = useIsMobile();
  const theme = useTheme();
  const size = propSize || (isMobile ? "small" : "medium");

  return (
    <Select
      labelId={labelId}
      fullWidth
      value={chainId}
      onChange={(ev) => onChange(Number(ev.target.value) as ChainId)}
      name="chainId"
      size={size}
      renderValue={(value) => {
        return (
          <Stack
            direction="row"
            alignItems="center"
            alignContent="center"
            spacing={1}
          >
            <Avatar
              src={NETWORKS[value].imageUrl || ''}
              sx={{
                width: 'auto',
                height: isMobile ? theme.spacing(1.7) : theme.spacing(2)
              }}
            />
            <Typography variant={isMobile ? "body2" : "body1"}>
              {NETWORKS[value].name}
            </Typography>
          </Stack>
        );
      }}
    >
      {Object.keys(NETWORKS)
        .filter((k) => activeChainIds.includes(Number(k)))
        .filter((key) => !NETWORKS[Number(key)].testnet)
        .map((key: any, index: number) => (
          <MenuItem key={index} value={key}>
            <ListItemIcon>
              <Box
                sx={{
                  width: (theme) => theme.spacing(isMobile ? 3 : 4),
                  display: 'flex',
                  alignItems: 'center',
                  alignContent: 'center',
                  justifyContent: 'center',
                }}
              >
                <Avatar
                  src={(NETWORKS[key] as Network)?.imageUrl || ''}
                  sx={{
                    width: 'auto',
                    height: isMobile ? theme.spacing(1.7) : theme.spacing(2),
                  }}
                />
              </Box>
            </ListItemIcon>
            <ListItemText
              primary={NETWORKS[key].name}
              primaryTypographyProps={{
                variant: isMobile ? "body2" : "body1"
              }}
            />
          </MenuItem>
        ))}
    </Select>
  );
}
