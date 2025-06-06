import { client } from "@dexkit/wallet-connectors/thirdweb/client";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { ethers5Adapter } from "thirdweb/adapters/ethers5";
import {
  useActiveAccount,
  useActiveWalletChain,
  useActiveWalletConnectionStatus,
  useConnect,
  useEnsName,
} from "thirdweb/react";

/**
 * Starting refactor useWeb3React to make it easy to replace for wagmi or thirdweb
 */
export function useWeb3React(): {
  activeAccount: ReturnType<typeof useActiveAccount>;
  account: string | undefined;
  isActive: boolean;
  chainId: number | undefined;
  chainMetadata: ReturnType<typeof useActiveWalletChain>;
  provider: ReturnType<typeof ethers5Adapter.provider.toEthers> | undefined;
  signer: any;
  isActivating: boolean;
  ENSName: string | null | undefined;
  connector: undefined;
  signMessage: ({
    message,
    originalMessage,
    chainId,
  }: {
    message: string;
    originalMessage?: string | undefined;
    chainId?: number | undefined;
  }) => Promise<`0x${string}`>;
} {
  const activeAccount = useActiveAccount();

  const activeChain = useActiveWalletChain();
  const status = useActiveWalletConnectionStatus();

  const { isConnecting } = useConnect();

  const { data } = useEnsName({
    client: client,
    address: activeAccount?.address,
  });

  const provider = useMemo(() => {
    if (activeChain) {
      return ethers5Adapter.provider.toEthers({
        client: client,
        chain: activeChain,
      });
    }
  }, [client, activeChain]);

  const signer = useQuery(
    ["GET_THIRD_WEB_SIGNER", activeChain, activeAccount],
    async () => {
      return ethers5Adapter.signer.toEthers({
        client: client,
        chain: activeChain!,
        account: activeAccount!,
      });
    },
    {
      enabled: !!activeChain && !!activeAccount,
    }
  );

  const signMessage = activeAccount
    ? activeAccount.signMessage
    : () => {
      throw new Error("No account");
    };

  return {
    activeAccount,
    account: activeAccount?.address,
    isActive: status === "connected",
    chainId: activeChain?.id,
    chainMetadata: activeChain,
    provider,
    signer: signer.data,
    isActivating: isConnecting,
    ENSName: data,
    connector: undefined,
    signMessage,
  };
}
