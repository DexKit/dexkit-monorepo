import { Datagrid, DateField, List, TextField } from 'react-admin';
import { UserEventsFilterSidebar } from '../filters/userEventsFilterSidebar';
export const UserEventList = () => (
  <List aside={<UserEventsFilterSidebar />}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="type" />
      <TextField source="hash" />
      <TextField source="chainId" />
      <TextField source="status" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
      <TextField source="account.address" />
      <TextField source="site.slug" />
    </Datagrid>
  </List>
);
