import { atomWithStorage } from "jotai/utils";

export const isBalancesVisibleAtom = atomWithStorage(
  "dexkit-wallet-state",
  false,
);
