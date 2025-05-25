import {
  DateField,
  NumberField,
  Show,
  SimpleShowLayout,
  TextField,
} from 'react-admin';

export const CoinPlatformShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
      <TextField source="address" />
      <NumberField source="decimals" />
      <NumberField source="chainId" />
      <TextField source="networkId" />
      <TextField source="platformId" />
      <NumberField source="coin.id" />
    </SimpleShowLayout>
  </Show>
);
