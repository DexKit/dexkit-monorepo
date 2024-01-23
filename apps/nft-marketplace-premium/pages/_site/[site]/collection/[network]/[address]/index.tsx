import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import type { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';

import { AssetListCollection } from '@/modules/nft/components/AssetListCollection';
import { AssetList } from '@/modules/nft/components/AssetListOrderbook';
import { ChipFilterTraits } from '@/modules/nft/components/ChipFilterTraits';
import { CollectionHeader } from '@/modules/nft/components/CollectionHeader';
import CollectionPageHeader from '@/modules/nft/components/CollectionPageHeader';
import { CollectionStats } from '@/modules/nft/components/CollectionStats';
import { CollectionTraits } from '@/modules/nft/components/CollectionTraits';
import TableSkeleton from '@/modules/nft/components/tables/TableSkeleton';
import DarkblockWrapper from '@/modules/wizard/components/DarkblockWrapper';
import { DropEditionListSection } from '@/modules/wizard/components/sections/DropEditionListSection';
import NftDropSection from '@/modules/wizard/components/sections/NftDropSection';
import { DARKBLOCK_SUPPORTED_CHAIN_IDS } from '@/modules/wizard/constants';
import { getIntegrationData } from '@/modules/wizard/services/integrations';
import { ChainId, MY_APPS_ENDPOINT } from '@dexkit/core';
import { NETWORK_FROM_SLUG } from '@dexkit/core/constants/networks';
import { Asset } from '@dexkit/core/types';
import { omitNull } from '@dexkit/core/utils';
import { NFTType } from '@dexkit/ui/modules/nft/constants/enum';
import { getCollectionData } from '@dexkit/ui/modules/nft/services';
import { Collection, TraderOrderFilter } from '@dexkit/ui/modules/nft/types';
import { hexToString } from '@dexkit/ui/utils';
import Search from '@mui/icons-material/Search';
import {
  Divider,
  Drawer,
  Grid,
  IconButton,
  InputAdornment,
  NoSsr,
  Stack,
  Tab,
  Tabs,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import {
  ThirdwebSDK,
  ThirdwebSDKProvider,
  useContractType,
} from '@thirdweb-dev/react';
import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { Suspense, SyntheticEvent, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { AppErrorBoundary } from 'src/components/AppErrorBoundary';
import SidebarFilters from 'src/components/SidebarFilters';
import SidebarFiltersContent from 'src/components/SidebarFiltersContent';
import Funnel from 'src/components/icons/Filter';
import MainLayout from 'src/components/layouts/main';
import { THIRDWEB_CLIENT_ID } from 'src/constants';
import { CollectionSyncStatus, NETWORK_ID } from 'src/constants/enum';
import {
  MAP_COIN_TO_RARIBLE,
  MAP_NETWORK_TO_RARIBLE,
} from 'src/constants/marketplaces';
import {
  GET_ASSET_LIST_FROM_COLLECTION,
  GET_COLLECTION_STATS,
} from 'src/hooks/collection';
import {
  COLLECTION_ASSETS_FROM_ORDERBOOK,
  GET_COLLECTION_DATA,
  useCollection,
} from 'src/hooks/nft';
import { getAppConfig } from 'src/services/app';
import {
  getApiCollectionData,
  getCollectionAssetsDexKitApi,
  getCollectionAssetsFromOrderbook,
  getSyncCollectionData,
} from 'src/services/nft';
import { getProviderBySlug } from 'src/services/providers';
import { getRariCollectionStats } from 'src/services/rarible';

const CollectionPage: NextPage<{ enableDarkblock: boolean }> = ({
  enableDarkblock,
}: {
  enableDarkblock: boolean;
}) => {
  const router = useRouter();
  const { formatMessage } = useIntl();
  const { address, network } = router.query;
  const chainId = NETWORK_FROM_SLUG(network as string)?.chainId;
  const [search, setSearch] = useState<string>();

  const { data: contractType } = useContractType(address as string);

  const isDrop = useMemo(() => {
    return contractType?.endsWith('drop');
  }, [contractType]);

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

  const [currTab, setCurrTab] = useState('collection');

  const handleChangeTab = (e: SyntheticEvent, value: string) => {
    setCurrTab(value);
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
                    {isDrop && (
                      <Grid item xs={12}>
                        <Tabs value={currTab} onChange={handleChangeTab}>
                          <Tab
                            label={
                              <FormattedMessage
                                id="collection"
                                defaultMessage="Collection"
                              />
                            }
                            value="collection"
                          />
                          <Tab
                            label={
                              contractType === 'nft-drop' ? (
                                <FormattedMessage
                                  id="drop"
                                  defaultMessage="Drop"
                                />
                              ) : (
                                <FormattedMessage
                                  id="drops"
                                  defaultMessage="Drops"
                                />
                              )
                            }
                            value="drops"
                          />
                        </Tabs>
                      </Grid>
                    )}

                    <Grid item xs={12}>
                      <CollectionStats
                        address={address as string}
                        network={network as string}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    {currTab === 'drops' && (
                      <Grid item xs={12}>
                        <Typography
                          gutterBottom
                          variant="body1"
                          sx={{ fontWeight: 600 }}
                        >
                          {contractType === 'nft-drop' ? (
                            <FormattedMessage id="drop" defaultMessage="Drop" />
                          ) : (
                            <FormattedMessage
                              id="drops"
                              defaultMessage="Drops"
                            />
                          )}
                        </Typography>
                        {contractType === 'edition-drop' && (
                          <DropEditionListSection
                            section={{
                              type: 'edition-drop-list-section',
                              config: {
                                network: network as string,
                                address: address as string,
                              },
                            }}
                          />
                        )}
                        {contractType === 'nft-drop' && (
                          <NftDropSection
                            section={{
                              type: 'nft-drop',
                              settings: {
                                address: address as string,
                                network: network as string,
                              },
                            }}
                          />
                        )}
                      </Grid>
                    )}
                    {currTab === 'collection' && (
                      <>
                        <Grid item xs={12}>
                          <Stack
                            justifyContent="space-between"
                            direction="row"
                            alignItems="center"
                            alignContent="center"
                          >
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 600 }}
                            >
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
                              fallbackRender={({
                                resetErrorBoundary,
                                error,
                              }) => (
                                <Stack
                                  justifyContent="center"
                                  alignItems="center"
                                >
                                  <Typography variant="h6">
                                    <FormattedMessage
                                      id="something.went.wrong"
                                      defaultMessage="Oops, something went wrong"
                                      description="Something went wrong error message"
                                    />
                                  </Typography>
                                  <Typography
                                    variant="body1"
                                    color="textSecondary"
                                  >
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
                                      NETWORK_FROM_SLUG(network as string)
                                        ?.chainId
                                    }
                                    search={search}
                                  />
                                </Suspense>
                              )}
                            </AppErrorBoundary>
                          </NoSsr>
                        </Grid>
                      </>
                    )}
                    {enableDarkblock && (
                      <>
                        <Grid item xs={12}>
                          <Divider />
                        </Grid>
                        <Grid item xs={12}>
                          <NoSsr>
                            <Suspense>
                              <DarkblockWrapper
                                address={address as string}
                                network={network as string}
                              />
                            </Suspense>
                          </NoSsr>
                        </Grid>
                      </>
                    )}
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

function Wrapper(props: any) {
  const { chainId, provider } = useWeb3React();

  return (
    <ThirdwebSDKProvider
      activeChain={chainId}
      clientId={THIRDWEB_CLIENT_ID}
      signer={provider?.getSigner()}
    >
      <CollectionPage {...props} />
    </ThirdwebSDKProvider>
  );
}

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
    if (network === NETWORK_ID.Ethereum || network === NETWORK_ID.Polygon) {
      const { data } = await getRariCollectionStats(
        `${MAP_NETWORK_TO_RARIBLE[network]}:${address}`,
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

  const sdk = new ThirdwebSDK(network as string);

  const twContract = await sdk.getContract(address as string);

  const isTw = twContract.abi.find((m) => m.name === 'contractVersion');

  let key: any[] = [
    GET_COLLECTION_DATA,
    address as string,
    NETWORK_FROM_SLUG(network)?.chainId,
  ];

  if (isTw) {
    const contractType: string = hexToString(
      await twContract.call('contractType'),
    );

    const metadata = await twContract.metadata.get();

    let type = contractType?.toLowerCase()?.startsWith('edition')
      ? NFTType.ERC1155
      : NFTType.ERC721;

    await queryClient.prefetchQuery(key, async () => {
      let coll = collection || ({} as Collection);

      return {
        address,
        name: metadata.name,
        chainId: NETWORK_FROM_SLUG(network)?.chainId,
        symbol: metadata.symbol,
        description: metadata.description,
        imageUrl: metadata.image,
        nftType: type,
        ...omitNull(coll),
      } as Collection;
    });
  } else {
    await queryClient.prefetchQuery(key, async () => {
      return collection;
    });
  }

  const filters: TraderOrderFilter = { nftToken: address };
  try {
    const assets = await getCollectionAssetsFromOrderbook(provider, filters);

    await queryClient.prefetchQuery(
      [COLLECTION_ASSETS_FROM_ORDERBOOK, filters],
      async () => assets,
    );
  } catch {}

  let enableDarkblock = false;

  try {
    if (
      DARKBLOCK_SUPPORTED_CHAIN_IDS.includes(
        NETWORK_FROM_SLUG(network)?.chainId as ChainId,
      )
    ) {
      const darkBlock = await getIntegrationData({
        siteId: configResponse.siteId, //
        type: 'darkblock',
        instance: axios.create({
          baseURL: MY_APPS_ENDPOINT,
          headers: {
            'DexKit-Api-Key': process.env.MARKETPLACE_API_KEY as string,
          },
        }),
      });
      if (darkBlock?.settings?.enableDarkblockCollection) {
        enableDarkblock = true;
      }
    }
  } catch {}

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      ...configResponse,
      enableDarkblock,
    },
    revalidate: 60,
  };
};
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking', // false or 'blocking'
  };
}

export default Wrapper;
