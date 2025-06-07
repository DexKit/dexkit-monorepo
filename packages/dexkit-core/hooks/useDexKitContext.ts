import { useContext } from "react";
import { DexKitContext } from "../providers/DexKitContext";


export function useDexKitContext() {
  return useContext(DexKitContext);
}