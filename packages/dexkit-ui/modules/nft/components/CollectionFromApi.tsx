import { useCollectionByApi } from "../hooks";
import CollectionCard from "./CollectionCard";

interface Props {
  chainId?: number;
  contractAddress?: string;
  variant?: "default" | "simple";
  totalSupply: number;
  title?: String;
  backgroundImageUrl?: string;
  hoverable?: boolean;
  disabled?: boolean;
  hideTitle?: boolean;
}

export function CollectionFromApiCard({
  chainId,
  contractAddress,
  totalSupply,
  backgroundImageUrl,
  hoverable,
  title,
  variant,
  disabled,
  hideTitle,
}: Props) {
  const { data: collection } = useCollectionByApi({ chainId, contractAddress });
  return (
    <CollectionCard
      collection={collection}
      totalSupply={totalSupply}
      backgroundImageUrl={backgroundImageUrl}
      hoverable={hoverable}
      title={title}
      variant={variant}
      disabled={disabled}
      hideTitle={hideTitle}
    />
  );
}

export default CollectionFromApiCard;
