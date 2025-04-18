import CreditCard from '@mui/icons-material/CreditCard';
import {
  Avatar,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { useUserPaymentMethods } from '../hooks/payments';

export default function PaymentMethodList({}) {
  const paymentMethodsQuery = useUserPaymentMethods();

  return (
    <List disablePadding>
      {paymentMethodsQuery.data?.map((pm: any, index: number) => (
        <ListItemButton divider key={index}>
          <ListItemAvatar>
            <Avatar>
              <CreditCard />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={`**** **** **** ${pm.card.last4}`}
            secondary={pm.card.brand.toUpperCase()}
          />
        </ListItemButton>
      ))}
    </List>
  );
}
