import {
  Card,
  CardContent,
  Divider,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import { FormattedMessage } from "react-intl";

import useCountOrders from "@dexkit/ui/modules/commerce/hooks/useCountOrders";
import useTotalRevenue from "@dexkit/ui/modules/commerce/hooks/useTotalRevenue";
import { EcommerceCredits } from "../EcommerceCredits";
import DashboardLayout from "../layouts/DashboardLayout";

function Dashboard() {
  const { data, isLoading } = useCountOrders();

  const { data: dataTotal, isLoading: isTotalLoading } = useTotalRevenue();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">
          <FormattedMessage id="dashboard" defaultMessage="Dashboard" />
        </Typography>
        <Typography variant="body1" color="text.secondary">
          <FormattedMessage
            id="get.an.overview.of.your.store.and.track.key.metrics."
            defaultMessage="Get an overview of your store and track key metrics."
          />
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <EcommerceCredits />
      </Grid>

      <Grid item xs={12}>
        <Divider />
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

export default function DashboardContainer() {
  return (
    <DashboardLayout page="home">
      <Dashboard />
    </DashboardLayout>
  );
}
