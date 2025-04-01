import { atomWithStorage } from "jotai/utils";
import { BaseActivateParams } from "./types";

export const walletConnectorAtom = atomWithStorage<
  BaseActivateParams["connectorName"] | undefined
>("connector", undefined);
