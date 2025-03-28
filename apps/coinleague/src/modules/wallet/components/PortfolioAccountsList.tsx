import { isAddressEqual } from '@/modules/common/utils';
import { List } from '@mui/material';
import { AccountBalance, Coin, CoinPrices } from '../types';
import PortfolioAccountsListItem from './PortfolioAccountsListItem';

interface Props {
  balances: AccountBalance[];
  coin: Coin;
  activeAccount?: string;
  currency: string;
  prices: CoinPrices;
  onMenu: (account: string, anchor: HTMLElement) => void;
}

export default function PortfolioAccountsList({
  balances,
  coin,
  activeAccount,
  currency,
  prices,
  onMenu,
}: Props) {
  return (
    <List disablePadding>
      {balances.map((balance: AccountBalance, index: number) => (
        <PortfolioAccountsListItem
          account={balance.address}
          coin={coin}
          key={index}
          currency={currency}
          balance={balance}
          prices={prices}
          isActive={isAddressEqual(activeAccount, balance.address)}
          onMenu={onMenu}
        />
      ))}
    </List>
  );
}
