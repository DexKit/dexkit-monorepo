import WizardCreateAssetContainer from '@/modules/contract-wizard/components/WizardCreateAssetContainer';
import { QueryClient, dehydrate } from '@tanstack/react-query';

import { AuthProvider } from '@dexkit/ui/providers/authProvider';
import type {
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
import { getAppConfig } from 'src/services/app';

const WizardCreateAssetPage: NextPage = () => {
  const router = useRouter();
  const { address, network } = router.query;
  const appConfig = useAppConfig();
  const { formatMessage } = useIntl();
  return (
    <AuthProvider>
      <NextSeo
        title={formatMessage({
          id: 'contract.wizard',
          defaultMessage: 'Contract Wizard',
        })}
        description={formatMessage({
          id: 'contract.wizard.description',
          defaultMessage:
            'Easily create your digital collectibles (NFTs) using AI image generation tools and create them on the blockchain of your choice in one click.',
        })}
        openGraph={{
          title: 'NFT creator with AI tool.',
          description:
            'Generate NFT collections by drawing each piece using natural language and create them on the blockchain of your choice within the same app.',
          images: [
            {
              url: `${appConfig.domain}/assets/images/create-nft-collection-wizard.jpg`,
              width: 800,
              height: 600,
              alt: 'DexKit images list',
              type: 'image/jpeg',
            },
          ],
        }}
      />
      <MainLayout>
        <WizardCreateAssetContainer
          address={address as string}
          network={network as string}
        />
      </MainLayout>
    </AuthProvider>
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

export default WizardCreateAssetPage;
