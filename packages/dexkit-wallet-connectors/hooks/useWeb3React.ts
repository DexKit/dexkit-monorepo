import { client } from '@dexkit/wallet-connectors/thirdweb/client';
import { useActiveAccount, useActiveWalletConnectionStatus, useChainMetadata, useConnect, useEnsName } from "thirdweb/react";
import { useAccount } from 'wagmi';
import { useEthersSigner } from "./useEthersSigner";

/**
 * Starting refactor useWeb3React to make it easy to replace for wagmi or thirdweb
 */
export function useWeb3React() {
  const signerProvider = useEthersSigner();

  const activeAccount = useActiveAccount();
  const { connector } = useAccount();

  const status = useActiveWalletConnectionStatus();

  const { isConnecting } = useConnect();

  const { data: chainMetadata } = useChainMetadata();

  const { data } = useEnsName({
    client,
    address: activeAccount?.address,
  })



  return { account: activeAccount?.address, isActive: status === 'connected', chainId: chainMetadata?.chainId, provider: signerProvider ? signerProvider : undefined, isActivating: isConnecting, ENSName: data, connector: connector }
}