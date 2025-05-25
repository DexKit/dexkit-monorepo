import { useAsyncMemo } from '@dexkit/widgets/src/hooks';
import {
  Avatar,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Radio,
} from '@mui/material';
import { useContract } from '@thirdweb-dev/react';

export interface SelectCollectionListItemProps {
  selected?: boolean;
  contractAddress: string;
  onSelect: (address: string) => void;
}

export default function SelectCollectionListItem({
  selected,
  contractAddress,
  onSelect,
}: SelectCollectionListItemProps) {
  const { contract } = useContract(contractAddress, 'nft-collection');

  const metadata = useAsyncMemo(
    async () => {
      return await contract?.metadata.get();
    },
    undefined,
    [contract],
  );

  return (
    <ListItemButton onClick={() => onSelect(contractAddress)}>
      <ListItemAvatar>
        <Avatar src={metadata?.image} />
      </ListItemAvatar>
      <ListItemText primary={metadata?.name} />
      <ListItemSecondaryAction>
        <Radio checked={selected} />
      </ListItemSecondaryAction>
    </ListItemButton>
  );
}
