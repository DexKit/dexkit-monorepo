import {
  BooleanInput,
  Edit,
  NumberInput,
  SimpleForm,
  TextInput,
} from "react-admin";
import { HidePoweredByField } from "../../components/HidePoweredByField";
import { HolderTextField } from "../../components/HolderTextField";

export const SiteEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="slug" disabled />
      <TextInput source="owner" disabled />
      {/*  <TextInput source="id" />
      <DateInput source="createdAt" />
      <DateInput source="updatedAt" />
      <TextInput source="slug" />
      <TextInput source="owner" />
      <TextInput source="type" />
      <TextInput source="domain" />
      <TextInput source="email" />
      <TextInput source="isTemplate" />
      <TextInput source="config" />
      <TextInput source="signature" />
      <TextInput source="message" />
      <TextInput source="cname" />
      <TextInput source="domainSetupResponse" />
      <TextInput source="verifyDomainRawData" />
      <TextInput source="domainStatus" />
      <TextInput source="previewUrl" />*/}
      <NumberInput source="featuredScore" />
      <BooleanInput source="isTemplate" />
      <HidePoweredByField source="config" label="HidePoweredBy" />
      <HolderTextField source="owner" label="HoldKit" />
      {/* <TextInput source="signature" />
      {/* <TextInput source="config" />*/}
      {/* <TextInput source="domainSetupResponse" />
      {/*   <NumberInput source="nftId" />*/}
    </SimpleForm>
  </Edit>
);
