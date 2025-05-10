import {
  BooleanInput,
  Edit,
  NumberInput,
  SimpleForm,
  TextInput,
} from 'react-admin';

export const SiteEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="slug" disabled />
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
      {/*   <NumberInput source="nftId" />*/}
    </SimpleForm>
  </Edit>
);
