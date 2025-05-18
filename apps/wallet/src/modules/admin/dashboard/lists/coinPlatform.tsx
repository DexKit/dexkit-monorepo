import {
  Datagrid,
  DateField,
  List,
  NumberField,
  ReferenceField,
  TextField,
} from 'react-admin';
import { CoinPlatformFilterSidebar } from '../filters/coinPlatformFilterSideba';

export const CoinPlatformList = () => (
  <List aside={<CoinPlatformFilterSidebar />}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
      <TextField source="address" />
      <NumberField source="decimals" />
      <NumberField source="chainId" />
      <TextField source="networkId" />
      <TextField source="platformId" />
      <TextField source="coin.name" />
    </Datagrid>
  </List>
);
