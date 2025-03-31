import { getBlockExplorerUrl } from '@/modules/common/utils';

import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import FileCopy from '@mui/icons-material/FileCopy';

import LaunchIcon from '@mui/icons-material/Launch';
import {
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuProps,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { FormattedMessage } from 'react-intl';

interface Props {
  MenuProps: MenuProps;
  onRemove: () => void;
  onEdit: () => void;
  onCopyAddress: () => void;
  onViewBlockExplorer: () => void;
}

export function WalletAccountsMenu({
  MenuProps,
  onRemove,
  onEdit,
  onCopyAddress,
  onViewBlockExplorer,
}: Props) {
  const { chainId, isActive } = useWeb3React();

  return (
    <Menu {...MenuProps}>
      <MenuItem onClick={onCopyAddress}>
        <ListItemIcon>
          <FileCopy />
        </ListItemIcon>
        <ListItemText
          primary={
            <FormattedMessage id="copy.address" defaultMessage="Copy Address" />
          }
        />
      </MenuItem>
      <MenuItem onClick={onEdit}>
        <ListItemIcon>
          <Edit />
        </ListItemIcon>
        <ListItemText
          primary={<FormattedMessage id="edit" defaultMessage="Edit" />}
        />
      </MenuItem>
      {isActive && (
        <MenuItem onClick={onViewBlockExplorer}>
          <ListItemIcon>
            <LaunchIcon />
          </ListItemIcon>
          <ListItemText
            primary={
              <FormattedMessage
                id="view.on.block.explorer"
                defaultMessage="View in Explorer"
              />
            }
            secondary={getBlockExplorerUrl(chainId)}
          />
        </MenuItem>
      )}

      <Divider />
      <MenuItem onClick={onRemove}>
        <ListItemIcon>
          <Delete />
        </ListItemIcon>
        <ListItemText
          primary={<FormattedMessage id="remove" defaultMessage="Remove" />}
        />
      </MenuItem>
    </Menu>
  );
}
