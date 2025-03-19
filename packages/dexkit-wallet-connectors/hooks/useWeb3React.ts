import { useAccount, useChainId, useEnsName } from "wagmi";
import { useEthersSigner } from "./useEthersSigner";
/**
 * Starting refactor useWeb3React to make it easy to replace for wagmi or thirdweb
 */
export function useWeb3React() {
  const signerProvider = useEthersSigner();

  const { address, isConnecting, connector, isConnected } = useAccount();
  const chainId = useChainId();

  const { data } = useEnsName({
    address: address,
  });

  return {
    account: address,
    isActive: isConnected,
    chainId,
    provider: signerProvider ? signerProvider : undefined,
    isActivating: isConnecting,
    ENSName: data,
    connector: connector,
  };
}
