import { atomWithStorage } from "jotai/utils";

export const isAutoSlippageAtom = atomWithStorage<boolean>(
  "isAutoSlippage",
  true,
);

export const maxSlippageAtom = atomWithStorage<number>("maxSlippage", 0.0);
