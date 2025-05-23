import { Datagrid, List, SearchInput, TextField } from "react-admin";

const FeatsList = () => (
  <List
    filters={[<SearchInput key={1} source="q" alwaysOn />]}
    filterDefaultValues={{ q: "" }}
  >
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <TextField source="slug" />
      <TextField source="price" />
    </Datagrid>
  </List>
);

export default FeatsList;
