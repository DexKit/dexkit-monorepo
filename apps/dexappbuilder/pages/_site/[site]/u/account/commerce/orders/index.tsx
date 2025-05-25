import DashboardLayout from '@/modules/commerce/components/layout/DashboardLayout';
import LazyTextField from '@dexkit/ui/components/LazyTextField';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import {
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';

import OrdersTable from '@/modules/commerce/components/OrdersTable';
import Search from '@mui/icons-material/Search';
import { useState } from 'react';

const statusText: { [key: string]: { id: string; defaultMessage: string } } = {
  PaymentConfirmed: {
    id: 'confirmed',
    defaultMessage: 'Confirmed',
  },
  Pending: {
    id: 'pending',
    defaultMessage: 'Pending',
  },
  Finalized: {
    id: 'finalized',
    defaultMessage: 'Finalized',
  },
  Refunded: {
    id: 'refunded',
    defaultMessage: 'Refunded',
  },
  Cancelled: {
    id: 'cancelled',
    defaultMessage: 'Cancelled',
  },
};
export default function CommerceCheckoutsPage() {
  const [query, setQuery] = useState('');

  const handleChange = (value: string) => {
    setQuery(value);
  };
  const [status, setStatus] = useState('');

  const { formatMessage } = useIntl();

  return (
    <DashboardLayout page="orders">
      <Stack spacing={2}>
        <PageHeader
          breadcrumbs={[
            {
              caption: (
                <FormattedMessage id="commerce" defaultMessage="Commerce" />
              ),
              uri: '/u/account/commerce',
            },
            {
              caption: <FormattedMessage id="orders" defaultMessage="Orders" />,
              uri: '/u/account/commerce/orders',
              active: true,
            },
          ]}
        />

        <Stack
          direction="row"
          alignItems="baseline"
          justifyContent="space-between"
        >
          <Typography variant="h6">
            <FormattedMessage id="orders" defaultMessage="Orders" />
          </Typography>
          <Stack direction="row" alignItems="baseline" spacing={2}>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value ?? '')}
              variant="standard"
              displayEmpty
            >
              <MenuItem value="">
                <FormattedMessage id="all" defaultMessage="All" />
              </MenuItem>
              {Object.keys(statusText)
                .map((key) => ({ ...statusText[key], key }))
                .sort((a, b) =>
                  a.defaultMessage.localeCompare(b.defaultMessage),
                )
                .map((n) => (
                  <MenuItem key={n.key} value={n.key}>
                    <FormattedMessage
                      id={n.id}
                      defaultMessage={n.defaultMessage}
                    />
                  </MenuItem>
                ))}
            </Select>
            <LazyTextField
              TextFieldProps={{
                size: 'small',
                variant: 'standard',
                placeholder: formatMessage({
                  id: 'search.for.a.product',
                  defaultMessage: 'Search for an order',
                }),
                InputProps: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                },
              }}
              onChange={handleChange}
            />
          </Stack>
        </Stack>
        <OrdersTable query={query} status={status} />
      </Stack>
    </DashboardLayout>
  );
}
