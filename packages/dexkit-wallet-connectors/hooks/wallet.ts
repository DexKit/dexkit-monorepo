import { useMutation } from "@tanstack/react-query";

import { ConnectionType } from "../types";

import { PrimitiveAtom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import { useWeb3React } from "./useWeb3React";

export function useWalletActivate({
  magicRedirectUrl,
  selectedWalletAtom,
}: {
  magicRedirectUrl: string;
  selectedWalletAtom: PrimitiveAtom<string>;
}) {
  const { chainId } = useWeb3React();
  const { setWalletConnectorMetadata } = useWalletConnectorMetadata();
  // This should be deprecated
  const [walletConnector, setWalletConnector] = useAtom(selectedWalletAtom);

  const mutation = useMutation(async (params: any) => {
    /* if (connector.deactivate) {
       await connector.deactivate();
     }*/

    setWalletConnectorMetadata({
      id: params?.connectorName,
      icon: params?.icon,
      rdns: params?.rdns,
      name: params?.name,
      type: params?.connectionType,
    });

    if (params?.loginType) {
      // This should be deprecated
      setWalletConnector("magic");
    } else {
      // This should be deprecated
      setWalletConnector(params?.connectorName);

      return null;
    }
  });

  return { connectorName: walletConnector, mutation };
}

const walletConnectorMetadataAtom = atomWithStorage<{
  id?: string;
  name?: string;
  icon?: string;
  rdns?: string;
  type?: ConnectionType;
}>("wallet-connector-metadata", {});

/**
 * Return current active connector metadata
 * @returns
 */
export function useWalletConnectorMetadata() {
  const [walletConnectorMetadata, setWalletConnectorMetadata] = useAtom(
    walletConnectorMetadataAtom,
  );
  return {
    walletConnectorMetadata,
    setWalletConnectorMetadata,
  };
}
