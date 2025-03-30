import {
  Avatar,
  ListItemAvatar,
  ListItemButton,
  ListItemButtonProps,
  ListItemText,
} from '@mui/material';
import { memo } from 'react';
import { EvmTokenList } from '../types';

interface Props {
  list: EvmTokenList;
  onSelect: (list: EvmTokenList) => void;
  ListItemButtonProps?: ListItemButtonProps;
}

function EvmTokenListsListItem({ list, onSelect, ListItemButtonProps }: Props) {
  return (
    <ListItemButton {...ListItemButtonProps} onClick={() => onSelect(list)}>
      <ListItemAvatar>
        <Avatar src={list.icon} />
      </ListItemAvatar>
      <ListItemText primary={list.name} />
    </ListItemButton>
  );
}

export default memo(EvmTokenListsListItem);
