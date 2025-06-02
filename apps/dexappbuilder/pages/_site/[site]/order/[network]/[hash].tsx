import {
  getChainIdFromSlug,
  getNetworkSlugFromChainId,
} from '@dexkit/core/utils/blockchain';
import Container from '@mui/material/Container';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import type { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

import { ChainId } from '@dexkit/core/constants';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { Grid, Skeleton } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import { REVALIDATE_PAGE_TIME } from 'src/constants';
import MainLayout from '../../../../../src/components/layouts/main';

import OrderLeftSection from '../../../../../src/modules/orders/components/OrderLeftSection';
import OrderRightSection from '../../../../../src/modules/orders/components/OrderRightSection';
import { getAppConfig } from '../../../../../src/services/app';

import {
  GET_NFT_ORDERS,
  useAsset,
  useOrderBook,
} from '@dexkit/ui/modules/nft/hooks';
import { getOrderbookOrders } from '@dexkit/ui/modules/nft/services';
import { fetchAssetForQueryClient } from '@dexkit/ui/modules/nft/services/query';
import { OrderBookItem } from '@dexkit/ui/modules/nft/types';
import { TraderOrderFilter } from '../../../../../src/utils/types';

const OrderDetail: NextPage = () => {
  const router = useRouter();
  const { hash, network } = router.query;
  const chainId = getChainIdFromSlug(network as string)?.chainId;

  const { formatMessage } = useIntl();
  const query = useOrderBook({
    chainId,
    nonce: hash as string,
  });

  const firstOrder = useMemo(() => {
    if (query.data?.orders?.length === 1) {
      return query.data?.orders[0];
    }
  }, [query]);

  const { data: asset } = useAsset(
    firstOrder?.nftToken,
    firstOrder?.nftTokenId,
  );

  return (
    <Container>
      <Grid container spacing={2} justifyContent="center">
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
                  asset?.chainId,
                )}/${firstOrder?.nftToken}`,
              },
              {
                caption: `${asset?.collectionName} #${asset?.id}`,
                uri: `/asset/${getNetworkSlugFromChainId(
                  asset?.chainId,
                )}/${firstOrder?.nftToken}/${firstOrder?.nftTokenId}`,
              },
              {
                caption: `${formatMessage({
                  id: 'order',
                  defaultMessage: 'Order',
                })} #${firstOrder?.order?.nonce.substring(
                  firstOrder?.order.nonce.length - 8,
                )}`,
                uri: `/order/${getNetworkSlugFromChainId(
                  asset?.chainId,
                )}/${firstOrder?.order?.nonce}`,
                active: true,
              },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          {firstOrder && (
            <OrderLeftSection
              address={firstOrder?.nftToken}
              id={firstOrder?.nftTokenId}
            />
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <OrderRightSection order={firstOrder} />
        </Grid>
      </Grid>
    </Container>
  );
};

type Params = {
  hash?: string;
  network?: string;
  site?: string;
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  if (params) {
    const { hash, network, site } = params;
    const configResponse = await getAppConfig(site, 'home');

    const chainId = getChainIdFromSlug(network || '')?.chainId;

    const orderFilter: TraderOrderFilter = { chainId, nonce: hash };

    const queryClient = new QueryClient();

    const orders = await getOrderbookOrders({
      chainId,
      nonce: hash,
    });

    let order: OrderBookItem | undefined;

    if (orders?.orders.length === 1) {
      order = orders?.orders[0];
    } else {
      return {
        notFound: true,
      };
    }

    if (order) {
      const item = {
        contractAddress: order.nftToken || '',
        tokenId: order.nftTokenId || '',
        chainId: chainId as ChainId,
      };
      await fetchAssetForQueryClient({ queryClient, item });
    }

    await queryClient.prefetchQuery(
      [GET_NFT_ORDERS, orderFilter],
      async () => orders,
    );

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        ...configResponse,
      },
      revalidate: REVALIDATE_PAGE_TIME,
    };
  } else {
    return {
      props: {},
    };
  }
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking', // false or 'blocking'
  };
}

(OrderDetail as any).getLayout = function getLayout(page: any) {
  return <MainLayout>{page}</MainLayout>;
};

export default OrderDetail;
