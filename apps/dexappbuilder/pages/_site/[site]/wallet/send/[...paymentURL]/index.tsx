import SendContainer from '@dexkit/ui/modules/wallet/components/containers/SendContainer';
import type { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';

import MainLayout from 'src/components/layouts/main';
import { REVALIDATE_PAGE_TIME } from 'src/constants';
import { getAppConfig } from 'src/services/app';

interface Props {
  paymentURL: string[];
}

const Send: NextPage<Props> = ({ paymentURL }: Props) => {
  return <SendContainer paymentURL={paymentURL[0]} />;
};

type Params = {
  site?: string;
  paymentURL?: string[];
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  if (params !== undefined) {
    const { site, paymentURL } = params;

    const configResponse = await getAppConfig(site, '');

    return {
      props: { ...configResponse, paymentURL },
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

(Send as any).getLayout = function getLayout(page: any) {
  return <MainLayout noSsr>{page}</MainLayout>;
};

export default Send;
