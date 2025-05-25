import {
  Datagrid,
  DateField,
  ImageField,
  List,
  NumberField,
  BooleanField,
  TextField,
} from 'react-admin';

export const CheckoutList = () => (
  <List >
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="description" />
      <TextField source="owner" />
      <BooleanField source="editable" />
      <BooleanField source="requireAddress" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
    </Datagrid>
  </List>
);
