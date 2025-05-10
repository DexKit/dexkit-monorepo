import {
  DateInput,
  Edit,
  NumberInput,
  SimpleForm,
  TextInput,
} from 'react-admin';

export const AssetEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" />
      <DateInput source="createdAt" />
      <DateInput source="updatedAt" />
      <TextInput source="tokenId" />
      <TextInput source="name" />
      <TextInput source="collectionName" />
      <TextInput source="symbol" />
      <TextInput source="address" />
      <TextInput source="networkId" />
      <TextInput source="owner" />
      <NumberInput source="chainId" />
      <TextInput source="imageUrl" />
      <TextInput source="tokenURI" />
      <TextInput source="rawData" />
      <TextInput source="rawDataJSON.name" />
      <TextInput source="syncStatus" />
      <DateInput source="description" />
      <TextInput source="protocol" />
    </SimpleForm>
  </Edit>
);
