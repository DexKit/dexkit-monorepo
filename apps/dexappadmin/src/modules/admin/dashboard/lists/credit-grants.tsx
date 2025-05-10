import { Datagrid, List, NumberField, TextField } from 'react-admin';

export default function CreditGrantsList() {
  return (
    <List>
      <Datagrid rowClick="edit">
        <NumberField
          options={{
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
          }}
          source="amount"
        />
        <TextField source="account" />
        <TextField source="status" />
      </Datagrid>
    </List>
  );
}
