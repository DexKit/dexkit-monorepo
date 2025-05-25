import { DexkitApiProvider } from '@dexkit/core/providers';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { myAppsApi } from '@dexkit/ui/constants/api';
import CommerceContextProvider from '@dexkit/ui/modules/commerce/components/CommerceContextProvider';
import ProductContent from '@dexkit/ui/modules/commerce/components/CommerceSection/ProductContent';
import useUserProduct from '@dexkit/ui/modules/commerce/hooks/useUserProduct';
import { Container, Grid } from '@mui/material';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import {
  GetStaticPaths,
  GetStaticPathsContext,
  GetStaticProps,
  GetStaticPropsContext,
} from 'next';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import AuthMainLayout from 'src/components/layouts/authMain';
import { getAppConfig } from 'src/services/app';

import { z } from 'zod';

const validEmail = z.string().email();

export interface CommerceProductProps {
  siteId?: number;
}

export default function CommerceProduct({ siteId }: CommerceProductProps) {
  const router = useRouter();

  const { id } = router.query;

  const { data: product } = useUserProduct({ id: (id as string) ?? '' });

  const breadcrumbs = useMemo(() => {
    const els: {
      caption: React.ReactNode;
      uri: string;
      active?: boolean;
    }[] = [
      {
        caption: <FormattedMessage id="home" defaultMessage="Home" />,
        uri: `/`,
      },
    ];

    if (product) {
      if (product.category) {
        els.push({
          caption: product?.category.name,
          uri: `/c/category/${product?.category.id}`,
        });
      }

      els.push({
        caption: product?.name,
        uri: `/c/product/${product.id}`,
        active: true,
      });
    }

    return els;
  }, [product]);

  return (
    <>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <PageHeader breadcrumbs={breadcrumbs} />
          </Grid>

          <Grid item xs={12}>
            <ProductContent productId={(id as string) ?? ''} disableHeader />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

(CommerceProduct as any).getLayout = function getLayout(page: any) {
  return (
    <AuthMainLayout noSsr>
      <DexkitApiProvider.Provider value={{ instance: myAppsApi }}>
        <CommerceContextProvider>{page}</CommerceContextProvider>
      </DexkitApiProvider.Provider>
    </AuthMainLayout>
  );
};

type Params = {
  site?: string;
  id?: string;
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  const queryClient = new QueryClient();

  const configResponse = await getAppConfig(params?.site, 'home');

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      ...configResponse,
      id: params?.id,
      siteId: configResponse?.siteId ?? null,
    },
    revalidate: 300,
  };
};

export const getStaticPaths: GetStaticPaths<
  Params
> = ({}: GetStaticPathsContext) => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};
