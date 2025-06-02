import NFTGrid from '@dexkit/dexappbuilder-viewer/components/NFTGrid';
import { Button, Tab, Tabs } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useContract, useNFTs } from '@thirdweb-dev/react';
import { SyntheticEvent, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import ContractAdminTab from '../ContractAdminTab';
import ContractMetadataTab from '../ContractMetadataTab';
import CreateAssetFormDialog from '../dialogs/CreateAssetFormDialog';

type TabValues = 'nft' | 'metadata' | 'admin';

interface Props {
  address: string;
  network: string;
}

export default function ContractNftContainer({ address, network }: Props) {
  const { data: contract } = useContract(address, 'nft-collection');

  const nftsQuery = useNFTs(contract);

  const [isOpen, setIsOpen] = useState(false);

  const handleMint = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const [tab, setTab] = useState<TabValues>('nft');

  const handleChangeTab = (e: SyntheticEvent, value: TabValues) => {
    setTab(value);
  };

  return (
    <>
      <CreateAssetFormDialog
        dialogProps={{
          open: isOpen,
          onClose: handleClose,
          fullWidth: true,
          maxWidth: 'xl',
        }}
        network={network}
        address={address}
      />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Tabs value={tab} onChange={handleChangeTab}>
            <Tab
              value="nft"
              label={<FormattedMessage id="nft" defaultMessage="NFT" />}
            />
            <Tab
              value="metadata"
              label={
                <FormattedMessage id="metadata" defaultMessage="Metadata" />
              }
            />
            <Tab
              value="admin"
              label={<FormattedMessage id="admin" defaultMessage="Admin" />}
            />
          </Tabs>
        </Grid>
        <Grid item xs={12}>
          {tab === 'nft' && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button onClick={handleMint} variant="contained">
                  <FormattedMessage id="mint" defaultMessage="Mint" />
                </Button>
              </Grid>
              <Grid item xs={12}>
                <NFTGrid
                  network={network}
                  address={address}
                  nfts={nftsQuery.data || []}
                />
              </Grid>
            </Grid>
          )}
          {tab === 'metadata' && <ContractMetadataTab address={address} />}
          {tab === 'admin' && <ContractAdminTab address={address} />}
        </Grid>
      </Grid>
    </>
  );
}
