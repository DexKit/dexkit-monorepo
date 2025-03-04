import Container from '@mui/material/Container';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import type { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import { useRouter } from 'next/router';

import { Grid, Skeleton } from '@mui/material';
import MainLayout from '../../../../../../src/components/layouts/main';

import { fetchAssetForQueryClient } from '@dexkit/ui/modules/nft/services/query';

import AssetHead from '@dexkit/ui/modules/nft/components/AssetHead';

import { DARKBLOCK_SUPPORTED_CHAIN_IDS } from '@/modules/wizard/constants';
import { getIntegrationData } from '@/modules/wizard/services/integrations';
import { ChainId, MY_APPS_ENDPOINT } from '@dexkit/core/constants';
import { NETWORK_FROM_SLUG } from '@dexkit/core/constants/networks';
import { ipfsUriToUrl, truncateAddress } from '@dexkit/core/utils';
import {
  getChainIdFromSlug,
  getNetworkSlugFromChainId,
} from '@dexkit/core/utils/blockchain';
import axios from 'axios';
import { NextSeo } from 'next-seo';
import { FormattedMessage } from 'react-intl';
import { REVALIDATE_PAGE_TIME } from 'src/constants';

import AssetSection from '@dexkit/dexappbuilder-viewer/components/sections/AssetSection';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import {
  IS_SUPPORTED_BY_RARIBLE,
  MAP_NETWORK_TO_RARIBLE,
  SUPPORTED_RARIBLE_NETWORKS,
} from '@dexkit/ui/modules/nft/constants/marketplaces';
import {
  BEST_SELL_ORDER_RARIBLE,
  useAsset,
  useAssetMetadata,
} from '@dexkit/ui/modules/nft/hooks';
import { getRariAsset } from '@dexkit/ui/modules/nft/services/rarible';
import { truncateErc1155TokenId } from '@dexkit/ui/modules/nft/utils';

import { getAppConfig } from '../../../../../../src/services/app';

const AssetDetailPage: NextPage<any> = ({
  enableDarkblock,
}: {
  enableDarkblock: boolean;
}) => {
  const router = useRouter();

  const { address, id } = router.query;

  const { data: asset, isLoading } = useAsset(address as string, id as string);

  const { data: metadata } = useAssetMetadata(asset);

  return (
    <>
      <NextSeo
        title={`${metadata?.name || ''}`}
        description={`${metadata?.description || ''}`}
        openGraph={{
          title: metadata?.name || '',
          description: metadata?.description || '',
          type: 'website',
          images: [
            {
              url: ipfsUriToUrl(metadata?.image || '') || '',
              width: 850,
              height: 650,
              alt: `${metadata?.name || ''} image`,
            },
          ],
        }}
      />

      <AssetHead address={address as string} id={id as string} />
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <PageHeader
              breadcrumbs={[
                {
                  caption: <FormattedMessage id="home" defaultMessage="Home" />,
                  uri: '/',
                },
                {
                  caption: isLoading ? (
                    <Skeleton />
                  ) : (
                    asset?.collectionName || truncateAddress(address as string)
                  ),

                  uri: `/collection/${getNetworkSlugFromChainId(
                    asset?.chainId,
                  )}/${address}`,
                },
                {
                  caption: `${asset?.collectionName} #${truncateErc1155TokenId(
                    asset?.id,
                  )}`,
                  uri: `/asset/${getNetworkSlugFromChainId(
                    asset?.chainId,
                  )}/${address}/${id}`,
                  active: true,
                },
              ]}
            />
          </Grid>
          <AssetSection
            section={{
              type: 'asset-section',
              config: {
                address: address as string,
                network: getNetworkSlugFromChainId(asset?.chainId) || '',
                tokenId: id as string,
                enableDarkblock: enableDarkblock,
              },
            }}
          />
        </Grid>
      </Container>
    </>
  );
};

type Params = {
  address?: string;
  id?: string;
  network?: string;
  site?: string;
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  if (params !== undefined) {
    const { address, id, network, site } = params;

    const configResponse = await getAppConfig(site, 'home');

    const queryClient = new QueryClient();
    const item = {
      contractAddress: address || '',
      tokenId: id || '',
      chainId: getChainIdFromSlug(network || '')?.chainId as ChainId,
    };
    await fetchAssetForQueryClient({ queryClient, item });

    try {
      if (
        network &&
        IS_SUPPORTED_BY_RARIBLE(network as SUPPORTED_RARIBLE_NETWORKS)
      ) {
        const { data } = await getRariAsset(
          `${
            MAP_NETWORK_TO_RARIBLE[network as SUPPORTED_RARIBLE_NETWORKS]
          }:${address}:${id}`,
        );
        await queryClient.prefetchQuery(
          [BEST_SELL_ORDER_RARIBLE, network, address, id],
          async () => {
            return data;
          },
        );
      }
    } catch (e) {
      console.log(e);
    }
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
        if (darkBlock?.settings?.enableDarkblock) {
          enableDarkblock = true;
        }
      }
    } catch {}

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        ...configResponse,
        enableDarkblock: enableDarkblock,
      },
      revalidate: REVALIDATE_PAGE_TIME,
    };
  }

  return {
    props: {},
  };
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking', // false or 'blocking'
  };
}

(AssetDetailPage as any).getLayout = function getLayout(page: any) {
  return <MainLayout>{page}</MainLayout>;
};

export default AssetDetailPage;
