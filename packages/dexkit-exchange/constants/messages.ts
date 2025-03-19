import type { AppNotificationType } from "@dexkit/ui/types";

export const EXCHANGE_NOTIFICATION_TYPES: {
  [key: string]: AppNotificationType;
} = {
  marketBuy: {
    type: "marketBuy",
    color: "primary.light",
    message:
      "Market buy {sellAmount} {sellTokenSymbol} for {buyAmount} {buyTokenSymbol}",
    id: "market.buyamount.symbol.for.buyamount.symbol",
    icon: "swap_vert",
  },

  marketSell: {
    type: "marketSell",
    color: "primary.light",
    message:
      "Market sell {sellAmount} {sellTokenSymbol} for {buyAmount} {buyTokenSymbol}",
    id: "market.sellamount.symbol.for.buyamount.symbol",
    icon: "swap_vert",
  },
  orderCancelled: {
    type: "orderCancelled",
    color: "primary.light",
    message:
      "Order cancelled {buyAmount} {buyTokenSymbol} for {sellAmount} {sellTokenSymbol}",
    id: "ordercancelled.sellamount.symbol.for.buyamount.symbol",
    icon: "receipt",
  },
};
