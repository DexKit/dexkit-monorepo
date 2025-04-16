import { isAddressEqual, truncateAddress } from '@/modules/common/utils';
import {
  Checkbox,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Account } from '../types';

interface Props {
  accounts: Account[];
  selectedAccounts: Account[];
  onSelectAccount: (account: Account) => void;
}

export default function SelectNftAccountsList({
  selectedAccounts,
  accounts,
  onSelectAccount,
}: Props) {
  return (
    <List disablePadding>
      {accounts.map((account: Account, index: number) => (
        <ListItemButton
          dense
          key={index}
          onClick={() => onSelectAccount(account)}
        >
          <ListItemIcon>
            <Checkbox
              size="small"
              checked={
                selectedAccounts.find((a) =>
                  isAddressEqual(account.address, a.address)
                ) !== undefined
              }
            />
          </ListItemIcon>
          <ListItemText primary={truncateAddress(account.address)} />
        </ListItemButton>
      ))}
    </List>
  );
}
