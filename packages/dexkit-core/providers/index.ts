import React, { useContext } from "react";
import { DexkitApiProviderState } from "../types";

export const DexkitApiProvider = React.createContext<DexkitApiProviderState>({
  instance: null,
});

export function useDexkitApiProvider(): DexkitApiProviderState {
  return useContext(DexkitApiProvider);
}

export type { DexkitApiProviderState } from "../types";
export { DexKitContext } from "./DexKitContext";
export type { DexkitContextState } from "./DexKitContext";

