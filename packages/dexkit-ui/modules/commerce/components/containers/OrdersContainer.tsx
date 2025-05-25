import LazyTextField from "@dexkit/ui/components/LazyTextField";
import {
  Box,
  Divider,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";

import Search from "@mui/icons-material/Search";
import { useState } from "react";
import OrdersTable from "../OrdersTable";
import DashboardLayout from "../layouts/DashboardLayout";

const statusText: { [key: string]: { id: string; defaultMessage: string } } = {
  PaymentConfirmed: {
    id: "confirmed",
    defaultMessage: "Confirmed",
  },
  Pending: {
    id: "pending",
    defaultMessage: "Pending",
  },
  Finalized: {
    id: "finalized",
    defaultMessage: "Finalized",
  },
  Refunded: {
    id: "refunded",
    defaultMessage: "Refunded",
  },
  Cancelled: {
    id: "cancelled",
    defaultMessage: "Cancelled",
  },
};

export default function OrdersContainer() {
  const [query, setQuery] = useState("");

  const handleChange = (value: string) => {
    setQuery(value);
  };
  const [status, setStatus] = useState("");

  const { formatMessage } = useIntl();

  return (
    <DashboardLayout page="orders">
      <Stack spacing={2}>
        <Box>
          <Typography variant="h6">
            <FormattedMessage id="orders" defaultMessage="Orders" />
          </Typography>
          <Typography variant="body1" color="text.secondary">
            <FormattedMessage
              id="review.and.manage.all.customer.orders."
              defaultMessage="Review and manage all customer orders."
            />
          </Typography>
        </Box>
        <Divider />
        <Stack direction="row" alignItems="baseline" spacing={2}>
          <Stack direction="row" alignItems="baseline" spacing={2}>
            <LazyTextField
              TextFieldProps={{
                size: "small",
                variant: "outlined",
                placeholder: formatMessage({
                  id: "search.for.a.product",
                  defaultMessage: "Search for an order",
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
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value ?? "")}
            variant="outlined"
            displayEmpty
            size="small"
          >
            <MenuItem value="">
              <FormattedMessage id="all.status" defaultMessage="All status" />
            </MenuItem>
            {Object.keys(statusText)
              .map((key) => ({ ...statusText[key], key }))
              .sort((a, b) => a.defaultMessage.localeCompare(b.defaultMessage))
              .map((n) => (
                <MenuItem key={n.key} value={n.key}>
                  <FormattedMessage
                    id={n.id}
                    defaultMessage={n.defaultMessage}
                  />
                </MenuItem>
              ))}
          </Select>
        </Stack>
        <OrdersTable query={query} status={status} />
      </Stack>
    </DashboardLayout>
  );
}
