import { useRouter } from 'next/router';

import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { Container, Grid } from '@mui/material';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { GetStaticPropsContext } from 'next';
import { FormattedMessage } from 'react-intl';
import MainLayout from 'src/components/layouts/main';
import { getAppConfig } from 'src/services/app';

import OrderWidget from '@dexkit/exchange/components/OrderWidget';
import { EXCHANGE_NOTIFICATION_TYPES } from '@dexkit/exchange/constants/messages';
import { useZrxOrderbookOrder } from '@dexkit/exchange/hooks/zrx';
import { useZrxCancelOrderMutation } from '@dexkit/exchange/hooks/zrx/useZrxCancelOrderMutation';
import { useDexKitContext, useExecuteTransactionsDialog } from '@dexkit/ui';
import { ZrxOrder } from '@dexkit/ui/modules/swap/types';
import { AppNotificationType } from '@dexkit/ui/types';
import { useCallback } from 'react';
import { REVALIDATE_PAGE_TIME } from 'src/constants';

export default function ExchangeOrderPage() {
  const router = useRouter();

  const { hash, network } = router.query;

  const { chainId, account, provider } = useWeb3React();

  const { createNotification } = useDexKitContext();

  const orderQuery = useZrxOrderbookOrder({
    chainId: chainId,
    hash: hash as string,
  });

  const cancelOrderMutation = useZrxCancelOrderMutation();

  const transactionDialog = useExecuteTransactionsDialog();

  const handleCancelOrder = useCallback(
    async (
      order: ZrxOrder,
      baseTokenSymbol?: string,
      quoteTokenSymbol?: string,
      baseTokenAmount?: string,
      quoteTokenAmount?: string,
    ) => {
      transactionDialog.execute([
        {
          action: async () => {
            const result = await cancelOrderMutation.mutateAsync({
              order,
              chainId,
              provider,
            });
            const subType = 'orderCancelled';
            const messageType = EXCHANGE_NOTIFICATION_TYPES[
              subType
            ] as AppNotificationType;

            createNotification({
              type: 'transaction',
              icon: messageType.icon,
              subtype: subType,
              metadata: {
                hash: result,
                chainId: chainId,
              },
              values: {
                sellAmount: baseTokenAmount || ' ',
                sellTokenSymbol: baseTokenSymbol?.toUpperCase() || ' ',
                buyAmount: quoteTokenAmount || ' ',
                buyTokenSymbol: quoteTokenSymbol?.toUpperCase() || ' ',
              },
            });

            return { hash: result };
          },
          icon: 'receipt',
          title: {
            id: 'cancel.token.order',
            defaultMessage: 'Cancel token order',
          },
        },
      ]);
    },
    [chainId, provider],
  );

  return (
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
                caption: (
                  <FormattedMessage
                    id="token.drop"
                    defaultMessage="Token Drop"
                  />
                ),
                uri: '/drop/token',
              },
            ]}
          />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={5}>
              {orderQuery.data ? (
                <OrderWidget
                  onCancel={handleCancelOrder}
                  account={account}
                  record={orderQuery.data}
                  provider={provider}
                  chainId={chainId}
                />
              ) : undefined}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

(ExchangeOrderPage as any).getLayout = function getLayout(page: any) {
  return <MainLayout>{page}</MainLayout>;
};

type Params = {
  site?: string;
  address?: string;
  network?: string;
};

export const getStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  if (params !== undefined) {
    const { address, network, site } = params;

    const configResponse = await getAppConfig(site, 'home');

    const queryClient = new QueryClient();

    return {
      props: { dehydratedState: dehydrate(queryClient), ...configResponse },
      revalidate: REVALIDATE_PAGE_TIME,
    };
  }
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking', // false or 'blocking'
  };
}
