import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import type { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';

import { AssetListContractCollection } from '@/modules/contract-wizard/components/AssetListContractCollection';
import { ContractCollectionHeader } from '@/modules/contract-wizard/components/CollectionHeader';
import ContractCollectionPageHeader from '@/modules/contract-wizard/components/CollectionPageHeader';
import { ChipFilterTraits } from '@/modules/nft/components/ChipFilterTraits';

import Search from '@mui/icons-material/Search';
import {
  Divider,
  Drawer,
  Grid,
  IconButton,
  InputAdornment,
  NoSsr,
  Stack,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import MainLayout from 'src/components/layouts/main';

import { GET_ASSET_LIST_FROM_COLLECTION } from 'src/hooks/collection';

import { getAppConfig } from 'src/services/app';

import { Asset } from '@dexkit/core/types/nft';
import { getChainIdFromSlug } from '@dexkit/core/utils/blockchain';
import { AppErrorBoundary } from '@dexkit/ui/components/AppErrorBoundary';
import SidebarFilters from '@dexkit/ui/components/SidebarFilters';
import SidebarFiltersContent from '@dexkit/ui/components/SidebarFiltersContent';
import Funnel from '@dexkit/ui/components/icons/Filter';
import { CollectionStats } from '@dexkit/ui/modules/nft/components/CollectionStats';
import { CollectionSyncStatus } from '@dexkit/ui/modules/nft/constants/enum';
import {
  IS_SUPPORTED_BY_RARIBLE,
  MAP_COIN_TO_RARIBLE,
  MAP_NETWORK_TO_RARIBLE,
  SUPPORTED_RARIBLE_NETWORKS,
} from '@dexkit/ui/modules/nft/constants/marketplaces';
import {
  GET_COLLECTION_DATA,
  GET_COLLECTION_STATS,
  GET_CONTRACT_COLLECTION_DATA,
  useCollection,
} from '@dexkit/ui/modules/nft/hooks/collection';
import {
  getApiContractCollectionData,
  getCollectionAssetsDexKitApi,
  getSyncCollectionData,
} from '@dexkit/ui/modules/nft/services/collection';
import { getRariCollectionStats } from '@dexkit/ui/modules/nft/services/rarible';

const ContractWizardCollectionPage: NextPage = () => {
  const router = useRouter();
  const { formatMessage } = useIntl();
  const { address, network } = router.query;
  const chainId = getChainIdFromSlug(network as string)?.chainId;
  const [search, setSearch] = useState<string>();

  const { data: collection } = useCollection(address as string, chainId);
  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleCloseDrawer = () => setIsFiltersOpen(false);
  const handleOpenDrawer = () => setIsFiltersOpen(true);

  const renderSidebar = (onClose?: () => void) => {
    return (
      <SidebarFilters
        title={<FormattedMessage id="filters" defaultMessage="Filters" />}
        onClose={onClose}
      >
        <SidebarFiltersContent>
          <TextField
            fullWidth
            size="small"
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
          />
        </SidebarFiltersContent>
      </SidebarFilters>
    );
  };

  const renderDrawer = () => {
    return (
      <Drawer open={isFiltersOpen} onClose={handleCloseDrawer}>
        <Box
          sx={(theme) => ({ minWidth: `${theme.breakpoints.values.sm / 2}px` })}
        >
          {renderSidebar(handleCloseDrawer)}
        </Box>
      </Drawer>
    );
  };

  return (
    <>
      <NextSeo title={collection?.name || ''} />
      {renderDrawer()}
      <MainLayout disablePadding>
        <Grid container>
          {isDesktop && (
            <Grid item xs={12} sm={2}>
              {renderSidebar()}
            </Grid>
          )}
          <Grid item xs={12} sm={10}>
            <Box p={2}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <ContractCollectionPageHeader
                    networkId={network as string}
                    address={address as string}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <ContractCollectionHeader
                        address={address as string}
                        networkId={network as string}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CollectionStats
                        address={address as string}
                        network={network as string}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        onClick={() =>
                          router.push(
                            `/contract-wizard/collection/${network}/${address}/create-nfts`,
                          )
                        }
                      >
                        <FormattedMessage
                          id={'create.nfts'}
                          defaultMessage={'Create NFTs'}
                        />
                      </Button>
                    </Grid>

                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <Grid item xs={12}>
                      <Stack
                        justifyContent="space-between"
                        direction="row"
                        alignItems="center"
                        alignContent="center"
                      >
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          <FormattedMessage
                            id="collection"
                            defaultMessage="Collection"
                            description="collection"
                          />
                        </Typography>
                        <Box>
                          {!isDesktop && (
                            <IconButton onClick={handleOpenDrawer}>
                              <Funnel />
                            </IconButton>
                          )}
                        </Box>
                      </Stack>
                      <ChipFilterTraits
                        address={address as string}
                        chainId={chainId}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <NoSsr>
                        <AppErrorBoundary
                          fallbackRender={({ resetErrorBoundary, error }) => (
                            <Stack justifyContent="center" alignItems="center">
                              <Typography variant="h6">
                                <FormattedMessage
                                  id="something.went.wrong"
                                  defaultMessage="Oops, something went wrong"
                                  description="Something went wrong error message"
                                />
                              </Typography>
                              <Typography variant="body1" color="textSecondary">
                                {String(error)}
                              </Typography>
                              <Button
                                color="primary"
                                onClick={resetErrorBoundary}
                              >
                                <FormattedMessage
                                  id="try.again"
                                  defaultMessage="Try again"
                                  description="Try again"
                                />
                              </Button>
                            </Stack>
                          )}
                        >
                          {(collection?.syncStatus ===
                            CollectionSyncStatus.Synced ||
                            collection?.syncStatus ===
                              CollectionSyncStatus.Syncing) && (
                            <AssetListContractCollection
                              contractAddress={address as string}
                              network={network as string}
                              search={search}
                            />
                          )}
                        </AppErrorBoundary>
                      </NoSsr>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </MainLayout>
    </>
  );
};

type Params = {
  site?: string;
  address?: string;
  network?: string;
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  const network = params?.network;
  const address = params?.address?.toLowerCase();
  const queryClient = new QueryClient();
  const configResponse = await getAppConfig(params?.site, 'no-page-defined');
  const contract = await getApiContractCollectionData(network, address);
  const collection = contract?.collection;

  await queryClient.prefetchQuery(
    [GET_COLLECTION_DATA, address as string, network],
    async () => {
      return collection;
    },
  );

  await queryClient.prefetchQuery(
    [GET_CONTRACT_COLLECTION_DATA, address as string, network],
    async () => {
      return contract;
    },
  );

  let collectionAssets: Asset[] = [];
  if (
    collection &&
    (collection.syncStatus === CollectionSyncStatus.Synced ||
      collection.syncStatus === CollectionSyncStatus.Syncing) &&
    address &&
    network
  ) {
    collectionAssets = (
      await getCollectionAssetsDexKitApi({
        networkId: network,
        contractAddress: address,
        skip: 0,
        take: 50,
      })
    ).data.map((asset) => {
      let metadata: any = {};
      if (asset.rawData) {
        metadata = JSON.parse(asset.rawData);
      }
      if (asset.imageUrl && metadata) {
        metadata.image = asset.imageUrl;
      }
      return {
        contractAddress: asset.address,
        id: String(asset.tokenId),
        chainId: asset.chainId,
        tokenURI: asset.tokenURI,
        collectionName: asset.collectionName,
        symbol: asset.symbol,
        metadata,
      };
    }) as Asset[];
  }
  // We sync here the collection
  if (collection?.syncStatus === CollectionSyncStatus.NotSynced) {
    getSyncCollectionData(network, address);
  }

  await queryClient.prefetchQuery(
    [GET_ASSET_LIST_FROM_COLLECTION, network, address, 0, 50],
    async () => {
      return collectionAssets;
    },
  );
  try {
    if (
      network &&
      IS_SUPPORTED_BY_RARIBLE(network as SUPPORTED_RARIBLE_NETWORKS)
    ) {
      const { data } = await getRariCollectionStats(
        `${
          MAP_NETWORK_TO_RARIBLE[network as SUPPORTED_RARIBLE_NETWORKS]
        }:${address}`,
        MAP_COIN_TO_RARIBLE[network],
      );

      await queryClient.prefetchQuery(
        [GET_COLLECTION_STATS, network, address],
        async () => {
          return data;
        },
      );
    }
  } catch (e) {
    console.log(e);
  }

  return {
    props: { dehydratedState: dehydrate(queryClient), ...configResponse },
    revalidate: 60,
  };
};
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking', // false or 'blocking'
  };
}

export default ContractWizardCollectionPage;
