import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const userIsGasless = atomWithStorage<boolean | undefined>('dexkit-ui.user-is-gasless', undefined);

export function useUserGaslessSettings() {
  return useAtom(userIsGasless)
}