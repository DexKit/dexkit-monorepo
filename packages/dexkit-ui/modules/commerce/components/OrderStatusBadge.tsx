import { Box, Palette, PaletteColor, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

const getTextColor = (color: PaletteColor | string, palette: Palette) => {
  if (typeof color === `string`) {
    return palette.getContrastText(color);
  }

  return color.contrastText;
};

const getBgColor = (color: PaletteColor | string) => {
  if (typeof color === `string`) {
    return color;
  }

  return color.main;
};

export interface OrderStatusBadgeProps {
  status: string;
  palette: Palette;
}

export default function OrderStatusBadge({
  status,
  palette,
}: OrderStatusBadgeProps) {
  const statusText: {
    [key: string]: {
      text: React.ReactNode;
      color: PaletteColor | string;
    };
  } = {
    PaymentConfirmed: {
      text: (
        <FormattedMessage
          id="payment.confirmed.alt"
          defaultMessage="Payment confirmed"
        />
      ),
      color: palette.success,
    },
    Pending: {
      text: (
        <FormattedMessage
          id="payment.pending"
          defaultMessage="Payment pending"
        />
      ),
      color: palette.warning,
    },
    Finalized: {
      text: (
        <FormattedMessage id="order.finalized" defaultMessage="Finalized" />
      ),
      color: palette.primary,
    },
    Refunded: {
      text: <FormattedMessage id="refunded" defaultMessage="Refunded" />,
      color: palette.grey[200],
    },
    Cancelled: {
      text: <FormattedMessage id="cancelled" defaultMessage="Cancelled" />,
      color: palette.error,
    },
    TransactionFailed: {
      text: (
        <FormattedMessage id="cancelled" defaultMessage="Transaction failed" />
      ),
      color: palette.grey[200],
    },
  };

  return (
    <Box
      sx={{
        px: 1,
        py: 0.25,
        borderRadius: (theme) => theme.shape.borderRadius / 2,
        backgroundColor: getBgColor(statusText[status].color),
      }}
    >
      <Typography
        sx={{
          color: getTextColor(statusText[status].color, palette),
        }}
      >
        {statusText[status].text}
      </Typography>
    </Box>
  );
}
