import {
  Datagrid,
  DateField,
  ImageField,
  List,
  NumberField,
  TextField,
} from 'react-admin';
import { AssetFilterSidebar } from '../filters/assetFilterSidebar';

export const OrdersList = () => (
  <List>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="chainId" />
      <TextField source="contractAddress" />
      <TextField source="amount" />
      <TextField source="hash" />
      <TextField source="receiver" />
      <TextField source="receiverEmail" />
      <TextField source="senderAddress" />
      <TextField source="email" />
      <TextField source="status" />

      <DateField source="createdAt" />
      <DateField source="updatedAt" />
    </Datagrid>
  </List>
);
