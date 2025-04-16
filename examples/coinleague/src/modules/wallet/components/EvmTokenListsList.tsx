import { List, ListProps } from '@mui/material';
import { EvmTokenList } from '../types';
import EvmTokenListsListItem from './EvmTokenListsListItem';

interface Props {
  ListProps?: ListProps;
  tokenLists: EvmTokenList[];
  onSelect: (list: EvmTokenList) => void;
}

export function EvmTokenListsList({ ListProps, tokenLists, onSelect }: Props) {
  return (
    <List {...ListProps} disablePadding>
      {tokenLists.map((list, index: number, arr) => (
        <EvmTokenListsListItem
          ListItemButtonProps={{ divider: index !== arr.length - 1 }}
          list={list}
          key={index}
          onSelect={onSelect}
        />
      ))}
    </List>
  );
}
