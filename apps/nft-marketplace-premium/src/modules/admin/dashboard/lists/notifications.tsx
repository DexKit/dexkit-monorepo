import {
  Datagrid,
  DateField,
  ImageField,
  List,
  NumberField,
  BooleanField,
  TextField,
} from 'react-admin';

export const NotificationsList = () => (
  <List>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="scope" />
      <TextField source="title" />
      <TextField source="subtitle" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
    </Datagrid>
  </List>
);
