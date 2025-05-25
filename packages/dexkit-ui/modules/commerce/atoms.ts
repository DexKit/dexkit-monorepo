import { atomWithStorage } from "jotai/utils";
import { CartState } from "./types";

export const dexkitCartAtom = atomWithStorage<CartState>(
  "dexkit.commerce.cart",
  {
    items: [],
  }
);
