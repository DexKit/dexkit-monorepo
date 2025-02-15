import {
  DateField,
  NumberField,
  Show,
  SimpleShowLayout,
  TextField,
} from 'react-admin';

export const OrderShow = () => (
  <Show>
    <SimpleShowLayout>
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
    </SimpleShowLayout>
  </Show>
);
