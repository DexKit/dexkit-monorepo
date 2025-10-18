import { truncateAddress } from '@/modules/common/utils';
import { MoreVert } from '@mui/icons-material';
import {
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  Tooltip
} from '@mui/material';
import { memo, MouseEvent } from 'react';
import { Account } from '../types';


import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { FormattedMessage } from 'react-intl';

interface Props {
  account: Account;
  isActive?: boolean;
  onMenu?: (account: Account, anchorEl: HTMLElement) => void;
  divider?: boolean;
}

function WalletAccountsListItem({ account, onMenu, isActive, divider }: Props) {
  const handleMenu = (e: MouseEvent<HTMLButtonElement>) => {
    if (onMenu) {
      onMenu(account, e.currentTarget);
    }
  };


  return (
    <ListItem divider>
      <Stack sx={{ alignItems: 'center', mr: 2 }}>
        <Tooltip
          title={
            isActive ? (
              <FormattedMessage id="connected" defaultMessage="Connected" />
            ) : undefined
          }
        >
          <FiberManualRecordIcon
            fontSize="large"
            sx={
              isActive
                ? (theme) => ({
                  color: theme.palette.success.main,
                })
                : (theme) => ({
                  color: theme.palette.action.hover,
                })
            }
          />
        </Tooltip>
      </Stack>
      <ListItemText
        primary={account.name || truncateAddress(account.address)}
        secondaryTypographyProps={{ component: 'div' }}
        secondary={
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
          >
            {truncateAddress(account.address)}
          </Stack>
        }
      />
      <ListItemSecondaryAction>
        <IconButton onClick={handleMenu}>
          <MoreVert />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export default memo(WalletAccountsListItem);
