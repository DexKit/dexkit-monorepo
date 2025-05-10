import { useAtom } from "jotai";
import { gaslessTrades } from "../../../state";

export function useGaslessTrades() {
  return useAtom(gaslessTrades);
}
