import { useMemo } from 'react';
import QRCode from 'react-qr-code';
import { buildEtherReceiveAddress } from '../utils';

interface Props {
  receiver: string;
  contractAddress?: string;
  chainId?: number;
}

export default function EvmReceiveQRCode({
  chainId,
  receiver,
  contractAddress,
}: Props) {
  const url = useMemo(() => {
    return buildEtherReceiveAddress({ contractAddress, receiver, chainId });
  }, [contractAddress, receiver, chainId]);

  return <QRCode value={url} />;
}
