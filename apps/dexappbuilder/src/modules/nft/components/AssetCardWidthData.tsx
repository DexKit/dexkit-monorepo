import { ChainId } from '@dexkit/core/constants';
import { AssetCard } from '@dexkit/ui/modules/nft/components/AssetCard';
import { useFullAsset } from '@dexkit/ui/modules/nft/hooks';

interface Props {
  address: string;
  id: string;
  chainId?: ChainId;
  lazy?: boolean;
}

export function AssetCardWithData({ address, id, chainId, lazy }: Props) {
  const asset = useFullAsset({ address, id, chainId, lazy });
  return <AssetCard asset={asset} />;
}
