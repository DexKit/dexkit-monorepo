import { Datagrid, DateField, List, TextField } from "react-admin";
import { HidePoweredByField } from "../../components/HidePoweredByField";
import { HolderTextField } from "../../components/HolderTextField";
import { SiteFilterSidebar } from "../filters/siteFilterSidebar";

export const SiteList = () => (
  <List aside={<SiteFilterSidebar />}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
      <TextField source="slug" />
      <TextField source="owner" />
      <TextField source="type" />
      <TextField source="domain" />
      <TextField source="domainStatus" />
      <TextField source="email" />
      <HolderTextField source="owner" label="HoldKit" />
      <HidePoweredByField source="config" label="HidePoweredBy" />
      {/* <TextField source="config" />*/}
      <TextField source="domainSetupResponse" />
      <TextField source="verifyDomainRawData" />
    </Datagrid>
  </List>
);
