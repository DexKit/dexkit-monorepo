import { isAddressEqual } from '@/modules/common/utils';
import { List } from '@mui/material';
import { Account } from '../types';
import WalletAccountsListItem from './WalletAccountsListItem';

interface Props {
  accounts: Account[];
  activeAccount?: string;
  onMenu?: (account: Account, anchorEl: HTMLElement) => void;
}

export default function WalletAccountsList({
  accounts,
  activeAccount,
  onMenu,
}: Props) {
  return (
    <List disablePadding>
      {accounts.map((account, index: number, arr) => (
        <WalletAccountsListItem
          isActive={isAddressEqual(activeAccount, account.address)}
          account={account}
          key={index}
          onMenu={onMenu}
          divider={index === arr.length - 1}
        />
      ))}
    </List>
  );
}
