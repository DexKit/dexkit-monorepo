import { useCallback, useReducer } from 'react';

export const ADD_ITEM = 'ADD_ITEM';
export const REMOVE_ITEM = 'REMOVE_ITEM';
export const SET_ITEM_AMOUNT = 'SET_ITEM_AMOUNT';

export type AddCartItem = {
  type: typeof ADD_ITEM;
  productId: string;
  description?: string;
  amount: number;
  price: number;
};

export type RemoveCartItem = {
  type: typeof REMOVE_ITEM;
  productId: string;
  amount: number;
};

export type SetItemAmount = {
  type: typeof SET_ITEM_AMOUNT;
  productId: string;
  amount: number;
};

export type Action = AddCartItem | RemoveCartItem | SetItemAmount;

export type CartItem = {
  productId: string;
  quantity: number;
  description: string;
  price: number;
};

export type CartState = {
  items: CartItem[];
};

export const reducer = (state: CartState, action: Action) => {
  switch (action.type) {
    case ADD_ITEM: {
      const newState = { ...state };
      const index = state.items.findIndex(
        (i) => i.productId === action.productId,
      );

      if (index > -1) {
        newState.items[index].quantity =
          newState.items[index].quantity + action.amount;
      } else {
        newState.items.push({
          description: action.description ?? '',
          price: action.price,
          productId: action.productId,
          quantity: action.amount,
        });
      }

      return newState;
    }
    case REMOVE_ITEM: {
      const newState = { ...state };
      const index = state.items.findIndex(
        (i) => i.productId === action.productId,
      );

      if (index > -1) {
        if (newState.items[index].quantity - action.amount === 0) {
          newState.items.splice(index, 1);
        } else {
          newState.items[index].quantity =
            newState.items[index].quantity - action.amount;
        }
      }

      return newState;
    }
    case SET_ITEM_AMOUNT: {
      const newState = { ...state };

      const index = state.items.findIndex(
        (i) => i.productId === action.productId,
      );

      if (index > -1) {
        newState.items[index].quantity = action.amount;
      }

      return newState;
    }
    default:
      return { ...state };
  }
};

export interface CartStateParams {
  onAction: (action: Action, next: (action: Action) => void) => Promise<void>;
}

export default function useCartState({ onAction }: CartStateParams) {
  const [state, dispatch] = useReducer(reducer, {
    items: [
      {
        description: 'NFT Art',
        price: 3000,
        productId: '2334324',
        quantity: 1,
      },
    ] as CartItem[],
  });

  const handleAction = useCallback(
    async (action: Action) => {
      await onAction(action, async (nextAction: Action) => {
        dispatch(nextAction);
      });
    },
    [onAction],
  );

  const addItem = useCallback(
    async ({
      amount,
      productId,
      price,
    }: {
      amount: number;
      productId: string;
      description?: string;
      price: number;
    }) => {
      await handleAction({ type: ADD_ITEM, amount, productId, price });
    },
    [handleAction],
  );

  const removeItem = useCallback(
    async ({ amount, productId }: { amount: number; productId: string }) => {
      await handleAction({ type: REMOVE_ITEM, amount, productId });
    },
    [handleAction],
  );

  const setItemAmount = useCallback(
    async ({ amount, productId }: { amount: number; productId: string }) => {
      await handleAction({ type: SET_ITEM_AMOUNT, amount, productId });
    },
    [handleAction],
  );

  return { addItem, removeItem, setItemAmount, items: state.items };
}
