import { Token } from '@dexkit/core/types';
import { useCheckoutItems } from '@dexkit/ui/hooks/payments';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import { BigNumber } from 'ethers';

export interface CheckoutItemListProps {
  id: string;
  token?: Token | null;
}

export default function CheckoutItemList({ id, token }: CheckoutItemListProps) {
  const checkoutItemsQuery = useCheckoutItems({ id: id });

  return (
    <List disablePadding>
      {checkoutItemsQuery.data?.map((item: any, index: number) => (
        <ListItem divider key={index}>
          <ListItemText
            primary={item.description}
            secondary={`x${item.amount}`}
          />
          <Typography>
            {BigNumber.from(item.amount)
              .mul(BigNumber.from(item.price))
              .toString()}{' '}
            {token?.symbol ? token?.symbol : 'USD'}
          </Typography>
        </ListItem>
      ))}
    </List>
  );
}
