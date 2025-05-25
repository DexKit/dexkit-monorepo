import { ChainId } from '@dexkit/core/constants';
import WalletAssetsFilter from '@dexkit/ui/modules/wallet/components/WalletAssetsFilter';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import FilterListIcon from '@mui/icons-material/FilterList';
import ImportExport from '@mui/icons-material/ImportExport';
import Search from '@mui/icons-material/Search';
import {
    Box,
    Button,
    Chip,
    Grid,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import CloseCircle from '../../../components/icons/CloseCircle';

import { isAddressEqual } from '@dexkit/core/utils/blockchain';

import { Asset } from '@dexkit/core/types/nft';
import Funnel from '@dexkit/ui/components/icons/Filter';
import { AssetCard } from '@dexkit/ui/modules/nft/components/AssetCard';
import { useFavoriteAssets } from '@dexkit/ui/modules/nft/hooks';
import RemoveFavoriteDialog from './RemoveFavoriteDialog';

interface Props {
  onOpenFilters?: () => void;
  filters?: { myNfts: boolean; chainId?: ChainId; account?: string };
  setFilters?: any;
  onImport: () => void;
}

function FavoriteAssetsSection({
  onOpenFilters,
  filters,
  onImport,
  setFilters,
}: Props) {
  const [openFilter, setOpenFilter] = useState(false);
  const { account } = useWeb3React();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<Asset>();

  const { formatMessage } = useIntl();

  const { enqueueSnackbar } = useSnackbar();

  const { assets, toggleFavorite, isFavorite } = useFavoriteAssets();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleToggleFavorite = useCallback(
    (asset: Asset) => {
      setSelectedAsset(asset);
      setIsOpen(true);
    },
    [toggleFavorite],
  );

  const assetList = useMemo(() => {
    return Object.keys(assets).map((key) => assets[key]);
  }, [assets]);

  const renderAssets = () => {
    const filteredAssetList = assetList
      .filter((asset) => {
        return (
          asset.collectionName?.toLowerCase().search(search.toLowerCase()) >
            -1 ||
          (asset.metadata !== undefined &&
            asset.metadata.name.toLowerCase().search(search.toLowerCase()) > -1)
        );
      })
      .filter((asset) => {
        if (filters?.myNfts) {
          return isAddressEqual(asset.owner, account);
        }
        /*if (filters?.chainId) {
          return Number(asset.chainId) === Number(filters.chainId);
        }*/

        return true;
      });

    if (filteredAssetList.length === 0) {
      return (
        <Grid item xs={12}>
          <Box sx={{ py: 4 }}>
            <Stack
              justifyContent="center"
              alignItems="center"
              alignContent="center"
              spacing={2}
            >
              <CloseCircle color="error" />
              <Typography variant="body1" color="textSecondary">
                <FormattedMessage
                  id="no.nfts.found"
                  defaultMessage="No NFTs Found"
                />
              </Typography>
              <Typography align="center" variant="body1" color="textSecondary">
                <FormattedMessage
                  id="import.or.favorite.nfts"
                  defaultMessage="Import or favorite NFTs"
                />
              </Typography>
            </Stack>
          </Box>
        </Grid>
      );
    }

    return filteredAssetList.map((asset, index) => (
      <Grid item xs={6} sm={3} key={index}>
        <AssetCard
          asset={asset}
          key={index}
          onFavorite={handleToggleFavorite}
          isFavorite={isFavorite(asset)}
        />
      </Grid>
    ));
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    setSelectedAsset(undefined);
  };

  const handleConfirm = () => {
    toggleFavorite(selectedAsset);
    enqueueSnackbar(
      formatMessage({
        defaultMessage: 'NFT removed from your favorites',
        id: 'nft.removed.from.your.favorites',
      }),
      {
        variant: 'success',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      },
    );
    setIsOpen(false);
    setSelectedAsset(undefined);
  };

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <>
      <RemoveFavoriteDialog
        dialogProps={{ open: isOpen, onClose: handleCloseDialog }}
        onConfirm={handleConfirm}
      />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {isDesktop ? (
            <Stack
              direction="row"
              justifyContent="start"
              alignItems="center"
              alignContent="center"
              spacing={2}
            >
              <IconButton
                onClick={() => {
                  setOpenFilter(!openFilter);
                }}
              >
                <FilterListIcon />
              </IconButton>
              <TextField
                type="search"
                size="small"
                value={search}
                onChange={handleChange}
                placeholder={formatMessage({
                  id: 'search.for.a.nft',
                  defaultMessage: 'Search for a NFT',
                })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Search color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                startIcon={<ImportExport />}
                onClick={onImport}
                variant="outlined"
                color="primary"
              >
                <FormattedMessage id="import.nft" defaultMessage="Import NFT" />
              </Button>

              <Chip
                label={
                  <>
                    {assetList.length}{' '}
                    <FormattedMessage id="nfts" defaultMessage="NFTs" />
                  </>
                }
                color="secondary"
              />
            </Stack>
          ) : (
            <Stack spacing={2}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                alignContent="center"
              >
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  alignContent="center"
                >
                  <Button
                    startIcon={<ImportExport />}
                    onClick={onImport}
                    variant="outlined"
                    color="primary"
                  >
                    <FormattedMessage
                      id="import.nft"
                      defaultMessage="Import NFT"
                    />
                  </Button>
                  <Chip
                    label={
                      <>
                        {assetList.length}{' '}
                        <FormattedMessage id="nfts" defaultMessage="NFTs" />
                      </>
                    }
                    color="secondary"
                  />
                </Stack>
                <IconButton onClick={onOpenFilters}>
                  <Funnel />
                </IconButton>
              </Stack>
              <TextField
                type="search"
                size="small"
                value={search}
                onChange={handleChange}
                placeholder={formatMessage({
                  id: 'search.for.a.nft',
                  defaultMessage: 'Search for a NFT',
                })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Search color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          )}
        </Grid>
        {openFilter && (
          <Grid item xs={3}>
            <WalletAssetsFilter
              setFilters={setFilters}
              filters={filters}
              onClose={() => setOpenFilter(false)}
            />
          </Grid>
        )}

        <Grid container item xs={openFilter ? 9 : 12}>
          {renderAssets()}
        </Grid>
      </Grid>
    </>
  );
}

export default FavoriteAssetsSection;
