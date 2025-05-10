import AssetStoreStepperContainer from '@/modules/wizard/components/steppers/containers/AssetStoreStepperContainer';
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

export const AssetStoreQuickWizard: NextPage = () => {
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
          id: 'quick.store.builder.title',
          defaultMessage:
            'Create a NFT store app in seconds using our quick app builder',
        })}
        description={formatMessage({
          id: 'quick.swap.wizard.description',
          defaultMessage:
            'Create a NFT store for your account. Share your store to users easily buy the offers you post. A dedicated store to show your NFTs',
        })}
        openGraph={{
          title: 'Create a NFT store app in seconds using our quick wizar',
          description:
            'Create a NFT store for your account. Share your store to users easily buy the offers you post. A dedicated store to show your NFTs',
        }}
      />
      <ConfigWizardProvider>
        <AuthProvider>
          <MainLayout>
            <AssetStoreStepperContainer site={site} />
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

export default AssetStoreQuickWizard;
