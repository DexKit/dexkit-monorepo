import { DateField, Show, SimpleShowLayout, TextField } from "react-admin";

export const NotificationShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />

      <TextField source="scope" />
      <TextField source="title" />
      <TextField source="subtitle" />

      <DateField source="createdAt" />
      <DateField source="updatedAt" />
    </SimpleShowLayout>
  </Show>
);
