import { useContext } from "react";
import { DexKitContext } from "../context/DexKitContext";
export function useDexKitContext() {
  return useContext(DexKitContext);
}
