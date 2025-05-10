import {
  DateField,
  NumberField,
  Show,
  SimpleShowLayout,
  TextField,
} from 'react-admin';

export const AssetShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
      <TextField source="tokenId" />
      <TextField source="name" />
      <TextField source="collectionName" />
      <TextField source="symbol" />
      <TextField source="address" />
      <TextField source="networkId" />
      <TextField source="owner" />
      <NumberField source="chainId" />
      <TextField source="imageUrl" />
      <TextField source="tokenURI" />
      <TextField source="rawData" />
      <TextField source="rawDataJSON.name" />
      <TextField source="syncStatus" />
      <DateField source="description" />
      <TextField source="protocol" />
    </SimpleShowLayout>
  </Show>
);
