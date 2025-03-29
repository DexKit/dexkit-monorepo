import { EvmSchemaTypes } from "../constants/validation";

import * as Yup from "yup";
import { AbiFragment, FunctionInput } from "../types";

import { getTrustedForwarders } from "@thirdweb-dev/sdk/evm";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import type { providers } from "ethers";

export function getSchemaForInput(type: string) {
  return EvmSchemaTypes[type];
}

export function getSchemaForInputs(inputs: FunctionInput[]) {
  let obj: { [key: string]: Yup.AnySchema } = {};

  for (let input of inputs) {
    obj[input.name] = getSchemaForInput(input.type);
  }

  return Yup.object(obj);
}
export async function dkGetTrustedForwarders(
  provider?: providers.Provider,
  clientId?: string
) {
  if (!provider) {
    return null;
  }

  const storage = new ThirdwebStorage({ clientId });

  let trustedForwarders = await getTrustedForwarders(provider, storage);

  return trustedForwarders;
}

export function normalizeAbi(abi: AbiFragment[]) {
  const newAbi = [...abi];

  for (let i = 0; i < abi.length; i++) {
    const fragment = newAbi[i];

    if (fragment.type === "function" || fragment.type === "constructor") {
      for (let j = 0; j < fragment.inputs?.length; j++) {
        const input = fragment.inputs[j];

        if (input.name === "") {
          newAbi[i].inputs[j].name = `input${j}`;
        }
      }
    }
  }

  return newAbi;
}
