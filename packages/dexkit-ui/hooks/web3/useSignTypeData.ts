import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { useMutation } from "@tanstack/react-query";
import type { TypedDataDomain, TypedDataField } from "ethers";

/**
 * signs an eip721
 */
export function useSignTypeData() {
  const { provider, account } = useWeb3React();

  return useMutation(
    [provider],
    async ({
      domain,
      types,
      value,
      primaryType,
    }: {
      domain: TypedDataDomain;
      types: Record<string, TypedDataField[]>;
      value: Record<string, any>;
      primaryType: string;
    }) => {
      if (!provider) {
        return null;
      }
      const msgParams = JSON.stringify({
        domain: domain,
        message: value,
        primaryType: primaryType,
        types: types,
      });
      const params = [account, msgParams];

      return await provider.send("eth_signTypedData_v4", params);
    },
  );
}
