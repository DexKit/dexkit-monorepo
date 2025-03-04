import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';

import { DARKBLOCK_SUPPORTED_CHAIN_IDS } from '@/modules/wizard/constants';
import { getIntegrationData } from '@/modules/wizard/services/integrations';
import { ChainId, MY_APPS_ENDPOINT } from '@dexkit/core';
import { NETWORK_FROM_SLUG } from '@dexkit/core/constants/networks';
import { Asset } from '@dexkit/core/types';
import { isAddressEqual, omitNull } from '@dexkit/core/utils';
import SidebarFilters from '@dexkit/ui/components/SidebarFilters';
import SidebarFiltersContent from '@dexkit/ui/components/SidebarFiltersContent';
import { CollectionTraits } from '@dexkit/ui/modules/nft/components/CollectionTraits';
import {
  CollectionSyncStatus,
  NFTType,
} from '@dexkit/ui/modules/nft/constants/enum';

import { Collection, TraderOrderFilter } from '@dexkit/ui/modules/nft/types';
import { hexToString } from '@dexkit/ui/utils';
import { getIsLockAsync } from '@dexkit/unlock-widget';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import Search from '@mui/icons-material/Search';
import {
  Checkbox,
  Container,
  Drawer,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  Stack,
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
import axios from 'axios';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import MainLayout from 'src/components/layouts/main';
import { REVALIDATE_PAGE_TIME, THIRDWEB_CLIENT_ID } from 'src/constants';

import { getAppConfig } from 'src/services/app';

import CollectionSection from '@dexkit/dexappbuilder-viewer/components/sections/CollectionSection';
import {
  IS_SUPPORTED_BY_RARIBLE,
  MAP_COIN_TO_RARIBLE,
  MAP_NETWORK_TO_RARIBLE,
  SUPPORTED_RARIBLE_NETWORKS,
} from '@dexkit/ui/modules/nft/constants/marketplaces';
import {
  COLLECTION_ASSETS_FROM_ORDERBOOK,
  GET_ASSET_LIST_FROM_COLLECTION,
  GET_COLLECTION_DATA,
  GET_COLLECTION_STATS,
  useCollection,
} from '@dexkit/ui/modules/nft/hooks/collection';
import {
  getApiCollectionData,
  getCollectionAssetsDexKitApi,
  getCollectionAssetsFromOrderbook,
  getCollectionData,
  getSyncCollectionData,
} from '@dexkit/ui/modules/nft/services/collection';
import { getRariCollectionStats } from '@dexkit/ui/modules/nft/services/rarible';
import { getProviderBySlug } from '@dexkit/ui/services/providers';

const CollectionPage: NextPage<{
  enableDarkblock: boolean;
  isLock: boolean;
  disableSecondarySells: boolean;
}> = ({
  enableDarkblock,
  disableSecondarySells,
  isLock,
}: {
  enableDarkblock: boolean;
  disableSecondarySells: boolean;
  isLock: boolean;
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

  const [buyNowChecked, setBuyNowChecked] = useState(false);

  const handleChangeBuyNow = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBuyNowChecked(event.target.checked);
  };

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleCloseDrawer = () => setIsFiltersOpen(false);

  const renderSidebar = (onClose?: () => void) => {
    return (
      <SidebarFilters
        title={<FormattedMessage id="filters" defaultMessage="Filters" />}
        onClose={onClose}
      >
        <SidebarFiltersContent>
          <Stack spacing={1}>
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
            <Typography>
              <FormattedMessage defaultMessage={'Status'} id={'status'} />
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={buyNowChecked}
                    onChange={handleChangeBuyNow}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                }
                label={
                  <FormattedMessage defaultMessage={'Buy now'} id={'buy.now'} />
                }
              />
            </FormGroup>
            <Typography>
              <FormattedMessage defaultMessage={'Traits'} id={'traits'} />
            </Typography>
            <CollectionTraits address={address as string} chainId={chainId} />
          </Stack>
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

  const collectionPage = (
    <>
      <NextSeo title={collection?.name || ''} />
      {renderDrawer()}

      <CollectionSection
        section={{
          type: 'collection',
          config: {
            address: address as string,
            network: network as string,
            hideFilters: isDesktop,
            hideAssets: false,
            hideDrops: !isDrop,
            hideHeader: false,
            showPageHeader: true,
            isLock,
            enableDarkblock,
            disableSecondarySells,
            showCollectionStats: true,
            showSidebarOnDesktop: true,
          },
        }}
      />
    </>
  );
  if (disableSecondarySells) {
    return (
      <MainLayout>
        <Container>{collectionPage}</Container>
      </MainLayout>
    );
  } else {
    return <MainLayout disablePadding>{collectionPage}</MainLayout>;
  }
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
  const chainId = NETWORK_FROM_SLUG(network)?.chainId;

  let isTw;
  let key: any[] = [GET_COLLECTION_DATA, address as string, chainId];

  try {
    if (chainId) {
      const sdk = new ThirdwebSDK(chainId as number, {
        secretKey: process.env.THIRDWEB_API_KEY_SECRET,
      });

      const twContract = await sdk.getContract(address as string);

      isTw = twContract.abi.find((m) => m.name === 'contractVersion');

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
      }
    }
  } catch {}

  if (!isTw) {
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

  const appCollection = configResponse.appConfig.collections?.find(
    (c) =>
      c.chainId === collection?.chainId &&
      isAddressEqual(c.contractAddress, collection?.address),
  );

  const isLock = await getIsLockAsync({ chainId: chainId, provider, address });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      ...configResponse,
      enableDarkblock,
      disableSecondarySells: appCollection?.disableSecondarySells === true,
      isLock,
    },
    revalidate: REVALIDATE_PAGE_TIME,
  };
};
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking', // false or 'blocking'
  };
}

export default Wrapper;
