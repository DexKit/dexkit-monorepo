import {
  Box,
  Card,
  CardContent,
  Divider,
  Skeleton,
  Stack,
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
    <Stack spacing={3}>
      <Box>
        <Typography variant="h6" sx={{ mb: 1 }}>
          <FormattedMessage id="dashboard" defaultMessage="Dashboard" />
        </Typography>
        <Typography variant="body1" color="text.secondary">
          <FormattedMessage
            id="get.an.overview.of.your.store.and.track.key.metrics."
            defaultMessage="Get an overview of your store and track key metrics."
          />
        </Typography>
      </Box>
      <Box>
        <EcommerceCredits />
      </Box>
      <Divider />

      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        flexWrap: 'wrap'
      }}>
        <Card sx={{ flex: { xs: '1 1 100%', sm: '1 1 200px' }, minWidth: '200px' }}>
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
        
        <Card sx={{ flex: { xs: '1 1 100%', sm: '1 1 200px' }, minWidth: '200px' }}>
          <CardContent>
            <Typography color="text.secondary" variant="caption">
              <FormattedMessage id="orders" defaultMessage="Orders" />
            </Typography>
            <Typography variant="h5">
              {isLoading ? <Skeleton /> : data?.count}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Stack>
  );
}

export default function DashboardContainer() {
  return (
    <DashboardLayout page="home">
      <Dashboard />
    </DashboardLayout>
  );
}
