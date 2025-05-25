import DashboardLayout from '@/modules/commerce/components/layout/DashboardLayout';
import { Card, CardContent, Grid, Skeleton, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

import useCountOrders from '@dexkit/ui/modules/commerce/hooks/useCountOrders';
import useTotalRevenue from '@dexkit/ui/modules/commerce/hooks/useTotalRevenue';

function CommerceHomePageComponent() {
  const { data, isLoading } = useCountOrders();

  const { data: dataTotal, isLoading: isTotalLoading } = useTotalRevenue();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">
          <FormattedMessage id="home" defaultMessage="Home" />
        </Typography>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Card>
          <CardContent>
            <Typography color="text.secondary" variant="caption">
              <FormattedMessage
                id="total.revenue"
                defaultMessage="Total Revenue"
              />
            </Typography>
            <Typography variant="h5">
              {isTotalLoading ? <Skeleton /> : `${dataTotal?.total} USD`}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Card>
          <CardContent>
            <Typography color="text.secondary" variant="caption">
              <FormattedMessage id="orders" defaultMessage="Orders" />
            </Typography>
            <Typography variant="h5">
              {isLoading ? <Skeleton /> : data?.count}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default function CommerceHomePage() {
  return (
    <DashboardLayout page="home">
      <CommerceHomePageComponent />
    </DashboardLayout>
  );
}
