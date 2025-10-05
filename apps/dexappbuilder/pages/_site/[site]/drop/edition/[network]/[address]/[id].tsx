import Container from '@mui/material/Container';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import type { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import { useRouter } from 'next/router';

import { Box, Grid, Skeleton, Typography } from '@mui/material';

import AssetHead from '@dexkit/ui/modules/nft/components/AssetHead';
import AssetLeftSection from '@dexkit/ui/modules/nft/components/AssetLeftSection';

import { ChainId } from '@dexkit/core/constants';
import {
  NETWORK_FROM_SLUG,
  NETWORK_SLUG,
} from '@dexkit/core/constants/networks';
import { ipfsUriToUrl, truncateAddress } from '@dexkit/core/utils';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import {
  BEST_SELL_ORDER_RARIBLE,
  useAsset,
  useAssetMetadata,
} from '@dexkit/ui/modules/nft/hooks';
import { truncateErc1155TokenId } from '@dexkit/ui/modules/nft/utils';
import { NextSeo } from 'next-seo';
import { FormattedMessage } from 'react-intl';
import MainLayout from 'src/components/layouts/main';
import { REVALIDATE_PAGE_TIME } from 'src/constants';

import ThirdwebV4Provider from '@/modules/contract-wizard/provider/ThirdwebV4Provider';
import { DropEditionListSection } from '@dexkit/dexappbuilder-viewer/components/sections/DropEditionListSection';
import EditionDropSection from '@dexkit/dexappbuilder-viewer/components/sections/EditionDropSection';
import {
  IS_SUPPORTED_BY_RARIBLE,
  MAP_NETWORK_TO_RARIBLE,
  SUPPORTED_RARIBLE_NETWORKS,
} from '@dexkit/ui/modules/nft/constants/marketplaces';
import { fetchAssetForQueryClient } from '@dexkit/ui/modules/nft/services/query';
import { getRariAsset } from '@dexkit/ui/modules/nft/services/rarible';
import { getAppConfig } from 'src/services/app';

const AssetDetailPage: NextPage = () => {
  const router = useRouter();

  const { address, id, network } = router.query;

  const { data: asset, isLoading } = useAsset(address as string, id as string);

  const { data: metadata } = useAssetMetadata(asset);

  return (
    <>
      <NextSeo
        title={`Edition drop ${metadata?.name || ''}`}
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
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Grid container spacing={2}>
          <Grid size={12}>
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

                  uri: `/collection/${NETWORK_SLUG(asset?.chainId)}/${address}`,
                },
                {
                  caption: `${asset?.collectionName} #${truncateErc1155TokenId(
                    asset?.id,
                  )}`,
                  uri: `/asset/${NETWORK_SLUG(
                    asset?.chainId,
                  )}/${address}/${id}`,
                },
                {
                  caption: `Drop ${asset?.collectionName} #${truncateErc1155TokenId(
                    asset?.id,
                  )}`,
                  uri: `drop/edition/${NETWORK_SLUG(
                    asset?.chainId,
                  )}/${address}/${id}`,
                  active: true,
                },
              ]}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <AssetLeftSection address={address as string} id={id as string} />
          </Grid>
          <Grid size={{ xs: 12, sm: 8 }}>
            <ThirdwebV4Provider network={network as string}>
              <Box py={2}>
                <EditionDropSection
                  section={{
                    type: 'edition-drop-section',
                    config: {
                      network: NETWORK_SLUG(asset?.chainId) || '',
                      tokenId: id as string,
                      address: address as string,
                    },
                  }}
                ></EditionDropSection>
              </Box>
            </ThirdwebV4Provider>
          </Grid>
          <Grid size={12}>
            <Typography variant="h5">
              <FormattedMessage
                id="drops.of.same.collection"
                defaultMessage={'Drops of same collection'}
              />
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12}>
            <DropEditionListSection
              section={{
                type: 'edition-drop-list-section',
                config: {
                  network: network as string,
                  address: address as string,
                },
              }}
            />
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
      chainId: NETWORK_FROM_SLUG(network || '')?.chainId as ChainId,
    };
    await fetchAssetForQueryClient({ queryClient, item });

    try {
      if (
        network &&
        IS_SUPPORTED_BY_RARIBLE(network as SUPPORTED_RARIBLE_NETWORKS)
      ) {
        const { data } = await getRariAsset(
          `${MAP_NETWORK_TO_RARIBLE[network as SUPPORTED_RARIBLE_NETWORKS]
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

    return {
      props: { dehydratedState: dehydrate(queryClient), ...configResponse },
      revalidate: REVALIDATE_PAGE_TIME,
    };
  }

  return {
    props: {},
    revalidate: REVALIDATE_PAGE_TIME,
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
