import Container from '@mui/material/Container';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import type { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import { useRouter } from 'next/router';

import { Grid, NoSsr, Skeleton } from '@mui/material';
import MainLayout from '../../../../../../src/components/layouts/main';

import {
  BEST_SELL_ORDER_RARIBLE,
  useAsset,
  useAssetMetadata,
} from '../../../../../../src/hooks/nft';
import AssetLeftSection from '../../../../../../src/modules/nft/components/AssetLeftSection';
import AssetRightSection from '../../../../../../src/modules/nft/components/AssetRightSection';
import { fetchAssetForQueryClient } from '../../../../../../src/services/nft';

import AssetHead from '../../../../../../src/modules/nft/components/AssetHead';

import DarkblockWrapper from '@/modules/wizard/components/DarkblockWrapper';
import { DARKBLOCK_SUPPORTED_CHAIN_IDS } from '@/modules/wizard/constants';
import { getIntegrationData } from '@/modules/wizard/services/integrations';
import { ChainId, MY_APPS_ENDPOINT } from '@dexkit/core/constants';
import { NETWORK_FROM_SLUG } from '@dexkit/core/constants/networks';
import { truncateAddress } from '@dexkit/core/utils';
import axios from 'axios';
import { NextSeo } from 'next-seo';
import { Suspense } from 'react';
import { FormattedMessage } from 'react-intl';
import { PageHeader } from '../../../../../../src/components/PageHeader';
import { NETWORK_ID } from '../../../../../../src/constants/enum';
import { MAP_NETWORK_TO_RARIBLE } from '../../../../../../src/constants/marketplaces';
import { getAppConfig } from '../../../../../../src/services/app';
import { getRariAsset } from '../../../../../../src/services/rarible';
import {
  getChainIdFromSlug,
  getNetworkSlugFromChainId,
} from '../../../../../../src/utils/blockchain';
import { ipfsUriToUrl } from '../../../../../../src/utils/ipfs';
import { truncateErc1155TokenId } from '../../../../../../src/utils/nfts';

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
          <Grid item xs={12} sm={4}>
            <AssetLeftSection address={address as string} id={id as string} />
          </Grid>
          <Grid item xs={12} sm={8}>
            <AssetRightSection address={address as string} id={id as string} />
            {true && (
              <NoSsr>
                <Suspense>
                  <DarkblockWrapper
                    address={address as string}
                    tokenId={id as string}
                    network={getNetworkSlugFromChainId(asset?.chainId) || ''}
                  />
                </Suspense>
              </NoSsr>
            )}
          </Grid>
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
      if (network === NETWORK_ID.Ethereum || network === NETWORK_ID.Polygon) {
        const { data } = await getRariAsset(
          `${MAP_NETWORK_TO_RARIBLE[network]}:${address}:${id}`,
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
      revalidate: 5,
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
