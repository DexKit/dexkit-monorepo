import { Edit, NumberInput, SimpleForm, TextInput } from 'react-admin';

export const FeatPriceEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="feat" disabled variant="outlined" />
      <TextInput source="plan" disabled variant="outlined" />
      <TextInput source="model" disabled variant="outlined" />
      <NumberInput source="price" variant="outlined" step={0.01} />
    </SimpleForm>
  </Edit>
);
