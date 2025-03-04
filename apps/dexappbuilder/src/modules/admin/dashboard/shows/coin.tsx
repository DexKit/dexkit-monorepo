import {
  ArrayField,
  BooleanField,
  Datagrid,
  DateField,
  ImageField,
  NumberField,
  ReferenceField,
  Show,
  SimpleShowLayout,
  TextField,
} from 'react-admin';

export const CoinShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
      <TextField source="name" />
      <TextField source="symbol" />
      <TextField source="description" />
      <ImageField
        source="logoUrl"
        sx={{ '& img': { maxWidth: 50, maxHeight: 50, objectFit: 'contain' } }}
      />
      <BooleanField source="isCoingeckoListed" />
      <TextField source="coingeckoId" />
      <TextField source="coingeckoRank" />
    </SimpleShowLayout>
  </Show>
);
