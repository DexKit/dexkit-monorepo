import { AppDialogTitle } from '@dexkit/ui';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import {
    Dialog,
    DialogContent,
    DialogProps,
    Divider,
    List,
} from '@mui/material';
import { useContract, useNFTs } from '@thirdweb-dev/react';
import { FormattedMessage } from 'react-intl';
import ContractAirdropErc1155ListItem from './ContractAirdropErc1155ListItem';

export interface CotnractAirdrop1155BalanceDialogProps {
  DialogProps: DialogProps;
  contractAddres?: string;
}

export default function ContractAirdrop1155BalanceDialog({
  DialogProps,
  contractAddres,
}: CotnractAirdrop1155BalanceDialogProps) {
  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  const { data: contract } = useContract(contractAddres);
  const { data: nfts } = useNFTs(contract);

  const { account } = useWeb3React();

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage id="your.tokens" defaultMessage="Your tokens" />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent sx={{ p: 0 }}>
        <List disablePadding>
          {nfts?.map((nft, key) => (
            <ContractAirdropErc1155ListItem
              key={key}
              contractAddress={contractAddres}
              tokenId={nft.metadata.id}
              account={account}
            />
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}
