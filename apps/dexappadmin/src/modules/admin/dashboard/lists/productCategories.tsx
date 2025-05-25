import {
  Datagrid,
  DateField,
  ImageField,
  List,
  NumberField,
  TextField,
} from 'react-admin';
import { AssetFilterSidebar } from '../filters/assetFilterSidebar';

export const ProductCategoryList = () => (
  <List>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="owner" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
    </Datagrid>
  </List>
);
