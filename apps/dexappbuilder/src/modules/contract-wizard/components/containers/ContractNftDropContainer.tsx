import NFTGrid from '@dexkit/dexappbuilder-viewer/components/NFTGrid';
import NFTDropSummary from '@dexkit/dexappbuilder-viewer/components/NftDropSummary';
import { Button, Divider, Tab, Tabs, Typography, useMediaQuery, useTheme } from '@mui/material';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
      <Grid container spacing={isMobile ? 1 : 2}>
        <Grid size={12}>
          <NFTDropSummary contract={contract} />
        </Grid>

        <Grid size={12}>
          <Divider />
        </Grid>
        <Grid size={12}>
          <Grid container spacing={isMobile ? 1 : 2}>
            <Grid size={12}>
              <Tabs
                value={currTab}
                onChange={handleChange}
                variant={isMobile ? "scrollable" : "standard"}
                scrollButtons={isMobile ? "auto" : false}
                allowScrollButtonsMobile={isMobile}
                sx={{
                  '& .MuiTab-root': {
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                    minHeight: isMobile ? 40 : 48,
                    padding: isMobile ? theme.spacing(0.5, 1) : theme.spacing(1, 2),
                    minWidth: isMobile ? 'auto' : 160,
                  },
                  '& .MuiTabs-indicator': {
                    height: isMobile ? 2 : 3,
                  }
                }}
              >
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
              <Grid size={12}>
                <ClaimConditionsContainer address={address} network={network} />
              </Grid>
            )}
            {currTab === 'nfts' && (
              <Grid size={12}>
                <Grid container spacing={isMobile ? 1 : 2}>
                  <Grid size={12}>
                    <Grid container spacing={isMobile ? 1 : 2}>
                      <Grid>
                        <Button
                          onClick={handleMint}
                          variant="contained"
                          size={isMobile ? "small" : "medium"}
                          sx={{
                            fontSize: isMobile ? '0.75rem' : '0.875rem',
                            py: isMobile ? 0.75 : 1,
                            px: isMobile ? 1.5 : 2,
                          }}
                        >
                          <FormattedMessage id="mint" defaultMessage="Mint" />
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid size={12}>
                    <Typography
                      variant={isMobile ? "h6" : "h5"}
                      sx={{
                        fontSize: isMobile ? '1.1rem' : '1.5rem',
                        fontWeight: 600,
                      }}
                    >
                      <FormattedMessage id="my.nfts" defaultMessage="My NFTs" />
                    </Typography>
                  </Grid>
                  <Grid size={12}>
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
              <Grid size={12}>
                <ContractMetadataTab address={address} />
              </Grid>
            )}
            {currTab === 'admin' && (
              <Grid size={12}>
                <ContractAdminTab address={address} />
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
