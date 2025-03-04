import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { Collection } from '@dexkit/ui/modules/nft/types';
import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import { Container, Grid } from '@mui/material';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import type { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { FormattedMessage, useIntl } from 'react-intl';
import { REVALIDATE_PAGE_TIME } from 'src/constants';
import MainLayout from '../../../src/components/layouts/main';
import CollectionFromConfigCard from '../../../src/modules/nft/components/CollectionFromConfig';
import { getAppConfig } from '../../../src/services/app';

interface Props {
  appConfig: AppConfig;
}

const Collections: NextPage<Props> = ({ appConfig }) => {
  const { formatMessage } = useIntl();
  return (
    <>
      <NextSeo
        title={formatMessage({
          id: 'collections',
          defaultMessage: 'Collections',
        })}
      />
      <MainLayout>
        <Container>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <PageHeader
                breadcrumbs={[
                  {
                    caption: (
                      <FormattedMessage id="home" defaultMessage="Home" />
                    ),
                    uri: '/',
                  },
                  {
                    caption: (
                      <FormattedMessage
                        id="collections"
                        defaultMessage="Collections"
                      />
                    ),
                    uri: '/collections',
                    active: true,
                  },
                ]}
              />
            </Grid>
            {appConfig.collections?.map((collection, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <CollectionFromConfigCard
                  totalSupply={0}
                  collection={
                    {
                      ...collection,
                      name: collection.name,
                      address: collection.contractAddress,
                      symbol: collection.name,
                      chainId: collection.chainId,
                    } as Collection
                  }
                  backgroundImageUrl={collection.backgroundImage}
                  variant="simple"
                  title={collection.name}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </MainLayout>
    </>
  );
};

type Params = {
  site?: string;
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  const queryClient = new QueryClient();

  const configResponse = await getAppConfig(params?.site, 'home');

  /*  for (let collection of collectionListJson.collections) {
    const provider = getProviderByChainId(collection.chainId);

    await provider?.ready;

    if (provider) {
      const data = await getCollectionData(
        provider,
        collection.contractAddress
      );

      await queryClient.prefetchQuery(
        [GET_COLLECTION_DATA, collection.contractAddress, collection.chainId],
        async () => data
      );
    }
  }*/

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      ...configResponse,
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

export default Collections;
