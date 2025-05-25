import { MenuItem, Select } from "@mui/material";
import { FormattedMessage } from "react-intl";

export interface OrderStatusSelectProps {
  status: string;
  onChange: (status: string) => void;
}

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

export default function OrderStatusSelect({
  onChange,
  status,
}: OrderStatusSelectProps) {
  return (
    <Select
      value={status}
      onChange={(e) => onChange(e.target.value ?? "")}
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
            <FormattedMessage id={n.id} defaultMessage={n.defaultMessage} />
          </MenuItem>
        ))}
    </Select>
  );
}
