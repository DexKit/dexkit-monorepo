import { Token } from "@dexkit/core/types";

/**
 * Remove this function after all tokens are migrated to new interface
 * @param tk
 * @returns
 */
export function convertOldTokenToNew(tk?: Token) {
  //@ts-ignore
  if (tk && tk?.contractAddress) {
    //@ts-ignore
    tk.address = tk?.contractAddress;
  }
  return tk;
}
