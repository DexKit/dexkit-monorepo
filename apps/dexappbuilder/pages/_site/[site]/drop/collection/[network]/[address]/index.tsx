import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import type { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';

import { NETWORK_FROM_SLUG } from '@dexkit/core/constants/networks';
import { Asset } from '@dexkit/core/types';
import { AssetListCollection } from '@dexkit/ui/modules/nft/components/AssetListCollection';
import { AssetList } from '@dexkit/ui/modules/nft/components/AssetListOrderbook';

import { CollectionHeader } from '@dexkit/ui/modules/nft/components/CollectionHeader';
import CollectionPageHeader from '@dexkit/ui/modules/nft/components/CollectionPageHeader';
import { CollectionStats } from '@dexkit/ui/modules/nft/components/CollectionStats';
import { CollectionTraits } from '@dexkit/ui/modules/nft/components/CollectionTraits';
import TableSkeleton from '@dexkit/ui/modules/nft/components/tables/TableSkeleton';
import {
  getApiCollectionData,
  getCollectionAssetsDexKitApi,
  getCollectionAssetsFromOrderbook,
  getCollectionData,
  getSyncCollectionData,
} from '@dexkit/ui/modules/nft/services/collection';
import { Collection, TraderOrderFilter } from '@dexkit/ui/modules/nft/types';
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
import { Suspense, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import MainLayout from 'src/components/layouts/main';
import { REVALIDATE_PAGE_TIME } from 'src/constants';

import { GET_ASSET_LIST_FROM_COLLECTION } from 'src/hooks/collection';

import { ChipFilterTraits } from '@/modules/nft/components/ChipFilterTraits';
import { AppErrorBoundary } from '@dexkit/ui/components/AppErrorBoundary';
import SidebarFilters from '@dexkit/ui/components/SidebarFilters';
import SidebarFiltersContent from '@dexkit/ui/components/SidebarFiltersContent';
import Funnel from '@dexkit/ui/components/icons/Filter';
import { CollectionSyncStatus } from '@dexkit/ui/modules/nft/constants/enum';
import {
  IS_SUPPORTED_BY_RARIBLE,
  MAP_COIN_TO_RARIBLE,
  MAP_NETWORK_TO_RARIBLE,
  SUPPORTED_RARIBLE_NETWORKS,
} from '@dexkit/ui/modules/nft/constants/marketplaces';
import {
  COLLECTION_ASSETS_FROM_ORDERBOOK,
  GET_COLLECTION_DATA,
  GET_COLLECTION_STATS,
  useCollection,
} from '@dexkit/ui/modules/nft/hooks/collection';
import { getRariCollectionStats } from '@dexkit/ui/modules/nft/services/rarible';
import { getProviderBySlug } from '@dexkit/ui/services/providers';
import { getAppConfig } from 'src/services/app';

const CollectionPage: NextPage = () => {
  const router = useRouter();
  const { formatMessage } = useIntl();
  const { address, network } = router.query;
  const chainId = NETWORK_FROM_SLUG(network as string)?.chainId;
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
          <CollectionTraits address={address as string} chainId={chainId} />
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
                  <CollectionPageHeader
                    chainId={chainId}
                    address={address as string}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <CollectionHeader
                        address={address as string}
                        chainId={chainId}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CollectionStats
                        address={address as string}
                        network={network as string}
                      />
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
                          {collection?.syncStatus ===
                            CollectionSyncStatus.Synced ||
                          collection?.syncStatus ===
                            CollectionSyncStatus.Syncing ? (
                            <AssetListCollection
                              contractAddress={address as string}
                              network={network as string}
                              search={search}
                            />
                          ) : (
                            <Suspense fallback={<TableSkeleton rows={4} />}>
                              <AssetList
                                contractAddress={address as string}
                                chainId={
                                  NETWORK_FROM_SLUG(network as string)?.chainId
                                }
                                search={search}
                              />
                            </Suspense>
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
  const address = params?.address;
  const configResponse = await getAppConfig(params?.site, 'home');
  const queryClient = new QueryClient();
  let collection: Collection | undefined;
  try {
    collection = await getApiCollectionData(network, address);
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
  } catch {}

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

  const provider = getProviderBySlug(network as string);
  if (!collection) {
    try {
      collection = await getCollectionData(provider, address as string);
    } catch {}
  }

  await queryClient.prefetchQuery(
    [
      GET_COLLECTION_DATA,
      address as string,
      NETWORK_FROM_SLUG(network)?.chainId,
    ],
    async () => {
      return collection;
    },
  );

  const filters: TraderOrderFilter = { nftToken: address };
  try {
    const assets = await getCollectionAssetsFromOrderbook(provider, filters);

    await queryClient.prefetchQuery(
      [COLLECTION_ASSETS_FROM_ORDERBOOK, filters],
      async () => assets,
    );
  } catch {}

  return {
    props: { dehydratedState: dehydrate(queryClient), ...configResponse },
    revalidate: REVALIDATE_PAGE_TIME,
  };
};
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking', // false or 'blocking'
  };
}

export default CollectionPage;
