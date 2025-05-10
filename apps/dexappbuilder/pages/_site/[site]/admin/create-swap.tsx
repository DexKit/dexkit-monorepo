import { CreateWizardContainer } from '@/modules/wizard/components/containers/CreateWizardContainer';
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
import { useAppConfig } from 'src/hooks/app';
import { ConfigWizardProvider } from 'src/providers/configWizardProvider';
import { getAppConfig } from 'src/services/app';

export const WizardCreatePage: NextPage = () => {
  const router = useRouter();
  const { clone } = router.query as { clone?: string };
  const { formatMessage } = useIntl();
  const appConfig = useAppConfig();
  return (
    <>
      <NextSeo
        title={formatMessage({
          id: 'create.swap.title',
          defaultMessage: 'Create your crypto site/swap in seconds.',
        })}
        description={formatMessage({
          id: 'admin.setup.description',
          defaultMessage:
            'Start your own crypto site/swap in seconds. Start now being a crypto enterpreneur in two steps: create wallet, fill name of your swap site and you are ready to go.',
        })}
        openGraph={{
          title: 'Create your crypto site/swap in seconds.',
          description:
            'Start your own crypto site/swap in seconds. Start now being a crypto enterpreneur in two steps: create wallet, fill name of your swap and you are ready to go.',
          images: [
            {
              url: `${appConfig.domain}/assets/images/seo_create.jpg`,
              width: 800,
              height: 600,
              alt: 'DexKit create swap wizard',
              type: 'image/jpeg',
            },
          ],
        }}
      />
      <ConfigWizardProvider>
        <AuthProvider>
          <MainLayout noSsr={true}>
            <CreateWizardContainer slug={clone} isSwapWizard={true} />
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

export default WizardCreatePage;
