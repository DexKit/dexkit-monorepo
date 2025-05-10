import AppErrorBoundary from '@/modules/common/components/AppErrorBoundary';
import { DRAWER_WIDTH } from '@/modules/common/constants';
import { NETWORKS } from '@/modules/common/constants/networks';
import { Network } from '@/modules/common/types/networks';
import { isAddressEqual, parseChainId } from '@/modules/common/utils';
import { Apps, Error, FilterAlt, Search } from '@mui/icons-material';
import TableRows from '@mui/icons-material/TableRows';
import {
  Box,
  Card,
  Checkbox,
  Divider,
  Drawer,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  NoSsr,
  Skeleton,
  Stack,
  Switch,
  Toolbar,
  Typography,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { useAtom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { Suspense, useCallback, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { nftAccountsAtom, nftsLastFetchAtom } from '../atoms';
import { useAccounts } from '../hooks';
import { useDebounce } from '../hooks/swap';
import { Account } from '../types';
import { DkApiAsset } from '../types/dexkitapi';
import EvmTransferNftDialog from './dialogs/EvmTransferNftDialog';
import NftGrid from './NftGrid';
import NftTable from './NftTable';
import { SearchTextField } from './SearchTextField';
import SelectNftAccountsList from './SelectNftAccountsList';

export default function NftsTab() {
  const renderSkeleton = () => {
    return (
      <Grid container spacing={2}>
        {new Array(12).fill(null).map((n, index) => (
          <Grid
            key={index}
            item
            xs={6}
            sm={2}
            sx={{ width: '100%', height: '100%' }}
          >
            <Card sx={{ width: '100%', height: 'auto' }}>
              <Skeleton
                key={n}
                variant="rectangular"
                sx={{ width: '100%', paddingTop: '100%' }}
              />
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const { evmAccounts } = useAccounts({});

  const defaultSelectedWallets = useMemo(() => {
    let obj: { [key: number]: boolean } = {};

    for (let key of Object.keys(NETWORKS).filter(
      (key) => !NETWORKS[parseChainId(key)].testnet
    )) {
      obj[parseChainId(key)] = true;
    }

    return obj;
  }, []);

  const [selectedNetworks, setSelectedNetworks] = useState<{
    [key: number]: boolean;
  }>(defaultSelectedWallets);

  const networks = useMemo(() => {
    return Object.keys(NETWORKS)
      .map((key: string) => NETWORKS[parseChainId(key)])
      .filter((n) => !n.testnet);
  }, []);

  const selectedIds = useMemo(() => {
    const selected = Object.keys(selectedNetworks)
      .filter((key) => selectedNetworks[parseChainId(key)])
      .map((key) => NETWORKS[parseChainId(key)].slug);

    return selected;
  }, [selectedNetworks]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const chainId = parseChainId(event.target.value);

      setSelectedNetworks((selectedNetworks) => {
        return {
          ...selectedNetworks,
          [chainId]: !Boolean(selectedNetworks[chainId]),
        };
      });
    },
    []
  );

  const { account, provider, chainId } = useWeb3React();

  const [showHidden, setSHowHidden] = useState(false);

  const [selectedNft, setSelectedNft] = useState<DkApiAsset>();

  const handleTransferNft = (nft: DkApiAsset) => {
    setSelectedNft(nft);
    setShowSendNft(true);
  };

  const handleCloseSendNft = () => {
    setSelectedNft(undefined);
    setShowSendNft(false);
  };

  const handleChangeShowHidden = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSHowHidden((value) => !value);
  };

  const [showSendNft, setShowSendNft] = useState(false);

  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleDrawer = () => {
    setShowFilters((value) => !value);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const setLastFetch = useUpdateAtom(nftsLastFetchAtom);

  const [nftAccounts, setNftAccounts] = useAtom(nftAccountsAtom);

  const lazyNftAccounts = useDebounce<Account[]>(nftAccounts, 500);

  const lazyNetworksIds = useDebounce<string[]>(selectedIds, 500);

  const [showGrid, setShowGrid] = useState(true);

  const handleToggleNftView = () => {
    setShowGrid((value) => !value);
  };

  const handleSelectAccount = (account: Account) => {
    setNftAccounts((accounts) => {
      const temp = [...accounts];

      const index = temp.findIndex((c) =>
        isAddressEqual(c.address, account.address)
      );

      if (index > -1) {
        temp.splice(index, 1);
      } else {
        temp.push(account);
      }

      return temp;
    });

    setLastFetch(0);
  };

  const renderFilters = () => {
    return (
      <Box>
        <Box p={2}>
          <Stack spacing={2}>
            <FormControlLabel
              componentsProps={{ typography: { variant: 'body2' } }}
              control={
                <Switch
                  value={showHidden}
                  onChange={handleChangeShowHidden}
                  checked={showHidden}
                />
              }
              label={
                <FormattedMessage
                  id="show.hidden"
                  defaultMessage="Show hidden?"
                />
              }
            />
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              <FormattedMessage id="networks" defaultMessage="Networks" />
            </Typography>
          </Stack>
        </Box>
        <Divider />
        <Stack
          sx={{
            overflowY: 'scroll',
            maxHeight: (theme) => theme.spacing(40),
            px: 2,
            py: 1,
          }}
        >
          {networks.map((network: Network, index: number) => (
            <FormControlLabel
              key={index}
              componentsProps={{ typography: { variant: 'body2' } }}
              control={
                <Checkbox
                  size="small"
                  value={network.chainId}
                  onChange={handleChange}
                  checked={Boolean(selectedNetworks[network.chainId])}
                />
              }
              label={network.name}
            />
          ))}
        </Stack>
        <Divider />
        <Box p={2}>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            <FormattedMessage id="accounts" defaultMessage="Accounts" />
          </Typography>
        </Box>
        <Divider />
        <Box
          sx={{ overflowY: 'scroll', maxHeight: (theme) => theme.spacing(40) }}
        >
          <SelectNftAccountsList
            accounts={evmAccounts}
            selectedAccounts={nftAccounts}
            onSelectAccount={handleSelectAccount}
          />
        </Box>
      </Box>
    );
  };

  return (
    <>
      <EvmTransferNftDialog
        DialogProps={{
          open: showSendNft,
          maxWidth: 'xs',
          fullWidth: true,
          onClose: handleCloseSendNft,
        }}
        contractAddress={selectedNft?.address}
        tokenId={selectedNft?.tokenId}
        provider={provider}
        account={account}
        chainId={chainId}
      />

      <Drawer onClose={toggleDrawer} variant="temporary" open={showFilters}>
        <Toolbar />
        <Box sx={{ minWidth: DRAWER_WIDTH }}>{renderFilters()}</Box>
      </Drawer>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box>
              <Stack direction="row" spacing={2} alignItems="center">
                <SearchTextField
                  TextFieldProps={{
                    fullWidth: true,
                    size: 'small',
                    InputProps: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    },
                  }}
                  onChange={handleSearchChange}
                />
                <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                  <IconButton onClick={toggleDrawer}>
                    <FilterAlt />
                  </IconButton>
                </Box>
                <Box>
                  <IconButton onClick={handleToggleNftView}>
                    {showGrid ? <Apps /> : <TableRows />}
                  </IconButton>
                </Box>
              </Stack>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sm={2}
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            <Card>{renderFilters()}</Card>
          </Grid>
          <Grid item xs={12} sm={10}>
            <NoSsr>
              <AppErrorBoundary
                fallbackRender={() => (
                  <Box>
                    <Stack
                      spacing={2}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Error fontSize="large" />
                      <Box>
                        <Typography align="center" variant="h5">
                          <FormattedMessage
                            id="oops.somtheing.went.wrong"
                            defaultMessage="Oops, something went wrong"
                          />
                        </Typography>
                        <Typography
                          align="center"
                          variant="body1"
                          color="text.secondary"
                        >
                          <FormattedMessage
                            id="error.while.loading.nfts"
                            defaultMessage="Error while loading NFTs"
                          />
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                )}
              >
                <Suspense fallback={renderSkeleton()}>
                  {showGrid ? (
                    <NftGrid
                      networks={lazyNetworksIds}
                      accounts={lazyNftAccounts.map((a) => a.address)}
                      onTransfer={handleTransferNft}
                      showHidden={showHidden}
                      searchQuery={searchQuery}
                    />
                  ) : (
                    <NftTable
                      networks={lazyNetworksIds}
                      accounts={lazyNftAccounts.map((a) => a.address)}
                      onTransfer={handleTransferNft}
                      showHidden={showHidden}
                      searchQuery={searchQuery}
                    />
                  )}
                </Suspense>
              </AppErrorBoundary>
            </NoSsr>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
