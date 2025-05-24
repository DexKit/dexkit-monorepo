import { Edit, NumberInput, SimpleForm, TextInput } from 'react-admin';

export const CreditGrantEdit = () => (
  <Edit>
    <SimpleForm>
      <NumberInput source="id" disabled variant="outlined" />
      <NumberInput source="amount" variant="outlined" />
      <TextInput source="account" variant="outlined" />
    </SimpleForm>
  </Edit>
);
