import {
  Datagrid,
  DateField,
  EditButton,
  ImageField,
  List,
  NumberField,
  TextField,
} from 'react-admin';
import { CollectionFilterSidebar } from '../filters/collectionFilterSidebar';

export const CollectionList = () => (
  <List aside={<CollectionFilterSidebar />}>
    <Datagrid rowClick="show">
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
      {/* <TextField source="traitCounts" />*/}
      <NumberField source="chainId" />
      <TextField source="protocol" />
      <ImageField
        source="imageUrl"
        sx={{ '& img': { maxWidth: 25, maxHeight: 25, objectFit: 'contain' } }}
      />
      <TextField source="backgroundImageUrl" />
      {/*  <TextField source="rawData" />*/}
      <TextField source="description" />
      <TextField source="syncStatus" />
      <TextField source="syncedAssets" />
      <EditButton />
    </Datagrid>
  </List>
);
