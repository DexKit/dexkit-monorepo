import Search from '@mui/icons-material/Search';
import { Tab, Tabs, useMediaQuery, useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import NoSsr from '@mui/material/NoSsr';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { SyntheticEvent, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { AppErrorBoundary } from '@dexkit/ui/components/AppErrorBoundary';
import { AssetListContractEdition } from '../AssetListContractEdition';
import ContractAdminTab from '../ContractAdminTab';
import ContractMetadataTab from '../ContractMetadataTab';
import CreateAssetFormDialog from '../dialogs/CreateAssetFormDialog';
interface Props {
  address: string;
  network: string;
}

type TabValues = 'nfts' | 'metadata' | 'admin';

export default function ContractEditionDropContainer({
  address,
  network,
}: Props) {
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [tab, setTab] = useState<TabValues>('nfts');
  const [search, setSearch] = useState('');
  const [openMintDialog, setOpenMintDialog] = useState(false);

  const handleChangeTab = (e: SyntheticEvent, value: TabValues) => {
    setTab(value);
  };

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <>
      <CreateAssetFormDialog
        dialogProps={{
          open: openMintDialog,
          onClose: () => setOpenMintDialog(false),
          fullWidth: true,
          maxWidth: 'xl',
        }}
        network={network}
        address={address}
        isLazyMint
      />

      <Grid container spacing={isMobile ? 1 : 2}>
        <Grid item xs={12}>
          <Tabs
            value={tab}
            onChange={handleChangeTab}
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
              label={<FormattedMessage id="nft" defaultMessage="NFTs" />}
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
        {tab === 'nfts' && (
          <Grid item xs={12}>
            <Grid container spacing={isMobile ? 1 : 2}>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  onClick={() => setOpenMintDialog(true)}
                  size={isMobile ? "small" : "medium"}
                  fullWidth={isMobile}
                  sx={{
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                    py: isMobile ? 0.75 : 1,
                    px: isMobile ? 1.5 : 2,
                  }}
                >
                  <FormattedMessage defaultMessage="Mint NFT" id="mint.nft" />
                </Button>
              </Grid>

              <Grid item xs={12} sm={isMobile ? 12 : 3}>
                <TextField
                  fullWidth
                  size={isMobile ? "small" : "small"}
                  type="search"
                  value={search}
                  onChange={handleChangeSearch}
                  placeholder={formatMessage({
                    id: 'search.in.collection',
                    defaultMessage: 'Search in collection',
                  })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Search color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      fontSize: isMobile ? '0.875rem' : '1rem',
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant={isMobile ? "h6" : "h5"}
                  sx={{
                    fontSize: isMobile ? '1.1rem' : '1.5rem',
                    fontWeight: 600,
                    mb: isMobile ? 1 : 2
                  }}
                >
                  <FormattedMessage
                    defaultMessage="Collection NFTs"
                    id="collection.nfts"
                  />
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <NoSsr>
                  <AppErrorBoundary
                    fallbackRender={({ error, resetErrorBoundary }) => (
                      <div>
                        <Typography color="error">
                          <FormattedMessage
                            id="error.loading.nfts"
                            defaultMessage="Error loading NFTs"
                          />
                        </Typography>
                        <Button onClick={resetErrorBoundary} size="small">
                          <FormattedMessage
                            id="try.again"
                            defaultMessage="Try again"
                          />
                        </Button>
                      </div>
                    )}
                  >
                    <AssetListContractEdition
                      contractAddress={address}
                      network={network}
                      search={search}
                    />
                  </AppErrorBoundary>
                </NoSsr>
              </Grid>
            </Grid>
          </Grid>
        )}
        {tab === 'metadata' && (
          <Grid item xs={12}>
            <ContractMetadataTab address={address} />
          </Grid>
        )}
        {tab === 'admin' && (
          <Grid item xs={12}>
            <ContractAdminTab address={address} />
          </Grid>
        )}
      </Grid>
    </>
  );
}
