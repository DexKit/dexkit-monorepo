import { client } from "@dexkit/wallet-connectors/thirdweb/client";
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
    client,
    address: activeAccount?.address,
  });

  const provider = useMemo(() => {
    if (activeChain) {
      return ethers5Adapter.provider.toEthers({
        client,
        chain: activeChain,
      });
    }
  }, [client, activeChain]);

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
    isActivating: isConnecting,
    ENSName: data,
    connector: undefined,
    signMessage,
  };
}
