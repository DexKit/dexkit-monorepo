import React from "react";
import { CommerceContextState } from "./types";

export const CommerceContext = React.createContext<CommerceContextState>({
  setProduct: () => {},
  isSection: true,
  cartItems: [],
  showCart: false,
  requireEmail: false,
  openCart: () => {},
  closeCart: () => {},
  clearCart: () => {},
  checkCart: async () => {},
  cart: {
    addItem: () => {},
    item: (productId: string) => {
      return { name: "", price: "", productId: "", quantity: 0 };
    },
    updateItem: () => {},
  },
});
