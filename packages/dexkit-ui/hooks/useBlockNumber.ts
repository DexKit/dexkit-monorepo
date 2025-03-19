import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { useEffect, useState } from "react";
export function useBlockNumber() {
  const { provider } = useWeb3React();

  const [blockNumber, setBlockNumber] = useState(0);

  useEffect(() => {
    if (provider) {
      const handleBlockNumber = (blockNumber: any) => {
        setBlockNumber(blockNumber);
      };

      provider?.on("block", handleBlockNumber);

      return () => {
        provider?.removeListener("block", handleBlockNumber);
      };
    }
  }, [provider]);

  return blockNumber;
}
