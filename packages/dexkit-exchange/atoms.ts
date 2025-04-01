import { atomWithStorage } from "jotai/utils";

export const selectedWalletAtom = atomWithStorage<string>("selectedWallet", "");
