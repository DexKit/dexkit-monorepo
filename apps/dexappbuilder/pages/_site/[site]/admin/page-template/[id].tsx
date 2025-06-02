import PageTemplateContainer from '@/modules/wizard/components/pageTemplate/PageTemplateContainer';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import {
  GetStaticPaths,
  GetStaticPathsContext,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from 'next';
import { useRouter } from 'next/router';
import AuthMainLayout from 'src/components/layouts/authMain';
import { usePageTemplateByIdQuery } from 'src/hooks/whitelabel';
import { getAppConfig } from 'src/services/app';

export const PageTemplateEdit: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: pageTemplate } = usePageTemplateByIdQuery({
    id: id as string,
  });

  return (
    (pageTemplate && <PageTemplateContainer pageTemplate={pageTemplate} />) ||
    null
  );
};

(PageTemplateEdit as any).getLayout = function getLayout(page: any) {
  return <AuthMainLayout noSsr>{page}</AuthMainLayout>;
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

export default PageTemplateEdit;
