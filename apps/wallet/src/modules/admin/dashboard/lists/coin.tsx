import {
  BooleanField,
  Datagrid,
  DateField,
  ImageField,
  List,
  TextField,
} from 'react-admin';
import { CoinFilterSidebar } from '../filters/coinFilterSidebar';

export const CoinList = () => (
  <List aside={<CoinFilterSidebar />}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
      <TextField source="name" />
      <TextField source="symbol" />
      <TextField source="description" />
      <ImageField
        source="logoUrl"
        sx={{ '& img': { maxWidth: 25, maxHeight: 25, objectFit: 'contain' } }}
      />
      <BooleanField source="isCoingeckoListed" />
      <TextField source="coingeckoId" />
      <TextField source="coingeckoRank" />
    </Datagrid>
  </List>
);
