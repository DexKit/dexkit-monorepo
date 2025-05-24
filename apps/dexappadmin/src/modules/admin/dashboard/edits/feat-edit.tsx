import { Edit, NumberInput, SimpleForm, TextInput } from "react-admin";

export const FeatEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="feat" disabled variant="outlined" />
      <TextInput source="name" disabled variant="outlined" />
      <TextInput source="slug" disabled variant="outlined" />
      <NumberInput source="price" variant="outlined" step={0.01} />
    </SimpleForm>
  </Edit>
);
