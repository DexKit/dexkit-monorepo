import {
  Avatar,
  Chip,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from '@mui/material';
import { useContract, useNFT, useNFTBalance } from '@thirdweb-dev/react';

export default function ContractAirdropErc1155ListItem({
  tokenId,
  contractAddress,
  account,
}: {
  tokenId: string;
  contractAddress?: string;
  account?: string;
}) {
  const { data: contract } = useContract(contractAddress);
  const { data: nft } = useNFT(contract, tokenId);
  const { data: balance } = useNFTBalance(contract, account, tokenId);

  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar variant="rounded" src={nft?.metadata.image || ''} />
      </ListItemAvatar>
      <ListItemText primary={nft?.metadata.name} />
      <ListItemSecondaryAction>
        <Chip label={balance?.toString()} />
      </ListItemSecondaryAction>
    </ListItem>
  );
}
