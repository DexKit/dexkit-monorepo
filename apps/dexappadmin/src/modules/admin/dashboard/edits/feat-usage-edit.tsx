import { BooleanInput, Edit, SimpleForm, TextInput } from "react-admin";

export const FeatUsageEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="account" disabled variant="outlined" />
      <TextInput source="slug" disabled variant="outlined" />
      <TextInput source="site.slug" disabled variant="outlined" />
      <BooleanInput source="active"></BooleanInput>
    </SimpleForm>
  </Edit>
);
