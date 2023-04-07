import Container from '@mui/material/Container';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import type { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import { useRouter } from 'next/router';

import { Grid, Skeleton } from '@mui/material';
import MainLayout from '../../../../../../src/components/layouts/main';

import { fetchAssetForQueryClient } from '../../../../../../src/services/nft';

import {
  BEST_SELL_ORDER_RARIBLE,
  useAsset,
  useAssetMetadata,
} from '../../../../../../src/hooks/nft';
import AssetLeftSection from '../../../../../../src/modules/nft/components/AssetLeftSection';
import AssetRightSection from '../../../../../../src/modules/nft/components/AssetRightSection';

import AssetHead from '../../../../../../src/modules/nft/components/AssetHead';

import { ChainId } from '@dexkit/core/constants';
import { NextSeo } from 'next-seo';
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

const AssetDetailPage: NextPage = () => {
  const router = useRouter();

  const { address, id } = router.query;

  const { data: asset } = useAsset(address as string, id as string);

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
                  caption: asset?.collectionName ? (
                    asset?.collectionName
                  ) : (
                    <Skeleton />
                  ),
                  uri: `/collection/${getNetworkSlugFromChainId(
                    asset?.chainId
                  )}/${address}`,
                },
                {
                  caption: `${asset?.collectionName} #${truncateErc1155TokenId(
                    asset?.id
                  )}`,
                  uri: `/asset/${getNetworkSlugFromChainId(
                    asset?.chainId
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
          `${MAP_NETWORK_TO_RARIBLE[network]}:${address}:${id}`
        );
        await queryClient.prefetchQuery(
          [BEST_SELL_ORDER_RARIBLE, network, address, id],
          async () => {
            return data;
          }
        );
      }
    } catch (e) {
      console.log(e);
    }

    return {
      props: { dehydratedState: dehydrate(queryClient), ...configResponse },
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
