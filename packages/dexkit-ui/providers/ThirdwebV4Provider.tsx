import { NETWORK_FROM_SLUG } from "@dexkit/core/constants/networks";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { Pulsechain } from "@thirdweb-dev/chains";
import { ThirdwebSDKProvider } from "@thirdweb-dev/react";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { THIRDWEB_CLIENT_ID } from "../constants/thirdweb";

export default function ThirdwebV4Provider({
  network,
  chainId,
  children,
}: {
  network?: string;
  chainId?: number;
  children: React.ReactNode;
}) {
  const { signer } = useWeb3React();
  const net = NETWORK_FROM_SLUG(network);
  const netChain = net?.chainId || chainId;
  const activeChain = netChain === 369 ? Pulsechain : netChain;

  return (
    <ThirdwebSDKProvider
      clientId={THIRDWEB_CLIENT_ID || ""}
      activeChain={activeChain}
      signer={signer}
      storageInterface={
        new ThirdwebStorage({
          clientId: THIRDWEB_CLIENT_ID || "",
        })
      }
    >
      {children}
    </ThirdwebSDKProvider>
  );
}
