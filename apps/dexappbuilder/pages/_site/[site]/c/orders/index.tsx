import LazyTextField from '@dexkit/ui/components/LazyTextField';
import { Container, InputAdornment, Stack, Typography } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';

import UserOrdersTable from '@/modules/commerce/components/UserOrdersTable';
import CommerceUserLayout from '@dexkit/ui/modules/commerce/components/CommerceUserLayout';
import OrderStatusSelect from '@dexkit/ui/modules/commerce/components/OrderStatusSelect';
import Search from '@mui/icons-material/Search';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import { useState } from 'react';
import AuthMainLayout from 'src/components/layouts/authMain';
import { REVALIDATE_PAGE_TIME } from 'src/constants';
import { getAppConfig } from 'src/services/app';

export default function CommerceOrdersPage() {
  const [query, setQuery] = useState('');

  const handleChange = (value: string) => {
    setQuery(value);
  };

  const { formatMessage } = useIntl();

  const [status, setStatus] = useState('');

  const handleChangeStatus = (status: string) => {
    setStatus(status);
  };

  return (
    <Container>
      <Stack spacing={2}>
        <Typography variant="h5">
          <FormattedMessage id="my.orders" defaultMessage="My Orders" />
        </Typography>
        <Stack direction="row" alignItems="baseline" spacing={2}>
          <LazyTextField
            TextFieldProps={{
              size: 'small',
              variant: 'outlined',
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
          <OrderStatusSelect status={status} onChange={handleChangeStatus} />
        </Stack>
        <UserOrdersTable query={query} status={status} />
      </Stack>
    </Container>
  );
}

CommerceOrdersPage.getLayout = (page: any) => {
  return (
    <AuthMainLayout noSsr>
      <CommerceUserLayout>{page}</CommerceUserLayout>
    </AuthMainLayout>
  );
};

type Params = {
  site?: string;
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  const configResponse = await getAppConfig(params?.site, 'home');

  return {
    props: {
      ...configResponse,
    },
    revalidate: REVALIDATE_PAGE_TIME,
  };
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking', // false or 'blocking'
  };
}
