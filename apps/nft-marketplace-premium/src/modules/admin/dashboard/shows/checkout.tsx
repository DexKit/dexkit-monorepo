import {
  DateField,
  NumberField,
  Show,
  SimpleShowLayout,
  TextField,
  BooleanField,
} from 'react-admin';

export const CheckoutShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="description" />
      <TextField source="owner" />
      <BooleanField source="editable" />
      <BooleanField source="requireAddress" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
    </SimpleShowLayout>
  </Show>
);
