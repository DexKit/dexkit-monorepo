import {
  BooleanField,
  Datagrid,
  List,
  SearchInput,
  TextField,
} from "react-admin";

const FeatUsagesList = () => (
  <List
    filters={[<SearchInput key={1} source="q" alwaysOn />]}
    filterDefaultValues={{ q: "" }}
  >
    <Datagrid rowClick="edit">
      <TextField source="account" />
      <TextField source="slug" />
      <TextField source="site.slug" />
      <BooleanField source="active" />
    </Datagrid>
  </List>
);

export default FeatUsagesList;
