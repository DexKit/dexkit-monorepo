import NFTGrid from '@dexkit/dexappbuilder-viewer/components/NFTGrid';
import NFTDropSummary from '@dexkit/dexappbuilder-viewer/components/NftDropSummary';
import { Button, Divider, Tab, Tabs, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useContract, useNFTs } from '@thirdweb-dev/react';
import { SyntheticEvent, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import ContractAdminTab from '../ContractAdminTab';
import ContractMetadataTab from '../ContractMetadataTab';
import CreateAssetFormDialog from '../dialogs/CreateAssetFormDialog';
import { ClaimConditionsContainer } from './ClaimConditionsContainer';

interface ContractNftDropContainerProps {
  address: string;
  network: string;
}

export default function ContractNftDropContainer({
  address,
  network,
}: ContractNftDropContainerProps) {
  const { data: contract } = useContract(address, 'nft-drop');

  const [currTab, setCurrTab] = useState('nfts');

  const handleChange = (e: SyntheticEvent, value: string) => {
    setCurrTab(value);
  };

  const nftsQuery = useNFTs(contract);

  const [isOpen, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleMint = () => {
    setOpen(true);
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
        isLazyMint
      />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <NFTDropSummary contract={contract} />
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Tabs value={currTab} onChange={handleChange}>
                <Tab
                  value="nfts"
                  label={<FormattedMessage id="nfts" defaultMessage="NFTs" />}
                />
                <Tab
                  value="claim-conditions"
                  label={
                    <FormattedMessage
                      id="claim.conditions"
                      defaultMessage="Claim Conditions"
                    />
                  }
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
            {currTab === 'claim-conditions' && (
              <Grid item xs={12}>
                <ClaimConditionsContainer address={address} network={network} />
              </Grid>
            )}
            {currTab === 'nfts' && (
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <Grid item>
                        <Button onClick={handleMint} variant="contained">
                          <FormattedMessage id="mint" defaultMessage="Mint" />
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h5">
                      <FormattedMessage id="my.nfts" defaultMessage="My NFTs" />
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    {nftsQuery.data ? (
                      <NFTGrid
                        nfts={nftsQuery.data}
                        network={network}
                        address={address}
                      />
                    ) : null}
                  </Grid>
                </Grid>
              </Grid>
            )}
            {currTab === 'metadata' && (
              <Grid item xs={12}>
                <ContractMetadataTab address={address} />
              </Grid>
            )}
            {currTab === 'admin' && (
              <Grid item xs={12}>
                <ContractAdminTab address={address} />
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
