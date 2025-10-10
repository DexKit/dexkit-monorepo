import { buildEtherReceiveAddress } from "@dexkit/core/utils";
import { useMemo } from "react";
import * as React from "react";
import QRCode from "react-qr-code";

interface Props {
  receiver?: string;
  contractAddress?: string;
  chainId?: number;
  amount?: string;
}

export default function EvmReceiveQRCode({
  chainId,
  receiver,
  contractAddress,
  amount,
}: Props) {
  const url = useMemo(() => {
    return buildEtherReceiveAddress({
      contractAddress,
      receiver,
      chainId,
      amount,
    });
  }, [contractAddress, receiver, chainId, amount]);
  return (React as any).createElement(QRCode, { value: url });
}
