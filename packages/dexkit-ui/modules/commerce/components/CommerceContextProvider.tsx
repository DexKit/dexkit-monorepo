import { useReducerAtom } from "jotai/utils";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { CommercePageSection } from "../../wizard/types/section";
import { dexkitCartAtom } from "../atoms";
import { CommerceContext } from "../context";
import useCheckcart from "../hooks/useCheckcart";
import { CartState } from "../types";

export interface CommerceContextProviderProps {
  children: React.ReactNode;
  section?: CommercePageSection;
}

const ADD_CART_ITEM = "ADD_CART_ITEM";
const UPDATE_CART_ITEM = "UPDATE_CART_ITEM";
const CLEAR_CART = "CLEAR_CART";

type ClearCart = {
  type: typeof CLEAR_CART;
};

type CartAddItem = {
  type: typeof ADD_CART_ITEM;
  quantity: number;
  productId: string;
  name: string;
  price: string;
  imageUrl?: string;
};

type CartUpdateItem = {
  type: typeof UPDATE_CART_ITEM;
  quantity: number;
  productId: string;
  name: string;
  price: string;
  imageUrl?: string;
};

type Action = CartAddItem | CartUpdateItem | ClearCart;

const reducer = (state: CartState = { items: [] }, action?: Action) => {
  switch (action?.type) {
    case CLEAR_CART: {
      const newState = { ...state };

      newState.items = [];

      return newState;
    }
    case ADD_CART_ITEM: {
      const newItems = [
        ...state.items,
        {
          name: action.name,
          price: action.price,
          productId: action.productId,
          quantity: action.quantity,
          imageUrl: action.imageUrl,
        },
      ];

      return { ...state, items: newItems };
    }

    case UPDATE_CART_ITEM: {
      const newItems = [...state.items];

      const index = newItems.findIndex((i) => i.productId === action.productId);

      if (index > -1) {
        if (action.quantity === 0) {
          newItems.splice(index, 1);
          return { ...state, items: newItems };
        }

        newItems[index] = {
          name: action.name,
          price: action.price,
          productId: action.productId,
          quantity: action.quantity,
          imageUrl: action.imageUrl,
        };
      }

      return { ...state, items: newItems };
    }
    default:
      return state;
  }
};

export default function CommerceContextProvider({
  children,
  section,
}: CommerceContextProviderProps) {
  const [productId, setProductId] = useState<string>();
  const [isSection, setIsSection] = useState(true);

  const [showCart, setShowCart] = useState(false);

  const [cart, dispatch] = useReducerAtom<CartState, Action>(
    dexkitCartAtom,
    reducer
  );

  const handleSetProduct = (productId?: string) => {
    setProductId(productId);
  };

  const addItem = (params: {
    quantity: number;
    productId: string;
    name: string;
    price: string;
    imageUrl?: string;
  }) => {
    dispatch({ type: ADD_CART_ITEM, ...params });
  };

  const itemQuantity = (productId: string) => {
    return cart.items.find((i) => i.productId === productId);
  };

  const updateItem = (params: {
    quantity: number;
    productId: string;
    name: string;
    price: string;
    imageUrl?: string;
  }) => {
    return dispatch({ type: UPDATE_CART_ITEM, ...params });
  };

  const openCart = () => {
    setShowCart(true);
  };

  const closeCart = () => {
    setShowCart(false);
  };

  const clearCart = () => {
    return dispatch({ type: CLEAR_CART });
  };

  const { mutateAsync: checkcart } = useCheckcart();

  const { enqueueSnackbar } = useSnackbar();

  const checkCart = async () => {
    const ids = await checkcart({
      productIds: cart.items.map((i) => i.productId),
    });

    for (const id of ids) {
      updateItem({ productId: id, quantity: 0, name: "", price: "0" });
    }

    if (ids.length > 0) {
      enqueueSnackbar(
        <FormattedMessage
          id="removed.not.found.products"
          defaultMessage="Removed not found products"
        />,
        { variant: "error" }
      );
    }
  };

  return (
    <CommerceContext.Provider
      value={{
        productId,
        setProduct: handleSetProduct,
        isSection,
        showCart,
        requireEmail: Boolean(
          section &&
            section.type === "commerce" &&
            section.settings.content.type === "store" &&
            section.settings.content.params.emailRequired
        ),
        openCart,
        closeCart,
        clearCart,
        checkCart,
        cartItems: cart.items,
        cart: {
          addItem,
          item: itemQuantity,
          updateItem,
        },
      }}
    >
      {children}
    </CommerceContext.Provider>
  );
}
