import {
  Datagrid,
  DateField,
  ImageField,
  List,
  NumberField,
  TextField,
} from 'react-admin';
import { AssetFilterSidebar } from '../filters/assetFilterSidebar';

export const AssetList = () => (
  <List aside={<AssetFilterSidebar />}>
    <Datagrid rowClick="edit">
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
      <ImageField
        source="imageUrl"
        sx={{ '& img': { maxWidth: 25, maxHeight: 25, objectFit: 'contain' } }}
      />
      <TextField source="tokenURI" />
      {/*<TextField source="rawData" />*/}
      <TextField source="rawDataJSON.name" label={'Name'} />
      <TextField source="syncStatus" />
      <TextField source="description" />
      <TextField source="protocol" />
    </Datagrid>
  </List>
);
