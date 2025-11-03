import { useContext } from "react";
import { DexKitContext, DexkitContextState } from "../providers/DexKitContext";

export function useDexKitContext(): DexkitContextState {
  return useContext(DexKitContext);
}