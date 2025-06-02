import SwapStepperContainer from '@/modules/wizard/components/steppers/containers/SwapStepperContainer';
import { AuthProvider } from '@dexkit/ui/providers/authProvider';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import {
  GetStaticPaths,
  GetStaticPathsContext,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import MainLayout from 'src/components/layouts/main';
import { useWhitelabelConfigQuery } from 'src/hooks/whitelabel';
import { ConfigWizardProvider } from 'src/providers/configWizardProvider';
import { getAppConfig } from 'src/services/app';

export const SwapQuickWizard: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query as { slug?: string };
  const { formatMessage } = useIntl();
  const { data: site } = useWhitelabelConfigQuery({
    slug,
  });
  return (
    <>
      <NextSeo
        title={formatMessage({
          id: 'quick.swap.builder.title',
          defaultMessage:
            'Create a crypto aggregator app in seconds using our quick app builder',
        })}
        description={formatMessage({
          id: 'quick.swap.builder.description',
          defaultMessage:
            'Create a crypto aggregator for your token or to earn fees for people trading on it. You can configure it to match the brand of your project and facilitate for yours trading',
        })}
        openGraph={{
          title:
            'Create a crypto aggregator app in seconds using our quick app builder',
          description:
            'Create a crypto aggregator for your token or to earn fees for people trading on it. You can configure it to match the brand of your project and facilitate for yours trading',
        }}
      />
      <ConfigWizardProvider>
        <AuthProvider>
          <MainLayout noSsr={true}>
            <SwapStepperContainer site={site} />
          </MainLayout>
        </AuthProvider>
      </ConfigWizardProvider>
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
  const configResponse = await getAppConfig(params?.site, 'no-page-defined');

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      ...configResponse,
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

export default SwapQuickWizard;
