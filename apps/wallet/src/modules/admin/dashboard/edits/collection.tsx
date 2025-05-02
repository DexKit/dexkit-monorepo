import { CollectionSyncStatus } from '@dexkit/ui/modules/nft/constants/enum';
import {
  Edit,
  NumberInput,
  SelectInput,
  SimpleForm,
  TextInput,
} from 'react-admin';

export const CollectionEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="name" />
      <TextInput source="address" disabled />
      <TextInput source="owner" />
      <TextInput source="networkId" />
      <TextInput source="baseTokenUri" />
      <TextInput source="symbol" />
      <NumberInput source="totalSupply" />
      <TextInput source="traitCounts" />
      <TextInput source="chainId" />
      <TextInput source="protocol" />
      <TextInput source="imageUrl" />
      <TextInput source="backgroundImageUrl" />
      <TextInput source="description" />
      <SelectInput
        source="syncStatus"
        choices={[
          {
            id: CollectionSyncStatus.NotSyncable,
            name: CollectionSyncStatus.NotSyncable,
          },
          {
            id: CollectionSyncStatus.Synced,
            name: CollectionSyncStatus.Synced,
          },
          {
            id: CollectionSyncStatus.NotSynced,
            name: CollectionSyncStatus.NotSynced,
          },
          {
            id: CollectionSyncStatus.Syncing,
            name: CollectionSyncStatus.Syncing,
          },
        ]}
      />
    </SimpleForm>
  </Edit>
);
