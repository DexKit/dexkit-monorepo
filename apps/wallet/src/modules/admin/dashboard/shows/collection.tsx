import {
  DateField,
  NumberField,
  ReferenceField,
  Show,
  SimpleShowLayout,
  TextField,
} from 'react-admin';

export const CollectionShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
      <TextField source="name" />
      <TextField source="address" />
      <TextField source="owner" />
      <TextField source="networkId" />
      <TextField source="baseTokenUri" />
      <TextField source="symbol" />
      <NumberField source="totalSupply" />
      <TextField source="traitCounts" />
      <NumberField source="chainId" />
      <TextField source="protocol" />
      <TextField source="imageUrl" />
      <TextField source="backgroundImageUrl" />
      <TextField source="rawData" />
      <TextField source="description" />
      <TextField source="syncStatus" />
      <NumberField source="syncedAssets" />
    </SimpleShowLayout>
  </Show>
);
