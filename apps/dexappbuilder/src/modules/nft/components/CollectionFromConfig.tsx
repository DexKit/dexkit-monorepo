import CollectionCard from '@dexkit/ui/modules/nft/components/CollectionCard';
import { Collection } from '@dexkit/ui/modules/nft/types';

interface Props {
  collection: Collection;
  variant?: 'default' | 'simple';
  totalSupply: number;
  title?: String;
  backgroundImageUrl?: string;
  hoverable?: boolean;
  disabled?: boolean;
}

export function CollectionFromConfigCard({
  collection,
  totalSupply,
  backgroundImageUrl,
  hoverable,
  title,
  variant,
  disabled,
}: Props) {
  return (
    <CollectionCard
      collection={collection}
      totalSupply={totalSupply}
      backgroundImageUrl={backgroundImageUrl}
      hoverable={hoverable}
      title={title}
      variant={variant}
      disabled={disabled}
    />
  );
}

export default CollectionFromConfigCard;
